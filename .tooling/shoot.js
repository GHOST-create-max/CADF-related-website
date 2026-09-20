// Screenshots every page (desktop + mobile) into .tooling/shots/
const fs = require('fs');
const path = require('path');
const { launch, BASE_URL } = require('./browser');

const PAGES = ['index.html', 'about.html', 'gallery.html', 'contact.html', 'dashboard.html'];
const OUT = path.join(__dirname, 'shots');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await launch();
  const full = process.argv.includes('--full');

  for (const [label, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    for (const page of PAGES) {
      const tab = await ctx.newPage();
      await tab.goto(`${BASE_URL}/${page}`, { waitUntil: 'load', timeout: 30000 });
      await tab.waitForTimeout(3000);
      const name = `${label}-${page.replace('.html', '')}.png`;
      await tab.screenshot({ path: path.join(OUT, name), fullPage: full });
      console.log('saved', name);
      await tab.close();
    }
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
