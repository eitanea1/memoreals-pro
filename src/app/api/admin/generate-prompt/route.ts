import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { LORA_TRIGGER } from '@/lib/prompts';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_KEY ?? process.env.ANTHROPIC_API_KEY });

export const maxDuration = 30;

// Auto-generate winning-formula prompts for custom characters (often typed in
// Hebrew) that have no fixed entry in CHARACTER_PROMPTS. Claude identifies the
// character (translating from Hebrew) and writes the two variation prompts in
// the proven cinematic formula — see prompts.ts.

const SYSTEM = `You write image-generation prompts for MemoReals, a service that turns a real person into a cinematic movie-poster of a character. The person's real face is injected via the literal token "${LORA_TRIGGER}" — always include it exactly.

You receive a CHARACTER (it may be written in Hebrew — identify it and translate to English; e.g. "צ'ייס ממפרץ ההרפתקאות" = Chase from PAW Patrol) and a SUBJECT LABEL (e.g. "5-year-old girl", "35-year-old man").

Write TWO complete English prompts. The MIDDLE (character + scene + costume + magic) is identical in both; only the opening framing differs.

variation_a (full body):
"A full-body ultra-realistic cinematic photograph of ${LORA_TRIGGER} shown in full from head to toe, a {LABEL} fully transformed into a real-life {CHARACTER}, {pose / clear action} in/on {a vivid, specific, cinematic scene}, wearing {a detailed, movie-accurate costume described with materials}{, clearly holding/using an iconic prop if any}. Glowing magical light particles and sparkling embers drift through the air, a subtle shimmering magical aura, dreamy glowing bokeh and soft ethereal light bloom, dramatic cinematic lighting. ${LORA_TRIGGER}'s face is natural and realistic, sharp and clean, with expressive eyes and soft cinematic lighting, ultra-realistic skin texture, realistic hair, and finely detailed realistic materials. Hyper-detailed and photorealistic, cinematic movie-poster quality. make it realistic and magical."

variation_b (close-up): identical MIDDLE, but the opening is:
"An ultra-realistic cinematic close-up portrait, head and shoulders, of ${LORA_TRIGGER}, a {LABEL} fully transformed into a real-life {CHARACTER}, ..."

Rules:
- Lead with the framing, then a SPECIFIC interesting scene (battlefield, ice palace, neon city rooftop, ocean wave…) — NEVER an indoor room or plain background.
- Make the ACTIVITY unmistakable: a surfer rides a wave or holds a tall surfboard upright; a footballer kicks/holds a ball; a dancer is mid-pose. The character and what they're doing must be clearly visible, not cropped to just a face.
- Describe the costume concretely (colors, materials, emblems).
- If the character normally hides the face (mask, helmet, cowl), explicitly state it removed / face fully visible.
- For an animal or robot character, keep the human face fully visible and recognizable.
- Do NOT use the word "portrait" in variation_a (it biases toward a face close-up).
- Output English only. Never include Hebrew, "--ar", resolution tokens, or Midjourney syntax.`;

const SCHEMA = {
  type: 'object',
  properties: {
    character_identified: { type: 'string', description: 'The character identified, in English' },
    variation_a: { type: 'string', description: 'Full-body prompt, ends with "Full body shot, head to toe."' },
    variation_b: { type: 'string', description: 'Close-up prompt, ends with "Close-up portrait, head and shoulders."' },
  },
  required: ['character_identified', 'variation_a', 'variation_b'],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  const { characterName, aiLabel } = await req.json();
  if (!characterName) {
    return NextResponse.json({ error: 'characterName required' }, { status: 400 });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM,
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
      messages: [
        {
          role: 'user',
          content: `Character: ${characterName}\nSubject label: ${aiLabel || 'person'}`,
        },
      ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const textBlock = message.content.find((b) => b.type === 'text');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (textBlock as any)?.text ?? '';
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      variation_a: parsed.variation_a,
      variation_b: parsed.variation_b,
      characterIdentified: parsed.character_identified,
    });
  } catch (err) {
    console.error('[generate-prompt] Error:', err);
    return NextResponse.json({ error: 'Prompt generation failed', detail: String(err) }, { status: 500 });
  }
}
