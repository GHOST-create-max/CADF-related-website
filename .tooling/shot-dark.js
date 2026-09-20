// Captures en thème sombre, pour inspection visuelle.
const path = require('path');
const { launch, BASE_URL } = require('./browser');
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    try { localStorage.setItem('cadf.theme', 'dark'); } catch (e) {}
  });
  for (const page of ['index', 'about', 'gallery', 'contact', 'dashboard']) {
    await p.goto(`${BASE_URL}/${page}.html`, { waitUntil: 'load' });
    await p.waitForTimeout(1800);
    await p.screenshot({ path: path.join(__dirname, 'shots', `dark-${page}.png`) });
    console.log('capturé dark-' + page);
  }
  // Tableau de bord connecté.
  await p.goto(`${BASE_URL}/dashboard.html`, { waitUntil: 'load' });
  await p.waitForTimeout(700);
  await p.fill('#studentId', 'demo');
  await p.fill('#studentPin', '1234');
  await p.click('#loginForm button[type="submit"]');
  await p.waitForTimeout(900);
  await p.screenshot({ path: path.join(__dirname, 'shots', 'dark-dashboard-in.png') });
  console.log('capturé dark-dashboard-in');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
