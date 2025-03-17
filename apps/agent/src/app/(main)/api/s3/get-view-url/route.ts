import { getS3BucketName, getS3Client } from "@/lib/s3/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get("key");

    console.log("Request URL:", request.url);
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    if (!fileKey) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: getS3BucketName(),
      Key: fileKey,
    });

    const url = await getSignedUrl(getS3Client(), command, {
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
