// ── Prompt Variation Styles ────────────────────────────────────────────────────
export const VARIATIONS = ['closeup', 'halfbody', 'dramatic'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

const VARIATION_STYLES: Record<PromptVariation, string> = {
  closeup:
    'ultra-realistic close-up portrait, face filling the frame, detailed skin pores and textures, ' +
    'cinematic shallow depth of field f/1.4, soft ambient light wrapping around the face, ' +
    'atmospheric bokeh with environmental context bleeding through',
  halfbody:
    'ultra-realistic half-body environmental portrait, natural dynamic pose interacting with surroundings, ' +
    'rich detailed background with depth, medium shot balanced composition, ' +
    'professional cinematic lighting with natural light sources',
  dramatic:
    'ultra-realistic wide-angle cinematic shot, full costume and environment visible, ' +
    'epic golden hour rim lighting, volumetric fog and atmospheric haze, ' +
    'dramatic low-angle heroic composition, environmental storytelling',
};

// ── Base atmosphere (shared across all variations) ────────────────────────────
const ATMOSPHERE =
  '8K ultra-realistic photography, photorealistic skin texture with natural imperfections, ' +
  'sharp facial features, cinematic color grading, atmospheric depth and haze, ' +
  'natural environmental lighting, RAW photo quality, rich textured details in clothing and surroundings';

// ── Character costume & scene descriptions ──────────────────────────────────
const CHARACTER_DESCRIPTIONS: Record<string, string> = {
  // Superheroes
  'Spider-Man':       'as Spider-Man, wearing full red and blue spandex suit with web pattern details, perched on a rain-soaked rooftop ledge at dusk, city lights glowing below, misty atmosphere',
  'Wonder Woman':     'as Wonder Woman, wearing golden tiara, red and gold breastplate, blue skirt with stars, lasso glowing at hip, standing in ancient Greek temple ruins at golden hour, dust particles in warm light',
  'Batman':           'as Batman, wearing black armored batsuit, dark cape billowing in wind, standing on gothic gargoyle overlooking foggy Gotham city at night, neon reflections on wet surfaces',
  'Superman':         'as Superman, wearing iconic blue bodysuit with red cape billowing, golden S-shield on chest, hovering above cloud layer at sunrise, warm golden light from below',
  'Iron Man':         'as Iron Man, wearing red and gold metallic armor, glowing arc reactor on chest, helmet under arm, standing in high-tech workshop with holographic displays, cool blue ambient light',
  'Black Panther':    'as Black Panther, wearing sleek black vibranium armor with purple trim, panther claw necklace, standing in lush Wakandan jungle, bioluminescent plants glowing around, misty atmosphere',
  'Captain America':  'as Captain America, wearing blue tactical uniform with star on chest, holding iconic shield, standing on battlefield at dawn, morning mist rising, dramatic backlight',
  'Thor':             'as Thor, wearing Norse warrior armor with red cape, holding Mjolnir hammer crackling with lightning, standing on Bifrost bridge, aurora borealis in sky, epic storm clouds',
  'The Flash':        'as The Flash, wearing scarlet red bodysuit with golden lightning bolt, speed lightning trailing behind, running through rain-soaked city street at night, motion blur on surroundings',
  'Aquaman':          'as Aquaman, wearing orange and green scale armor, holding golden trident, standing on rocky ocean cliff, massive waves crashing behind, dramatic stormy sky, sea spray in air',
  'Hulk':             'as the Hulk, massive green muscular body, torn purple pants, standing in destroyed urban landscape, dust and debris floating in air, dramatic sunset backlighting',
  'Doctor Strange':   'as Doctor Strange, wearing burgundy Cloak of Levitation, Eye of Agamotto glowing, conjuring orange magical mandalas, floating in mystical dimension with fractured reality around',

  // Professions
  'Firefighter':      'as a firefighter, wearing yellow turnout coat and helmet with visor, breathing apparatus ready, standing before a massive blazing fire, orange flames reflecting off gear, smoke and embers swirling in air',
  'Nurse':            'as a nurse, wearing teal medical scrubs, stethoscope around neck, in modern hospital corridor, soft fluorescent lighting, caring determined expression, medical equipment in background',
  'Astronaut':        'as an astronaut, wearing white NASA spacesuit with mission patches, clear helmet visor reflecting Earth, floating in space station cupola, Earth glowing blue below, lens flare from sun',
  'Chef':             'as a chef, wearing white chef uniform and tall toque hat, flames rising from a pan mid-flip, professional kitchen with copper pots, warm amber lighting, steam and kitchen atmosphere',
  'Police Officer':   'as a police officer, wearing dark blue uniform with badge, utility belt, standing by patrol car at dusk, red and blue lights casting colored shadows, urban street scene',
  'Teacher':          'as a teacher, wearing smart professional attire, standing by large chalkboard covered in equations, warm classroom light streaming through tall windows, golden dust particles in air',
  'Doctor':           'as a doctor, wearing white coat with stethoscope, standing in modern surgical suite, cool blue-green lighting, medical monitors glowing in background, professional focused expression',
  'Pilot':            'as a pilot, wearing captain uniform with epaulettes, standing on tarmac at sunset, massive aircraft behind, golden hour light reflecting off plane fuselage, heat haze rising',
  'Engineer':         'as an engineer, wearing hard hat and reflective vest, holding blueprints, standing on steel skyscraper framework at sunrise, city skyline panorama below, wind-swept clouds',
  'Veterinarian':     'as a veterinarian, wearing scrubs, gently holding a small animal, in warm veterinary clinic, soft natural window light, shelves with supplies in background, compassionate expression',
  'Artist':           'as an artist, wearing paint-splattered apron, holding palette and brush, standing in sunlit studio with massive canvases, colorful paint splashes everywhere, golden afternoon light streaming in',
  'Scientist':        'as a scientist, wearing lab coat and safety goggles, holding glowing test tube, in dimly lit laboratory, colorful chemical reactions bubbling, dramatic colored lighting from experiments',

  // Fairy Tales
  'Cinderella':       'as Cinderella, wearing shimmering light blue ball gown with glass slippers, descending grand marble staircase, magical sparkles swirling around, moonlit castle ballroom, chandeliers twinkling',
  'Peter Pan':        'as Peter Pan, wearing green tunic with pointy hat and feather, flying above moonlit London rooftops, Big Ben in background, starry night sky, fairy dust trail glowing',
  'Snow White':       'as Snow White, wearing yellow and blue royal gown with red bow headband, standing in enchanted forest clearing, woodland animals nearby, soft dappled sunlight through ancient trees',
  'Little Red Riding Hood': 'as Little Red Riding Hood, wearing flowing red hooded cape over white dress, holding basket, walking through misty dark forest path, shafts of light breaking through tall trees',
  'Rapunzel':         'as Rapunzel, wearing purple dress with long flowing golden hair cascading down tower, hundreds of floating lanterns rising into twilight sky, warm golden glow everywhere',
  'Pinocchio':        'as Pinocchio, wearing tyrolian hat and suspenders, wooden puppet details, in old Italian puppet workshop, warm candlelight, wooden toys and tools on shelves, cozy atmosphere',
  'Beauty & the Beast': 'as Belle, wearing iconic golden ball gown, dancing in enchanted castle ballroom, magical rose glowing under glass dome nearby, warm candlelit atmosphere, falling rose petals',
  'The Little Mermaid': 'as Ariel, wearing mermaid costume with teal sequined tail, sitting on rocky shore at sunset, waves crashing, golden light on water, sea foam and spray, magical underwater hints',
  'Sleeping Beauty':  'as Aurora, wearing flowing pink and blue magical gown with golden crown, in enchanted castle garden, roses blooming everywhere, soft dreamy fog, fairy sparkles in air',
  'Hansel & Gretel':  'as Hansel, wearing Bavarian folk costume, standing before magical gingerbread house in dark forest, candy decorations glowing, mysterious fog, fairy tale atmosphere',
  'Aladdin':          'as Aladdin, wearing purple vest and red fez, riding magic carpet above moonlit Arabian city, golden magic lamp glowing, palace domes below, starry desert sky',
  'Jack and the Beanstalk': 'as Jack, wearing medieval peasant costume, climbing enormous beanstalk above the clouds, looking up at giant castle, dramatic clouds swirling, golden light from above',
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
  const scene = CHARACTER_DESCRIPTIONS[params.characterName]
    ?? `as ${params.characterName}, in a cinematic environment`;

  const variation = params.variation ?? 'closeup';
  const style = VARIATION_STYLES[variation];

  const override = params.aiOverride?.trim()
    ? `, ${params.aiOverride.trim()}`
    : '';

  return (
    `Ultra-realistic outdoor/indoor photography of ${LORA_TRIGGER}, a ${params.aiLabel}, ` +
    `${scene}${override}. ` +
    `${style}. ${ATMOSPHERE}`
  );
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, jpeg artifacts';
