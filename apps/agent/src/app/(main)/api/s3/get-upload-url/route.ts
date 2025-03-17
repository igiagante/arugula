import { getS3BucketName, getS3Client } from "@/lib/s3/client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();

    // Generate a unique file key
    const fileExtension = fileName.split(".").pop();
    const fileKey = `${uuidv4()}.${fileExtension}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: getS3BucketName(),
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(getS3Client(), putObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return NextResponse.json({ uploadUrl, fileKey });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
