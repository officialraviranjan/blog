const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '..', 'src', 'assets', 'images', 'travel_app_logo_1785198893235.jpg');
const publicDir = path.join(__dirname, '..', 'public');

async function generateDefaultOg() {
  const ogPng = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a
    }
  })
  .composite([
    {
      input: await sharp(sourceImage).resize(500, 500, { fit: 'contain' }).toBuffer(),
      top: 65,
      left: 350
    }
  ])
  .png()
  .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'default-og.png'), ogPng);

  const ogJpg = await sharp(ogPng).jpeg({ quality: 90 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'default-og.jpg'), ogJpg);

  console.log('Successfully generated binary /public/default-og.jpg and /public/default-og.png');
}

generateDefaultOg().catch(err => {
  console.error('Error generating default OG:', err);
  process.exit(1);
});
