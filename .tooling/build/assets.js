/* Prépare les ressources statiques du site :
   1. convertit les photos JPEG en WebP (< 200 Ko, dimensions raisonnables) ;
   2. copie GSAP et les polices variables en local.

   Les CDN sont inaccessibles depuis ce bac à sable : tout est donc servi
   depuis le site lui-même, ce qui évite aussi toute dépendance tierce.

   Usage : node .tooling/build/assets.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SITE = path.join(__dirname, '..', '..', 'CADF( final)');
const SRC_IMG = path.join(SITE, 'images');
const OUT_IMG = path.join(SITE, 'assets', 'img');
const OUT_VENDOR = path.join(SITE, 'assets', 'vendor');
const OUT_FONT = path.join(SITE, 'assets', 'fonts');
const NM = path.join(__dirname, '..', 'node_modules');

const MAX_BYTES = 200 * 1024;

// Largeur cible selon l'usage. Les portraits d'équipe et le logo n'ont
// pas besoin d'être servis en pleine résolution.
const PLAN = {
  gallery: { width: 1000, quality: 76 },   // Diapo_*
  portrait: { width: 640, quality: 78 },   // équipe
  hero: { width: 1200, quality: 80 },      // Dumas.jpg
  logo: { width: 256, quality: 82 },       // Dumas_logo.jpg
};

function planFor(file) {
  if (/^Diapo_/i.test(file)) return PLAN.gallery;
  if (/^Dumas_logo/i.test(file)) return PLAN.logo;
  if (/^Dumas\./i.test(file)) return PLAN.hero;
  return PLAN.portrait;
}

async function convert() {
  fs.mkdirSync(OUT_IMG, { recursive: true });
  const files = fs.readdirSync(SRC_IMG).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const manifest = {};

  for (const file of files) {
    const cfg = planFor(file);
    const src = path.join(SRC_IMG, file);
    const base = file.replace(/\.(jpe?g|png)$/i, '');
    const dest = path.join(OUT_IMG, base + '.webp');

    let quality = cfg.quality;
    let buf;
    let meta;

    // On baisse la qualité par paliers jusqu'à passer sous la limite.
    for (let attempt = 0; attempt < 6; attempt++) {
      const pipeline = sharp(src)
        .rotate()                       // respecte l'orientation EXIF
        .resize({ width: cfg.width, withoutEnlargement: true })
        .webp({ quality, effort: 6 });
      buf = await pipeline.toBuffer();
      meta = await sharp(buf).metadata();
      if (buf.length <= MAX_BYTES) break;
      quality -= 8;
    }

    fs.writeFileSync(dest, buf);
    manifest[base] = { w: meta.width, h: meta.height, bytes: buf.length };

    const before = fs.statSync(src).size;
    const pct = Math.round((1 - buf.length / before) * 100);
    console.log(`  ${base.padEnd(14)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)}` +
      `  ${(before / 1024).toFixed(0).padStart(5)} Ko -> ${(buf.length / 1024).toFixed(0).padStart(4)} Ko  (-${pct} %)` +
      `${buf.length > MAX_BYTES ? '  ⚠ AU-DESSUS DE 200 Ko' : ''}`);
  }

  fs.writeFileSync(path.join(__dirname, 'images.json'),
    JSON.stringify(manifest, null, 2), 'utf8');
  return manifest;
}

function copyVendor() {
  fs.mkdirSync(OUT_VENDOR, { recursive: true });
  const gsap = path.join(NM, 'gsap', 'dist', 'gsap.min.js');
  fs.copyFileSync(gsap, path.join(OUT_VENDOR, 'gsap.min.js'));
  console.log('  gsap.min.js', (fs.statSync(gsap).size / 1024).toFixed(0), 'Ko');
}

function copyFonts() {
  fs.mkdirSync(OUT_FONT, { recursive: true });
  // Fichiers variables latin, au format woff2.
  const wanted = [
    ['@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2', 'fraunces.woff2'],
    ['@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2', 'jakarta.woff2'],
  ];
  for (const [rel, out] of wanted) {
    const src = path.join(NM, rel);
    if (!fs.existsSync(src)) { console.log('  MANQUANT', rel); continue; }
    fs.copyFileSync(src, path.join(OUT_FONT, out));
    console.log(' ', out, (fs.statSync(src).size / 1024).toFixed(0), 'Ko');
  }
}

(async () => {
  console.log('Images -> WebP');
  const m = await convert();
  const over = Object.entries(m).filter(([, v]) => v.bytes > MAX_BYTES);
  console.log('\nGSAP');
  copyVendor();
  console.log('\nPolices');
  copyFonts();
  console.log(over.length
    ? `\n⚠ ${over.length} image(s) au-dessus de 200 Ko`
    : '\nToutes les images sont sous 200 Ko.');
})().catch((e) => { console.error(e); process.exit(1); });
