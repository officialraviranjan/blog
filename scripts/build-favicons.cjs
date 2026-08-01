const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '..', 'src', 'assets', 'images', 'travel_app_logo_1785198893235.jpg');
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateFavicons() {
  // 1. favicon-16x16.png
  const png16 = await sharp(sourceImage).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);

  // 2. favicon-32x32.png
  const png32 = await sharp(sourceImage).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);

  // 3. apple-touch-icon.png (180x180)
  const png180 = await sharp(sourceImage).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

  // 4. android-chrome-192x192.png
  const png192 = await sharp(sourceImage).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);

  // 5. android-chrome-512x512.png
  const png512 = await sharp(sourceImage).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);

  // 6. favicon.ico (multi-size ICO container with 16, 32, 48 PNGs)
  const png48 = await sharp(sourceImage).resize(48, 48).png().toBuffer();
  const icoBuffers = [png16, png32, png48];
  const icoSizes = [16, 32, 48];
  const icoCount = icoBuffers.length;
  const headerSize = 6 + icoCount * 16;
  let offset = headerSize;

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // ICO format
  icoHeader.writeUInt16LE(icoCount, 4);

  const icoEntries = [];
  for (let i = 0; i < icoCount; i++) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(icoSizes[i], 0);
    entry.writeUInt8(icoSizes[i], 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(icoBuffers[i].length, 8);
    entry.writeUInt32LE(offset, 12);
    icoEntries.push(entry);
    offset += icoBuffers[i].length;
  }
  const icoBuf = Buffer.concat([icoHeader, ...icoEntries, ...icoBuffers]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);

  console.log('Successfully generated all binary favicon assets in /public/');
}

generateFavicons().catch((err) => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
