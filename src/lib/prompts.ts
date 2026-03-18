// ── Prompt Variation Styles ────────────────────────────────────────────────────
export const VARIATIONS = ['closeup', 'halfbody', 'dramatic'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

const VARIATION_STYLES: Record<PromptVariation, string> = {
  closeup:
    'epic cinematic close-up, face filling frame, intense eye contact, ' +
    'shallow depth of field f/1.2, golden sparks reflecting in eyes, ' +
    'warm rim lighting with atmospheric particles floating around face',
  halfbody:
    'cinematic half-body portrait, dynamic heroic pose, ' +
    'detailed environmental context with depth and atmosphere, ' +
    'volumetric light rays cutting through haze, ' +
    'floating embers and golden particles in the air, ' +
    'professional film lighting with practical light sources',
  dramatic:
    'ultra-wide cinematic shot, full costume and epic environment visible, ' +
    'dramatic golden hour with long shadows, volumetric fog and dust particles, ' +
    'sparks and embers swirling around the subject, ' +
    'heroic low-angle composition, lens flare from backlight, ' +
    'blockbuster movie still quality',
};

// ── Base atmosphere (shared across all variations) ────────────────────────────
const ATMOSPHERE =
  'shot on ARRI Alexa 65, anamorphic lens, 8K RAW, ' +
  'cinematic color grading, atmospheric haze and volumetric light, ' +
  'golden sparks and floating embers in the air, ' +
  'photorealistic skin with natural imperfections, ' +
  'rich environmental depth and texture, ' +
  'smooth plastic skin, airbrushed';

// ── Character costume & scene descriptions ──────────────────────────────────
const CHARACTER_DESCRIPTIONS: Record<string, string> = {
  // Superheroes
  'Spider-Man':       'as Spider-Man, wearing full red and blue spandex suit with web pattern details, perched on a rain-soaked rooftop ledge at dusk, city lights glowing below, golden sparks from electrical wires nearby, misty atmosphere',
  'Wonder Woman':     'as Wonder Woman, wearing golden tiara, red and gold breastplate, blue skirt with stars, lasso glowing at hip, standing in ancient Greek temple ruins at golden hour, dust particles and embers swirling in warm light',
  'Batman':           'as Batman, wearing black armored batsuit, dark cape billowing in wind, standing on gothic gargoyle overlooking foggy Gotham city at night, sparks from rooftop vents, neon reflections on wet surfaces',
  'Superman':         'as Superman, wearing iconic blue bodysuit with red cape billowing heroically, golden S-shield on chest, hovering above cloud layer at sunrise, golden sparks and light particles surrounding him, warm golden light from below',
  'Iron Man':         'as Iron Man, wearing red and gold metallic armor, glowing arc reactor on chest, helmet under arm, standing in high-tech workshop with holographic displays, welding sparks flying around, cool blue ambient light mixed with orange sparks',
  'Black Panther':    'as Black Panther, wearing sleek black vibranium armor with purple energy trim, panther claw necklace, standing in lush Wakandan jungle, bioluminescent plants glowing, purple energy sparks crackling from suit, misty atmosphere',
  'Captain America':  'as Captain America, wearing blue tactical uniform with star on chest, holding iconic shield reflecting golden light, standing on battlefield at dawn, embers and sparks rising from fires behind, morning mist rising, dramatic backlight',
  'Thor':             'as Thor, wearing Norse warrior armor with red cape, holding Mjolnir hammer crackling with lightning and sparks, standing on Bifrost bridge, aurora borealis in sky, electric sparks swirling everywhere, epic storm clouds',
  'The Flash':        'as The Flash, wearing scarlet red bodysuit with golden lightning bolt, speed lightning and golden sparks trailing behind, running through rain-soaked city street at night, electricity arcing around',
  'Aquaman':          'as Aquaman, wearing orange and green scale armor reflecting light, holding golden trident with energy sparks at tip, standing on rocky ocean cliff, massive waves crashing, dramatic stormy sky with lightning, sea spray and sparks in air',
  'Hulk':             'as the Hulk, massive green muscular body, torn purple pants, standing in destroyed urban landscape, fire sparks and embers floating everywhere, dust and debris in air, dramatic sunset backlighting through smoke',
  'Doctor Strange':   'as Doctor Strange, wearing burgundy Cloak of Levitation, Eye of Agamotto glowing, conjuring orange magical mandalas with sparks and energy particles, floating in mystical dimension with fractured reality and magical embers around',

  // Professions
  'Firefighter':      'as a firefighter, wearing yellow turnout coat and helmet with visor, breathing apparatus ready, standing before a massive blazing fire, intense orange flames and sparks reflecting off gear, burning embers swirling in air, smoke and fire particles everywhere',
  'Nurse':            'as a nurse, wearing teal medical scrubs, stethoscope around neck, in modern hospital corridor with dramatic lighting, soft warm light particles floating, caring determined expression, atmospheric hospital ambiance',
  'Astronaut':        'as an astronaut, wearing white NASA spacesuit with mission patches, clear helmet visor reflecting Earth, floating in space station cupola, Earth glowing blue below, golden sun particles and lens flare, stars sparkling',
  'Chef':             'as a chef, wearing white chef uniform and tall toque hat, flames and sparks rising dramatically from a pan mid-flip, professional kitchen with copper pots, warm amber fire glow, steam and fire sparks dancing in air',
  'Police Officer':   'as a police officer, wearing dark blue uniform with badge, utility belt, standing by patrol car at dusk, red and blue lights casting dramatic colored light and sparks of reflection, atmospheric urban street scene with haze',
  'Teacher':          'as a teacher, wearing smart professional attire, standing by large chalkboard covered in equations, warm golden classroom light streaming through tall windows, dust particles dancing in golden light beams like sparks',
  'Doctor':           'as a doctor, wearing white coat with stethoscope, standing in modern surgical suite, dramatic blue-green lighting with lens flare from surgical lights, light particles floating, professional focused expression',
  'Pilot':            'as a pilot, wearing captain uniform with epaulettes, standing on tarmac at sunset, massive aircraft behind, golden hour light and heat shimmer sparks reflecting off plane fuselage, dramatic sky with warm particles',
  'Engineer':         'as an engineer, wearing hard hat and reflective vest, holding blueprints, standing on steel skyscraper framework at sunrise, welding sparks flying nearby, city skyline panorama below, wind-swept clouds and golden light',
  'Veterinarian':     'as a veterinarian, wearing scrubs, gently holding a small animal, in warm veterinary clinic, soft golden window light with floating dust particles like sparks, shelves with supplies in background, compassionate expression',
  'Artist':           'as an artist, wearing paint-splattered apron, holding palette and brush, standing in sunlit studio with massive canvases, colorful paint splashes everywhere, golden afternoon light streaming in with particles dancing like sparks',
  'Scientist':        'as a scientist, wearing lab coat and safety goggles, holding glowing test tube with sparks of chemical reaction, in dimly lit laboratory, colorful chemical reactions bubbling with energy sparks, dramatic colored lighting',

  // Fairy Tales
  'Cinderella':       'as Cinderella, wearing shimmering light blue ball gown with glass slippers, descending grand marble staircase, magical golden sparkles and fairy dust swirling around like embers, moonlit castle ballroom, chandeliers casting prismatic light sparks',
  'Peter Pan':        'as Peter Pan, wearing green tunic with pointy hat and feather, flying above moonlit London rooftops, Big Ben in background, starry night sky with fairy dust trail glowing like golden sparks, magical particles everywhere',
  'Snow White':       'as Snow White, wearing yellow and blue royal gown with red bow headband, standing in enchanted forest clearing, magical golden light particles floating like fireflies and sparks, soft dappled sunlight through ancient trees',
  'Little Red Riding Hood': 'as Little Red Riding Hood, wearing flowing red hooded cape over white dress, holding basket, walking through misty dark forest path, magical golden light sparks breaking through tall trees, fireflies glowing like embers',
  'Rapunzel':         'as Rapunzel, wearing purple dress with long flowing golden hair cascading down tower, hundreds of floating lanterns rising into twilight sky like golden sparks and embers, warm magical glow everywhere',
  'Pinocchio':        'as Pinocchio, wearing tyrolian hat and suspenders, wooden puppet details, in old Italian puppet workshop, warm candlelight casting golden sparks, wooden toys and tools on shelves, magical fairy dust particles in cozy atmosphere',
  'Beauty & the Beast': 'as Belle, wearing iconic golden ball gown, dancing in enchanted castle ballroom, magical rose glowing under glass dome with golden sparks rising from it, warm candlelit atmosphere, falling rose petals and magical embers',
  'The Little Mermaid': 'as Ariel, wearing mermaid costume with teal sequined tail, sitting on rocky shore at sunset, waves crashing with golden light sparks on water, sea foam spray catching golden light, magical underwater sparkles',
  'Sleeping Beauty':  'as Aurora, wearing flowing pink and blue magical gown with golden crown, in enchanted castle garden, roses blooming everywhere, golden fairy sparkles and magical embers floating in dreamy fog, enchanted atmosphere',
  'Hansel & Gretel':  'as Hansel, wearing Bavarian folk costume, standing before magical gingerbread house in dark forest, candy decorations glowing with magical sparks, mysterious fog with floating embers, fairy tale atmosphere',
  'Aladdin':          'as Aladdin, wearing purple vest and red fez, riding magic carpet above moonlit Arabian city, golden magic lamp glowing with sparks and magical embers, palace domes below, starry desert sky with golden particles',
  'Jack and the Beanstalk': 'as Jack, wearing medieval peasant costume, climbing enormous beanstalk above the clouds, magical golden sparks and light particles swirling around beanstalk, dramatic clouds, golden light from above like embers',
};

// ── Trigger word used during LoRA training ────────────────────────────────────
export const LORA_TRIGGER = 'MEMRLS';

// ── Build a full prompt for a single character + variation ─────────────────────
export function buildPrompt(params: {
  characterName: string;
  aiLabel: string;        // e.g. "child_male" from computeAiLabel()
  aiOverride?: string;    // admin global override
  variation?: PromptVariation;
  customPrompt?: string;  // fully custom prompt (overrides everything)
}): string {
  // If a fully custom prompt is provided, use it directly
  if (params.customPrompt?.trim()) {
    return params.customPrompt.trim();
  }

  const scene = CHARACTER_DESCRIPTIONS[params.characterName]
    ?? `as ${params.characterName}, in a cinematic environment with golden sparks and atmospheric particles`;

  const variation = params.variation ?? 'closeup';
  const style = VARIATION_STYLES[variation];

  const override = params.aiOverride?.trim()
    ? `, ${params.aiOverride.trim()}`
    : '';

  return (
    `Ultra-realistic cinematic photography of ${LORA_TRIGGER}, a ${params.aiLabel}, ` +
    `${scene}${override}. ` +
    `${style}. ${ATMOSPHERE}`
  );
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, ' +
  'jpeg artifacts, smooth plastic skin, airbrushed, stock photo look';
