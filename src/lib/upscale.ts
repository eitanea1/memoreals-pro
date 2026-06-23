import { fal } from '@fal-ai/client';
import { put } from '@vercel/blob';

fal.config({ credentials: process.env.FAL_KEY });

// Why fal clarity-upscaler instead of GPT Image:
//   1. OpenAI's safety system rejects edits of photos of children (400) — and
//      every MemoReals card is a child, so that path is a dead end here.
//   2. clarity-upscaler adds real detail (skin texture, hair strands, crisp eyes)
//      like a Magnific-style upscale, runs in ~13s, and reuses the FAL_KEY we
//      already have.
// Face fidelity is the #1 rule for MemoReals (the kid must still look like
// themselves), so creativity is kept LOW and resemblance HIGH, with a negative
// prompt that discourages reshaping the face.
const POSITIVE_PROMPT =
  'ultra realistic photograph, highly detailed, sharp focus, hyperdetailed skin texture, ' +
  'visible skin pores, individual hair strands, realistic eyes, crisp fabric texture, ' +
  'professional photography, natural lighting';
const NEGATIVE_PROMPT =
  'smooth skin, plastic skin, airbrushed, cartoon, painting, deformed face, distorted face, ' +
  'different person, changed facial features, oversmoothed, blurry, artifacts, extra fingers';

type ClarityResult = { data: { image?: { url: string } } };

/**
 * Upscale one image 2× with fal clarity-upscaler, store the result in Vercel
 * Blob, and return the public URL. Non-destructive: caller keeps the original
 * imageUrl and just fills in upscaledUrl.
 *
 * @param sourceUrl public URL of the image to upscale
 * @param destPath  blob path for the result, e.g. `upscaled/<imageId>.png`
 */
export async function upscaleImage(sourceUrl: string, destPath: string): Promise<string> {
  const result = (await fal.subscribe('fal-ai/clarity-upscaler', {
    input: {
      image_url: sourceUrl,
      prompt: POSITIVE_PROMPT,
      negative_prompt: NEGATIVE_PROMPT,
      upscale_factor: 2,
      // Balanced: enough creativity for ultra-realistic skin/texture, enough
      // resemblance to keep the child's identity. Lower creativity = smoother
      // but more faithful; higher = more realistic texture but the face shifts.
      creativity: 0.4,
      resemblance: 0.85,
      num_inference_steps: 22,
    },
    logs: false,
    onQueueUpdate: () => {},
  })) as ClarityResult;

  const outUrl = result.data?.image?.url;
  if (!outUrl) throw new Error('clarity-upscaler returned no image');

  // Persist to our own Blob storage so the HD file is durable for print later.
  const res = await fetch(outUrl);
  if (!res.ok) throw new Error(`Failed to fetch upscaled image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const blob = await put(destPath, buffer, {
    access: 'public',
    contentType: 'image/png',
    allowOverwrite: true,
  });
  return blob.url;
}
