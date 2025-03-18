import { createOrganization, createUser, updateUser } from "@/lib/db/queries";
import {
  getOrganizationByHostname,
  getOrganizationById,
} from "@/lib/db/queries/organizations";
import { getUserById } from "@/lib/db/queries/user";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

const updateOnboardingComplete = async (userId: string) => {
  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: {
      onboardingComplete: true,
    },
  });
};

const addUserToOrganization = async (
  userId: string,
  organizationId: string
) => {
  const client = await clerkClient();
  await client.organizations.createOrganizationMembership({
    organizationId,
    userId,
    role: "org:member",
  });
};

async function verifyWebhook(req: Request): Promise<WebhookEvent> {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const wh = new Webhook(SIGNING_SECRET.trim());
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error("Error: Missing Svix headers");
  }

  const body = await req.text();

  return wh.verify(body, {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  }) as WebhookEvent;
}

export async function POST(req: Request) {
  const evt = await verifyWebhook(req);
  console.log("Webhook received:", evt.type);

  if (evt.type === "user.created") {
    try {
      console.log("Creating user with data:", {
        id: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        imageUrl: evt.data.image_url,
      });

      await createUser({
        id: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address ?? "",
        firstName: evt.data.first_name ?? "",
        lastName: evt.data.last_name ?? "",
        imageUrl: evt.data.image_url ?? "",
        orgId: "",
      });

      console.log("User created successfully in database");

      const metadata = evt.data.public_metadata;
      const hostname = metadata?.hostname as string;

      if (hostname) {
        const organization = await getOrganizationByHostname(hostname);

        if (organization) {
          try {
            await addUserToOrganization(evt.data.id, organization.id);
            await updateUser({
              id: evt.data.id,
              orgId: organization.id,
            });
            await updateOnboardingComplete(evt.data.id);
          } catch (err) {
            console.error("Error: Failed to update user in database", err);
            return new Response("Error: Failed to update user in database", {
              status: 500,
            });
          }
        }
      }
    } catch (err) {
      console.error("Error handling user creation:", err);
      throw err;
    }
  }

  if (evt.type === "user.updated") {
    try {
      await updateUser({
        id: evt.data.id,
        firstName: evt.data.first_name ?? "",
        lastName: evt.data.last_name ?? "",
        imageUrl: evt.data.image_url ?? "",
      });
    } catch (err) {
      console.error("Error: Failed to update user in database", err);
      return new Response("Error: Failed to update user in database", {
        status: 500,
      });
    }
  }

  if (evt.type === "organization.created") {
    try {
      const userId = evt.data.created_by;
      if (!userId) {
        throw new Error("Created by user not found");
      }

      const user = await getUserById({ id: userId });
      if (!user) {
        throw new Error("User not found in database");
      }

      // Create organization with slug
      await createOrganization({
        id: evt.data.id,
        name: evt.data.name,
        slug: evt.data.slug,
        domain: user.email.split("@")[1]!, // Keep domain for backwards compatibility
      });

      // Update user's organization
      await updateUser({
        id: user.id,
        orgId: evt.data.id,
      });

      await updateOnboardingComplete(user.id);
    } catch (err) {
      console.error("Error: Failed to create organization in database", err);
      return new Response("Error: Failed to create organization in database", {
        status: 500,
      });
    }
  }

  if (evt.type === "organizationMembership.created") {
    // Add a user to an organization in your database
    const { organization, public_user_data } = evt.data;

    // Get the user from your database
    const user = await getUserById({ id: public_user_data.user_id });

    if (user) {
      // Find the organization in your database
      const org = await getOrganizationById(organization.id);

      if (org) {
        // Connect the user to the organization
        await updateUser({
          id: user.id,
          orgId: org.id,
        });
      }
    }
  }

  return new Response("Webhook received", { status: 200 });
}

// export async function POST(request: Request) {
//   const headersList = await headers();
//   const rawBody = await request.text();

//   try {
//     const secret = process.env.CLERK_WEBHOOK_SECRET;
//     if (!secret) {
//       throw new Error("Missing CLERK_WEBHOOK_SECRET");
//     }

//     // Get the full signature string
//     const svix_signature = headersList.get("svix-signature");
//     if (!svix_signature) {
//       throw new Error("Missing svix-signature header");
//     }

//     // Create webhook instance with trimmed secret
//     const wh = new Webhook(secret.trim());

//     // Construct headers object exactly as received
//     const svixHeaders = {
//       "svix-id": headersList.get("svix-id") || "",
//       "svix-timestamp": headersList.get("svix-timestamp") || "",
//       "svix-signature": svix_signature,
//     };

//     // Log exact values being used (for debugging)
//     console.log("Verification attempt with:", {
//       bodyLength: rawBody.length,
//       timestamp: svixHeaders["svix-timestamp"],
//       signatureStart: svix_signature.substring(0, 20),
//     });

//     // Verify without any body modifications
//     const payload = wh.verify(rawBody, svixHeaders);

//     return new Response(JSON.stringify({ success: true }), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error: any) {
//     console.error("Verification failed:", error.message);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 400,
//     });
//   }
// }
