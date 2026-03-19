import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { prisma } from '@/lib/prisma';
import { buildPrompt, VARIATIONS, LORA_TRIGGER, type PromptVariation } from '@/lib/prompts';

fal.config({ credentials: process.env.FAL_KEY });

export const maxDuration = 300; // 5 minutes max

type FalImageResult = { data: { images: { url: string }[] } };

async function generateForCharacterVariation(params: {
  characterName: string;
  characterIndex: number;
  loraUrl: string;
  aiLabel: string;
  aiOverride: string;
  orderId: string;
  isSample: boolean;
  variation: PromptVariation;
  customPrompt?: string;
}) {
  const prompt = buildPrompt({
    characterName: params.characterName,
    aiLabel: params.aiLabel,
    aiOverride: params.aiOverride,
    variation: params.variation,
    customPrompt: params.customPrompt,
  });

  const result = await fal.subscribe('fal-ai/flux-lora', {
    input: {
      prompt,
      loras: [{ path: params.loraUrl, scale: 1.0 }],
      num_images: 1,
      image_size: { width: 768, height: 1024 },
      num_inference_steps: 40,
      guidance_scale: 3.5,
      enable_safety_checker: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    logs: false,
    onQueueUpdate: () => {},
  }) as FalImageResult;

  const images = result.data?.images ?? [];

  await prisma.generatedImage.createMany({
    data: images.map((img) => ({
      orderId:        params.orderId,
      characterName:  params.characterName,
      characterIndex: params.characterIndex,
      imageUrl:       img?.url ?? '',
      variation:      params.variation,
      isSample:       params.isSample,
      isSelected:     false,
    })),
  });
}

export async function POST(req: NextRequest) {
  const { orderId, mode, startIndex, characterName, customPrompts } = await req.json();
  // mode: 'samples' | 'full' | 'single' (regenerate one character)
  // characterName: required for mode='single'
  // customPrompts: optional { closeup?: string, halfbody?: string, dramatic?: string }

  if (!orderId || !mode) {
    return NextResponse.json({ error: 'orderId and mode required' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      characters: { orderBy: { position: 'asc' } },
      generatedImages: { select: { characterName: true, variation: true, isSample: true } },
    },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (!order.loraUrl) return NextResponse.json({ error: 'LoRA not trained yet' }, { status: 400 });

  // ── Single character regeneration ──
  if (mode === 'single') {
    if (!characterName) {
      return NextResponse.json({ error: 'characterName required for single mode' }, { status: 400 });
    }
    const char = order.characters.find((c) => c.name === characterName);
    if (!char) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

    try {
      let generated = 0;
      for (const variation of VARIATIONS) {
        const custom = customPrompts?.[variation] as string | undefined;
        await generateForCharacterVariation({
          characterName: char.name,
          characterIndex: char.position,
          loraUrl: order.loraUrl,
          aiLabel: order.aiLabel,
          aiOverride: order.aiOverride,
          orderId: order.id,
          isSample: false,
          variation,
          customPrompt: custom,
        });
        generated++;
      }
      return NextResponse.json({ success: true, generated });
    } catch (err) {
      console.error('[generate] Single char error:', err);
      return NextResponse.json({ error: 'Generation failed', detail: String(err) }, { status: 500 });
    }
  }

  const allChars = order.characters;
  const isSample = mode === 'samples';
  const charsToGenerate = isSample ? allChars.slice(0, 5) : allChars;

  // Find which characters still need generation (skip already generated)
  const existingKeys = new Set(
    order.generatedImages
      .filter((img) => img.isSample === isSample)
      .map((img) => `${img.characterName}:${img.variation}`)
  );

  const pending: { char: typeof allChars[0]; variation: PromptVariation }[] = [];
  for (const char of charsToGenerate) {
    for (const variation of VARIATIONS) {
      if (!existingKeys.has(`${char.name}:${variation}`)) {
        pending.push({ char, variation });
      }
    }
  }

  if (pending.length === 0) {
    if (mode === 'full') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING_ALL' },
      });
    }
    return NextResponse.json({ success: true, generated: 0, message: 'All images already generated' });
  }

  // Process in batches — generate up to 15 images per request (5 characters × 3 variations)
  const BATCH_SIZE = 15;
  const batch = pending.slice(0, BATCH_SIZE);

  try {
    let generated = 0;
    for (const { char, variation } of batch) {
      await generateForCharacterVariation({
        characterName:  char.name,
        characterIndex: char.position,
        loraUrl:        order.loraUrl,
        aiLabel:        order.aiLabel,
        aiOverride:     order.aiOverride,
        orderId:        order.id,
        isSample,
        variation,
      });
      generated++;
    }

    const remaining = pending.length - batch.length;

    // If there are more to generate, trigger the next batch
    if (remaining > 0) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3002';
      fetch(`${baseUrl}/api/fal/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, mode, startIndex: (startIndex ?? 0) + batch.length }),
      }).catch(() => {}); // fire-and-forget
    } else if (mode === 'full') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING_ALL' },
      });
    }

    return NextResponse.json({
      success: true,
      generated,
      remaining,
      total: pending.length,
    });
  } catch (err) {
    console.error('[generate] Error:', err);
    return NextResponse.json({ error: 'Generation failed', detail: String(err) }, { status: 500 });
  }
}
