// Ouvre chaque image de la galerie dans la lightbox et vérifie qu'elle charge.
const { launch, BASE_URL } = require('./browser');

(async () => {
  const b = await launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  const bad = [];
  p.on('response', (r) => {
    if (r.status() >= 400) bad.push(r.url().replace(BASE_URL, '') + ' -> ' + r.status());
  });
  await p.goto(BASE_URL + '/gallery.html', { waitUntil: 'load' });
  await p.waitForTimeout(1500);

  const n = await p.locator('.shot').count();
  console.log('vignettes :', n);
  let ok = 0;

  for (let i = 0; i < n; i++) {
    await p.locator('.shot').nth(i).click();
    await p.waitForTimeout(450);
    const r = await p.evaluate(() => {
      const img = document.getElementById('lightboxImg');
      return {
        open: document.getElementById('lightbox').classList.contains('is-open'),
        src: img.getAttribute('src'),
        loaded: img.complete && img.naturalWidth > 0,
        alt: (img.getAttribute('alt') || '').length,
        date: document.getElementById('lightboxDate').textContent.trim(),
      };
    });
    const good = r.open && r.loaded && r.alt > 40 && r.date.length > 4;
    if (good) ok++;
    console.log(`  image ${String(i + 1).padStart(2)} : ${good ? 'OK  ' : 'FAIL'} ${r.src}  [${r.date}]`);
    await p.click('#lightboxClose');
    await p.waitForTimeout(250);
  }

  console.log(`\nimages chargées dans la lightbox : ${ok}/${n}`);
  console.log('erreurs HTTP :', bad.length ? bad.join(', ') : 'aucune');
  await b.close();
  process.exit(ok === n && bad.length === 0 ? 0 : 1);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
