const fs = require("fs");
const path = require("path");

function generateIconSVG(size, maskable = false) {
  const padding = maskable ? size * 0.1 : 0;
  const cx = size / 2;
  const cy = size / 2;
  const balloonRx = (size - padding * 2) * 0.28;
  const balloonRy = (size - padding * 2) * 0.34;
  const balloonCy = cy - size * 0.06;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${maskable ? 0 : size * 0.15}" fill="#7DD3FC"/>
  <!-- Red balloon -->
  <ellipse cx="${cx - size * 0.12}" cy="${balloonCy - size * 0.05}" rx="${balloonRx * 0.7}" ry="${balloonRy * 0.7}" fill="#EF4444"/>
  <ellipse cx="${cx - size * 0.15}" cy="${balloonCy - size * 0.12}" rx="${balloonRx * 0.15}" ry="${balloonRy * 0.2}" fill="rgba(255,255,255,0.4)" transform="rotate(-20 ${cx - size * 0.15} ${balloonCy - size * 0.12})"/>
  <!-- Green balloon -->
  <ellipse cx="${cx + size * 0.14}" cy="${balloonCy}" rx="${balloonRx * 0.65}" ry="${balloonRy * 0.65}" fill="#22C55E"/>
  <ellipse cx="${cx + size * 0.11}" cy="${balloonCy - size * 0.07}" rx="${balloonRx * 0.13}" ry="${balloonRy * 0.18}" fill="rgba(255,255,255,0.4)" transform="rotate(-20 ${cx + size * 0.11} ${balloonCy - size * 0.07})"/>
  <!-- Yellow balloon (main/center) -->
  <ellipse cx="${cx}" cy="${balloonCy + size * 0.02}" rx="${balloonRx * 0.8}" ry="${balloonRy * 0.8}" fill="#FACC15"/>
  <ellipse cx="${cx - size * 0.03}" cy="${balloonCy - size * 0.06}" rx="${balloonRx * 0.16}" ry="${balloonRy * 0.22}" fill="rgba(255,255,255,0.45)" transform="rotate(-20 ${cx - size * 0.03} ${balloonCy - size * 0.06})"/>
  <!-- Strings -->
  <line x1="${cx - size * 0.12}" y1="${balloonCy + balloonRy * 0.65}" x2="${cx}" y2="${cy + size * 0.3}" stroke="#888" stroke-width="${size * 0.005}" stroke-linecap="round"/>
  <line x1="${cx + size * 0.14}" y1="${balloonCy + balloonRy * 0.6}" x2="${cx}" y2="${cy + size * 0.3}" stroke="#888" stroke-width="${size * 0.005}" stroke-linecap="round"/>
  <line x1="${cx}" y1="${balloonCy + balloonRy * 0.75}" x2="${cx}" y2="${cy + size * 0.3}" stroke="#888" stroke-width="${size * 0.005}" stroke-linecap="round"/>
  <!-- Star -->
  <text x="${cx}" y="${cy + size * 0.04}" text-anchor="middle" font-size="${size * 0.12}" fill="white" font-family="Arial">&#9733;</text>
</svg>`;
}

const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const configs = [
  { size: 192, maskable: false, name: "icon-192x192" },
  { size: 512, maskable: false, name: "icon-512x512" },
  { size: 192, maskable: true, name: "icon-maskable-192x192" },
  { size: 512, maskable: true, name: "icon-maskable-512x512" },
];

configs.forEach(({ size, maskable, name }) => {
  const svg = generateIconSVG(size, maskable);
  const svgPath = path.join(iconsDir, `${name}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Generated: ${name}.svg`);
});

console.log("\nSVG icons generated. For production, convert to PNG.");
console.log("For now, updating manifest to use SVG icons...");

const manifestPath = path.join(__dirname, "..", "public", "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
manifest.icons = manifest.icons.map((icon) => ({
  ...icon,
  src: icon.src.replace(".png", ".svg"),
  type: "image/svg+xml",
}));
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("Manifest updated to reference SVG icons.");
