import { getS3BucketName } from "@/lib/s3/client";

import { getS3Client } from "@/lib/s3/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const s3Client = getS3Client();
    const { key } = await params;
    const command = new GetObjectCommand({
      Bucket: getS3BucketName(),
      Key: decodeURIComponent(key),
    });

    const response = await s3Client.send(command);
    const buffer = await response.Body?.transformToByteArray();

    if (!buffer) {
      return new Response("Image not found", { status: 404 });
    }

    return new Response(buffer, {
      headers: {
        "Content-Type": response.ContentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new Response("Error not found", { status: 404 });
  }
}
