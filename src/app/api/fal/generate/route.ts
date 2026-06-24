import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { prisma } from '@/lib/prisma';
import { buildPrompt, VARIATIONS, LORA_TRIGGER, NEGATIVE_PROMPT, type PromptVariation } from '@/lib/prompts';

fal.config({ credentials: process.env.FAL_KEY });

export const maxDuration = 300; // 5 minutes max (capped lower on Hobby; small batches keep us safe)

type FalImageResult = { data: { images: { url: string }[] } };

async function generateForCharacterVariation(params: {
  characterName: string;
  characterIndex: number;
  loraUrl: string;
  loraTrigger: string;
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
    loraTrigger: params.loraTrigger,
    variation: params.variation,
    customPrompt: params.customPrompt,
  });

  const result = await fal.subscribe('fal-ai/flux-lora', {
    input: {
      prompt,
      // scale 1.0: a correctly-trained LoRA (see train/route.ts — subject_crop + 0.0002 LR)
      // gives full likeness AND full scene at 1.0, like the proven manual run.
      loras: [{ path: params.loraUrl, scale: 1.0 }],
      num_images: 1,
      // Default image_size + 28 steps + guidance 3.5 + scale 1.0 — the exact settings
      // behind the approved gold results (Wonder Woman, Iron Man, Batgirl). The magic
      // lives in the prompt formula (see prompts.ts), not in these settings.
      num_inference_steps: 28,
      guidance_scale: 3.5,
      negative_prompt: NEGATIVE_PROMPT, // was never passed — this pushes out the kid's everyday clothes
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
  const { orderId, mode, characterName, customPrompts } = await req.json();
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
          loraTrigger: order.loraTrigger ?? LORA_TRIGGER,
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

  // Small batch per request so each call finishes well under the serverless
  // timeout (~60s on Hobby). The CLIENT loops, calling this until remaining === 0,
  // which is far more reliable than a fire-and-forget self-fetch (that gets frozen
  // once the response is sent). Re-calling is idempotent: already-generated
  // character+variation pairs are skipped via existingKeys, so it resumes cleanly.
  const BATCH_SIZE = 3;
  const batch = pending.slice(0, BATCH_SIZE);

  try {
    let generated = 0;
    for (const { char, variation } of batch) {
      await generateForCharacterVariation({
        characterName:  char.name,
        characterIndex: char.position,
        loraUrl:        order.loraUrl,
        loraTrigger:    order.loraTrigger ?? LORA_TRIGGER,
        aiLabel:        order.aiLabel,
        aiOverride:     order.aiOverride,
        orderId:        order.id,
        isSample,
        variation,
      });
      generated++;
    }

    const remaining = pending.length - batch.length;

    // When the full set is fully generated, advance the order status.
    if (remaining === 0 && mode === 'full') {
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
