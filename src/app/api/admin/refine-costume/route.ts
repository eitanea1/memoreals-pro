import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { getPrisma } from '@/lib/prisma';

fal.config({ credentials: process.env.FAL_KEY });

// Flux Kontext costume refine takes ~10-20s.
export const maxDuration = 120;

type KontextResult = { data: { images?: { url: string }[]; image?: { url: string } } };

/**
 * "Refine costume" — the open equivalent of the ChatGPT image edit the user loved.
 * Runs Flux Kontext on a generated image with an instruction to make the costume
 * realistic while keeping the child's face, pose and background unchanged. Creates
 * a NEW selectable option for that character (auto-selected), so the admin can then
 * HD-upscale it. Non-destructive: the original image row stays.
 *
 * POST { imageId }
 */
export async function POST(req: NextRequest) {
  const { imageId } = await req.json();
  if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 });

  const prisma = getPrisma();
  const image = await prisma.generatedImage.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

  // The characterName is the English costume name (e.g. "Spider-Man"); custom
  // characters use their given name — Kontext still refines the visible outfit.
  const instruction =
    `Enhance into a realistic photograph: natural detailed skin with real texture (not plastic, ` +
    `not waxy), a refined realistic ${image.characterName} costume with textured fabric and crisp ` +
    `details, cinematic lighting. CRITICAL: keep the child's face, facial features, face shape, ` +
    `skin tone, eyes and hair 100% IDENTICAL — do not alter the face at all. Keep the same pose and background.`;

  try {
    const result = (await fal.subscribe('fal-ai/flux-pro/kontext', {
      // guidance 1.5: low so Kontext changes little and preserves the child's likeness
      // (default 3.5 drifted the face). Enough to fix skin realism + costume.
      input: { prompt: instruction, image_url: image.imageUrl, guidance_scale: 1.5 },
      logs: false,
      onQueueUpdate: () => {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)) as KontextResult;

    const outUrl = result.data?.images?.[0]?.url ?? result.data?.image?.url;
    if (!outUrl) throw new Error('Kontext returned no image');

    // Persist to our Blob (durable) and add as a new selected option.
    const res = await fetch(outUrl);
    if (!res.ok) throw new Error(`Failed to fetch refined image: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const blob = await put(`refined/${image.orderId}/${uuidv4()}.jpg`, buffer, {
      access: 'public', contentType: 'image/jpeg',
    });

    // Deselect siblings in the same group, then add the refined one as selected.
    await prisma.generatedImage.updateMany({
      where: { orderId: image.orderId, characterName: image.characterName, isSample: image.isSample },
      data: { isSelected: false },
    });
    await prisma.generatedImage.create({
      data: {
        orderId: image.orderId, characterName: image.characterName, characterIndex: image.characterIndex,
        imageUrl: blob.url, variation: 'refined', isSample: image.isSample, isSelected: true,
      },
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error('[refine-costume] Error:', err);
    return NextResponse.json({ error: 'Refine failed', detail: String(err) }, { status: 500 });
  }
}
