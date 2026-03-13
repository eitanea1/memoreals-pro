// ── Prompt Variation Styles ────────────────────────────────────────────────────
export const VARIATIONS = ['closeup', 'halfbody', 'dramatic'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

const VARIATION_STYLES: Record<PromptVariation, string> = {
  closeup:
    'cinematic close-up portrait, face filling the frame, soft bokeh background, ' +
    'intimate eye contact with camera, shallow depth of field f/1.4',
  halfbody:
    'half-body portrait, dynamic natural pose, environmental context visible, ' +
    'medium shot, balanced composition, professional studio lighting',
  dramatic:
    'dramatic wide-angle portrait, full costume visible, epic cinematic lighting, ' +
    'volumetric fog, golden hour rim light, heroic low-angle shot',
};

// ── Base atmosphere (shared across all variations) ────────────────────────────
const ATMOSPHERE =
  'ultra-realistic, masterpiece 8k, photorealistic skin texture, ' +
  'sharp facial features, professional photography';

// ── Character costume descriptions ────────────────────────────────────────────
const CHARACTER_DESCRIPTIONS: Record<string, string> = {
  // Superheroes
  'Spider-Man':       'wearing a full Spider-Man suit, red and blue spandex, web pattern details, mask on face',
  'Wonder Woman':     'wearing Wonder Woman armor, golden tiara, red and gold breastplate, blue skirt with stars, lasso at hip',
  'Batman':           'wearing Batman suit, black armored batsuit, cowl with bat ears, dark cape flowing behind',
  'Superman':         'wearing Superman suit, iconic blue bodysuit, red cape billowing, golden S-shield on chest',
  'Iron Man':         'wearing Iron Man armor, red and gold metallic suit, glowing arc reactor on chest, helmet under arm',
  'Black Panther':    'wearing Black Panther suit, sleek black vibranium armor, panther claw necklace, purple trim',
  'Captain America':  'wearing Captain America suit, blue uniform, star on chest, holding iconic red-white-blue shield',
  'Thor':             'wearing Thor costume, Norse warrior armor, red cape, holding Mjolnir hammer, golden hair',
  'The Flash':        'wearing The Flash suit, scarlet red bodysuit, golden lightning bolt symbol, speed lightning effects',
  'Aquaman':          'wearing Aquaman armor, orange and green scale-patterned suit, golden trident in hand',
  'Hulk':             'as the Hulk, massive green muscular body, torn purple pants, intense expression',
  'Doctor Strange':   'wearing Doctor Strange cloak, burgundy sorcerer robes, Cloak of Levitation, Eye of Agamotto amulet',

  // Professions
  'Firefighter':      'wearing full firefighter gear, yellow turnout coat, helmet, breathing apparatus, fire hose in hand',
  'Nurse':            'wearing nursing scrubs, stethoscope around neck, gentle caring expression, hospital setting',
  'Astronaut':        'wearing NASA spacesuit, white pressurized suit, clear helmet visor, mission patches on arm',
  'Chef':             'wearing white chef uniform, tall toque blanche hat, holding a pan, professional kitchen',
  'Police Officer':   'wearing police uniform, badge on chest, utility belt, authoritative confident pose',
  'Teacher':          'wearing smart professional attire, holding chalk near chalkboard, warm inviting expression',
  'Doctor':           'wearing white doctor coat, stethoscope around neck, clipboard in hand, clinic background',
  'Pilot':            'wearing pilot uniform, captain epaulettes, aviator sunglasses, cockpit background',
  'Engineer':         'wearing hard hat and reflective vest, holding blueprints, construction site background',
  'Veterinarian':     'wearing veterinarian scrubs, holding a small animal, kind smile, clinic background',
  'Artist':           'wearing paint-splattered apron, holding palette and brush, colorful art studio background',
  'Scientist':        'wearing lab coat, safety goggles, test tube in hand, laboratory background',

  // Fairy Tales
  'Cinderella':       'wearing Cinderella ball gown, shimmering light blue dress, glass slippers, magical sparkles',
  'Peter Pan':        'wearing Peter Pan costume, green tunic, pointy hat with feather, flying pose',
  'Snow White':       'wearing Snow White dress, yellow and blue royal gown, red bow headband, apple in hand',
  'Little Red Riding Hood': 'wearing red hooded cape, white dress, holding basket of goods, forest background',
  'Rapunzel':         'wearing Rapunzel purple dress, long flowing magical golden hair, frying pan in hand',
  'Pinocchio':        'wearing Pinocchio costume, tyrolian hat, suspenders, wooden puppet details',
  'Beauty & the Beast': 'wearing golden ball gown inspired by Belle, yellow satin dress, magical rose nearby',
  'The Little Mermaid': 'as Ariel, wearing mermaid costume, teal sequined tail, seashell top, underwater scene',
  'Sleeping Beauty':  'wearing Aurora gown, pink and blue magical dress, golden crown, spinning wheel nearby',
  'Hansel & Gretel':  'wearing Bavarian folk costume, dirndl or lederhosen, holding gingerbread cookie',
  'Aladdin':          'wearing Aladdin costume, purple vest, red fez hat, magic lamp in hand, Agrabah setting',
  'Jack and the Beanstalk': 'wearing medieval peasant costume, holding magic beans, giant beanstalk behind',
};

// ── Trigger word used during LoRA training ────────────────────────────────────
export const LORA_TRIGGER = 'MEMRLS';

// ── Build a full prompt for a single character + variation ─────────────────────
export function buildPrompt(params: {
  characterName: string;
  aiLabel: string;        // e.g. "child_male" from computeAiLabel()
  aiOverride?: string;    // admin global override
  variation?: PromptVariation;
}): string {
  const costume = CHARACTER_DESCRIPTIONS[params.characterName]
    ?? `wearing ${params.characterName} costume`;

  const variation = params.variation ?? 'closeup';
  const style = VARIATION_STYLES[variation];

  const override = params.aiOverride?.trim()
    ? `, ${params.aiOverride.trim()}`
    : '';

  return (
    `portrait of ${LORA_TRIGGER}, a ${params.aiLabel}, ` +
    `${costume}${override}, ` +
    `${style}, ${ATMOSPHERE}`
  );
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude';
