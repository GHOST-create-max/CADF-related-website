// Vérifie les fonctions propres aux pages : lightbox de la galerie,
// formulaire de contact (validation, brouillon, envoi réel), espace élève.
const { launch, BASE_URL } = require('./browser');

let failures = 0;
function report(label, ok, detail) {
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`);
}

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  /* ------------------------------------------------- Galerie : lightbox */
  console.log('\n=== Galerie : lightbox ===');
  const gal = await ctx.newPage();
  const galErrors = [];
  gal.on('pageerror', (e) => galErrors.push(e.message));
  await gal.goto(`${BASE_URL}/gallery.html`, { waitUntil: 'load' });
  await gal.waitForTimeout(1400);

  const shots = await gal.locator('.shot').count();
  report('12 photos dans la galerie', shots === 12, `${shots} vignettes`);

  // Toutes les images doivent être différées et dimensionnées.
  const imgAttrs = await gal.evaluate(() =>
    [...document.querySelectorAll('.shot img')].map((i) => ({
      lazy: i.getAttribute('loading') === 'lazy',
      sized: !!i.getAttribute('width') && !!i.getAttribute('height'),
      alt: (i.getAttribute('alt') || '').length,
    })));
  report('chargement différé sur toutes les vignettes', imgAttrs.every((i) => i.lazy));
  report('dimensions réservées sur toutes les vignettes', imgAttrs.every((i) => i.sized));
  report('texte alternatif descriptif partout',
    imgAttrs.every((i) => i.alt > 40), `plus court : ${Math.min(...imgAttrs.map((i) => i.alt))} caractères`);

  await gal.evaluate(() => document.querySelector('.shot').focus());
  await gal.keyboard.press('Enter');
  await gal.waitForTimeout(500);
  const opened = await gal.evaluate(() =>
    document.getElementById('lightbox').classList.contains('is-open'));
  report('ouverture au clavier (Entrée)', opened);

  const first = await gal.evaluate(() => document.getElementById('lightboxImg').getAttribute('src'));
  await gal.keyboard.press('ArrowRight');
  await gal.waitForTimeout(400);
  const second = await gal.evaluate(() => document.getElementById('lightboxImg').getAttribute('src'));
  report('flèche droite : image suivante', first !== second,
    `${first} -> ${second}`);

  await gal.keyboard.press('ArrowLeft');
  await gal.waitForTimeout(400);
  const backImg = await gal.evaluate(() => document.getElementById('lightboxImg').getAttribute('src'));
  report('flèche gauche : image précédente', backImg === first);

  const legend = await gal.evaluate(() => ({
    date: document.getElementById('lightboxDate').textContent.trim(),
    desc: document.getElementById('lightboxDesc').textContent.trim(),
  }));
  report('date et description reprises', legend.date.length > 4 && legend.desc.length > 40,
    `${legend.date} / ${legend.desc.slice(0, 40)}…`);

  await gal.keyboard.press('Escape');
  await gal.waitForTimeout(500);
  const closed = await gal.evaluate(() =>
    !document.getElementById('lightbox').classList.contains('is-open'));
  const restored = await gal.evaluate(() =>
    document.activeElement.classList.contains('shot'));
  report('fermeture avec Échap', closed);
  report('focus rendu à la vignette', restored);
  report('aucune erreur JS', galErrors.length === 0, galErrors.join(' | '));
  await gal.close();

  /* ------------------------------------------------ Contact : formulaire */
  console.log('\n=== Contact : formulaire ===');
  const form = await ctx.newPage();
  const formErrors = [];
  form.on('pageerror', (e) => formErrors.push(e.message));

  // On simule le webhook : la page croit envoyer à un vrai service.
  const ENDPOINT = 'https://n8n.test.invalid/webhook/cadf-contact';
  let posted = null;
  await form.route(ENDPOINT, async (route) => {
    posted = JSON.parse(route.request().postData() || '{}');
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await form.goto(`${BASE_URL}/contact.html`, { waitUntil: 'load' });
  await form.waitForTimeout(1200);
  await form.evaluate((url) => {
    document.querySelector('meta[name="cadf-contact-endpoint"]').content = url;
  }, ENDPOINT);

  // Envoi à vide : doit refuser et signaler les champs.
  await form.click('.form-button');
  await form.waitForTimeout(500);
  const invalid = await form.locator('[aria-invalid="true"]').count();
  report('champs vides signalés', invalid > 0, `${invalid} champ(s)`);

  // Email mal formé : refus également.
  await form.fill('#firstName', 'Jean');
  await form.fill('#lastName', 'Baptiste');
  await form.fill('#email', 'pas-un-email');
  await form.selectOption('#subject', { index: 1 });
  await form.fill('#message', 'Bonjour, je souhaite des informations sur les admissions.');
  await form.click('.form-button');
  await form.waitForTimeout(400);
  const badMail = await form.evaluate(() =>
    document.getElementById('email').getAttribute('aria-invalid'));
  report('adresse email invalide refusée', badMail === 'true');

  await form.fill('#email', 'jean@example.com');
  const draft = await form.evaluate(() => localStorage.getItem('cadf.contact.firstName'));
  report('brouillon enregistré', draft === 'Jean', JSON.stringify(draft));

  await form.click('.form-button');
  await form.waitForTimeout(1500);

  report('requête réellement envoyée au point d\'arrivée', posted !== null,
    posted ? Object.keys(posted).join(', ') : 'aucune requête');
  report('charge utile complète',
    !!posted && posted.email === 'jean@example.com' && !!posted.message && !!posted.sentAt);

  const state = await form.evaluate(() =>
    document.getElementById('formStatus').getAttribute('data-state'));
  const cleared = await form.evaluate(() => localStorage.getItem('cadf.contact.firstName'));
  report('confirmation affichée', state === 'ok', `état : ${state}`);
  report('brouillon nettoyé après envoi', cleared === null);

  // Panne du service : l'utilisateur doit être prévenu, pas laissé sans réponse.
  await form.unroute(ENDPOINT);
  await form.route(ENDPOINT, (route) => route.fulfill({ status: 500, body: 'boom' }));
  await form.fill('#firstName', 'Marie');
  await form.fill('#lastName', 'Pierre');
  await form.fill('#email', 'marie@example.com');
  await form.selectOption('#subject', { index: 2 });
  await form.fill('#message', 'Second message de test.');
  await form.click('.form-button');
  await form.waitForTimeout(1200);
  const errState = await form.evaluate(() =>
    document.getElementById('formStatus').getAttribute('data-state'));
  report('panne du service signalée à l\'utilisateur', errState === 'error', `état : ${errState}`);
  report('aucune erreur JS', formErrors.length === 0, formErrors.join(' | '));
  await form.close();

  /* ------------------------------------------------- Espace élève */
  console.log('\n=== Espace élève ===');
  const dash = await ctx.newPage();
  const dashErrors = [];
  dash.on('pageerror', (e) => dashErrors.push(e.message));
  await dash.goto(`${BASE_URL}/dashboard.html`, { waitUntil: 'load' });
  await dash.waitForTimeout(1200);

  const gated = await dash.evaluate(() => ({
    login: !document.getElementById('loginGate').hidden,
    board: document.getElementById('dashboard').hidden,
  }));
  report('tableau de bord masqué avant connexion', gated.login && gated.board);

  await dash.fill('#studentId', 'demo');
  await dash.fill('#studentPin', 'mauvais');
  await dash.click('#loginForm button[type="submit"]');
  await dash.waitForTimeout(400);
  const refused = await dash.evaluate(() =>
    document.getElementById('loginError').textContent.length > 10
    && document.getElementById('dashboard').hidden);
  report('identifiants erronés refusés', refused);

  await dash.fill('#studentPin', '1234');
  await dash.click('#loginForm button[type="submit"]');
  await dash.waitForTimeout(600);
  const inside = await dash.evaluate(() => ({
    board: !document.getElementById('dashboard').hidden,
    cells: document.querySelectorAll('.bento__cell').length,
    rows: document.querySelectorAll('.timetable tbody tr').length,
    grades: document.querySelectorAll('.grade-row').length,
    notices: document.querySelectorAll('.notice').length,
  }));
  report('connexion réussie', inside.board);
  report('grille bento complète', inside.cells === 6, `${inside.cells} tuiles`);
  report('emploi du temps, notes et annonces présents',
    inside.rows === 6 && inside.grades === 6 && inside.notices === 3,
    `cours:${inside.rows} notes:${inside.grades} annonces:${inside.notices}`);

  // La session survit au rechargement.
  await dash.reload({ waitUntil: 'load' });
  await dash.waitForTimeout(900);
  const kept = await dash.evaluate(() => !document.getElementById('dashboard').hidden);
  report('session conservée au rechargement', kept);

  // Messagerie vers la direction : message vide refusé.
  await dash.click('#messageForm button[type="submit"]');
  await dash.waitForTimeout(400);
  const emptyMsg = await dash.evaluate(() =>
    document.getElementById('messageStatus').getAttribute('data-state'));
  report('message vide refusé', emptyMsg === 'error', `état : ${emptyMsg}`);

  await dash.click('#logout');
  await dash.waitForTimeout(400);
  const out = await dash.evaluate(() => document.getElementById('dashboard').hidden);
  report('déconnexion', out);
  report('aucune erreur JS', dashErrors.length === 0, dashErrors.join(' | '));
  await dash.close();

  console.log(`\n--- échecs : ${failures} ---`);
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
