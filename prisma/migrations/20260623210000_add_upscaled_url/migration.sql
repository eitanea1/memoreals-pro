-- Add HD upscale column (GPT Image). Null until an image is upscaled.
ALTER TABLE "GeneratedImage" ADD COLUMN "upscaledUrl" TEXT;
