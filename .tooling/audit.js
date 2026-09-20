// Audit d'accessibilité et de qualité sur les 4 pages.
// Contrôles statiques qui n'exigent aucune dépendance externe.
const { launch, BASE_URL } = require('./browser');

const PAGES = ['index.html', 'about.html', 'gallery.html', 'contact.html', 'dashboard.html'];
let failures = 0;

function report(label, ok, detail) {
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`);
}

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  for (const page of PAGES) {
    console.log(`\n=== ${page} ===`);
    const p = await ctx.newPage();
    await p.goto(`${BASE_URL}/${page}`, { waitUntil: 'load' });
    await p.waitForTimeout(1400);

    const a = await p.evaluate(() => {
      const txt = (el) => (el.innerText || el.textContent || '').trim();

      // Un bouton/lien sans texte ni libellé accessible est muet pour un lecteur d'écran.
      const namelessControls = [...document.querySelectorAll('button, a')]
        .filter((el) => !txt(el) && !el.getAttribute('aria-label')
          && !el.getAttribute('aria-labelledby') && !el.querySelector('.sr-only'))
        .map((el) => el.tagName + '.' + (el.className || '').toString().split(' ')[0]);

      // Hiérarchie des titres : un seul h1, pas de niveau sauté.
      const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .map((h) => +h.tagName[1]);
      let skipped = null;
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) { skipped = `h${levels[i - 1]} -> h${levels[i]}`; break; }
      }

      // Champs de formulaire sans <label for>.
      const unlabelled = [...document.querySelectorAll('input, select, textarea')]
        .filter((f) => !document.querySelector(`label[for="${f.id}"]`)
          && !f.getAttribute('aria-label'))
        .map((f) => f.id || f.name || f.type);

      return {
        h1: document.querySelectorAll('h1').length,
        namelessControls,
        skipped,
        unlabelled,
        lang: document.documentElement.getAttribute('lang'),
        title: document.title.length,
        desc: (document.querySelector('meta[name="description"]') || {}).content?.length || 0,
        skip: !!document.querySelector('.skip-link'),
        landmarks: {
          main: document.querySelectorAll('main').length,
          nav: document.querySelectorAll('nav').length,
          footer: document.querySelectorAll('footer').length,
        },
      };
    });

    report('un seul <h1>', a.h1 === 1, `${a.h1}`);
    report('contrôles tous nommés', a.namelessControls.length === 0, a.namelessControls.join(', '));
    report('hiérarchie des titres', !a.skipped, a.skipped || '');
    report('champs de formulaire étiquetés', a.unlabelled.length === 0, a.unlabelled.join(', '));
    report('attribut lang', a.lang === 'fr', a.lang);
    report('title et meta description', a.title > 10 && a.desc > 40, `title:${a.title} desc:${a.desc}`);
    report('lien d\'évitement', a.skip);
    report('repères main/nav/footer', a.landmarks.main >= 1 && a.landmarks.nav >= 1
      && a.landmarks.footer >= 1, JSON.stringify(a.landmarks));

    await p.close();
  }

  console.log(`\n--- échecs : ${failures} ---`);
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
