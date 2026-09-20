// Vérifie que le code partagé (common.js) se comporte pareil sur les 4 pages :
// loader, thème persistant, menu mobile, lien de navigation actif.
const { launch, BASE_URL } = require('./browser');

const PAGES = ['index.html', 'about.html', 'gallery.html', 'contact.html'];
let failures = 0;

function report(label, ok, detail) {
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`);
}

(async () => {
  const browser = await launch();

  for (const page of PAGES) {
    console.log(`\n=== ${page} ===`);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(`${BASE_URL}/${page}`, { waitUntil: 'load' });
    await p.waitForTimeout(1800);

    // 1. Le loader existe et a bien disparu.
    const loader = await p.evaluate(() => {
      const l = document.getElementById('loader');
      if (!l) return null;
      const cs = getComputedStyle(l);
      return { hidden: cs.opacity === '0' || cs.visibility === 'hidden' };
    });
    report('loader présent puis masqué', loader && loader.hidden,
      loader ? '' : 'aucun #loader sur la page');

    // 2. Le contenu est cliquable (le calque ne bloque plus rien).
    const clickable = await p.evaluate(() =>
      !document.elementFromPoint(720, 300)?.closest('#loader'));
    report('contenu interactif', clickable);

    // 3. Thème : bascule + persistance après rechargement.
    const before = await p.evaluate(() => document.documentElement.classList.contains('dark'));
    await p.click('#theme-btn');
    await p.waitForTimeout(400);
    const after = await p.evaluate(() => document.documentElement.classList.contains('dark'));
    report('bascule du thème', before !== after, `${before} -> ${after}`);

    await p.reload({ waitUntil: 'load' });
    await p.waitForTimeout(1200);
    const persisted = await p.evaluate(() => document.documentElement.classList.contains('dark'));
    report('thème conservé au rechargement', persisted === after, `${persisted}`);

    // 4. Lien de navigation actif = page courante.
    // Le rail (desktop) et le menu mobile doivent tous deux marquer la page.
    const active = await p.evaluate(() => {
      const rail = document.querySelector('.rail__link.active');
      const mob = document.querySelector('.mobile-nav-link.active');
      return {
        rail: rail ? rail.getAttribute('href') : null,
        mobile: mob ? mob.getAttribute('href') : null,
        current: rail ? rail.getAttribute('aria-current') : null,
      };
    });
    report('lien de nav. actif correct',
      active.rail === page && active.mobile === page && active.current === 'page',
      `rail: ${active.rail}, mobile: ${active.mobile}`);

    // 5. Menu mobile.
    await p.setViewportSize({ width: 390, height: 844 });
    await p.waitForTimeout(400);
    await p.click('#hamburger');
    await p.waitForTimeout(700);
    const opened = await p.evaluate(() =>
      document.getElementById('mobileMenu').classList.contains('active'));
    await p.keyboard.press('Escape');
    await p.waitForTimeout(600);
    const closed = await p.evaluate(() =>
      !document.getElementById('mobileMenu').classList.contains('active'));
    report('menu mobile ouvre/ferme (Échap)', opened && closed);

    report('aucune erreur JS', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log(`\n--- échecs : ${failures} ---`);
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
