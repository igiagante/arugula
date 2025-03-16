import { getS3BucketName, getS3Client } from "@/lib/s3/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const key = (await params).key;

    if (!key) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: getS3BucketName(),
      Key: key,
    });

    // Option 1: Redirect to the signed URL
    const url = await getSignedUrl(getS3Client(), command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error fetching image:", error);
    return new Response(
      `Error fetching image: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}
