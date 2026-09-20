// Capture les états de survol (voile bleu ciel) en clair et en sombre.
const path = require('path');
const { launch, BASE_URL } = require('./browser');
(async () => {
  const b = await launch();
  for (const theme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: 1500, height: 950 } });
    const p = await ctx.newPage();
    await p.addInitScript((t) => {
      try { localStorage.setItem('cadf.theme', t); } catch (e) {}
    }, theme);
    await p.goto(`${BASE_URL}/index.html`, { waitUntil: 'load' });
    await p.waitForTimeout(1800);

    // Survol simultané : un lien du rail + une carte.
    await p.hover('.sidenav__link[href="about.html"]');
    await p.waitForTimeout(500);
    await p.locator('.value-grid .card').first().scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    // Le survol du rail est perdu dès que la souris bouge : on capture donc
    // la carte survolée, le rail étant vérifié séparément ci-dessous.
    await p.hover('.value-grid .card');
    await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(__dirname, 'shots', `hover-${theme}.png`) });

    const styles = await p.evaluate(() => {
      const card = document.querySelector('.value-grid .card');
      const link = document.querySelector('.sidenav__link[href="about.html"]');
      return {
        carteFond: getComputedStyle(card).backgroundColor,
        carteBordure: getComputedStyle(card).borderColor,
        lienFond: getComputedStyle(link).backgroundColor,
        lienTexte: getComputedStyle(link).color,
      };
    });
    console.log(theme, JSON.stringify(styles, null, 1));
    await ctx.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
