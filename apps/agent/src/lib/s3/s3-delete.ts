export async function deleteImageFromS3(imageUrl: string): Promise<void> {
  try {
    const response = await fetch("/api/s3/delete-image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete image from S3");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}
