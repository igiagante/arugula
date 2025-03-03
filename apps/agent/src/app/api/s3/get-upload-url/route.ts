import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "arugula-store";

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();

    // Generate a unique file key
    const fileExtension = fileName.split(".").pop();
    const fileKey = `${uuidv4()}.${fileExtension}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, {
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
