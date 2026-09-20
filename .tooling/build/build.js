/* Génère les 4 pages HTML du site à partir des fragments partagés.
   Le rail, le menu mobile et le pied de page ne sont écrits qu'une fois
   (dans shell.js) : plus de navbar copiée-collée dans chaque fichier.

   Usage : node .tooling/build/build.js
*/
const fs = require('fs');
const path = require('path');
const S = require('./shell');
const { ICONS } = S;

const OUT = path.join(__dirname, '..', '..', 'CADF( final)');

/* ------------------------------------------------------------- Données */

// Photos disponibles dans images/
const TEAM = [
  { img: 'Zazou.jpg',    name: 'Dr. Jean Zacharie',        role: 'Directeur Général',
    text: "Docteur en Sciences de l'Éducation, plus de 20 ans d'expérience. Il guide l'établissement vers l'excellence.",
    mail: 'directeur@collegealexandredumas.edu.ht', tel: '+509 2935-5679', hours: 'Lun–Ven : 8h00–17h00' },
  { img: 'Wooslyne.jpg', name: 'Mlle Wooslyne Pierre',     role: 'Directrice Pédagogique',
    text: "Responsable de l'administration générale et des relations avec les parents.",
    mail: 'pedagogie@collegealexandredumas.edu.ht', tel: '+509 2935-5680', hours: 'Lun–Ven : 7h30–16h30' },
  { img: 'Marcelin.jpg', name: 'Mr Marcelin Jean-Baptiste', role: 'Censeur',
    text: "Expert en psychologie pédagogique, il dirige l'établissement tout en adaptant l'accompagnement des élèves.",
    mail: 'secretariat@collegealexandredumas.edu.ht', tel: '+509 2935-5678', hours: 'Lun–Ven : 7h00–17h00' },
  { img: 'Jhonyco.jpg',  name: 'Mr Jean Jhonnyco',         role: 'Coordinateur Culturel',
    text: 'Éducateur passionné, il développe et supervise tous nos programmes artistiques et culturels.',
    mail: 'culture@collegealexandredumas.edu.ht', tel: '+509 2935-5681', hours: 'Lun–Ven : 8h00–16h00' },
  { img: 'Michelet.jpg', name: 'Mr Narcius Michelet',      role: 'Surveillant Principal',
    text: "Ingénieur de formation et pédagogue expérimenté, il coordonne l'enseignement des sciences.",
    mail: 'vie-scolaire@collegealexandredumas.edu.ht', tel: '+509 2935-5682', hours: 'Lun–Ven : 7h00–16h00' },
];

const GALLERY = [
  ['Diapo_1.jpg',  '15 Juin 2024',     'Cérémonie émouvante de remise des diplômes pour nos bacheliers 2024. Un moment de fierté partagée entre élèves, familles et équipe pédagogique.'],
  ['Diapo_2.jpg',  '22 Mars 2024',     "Représentation exceptionnelle de « Roméo et Juliette » par nos élèves de Première. Mise en scène remarquable et interprétations touchantes."],
  ['Diapo_3.jpg',  '10 Février 2024',  'Concert exceptionnel de notre fanfare lors du carnaval du Cap-Haïtien. Performance qui a enthousiasmé plus de 5000 spectateurs.'],
  ['Diapo_4.jpg',  '5 Avril 2024',     "Victoire mémorable de notre équipe de football aux championnats inter-scolaires. Travail d'équipe et détermination récompensés."],
  ['Diapo_5.jpg',  '18 Janvier 2024',  'Grande célébration du 25e anniversaire du collège. Moment historique rassemblant anciens élèves, familles et personnel éducatif.'],
  ['Diapo_6.jpg',  '12 Avril 2024',    'Élections présidentielles scolaires — exercice démocratique formateur pour nos élèves. Campagne active et participation exemplaire.'],
  ['Diapo_7.jpg',  '28 Février 2024',  'Spectacle vibrant de danses traditionnelles haïtiennes. Nos élèves célèbrent avec fierté leur patrimoine culturel national.'],
  ['Diapo_8.jpg',  '8 Mars 2024',      'Expériences fascinantes de chimie dans notre laboratoire équipé. Science pratique et découvertes passionnantes pour nos élèves.'],
  ['Diapo_9.jpg',  '14 Mars 2024',     'Nos élèves studieux profitent de notre bibliothèque entièrement rénovée. Espace moderne propice à l\u2019étude et à la recherche.'],
  ['Diapo_10.jpg', '3 Mars 2024',      'Déjeuner convivial à notre cantine scolaire. Menu local équilibré et moments de partage entre élèves de toutes les classes.'],
  ['Diapo_11.jpg', '25 Janvier 2024',  "Créativité à l'honneur dans notre atelier d'arts plastiques. Nos jeunes artistes développent leur talent et leur expression personnelle."],
  ['Diapo_12.jpg', '20 Avril 2024',    "Initiation au jardinage écologique dans notre espace vert pédagogique. Sensibilisation à l'environnement et développement durable."],
];

const FAQ = [
  ["Quels sont les critères d'admission ?",
   "L'admission se base sur le dossier scolaire (moyenne générale d'au moins 12/20), un test d'évaluation adapté au niveau et un entretien avec l'élève et les parents."],
  ['Quels sont les horaires de cours ?',
   'Les cours se déroulent du lundi au vendredi de 7h30 à 15h30, avec une pause déjeuner de 12h à 13h. Les activités culturelles et le soutien scolaire ont lieu de 15h45 à 17h.'],
  ["Proposez-vous des bourses d'études ?",
   'Oui, nous offrons des bourses partielles (25 % à 75 %) aux élèves méritants issus de familles à revenus modestes. Les candidatures sont examinées chaque année en juin.'],
  ['Comment sont organisées les activités culturelles ?',
   "Les activités sont intégrées dans l'emploi du temps. Chaque élève choisit au moins une discipline : théâtre, fanfare, danse, arts visuels ou journalisme."],
  ["Quel accompagnement pour l'orientation post-bac ?",
   "Notre service d'orientation accompagne les élèves dès la Première : salons, conférences métiers et relations suivies avec les universités."],
  ['Y a-t-il un service de restauration ?',
   'Oui, notre cantine propose des repas équilibrés préparés sur place avec des produits locaux frais, adaptés aux besoins des adolescents.'],
];

/* ------------------------------------------------------------ Fragments */

const avatars = (n = 3) => {
  const imgs = ['Zazou.jpg', 'Wooslyne.jpg', 'Marcelin.jpg', 'Jhonyco.jpg'];
  return `<div class="stack" aria-hidden="true">${
    imgs.slice(0, n).map(i => `<img src="images/${i}" alt="" width="28" height="28">`).join('')
  }</div>`;
};

const courseCard = (c) => `                    <a class="course-card course-card--${c.tone} fade-in" href="${c.href}">
                        <div class="course-card__top">
                            <span class="tag">${ICONS[c.icon]} ${c.tag}</span>
                            <span class="badge">${ICONS.star} ${c.rating}</span>
                        </div>
                        <h3 class="course-card__title">${c.title}</h3>
                        <div class="course-card__foot">
                            <span class="course-card__meta">${c.meta}</span>
                            ${avatars(3)}
                        </div>
                    </a>`;

const teamCard = (m, withLinks) => `                    <article class="team-card fade-in">
                        <img class="team-card__photo" src="images/${m.img}" alt="Portrait de ${m.name}" width="84" height="84" loading="lazy">
                        <h3 class="team-card__name">${m.name}</h3>
                        <p class="team-card__role">${m.role}</p>
                        <p class="team-card__text">${m.text}</p>${withLinks ? `
                        <div class="team-card__links">
                            <div><a href="mailto:${m.mail}">${m.mail}</a></div>
                            <div><a href="tel:${m.tel.replace(/\s/g, '')}">${m.tel}</a></div>
                            <div>${m.hours}</div>
                        </div>` : ''}
                    </article>`;

/* Colonne de droite — présente sur l'accueil et « À Propos ». */
const sideColumn = () => {
  const bars = [
    ['Jan', 46], ['Fév', 62], ['Mar', 54], ['Avr', 78],
    ['Mai', 58], ['Juin', 88], ['Juil', 50], ['Août', 96],
  ];
  return `            <aside class="side" aria-label="Aperçu de l'établissement">
                <div class="side__top">
                    <button type="button" class="icon-btn">${ICONS.bell}<span class="sr-only">Notifications</span></button>
                    <button type="button" class="icon-btn">${ICONS.gear}<span class="sr-only">Réglages</span></button>
                </div>

                <div class="side-card profile">
                    <img class="profile__photo" src="images/Zazou.jpg" alt="Portrait du directeur général" width="76" height="76">
                    <h2 class="profile__name">Dr. Jean Zacharie</h2>
                    <p class="profile__role">Directeur Général</p>
                </div>

                <a class="side-row" href="about.html">
                    <span class="side-row__icon">${ICONS.users}</span>
                    <span class="side-row__label">850 élèves <small>45 professeurs</small></span>
                    ${ICONS.arrow}
                </a>

                <div class="side-card">
                    <div class="chart-head">
                        <span class="chart-label">Réussite au bac</span>
                        <span class="chart-label">2024</span>
                    </div>
                    <p class="chart-value"><strong>95 %</strong> <span>Excellent</span></p>
                    <div class="chart" role="img" aria-label="Évolution du taux de réussite sur l'année : progression jusqu'à 95 %.">
${bars.map(([m, v], i) => `                        <div class="chart__col${i === bars.length - 1 ? ' chart__col--hi' : ''}">
                            <span class="chart__bar" style="height:100%"><i style="height:${v}%"></i></span>
                            <span class="chart__cap">${m}</span>
                        </div>`).join('\n')}
                    </div>
                </div>

                <h2 class="section-title" style="margin:18px 0 12px">Nos filières</h2>
                <a class="mini mini--pink" href="about.html">
                    <div class="mini__top"><span class="tag">${ICONS.flask} Sciences</span><span class="badge">${ICONS.star} 4.9</span></div>
                    <p class="mini__title">Mathématiques et Sciences Appliquées</p>
                    <p class="mini__meta">Laboratoires équipés</p>
                </a>
                <a class="mini mini--yellow" href="about.html">
                    <div class="mini__top"><span class="tag">${ICONS.globe} Langues</span><span class="badge">${ICONS.star} 4.8</span></div>
                    <p class="mini__title">Français, Anglais, Créole, Espagnol</p>
                    <p class="mini__meta">Quatre langues enseignées</p>
                </a>
                <a class="mini mini--purple" href="gallery.html">
                    <div class="mini__top"><span class="tag">${ICONS.music} Culture</span><span class="badge">${ICONS.star} 5.0</span></div>
                    <p class="mini__title">Théâtre, fanfare, danse et arts visuels</p>
                    <p class="mini__meta">Auditorium de 300 places</p>
                </a>
            </aside>`;
};

/* ------------------------------------------------------------ Les pages */

function page({ file, title, desc, wide, main, script }) {
  const html = `${S.head(title, desc)}
<body>
${S.loader}
    <a class="skip-link" href="#main">Aller au contenu</a>
${S.mobileMenu(file)}

    <div class="app${wide ? ' app--wide' : ''}">
${S.rail(file)}

        <main class="main" id="main">
${S.topbar}
${main}
${S.footer}
        </main>
${wide ? '' : sideColumn() + '\n'}    </div>

${S.scripts(script)}`;
  fs.writeFileSync(path.join(OUT, file), html, 'utf8');
  console.log('  écrit', file, `(${(html.length / 1024).toFixed(1)} Ko)`);
}

/* ------------------------------------------------------------- Accueil */
const homeCourses = [
  { tone: 'pink',   icon: 'flask',   tag: 'Sciences',   rating: '4.9', href: 'about.html',
    title: 'Mathématiques et Sciences Appliquées', meta: 'Laboratoires équipés' },
  { tone: 'yellow', icon: 'globe',   tag: 'Langues',    rating: '4.8', href: 'about.html',
    title: 'Français, Anglais, Créole et Espagnol', meta: '4 langues enseignées' },
  { tone: 'purple', icon: 'book',    tag: 'Humanités',  rating: '4.7', href: 'about.html',
    title: 'Sciences Humaines et Sociales', meta: 'Histoire, géographie, philosophie' },
  { tone: 'mint',   icon: 'palette', tag: 'Arts',       rating: '5.0', href: 'gallery.html',
    title: 'Éducation Artistique et Culturelle', meta: 'Théâtre, fanfare, danse' },
];

page({
  file: 'index.html',
  title: 'Collège Alexandre Dumas Fils — Cap-Haïtien',
  desc: "Excellence académique au cœur du Cap-Haïtien : un établissement qui forme les leaders de demain depuis 25 ans.",
  script: 'script.js',
  main: `
            <header class="page-head">
                <h1 class="page-title">Investissez dans votre éducation</h1>
                <p class="page-lead">Le Collège Alexandre Dumas Fils forme les leaders de demain à travers une éducation d'excellence, alliant tradition pédagogique et innovation moderne dans un environnement bienveillant et stimulant.</p>
            </header>

            <div class="chips" role="tablist" aria-label="Filtrer les filières">
                <button type="button" class="chip active" role="tab" aria-selected="true" data-filter="all">${ICONS.grid} Tout</button>
                <button type="button" class="chip" role="tab" aria-selected="false" data-filter="pink">${ICONS.flask} Sciences</button>
                <button type="button" class="chip" role="tab" aria-selected="false" data-filter="yellow">${ICONS.globe} Langues</button>
                <button type="button" class="chip" role="tab" aria-selected="false" data-filter="purple">${ICONS.book} Humanités</button>
                <button type="button" class="chip" role="tab" aria-selected="false" data-filter="mint">${ICONS.palette} Arts</button>
            </div>

            <section class="section" style="margin-top:0" aria-labelledby="filieres">
                <div class="section-head">
                    <h2 class="section-title" id="filieres">Les plus demandées</h2>
                    <a class="link-more" href="about.html">Tout voir</a>
                </div>
                <div class="card-grid card-grid--duo" id="courseGrid">
${homeCourses.map(courseCard).join('\n')}
                </div>
            </section>

            <section class="section" aria-labelledby="programme">
                <div class="section-head"><h2 class="section-title" id="programme">Programme d'excellence</h2></div>
                <div class="feature fade-in">
                    <div>
                        <h3 class="feature__title">Une formation complète</h3>
                        <p class="feature__text">Notre curriculum couvre l'ensemble des matières fondamentales tout en intégrant des disciplines modernes et les compétences du 21e siècle.</p>
                        <ul class="check-list">
                            <li>Mathématiques et Sciences Appliquées</li>
                            <li>Langues : français, anglais, créole, espagnol</li>
                            <li>Sciences Humaines et Sociales</li>
                            <li>Éducation Artistique et Culturelle</li>
                        </ul>
                        <div class="btn-row">
                            <a class="btn btn--primary" href="about.html">En savoir plus ${ICONS.arrow}</a>
                            <a class="btn btn--ghost" href="contact.html">Nous contacter</a>
                        </div>
                    </div>
                    <img class="feature__media" src="images/Dumas.jpg" alt="Façade du Collège Alexandre Dumas Fils" loading="lazy">
                </div>
            </section>

            <section class="section" aria-labelledby="chiffres">
                <div class="section-head"><h2 class="section-title" id="chiffres">L'excellence en chiffres</h2></div>
                <div class="stat-grid">
                    <div class="stat fade-in"><p class="stat__value">850</p><p class="stat__label">Élèves inscrits</p></div>
                    <div class="stat fade-in"><p class="stat__value">95 %</p><p class="stat__label">Taux de réussite</p></div>
                    <div class="stat fade-in"><p class="stat__value">45</p><p class="stat__label">Professeurs</p></div>
                    <div class="stat fade-in"><p class="stat__value">25</p><p class="stat__label">Années d'excellence</p></div>
                </div>
            </section>

            <section class="section" aria-labelledby="approche">
                <div class="section-head">
                    <h2 class="section-title" id="approche">Notre approche éducative</h2>
                    <p class="section-sub">Excellence académique et épanouissement personnel</p>
                </div>
                <div class="info-grid">
                    <article class="info-card fade-in">
                        <div class="info-card__icon" aria-hidden="true">${ICONS.cap}</div>
                        <h3 class="info-card__title">Pédagogie innovante</h3>
                        <p class="info-card__text">Notre méthode combine les meilleures pratiques traditionnelles avec les innovations technologiques modernes pour un apprentissage optimal.</p>
                    </article>
                    <article class="info-card fade-in">
                        <div class="info-card__icon" aria-hidden="true">${ICONS.masks}</div>
                        <h3 class="info-card__title">Activités culturelles</h3>
                        <p class="info-card__text">Un programme riche en théâtre, musique, danse et fanfare qui développe la créativité et l'expression personnelle de nos élèves.</p>
                    </article>
                    <article class="info-card fade-in">
                        <div class="info-card__icon" aria-hidden="true">${ICONS.leaf}</div>
                        <h3 class="info-card__title">Développement durable</h3>
                        <p class="info-card__text">Une éducation environnementale qui forme des citoyens conscients de leur responsabilité envers les générations futures.</p>
                    </article>
                </div>
            </section>

            <section class="section" aria-labelledby="rejoindre">
                <div class="feature fade-in" style="grid-template-columns:1fr">
                    <div>
                        <h2 class="feature__title" id="rejoindre">Rejoignez notre communauté</h2>
                        <p class="feature__text">Offrez à votre enfant une éducation d'excellence dans un environnement bienveillant et stimulant au cœur du Cap-Haïtien.</p>
                        <div class="btn-row">
                            <a class="btn btn--primary" href="contact.html">Demander une admission ${ICONS.arrow}</a>
                            <a class="btn btn--ghost" href="gallery.html">Voir la galerie</a>
                        </div>
                    </div>
                </div>
            </section>`,
});

/* ------------------------------------------------------------ À Propos */
page({
  file: 'about.html',
  title: 'À Propos — Collège Alexandre Dumas Fils',
  desc: "L'histoire, la mission et les valeurs du Collège Alexandre Dumas Fils, établissement d'excellence au Cap-Haïtien depuis plus de 25 ans.",
  script: 'about.js',
  main: `
            <header class="page-head">
                <h1 class="page-title">Notre histoire et notre mission</h1>
                <p class="page-lead">Découvrez le Collège Alexandre Dumas Fils, un établissement d'excellence qui forme les leaders de demain depuis plus de 25 ans au Cap-Haïtien.</p>
            </header>

            <section class="section" style="margin-top:0" aria-labelledby="mission">
                <div class="section-head"><h2 class="section-title" id="mission">Mission et vision</h2></div>
                <div class="card-grid">
                    <article class="course-card course-card--mint fade-in">
                        <div class="course-card__top"><span class="tag">${ICONS.target} Mission</span></div>
                        <h3 class="course-card__title">Former des citoyens responsables et créatifs</h3>
                        <p class="course-card__meta" style="margin-top:12px">Capables de relever les défis du 21e siècle tout en restant enracinés dans leur culture haïtienne.</p>
                    </article>
                    <article class="course-card course-card--blue fade-in">
                        <div class="course-card__top"><span class="tag">${ICONS.eye} Vision</span></div>
                        <h3 class="course-card__title">L'établissement de référence en Haïti</h3>
                        <p class="course-card__meta" style="margin-top:12px">Reconnu pour la qualité de son enseignement et la réussite de ses diplômés.</p>
                    </article>
                </div>
            </section>

            <section class="section" aria-labelledby="valeurs">
                <div class="section-head">
                    <h2 class="section-title" id="valeurs">Nos valeurs fondamentales</h2>
                    <p class="section-sub">Les principes qui guident notre action</p>
                </div>
                <div class="info-grid">
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.trophy}</div><h3 class="info-card__title">Excellence</h3><p class="info-card__text">Nous encourageons chaque élève à donner le meilleur de lui-même et à dépasser ses propres limites.</p></article>
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.scales}</div><h3 class="info-card__title">Intégrité</h3><p class="info-card__text">Honnêteté, responsabilité et respect mutuel au sein de notre communauté éducative.</p></article>
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.bulb}</div><h3 class="info-card__title">Innovation</h3><p class="info-card__text">Adoption des meilleures pratiques pédagogiques modernes et des technologies éducatives.</p></article>
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.heart}</div><h3 class="info-card__title">Inclusion</h3><p class="info-card__text">Un environnement bienveillant qui valorise la diversité et offre à chacun les mêmes opportunités.</p></article>
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.leaf}</div><h3 class="info-card__title">Développement durable</h3><p class="info-card__text">Former des citoyens conscients de leur responsabilité envers les générations futures.</p></article>
                </div>
            </section>

            <section class="section" aria-labelledby="impact">
                <div class="section-head"><h2 class="section-title" id="impact">Notre impact en chiffres</h2></div>
                <div class="stat-grid">
                    <div class="stat fade-in"><p class="stat__value">650+</p><p class="stat__label">Élèves actifs</p></div>
                    <div class="stat fade-in"><p class="stat__value">88 %</p><p class="stat__label">Taux de réussite</p></div>
                    <div class="stat fade-in"><p class="stat__value">55</p><p class="stat__label">Professeurs qualifiés</p></div>
                    <div class="stat fade-in"><p class="stat__value">25</p><p class="stat__label">Années d'excellence</p></div>
                    <div class="stat fade-in"><p class="stat__value">1700+</p><p class="stat__label">Diplômés</p></div>
                </div>
            </section>

            <section class="section" aria-labelledby="equipe">
                <div class="section-head">
                    <h2 class="section-title" id="equipe">Notre équipe dirigeante</h2>
                    <p class="section-sub">Des professionnels dévoués à la réussite de nos élèves</p>
                </div>
                <div class="team-grid">
${TEAM.map(m => teamCard(m, false)).join('\n')}
                </div>
            </section>

            <section class="section" aria-labelledby="installations">
                <div class="section-head"><h2 class="section-title" id="installations">Nos installations</h2></div>
                <div class="info-grid">
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.school}</div><h3 class="info-card__title">Salles de classe modernes</h3><p class="info-card__text">25 salles équipées de technologies interactives, climatisées et conçues pour le confort des élèves.</p></article>
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.micro}</div><h3 class="info-card__title">Laboratoires scientifiques</h3><p class="info-card__text">Physique, chimie et biologie entièrement équipés pour l'expérimentation et la recherche.</p></article>
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.book}</div><h3 class="info-card__title">Bibliothèque</h3><p class="info-card__text">Plus de 10 000 ouvrages et un accès à des ressources numériques internationales.</p></article>
                    <article class="info-card fade-in"><div class="info-card__icon" aria-hidden="true">${ICONS.masks}</div><h3 class="info-card__title">Centre culturel</h3><p class="info-card__text">Auditorium de 300 places, studios de répétition et espaces dédiés aux activités artistiques.</p></article>
                </div>
            </section>

            <section class="section" aria-labelledby="faq">
                <div class="section-head">
                    <h2 class="section-title" id="faq">Questions fréquentes</h2>
                    <p class="section-sub">Les réponses aux questions des parents et futurs élèves</p>
                </div>
${FAQ.map(([q, a]) => `                <details class="faq-item fade-in">
                    <summary>${q}</summary>
                    <div class="faq-item__body">${a}</div>
                </details>`).join('\n')}
            </section>`,
});

/* ------------------------------------------------------------- Galerie */
page({
  file: 'gallery.html',
  title: 'Galerie — Collège Alexandre Dumas Fils',
  desc: 'La vie du Collège Alexandre Dumas Fils en images : cérémonies, spectacles, sport, sciences et vie quotidienne.',
  script: 'gallery.js',
  wide: true,
  main: `
            <header class="page-head">
                <h1 class="page-title">Galerie de nos moments forts</h1>
                <p class="page-lead">Découvrez la vie vibrante du Collège Alexandre Dumas Fils à travers nos plus beaux souvenirs et événements marquants.</p>
            </header>

            <section class="section" style="margin-top:0" aria-labelledby="souvenirs">
                <div class="section-head">
                    <h2 class="section-title" id="souvenirs">Nos souvenirs en images</h2>
                    <p class="section-sub">${GALLERY.length} photos — cliquez pour agrandir</p>
                </div>
                <div class="gallery-grid">
${GALLERY.map(([img, date, desc], i) => `                    <button type="button" class="gallery-item fade-in" data-index="${i}" aria-label="Agrandir : ${desc.replace(/"/g, '&quot;').slice(0, 90)}">
                        <img class="gallery-image" src="images/${img}" alt="${desc.replace(/"/g, '&quot;')}" loading="lazy">
                        <span class="gallery-overlay">
                            <span class="gallery-date">${date}</span>
                            <span class="gallery-description">${desc.slice(0, 74)}…</span>
                        </span>
                    </button>`).join('\n')}
                </div>
            </section>

    <div class="modal" id="imageModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="modalDescription">
        <button type="button" class="modal-close" id="modalClose" aria-label="Fermer">&times;</button>
        <div class="modal-content">
            <img class="modal-image" id="modalImage" alt="">
            <div class="modal-info">
                <p class="modal-date" id="modalDate"></p>
                <p class="modal-description" id="modalDescription"></p>
            </div>
        </div>
    </div>`,
});

/* ------------------------------------------------------------- Contact */
const SUBJECTS = ["Demande d'admission", "Demande d'information générale", 'Demande de visite',
  'Prise de rendez-vous', 'Questions sur les activités culturelles', 'Informations sur les bourses',
  'Plainte ou suggestion', 'Autre'];

page({
  file: 'contact.html',
  title: 'Contact — Collège Alexandre Dumas Fils',
  desc: "Contactez le Collège Alexandre Dumas Fils au Cap-Haïtien : admission, visites, bourses et informations générales.",
  script: 'contact.js',
  wide: true,
  main: `
            <header class="page-head">
                <h1 class="page-title">Contactez-nous</h1>
                <p class="page-lead">Nous sommes là pour répondre à toutes vos questions concernant l'admission, la vie scolaire et nos programmes éducatifs.</p>
            </header>

            <section class="section" style="margin-top:0" aria-labelledby="coordonnees">
                <div class="section-head">
                    <h2 class="section-title" id="coordonnees">Nos coordonnées</h2>
                    <p class="section-sub">Plusieurs moyens de nous joindre</p>
                </div>
                <div class="info-grid">
                    <article class="info-card fade-in">
                        <div class="info-card__icon">${ICONS.pin}</div>
                        <h3 class="info-card__title">Adresse</h3>
                        <ul class="info-card__list">
                            <li>15, Rue Alexandre Dumas</li>
                            <li>Cap-Haïtien, Haïti</li>
                            <li>Code postal : HT1110</li>
                        </ul>
                    </article>
                    <article class="info-card fade-in">
                        <div class="info-card__icon">${ICONS.phone}</div>
                        <h3 class="info-card__title">Téléphone</h3>
                        <ul class="info-card__list">
                            <li>Secrétariat : <a href="tel:+50929355678">+509 2935-5678</a></li>
                            <li>Direction : <a href="tel:+50929355679">+509 2935-5679</a></li>
                            <li>Urgences : <a href="tel:+50934567890">+509 3456-7890</a></li>
                        </ul>
                    </article>
                    <article class="info-card fade-in">
                        <div class="info-card__icon">${ICONS.mail}</div>
                        <h3 class="info-card__title">Email</h3>
                        <ul class="info-card__list">
                            <li><a href="mailto:info@collegealexandredumas.edu.ht">info@collegealexandredumas.edu.ht</a></li>
                            <li><a href="mailto:direction@collegealexandredumas.edu.ht">direction@…edu.ht</a></li>
                            <li><a href="mailto:admissions@collegealexandredumas.edu.ht">admissions@…edu.ht</a></li>
                        </ul>
                    </article>
                    <article class="info-card fade-in">
                        <div class="info-card__icon">${ICONS.clock}</div>
                        <h3 class="info-card__title">Horaires</h3>
                        <ul class="info-card__list">
                            <li>Lundi – Vendredi : 7h00 – 17h00</li>
                            <li>Samedi : 8h00 – 12h00</li>
                            <li>Dimanche : fermé</li>
                        </ul>
                    </article>
                </div>
            </section>

            <section class="section" aria-labelledby="message">
                <div class="section-head"><h2 class="section-title" id="message">Envoyez-nous un message</h2></div>
                <div class="feature fade-in" style="grid-template-columns:1fr">
                    <form id="contactForm" novalidate>
                        <div class="form-grid">
                            <div class="field">
                                <label for="firstName">Prénom *</label>
                                <input type="text" id="firstName" name="firstName" autocomplete="given-name" required>
                            </div>
                            <div class="field">
                                <label for="lastName">Nom de famille *</label>
                                <input type="text" id="lastName" name="lastName" autocomplete="family-name" required>
                            </div>
                            <div class="field">
                                <label for="email">Email *</label>
                                <input type="email" id="email" name="email" autocomplete="email" required>
                            </div>
                            <div class="field">
                                <label for="phone">Téléphone</label>
                                <input type="tel" id="phone" name="phone" autocomplete="tel">
                            </div>
                            <div class="field field--full">
                                <label for="subject">Sujet *</label>
                                <select id="subject" name="subject" required>
                                    <option value="">Sélectionnez un sujet</option>
${SUBJECTS.map(s => `                                    <option>${s}</option>`).join('\n')}
                                </select>
                            </div>
                            <div class="field field--full">
                                <label for="messageField">Message *</label>
                                <textarea id="messageField" name="message" placeholder="Décrivez votre demande ou vos questions en détail…" required></textarea>
                            </div>
                            <div class="field field--full">
                                <button type="submit" class="btn btn--primary form-button">Envoyer le message ${ICONS.arrow}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            <section class="section" aria-labelledby="direction">
                <div class="section-head">
                    <h2 class="section-title" id="direction">Notre équipe de direction</h2>
                    <p class="section-sub">Contactez directement nos responsables</p>
                </div>
                <div class="team-grid">
${TEAM.slice(0, 3).map(m => teamCard(m, true)).join('\n')}
                </div>
            </section>

            <section class="section" aria-labelledby="localisation">
                <div class="section-head">
                    <h2 class="section-title" id="localisation">Notre localisation</h2>
                    <p class="section-sub">Au cœur du Cap-Haïtien</p>
                </div>
                <a class="map-card fade-in" href="https://www.openstreetmap.org/?mlat=19.7594&amp;mlon=-72.1985#map=16/19.7594/-72.1985" target="_blank" rel="noopener">
                    <span class="map-card__pin">${ICONS.pin}</span>
                    <span class="map-card__body">
                        <strong>15, Rue Alexandre Dumas</strong>
                        <span>Cap-Haïtien, Haïti — HT1110</span>
                        <span class="map-card__cta">Ouvrir dans OpenStreetMap ${ICONS.arrow}</span>
                    </span>
                </a>
            </section>`,
});

console.log('\nTerminé.');
