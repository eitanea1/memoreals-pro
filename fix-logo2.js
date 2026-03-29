const { execSync } = require('child_process');
const sharp = require('sharp');
const fs = require('fs');

async function fix() {
  // Restore original logo from git history (before our changes)
  execSync('git show HEAD~4:public/logo.png > public/logo-original.png', { shell: 'cmd.exe' });

  const meta = await sharp('public/logo-original.png').metadata();
  console.log('Original:', meta.width, 'x', meta.height, 'channels:', meta.channels, 'hasAlpha:', meta.hasAlpha);

  // Flatten transparency to white
  await sharp('public/logo-original.png')
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile('public/logo-fixed.png');

  const meta2 = await sharp('public/logo-fixed.png').metadata();
  console.log('Fixed:', meta2.width, 'x', meta2.height, 'channels:', meta2.channels, 'hasAlpha:', meta2.hasAlpha);

  // Overwrite logo.png
  fs.copyFileSync('public/logo-fixed.png', 'public/logo.png');
  fs.unlinkSync('public/logo-original.png');
  fs.unlinkSync('public/logo-fixed.png');

  console.log('done!');
}

fix().catch(console.error);
