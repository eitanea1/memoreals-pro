import { fal } from '@fal-ai/client';
import { put } from '@vercel/blob';

fal.config({ credentials: process.env.FAL_KEY });

// Engine: fal Crystal Upscaler — a portrait-specialised enhancer.
//
// Why this and not the others we tried:
//   - GPT Image API: rejects children's photos outright (safety 400). Dead end.
//   - clarity-upscaler: either smooth/plasticky (low creativity) or it reinvents
//     the face and background (high creativity). No good middle for kids.
//   - flux-vision-upscaler: great quality but ~8 minutes per image. Too slow.
//   - Crystal: keeps the child's face AND the original background faithful, adds
//     real sharpness/texture, runs in ~10s, outputs 2048×1536. No knobs to tune.

type CrystalResult = { data: { images?: { url: string }[]; image?: { url: string } } };

/**
 * Upscale one image with fal Crystal Upscaler, store the result in Vercel Blob,
 * and return the public URL. Non-destructive: caller keeps the original imageUrl
 * and just fills in upscaledUrl.
 *
 * @param sourceUrl public URL of the image to upscale
 * @param destPath  blob path for the result, e.g. `upscaled/<imageId>.jpg`
 */
export async function upscaleImage(sourceUrl: string, destPath: string): Promise<string> {
  const result = (await fal.subscribe('clarityai/crystal-upscaler', {
    input: { image_url: sourceUrl },
    logs: false,
    onQueueUpdate: () => {},
  })) as CrystalResult;

  const outUrl = result.data?.images?.[0]?.url ?? result.data?.image?.url;
  if (!outUrl) throw new Error('crystal-upscaler returned no image');

  // Persist to our own Blob storage so the HD file is durable for print later.
  const res = await fetch(outUrl);
  if (!res.ok) throw new Error(`Failed to fetch upscaled image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const blob = await put(destPath, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
  });
  return blob.url;
}
