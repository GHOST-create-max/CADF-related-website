// Vérifie la bascule clair/sombre : application, persistance, absence de
// scintillement, suivi du système, et lisibilité réelle des couleurs rendues.
const { launch, BASE_URL } = require('./browser');
const { ratio } = require('./contrast');

const PAGES = ['index', 'about', 'gallery', 'contact', 'dashboard'];
let failures = 0;
function report(label, ok, detail) {
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`);
}

// 'rgb(16, 24, 34)' -> '#101822'
const hex = (rgb) => {
  const m = rgb.match(/\d+/g);
  return '#' + m.slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('');
};

(async () => {
  const browser = await launch();

  /* 1. Bascule et persistance sur chaque page. */
  console.log('\n=== Bascule et persistance ===');
  for (const page of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(`${BASE_URL}/${page}.html`, { waitUntil: 'load' });
    await p.waitForTimeout(700);

    const before = await p.getAttribute('html', 'data-theme');
    await p.click('.theme-toggle');
    await p.waitForTimeout(400);
    const after = await p.getAttribute('html', 'data-theme');
    const pressed = await p.getAttribute('.theme-toggle', 'aria-pressed');
    report(`${page} : bascule`, before !== after && after === 'dark',
      `${before} -> ${after}, aria-pressed=${pressed}`);

    await p.reload({ waitUntil: 'load' });
    await p.waitForTimeout(500);
    const kept = await p.getAttribute('html', 'data-theme');
    report(`${page} : thème conservé au rechargement`, kept === 'dark', kept);
    report(`${page} : aucune erreur JS`, errors.length === 0, errors.join(' | '));
    await p.close();
    await ctx.close();
  }

  /* 2. Aucun scintillement : le thème doit être posé par le script en ligne
        du <head>, donc déjà correct au tout premier état « interactive ». */
  console.log('\n=== Absence de scintillement ===');
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await ctx2.newPage();
  await p2.addInitScript(() => {
    try { localStorage.setItem('cadf.theme', 'dark'); } catch (e) {}
    window.__states = [];
    document.addEventListener('readystatechange', () => {
      window.__states.push(document.readyState + ':'
        + document.documentElement.getAttribute('data-theme'));
    });
  });
  await p2.goto(`${BASE_URL}/index.html`, { waitUntil: 'load' });
  await p2.waitForTimeout(400);
  const states = await p2.evaluate(() => window.__states);
  report('thème appliqué avant le premier rendu',
    states.length > 0 && states.every((x) => x.endsWith(':dark')),
    states.join(', '));

  // Le script doit précéder le <body> dans la source, sinon un fond clair
  // peut être peint avant son exécution.
  const html = await p2.content();
  report('script de thème placé avant le <body>',
    html.indexOf('cadf.theme') > -1 && html.indexOf('cadf.theme') < html.indexOf('<body'));
  await p2.close();
  await ctx2.close();

  /* 3. Suivi du réglage système quand l'utilisateur n'a rien choisi. */
  console.log('\n=== Réglage système ===');
  const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const p3 = await ctx3.newPage();
  await p3.goto(`${BASE_URL}/index.html`, { waitUntil: 'load' });
  await p3.waitForTimeout(500);
  const auto = await p3.getAttribute('html', 'data-theme');
  report('sombre par défaut si le système est sombre', auto === 'dark', String(auto));
  await p3.close();
  await ctx3.close();

  /* 4. Contraste réellement rendu en thème sombre. */
  console.log('\n=== Contraste rendu (sombre) ===');
  const ctx4 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p4 = await ctx4.newPage();
  await p4.addInitScript(() => {
    try { localStorage.setItem('cadf.theme', 'dark'); } catch (e) {}
  });
  for (const page of PAGES) {
    await p4.goto(`${BASE_URL}/${page}.html`, { waitUntil: 'load' });
    await p4.waitForTimeout(900);

    const samples = await p4.evaluate(() => {
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = getComputedStyle(n).backgroundColor;
          if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
          n = n.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      const out = [];
      const sel = 'h1, h2, h3, p, a, li, td, th, label, .eyebrow, .bento__label, .card__text';
      for (const el of [...document.querySelectorAll(sel)].slice(0, 90)) {
        const txt = (el.textContent || '').trim();
        if (!txt || el.closest('.sr-only')) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const size = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight, 10) >= 700;
        out.push({
          fg: cs.color, bg: bgOf(el),
          large: size >= 24 || (size >= 18.66 && bold),
          tag: el.tagName.toLowerCase(),
          txt: txt.slice(0, 28),
        });
      }
      return out;
    });

    let worst = null;
    for (const s of samples) {
      if (!s.fg.startsWith('rgb') || !s.bg.startsWith('rgb')) continue;
      if (/rgba\(.*,\s*0\)/.test(s.fg)) continue;
      const r = ratio(hex(s.fg), hex(s.bg));
      const min = s.large ? 3 : 4.5;
      if (!worst || r - min < worst.margin) worst = { ...s, r, min, margin: r - min };
    }
    report(`${page} : tout le texte lisible en sombre`,
      worst ? worst.margin >= 0 : false,
      worst ? `pire cas ${worst.r.toFixed(2)}:1 (min ${worst.min}) <${worst.tag}> "${worst.txt}"` : 'aucun échantillon');
  }
  await p4.close();
  await ctx4.close();

  console.log(`\n--- échecs : ${failures} ---`);
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
