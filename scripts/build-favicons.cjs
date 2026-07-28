const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgLogo = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#2563eb"/>
  <circle cx="256" cy="256" r="140" stroke="white" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <polygon points="256,136 288,224 376,256 288,288 256,376 224,288 136,256 224,224" fill="white"/>
  <polygon points="256,136 288,224 256,256 224,224" fill="#93c5fd"/>
  <polygon points="256,256 288,288 256,376 224,288" fill="#1d4ed8"/>
  <circle cx="256" cy="256" r="20" fill="#2563eb"/>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgLogo);

  // 1. favicon-16x16.png
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // 2. favicon-32x32.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // 3. apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 4. android-chrome-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));

  // 5. android-chrome-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));

  // 6. favicon.ico (32x32 PNG or ICO container)
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all favicon assets in /public/');
}

generateFavicons().catch((err) => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
