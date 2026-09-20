/* Fragments partagés : icônes SVG (style Lucide), navigation, pied de page.
   Écrits une seule fois ici puis injectés dans chaque page par build.js. */

const I = {
  home:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7"/><path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M9 21v-7h6v7"/></svg>',
  info:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
  images:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  mail:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 8.7 6.1a2 2 0 0 0 2.6 0L22 7"/></svg>',
  dash:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  arrow:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>',
  menu:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  left:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  right:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  pin:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  phone:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.7 2 2 0 0 1 4.1 1.5h2.6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.8 9.2a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  clock:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 1.9"/></svg>',
  users:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 20v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  award:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.2 14.3-1.4 7 5.2-3 5.2 3-1.4-7"/></svg>',
  book:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 17.5h16"/></svg>',
  flask:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v6.5L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 8.5V2"/><path d="M9 2h6M7.5 15h9"/></svg>',
  globe:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/></svg>',
  palette:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.8-1.8 0-1.1-.9-1.8-.9-2.7 0-.9.9-1.8 1.8-1.8H17a4.5 4.5 0 0 0 4.5-4.5C21.5 6 17.2 3 12 3"/><circle cx="7.6" cy="11.4" r="1.1"/><circle cx="11" cy="7.5" r="1.1"/><circle cx="15.5" cy="8.9" r="1.1"/></svg>',
  seedling:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-8.5"/><path d="M12 12.5C12 8.6 15 5.6 20 5.6c0 4.9-3.4 6.9-8 6.9"/><path d="M12 14.5c0-3.4-2.6-6-6-6 0 3.9 2.4 6 6 6"/></svg>',
  shield:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.6 8-10V5.5l-8-3-8 3V12c0 6.4 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>',
  bulb:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 17.5a6.5 6.5 0 1 1 5 0"/><path d="M9.7 17.5h4.6M10.4 20.5h3.2"/></svg>',
  hands:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.3S4.2 15.7 4.2 10.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.8 3c0 5.1-7.8 9.7-7.8 9.7"/></svg>',
  calendar:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  chart:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 15-6v14L3 13z"/><path d="M3 11v2a2 2 0 0 0 2 2h1v4h3v-4"/></svg>',
  checkCal:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/></svg>',
  lock:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  logout:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  spinner:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>',
  sun:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/></svg>',
  moon:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13.2A9 9 0 1 1 10.8 3a7 7 0 0 0 10.2 10.2"/></svg>',
  warn:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0"/><path d="M12 9v4M12 17h.01"/></svg>',
};

const NAV = [
  { href: 'index.html',     label: 'Accueil',     icon: 'home' },
  { href: 'about.html',     label: 'À propos',    icon: 'info' },
  { href: 'gallery.html',   label: 'Galerie',     icon: 'images' },
  { href: 'contact.html',   label: 'Contact',     icon: 'mail' },
  { href: 'dashboard.html', label: 'Espace élève', icon: 'dash' },
];

/* Point d'arrivée du formulaire de contact : renseignez l'URL du webhook n8n
   (ou du service d'emailing) ici, puis relancez `node .tooling/build/build.js`.
   Laissée vide, la page bascule proprement sur un envoi par client mail. */
const CONTACT_ENDPOINT = '';

/* Bouton de bascule clair/sombre. aria-pressed est mis à jour par main.js ;
   les deux icônes sont présentes, le CSS masque celle qui ne s'applique pas. */
const themeToggle = (extra = '') => `<button type="button" class="theme-toggle${extra}" id="themeToggle" aria-pressed="false">
            <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">${I.sun}</span>
            <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">${I.moon}</span>
            <span class="theme-toggle__label">Mode sombre</span>
        </button>`;

const head = (title, desc) => `<!DOCTYPE html>
<html lang="fr" class="no-js">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <meta name="cadf-contact-endpoint" content="${CONTACT_ENDPOINT}">
    <link rel="icon" href="assets/img/Dumas_logo.webp" type="image/webp">
    <link rel="preload" href="assets/fonts/jakarta.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="main.css">
    <script>
        /* Appliqué avant le rendu : évite que le thème clair n'apparaisse
           un instant quand l'utilisateur a choisi le sombre. */
        (function () {
            try {
                var t = localStorage.getItem('cadf.theme');
                if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', t);
            } catch (e) {}
        })();
    </script>
</head>`;

/* Barre latérale fixe (>= 1024px). L'élément actif porte aria-current et
   reçoit la pastille or via le CSS. */
const sidenav = (current) => `    <nav class="sidenav" aria-label="Navigation principale">
        <a class="brand" href="index.html">
            <span class="brand__mark" aria-hidden="true">CADF</span>
            <span class="brand__text">Alexandre Dumas Fils<small>Cap-Haïtien</small></span>
        </a>
        <ul class="sidenav__list">
${NAV.map((n) => `            <li><a class="sidenav__link" href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${I[n.icon]}<span>${n.label}</span>${n.href === current ? '<span class="dot" aria-hidden="true"></span>' : ''}</a></li>`).join('\n')}
        </ul>
        <div class="sidenav__foot">
            ${themeToggle()}
            <a class="sidenav__cta" href="contact.html">Demander une admission ${I.arrow}</a>
            <p class="sidenav__meta">15, Rue Alexandre Dumas<br>Cap-Haïtien, Haïti</p>
        </div>
    </nav>`;

/* Barre supérieure compacte + tiroir, pour mobile et tablette. */
const mobileChrome = (current) => `    <header class="topbar">
        <a class="brand brand--bare" href="index.html">
            <span class="brand__mark" aria-hidden="true">CADF</span>
            <span class="brand__text">Alexandre Dumas Fils<small>Cap-Haïtien</small></span>
        </a>
        <div class="topbar__actions">
        ${themeToggle(' theme-toggle--compact')}
        <button type="button" class="btn btn--ghost btn--icon" id="navToggle" aria-expanded="false" aria-controls="navDrawer">
            ${I.menu}<span class="sr-only">Ouvrir le menu</span>
        </button>
        </div>
    </header>

    <div class="nav-scrim" id="navScrim"></div>
    <div class="nav-drawer" id="navDrawer" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="nav-drawer__head">
            <span class="brand__text">Menu</span>
            <button type="button" class="btn btn--ghost btn--icon" id="navClose">${I.close}<span class="sr-only">Fermer</span></button>
        </div>
${NAV.map((n) => `        <a class="nav-drawer__link" href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${I[n.icon]}<span>${n.label}</span></a>`).join('\n')}
    </div>`;

/* Barre basse : 5 éléments, visible sous 1024px. */
const tabbar = (current) => `    <nav class="tabbar" aria-label="Navigation">
        <ul class="tabbar__list">
${NAV.map((n) => `            <li><a class="tabbar__link" href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${I[n.icon]}<span>${n.label.replace('Espace élève', 'Élève')}</span>${n.href === current ? '<span class="dot" aria-hidden="true"></span>' : ''}</a></li>`).join('\n')}
        </ul>
    </nav>`;

const footer = () => `        <footer class="footer">
            <div class="wrap">
                <div class="footer__grid">
                    <div>
                        <h3>Le collège</h3>
                        <p>Excellence académique au cœur du Cap-Haïtien depuis 25 ans. Former des citoyens responsables, créatifs et engagés.</p>
                    </div>
                    <div>
                        <h3>Navigation</h3>
                        <ul>
${NAV.map((n) => `                            <li><a href="${n.href}">${n.label}</a></li>`).join('\n')}
                        </ul>
                    </div>
                    <div>
                        <h3>Contact</h3>
                        <ul>
                            <li><a href="tel:+50929355678">+509 2935-5678</a></li>
                            <li><a href="mailto:info@collegealexandredumas.edu.ht">info@collegealexandredumas.edu.ht</a></li>
                            <li>15, Rue Alexandre Dumas<br>Cap-Haïtien, HT1110</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Horaires</h3>
                        <ul>
                            <li>Lundi – vendredi : 7h00 – 17h00</li>
                            <li>Samedi : 8h00 – 12h00</li>
                            <li>Dimanche : fermé</li>
                        </ul>
                    </div>
                </div>
                <p class="footer__bottom">© ${new Date().getFullYear()} Collège Alexandre Dumas Fils — Cap-Haïtien, Haïti.</p>
            </div>
        </footer>`;

const scripts = () => `    <script src="assets/vendor/gsap.min.js"></script>
    <script src="main.js"></script>
</body>
</html>
`;

module.exports = { I, NAV, CONTACT_ENDPOINT, themeToggle, head, sidenav, mobileChrome, tabbar, footer, scripts };
