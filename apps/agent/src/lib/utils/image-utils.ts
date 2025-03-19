import fs from "fs";
import path from "path";

const getMimeType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "application/octet-stream";
};

export const loadImageFile = (
  imagePath: string
): { buffer: Buffer; name: string; type: string } => {
  // Check if file exists before trying to read it
  if (!fs.existsSync(imagePath)) {
    console.error(`Image file not found at: ${imagePath}`);
    throw new Error(`Image file not found: ${imagePath}`);
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const fileName = path.basename(imagePath);

  return {
    buffer: imageBuffer,
    name: fileName,
    type: getMimeType(fileName),
  };
};
