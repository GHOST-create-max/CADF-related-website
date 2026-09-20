// Vérifie que le code partagé (main.js) se comporte pareil sur les 5 pages :
// navigation active, tiroir mobile, animation d'entrée, aucune erreur JS.
const { launch, BASE_URL } = require('./browser');

const PAGES = ['index.html', 'about.html', 'gallery.html', 'contact.html', 'dashboard.html'];
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
    await p.waitForTimeout(2600);

    // 1. Le repli « sans JavaScript » est levé dès que main.js s'exécute.
    const jsReady = await p.evaluate(() =>
      !document.documentElement.classList.contains('no-js'));
    report('classe no-js retirée', jsReady);

    // 2. La page courante est signalée dans le rail ET dans la barre basse.
    const active = await p.evaluate(() => ({
      side: document.querySelector('.sidenav__link[aria-current="page"]')?.getAttribute('href'),
      tab: document.querySelector('.tabbar__link[aria-current="page"]')?.getAttribute('href'),
      pill: !!document.querySelector('.sidenav__link[aria-current="page"] .dot'),
    }));
    report('lien de navigation actif correct',
      active.side === page && active.tab === page,
      `rail: ${active.side}, barre: ${active.tab}`);
    report('pastille or sur l\'élément actif', active.pill);

    // 3. L'animation d'entrée laisse le contenu visible à la fin.
    const visible = await p.evaluate(() =>
      [...document.querySelectorAll('[data-anim]')]
        .every((el) => parseFloat(getComputedStyle(el).opacity) > .95));
    report('contenu animé bien révélé', visible);

    // 4. Le contenu principal est cliquable (aucun calque résiduel).
    const clickable = await p.evaluate(() => {
      const el = document.elementFromPoint(720, 400);
      return !!el && !el.closest('.lightbox, .nav-scrim');
    });
    report('contenu interactif', clickable);

    // 5. Tiroir mobile : ouverture, fermeture avec Échap.
    await p.setViewportSize({ width: 390, height: 844 });
    await p.waitForTimeout(400);
    await p.click('#navToggle');
    await p.waitForTimeout(600);
    const opened = await p.evaluate(() => ({
      open: document.getElementById('navDrawer').classList.contains('is-open'),
      expanded: document.getElementById('navToggle').getAttribute('aria-expanded'),
    }));
    await p.keyboard.press('Escape');
    await p.waitForTimeout(600);
    const closed = await p.evaluate(() =>
      !document.getElementById('navDrawer').classList.contains('is-open'));
    report('tiroir mobile ouvre/ferme (Échap)',
      opened.open && opened.expanded === 'true' && closed);

    // 6. La barre basse remplace le rail sous 1024px.
    const mobileNav = await p.evaluate(() => ({
      rail: getComputedStyle(document.querySelector('.sidenav')).display,
      tabs: getComputedStyle(document.querySelector('.tabbar')).display,
    }));
    report('rail masqué / barre basse affichée en mobile',
      mobileNav.rail === 'none' && mobileNav.tabs !== 'none',
      `rail:${mobileNav.rail} barre:${mobileNav.tabs}`);

    report('aucune erreur JS', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log(`\n--- échecs : ${failures} ---`);
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
