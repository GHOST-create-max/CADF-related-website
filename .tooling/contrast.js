/* Vérifie les ratios de contraste WCAG des paires texte/fond du thème.
   Exécutable seul (node contrast.js) — aucune dépendance.
   AA : 4.5:1 pour le texte normal, 3:1 pour le grand texte et les éléments
   d'interface. */

function srgb(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}

function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const T = {
  surface: '#FAF9F6',
  surfaceAlt: '#F0ECE2',
  surfaceCard: '#EDE9DD',
  ink: '#223140',
  inkSoft: '#47586A',
  inkMuted: '#586876',
  gold: '#8A6A1E',        // or de marque : traits, pastilles, bordures (non-texte)
  goldText: '#7E6019',    // or en TEXTE sur fonds teintés
  goldOnInk: '#D4B04A',   // or sur fond ink
  cream: '#FAF9F6',
  sky: '#0F6698',         // bleu ciel en TEXTE/bordure sur fonds clairs
  skyInk: '#101822',      // texte sombre posé sur un aplat bleu ciel
};

// Thème sombre : mêmes rôles, valeurs inversées.
const D = {
  surface: '#101822',
  surfaceAlt: '#16202C',
  surfaceCard: '#1C2836',
  ink: '#E8EDF2',
  inkSoft: '#B7C4D2',
  inkMuted: '#A3B1C1',
  gold: '#D4B04A',
  sky: '#7FC4F7',         // bleu ciel clair : texte et bordures sur fond sombre
};

// [libellé, premier plan, arrière-plan, seuil]
const PAIRS = [
  ['ink sur surface',            T.ink,      T.surface,     4.5],
  ['ink sur surface-alt',        T.ink,      T.surfaceAlt,  4.5],
  ['ink sur surface-card',       T.ink,      T.surfaceCard, 4.5],
  ['ink-soft sur surface',       T.inkSoft,  T.surface,     4.5],
  ['ink-soft sur surface-alt',   T.inkSoft,  T.surfaceAlt,  4.5],
  ['ink-soft sur surface-card',  T.inkSoft,  T.surfaceCard, 4.5],
  ['ink-muted sur surface',      T.inkMuted, T.surface,     4.5],
  ['ink-muted sur surface-alt',  T.inkMuted, T.surfaceAlt,  4.5],
  ['ink-muted sur surface-card', T.inkMuted, T.surfaceCard, 4.5],
  ['crème sur ink (bouton)',     T.cream,    T.ink,         4.5],
  // L'or de marque #8A6A1E ne sert QUE de trait/pastille (non-texte) : seuil 3:1.
  ['or trait sur surface',       T.gold,     T.surface,     3.0],
  ['or trait sur surface-alt',   T.gold,     T.surfaceAlt,  3.0],
  ['or trait sur surface-card',  T.gold,     T.surfaceCard, 3.0],
  // L'or en TEXTE utilise la variante plus profonde.
  ['or texte sur surface',       T.goldText, T.surface,     4.5],
  ['or texte sur surface-alt',   T.goldText, T.surfaceAlt,  4.5],
  ['or texte sur surface-card',  T.goldText, T.surfaceCard, 4.5],
  ['or clair sur ink',           T.goldOnInk, T.ink,        4.5],
  ['crème sur ink-soft',         T.cream,    T.inkSoft,     4.5],
  // Bleu ciel : accent interactif (survol, focus, liens, page active).
  ['ciel texte sur surface',     T.sky,      T.surface,     4.5],
  ['ciel texte sur surface-alt', T.sky,      T.surfaceAlt,  4.5],
  ['ciel texte sur surface-card',T.sky,      T.surfaceCard, 4.5],
];

// [libellé, premier plan, arrière-plan, seuil] — thème sombre
const PAIRS_DARK = [
  ['ink sur surface',            D.ink,      D.surface,     4.5],
  ['ink sur surface-alt',        D.ink,      D.surfaceAlt,  4.5],
  ['ink sur surface-card',       D.ink,      D.surfaceCard, 4.5],
  ['ink-soft sur surface',       D.inkSoft,  D.surface,     4.5],
  ['ink-soft sur surface-alt',   D.inkSoft,  D.surfaceAlt,  4.5],
  ['ink-soft sur surface-card',  D.inkSoft,  D.surfaceCard, 4.5],
  ['ink-muted sur surface',      D.inkMuted, D.surface,     4.5],
  ['ink-muted sur surface-alt',  D.inkMuted, D.surfaceAlt,  4.5],
  ['ink-muted sur surface-card', D.inkMuted, D.surfaceCard, 4.5],
  ['or sur surface',             D.gold,     D.surface,     4.5],
  ['or sur surface-alt',         D.gold,     D.surfaceAlt,  4.5],
  ['or sur surface-card',        D.gold,     D.surfaceCard, 4.5],
  ['ciel texte sur surface',     D.sky,      D.surface,     4.5],
  ['ciel texte sur surface-alt', D.sky,      D.surfaceAlt,  4.5],
  ['ciel texte sur surface-card',D.sky,      D.surfaceCard, 4.5],
  // Bouton principal inversé : fond clair, texte sombre.
  ['sombre sur ink (bouton)',    D.surface,  D.ink,         4.5],
  ['sombre sur aplat ciel',      T.skyInk,   D.sky,         4.5],
];

function table(title, pairs) {
  let fails = 0;
  console.log(`Contraste WCAG — ${title}\n`);
  for (const [label, fg, bg, min] of pairs) {
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) fails++;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label.padEnd(30)} ${r.toFixed(2)}:1  (min ${min})`);
  }
  return fails;
}

function run() {
  let fails = table('thème clair', PAIRS);
  console.log('');
  fails += table('thème sombre', PAIRS_DARK);
  console.log(`\n--- échecs : ${fails} ---`);
  return fails;
}

module.exports = { ratio, run, T, D };
if (require.main === module) process.exit(run() ? 1 : 0);
