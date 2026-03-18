// ── Prompt Variations ─────────────────────────────────────────────────────────
// Two cinematic variations per character for selection
export const VARIATIONS = ['variation_a', 'variation_b'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

const VARIATION_MODIFIERS: Record<PromptVariation, string> = {
  variation_a:
    'Cinematic wide shot, heroic low-angle composition, golden hour rim lighting, ' +
    'volumetric fog and floating embers, dramatic lens flare from backlight',
  variation_b:
    'Dynamic three-quarter shot, dramatic side lighting with warm and cool contrast, ' +
    'atmospheric haze with glowing particles, epic depth of field with bokeh highlights',
};

// ── Base atmosphere (shared across all prompts) ──────────────────────────────
const ATMOSPHERE =
  'shot on ARRI Alexa 65, anamorphic lens, 8K RAW, ultra-realistic, ' +
  'cinematic color grading, photorealistic skin with natural imperfections, ' +
  'sharp focus on face, rich environmental depth and texture';

// ── Character scene descriptions ─────────────────────────────────────────────
const CHARACTER_DESCRIPTIONS: Record<string, string> = {
  // ── Superheroes ──
  'Spider-Man':
    'swings between glowing skyscrapers at dusk, his ultra-realistic suit showcasing detailed webbing and vibrant red and blue colors. His pose emphasizes agility as the spotlight reflects off his suit, and magical glowing webs leave shimmering trails in the air. The city lights below twinkle brightly, creating a dramatic and captivating background',

  'Iron Man':
    'hovers in mid-air with arms extended, glowing repulsors charging in his hands. His ultra-realistic red and gold suit shines with reflective metallic textures, and sparks of magical energy surround him. The background features a futuristic city illuminated by neon lights and glowing blue energy trails',

  'Captain America':
    'stands on a glowing battlefield, wearing the iconic bright blue Captain America suit with a bold white star on the chest, red and white stripes on the torso, and a blue helmet with an A insignia. He holds the round red-white-and-blue vibranium shield that pulses with a radiant blue glow. His heroic stance is illuminated by golden light from the setting sun. Floating sparks and glowing dust particles fill the air, enhancing the fantasy-like atmosphere',

  'Thor':
    'stands atop a rocky mountain, gripping a glowing Mjolnir that crackles with vibrant blue lightning. His ultra-realistic Asgardian armor gleams with intricate metallic designs, and his red cape flows majestically behind him. The background features swirling storm clouds illuminated by magical streaks of energy and glowing stars',

  'Doctor Strange':
    'hovers mid-air with glowing magical symbols forming around his hands. His ultra-realistic cloak flows dramatically, its edges faintly glowing with golden light. The background features a swirling portal surrounded by glowing runes and vibrant cosmic energy, highlighting the mystical elements',

  'Superman':
    'soars above a magical valley bathed in golden sunlight. His ultra-realistic suit glows faintly with reflective details, and his red cape flows powerfully behind him. The background features radiant beams of light streaming from the sky, with glowing fireflies and sparkling clouds adding a touch of enchantment',

  'Batman':
    'stands on a glowing rooftop overlooking a fantastical Gotham City. His ultra-realistic armored suit reflects the faint glow of the Bat-Signal shining in the sky. Mystical fog and glowing bats surround him, capturing his heroic stance in this atmospheric, magical setting',

  'The Flash':
    'runs through a futuristic street surrounded by glowing lightning trails. His ultra-realistic red suit features golden lightning bolts that pulse with energy. Vibrant streaks of light and magical energy flow dynamically around him as he moves at incredible speed',

  'Black Panther':
    'stands in a glowing Wakandan jungle, his ultra-realistic black vibranium suit pulsing with purple energy. Bioluminescent plants glow around him, and energy sparks crackle from his suit. The mystical atmosphere is enhanced by floating particles and a moonlit sky above',

  'Hulk':
    'stands in a destroyed urban landscape, his massive green muscular body ultra-realistically detailed. Fire sparks and embers float everywhere, dust and debris swirl in the air. Dramatic sunset backlighting through smoke creates an epic, powerful atmosphere',

  'Aquaman':
    'stands on a rocky ocean cliff, wearing ultra-realistic orange and green scale armor. He holds a golden trident with energy sparks at its tip. Massive waves crash behind him against a dramatic stormy sky with lightning, sea spray and golden sparks filling the air',

  'Wonder Woman':
    'stands in ancient Greek temple ruins at golden hour, wearing ultra-realistic golden tiara, red and gold breastplate, and blue skirt with stars. Her lasso glows at her hip. Dust particles and golden embers swirl in the warm light, creating a powerful and magical atmosphere',

  'Green Arrow':
    'stands in an enchanted forest filled with glowing plants and magical mist. His ultra-realistic green suit is detailed with leather textures and metallic accents. He draws a glowing, radiant arrow, ready to strike with precision, as shimmering light surrounds him',

  // ── Fantasy & Movies ──
  'Harry Potter':
    'stands in the middle of a glowing magical library. His ultra-realistic Hogwarts robe is detailed with fine textures, and his iconic lightning-shaped scar glows faintly on his forehead. He holds a glowing wand, surrounded by floating books and radiant golden sparks, with a vibrant magical aura illuminating the scene',

  'Jack Sparrow':
    'stands on the deck of a glowing pirate ship under a starry sky. His ultra-realistic pirate costume features leather textures, a detailed tricorn hat, and shimmering golden details. He holds a glowing sword, surrounded by radiant treasure chests and floating magical lanterns, with the ocean reflecting the starlight',

  'Avatar':
    'stands in a lush glowing forest on Pandora. His ultra-realistic blue skin is detailed with bioluminescent patterns. He holds a bow made of glowing materials, surrounded by luminous plants and floating seeds of Eywa. The background captures the magical beauty of Pandora\'s jungles, with a glowing night sky above',

  'Dragon Rider':
    'sits confidently atop a massive, ultra-realistic dragon. He wears detailed leather armor with dragon scales embedded into the design. The dragon\'s glowing eyes and fiery breath light up the scene, while the background features a stormy sky and a distant, burning castle',

  'Aladdin':
    'stands atop a glowing magic carpet, flying high above a mystical Arabian city. His ultra-realistic outfit is detailed with embroidered patterns and shimmering accents. The glowing stars and crescent moon create a magical night sky, while radiant golden dust trails follow the carpet\'s path',

  'Peter Pan':
    'flies above moonlit London rooftops, wearing an ultra-realistic green tunic with pointy hat and feather. Big Ben glows in the background under a starry night sky. A fairy dust trail glows like golden sparks behind him, with magical particles everywhere',

  // ── Professions ──
  'Firefighter':
    'stands before a massive blazing fire, wearing ultra-realistic yellow turnout coat and helmet with visor. Intense orange flames and sparks reflect off his gear, burning embers swirl in the air, smoke and fire particles create a dramatic, heroic atmosphere',

  'Astronaut':
    'stands proudly on the surface of the moon, wearing an ultra-realistic space suit. His helmet reflects the Earth in the distance, while his hands hold a small flag. The background features the vastness of space with glowing stars and distant planets, creating an awe-inspiring and breathtaking scene',

  'Pilot':
    'stands proudly next to a modern jet on an expansive airfield. He wears a perfectly detailed, ultra-realistic pilot uniform, complete with patches and a helmet under his arm. The background shows a clear blue sky and other jets preparing for takeoff, emphasizing professionalism and determination',

  'Chef':
    'stands in a professional kitchen, wearing ultra-realistic white chef uniform and tall toque hat. Flames and sparks rise dramatically from a pan mid-flip. Copper pots gleam in warm amber fire glow, steam and fire sparks dance in the air creating an exciting culinary atmosphere',

  'Police Officer':
    'stands by a patrol car at dusk, wearing ultra-realistic dark blue uniform with badge and utility belt. Red and blue lights cast dramatic colored shadows and sparks of reflection. The atmospheric urban street scene is enhanced by haze and glowing city lights',

  'Doctor':
    'stands in a modern surgical suite, wearing ultra-realistic white coat with stethoscope. Dramatic blue-green lighting with lens flare from surgical lights creates a professional atmosphere. Light particles float in the air, medical monitors glow in the background',

  'Scientist':
    'stands in a high-tech laboratory surrounded by glowing equipment and bubbling beakers. He wears an ultra-realistic white lab coat, goggles, and gloves, carefully pouring a radiant, glowing liquid into a test tube. Advanced monitors and shelves filled with scientific instruments emphasize a futuristic and innovative atmosphere',

  'Teacher':
    'stands by a large chalkboard covered in equations, wearing ultra-realistic smart professional attire. Warm golden classroom light streams through tall windows, dust particles dance in golden light beams like sparks, creating an inspiring educational atmosphere',

  'Nurse':
    'stands in a modern hospital corridor, wearing ultra-realistic teal medical scrubs with stethoscope around neck. Soft warm light particles float in the air, creating a caring and atmospheric hospital ambiance',

  'Engineer':
    'stands on a steel skyscraper framework at sunrise, wearing ultra-realistic hard hat and reflective vest, holding blueprints. Welding sparks fly nearby, city skyline panorama below, wind-swept clouds and golden light create an epic construction scene',

  'Veterinarian':
    'stands in a warm veterinary clinic, wearing ultra-realistic scrubs, gently holding a small animal. Soft golden window light with floating dust particles, shelves with supplies in background, creating a compassionate and warm atmosphere',

  'Artist':
    'stands in a sunlit studio with massive canvases, wearing ultra-realistic paint-splattered apron, holding palette and brush. Colorful paint splashes everywhere, golden afternoon light streams in with particles dancing like sparks',

  // ── Sports ──
  'Football Player':
    'is captured mid-celebration after scoring a goal, wearing an ultra-realistic football jersey with matching shorts and cleats. His arms are raised triumphantly as he runs along the field, face glowing with excitement. The background features a packed stadium with waving flags, cheering fans, and the goalpost, creating an energetic and realistic atmosphere',

  'Basketball Player':
    'dribbles a basketball on a polished indoor court, wearing an ultra-realistic jersey paired with matching shorts and high-top sneakers. The background shows the hardwood floor reflecting gym lights, with cheering fans in the stands and a hoop visible in the distance',

  'Rock Singer':
    'performs passionately on stage, captured from the audience perspective. He wears an ultra-realistic leather jacket, ripped jeans, and a band t-shirt, holding a microphone in one hand. The stage is illuminated by dynamic red, blue, and white spotlights, while silhouettes of a cheering crowd with raised hands fill the foreground, enhancing the excitement of the live performance',

  // ── Fairy Tales ──
  'Cinderella':
    'descends a grand marble staircase wearing a shimmering ultra-realistic light blue ball gown with glass slippers. Magical golden sparkles and fairy dust swirl around like embers. The moonlit castle ballroom glows with chandeliers casting prismatic light sparks',

  'Snow White':
    'stands in an enchanted forest clearing wearing an ultra-realistic yellow and blue royal gown with red bow headband. Magical golden light particles float like fireflies and sparks, soft dappled sunlight filters through ancient trees',

  'Little Red Riding Hood':
    'walks through a misty dark forest path wearing a flowing ultra-realistic red hooded cape over white dress, holding a basket. Magical golden light sparks break through tall trees, fireflies glow like embers creating a mystical fairy tale atmosphere',

  'Rapunzel':
    'stands at a tower window wearing an ultra-realistic purple dress with long flowing golden hair cascading down. Hundreds of floating lanterns rise into the twilight sky like golden sparks and embers, warm magical glow fills the entire scene',

  'Pinocchio':
    'stands in an old Italian puppet workshop wearing ultra-realistic tyrolian hat and suspenders with wooden puppet details. Warm candlelight casts golden sparks, wooden toys and tools line the shelves in a cozy, magical atmosphere',

  'Beauty & the Beast':
    'dances in an enchanted castle ballroom wearing an iconic ultra-realistic golden ball gown. A magical rose glows under a glass dome nearby with golden sparks rising from it. Warm candlelit atmosphere with falling rose petals and magical embers',

  'The Little Mermaid':
    'sits on a rocky shore at sunset wearing ultra-realistic mermaid costume with teal sequined tail. Waves crash with golden light sparks on water, sea foam spray catches golden light, magical underwater sparkles shimmer everywhere',

  'Sleeping Beauty':
    'stands in an enchanted castle garden wearing a flowing ultra-realistic pink and blue magical gown with golden crown. Roses bloom everywhere, golden fairy sparkles and magical embers float in dreamy fog',

  'Hansel & Gretel':
    'stands before a magical gingerbread house in a dark forest wearing ultra-realistic Bavarian folk costume. Candy decorations glow with magical sparks, mysterious fog with floating embers creates a fairy tale atmosphere',

  'Jack and the Beanstalk':
    'climbs an enormous beanstalk above the clouds wearing ultra-realistic medieval peasant costume. Magical golden sparks and light particles swirl around the beanstalk, dramatic clouds part to reveal golden light from above',
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

  const scene = CHARACTER_DESCRIPTIONS[params.characterName]
    ?? `in a cinematic environment with golden sparks and atmospheric particles`;

  const variation = params.variation ?? 'variation_a';
  const style = VARIATION_MODIFIERS[variation];

  const override = params.aiOverride?.trim()
    ? `, ${params.aiOverride.trim()}`
    : '';

  return (
    `${LORA_TRIGGER}, a ${params.aiLabel} ${params.characterName}, ${scene}${override}. ` +
    `${style}. ${ATMOSPHERE}`
  );
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, ' +
  'jpeg artifacts, smooth plastic skin, airbrushed, stock photo look';
