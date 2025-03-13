/**
 * Uploads a file to S3 using a pre-signed URL
 * @param file The file to upload
 * @returns A promise that resolves to the file key in S3
 */
export const uploadImageToS3 = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // First, get a signed URL for uploading
        const uploadResponse = await fetch("/api/s3/get-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { uploadUrl, fileKey } = await uploadResponse.json();

        // Upload the file directly to S3 using the signed URL
        const uploadResult = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResult.ok) {
          throw new Error("Failed to upload file");
        }

        resolve(fileKey);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("File reading error"));
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads multiple images to S3 and returns array of URLs
 * Handles both File objects and existing image URLs
 */
export async function uploadImages(
  images: (string | File)[]
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const image of images) {
    if (image instanceof File) {
      try {
        const fileKey = await uploadImageToS3(image);
        uploadedUrls.push(fileKey);
      } catch (error) {
        console.error("Failed to upload image:", error);
        throw new Error("Failed to upload image");
      }
    } else if (typeof image === "string") {
      // If it's already a URL, just use it
      uploadedUrls.push(image);
    }
  }

  return uploadedUrls;
}

/**
 * Node.js specific function for uploading images during seeding
 * This version doesn't use browser-specific APIs
 */
export async function uploadImageToS3ForSeed(file: {
  buffer: Buffer;
  name: string;
  type: string;
}): Promise<string> {
  try {
    // Check if we have AWS credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn("AWS credentials not found, using mock S3 key");
      return `mock-s3-key-${Date.now()}-${file.name}`;
    }

    // Import AWS SDK dynamically to avoid issues in browser environment
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const { v4: uuidv4 } = await import("uuid");

    // Create S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Generate a unique key for the file
    const key = `${uuidv4()}-${file.name}`;

    // Upload directly to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    return key;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    // Generate a mock key for development/testing
    return `mock-s3-key-${Date.now()}-${file.name}`;
  }
}
