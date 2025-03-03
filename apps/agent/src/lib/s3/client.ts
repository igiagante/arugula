import { S3Client } from "@aws-sdk/client-s3";

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (s3Client) {
    return s3Client;
  }

  s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  return s3Client;
}

export function getS3BucketName(): string {
  return process.env.AWS_S3_BUCKET_NAME || "arugula-store";
}
