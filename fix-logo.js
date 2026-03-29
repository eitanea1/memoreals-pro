const sharp = require('sharp');

async function fixLogo() {
  const input = 'public/logo.png';
  const output = 'public/logo.png';

  // Read original
  const meta = await sharp(input).metadata();
  console.log('Original:', meta.width, 'x', meta.height, 'channels:', meta.channels, 'hasAlpha:', meta.hasAlpha);

  // Create white background and composite the logo on top
  await sharp({
    create: {
      width: meta.width,
      height: meta.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
  .composite([{ input: input, gravity: 'center' }])
  .jpeg({ quality: 100 })
  .toFile('public/logo-white.jpg');

  // Now convert back to PNG
  await sharp('public/logo-white.jpg')
  .png()
  .toFile(output + '.tmp');

  // Read tmp and overwrite original
  const fs = require('fs');
  fs.copyFileSync(output + '.tmp', output);
  fs.unlinkSync(output + '.tmp');
  fs.unlinkSync('public/logo-white.jpg');

  const newMeta = await sharp(output).metadata();
  console.log('Fixed:', newMeta.width, 'x', newMeta.height, 'channels:', newMeta.channels, 'hasAlpha:', newMeta.hasAlpha);
  console.log('done!');
}

fixLogo().catch(console.error);
