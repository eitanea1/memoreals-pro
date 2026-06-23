// ── Prompt Variations ─────────────────────────────────────────────────────────
export const VARIATIONS = ['variation_a', 'variation_b'] as const;
export type PromptVariation = (typeof VARIATIONS)[number];

// ── Winning prompts (faithful to the user's doc) ────────────────────────────────
// Source of truth: scripts/"פרומפטים גיבורי על.docx" — the prompts that always
// worked. Do NOT rewrite/compress them into a comma format or pile a quality tail
// on top (that made results worse). Each entry below is the doc text VERBATIM with
// only the lead templated: the doc began "{Name}, a ten-year-old {Character}, ..."
// → here {Name} becomes the LoRA trigger and "a ten-year-old" becomes "a {aiLabel}"
// (so it works for any kid / age / gender). The 22 from the doc are exact; the
// other characters are written in the SAME full-sentence narrative voice.
//
// buildPrompt produces:  "{trigger}, a {aiLabel} {SCENE}{closeup?}"
// so for Superman it reads exactly like the doc:
//   "MRLSSUBJ, a 7-year-old boy Superman, soars above a magical valley ... enchantment."
//
// Shared profession entries (Pilot, Astronaut, Scientist, …) are neutralised
// (no he/she) so the same name works for boys, girls, men and women — gender comes
// from {aiLabel}. Gendered hero entries keep the doc's wording.

const CHARACTER_PROMPTS: Record<string, string> = {
  // ── Superheroes — verbatim from the doc ──
  'Spider-Man':
    'Spider-Man, swings between glowing skyscrapers at dusk, the ultra-realistic suit showcasing detailed webbing and vibrant red and blue colors. The pose emphasizes agility as the spotlight reflects off the suit, and magical glowing webs leave shimmering trails in the air. The city lights below twinkle brightly, creating a dramatic and captivating background. The mask is off so the face is fully visible.',
  'Iron Man':
    'Iron Man, hovers in mid-air with arms extended, glowing repulsors charging in the hands. The ultra-realistic red and gold suit shines with reflective metallic textures, and sparks of magical energy surround the scene. The background features a futuristic city illuminated by neon lights and glowing blue energy trails. The helmet is off so the face is fully visible.',
  'Captain America':
    'Captain America, stands on a glowing battlefield, holding a vibranium shield that pulses with a radiant blue glow. The ultra-realistic suit is detailed with subtle metallic accents, and the heroic stance is illuminated by golden light from the setting sun. Floating sparks and glowing dust particles fill the air.',
  'Thor':
    'Thor, stands atop a rocky mountain, gripping a glowing Mjolnir that crackles with vibrant blue lightning. The ultra-realistic Asgardian armor gleams with intricate metallic designs, and a red cape flows majestically behind. The background features swirling storm clouds illuminated by magical streaks of energy and glowing stars.',
  'Doctor Strange':
    'Doctor Strange, hovers mid-air with glowing magical symbols forming around the hands. The ultra-realistic cloak flows dramatically, its edges faintly glowing with golden light. The background features a swirling portal surrounded by glowing runes and vibrant cosmic energy, highlighting the mystical elements.',
  'Superman':
    'Superman, soars above a magical valley bathed in golden sunlight. The ultra-realistic suit glows faintly with reflective details, and a red cape flows powerfully behind. The background features radiant beams of light streaming from the sky, with glowing fireflies and sparkling clouds adding a touch of enchantment.',
  'Batman':
    'Batman, stands on a glowing rooftop overlooking a fantastical Gotham City. The ultra-realistic armored suit reflects the faint glow of the Bat-Signal shining in the sky. Mystical fog and glowing bats surround the scene, capturing a heroic stance in this atmospheric, magical setting. The cowl is pulled back so the face is fully visible.',
  'The Flash':
    'The Flash, runs through a futuristic street surrounded by glowing lightning trails. The ultra-realistic red suit features golden lightning bolts that pulse with energy. The shot captures the motion, with vibrant streaks of light and magical energy flowing dynamically around the scene.',
  'Green Arrow':
    'Green Arrow, stands in an enchanted forest filled with glowing plants and magical mist. The ultra-realistic green suit is detailed with leather textures and metallic accents. The shot captures the drawing of a glowing, radiant arrow, ready to strike with precision, as shimmering light surrounds the scene.',
  'Harry Potter':
    'Harry Potter, stands in the middle of a glowing magical library. The ultra-realistic Hogwarts robe is detailed with fine textures, and the iconic lightning-shaped scar glows faintly on the forehead. Holding a glowing wand, surrounded by floating books and radiant golden sparks, with a vibrant magical aura illuminating the scene.',
  'Aladdin':
    "Aladdin, stands atop a glowing magic carpet, flying high above a mystical Arabian city. The ultra-realistic outfit is detailed with embroidered patterns and shimmering accents. The glowing stars and crescent moon create a magical night sky, while radiant golden dust trails follow the carpet's path.",
  'Jack Sparrow':
    'Jack Sparrow, stands on the deck of a glowing pirate ship under a starry sky. The ultra-realistic pirate costume features leather textures, a detailed tricorn hat, and shimmering golden details. Holding a glowing sword, surrounded by radiant treasure chests and floating magical lanterns, with the ocean reflecting the starlight.',
  'Pilot':
    'pilot, stands proudly next to a modern jet on an expansive airfield, wearing a perfectly detailed, ultra-realistic pilot uniform, complete with patches and a helmet held under the arm. The background shows a clear blue sky and other jets preparing for takeoff, emphasizing professionalism and determination.',
  'Football Champion':
    'football player, is captured mid-celebration after scoring a goal, wearing an ultra-realistic team jersey, complete with matching shorts and cleats. Arms raised triumphantly while running along the field, the face glowing with excitement. The background features a packed stadium with waving flags, cheering fans, and the goalpost behind, creating an energetic and realistic atmosphere.',
  'Basketball Player':
    'basketball player, dribbles a basketball on a polished indoor court, wearing an ultra-realistic jersey paired with matching shorts and high-top sneakers. The background shows the hardwood floor reflecting the gym lights, with cheering fans in the stands and a hoop visible in the distance.',
  'Astronaut':
    'astronaut, stands proudly on the surface of the moon, wearing an ultra-realistic space suit detailed with a flag patch. The helmet reflects the Earth in the distance, while the hands hold a small flag planted in the ground. The background features the vastness of space with glowing stars and distant planets, creating an awe-inspiring and breathtaking scene.',
  'Rock Singer':
    'rock singer, performs passionately on stage, wearing an ultra-realistic leather jacket, ripped jeans, and a band t-shirt, holding a microphone in one hand with a guitar strapped across the back. The stage is illuminated by dynamic red, blue, and white spotlights, while the silhouettes of a cheering crowd with raised hands fill the foreground, enhancing the excitement of the live performance.',
  'Scientist':
    'scientist, stands in a high-tech laboratory surrounded by glowing equipment and bubbling beakers, wearing an ultra-realistic white lab coat, goggles, and gloves, carefully pouring a radiant, glowing liquid into a test tube. The background features advanced monitors and shelves filled with scientific instruments, emphasizing a futuristic and innovative atmosphere.',
  'Avatar Navi':
    "Na'vi from the world of Avatar, stands in a lush glowing forest on Pandora. The ultra-realistic blue skin is detailed with bioluminescent patterns, and the tail and ears move naturally. Holding a bow made of glowing materials, surrounded by luminous plants and floating seeds of Eywa. The background captures the magical beauty of Pandora's jungles, with a glowing night sky above. The face is fully visible.",
  'Dragon Rider':
    "dragon rider, sits confidently atop a massive, ultra-realistic dragon from the world of Game of Thrones, wearing detailed leather armor with dragon scales embedded into the design. The dragon's glowing eyes and fiery breath light up the scene, while the background features a stormy sky and a distant, burning castle.",

  // ── More superheroes (same winning voice) ──
  'Hulk':
    'the Hulk, a massive muscular green-skinned hero, stands powerfully in a destroyed city street at sunset, wearing torn purple shorts. Dramatic sunset backlighting and floating embers fill the air, and the face is fully visible and recognizable.',
  'Aquaman':
    'Aquaman, stands on ocean rocks holding a glowing golden trident as waves crash dramatically behind. The ultra-realistic green and gold scale armor gleams with water droplets, beneath a stormy dramatic sky filled with glowing sea spray.',
  'Wonder Woman':
    'Wonder Woman, stands confidently in a strong heroic pose on an ancient battlefield at golden sunrise, holding a glowing Lasso of Truth. The intricately detailed gold and red armor gleams with polished metallic highlights, and glowing dust drifts through the warm radiant light.',
  'Captain Marvel':
    'Captain Marvel, hovers in a powerful pose with glowing cosmic energy radiating from the hands. The ultra-realistic red, blue and gold suit glows with energy, set against a starry cosmic sky streaked with magical light.',
  'Black Widow':
    'Black Widow, stands in a confident action pose in a moody industrial setting at night, wearing an ultra-realistic sleek black tactical suit with utility belts. Dramatic rim lighting and floating sparks fill the air.',
  'Batgirl':
    'Batgirl, stands confidently in a heroic pose on a gothic city rooftop at night as the glowing Bat-Signal lights up the dark sky. The sleek intricately detailed black batsuit has a glowing yellow bat emblem, a flowing dark cape and a utility belt, and the cowl is pulled back so the face is fully visible. Mystical fog and glowing bats surround the scene.',
  'Storm':
    'Storm, floats in mid-air with glowing white eyes and crackling lightning, hair billowing in the wind, wearing an ultra-realistic sleek black suit with a flowing cape. A dramatic stormy sky is alive with magical streaks of energy.',
  'Supergirl':
    'Supergirl, flies in a heroic pose above a glowing city skyline at golden hour, wearing an ultra-realistic blue suit with the iconic emblem and a red cape flowing behind. Radiant beams of light and sparkling clouds fill the sky.',
  'Scarlet Witch':
    'the Scarlet Witch, strikes a powerful pose with glowing crimson magic energy swirling around the hands, wearing an ultra-realistic red coat and crimson headpiece. The dark mystical setting is alive with radiant magical particles.',
  'Valkyrie':
    'an Asgardian Valkyrie warrior, stands on a misty battlefield holding a glowing sword, wearing ultra-realistic blue and silver armor with a flowing cape. Magical light beams pierce the mist.',

  // ── Boys anime ──
  'Dragon Ball Z Fighter':
    'a Super Saiyan fighter, strikes a powerful pose with glowing golden spiky hair and a blazing golden aura of energy, wearing an orange and blue martial-arts gi, on a rocky battlefield where power particles swirl in dramatic golden energy lighting.',
  'Vegeta Dragon Ball':
    'Vegeta, stands in a proud powerful stance with a glowing blue aura of energy and spiky black hair, wearing ultra-realistic blue and white Saiyan battle armor, with floating power sparks on a rocky cliff.',
  'Naruto Ninja':
    'a Naruto-style ninja, strikes a dynamic pose with glowing chakra energy swirling, wearing an ultra-realistic orange and black ninja outfit with a metal headband, in a hidden ninja village at dusk where leaves and sparks float in the air.',
  'Pokemon Trainer':
    'a young monster trainer, stands confidently on a grassy hill at sunrise holding a glowing red and white Poke Ball, wearing an ultra-realistic cap, jacket and backpack, in warm golden morning light with sparkles drifting.',
  'Avatar Airbender':
    'an airbending master, strikes a dynamic pose with swirling glowing air currents and blue arrow tattoos, wearing ultra-realistic orange and yellow air-nomad robes, on a mountaintop temple where clouds and sparks swirl around.',

  // ── Adventures ──
  'Peter Pan':
    'Peter Pan, hovers above moonlit London rooftops with Big Ben in the background, wearing an ultra-realistic green tunic and feathered cap. A glowing fairy-dust trail sparkles behind under a magical moonlit glow.',
  'Hercules':
    'the legendary hero Hercules, strikes a powerful heroic pose at an ancient Greek temple at golden hour, wearing ultra-realistic bronze and leather armor with a red cape. Warm golden torchlight and floating embers fill the scene.',
  'Mowgli':
    'Mowgli, stands in a lush glowing jungle at dawn beside a friendly wolf, wearing a simple red loincloth, surrounded by fireflies as dappled golden sunlight streams through the dense canopy.',
  'Robin Hood':
    'Robin Hood, draws a bow with a glowing arrow in a misty enchanted forest, wearing an ultra-realistic green hooded tunic with leather details and a quiver of arrows, as soft green light filters through the trees.',
  'Ninja Turtle Fighter':
    'a heroic ninja-turtle warrior, strikes a dynamic action pose in a neon-lit city alley at night, wearing a colored eye mask and ninja gear with weapons, surrounded by vibrant neon green and purple lighting with floating sparks.',
  'Optimus Prime':
    'a giant heroic Transformer robot in the style of Optimus Prime, stands in a futuristic city with glowing blue eyes and ultra-realistic red and blue metallic armor plating, in cinematic blue and orange lighting with sparks and energy crackling.',
  'Indiana Jones':
    'an adventurous archaeologist explorer in the style of Indiana Jones, stands in an ancient torch-lit temple ruin filled with golden artifacts, holding a whip, wearing an ultra-realistic leather jacket and fedora, as dust particles float in the warm torchlight.',
  'James Bond':
    'a suave secret agent in the style of James Bond, stands in a sleek black tuxedo at a glamorous casino at night, holding a pistol, in dramatic moody lighting with warm bokeh.',
  'Drunk Pirate':
    'a jolly tipsy pirate with a comedic grin, stumbles on a tavern ship deck holding a bottle, wearing an ultra-realistic weathered pirate coat and hat, in warm lantern light with floating golden dust.',
  'Lara Croft':
    'an adventurous explorer in the style of Lara Croft, stands in an ancient jungle temple holding dual pistols, wearing a tank top and cargo shorts with adventure gear, as shafts of golden light and floating dust fill the ruins.',
  'Spy':
    'a sleek elegant spy, stands in a glamorous gown at a high-society event at night holding a small concealed pistol, in dramatic moody lighting with shimmering bokeh.',
  'Pirate Captain':
    'a bold pirate captain, stands at the helm of a ship under a dramatic stormy sky, wearing an ultra-realistic ornate pirate coat and feathered hat, as sea spray flies and lanterns glow swinging in the wind.',

  // ── Boys premium ──
  'Medieval Knight':
    'a medieval knight, stands in shining silver plate armor in a grand castle courtyard at golden hour, holding a gleaming sword, in golden sunrise backlighting with floating dust particles.',
  'Prince King':
    'a royal prince, stands in a grand palace throne room, wearing an ultra-realistic ornate royal outfit with a golden crown and a regal velvet cape, in warm golden chandelier light with floating golden dust.',
  'Viking Dragon Rider':
    "a young Viking dragon rider, sits confidently atop a majestic dragon on a cliff at sunset, wearing ultra-realistic fur-lined leather armor with dragon-scale details. The dragon's glowing eyes light the scene under epic golden-hour clouds.",
  'Kung Fu Master':
    'a kung fu master, holds a powerful martial-arts stance in a misty ancient temple courtyard at dawn, wearing an ultra-realistic traditional martial-arts robe, as cherry-blossom petals float in the soft morning mist.',
  'Sherlock Detective':
    'a clever detective in the style of Sherlock Holmes, stands on a foggy Victorian London street at night under a glowing gas lamp, holding a magnifying glass, wearing an ultra-realistic tweed coat and deerstalker cap, in moody atmospheric light.',
  'Race Driver':
    'a race-car driver, stands confidently beside a sleek formula race car on a track, holding a helmet, wearing an ultra-realistic racing suit covered in sponsor patches, in dramatic stadium lighting.',
  'Secret Agent':
    'a sharp secret agent, stands in a sleek black tuxedo in a glamorous casino at night, holding a pistol, in dramatic moody lighting with warm bokeh.',
  'Samurai Warrior':
    'a samurai warrior, stands in a blossoming cherry-blossom courtyard holding a gleaming katana, wearing ultra-realistic traditional samurai armor, as pink petals fall in soft golden light.',
  'Cowboy':
    'a cowboy, stands in a golden desert canyon at sunset, wearing an ultra-realistic cowboy hat, leather vest and boots, in warm dusty light with drifting particles.',
  'Roman Gladiator':
    'a Roman gladiator, stands in a sunlit Colosseum arena with dust in the air, holding a sword and shield, wearing ultra-realistic leather and bronze armor in dramatic golden light.',
  'Motorcycle Rider':
    'a cool motorcycle rider, stands beside a powerful motorcycle on a neon-lit city street at night, wearing an ultra-realistic black leather riding jacket, amid vibrant neon reflections and floating sparks.',
  'Pro Surfer':
    'a pro surfer, stands on the beach at golden sunset holding a tall surfboard upright, big ocean waves breaking behind, wearing a wetsuit with water droplets glistening in the warm radiant backlight.',
  'Viking Berserker':
    'a fierce Viking warrior, stands on a rugged northern shore with stormy seas, holding a battle axe, wearing an ultra-realistic fur cloak and iron armor with braided hair, in dramatic storm light and sea spray.',
  'Horse Rider Knight':
    'a knight, rides a majestic horse galloping through a grand field at golden hour, wearing ultra-realistic gleaming armor, as dust and golden light are kicked up around the gallop.',

  // ── Girls — princesses & fairy tales ──
  'Cinderella':
    'Cinderella, stands on a grand marble staircase inside a magnificent palace ballroom with golden chandeliers and ornate columns, wearing an exquisitely detailed shimmering light-blue ball gown with layered tulle and sparkling glass slippers, hair in an elegant updo, in glowing golden light with floating sparkles.',
  'Snow White':
    'Snow White, stands in an enchanted sunlit forest clearing with birds and deer, wearing an ultra-realistic yellow and blue royal gown with a red bow headband, in soft magical light with drifting glowing pollen.',
  'Rapunzel':
    'Rapunzel, stands at a tower window with long flowing golden hair as hundreds of glowing floating lanterns rise into the twilight sky, wearing an ultra-realistic purple dress in the warm radiant lantern glow.',
  'Elsa Frozen':
    'Elsa, stands inside a vast glowing ice palace with towering frozen crystal pillars and shimmering frost-covered walls, glowing frost magic swirling from the hands, wearing a sparkling ice-blue gown and a long flowing translucent cape glowing with magical light, platinum-blonde hair in a side braid.',
  'Moana':
    'Moana, stands on a tropical beach at golden sunset with ocean waves curling behind, long dark wavy hair flowing, wearing an ultra-realistic red and tan island outfit with a shell necklace, in warm glowing light with sea sparkle.',
  'Mulan':
    'Mulan, stands in a blossoming pink cherry-blossom courtyard, wearing an ultra-realistic elegant traditional Hanfu robe with an ornate hair ornament, as petals fall in soft golden light.',
  'Ariel Little Mermaid':
    'Ariel the little mermaid, sits on ocean rocks at sunset as waves gently crash, long flowing red hair, wearing an ultra-realistic mermaid outfit with a teal sequined tail glistening, in glowing sea spray and warm light.',
  'Aurora Sleeping Beauty':
    'Princess Aurora, stands in an enchanted castle garden full of blooming roses, long blonde hair, wearing an ultra-realistic flowing pink gown with a golden crown, in soft magical light with floating petals.',
  'Belle Beauty Beast':
    'Belle, stands in an enchanted castle ballroom with a glowing magical rose under a glass dome, hair in an elegant updo, wearing an ultra-realistic iconic golden ball gown, in warm chandelier glow with drifting sparkles.',
  'Pocahontas':
    'Pocahontas, stands on a cliff above a forest river at golden hour as wind swirls autumn leaves, long black flowing hair, wearing an ultra-realistic tan buckskin dress with a turquoise necklace, in warm radiant light.',
  'Little Red Riding Hood':
    'Little Red Riding Hood, stands on a misty enchanted forest path holding a basket, wearing an ultra-realistic flowing red hooded cape over a white dress, as soft beams of light pierce the glowing mist.',
  'Sailor Moon':
    'a Sailor Moon-style magical girl, strikes a dynamic pose with glowing crescent-moon magic and sparkles, wearing an ultra-realistic sailor-style uniform with a red bow, against a starry night sky alive with magical light.',
  'Anime Warrior Girl':
    'an anime warrior girl, strikes a dynamic pose with glowing energy on a dramatic battlefield, wearing ultra-realistic stylized fantasy armor, amid swirling magical particles and dramatic light.',

  // ── Girls adventures ──
  'Hogwarts Witch':
    'a young witch, stands in a grand glowing magical Hogwarts library with floating candles, holding a glowing wand, wearing an ultra-realistic Hogwarts robe with a house scarf, surrounded by floating books and radiant golden sparks with a vibrant magical aura.',
  'Dragon Rider Girl':
    "a young dragon rider, sits confidently atop a majestic dragon on a cliff at golden hour, wearing ultra-realistic leather armor with dragon-scale details. The dragon's glowing eyes shine against epic clouds behind.",

  // ── Girls premium ──
  'Astronaut Girl':
    'astronaut, stands proudly on the surface of the moon with Earth glowing in the dark starry sky behind, wearing an ultra-realistic detailed white space suit with the helmet visor up and a flag patch, amid the vastness of space with glowing stars and distant planets.',
  'Princess Queen':
    'a regal princess queen, sits on an ornate golden throne in a grand palace hall, wearing an ultra-realistic luxurious royal gown with a golden crown and jewels, in warm golden light with floating sparkles.',
  'Fairy Godmother':
    'a magical fairy with glowing translucent wings, stands in an enchanted glowing forest at night holding a sparkling magic wand, surrounded by swirling fairy dust, wearing a shimmering gown glowing with magical light.',
  'Samurai Girl':
    'a samurai warrior, stands in a blossoming cherry-blossom courtyard holding a gleaming katana, wearing ultra-realistic traditional samurai armor, as pink petals fall in soft golden light.',
  'Horse Rider Girl':
    'an equestrian rider, rides a majestic horse galloping through a grand field at golden hour, wearing ultra-realistic equestrian attire, as dust and golden light swirl around the gallop.',
  'Ballerina':
    'a graceful ballerina, holds a mid-pose on a grand theater stage under a soft glowing spotlight, wearing an ultra-realistic elegant tutu, as sparkling dust drifts through the warm light.',
  'Hip Hop Dancer':
    'a cool hip hop dancer, strikes a dynamic pose on a neon-lit urban street at night, wearing ultra-realistic stylish streetwear, amid vibrant neon glow and floating sparks.',
  'Rock Star Girl':
    'a rock star, performs on a concert stage with dramatic spotlights and cheering crowd silhouettes, holding a microphone, wearing an ultra-realistic leather jacket, in dynamic red, blue and white stage lighting.',
  'Pro Surfer Girl':
    'a pro surfer, stands on the beach at golden sunset holding a tall surfboard upright, big ocean waves breaking behind, wearing a wetsuit with water droplets glistening in the warm radiant backlight.',
  'Chef Girl':
    "a chef, stands in a professional kitchen with flames rising from a pan, wearing an ultra-realistic white chef's coat and tall toque hat, in warm glowing light with floating embers.",
  'Doctor Girl':
    'a doctor, stands in a modern hospital corridor, wearing an ultra-realistic white coat with a stethoscope around the neck, in clean bright cinematic light.',
  'Scientist Girl':
    'scientist, stands in a high-tech laboratory surrounded by glowing equipment and bubbling beakers, wearing an ultra-realistic white lab coat with goggles and gloves, carefully pouring a radiant glowing liquid into a test tube, with advanced monitors and instruments behind.',
  'Cowgirl':
    'a cowgirl, stands in a golden desert canyon at sunset, wearing an ultra-realistic cowboy hat, leather vest and boots, in warm dusty light with drifting particles.',
  'Gladiator Girl':
    'a gladiator, stands in a sunlit Colosseum arena with dust in the air, holding a sword and shield, wearing ultra-realistic leather and bronze armor in dramatic golden light.',
  'Race Driver Girl':
    'a race-car driver, stands confidently beside a sleek formula race car on a track, holding a helmet, wearing an ultra-realistic racing suit covered in sponsor patches, in dramatic stadium lighting.',
  'Secret Agent Girl':
    'a sharp secret agent, stands in an elegant outfit at a glamorous casino at night, holding a pistol, in dramatic moody lighting with warm bokeh.',
  'Football Star Girl':
    'football player, is captured mid-celebration on a stadium pitch, arms raised triumphantly, wearing an ultra-realistic team jersey, amid bright floodlights, cheering fans and confetti drifting in the air.',
  'Pirate Girl':
    'a bold pirate captain, stands at the helm of a ship under a dramatic stormy sky, wearing an ultra-realistic ornate pirate coat and feathered hat, as sea spray flies and lanterns glow swinging in the wind.',
  'Knight Girl':
    'a knight, stands in shining silver plate armor in a grand castle courtyard at golden hour, holding a gleaming sword, in golden backlight with floating dust.',
  'Ninja Girl':
    'a ninja, holds a dynamic stealth pose on a moonlit rooftop at night, holding a katana, wearing an ultra-realistic black ninja outfit, in glowing moonlight with floating sparks.',

  // ── Professions & content (shared) ──
  'Chef':
    "a chef, stands in a professional kitchen with flames rising from a pan, wearing an ultra-realistic white chef's coat and tall toque hat, in warm glowing light with floating embers.",
  'Doctor':
    'a doctor, stands in a modern hospital corridor, wearing an ultra-realistic white coat with a stethoscope around the neck, in clean bright cinematic light.',
  'Firefighter':
    'a firefighter, stands in front of a blazing fire with glowing embers in the air, wearing an ultra-realistic yellow turnout coat and helmet, in dramatic warm firelight.',
  'Police Officer':
    'a police officer, stands beside a patrol car on an urban street at dusk with red and blue light reflections, wearing an ultra-realistic uniform with a badge, in moody cinematic light.',
  'Lawyer':
    'a confident lawyer, stands in a grand wood-paneled courtroom holding documents, wearing an ultra-realistic sharp tailored suit, in warm dramatic light.',
  'Professor':
    'a distinguished professor, stands in a classic library with tall bookshelves holding a book, wearing an ultra-realistic tweed jacket, in warm golden reading light with floating dust.',
  'DJ':
    'a DJ, stands at the turntables in a nightclub with vibrant neon lights and a dancing crowd, wearing ultra-realistic headphones and a stylish outfit, in a glowing neon haze.',
  'Bartender':
    'a stylish bartender, stands behind an elegant bar mixing a cocktail with flair, wearing a vest with rolled sleeves, in warm moody lighting with glints off the glassware.',
  'Barber':
    'a skilled barber, stands in a vintage barbershop holding scissors, wearing an ultra-realistic apron, in warm nostalgic light.',
  'Photographer':
    'a photographer, stands on a vibrant city street at golden hour holding a professional camera, wearing a stylish casual outfit, with warm bokeh lights behind.',
  'Jazz Musician':
    'a jazz musician, plays a golden saxophone on a moody dimly-lit stage with a single spotlight, wearing an ultra-realistic sharp suit, in a soft glowing haze.',
  'Architect':
    'an architect, stands at a drafting desk with blueprints in a modern studio overlooking a city skyline, holding a building model, wearing a smart outfit, in soft cinematic light.',
  'Archaeologist':
    'an archaeologist, carefully brushes an ancient artifact at a sunlit desert dig site surrounded by stone ruins, wearing a wide-brimmed safari hat and a rugged shirt, in warm light with floating dust.',
  'Winemaker':
    'a winemaker, stands in a sunlit vineyard at golden hour holding a glass of red wine with rows of grapevines behind, wearing a rustic shirt, in warm radiant light.',
  'Fitness Trainer':
    'a fitness trainer, stands confident and athletic in a modern gym with dramatic lighting, wearing athletic gear, in moody rim light.',
  'Golf Pro':
    'a golf pro, swings mid-motion on a lush green golf course at golden hour, wearing an ultra-realistic polo shirt and cap, in warm radiant light.',
  'Yacht Captain':
    "a yacht captain, stands on the deck of a luxury yacht on turquoise ocean water, wearing a crisp white captain's uniform and cap, in bright sea sparkle.",
  'Mountain Climber':
    'a mountain climber, stands at a snowy summit with epic mountain vistas at sunrise, wearing ultra-realistic climbing gear and ropes, in glowing golden dawn light.',
  'SWAT Operator':
    'a SWAT operator, stands in full tactical gear during a dramatic urban night operation, wearing an ultra-realistic armored vest and helmet, in moody lighting with floating sparks.',
  'Boxer':
    'a boxer, stands in a dramatic boxing ring under bright spotlights, intense and powerful, wearing boxing gloves and shorts, with dust and light haze in the air.',
  'Surfer':
    'a surfer, stands on the beach at golden sunset holding a tall surfboard upright, big ocean waves breaking behind, wearing a wetsuit with water droplets glistening in the warm radiant backlight.',
  'Cowboy Mustache':
    'a cowboy with a thick mustache, stands in a golden desert canyon at sunset, wearing an ultra-realistic cowboy hat, leather vest and boots, in warm dusty light.',
  'Gladiator':
    'a gladiator, stands in a sunlit Colosseum arena with dust in the air, holding a sword and shield, wearing ultra-realistic leather and bronze armor in dramatic golden light.',
  'Samurai':
    'a samurai warrior, stands in a blossoming cherry-blossom courtyard holding a gleaming katana, wearing ultra-realistic traditional samurai armor, as pink petals fall in soft golden light.',
  'Viking':
    'a fierce Viking warrior, stands on a rugged northern shore with stormy seas, holding a battle axe, wearing an ultra-realistic fur cloak and iron armor with braided hair, in dramatic storm light and sea spray.',
  'Sumo Wrestler':
    'a sumo wrestler, holds a powerful stance in a traditional sumo ring inside a dramatic arena, wearing a traditional mawashi belt, in atmospheric overhead light.',
  'Male Ballerina':
    'a graceful ballet dancer, holds a mid-leap on a grand theater stage under a soft glowing spotlight, wearing an ultra-realistic ballet outfit, as sparkling dust drifts through the light.',
  'Funny Ballerina':
    'a ballerina, holds a comedic exaggerated pose with a playful funny expression on a theater stage under a spotlight, wearing a tutu, in warm glowing light.',
  'Cowgirl Mustache':
    'a cowgirl wearing a funny fake mustache, stands in a golden desert canyon at sunset, wearing an ultra-realistic cowboy hat, leather vest and boots, in warm dusty light.',
};

// ── Trigger word used during LoRA training ────────────────────────────────────
export const LORA_TRIGGER = 'MRLSSUBJ';

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

  // The SCENE is the winning doc text. Strip a leading article ("a chef" → "chef")
  // so "{aiLabel} {scene}" reads cleanly ("a 7-year-old boy chef, ...").
  const scene = (CHARACTER_PROMPTS[params.characterName]
    ?? `${params.characterName}, stands in an epic magical cinematic scene with glowing light and a dramatic captivating background`)
    .replace(/^(an?|the)\s+/i, '');

  const override = params.aiOverride?.trim()
    ? ` ${params.aiOverride.trim()}`
    : '';

  // Doc shape exactly: "{trigger}, a {aiLabel} {SCENE}". For the close-up variation
  // we add ONE short sentence; the full-body variation stays as the doc wrote it.
  const closeup = params.variation === 'variation_b'
    ? ' Cinematic close-up portrait focusing on the face.'
    : '';

  return `${trigger}, a ${params.aiLabel} ${scene}${closeup}${override}`;
}

// ── Negative prompt (applied to every generation) ────────────────────────────
export const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, drawing, blurry, deformed, ' +
  'ugly, bad anatomy, extra limbs, watermark, text, nsfw, nude, ' +
  'flat lighting, studio backdrop, plain background, low quality, ' +
  'jpeg artifacts, smooth plastic skin, airbrushed, stock photo look';
