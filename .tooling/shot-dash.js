// Capture du tableau de bord une fois la session ouverte.
const path = require('path');
const { launch, BASE_URL } = require('./browser');
(async () => {
  const b = await launch();
  for (const [w, h, name] of [[1600, 1200, 'desktop'], [375, 812, 'mobile']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto(BASE_URL + '/dashboard.html', { waitUntil: 'load' });
    await p.waitForTimeout(1000);
    await p.fill('#studentId', 'demo');
    await p.fill('#studentPin', '1234');
    await p.click('#loginForm button[type="submit"]');
    await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(__dirname, 'shots', `${name}-dashboard-in.png`), fullPage: name === 'mobile' });
    console.log('capturé', name);
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
