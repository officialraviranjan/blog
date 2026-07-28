const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgDefaultOg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f172a"/>
  
  <!-- Subtle Gradient Background Overlays -->
  <circle cx="1100" cy="100" r="400" fill="#2563eb" opacity="0.25"/>
  <circle cx="100" cy="550" r="350" fill="#06b6d4" opacity="0.2"/>

  <!-- Border Card Frame -->
  <rect x="40" y="40" width="1120" height="550" rx="32" stroke="#334155" stroke-width="2" fill="none"/>

  <!-- Compass Icon Container -->
  <g transform="translate(100, 120)">
    <rect width="100" height="100" rx="24" fill="#2563eb"/>
    <circle cx="50" cy="50" r="32" stroke="white" stroke-width="6" fill="none"/>
    <polygon points="50,20 58,42 80,50 58,58 50,80 42,58 20,50 42,42" fill="white"/>
    <polygon points="50,20 58,42 50,50 42,42" fill="#93c5fd"/>
    <polygon points="50,50 58,58 50,80 42,58" fill="#1d4ed8"/>
  </g>

  <!-- Brand Title -->
  <text x="230" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="-1">
    Euro Travels Guide
  </text>
  <text x="230" y="215" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#38bdf8" letter-spacing="1">
    EUROPEAN TRAVEL &amp; DESTINATION GUIDES
  </text>

  <!-- Main Headline -->
  <text x="100" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="800" fill="#ffffff" letter-spacing="-1">
    Discover Europe's Best Hidden Gems,
  </text>
  <text x="100" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="800" fill="#38bdf8" letter-spacing="-1">
    Slow Travel Itineraries &amp; Budget Tips
  </text>

  <!-- Footer Tagline -->
  <text x="100" y="510" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="500" fill="#94a3b8">
    https://eurotravelsguide.eu.org — By Sophia Rossi
  </text>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');

async function generateDefaultOg() {
  const svgBuffer = Buffer.from(svgDefaultOg);

  await sharp(svgBuffer)
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, 'default-og.jpg'));

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(publicDir, 'default-og.png'));

  console.log('Successfully generated /public/default-og.jpg and /public/default-og.png');
}

generateDefaultOg().catch(err => {
  console.error('Error generating default OG:', err);
  process.exit(1);
});
