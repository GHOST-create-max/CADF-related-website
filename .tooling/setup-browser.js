// Réinstalle Chromium dans ../.cache/chrome/ (le CDN Playwright est bloqué
// dans ce bac à sable, on décompresse donc le binaire fourni via npm).
// Usage : node setup-browser.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

const SRC = path.join(__dirname, 'node_modules', '@sparticuz', 'chromium', 'bin');
const DEST = path.join(__dirname, '..', '.cache', 'chrome');

if (fs.existsSync(path.join(DEST, 'chromium'))) {
  console.log('Chromium déjà présent.'); process.exit(0);
}
if (!fs.existsSync(SRC)) {
  console.error('Lancez d\'abord : npm install'); process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });
console.log('Décompression du binaire…');
fs.writeFileSync(path.join(DEST, 'chromium'),
  zlib.brotliDecompressSync(fs.readFileSync(path.join(SRC, 'chromium.br'))));
fs.chmodSync(path.join(DEST, 'chromium'), 0o755);

for (const [br, dir] of [['al2023.tar.br', 'lib'], ['swiftshader.tar.br', 'swiftshader'], ['fonts.tar.br', 'fonts']]) {
  const tar = path.join(DEST, dir + '.tar');
  fs.writeFileSync(tar, zlib.brotliDecompressSync(fs.readFileSync(path.join(SRC, br))));
  fs.mkdirSync(path.join(DEST, dir), { recursive: true });
  execSync(`tar -xf "${tar}" -C "${path.join(DEST, dir)}"`);
  fs.unlinkSync(tar);
  console.log('  extrait', dir);
}
console.log('Prêt :', path.join(DEST, 'chromium'));
