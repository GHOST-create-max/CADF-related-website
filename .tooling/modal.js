// Ouvre chaque image de la galerie dans la lightbox et vérifie qu'elle charge.
const { launch, BASE_URL } = require('./browser');
(async () => {
  const b = await launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  const bad = [];
  p.on('response', r => { if (r.status() >= 400) bad.push(r.url().replace(BASE_URL,'') + ' -> ' + r.status()); });
  await p.goto(BASE_URL + '/gallery.html', { waitUntil: 'load' });
  await p.waitForTimeout(1500);

  const n = await p.locator('.gallery-item').count();
  console.log('gallery items:', n);
  let ok = 0;
  for (let i = 0; i < n; i++) {
    await p.locator('.gallery-item').nth(i).click();
    await p.waitForTimeout(450);
    const r = await p.evaluate(() => {
      const img = document.getElementById('modalImage');
      return { open: document.getElementById('imageModal').classList.contains('active'),
               src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0,
               date: document.getElementById('modalDate').textContent.trim() };
    });
    const good = r.open && r.loaded;
    if (good) ok++;
    console.log(`  item ${String(i+1).padStart(2)}: ${good ? 'OK  ' : 'FAIL'} ${r.src}  [${r.date}]`);
    await p.click('#modalClose');
    await p.waitForTimeout(250);
  }
  console.log(`\nmodal images loading: ${ok}/${n}`);
  console.log('HTTP errors:', bad.length ? bad.join(', ') : 'none');
  await b.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
