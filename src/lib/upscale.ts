import OpenAI, { toFile } from 'openai';
import { put } from '@vercel/blob';

// The prompt that made the dragon image razor-sharp: regenerate fine detail
// (scales, hair, fabric, eyes) WITHOUT touching composition — and above all,
// without altering the child's face. Face identity is the #1 rule for MemoReals:
// a "beautified" face means the kid no longer looks like themselves.
export const UPSCALE_PROMPT = `Upscale this image to maximum resolution and photorealistic detail.
Enhance fine textures: individual hair strands, fabric weave, scales, skin pores,
crisp reflections in the eyes, realistic depth and rim lighting.
Keep the EXACT same composition, pose, framing, colors and mood — do not change the scene,
do not add or remove any element.

CRITICAL: preserve the human face identity 100% — same facial features, same proportions,
same expression, same age. Do NOT beautify, smooth, reshape, or alter the face in any way.
If unsure about a facial detail, keep the original face untouched.`;

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  if (!_client) _client = new OpenAI({ apiKey });
  return _client;
}

/**
 * Upscale one image with GPT Image (high quality), upload the result to Vercel
 * Blob, and return the public URL. Non-destructive: caller stores this alongside
 * the original imageUrl.
 *
 * @param sourceUrl  public URL of the image to upscale (fal or blob URL)
 * @param destPath   blob path for the result, e.g. `upscaled/<imageId>.png`
 */
export async function upscaleImage(sourceUrl: string, destPath: string): Promise<string> {
  // 1. Pull the source image into memory.
  const srcRes = await fetch(sourceUrl);
  if (!srcRes.ok) throw new Error(`Failed to fetch source image: ${srcRes.status}`);
  const srcBuffer = Buffer.from(await srcRes.arrayBuffer());

  // 2. Send to GPT Image. size:'auto' keeps the source aspect ratio (cards are
  // portrait), quality:'high' is what produces the sharp, detail-rich result.
  const openai = getClient();
  const result = await openai.images.edit({
    model: 'gpt-image-1',
    image: await toFile(srcBuffer, 'source.png', { type: 'image/png' }),
    prompt: UPSCALE_PROMPT,
    size: 'auto',
    quality: 'high',
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error('GPT Image returned no image data');
  const outBuffer = Buffer.from(b64, 'base64');

  // 3. Store the HD result in Vercel Blob and hand back the URL.
  const blob = await put(destPath, outBuffer, {
    access: 'public',
    contentType: 'image/png',
    allowOverwrite: true,
  });
  return blob.url;
}
