const sharp = require('sharp');

async function makeWhiteLogo() {
  // Read the clean logo and negate colors, then make white areas transparent
  await sharp('public/logo-clean.png')
    .negate({ alpha: false })       // invert: black->white, white->black
    .ensureAlpha()                  // add alpha channel
    .toFile('public/logo-white-temp.png');

  // Now read the negated image and make the black (was white) background transparent
  const { data, info } = await sharp('public/logo-white-temp.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Make near-black pixels transparent (these were the white background)
  const pixelCount = info.width * info.height;
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    // If pixel is dark (was white background), make transparent
    if (r < 30 && g < 30 && b < 30) {
      data[idx + 3] = 0; // set alpha to 0
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile('public/logo-hero.png');

  const fs = require('fs');
  fs.unlinkSync('public/logo-white-temp.png');
  console.log('done! created public/logo-hero.png');
}

makeWhiteLogo().catch(console.error);
