// Vérifie que le mouvement réduit est respecté et que le contenu reste
// lisible sans JavaScript (les deux garde-fous de l'animation d'entrée).
const { launch, BASE_URL } = require('./browser');

let failures = 0;
function report(label, ok, detail) {
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`);
}

(async () => {
  const browser = await launch();

  /* 1. Mouvement réduit : rien ne doit être animé, tout doit être visible. */
  console.log('\n=== prefers-reduced-motion: reduce ===');
  const rm = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  for (const page of ['index', 'about', 'gallery', 'contact', 'dashboard']) {
    const p = await rm.newPage();
    await p.goto(`${BASE_URL}/${page}.html`, { waitUntil: 'load' });
    // Volontairement court : sans animation le contenu est déjà là.
    await p.waitForTimeout(350);
    const r = await p.evaluate(() => {
      const els = [...document.querySelectorAll('[data-anim]')];
      return {
        n: els.length,
        hidden: els.filter((e) => parseFloat(getComputedStyle(e).opacity) < .99).length,
        moved: els.filter((e) => {
          const t = getComputedStyle(e).transform;
          return t && t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)';
        }).length,
        durations: els.filter((e) => parseFloat(getComputedStyle(e).transitionDuration) > .05).length,
      };
    });
    report(`${page} : contenu immédiatement visible`,
      r.hidden === 0 && r.moved === 0,
      `${r.n} éléments, ${r.hidden} masqué(s), ${r.moved} déplacé(s)`);
    await p.close();
  }
  await rm.close();

  /* 2. Sans JavaScript : la page doit rester entièrement lisible. */
  console.log('\n=== JavaScript désactivé ===');
  const nojs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  for (const page of ['index', 'gallery', 'contact']) {
    const p = await nojs.newPage();
    await p.goto(`${BASE_URL}/${page}.html`, { waitUntil: 'load' });
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const els = [...document.querySelectorAll('[data-anim]')];
      return {
        hidden: els.filter((e) => parseFloat(getComputedStyle(e).opacity) < .99).length,
        h1: !!document.querySelector('h1')?.innerText.trim(),
        imgs: [...document.images].filter((i) => i.complete && i.naturalWidth > 0).length,
      };
    });
    report(`${page} : lisible sans JS`, r.hidden === 0 && r.h1,
      `${r.hidden} élément(s) masqué(s), images chargées : ${r.imgs}`);
    await p.close();
  }
  await nojs.close();

  console.log(`\n--- échecs : ${failures} ---`);
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
