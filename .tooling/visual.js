// Contrôle de mise en page à deux tailles d'écran (375px et grand bureau) :
// aucun débordement horizontal, aucun SVG hors-format, largeurs de texte
// mesurées, et captures d'écran pour inspection.
const path = require('path');
const fs = require('fs');
const { launch, BASE_URL } = require('./browser');

const PAGES = ['index', 'about', 'gallery', 'contact', 'dashboard'];
const SIZES = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'desktop', width: 1600, height: 1000 },
];
const OUT = path.join(__dirname, 'shots');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await launch();
  let problems = 0;

  for (const size of SIZES) {
    console.log(`\n=== ${size.name} (${size.width}px) ===`);
    const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height } });
    const p = await ctx.newPage();

    for (const page of PAGES) {
      await p.goto(`${BASE_URL}/${page}.html`, { waitUntil: 'load' });
      await p.waitForTimeout(1500);

      const info = await p.evaluate(() => {
        // Un SVG sans dimensions explicites s'étire dans un conteneur flex.
        const oversized = [...document.querySelectorAll('svg')]
          .filter((s) => {
            const r = s.getBoundingClientRect();
            return r.width > 60 || r.height > 60;
          }).length;

        // Débordement horizontal : casse la lecture sur mobile.
        const overflow = document.documentElement.scrollWidth
          - document.documentElement.clientWidth;

        // Élément le plus large dépassant du cadre, pour le diagnostic.
        let worst = '';
        if (overflow > 1) {
          const lim = document.documentElement.clientWidth;
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.right > lim + 1 && r.width > 40) {
              worst = el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0]
                + ' (' + Math.round(r.right) + 'px)';
              break;
            }
          }
        }

        // Longueur de ligne du chapô : la consigne est 60 caractères maximum.
        const lead = document.querySelector('.hero__lead, .section__lead');
        const leadWidth = lead ? Math.round(lead.getBoundingClientRect().width) : 0;

        // Les zones tactiles doivent rester confortables.
        const smallTaps = [...document.querySelectorAll('.tabbar__link, .btn')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.height > 0 && r.height < 40;
          }).length;

        return { oversized, overflow, worst, leadWidth, smallTaps };
      });

      await p.screenshot({ path: path.join(OUT, `${size.name}-${page}.png`) });

      const ok = info.oversized === 0 && info.overflow <= 1 && info.smallTaps === 0;
      if (!ok) problems++;
      console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${size.name}-${page}.png — ` +
        `svg hors-format:${info.oversized} débordement:${info.overflow}px ` +
        `cibles<40px:${info.smallTaps} chapô:${info.leadWidth}px` +
        (info.worst ? ` [${info.worst}]` : ''));
    }
    await ctx.close();
  }

  console.log(`\n--- échecs : ${problems} ---`);
  await browser.close();
  process.exit(problems ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
