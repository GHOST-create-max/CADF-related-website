// Vérifie les fonctions propres aux pages : filtres de l'accueil,
// navigation clavier de la lightbox, formulaire de contact.
const { launch, BASE_URL } = require('./browser');

let failures = 0;
function report(label, ok, detail) {
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`);
}

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  /* ---------------------------------------------------- Accueil : filtres */
  console.log('\n=== Accueil : filtres ===');
  const home = await ctx.newPage();
  const homeErrors = [];
  home.on('pageerror', (e) => homeErrors.push(e.message));
  await home.goto(`${BASE_URL}/index.html`, { waitUntil: 'load' });
  await home.waitForTimeout(1400);

  const total = await home.locator('#courseGrid .course-card').count();
  report('4 filières affichées au départ', total === 4, `${total} cartes`);

  await home.click('.chip[data-filter="pink"]');
  await home.waitForTimeout(400);
  const shown = await home.evaluate(() =>
    [...document.querySelectorAll('#courseGrid .course-card')]
      .filter((c) => c.style.display !== 'none').length);
  report('filtre « Sciences » ne garde qu\'une carte', shown === 1, `${shown} visible(s)`);

  const selected = await home.evaluate(() =>
    document.querySelector('.chip[data-filter="pink"]').getAttribute('aria-selected'));
  report('aria-selected mis à jour', selected === 'true');

  await home.click('.chip[data-filter="all"]');
  await home.waitForTimeout(400);
  const back = await home.evaluate(() =>
    [...document.querySelectorAll('#courseGrid .course-card')]
      .filter((c) => c.style.display !== 'none').length);
  report('« Tout » rétablit les 4 cartes', back === 4, `${back} visible(s)`);
  report('aucune erreur JS', homeErrors.length === 0, homeErrors.join(' | '));
  await home.close();

  /* ------------------------------------------------- Galerie : lightbox */
  console.log('\n=== Galerie : lightbox ===');
  const gal = await ctx.newPage();
  await gal.goto(`${BASE_URL}/gallery.html`, { waitUntil: 'load' });
  await gal.waitForTimeout(1400);

  await gal.evaluate(() => document.querySelector('.gallery-item').focus());
  await gal.keyboard.press('Enter');
  await gal.waitForTimeout(500);
  const opened = await gal.evaluate(() =>
    document.getElementById('imageModal').classList.contains('active'));
  report('ouverture au clavier (Entrée)', opened);

  const first = await gal.evaluate(() => document.getElementById('modalImage').getAttribute('src'));
  await gal.keyboard.press('ArrowRight');
  await gal.waitForTimeout(400);
  const second = await gal.evaluate(() => document.getElementById('modalImage').getAttribute('src'));
  report('flèche droite : image suivante', first !== second, `${first} -> ${second}`);

  await gal.keyboard.press('ArrowLeft');
  await gal.waitForTimeout(400);
  const backImg = await gal.evaluate(() => document.getElementById('modalImage').getAttribute('src'));
  report('flèche gauche : image précédente', backImg === first);

  await gal.keyboard.press('Escape');
  await gal.waitForTimeout(500);
  const closed = await gal.evaluate(() =>
    !document.getElementById('imageModal').classList.contains('active'));
  const restored = await gal.evaluate(() =>
    document.activeElement.classList.contains('gallery-item'));
  report('fermeture avec Échap', closed);
  report('focus rendu à la vignette', restored);
  await gal.close();

  /* ------------------------------------------------ Contact : formulaire */
  console.log('\n=== Contact : formulaire ===');
  const form = await ctx.newPage();
  const formErrors = [];
  form.on('pageerror', (e) => formErrors.push(e.message));
  await form.goto(`${BASE_URL}/contact.html`, { waitUntil: 'load' });
  await form.waitForTimeout(1400);

  // Envoi à vide : doit refuser et signaler les champs.
  await form.click('.form-button');
  await form.waitForTimeout(500);
  const invalid = await form.locator('[aria-invalid="true"]').count();
  report('champs vides signalés', invalid > 0, `${invalid} champ(s)`);

  await form.fill('#firstName', 'Jean');
  await form.fill('#lastName', 'Baptiste');
  await form.fill('#email', 'jean@example.com');
  await form.selectOption('#subject', { index: 1 });
  await form.fill('#messageField', 'Bonjour, je souhaite des informations sur les admissions.');

  const draft = await form.evaluate(() => localStorage.getItem('contact_firstName'));
  report('brouillon enregistré', draft === 'Jean', JSON.stringify(draft));

  await form.click('.form-button');
  await form.waitForTimeout(2400);
  const note = await form.locator('.form-confirmation').count();
  const cleared = await form.evaluate(() => localStorage.getItem('contact_firstName'));
  report('confirmation affichée', note > 0);
  report('brouillon nettoyé après envoi', cleared === null);
  report('aucune erreur JS', formErrors.length === 0, formErrors.join(' | '));
  await form.close();

  console.log(`\n--- échecs : ${failures} ---`);
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
