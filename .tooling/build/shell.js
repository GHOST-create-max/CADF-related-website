// Fragments HTML partagés par les 4 pages (rail, menu mobile, footer).
// Utilisé par build.js pour générer les pages : la navigation et le pied de
// page ne sont écrits qu'une fois ici.

const ICONS = {
  home:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.2 12 3l9 7.2"/><path d="M5 9.6V21h14V9.6"/></svg>',
  about:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v14a1.6 1.6 0 0 0-1.6-1.6H4z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v14a1.6 1.6 0 0 1 1.6-1.6H20z"/></svg>',
  gallery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.6" cy="9.4" r="1.6"/><path d="m4 17 4.5-4.2a2 2 0 0 1 2.7 0L20 20"/></svg>',
  contact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m3.5 7 7.4 5.2a2 2 0 0 0 2.2 0L20.5 7"/></svg>',
  bell:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.6a6 6 0 1 0-12 0c0 6-2 7.4-2 7.4h16s-2-1.4-2-7.4"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/></svg>',
  gear:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"/><path d="M19.4 14.5a1.6 1.6 0 0 0 .33 1.78l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.78-.33 1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.78.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.33-1.78l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 9 4.6h.08A1.6 1.6 0 0 0 10 3.13V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.78-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.4 9v.08a1.6 1.6 0 0 0 1.47 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.47 1z"/></svg>',
  sun:     '<svg id="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 1.6v2.6M12 19.8v2.6M4.2 4.2l1.9 1.9M17.9 17.9l1.9 1.9M1.6 12h2.6M19.8 12h2.6M4.2 19.8l1.9-1.9M17.9 6.1l1.9-1.9"/></svg>',
  moon:    '<svg id="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7"/></svg>',
  book:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v18H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M8 3v18"/></svg>',
  flask:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3v6.2L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.2V3"/><path d="M9 3h6M7.4 15h9.2"/></svg>',
  music:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="17.5" cy="16" r="2.6"/></svg>',
  globe:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.9 1.8-1.8 0-1.2-.9-1.8-.9-2.7 0-.9.9-1.8 1.8-1.8H17a4.5 4.5 0 0 0 4.5-4.5C21.5 6 17.2 3 12 3"/><circle cx="7.6" cy="11.4" r="1.2"/><circle cx="11" cy="7.4" r="1.2"/><circle cx="15.6" cy="8.8" r="1.2"/></svg>',
  star:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.6 2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.45 6.2 20.5l1.1-6.47L2.6 9.45l6.5-.95z"/></svg>',
  users:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 20v-1.8a3.6 3.6 0 0 0-3.6-3.6H6.6A3.6 3.6 0 0 0 3 18.2V20"/><circle cx="9.7" cy="7.6" r="3.6"/><path d="M21 20v-1.8a3.6 3.6 0 0 0-2.7-3.48M15.6 4.12a3.6 3.6 0 0 1 0 6.97"/></svg>',
  pin:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10.4c0 5.4-8 12-8 12s-8-6.6-8-12a8 8 0 1 1 16 0"/><circle cx="12" cy="10.2" r="2.8"/></svg>',
  phone:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 16.9v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 3.8 5.5a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.55c.11.86.32 1.7.62 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14.4 14.4 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.64.51 2.5.62a1.8 1.8 0 0 1 1.55 1.83"/></svg>',
  clock:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.4 1.9"/></svg>',
  mail:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m3.5 7 7.4 5.2a2 2 0 0 0 2.2 0L20.5 7"/></svg>',
  arrow:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cap:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6 22 8.2l-10 4.6L2 8.2z"/><path d="M6 10.6v4.6c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.6"/><path d="M22 8.2v5.4"/></svg>',
  masks:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.6h16v7.1a8 8 0 0 1-16 0z"/><path d="M8.7 9.5h.01M15.3 9.5h.01"/><path d="M9.1 14.1a4 4 0 0 0 5.8 0"/></svg>',
  leaf:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-8.6"/><path d="M12 12.4c0-4 3-7 8-7 0 5-3.4 7-8 7"/><path d="M12 14.4c0-3.4-2.6-6-6-6 0 4 2.4 6 6 6"/></svg>',
  target:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>',
  eye:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2.2 12S5.6 5.6 12 5.6 21.8 12 21.8 12 18.4 18.4 12 18.4 2.2 12 2.2 12"/><circle cx="12" cy="12" r="3.1"/></svg>',
  trophy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7.6 4h8.8v5.4a4.4 4.4 0 0 1-8.8 0z"/><path d="M7.6 5.6H5.2a2.2 2.2 0 0 0 2.4 3.3M16.4 5.6h2.4a2.2 2.2 0 0 1-2.4 3.3"/><path d="M12 13.8v3.4M9.2 20.2h5.6M10.2 17.2h3.6"/></svg>',
  scales:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.6v14.6M7.4 20.2h9.2M4.6 8.2h14.8"/><path d="M4.6 8.2 2.3 13.2a2.5 2.5 0 0 0 4.6 0z"/><path d="M19.4 8.2 17.1 13.2a2.5 2.5 0 0 0 4.6 0z"/><circle cx="12" cy="4.2" r="1.3"/></svg>',
  bulb:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 17.4a6.6 6.6 0 1 1 5 0"/><path d="M9.7 17.4h4.6M10.4 20.4h3.2"/></svg>',
  heart:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.3s-7.8-4.6-7.8-9.7A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.8 3c0 5.1-7.8 9.7-7.8 9.7"/></svg>',
  school:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18M4.8 20.5V9.6L12 5.2l7.2 4.4v10.9"/><path d="M12 5.2V2.8"/><rect x="9.5" y="13.4" width="5" height="7.1" rx="1"/></svg>',
  micro:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20.6h11"/><path d="M6.4 20.6a6.6 6.6 0 0 0 9.7-8.1"/><path d="m10.6 5.3 3.2 3.2-2.5 2.5-3.2-3.2z"/><path d="m12.3 3.6 1.6 1.6M7.5 11.3l2.4 2.4"/></svg>',
  grid:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
};

const NAV = [
  { href: 'index.html',   label: 'Accueil',   icon: 'home' },
  { href: 'about.html',   label: 'À Propos',  icon: 'about' },
  { href: 'gallery.html', label: 'Galerie',   icon: 'gallery' },
  { href: 'contact.html', label: 'Contacts',  icon: 'contact' },
];

const head = (title, desc) => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="icon" href="images/Dumas_logo.jpg" type="image/jpg">
    <link rel="stylesheet" href="styles.css">
    <script>
        // Applique le thème avant le premier rendu pour éviter un flash clair.
        (function () {
            try {
                var saved = localStorage.getItem('theme');
                var dark = saved ? saved === 'dark'
                    : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (dark) document.documentElement.classList.add('dark');
            } catch (e) {}
        })();
    </script>
</head>`;

const loader = `    <div class="loader-container" id="loader" role="status" aria-live="polite" aria-label="Chargement de la page">
        <div class="spinner"></div>
    </div>`;

const rail = (current) => `        <nav class="rail" aria-label="Navigation principale">
            <a href="index.html" class="rail__logo" aria-label="Accueil — Collège Alexandre Dumas Fils">CADF</a>
            <ul class="rail__nav">
${NAV.map(n => `                <li><a href="${n.href}" class="rail__link${n.href === current ? ' active' : ''}" data-label="${n.label}"${n.href === current ? ' aria-current="page"' : ''}><span class="sr-only">${n.label}</span>${ICONS[n.icon]}</a></li>`).join('\n')}
            </ul>
            <div class="rail__spacer"></div>
            <button type="button" class="rail__link" id="theme-btn" data-label="Thème">
                <span class="sr-only">Changer de thème</span>${ICONS.sun}${ICONS.moon}
            </button>
            <img class="rail__avatar" src="images/Dumas_logo.jpg" alt="" width="42" height="42">
        </nav>`;

const topbar = `        <div class="topbar">
            <a href="index.html" class="topbar__brand"><span class="topbar__mark">CADF</span> <span>Collège A. Dumas Fils</span></a>
            <div style="display:flex;gap:10px">
                <button type="button" class="icon-btn" id="theme-btn-m"><span class="sr-only">Changer de thème</span>${ICONS.sun}${ICONS.moon}</button>
                <button type="button" class="icon-btn hamburger" id="hamburger"><span class="sr-only">Menu</span><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
            </div>
        </div>`;

const mobileMenu = (current) => `    <div class="mobile-overlay" id="mobileOverlay"></div>
    <nav class="mobile-menu" id="mobileMenu" aria-label="Menu mobile">
        <div class="mobile-menu__head">
            <span class="topbar__brand"><span class="topbar__mark">CADF</span></span>
            <button type="button" class="icon-btn" id="mobileClose"><span class="sr-only">Fermer</span>&times;</button>
        </div>
${NAV.map(n => `        <a href="${n.href}" class="mobile-nav-link${n.href === current ? ' active' : ''}"${n.href === current ? ' aria-current="page"' : ''}>${ICONS[n.icon]} ${n.label}</a>`).join('\n')}
        <a href="contact.html" class="btn btn--primary btn--block" style="margin-top:18px">Nous rejoindre ${ICONS.arrow}</a>
    </nav>`;

const footer = `            <footer class="footer">
                <div class="footer__grid">
                    <div>
                        <h4>Collège Alexandre Dumas Fils</h4>
                        <p>Excellence académique au cœur du Cap-Haïtien depuis 25 ans.</p>
                    </div>
                    <div>
                        <h4>Navigation</h4>
                        <ul>
${NAV.map(n => `                            <li><a href="${n.href}">${n.label}</a></li>`).join('\n')}
                        </ul>
                    </div>
                    <div>
                        <h4>Contact</h4>
                        <ul>
                            <li><a href="tel:+50929355678">+509 2935-5678</a></li>
                            <li><a href="mailto:info@collegealexandredumas.edu.ht">info@collegealexandredumas.edu.ht</a></li>
                            <li>15, Rue Alexandre Dumas, Cap-Haïtien</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Horaires</h4>
                        <ul>
                            <li>Lundi – Vendredi : 7h00 – 17h00</li>
                            <li>Samedi : 8h00 – 12h00</li>
                            <li>Dimanche : fermé</li>
                        </ul>
                    </div>
                </div>
                <div class="footer__bottom">© ${new Date().getFullYear()} Collège Alexandre Dumas Fils — Cap-Haïtien, Haïti.</div>
            </footer>`;

const scripts = (pageScript) => `    <script src="common.js"></script>
${pageScript ? `    <script src="${pageScript}"></script>\n` : ''}</body>
</html>
`;

module.exports = { ICONS, NAV, head, loader, rail, topbar, mobileMenu, footer, scripts };
