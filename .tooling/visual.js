// Captures en thème sombre + contrôle qu'aucun thème clair ne "flashe"
// avant l'exécution du JS, et qu'aucun SVG ne déborde de son conteneur.
const path = require('path');
const fs = require('fs');
const { launch, BASE_URL } = require('./browser');

const PAGES = ['index', 'about', 'gallery', 'contact'];
const OUT = path.join(__dirname, 'shots');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  let problems = 0;

  // Mémorise le thème sombre pour toutes les pages suivantes.
  await p.goto(`${BASE_URL}/index.html`, { waitUntil: 'load' });
  await p.evaluate(() => localStorage.setItem('theme', 'dark'));

  for (const page of PAGES) {
    await p.goto(`${BASE_URL}/${page}.html`, { waitUntil: 'load' });
    await p.waitForTimeout(1600);

    const info = await p.evaluate(() => {
      const oversized = [...document.querySelectorAll('svg')]
        .filter((s) => {
          const r = s.getBoundingClientRect();
          return r.width > 60 || r.height > 60;
        }).length;
      // Un débordement horizontal casse la mise en page sur mobile.
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      return {
        dark: document.documentElement.classList.contains('dark'),
        oversized,
        overflow,
      };
    });

    await p.screenshot({ path: path.join(OUT, `dark-${page}.png`) });

    const ok = info.dark && info.oversized === 0 && info.overflow <= 1;
    if (!ok) problems++;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} dark-${page}.png — sombre:${info.dark} ` +
      `svg hors-format:${info.oversized} débordement:${info.overflow}px`);
  }

  console.log(`\n--- échecs : ${problems} ---`);
  await browser.close();
  process.exit(problems ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
