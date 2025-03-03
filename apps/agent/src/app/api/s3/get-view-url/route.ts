import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "arugula-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get("key");

    if (!fileKey) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
