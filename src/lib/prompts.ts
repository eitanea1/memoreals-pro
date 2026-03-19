// ── Prompt Variations ─────────────────────────────────────────────────────────
export const VARIATIONS = ['variation_a', 'variation_b'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

// ── Character prompts (without trigger word and age — those are prepended) ───
const CHARACTER_PROMPTS: Record<string, string> = {
  // ── Superheroes ──
  'Spider-Man':
    'Spider-Man, mask off face fully visible, swings between glowing skyscrapers at dusk, his ultra-realistic suit showcasing detailed webbing and vibrant red and blue colors. His pose emphasizes his agility as the spotlight reflects off his suit, and magical glowing webs leave shimmering trails in the air.',

  'Iron Man':
    'Iron Man, hovers in mid-air with his arms extended, glowing repulsors charging in his hands. His ultra-realistic red and gold suit shines with reflective metallic textures, and sparks of magical energy surround him.',

  'Captain America':
    'Captain America, stands on a glowing battlefield, holding a vibranium shield that pulses with a radiant blue glow. His ultra-realistic suit is detailed with subtle metallic accents, and his heroic stance is illuminated by golden light from the setting sun.',

  'Thor':
    'Thor, stands atop a rocky mountain, gripping a glowing Mjolnir that crackles with vibrant blue lightning. His ultra-realistic Asgardian armor gleams with intricate metallic designs, and his red cape flows majestically behind him.',

  'Doctor Strange':
    'Doctor Strange, hovers mid-air with glowing magical symbols forming around his hands. His ultra-realistic cloak flows dramatically, its edges faintly glowing with golden light.',

  'Superman':
    'Superman, soars above a magical valley bathed in golden sunlight. His ultra-realistic suit glows faintly with reflective details, and his red cape flows powerfully behind him.',

  'Batman':
    'Batman, mask off face fully visible, stands on a glowing rooftop overlooking a fantastical Gotham City. His ultra-realistic armored suit reflects the faint glow of the Bat-Signal shining in the sky.',

  'The Flash':
    'Flash, runs through a futuristic street surrounded by glowing lightning trails. His ultra-realistic red suit features golden lightning bolts that pulse with energy.',

  'Green Arrow':
    'Green Arrow, stands in an enchanted forest filled with glowing plants and magical mist. His ultra-realistic green suit is detailed with leather textures and metallic accents.',

  'Black Panther':
    'Black Panther, stands in a glowing Wakandan jungle, his ultra-realistic black vibranium suit pulsing with purple energy. Bioluminescent plants glow around him, and energy sparks crackle from his suit.',

  'Hulk':
    'Hulk, stands in a destroyed urban landscape, his massive green muscular body ultra-realistically detailed. Fire sparks and embers float everywhere, dust and debris swirl in the air with dramatic sunset backlighting.',

  'Aquaman':
    'Aquaman, stands on a rocky ocean cliff, wearing ultra-realistic orange and green scale armor. He holds a golden trident with energy sparks at its tip. Massive waves crash behind him against a dramatic stormy sky.',

  'Wonder Woman':
    'Wonder Woman, stands in ancient Greek temple ruins at golden hour, wearing ultra-realistic golden tiara, red and gold breastplate, and blue skirt with stars. Her lasso glows at her hip with dust particles and golden embers swirling.',

  // ── Fantasy & Movies ──
  'Harry Potter':
    'Harry Potter, stands in the middle of a glowing magical library. His ultra-realistic Hogwarts robe is detailed with fine textures, and his iconic lightning-shaped scar glows faintly on his forehead.',

  'Aladdin':
    'Aladdin, stands atop a glowing magic carpet, flying high above a mystical Arabian city. His ultra-realistic outfit is detailed with embroidered patterns and shimmering accents.',

  'Jack Sparrow':
    'Jack Sparrow, stands on the deck of a glowing pirate ship under a starry sky. His ultra-realistic pirate costume features leather textures, a detailed tricorn hat, and shimmering golden details.',

  'Avatar':
    'Avatar, stands in a lush glowing forest on Pandora. His ultra-realistic blue skin is detailed with bioluminescent patterns, and his tail and ears move naturally.',

  'Dragon Rider':
    'dragon rider, sits confidently atop a massive, ultra-realistic dragon from the world of Game of Thrones. He wears detailed leather armor with dragon scales embedded into the design.',

  'Peter Pan':
    'Peter Pan, flies above moonlit London rooftops with Big Ben in the background. His ultra-realistic green tunic and pointy hat with feather are detailed, with a fairy dust trail glowing like golden sparks behind him.',

  // ── Professions ──
  'Pilot':
    'pilot, stands proudly next to a modern jet on an expansive airfield. He wears a perfectly detailed, ultra-realistic pilot uniform, complete with patches and a helmet under his arm.',

  'Astronaut':
    'astronaut, stands proudly on the surface of the moon, wearing an ultra-realistic space suit. His helmet reflects the Earth in the distance, while his hands hold a small flag he planted.',

  'Firefighter':
    'firefighter, stands before a massive blazing fire, wearing ultra-realistic yellow turnout coat and helmet with visor. Intense orange flames and sparks reflect off his gear, burning embers swirl in the air.',

  'Chef':
    'chef, stands in a professional kitchen, wearing ultra-realistic white chef uniform and tall toque hat. Flames and sparks rise dramatically from a pan mid-flip, with copper pots gleaming in warm amber light.',

  'Police Officer':
    'police officer, stands by a patrol car at dusk, wearing ultra-realistic dark blue uniform with badge and utility belt. Red and blue lights cast dramatic colored shadows.',

  'Doctor':
    'doctor, stands in a modern surgical suite, wearing ultra-realistic white coat with stethoscope. Dramatic blue-green lighting with medical monitors glowing in the background.',

  'Scientist':
    'scientist, stands in a high-tech laboratory surrounded by glowing equipment and bubbling beakers. He wears an ultra-realistic white lab coat, goggles, and gloves.',

  'Teacher':
    'teacher, stands by a large chalkboard covered in equations, wearing ultra-realistic smart professional attire. Warm golden classroom light streams through tall windows.',

  'Nurse':
    'nurse, stands in a modern hospital corridor, wearing ultra-realistic teal medical scrubs with stethoscope around neck. Soft warm light creates a caring atmosphere.',

  'Engineer':
    'engineer, stands on a steel skyscraper framework at sunrise, wearing ultra-realistic hard hat and reflective vest, holding blueprints. Welding sparks fly nearby with city skyline below.',

  'Veterinarian':
    'veterinarian, stands in a warm veterinary clinic, wearing ultra-realistic scrubs, gently holding a small animal. Soft golden window light fills the scene.',

  'Artist':
    'artist, stands in a sunlit studio with massive canvases, wearing ultra-realistic paint-splattered apron, holding palette and brush. Colorful paint splashes everywhere with golden afternoon light.',

  // ── Sports & Entertainment ──
  'Football Player':
    'football player, is captured mid-celebration after scoring a goal. He wears an ultra-realistic football jersey, complete with matching shorts and cleats. His arms are raised triumphantly as he runs along the field.',

  'Basketball Player':
    'basketball player, dribbles a basketball on a polished indoor court. He wears an ultra-realistic jersey paired with matching shorts and high-top sneakers. The hardwood floor reflects the gym lights.',

  'Rock Singer':
    'rock singer, is captured from the audience\'s perspective as he performs passionately on stage. He wears an ultra-realistic leather jacket, ripped jeans, and a band t-shirt.',

  // ── Fairy Tales ──
  'Cinderella':
    'Cinderella, descends a grand marble staircase wearing a shimmering ultra-realistic light blue ball gown with glass slippers. Magical golden sparkles and fairy dust swirl around.',

  'Snow White':
    'Snow White, stands in an enchanted forest clearing wearing an ultra-realistic yellow and blue royal gown with red bow headband. Magical golden light particles float like fireflies.',

  'Little Red Riding Hood':
    'Little Red Riding Hood, walks through a misty dark forest path wearing a flowing ultra-realistic red hooded cape over white dress, holding a basket. Magical golden light sparks break through tall trees.',

  'Rapunzel':
    'Rapunzel, stands at a tower window wearing an ultra-realistic purple dress with long flowing golden hair cascading down. Hundreds of floating lanterns rise into the twilight sky like golden sparks.',

  'Pinocchio':
    'Pinocchio, stands in an old Italian puppet workshop wearing ultra-realistic tyrolian hat and suspenders with wooden puppet details. Warm candlelight casts golden sparks.',

  'Beauty & the Beast':
    'Belle, dances in an enchanted castle ballroom wearing an iconic ultra-realistic golden ball gown. A magical rose glows under a glass dome nearby with golden sparks rising from it.',

  'The Little Mermaid':
    'Ariel, sits on a rocky shore at sunset wearing ultra-realistic mermaid costume with teal sequined tail. Waves crash with golden light sparks on water.',

  'Sleeping Beauty':
    'Aurora, stands in an enchanted castle garden wearing a flowing ultra-realistic pink and blue magical gown with golden crown. Roses bloom everywhere with golden fairy sparkles.',

  'Hansel & Gretel':
    'Hansel, stands before a magical gingerbread house in a dark forest wearing ultra-realistic Bavarian folk costume. Candy decorations glow with magical sparks.',

  'Jack and the Beanstalk':
    'Jack, climbs an enormous beanstalk above the clouds wearing ultra-realistic medieval peasant costume. Magical golden sparks and light particles swirl around the beanstalk.',
};

// ── Trigger word used during LoRA training ────────────────────────────────────
export const LORA_TRIGGER = 'MEMRLS';

// ── Build a full prompt for a single character + variation ─────────────────────
export function buildPrompt(params: {
  characterName: string;
  aiLabel: string;        // e.g. "5-year-old boy" from computeAiLabel()
  aiOverride?: string;    // admin global override
  variation?: PromptVariation;
  customPrompt?: string;  // fully custom prompt (overrides everything)
}): string {
  if (params.customPrompt?.trim()) {
    return params.customPrompt.trim();
  }

  const scene = CHARACTER_PROMPTS[params.characterName]
    ?? `${params.characterName}, in a cinematic ultra-realistic scene with dramatic lighting and golden sparks.`;

  const override = params.aiOverride?.trim()
    ? ` ${params.aiOverride.trim()}`
    : '';

  return `${LORA_TRIGGER}, a ${params.aiLabel} ${scene}${override}`;
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, ' +
  'jpeg artifacts, smooth plastic skin, airbrushed, stock photo look';
