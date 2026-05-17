// ── Prompt Variations ─────────────────────────────────────────────────────────
export const VARIATIONS = ['variation_a', 'variation_b'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

// ── Character prompts (without trigger word and age — those are prepended) ───
// Template: "{character}, {action + scene}. {outfit}. Looking at camera. {lighting}. Floating sparks..."
const CHARACTER_PROMPTS: Record<string, string> = {
  // ── Superheroes ──
  'Spider-Man':
    'Spider-Man, mask off face fully visible, standing on a rooftop ledge above a glowing city at dusk. His ultra-realistic suit showcases detailed webbing and vibrant red and blue colors. Looking at camera. Golden hour lighting with city lights below. Floating sparks and glowing dust particles fill the air, enhancing the fantasy-like atmosphere.',

  'Iron Man':
    'Iron Man, helmet off, standing with one glowing repulsor raised. His ultra-realistic red and gold suit shines with reflective metallic textures, arc reactor glowing on chest. Looking at camera. Cinematic blue-orange lighting. Floating sparks and magical energy surround him, enhancing the fantasy-like atmosphere.',

  'Captain America':
    'Captain America, standing on a glowing battlefield, holding a vibranium shield that pulses with a radiant blue glow. His ultra-realistic suit is detailed with subtle metallic accents, and his heroic stance is illuminated by golden light from the setting sun. Looking at camera. Floating sparks and glowing dust particles fill the air, enhancing the fantasy-like atmosphere.',

  'Thor':
    'Thor, standing atop a rocky cliff gripping a glowing Mjolnir that crackles with vibrant blue lightning. His ultra-realistic Asgardian armor gleams with intricate metallic designs, red cape flowing behind. Looking at camera. Dramatic stormy sky lighting. Floating sparks and glowing dust particles fill the air, enhancing the fantasy-like atmosphere.',

  'Doctor Strange':
    'Doctor Strange, standing with glowing orange magical circles forming around his hands. His ultra-realistic Cloak of Levitation flows dramatically with Eye of Agamotto glowing. Looking at camera. Mystical warm golden lighting. Floating sparks and magical energy swirl around him, enhancing the fantasy-like atmosphere.',

  'Superman':
    'Superman, standing tall with fists at his sides on a mountain peak above clouds. His ultra-realistic blue suit glows faintly with reflective details, red cape flowing powerfully in the wind. Looking at camera. Warm golden sunlight from behind. Floating sparks and glowing dust particles fill the air, enhancing the fantasy-like atmosphere.',

  'Batman':
    'Batman, cowl off face fully visible, standing on a gothic rooftop with Bat-Signal glowing in the sky behind. His ultra-realistic dark armored batsuit reflects the moody city lights. Looking at camera. Moody blue-gray night lighting. Floating sparks and glowing dust particles fill the air, enhancing the fantasy-like atmosphere.',

  'The Flash':
    'The Flash, standing mid-stride with lightning trails behind him on a city street. His ultra-realistic red suit features golden lightning bolt emblem that pulses with energy. Looking at camera. Dynamic blue-orange speed effect lighting. Floating sparks and electric energy crackle around him, enhancing the fantasy-like atmosphere.',

  'Green Arrow':
    'Green Arrow, standing in a misty enchanted forest holding a bow with arrow drawn. His ultra-realistic green suit is detailed with leather textures and metallic accents. Looking at camera. Soft green forest light filtering through trees. Floating sparks and magical mist swirl around, enhancing the fantasy-like atmosphere.',

  'Black Panther':
    'Black Panther, mask off face fully visible, standing in a glowing Wakandan jungle. His ultra-realistic black vibranium suit pulses with purple energy lines. Looking at camera. Bioluminescent purple and blue lighting. Floating sparks and energy crackle from his suit, enhancing the fantasy-like atmosphere.',

  'Hulk':
    'Hulk, standing powerfully in a destroyed city street. His massive green muscular body is ultra-realistically detailed, wearing torn pants. Looking at camera. Dramatic sunset backlighting with warm orange tones. Floating sparks and embers fill the air, enhancing the fantasy-like atmosphere.',

  'Aquaman':
    'Aquaman, standing on ocean rocks holding a golden trident with energy at its tip, waves crashing behind. Wearing ultra-realistic orange and green scale armor. Looking at camera. Stormy dramatic lighting with ocean spray. Floating sparks and glowing water particles fill the air, enhancing the fantasy-like atmosphere.',

  'Wonder Woman':
    'Wonder Woman, standing in ancient Greek temple ruins at golden hour. Wearing ultra-realistic golden tiara, red and gold armor, blue skirt with stars, lasso glowing at hip. Looking at camera. Warm golden light. Floating sparks and glowing dust particles fill the air, enhancing the fantasy-like atmosphere.',

  // ── Fantasy & Movies ──
  'Harry Potter':
    'Harry Potter, standing in a grand magical library with floating candles and old books. Wearing ultra-realistic Hogwarts robe with Gryffindor scarf, holding a glowing wand. Looking at camera. Warm candlelight atmosphere. Floating sparks and magical particles drift through the air, enhancing the fantasy-like atmosphere.',

  'Aladdin':
    'Aladdin, standing on a magic carpet hovering above a moonlit Arabian city with domed palaces. Wearing ultra-realistic embroidered vest and baggy pants. Looking at camera. Warm moonlight and golden city glow. Floating sparks and magical dust particles fill the air, enhancing the fantasy-like atmosphere.',

  'Jack Sparrow':
    'Jack Sparrow, standing on the deck of a pirate ship under a starry night sky. Wearing ultra-realistic weathered pirate coat, tricorn hat, and beaded braids. Looking at camera. Moody lantern light on deck. Floating sparks and golden dust particles drift in the sea breeze, enhancing the fantasy-like atmosphere.',

  'Avatar':
    'Na\'vi Avatar, standing in a bioluminescent forest on Pandora at night. Ultra-realistic blue skin with glowing patterns, tribal outfit. Looking at camera. Ethereal blue and purple bioluminescent lighting. Floating sparks and glowing particles fill the air, enhancing the fantasy-like atmosphere.',

  'Dragon Rider':
    'dragon rider, sitting confidently atop a massive dragon on a cliff edge with a vast landscape below. Wearing ultra-realistic leather armor with dragon scale details. Looking at camera. Epic golden hour lighting with clouds. Floating sparks and embers rise from the dragon, enhancing the fantasy-like atmosphere.',

  'Peter Pan':
    'Peter Pan, hovering above moonlit London rooftops with Big Ben in the background. Wearing ultra-realistic green tunic and pointed hat with feather. Looking at camera. Magical moonlight glow. Floating fairy dust trail glowing like golden sparks behind him, enhancing the fantasy-like atmosphere.',

  // ── Professions ──
  'Pilot':
    'pilot, standing proudly next to a modern jet on an airfield at sunrise. Wearing ultra-realistic pilot uniform with patches, holding helmet under arm. Looking at camera. Warm sunrise lighting on tarmac.',

  'Astronaut':
    'astronaut, standing on the moon surface with Earth visible in the dark sky behind. Wearing ultra-realistic detailed white space suit, helmet visor up. Looking at camera. Dramatic space lighting with Earth glow.',

  'Firefighter':
    'firefighter, standing in front of a blazing fire with embers floating in the air. Wearing ultra-realistic yellow turnout coat and helmet. Looking at camera. Warm orange firelight on face.',

  'Chef':
    'chef, standing in a professional kitchen with flames rising from a pan. Wearing ultra-realistic white chef coat and tall toque hat, copper pots gleaming in background. Looking at camera. Warm amber kitchen lighting.',

  'Police Officer':
    'police officer, standing by a patrol car at dusk in an urban street. Wearing ultra-realistic dark blue uniform with badge and utility belt. Looking at camera. Red and blue light reflections, moody atmosphere.',

  'Doctor':
    'doctor, standing in a modern hospital corridor. Wearing ultra-realistic white coat with stethoscope around neck. Looking at camera. Clean blue-white hospital lighting.',

  'Scientist':
    'scientist, standing in a high-tech laboratory with glowing screens and beakers. Wearing ultra-realistic white lab coat and safety goggles on forehead. Looking at camera. Cool blue lab lighting with warm accent.',

  'Teacher':
    'teacher, standing by a chalkboard covered in equations in a warm classroom. Wearing ultra-realistic smart professional attire, holding chalk. Looking at camera. Warm golden light from tall windows.',

  'Nurse':
    'nurse, standing in a modern hospital ward. Wearing ultra-realistic teal medical scrubs with stethoscope around neck. Looking at camera. Soft warm caring atmosphere lighting.',

  'Engineer':
    'engineer, standing on a steel building framework at sunrise with city skyline below. Wearing ultra-realistic hard hat and reflective vest, holding blueprints. Looking at camera. Golden sunrise lighting.',

  'Veterinarian':
    'veterinarian, standing in a warm clinic gently holding a small puppy. Wearing ultra-realistic scrubs with stethoscope. Looking at camera. Soft golden window light.',

  'Artist':
    'artist, standing in a sunlit studio surrounded by large canvases. Wearing ultra-realistic paint-splattered apron, holding palette and brush. Looking at camera. Golden afternoon light with colorful paint splashes.',

  // ── Sports & Entertainment ──
  'Football Player':
    'football player, standing on a stadium pitch mid-celebration with arms raised. Wearing ultra-realistic team jersey, shorts and cleats. Looking at camera. Dramatic stadium floodlights.',

  'Basketball Player':
    'basketball player, standing on a polished indoor court holding a basketball. Wearing ultra-realistic jersey and high-top sneakers. Looking at camera. Dramatic gym lighting with floor reflections.',

  'Rock Singer':
    'rock singer, standing on a concert stage with spotlights and crowd silhouettes behind. Wearing ultra-realistic leather jacket and band t-shirt, holding microphone. Looking at camera. Dramatic stage lighting with colored beams.',

  // ── Fairy Tales ──
  'Cinderella':
    'Cinderella, descending a grand marble staircase in a palace ballroom. Wearing ultra-realistic shimmering light blue ball gown with glass slippers. Looking at camera. Magical golden sparkle lighting. Floating sparks and fairy dust swirl around, enhancing the fantasy-like atmosphere.',

  'Snow White':
    'Snow White, standing in an enchanted forest clearing with sunbeams breaking through. Wearing ultra-realistic yellow and blue royal gown with red bow headband. Looking at camera. Soft fairytale golden light. Floating golden particles drift like fireflies, enhancing the fantasy-like atmosphere.',

  'Little Red Riding Hood':
    'Little Red Riding Hood, walking through a misty dark forest path holding a basket. Wearing ultra-realistic flowing red hooded cape over white dress. Looking at camera. Atmospheric forest light breaking through trees. Floating golden light sparks drift between the trees, enhancing the fantasy-like atmosphere.',

  'Rapunzel':
    'Rapunzel, standing at a tower window with long flowing golden hair cascading down. Wearing ultra-realistic purple dress. Hundreds of floating lanterns rise into the twilight sky. Looking at camera. Warm lantern glow. Floating sparks and golden light particles fill the air, enhancing the fantasy-like atmosphere.',

  'Pinocchio':
    'Pinocchio, standing in an old Italian puppet workshop surrounded by wooden toys. Wearing ultra-realistic Tyrolean hat and suspenders. Looking at camera. Warm candlelight atmosphere. Floating golden sparks drift in the air, enhancing the fantasy-like atmosphere.',

  'Beauty & the Beast':
    'Belle, standing in an enchanted castle ballroom with a magical rose glowing under a glass dome nearby. Wearing ultra-realistic iconic golden ball gown. Looking at camera. Magical warm golden ballroom lighting. Floating sparks and golden particles rise from the rose, enhancing the fantasy-like atmosphere.',

  'The Little Mermaid':
    'Ariel, sitting on rocks by the ocean shore at sunset with waves gently crashing. Wearing ultra-realistic mermaid outfit with teal sequined details. Looking at camera. Warm sunset ocean lighting. Floating golden light sparks dance on the water, enhancing the fantasy-like atmosphere.',

  'Sleeping Beauty':
    'Aurora, standing in an enchanted castle garden full of blooming roses. Wearing ultra-realistic flowing pink and blue gown with golden crown. Looking at camera. Soft dreamy golden light. Floating fairy sparkles and golden particles fill the air, enhancing the fantasy-like atmosphere.',

  'Hansel & Gretel':
    'Hansel, standing before a magical gingerbread house in a dark enchanted forest. Wearing ultra-realistic Bavarian folk costume. Looking at camera. Warm magical glow from candy decorations. Floating golden sparks drift through the dark forest, enhancing the fantasy-like atmosphere.',

  'Jack and the Beanstalk':
    'Jack, climbing an enormous beanstalk high above the clouds. Wearing ultra-realistic medieval peasant tunic. Looking at camera. Epic golden light above clouds. Floating magical sparks and light particles swirl around the beanstalk, enhancing the fantasy-like atmosphere.',
};

// ── Trigger word used during LoRA training ────────────────────────────────────
export const LORA_TRIGGER = 'MRLSSUBJ';

// ── Angle/composition per variation ──────────────────────────────────────────
const VARIATION_ANGLES: Record<PromptVariation, string> = {
  variation_a: 'full body shot',
  variation_b: 'upper body portrait, close framing',
};

// ── Build a full prompt for a single character + variation ─────────────────────
export function buildPrompt(params: {
  characterName: string;
  aiLabel: string;        // e.g. "5-year-old boy" from computeAiLabel()
  aiOverride?: string;    // admin global override
  loraTrigger?: string;   // per-order trigger word (falls back to LORA_TRIGGER)
  variation?: PromptVariation;
  customPrompt?: string;  // fully custom prompt (overrides everything)
}): string {
  if (params.customPrompt?.trim()) {
    return params.customPrompt.trim();
  }

  const trigger = params.loraTrigger?.trim() || LORA_TRIGGER;
  const angle = params.variation ? VARIATION_ANGLES[params.variation] : VARIATION_ANGLES.variation_a;

  const scene = CHARACTER_PROMPTS[params.characterName]
    ?? `${params.characterName}, in a cinematic ultra-realistic scene with dramatic lighting and golden sparks.`;

  const override = params.aiOverride?.trim()
    ? ` ${params.aiOverride.trim()}`
    : '';

  return `Cinematic photorealistic portrait of ${trigger}, a ${params.aiLabel} ${scene} ${angle}.${override}`;
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, ' +
  'jpeg artifacts, smooth plastic skin, airbrushed, stock photo look';
