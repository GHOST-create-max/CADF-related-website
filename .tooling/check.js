// Loads every page of the site in headless Chromium and reports
// console errors, failed requests, and basic page stats.
const { launch, BASE_URL } = require('./browser');

const PAGES = ['index.html', 'about.html', 'gallery.html', 'contact.html'];

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let problems = 0;

  for (const page of PAGES) {
    const tab = await ctx.newPage();
    const errors = [];
    const failed = [];

    tab.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 200));
    });
    tab.on('pageerror', (e) => errors.push('pageerror: ' + String(e.message).slice(0, 200)));
    tab.on('requestfailed', (r) => failed.push(`${r.url().replace(BASE_URL, '')} (${r.failure()?.errorText})`));
    tab.on('response', (r) => {
      if (r.status() >= 400) failed.push(`${r.url().replace(BASE_URL, '')} -> HTTP ${r.status()}`);
    });

    const res = await tab.goto(`${BASE_URL}/${page}`, { waitUntil: 'load', timeout: 30000 });
    await tab.waitForTimeout(2500); // let loader/animations settle

    const info = await tab.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.innerText.trim().replace(/\s+/g, ' ').slice(0, 70) || '(none)',
      imgs: document.images.length,
      brokenImgs: [...document.images].filter((i) => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length,
      noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      // Les emoji dépendent d'une police système : ils s'affichent en carré
      // vide sur les machines qui n'en ont pas. On utilise des SVG à la place.
      emoji: (document.body.innerText.match(
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || []).length,
      links: document.querySelectorAll('a').length,
      height: document.body.scrollHeight,
      loaderVisible: (() => {
        const c = document.getElementById('loader');
        if (!c) return 'n/a (no loader on this page)';
        const cs = getComputedStyle(c);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
      })(),
    }));

    console.log(`\n=== ${page} — HTTP ${res.status()} ===`);
    console.log(`  title        : ${info.title}`);
    console.log(`  h1           : ${info.h1}`);
    console.log(`  images       : ${info.imgs} (broken: ${info.brokenImgs}, missing alt: ${info.noAlt})`);
    console.log(`  links        : ${info.links}`);
    console.log(`  page height  : ${info.height}px`);
    console.log(`  loader stuck : ${info.loaderVisible}`);
    console.log(`  JS errors    : ${errors.length ? errors.join(' | ') : 'none'}`);
    console.log(`  emoji glyphs : ${info.emoji}`);
    console.log(`  failed reqs  : ${failed.length ? failed.join(' | ') : 'none'}`);

    problems += errors.length + failed.length + info.brokenImgs + info.emoji;
    await tab.close();
  }

  console.log(`\n--- total issues found: ${problems} ---`);
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
