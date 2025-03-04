import { z } from "zod";

export const FileSchema =
  typeof File !== "undefined"
    ? z.instanceof(File)
    : z.any().refine(() => false, {
        message: "Files can only be uploaded in the browser",
      });
