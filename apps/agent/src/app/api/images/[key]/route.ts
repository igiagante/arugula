// apps/agent/src/app/api/images/[key]/route.ts
import { getS3BucketName, getS3Client } from "@/lib/s3/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    // Log for debugging
    console.log(`Fetching image with key: ${params.key}`);
    console.log(`S3 Bucket: ${getS3BucketName()}`);

    const s3Client = getS3Client();
    const key = decodeURIComponent(params.key);

    const command = new GetObjectCommand({
      Bucket: getS3BucketName(),
      Key: key,
    });

    const response = await s3Client.send(command);
    const buffer = await response.Body?.transformToByteArray();

    if (!buffer) {
      console.error("No buffer returned from S3");
      return new Response("Image not found", { status: 404 });
    }

    // Return the image with appropriate headers
    return new Response(buffer, {
      headers: {
        "Content-Type": response.ContentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new Response(
      `Error fetching image: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        status: 500,
      }
    );
  }
}
