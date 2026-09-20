#!/usr/bin/env node
/* Générateur des pages du site.
   Les fichiers .html du dossier « CADF( final) » sont produits par ce script :
   ne les modifiez jamais à la main, éditez ce fichier puis relancez
     node .tooling/build/build.js
   Les fragments communs (icônes, navigation, pied de page) vivent dans ui.js.
   Les dimensions des images proviennent de images.json, ce qui garantit des
   attributs width/height exacts et donc aucun décalage de mise en page. */

const fs = require('fs');
const path = require('path');
const { I, head, sidenav, mobileChrome, tabbar, footer, scripts } = require('./ui');

const OUT = path.join(__dirname, '..', '..', 'CADF( final)');
const IMG = JSON.parse(fs.readFileSync(path.join(__dirname, 'images.json'), 'utf8'));

/* Fabrique une balise <img> complète : chemin, dimensions réelles, alt,
   chargement différé et décodage asynchrone. */
function img(base, alt, opts = {}) {
    const m = IMG[base];
    if (!m) throw new Error('Image inconnue dans images.json : ' + base);
    const cls = opts.className ? ` class="${opts.className}"` : '';
    // Le visuel du hero est le plus grand élément affiché : il se charge tout
    // de suite, tout le reste est différé.
    const load = opts.eager
        ? ' loading="eager" fetchpriority="high"'
        : ' loading="lazy"';
    return `<img${cls} src="assets/img/${base}.webp" alt="${alt}" width="${m.w}" height="${m.h}"${load} decoding="async">`;
}

/* ============================================================ Contenus ==
   Textes repris du site d'origine. Les descriptions de la galerie sont
   réutilisées telles quelles, y compris comme texte alternatif. */

const GALLERY = [
    ['Diapo_1',  '15 Juin 2024',     "Cérémonie émouvante de remise des diplômes pour nos bacheliers 2024. Un moment de fierté partagée entre élèves, familles et équipe pédagogique."],
    ['Diapo_2',  '22 Mars 2024',     "Représentation exceptionnelle de « Roméo et Juliette » par nos élèves de Première. Mise en scène remarquable et interprétations touchantes."],
    ['Diapo_3',  '10 Février 2024',  "Concert exceptionnel de notre fanfare lors du carnaval du Cap-Haïtien. Performance qui a enthousiasmé plus de 5000 spectateurs."],
    ['Diapo_4',  '5 Avril 2024',     "Victoire mémorable de notre équipe de football aux championnats inter-scolaires. Travail d'équipe et détermination récompensés."],
    ['Diapo_5',  '18 Janvier 2024',  "Grande célébration du 25e anniversaire du collège. Moment historique rassemblant anciens élèves, familles et personnel éducatif."],
    ['Diapo_6',  '12 Avril 2024',    "Élections présidentielles scolaires : exercice démocratique formateur pour nos élèves. Campagne active et participation exemplaire."],
    ['Diapo_7',  '28 Février 2024',  "Spectacle vibrant de danses traditionnelles haïtiennes. Nos élèves célèbrent avec fierté leur patrimoine culturel national."],
    ['Diapo_8',  '8 Mars 2024',      "Expériences fascinantes de chimie dans notre laboratoire équipé. Science pratique et découvertes passionnantes pour nos élèves."],
    ['Diapo_9',  '14 Mars 2024',     "Nos élèves studieux profitent de notre bibliothèque entièrement rénovée. Espace moderne propice à l'étude et à la recherche."],
    ['Diapo_10', '3 Mars 2024',      "Déjeuner convivial à notre cantine scolaire. Menu local équilibré et moments de partage entre élèves de toutes les classes."],
    ['Diapo_11', '25 Janvier 2024',  "Créativité à l'honneur dans notre atelier d'arts plastiques. Nos jeunes artistes développent leur talent et leur expression personnelle."],
    ['Diapo_12', '20 Avril 2024',    "Initiation au jardinage écologique dans notre espace vert pédagogique. Sensibilisation à l'environnement et développement durable."],
];

const TEAM = [
    ['Zazou', 'Dr. Jean Zacharie', 'Directeur Général',
        "Docteur en Sciences de l'Éducation avec plus de 20 ans d'expérience dans l'enseignement. Visionnaire et leader, il guide notre établissement vers l'excellence depuis 15 ans.",
        'directeur@collegealexandredumas.edu.ht', '+509 2935-5679'],
    ['Jhonyco', 'Mr Jean Jhonnyco', 'Coordinateur des activités culturelles',
        "Commentateur et éducateur passionné, il développe et supervise tous nos programmes culturels et artistiques qui enrichissent l'expérience éducative.",
        null, null],
    ['Wooslyne', 'Mlle Wooslyne Pierre', 'Secrétaire générale',
        "Responsable de l'administration générale et des relations avec les parents. Elle assure le bon fonctionnement quotidien de notre établissement.",
        'pedagogie@collegealexandredumas.edu.ht', '+509 2935-5680'],
    ['Michelet', 'Mr Narcius Michelet', 'Surveillant principal',
        "Ingénieur de formation et pédagogue expérimenté, il coordonne l'enseignement des sciences et développe nos laboratoires modernes.",
        null, null],
    ['Marcelin', 'Mr Marcelin Jean-Baptiste', 'Censeur',
        "Expert en psychologie pédagogique, il dirige l'établissement avec constance tout en adaptant ses méthodes quand il le faut.",
        'secretariat@collegealexandredumas.edu.ht', '+509 2935-5678'],
];

const VALUES = [
    ['award',    'Excellence',              "Nous visons l'excellence dans tous nos programmes et activités éducatives, encourageant chaque élève à donner le meilleur de lui-même et à dépasser ses propres limites."],
    ['shield',   'Intégrité',               "Respect des valeurs morales et éthiques dans toutes nos actions. Nous cultivons l'honnêteté, la responsabilité et le respect mutuel au sein de notre communauté éducative."],
    ['bulb',     'Innovation',              "Adoption des meilleures pratiques pédagogiques modernes et intégration des technologies éducatives pour préparer nos élèves aux défis de demain."],
    ['hands',    'Inclusion',               "Accueil de tous les élèves dans un environnement bienveillant qui valorise la diversité et offre à chacun les mêmes opportunités de réussite."],
    ['seedling', 'Développement durable',   "Engagement envers l'éducation environnementale et la formation de citoyens conscients de leur responsabilité envers les générations futures."],
];

/* ========================================================== Fragments == */

/* Hero asymétrique : texte à gauche (60 caractères maximum par ligne),
   image réelle à droite. Aucun centrage, aucun dégradé sur le texte. */
function hero({ eyebrow, title, lead, actions, image, alt, badge, stats }) {
    return `        <section class="hero-band">
          <div class="wrap hero">
            <div class="hero__text">
                <p class="eyebrow" data-anim="title">${eyebrow}</p>
                <h1 class="hero__title" data-anim="title">${title}</h1>
                <p class="hero__lead" data-anim="lead">${lead}</p>
                <div class="hero__actions" data-anim="actions">
${actions.map((a) => `                    <a class="btn ${a.primary ? 'btn--primary' : 'btn--ghost'}" href="${a.href}">${a.label}${a.primary ? ' ' + I.arrow : ''}</a>`).join('\n')}
                </div>
${stats ? `                <dl class="hero__stats">
${stats.map((s) => `                    <div class="hero__stat" data-anim="stat"><dt>${s[1]}</dt><dd>${s[0]}</dd></div>`).join('\n')}
                </dl>` : ''}
            </div>
            <figure class="hero__figure" data-anim="figure">
                <div class="hero__img">${img(image, alt, { eager: true })}</div>
${badge ? `                <figcaption class="hero__badge" data-anim="badge">${I[badge.icon]}<span><strong>${badge.title}</strong>${badge.text}</span></figcaption>` : ''}
            </figure>
          </div>
        </section>`;
}

/* Section en quinconce : le CSS inverse une ligne sur deux. */
function zig(n, { title, index, body, image, alt, list }) {
    return `            <article class="zig">
                <div class="zig__text">
                    <span class="zig__index">${index}</span>
                    <h3 class="zig__title">${title}</h3>
                    ${body.map((p) => `<p>${p}</p>`).join('\n                    ')}
${list ? `                    <ul class="ticks">
${list.map((li) => `                        <li>${I.check}<span>${li}</span></li>`).join('\n')}
                    </ul>` : ''}
                </div>
                <figure class="zig__figure">
                    <div class="zig__img">${img(image, alt)}</div>
                </figure>
            </article>`;
}

const sectionHead = (title, lead) =>
    `                <div class="section__head">
                    <h2 class="section__title">${title}</h2>
${lead ? `                    <p class="section__lead">${lead}</p>` : ''}
                </div>`;

/* Ossature commune à toutes les pages. */
const page = (current, title, desc, body) =>
    `${head(title, desc)}
<body>
    <a class="skip-link" href="#main">Aller au contenu principal</a>
${sidenav(current)}
${mobileChrome(current)}
${tabbar(current)}

    <div class="shell">
${body}
${footer()}
    </div>

${scripts()}`;

/* ============================================================== Pages == */

function buildIndex() {
    const body = `        <main id="main">
${hero({
        eyebrow: 'Collège Alexandre Dumas Fils — Cap-Haïtien',
        title: "Excellence académique au <em>cœur</em> du Cap-Haïtien",
        lead: "Depuis 1999, nous formons des citoyens responsables et créatifs. Une pédagogie exigeante, un accompagnement humain, et un environnement qui donne envie d'apprendre.",
        actions: [
            { href: 'about.html', label: 'Découvrir le collège', primary: true },
            { href: 'contact.html', label: 'Nous contacter' },
        ],
        image: 'Diapo_5',
        alt: "Grande célébration du 25e anniversaire du collège, rassemblant anciens élèves, familles et personnel éducatif.",
        badge: { icon: 'award', title: '95 % de réussite', text: 'au baccalauréat en 2024' },
        stats: [['850', 'Élèves inscrits'], ['45', 'Professeurs'], ['25', "Années d'excellence"], ['1700+', 'Diplômés']],
    })}

            <section class="section">
                <div class="wrap">
${sectionHead('Notre approche éducative', "Trois engagements qui structurent la vie du collège, de la salle de classe à la cour de récréation.")}
                    <div class="zig-list">
${zig(1, {
        index: '01',
        title: 'Une pédagogie exigeante et vivante',
        body: ["Notre méthode d'enseignement combine les meilleures pratiques pédagogiques traditionnelles avec les outils numériques modernes. Les effectifs réduits permettent à chaque professeur de suivre réellement la progression de chaque élève."],
        list: ['Mathématiques et sciences appliquées', 'Langues : français, anglais, créole, espagnol', 'Sciences humaines et sociales'],
        image: 'Diapo_9',
        alt: "Nos élèves studieux profitent de notre bibliothèque entièrement rénovée. Espace moderne propice à l'étude et à la recherche.",
    })}
${zig(2, {
        index: '02',
        title: 'La culture comme matière à part entière',
        body: ["Théâtre, musique, danse et fanfare ne sont pas des à-côtés : ils occupent une place réelle dans l'emploi du temps. C'est là que beaucoup d'élèves découvrent une confiance qu'aucun contrôle écrit ne révèle."],
        image: 'Diapo_3',
        alt: "Concert exceptionnel de notre fanfare lors du carnaval du Cap-Haïtien. Performance qui a enthousiasmé plus de 5000 spectateurs.",
    })}
${zig(3, {
        index: '03',
        title: 'Des sciences que l\u2019on pratique',
        body: ["Nos laboratoires sont équipés pour que la théorie se vérifie par l'expérience. Manipuler, se tromper, recommencer : c'est ainsi que les notions s'installent durablement."],
        image: 'Diapo_8',
        alt: "Expériences fascinantes de chimie dans notre laboratoire équipé. Science pratique et découvertes passionnantes pour nos élèves.",
    })}
                    </div>
                </div>
            </section>

            <section class="section section--alt">
                <div class="wrap">
${sectionHead('La vie au collège', "Un aperçu des moments qui rythment l'année scolaire.")}
                    <div class="value-grid">
                        <article class="card" data-hover-lift>
                            <span class="card__icon">${I.users}</span>
                            <h3 class="card__title">Une communauté soudée</h3>
                            <p class="card__text">850 élèves, 45 professeurs et des familles impliquées. Les réunions parents-professeurs ont lieu chaque trimestre, et la direction reçoit sans rendez-vous le mercredi matin.</p>
                        </article>
                        <article class="card" data-hover-lift>
                            <span class="card__icon">${I.globe}</span>
                            <h3 class="card__title">Ancrés au Cap-Haïtien</h3>
                            <p class="card__text">Nos élèves participent au carnaval, aux championnats inter-scolaires et aux projets de quartier. L'école n'est pas une parenthèse : elle fait partie de la ville.</p>
                        </article>
                        <article class="card card--flat">
                            <span class="card__icon">${I.book}</span>
                            <h3 class="card__title">Bibliothèque rénovée</h3>
                            <p class="card__text">Ouverte de 7h à 17h, avec un espace de travail silencieux.</p>
                        </article>
                        <article class="card card--flat">
                            <span class="card__icon">${I.flask}</span>
                            <h3 class="card__title">Deux laboratoires</h3>
                            <p class="card__text">Physique-chimie et sciences de la vie, équipés pour les travaux pratiques.</p>
                        </article>
                        <article class="card card--flat">
                            <span class="card__icon">${I.palette}</span>
                            <h3 class="card__title">Atelier d'arts</h3>
                            <p class="card__text">Arts plastiques, théâtre et musique, encadrés par des intervenants.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="wrap">
                    <div class="cta-panel">
                        <div>
                            <h2 class="section__title">Rejoignez notre communauté</h2>
                            <p class="section__lead">Les inscriptions pour l'année 2025-2026 sont ouvertes. Prenez rendez-vous pour visiter l'établissement et rencontrer l'équipe.</p>
                        </div>
                        <div class="cta-panel__actions">
                            <a class="btn btn--primary" href="contact.html">Demander des informations ${I.arrow}</a>
                            <a class="btn btn--ghost" href="gallery.html">Visiter la galerie</a>
                        </div>
                    </div>
                </div>
            </section>
        </main>`;

    return page('index.html',
        'Collège Alexandre Dumas Fils — Cap-Haïtien',
        "Établissement d'excellence au Cap-Haïtien depuis 1999 : pédagogie exigeante, activités culturelles et accompagnement personnalisé.",
        body);
}

function buildAbout() {
    const body = `        <main id="main">
${hero({
        eyebrow: 'À propos',
        title: 'Notre histoire et notre <em>mission</em>',
        lead: "Fondé en 1999 au cœur du Cap-Haïtien, le collège porte le nom du célèbre écrivain français et s'inspire des valeurs d'excellence littéraire et d'engagement social qui caractérisaient son œuvre.",
        actions: [
            { href: 'contact.html', label: 'Rencontrer l\u2019équipe', primary: true },
            { href: 'gallery.html', label: 'Voir la galerie' },
        ],
        image: 'Dumas',
        alt: "Façade du Collège Alexandre Dumas Fils, vue en contre-plongée : balcon à balustrade bleue et murs jaunes, au cœur du Cap-Haïtien.",
        badge: { icon: 'clock', title: 'Depuis 1999', text: '25 années au service du Nord' },
    })}

            <section class="section">
                <div class="wrap">
${sectionHead('Un projet, trois convictions', "Ce qui a guidé la création du collège, et ce qui continue de l'orienter aujourd'hui.")}
                    <div class="zig-list">
${zig(1, {
        index: '01',
        title: 'Une institution de référence dans le Nord',
        body: [
            "Depuis notre création, nous nous sommes imposés comme une référence en matière d'éducation de qualité dans le Nord d'Haïti, formant des générations d'étudiants qui excellent aujourd'hui dans divers domaines professionnels.",
            "Notre approche pédagogique combine tradition et innovation, offrant à nos élèves les outils nécessaires pour réussir dans un monde en constante évolution.",
        ],
        image: 'Diapo_1',
        alt: "Cérémonie émouvante de remise des diplômes pour nos bacheliers 2024. Un moment de fierté partagée entre élèves, familles et équipe pédagogique.",
    })}
${zig(2, {
        index: '02',
        title: 'Notre mission',
        body: [
            "Former des citoyens responsables, créatifs et engagés, capables de relever les défis du 21e siècle tout en restant enracinés dans leur culture haïtienne.",
            "Nous nous engageons à développer l'excellence académique, l'intégrité morale et l'esprit d'innovation chez chaque élève.",
        ],
        image: 'Diapo_6',
        alt: "Élections présidentielles scolaires : exercice démocratique formateur pour nos élèves. Campagne active et participation exemplaire.",
    })}
${zig(3, {
        index: '03',
        title: 'Notre vision',
        body: [
            "Être reconnu comme l'établissement de référence en Haïti pour la qualité de notre enseignement et la réussite de nos diplômés.",
            "Nous aspirons à être un catalyseur de changement positif dans notre communauté et un pont vers l'excellence internationale.",
        ],
        image: 'Diapo_7',
        alt: "Spectacle vibrant de danses traditionnelles haïtiennes. Nos élèves célèbrent avec fierté leur patrimoine culturel national.",
    })}
                    </div>
                </div>
            </section>

            <section class="section section--alt">
                <div class="wrap">
${sectionHead('Nos valeurs fondamentales', "Les principes qui guident notre action quotidienne et façonnent l'avenir de nos élèves.")}
                    <div class="value-grid">
${VALUES.map(([icon, title, text], i) => `                        <article class="card${i > 1 ? ' card--flat' : ''}"${i > 1 ? '' : ' data-hover-lift'}>
                            <span class="card__icon">${I[icon]}</span>
                            <h3 class="card__title">${title}</h3>
                            <p class="card__text">${text}</p>
                        </article>`).join('\n')}
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="wrap">
${sectionHead('Notre impact en chiffres', null)}
                    <div class="figures">
                        <div class="figure"><strong>850</strong><span>Élèves inscrits</span></div>
                        <div class="figure"><strong>95 %</strong><span>Taux de réussite</span></div>
                        <div class="figure"><strong>45</strong><span>Professeurs</span></div>
                        <div class="figure"><strong>25</strong><span>Années d'excellence</span></div>
                        <div class="figure"><strong>1700+</strong><span>Diplômés</span></div>
                    </div>
                </div>
            </section>

            <section class="section section--alt">
                <div class="wrap">
${sectionHead('Notre équipe dirigeante', 'Des professionnels dévoués à la réussite de nos élèves.')}
                    <div class="team-grid">
${TEAM.map(([photo, name, role, bio, mail, tel]) => `                        <article class="person">
                            <div class="person__photo">${img(photo, `Portrait de ${name}, ${role.toLowerCase()} du collège.`)}</div>
                            <h3 class="person__name">${name}</h3>
                            <p class="person__role">${role}</p>
                            <p class="person__text">${bio}</p>
${mail ? `                            <div class="person__links">
                                <div><a href="mailto:${mail}">${mail}</a></div>
                                <div><a href="tel:${tel.replace(/[^+\d]/g, '')}">${tel}</a></div>
                            </div>` : ''}
                        </article>`).join('\n')}
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="wrap">
${sectionHead('Nos installations', null)}
                    <div class="value-grid">
                        <article class="card" data-hover-lift>
                            <span class="card__icon">${I.book}</span>
                            <h3 class="card__title">Salles de classe modernes</h3>
                            <p class="card__text">Des espaces lumineux et ventilés, équipés de tableaux numériques, conçus pour des effectifs qui permettent un vrai suivi individuel.</p>
                        </article>
                        <article class="card" data-hover-lift>
                            <span class="card__icon">${I.flask}</span>
                            <h3 class="card__title">Laboratoires scientifiques</h3>
                            <p class="card__text">Physique, chimie et sciences de la vie : le matériel permet aux élèves de mener eux-mêmes les expériences du programme.</p>
                        </article>
                        <article class="card card--flat">
                            <span class="card__icon">${I.globe}</span>
                            <h3 class="card__title">Bibliothèque</h3>
                            <p class="card__text">Entièrement rénovée, ouverte toute la journée.</p>
                        </article>
                        <article class="card card--flat">
                            <span class="card__icon">${I.palette}</span>
                            <h3 class="card__title">Centre culturel</h3>
                            <p class="card__text">Répétitions de théâtre, de musique et de danse.</p>
                        </article>
                        <article class="card card--flat">
                            <span class="card__icon">${I.seedling}</span>
                            <h3 class="card__title">Espace vert pédagogique</h3>
                            <p class="card__text">Jardinage écologique et sensibilisation à l'environnement.</p>
                        </article>
                    </div>
                </div>
            </section>
        </main>`;

    return page('about.html',
        'À propos — Collège Alexandre Dumas Fils',
        "L'histoire, la mission, les valeurs et l'équipe dirigeante du Collège Alexandre Dumas Fils, au Cap-Haïtien depuis 1999.",
        body);
}

function buildGallery() {
    const body = `        <main id="main">
${hero({
        eyebrow: 'Galerie',
        title: 'La vie du collège, <em>en images</em>',
        lead: "Cérémonies, spectacles, laboratoires, terrains de sport : douze moments de l'année scolaire 2024, photographiés au fil des semaines.",
        actions: [
            { href: '#galerie', label: 'Parcourir les photos', primary: true },
            { href: 'contact.html', label: 'Planifier une visite' },
        ],
        image: 'Diapo_4',
        alt: "Victoire mémorable de notre équipe de football aux championnats inter-scolaires. Travail d'équipe et détermination récompensés.",
        badge: { icon: 'images', title: '12 moments', text: "de l'année scolaire 2024" },
    })}

            <section class="section" id="galerie">
                <div class="wrap">
${sectionHead('Album 2024', "Sélectionnez une photo pour l'agrandir. Les flèches du clavier permettent de naviguer.")}
                    <div class="gallery">
${GALLERY.map(([base, date, desc]) => `                        <button type="button" class="shot">
                            ${img(base, desc)}
                            <span class="shot__cap">
                                <span class="shot__date">${date}</span>
                                <span class="shot__desc">${desc}</span>
                            </span>
                        </button>`).join('\n')}
                    </div>
                </div>
            </section>
        </main>

        <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo agrandie" aria-hidden="true">
            <button type="button" class="lightbox__btn lightbox__close" id="lightboxClose">${I.close}<span class="sr-only">Fermer</span></button>
            <button type="button" class="lightbox__btn lightbox__prev" id="lightboxPrev">${I.left}<span class="sr-only">Photo précédente</span></button>
            <button type="button" class="lightbox__btn lightbox__next" id="lightboxNext">${I.right}<span class="sr-only">Photo suivante</span></button>
            <figure class="lightbox__panel">
                <img class="lightbox__img" id="lightboxImg" alt="">
                <figcaption class="lightbox__info">
                    <p class="lightbox__date" id="lightboxDate"></p>
                    <p class="lightbox__desc" id="lightboxDesc"></p>
                </figcaption>
            </figure>
        </div>`;

    return page('gallery.html',
        'Galerie — Collège Alexandre Dumas Fils',
        "Douze photographies de la vie scolaire au Collège Alexandre Dumas Fils : cérémonies, spectacles, sport, laboratoires et ateliers.",
        body);
}

function buildContact() {
    const subjects = ["Demande d'admission", "Demande d'information générale", 'Demande de visite',
        'Prise de rendez-vous', 'Questions sur les activités culturelles', 'Informations sur les bourses',
        'Plainte ou suggestion', 'Autre'];

    const body = `        <main id="main">
${hero({
        eyebrow: 'Contact',
        title: 'Parlons de <em>votre\u00A0projet</em> scolaire',
        lead: "Admission, vie scolaire, programmes : écrivez-nous et nous vous répondons sous 24 heures ouvrées. Le secrétariat reçoit également sans rendez-vous le mercredi matin.",
        actions: [
            { href: '#formulaire', label: 'Écrire au collège', primary: true },
            { href: 'tel:+50929355678', label: '+509 2935-5678' },
        ],
        image: 'Diapo_10',
        alt: "Déjeuner convivial à notre cantine scolaire. Menu local équilibré et moments de partage entre élèves de toutes les classes.",
        badge: { icon: 'clock', title: 'Réponse sous 24 h', text: 'du lundi au vendredi' },
    })}

            <section class="section" id="formulaire">
                <div class="wrap">
                    <div class="contact-layout">
                        <div class="contact-form-panel">
                            <h2 class="section__title">Envoyez-nous un message</h2>
                            <p class="section__lead">Les champs suivis d'un astérisque sont obligatoires.</p>

                            <form class="form-grid" id="contactForm" novalidate>
                                <div class="field">
                                    <label for="firstName">Prénom *</label>
                                    <input type="text" id="firstName" name="firstName" autocomplete="given-name" required aria-describedby="firstNameError">
                                    <p class="field__error" id="firstNameError" role="alert"></p>
                                </div>
                                <div class="field">
                                    <label for="lastName">Nom de famille *</label>
                                    <input type="text" id="lastName" name="lastName" autocomplete="family-name" required aria-describedby="lastNameError">
                                    <p class="field__error" id="lastNameError" role="alert"></p>
                                </div>
                                <div class="field">
                                    <label for="email">Email *</label>
                                    <input type="email" id="email" name="email" autocomplete="email" required aria-describedby="emailError">
                                    <p class="field__error" id="emailError" role="alert"></p>
                                </div>
                                <div class="field">
                                    <label for="phone">Téléphone</label>
                                    <input type="tel" id="phone" name="phone" autocomplete="tel" placeholder="+509 0000-0000">
                                </div>
                                <div class="field field--full">
                                    <label for="subject">Sujet *</label>
                                    <select id="subject" name="subject" required aria-describedby="subjectError">
                                        <option value="">Sélectionnez un sujet</option>
${subjects.map((s) => `                                        <option>${s}</option>`).join('\n')}
                                    </select>
                                    <p class="field__error" id="subjectError" role="alert"></p>
                                </div>
                                <div class="field field--full">
                                    <label for="message">Message *</label>
                                    <textarea id="message" name="message" required aria-describedby="messageError"></textarea>
                                    <p class="field__error" id="messageError" role="alert"></p>
                                </div>
                                <div class="field field--full">
                                    <p class="form-status" id="formStatus" role="status" aria-live="polite">${I.info}<span class="form-status__text"></span></p>
                                    <button type="submit" class="btn btn--primary form-button">Envoyer le message ${I.arrow}</button>
                                </div>
                            </form>
                        </div>

                        <aside class="contact-side">
                            <h2 class="section__title">Nos coordonnées</h2>
                            <ul class="contact-list">
                                <li>${I.pin}<div><strong>Adresse</strong><span>15, Rue Alexandre Dumas<br>Cap-Haïtien, Haïti — HT1110</span></div></li>
                                <li>${I.phone}<div><strong>Téléphone</strong><a href="tel:+50929355678">Secrétariat : +509 2935-5678</a><a href="tel:+50929355679">Direction : +509 2935-5679</a><a href="tel:+50934567890">Urgences : +509 3456-7890</a></div></li>
                                <li>${I.mail}<div><strong>Email</strong><a href="mailto:info@collegealexandredumas.edu.ht">info@collegealexandredumas.edu.ht</a><a href="mailto:direction@collegealexandredumas.edu.ht">direction@collegealexandredumas.edu.ht</a><a href="mailto:admissions@collegealexandredumas.edu.ht">admissions@collegealexandredumas.edu.ht</a></div></li>
                                <li>${I.clock}<div><strong>Horaires</strong><span>Lundi – vendredi : 7h00 – 17h00<br>Samedi : 8h00 – 12h00<br>Dimanche : fermé</span></div></li>
                            </ul>
                        </aside>
                    </div>
                </div>
            </section>

            <section class="section section--alt">
                <div class="wrap">
${sectionHead('Comment nous trouver', 'Au cœur du Cap-Haïtien, à deux minutes de la rue principale.')}
                    <div class="zig-list">
${zig(1, {
        index: '01',
        title: 'En voiture',
        body: ["Depuis le centre-ville du Cap-Haïtien, prenez la Route Nationale 1 direction Nord, puis tournez à droite sur la Rue Alexandre Dumas. Notre établissement se trouve au numéro 15, reconnaissable à sa façade bleue et son portail doré."],
        image: 'Diapo_11',
        alt: "Créativité à l'honneur dans notre atelier d'arts plastiques. Nos jeunes artistes développent leur talent et leur expression personnelle.",
    })}
${zig(2, {
        index: '02',
        title: 'En transport public',
        body: ["Prenez un tap-tap ou un bus direction « Quartier Morin ». Descendez à l'arrêt « Alexandre Dumas » et marchez deux minutes vers l'est : l'école est visible depuis la rue principale."],
        image: 'Diapo_12',
        alt: "Initiation au jardinage écologique dans notre espace vert pédagogique. Sensibilisation à l'environnement et développement durable.",
    })}
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="wrap">
${sectionHead('Questions fréquentes', null)}
                    <div class="faq">
                        <details class="faq__item">
                            <summary>Quand ouvrent les inscriptions ?</summary>
                            <div class="faq__body"><p>Les dossiers pour l'année 2025-2026 sont reçus à partir de mars. Le secrétariat accepte les dépôts en main propre du lundi au vendredi, de 7h à 17h, et par email à admissions@collegealexandredumas.edu.ht.</p></div>
                        </details>
                        <details class="faq__item">
                            <summary>Peut-on visiter l'établissement avant d'inscrire son enfant ?</summary>
                            <div class="faq__body"><p>Oui. Les visites se font sur rendez-vous, en général le mercredi matin. Utilisez le formulaire ci-dessus en choisissant le sujet « Demande de visite ».</p></div>
                        </details>
                        <details class="faq__item">
                            <summary>Proposez-vous des bourses ?</summary>
                            <div class="faq__body"><p>Un nombre limité de bourses partielles est attribué chaque année sur critères sociaux et scolaires. Écrivez à la direction en sélectionnant le sujet « Informations sur les bourses ».</p></div>
                        </details>
                        <details class="faq__item">
                            <summary>Comment accéder au bulletin de mon enfant ?</summary>
                            <div class="faq__body"><p>Les notes, l'emploi du temps et les absences sont consultables dans l'espace élève, accessible depuis le menu. Les identifiants sont remis par le secrétariat en début d'année.</p></div>
                        </details>
                    </div>
                </div>
            </section>
        </main>`;

    return page('contact.html',
        'Contact — Collège Alexandre Dumas Fils',
        "Coordonnées, formulaire de contact, accès et questions fréquentes du Collège Alexandre Dumas Fils, Cap-Haïtien.",
        body);
}

/* Espace élève : c'est la seule page où la grille bento est employée,
   parce qu'il s'agit d'un tableau de bord et non d'une page vitrine. */
function buildDashboard() {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const timetable = [
        ['08h00', 'Mathématiques', 'Salle 12'],
        ['09h00', 'Français', 'Salle 4'],
        ['10h15', 'Physique-chimie', 'Laboratoire 1'],
        ['11h15', 'Anglais', 'Salle 7'],
        ['13h30', 'Histoire-géographie', 'Salle 9'],
        ['14h30', 'Éducation artistique', 'Atelier'],
    ];
    const grades = [
        ['Mathématiques', 16.5], ['Français', 14], ['Physique-chimie', 15.5],
        ['Anglais', 17], ['Histoire-géographie', 13.5], ['Sciences de la vie', 15],
    ];
    const notices = [
        ['Conseil de classe du 2e trimestre', '18 septembre', "Les bulletins seront remis aux familles le vendredi 26 septembre, de 14h à 17h, au secrétariat."],
        ['Sortie au Parc historique', '12 septembre', "Sortie pédagogique prévue le 3 octobre. L'autorisation parentale est à rendre avant le 27 septembre."],
        ['Répétitions de la fanfare', '5 septembre', "Les répétitions reprennent le mardi et le jeudi de 15h à 16h30 au centre culturel."],
    ];

    const body = `        <main id="main">
            <section class="section section--tight" id="loginGate">
                <div class="wrap">
                    <div class="login">
                        <div class="login__text">
                            <p class="eyebrow">Espace élève</p>
                            <h1 class="section__title">Connectez-vous à votre <em>espace</em></h1>
                            <p class="section__lead">Emploi du temps, bulletin, absences, annonces de la direction et messagerie : tout est réuni sur un seul tableau de bord.</p>
                            <ul class="ticks">
                                <li>${I.calendar}<span>Emploi du temps de la semaine</span></li>
                                <li>${I.chart}<span>Notes et moyenne par matière</span></li>
                                <li>${I.megaphone}<span>Annonces de la direction</span></li>
                                <li>${I.checkCal}<span>Suivi des absences et retards</span></li>
                            </ul>
                        </div>

                        <div class="login__panel">
                            <h2 class="card__title">${I.lock} Connexion</h2>
                            <form id="loginForm" class="login__form" novalidate>
                                <div class="field">
                                    <label for="studentId">Identifiant élève</label>
                                    <input type="text" id="studentId" name="studentId" autocomplete="username" required>
                                </div>
                                <div class="field">
                                    <label for="studentPin">Code d'accès</label>
                                    <input type="password" id="studentPin" name="studentPin" autocomplete="current-password" required>
                                </div>
                                <p class="field__error" id="loginError" role="alert"></p>
                                <button type="submit" class="btn btn--primary btn--block">Se connecter ${I.arrow}</button>
                            </form>
                            <p class="login__hint">Démonstration : identifiant <strong>demo</strong>, code <strong>1234</strong>. Les identifiants réels sont remis par le secrétariat.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section section--tight" id="dashboard" hidden>
                <div class="wrap">
                    <div class="section__head dash__head">
                        <div>
                            <p class="eyebrow">Espace élève — Terminale S2</p>
                            <h2 class="section__title" id="studentName">Élève</h2>
                        </div>
                        <button type="button" class="btn btn--ghost" id="logout">${I.logout} Se déconnecter</button>
                    </div>

                    <div class="bento">
                        <article class="bento__cell bento__cell--wide">
                            <h3 class="bento__label">${I.calendar} Emploi du temps — aujourd'hui</h3>
                            <table class="timetable">
                                <caption class="sr-only">Cours du jour, heure, matière et salle</caption>
                                <thead>
                                    <tr><th scope="col">Heure</th><th scope="col">Matière</th><th scope="col">Salle</th></tr>
                                </thead>
                                <tbody>
${timetable.map(([h, s, r]) => `                                    <tr><td>${h}</td><td>${s}</td><td>${r}</td></tr>`).join('\n')}
                                </tbody>
                            </table>
                        </article>

                        <article class="bento__cell bento__cell--ink">
                            <h3 class="bento__label">${I.chart} Moyenne générale</h3>
                            <p class="bento__value">15,25<span>/20</span></p>
                            <p class="bento__hint">2e trimestre — rang 4 sur 32</p>
                        </article>

                        <article class="bento__cell">
                            <h3 class="bento__label">${I.checkCal} Assiduité</h3>
                            <p class="bento__value">96<span>%</span></p>
                            <p class="bento__hint">2 absences justifiées, 1 retard ce trimestre</p>
                        </article>

                        <article class="bento__cell bento__cell--tall">
                            <h3 class="bento__label">${I.award} Bulletin — 2e trimestre</h3>
${grades.map(([name, val]) => `                            <div class="grade-row">
                                <span class="grade-row__name">${name}</span>
                                <span class="grade-row__bar"><span style="width:${(val / 20 * 100).toFixed(0)}%"></span></span>
                                <span class="grade-row__val">${String(val).replace('.', ',')}</span>
                            </div>`).join('\n')}
                        </article>

                        <article class="bento__cell bento__cell--wide">
                            <h3 class="bento__label">${I.megaphone} Annonces de la direction</h3>
${notices.map(([t, d, x]) => `                            <div class="notice">
                                <p class="notice__date">${d}</p>
                                <p class="notice__title">${t}</p>
                                <p class="notice__text">${x}</p>
                            </div>`).join('\n')}
                        </article>

                        <article class="bento__cell bento__cell--full">
                            <h3 class="bento__label">${I.mail} Écrire à la direction</h3>
                            <p class="bento__hint">Votre message est transmis au secrétariat, qui répond sous 24 heures ouvrées.</p>
                            <form class="form-grid" id="messageForm" novalidate>
                                <div class="field field--full">
                                    <label for="dmSubject">Objet</label>
                                    <input type="text" id="dmSubject" name="dmSubject" placeholder="Demande de rendez-vous">
                                </div>
                                <div class="field field--full">
                                    <label for="dmBody">Message</label>
                                    <textarea id="dmBody" name="dmBody" placeholder="Bonjour,"></textarea>
                                </div>
                                <div class="field field--full">
                                    <p class="form-status" id="messageStatus" role="status" aria-live="polite">${I.info}<span class="form-status__text"></span></p>
                                    <button type="submit" class="btn btn--primary">Envoyer à la direction ${I.arrow}</button>
                                </div>
                            </form>
                        </article>
                    </div>

                    <p class="bento__hint" style="margin-top:18px">Semaine du ${days[0].toLowerCase()} 22 au ${days[4].toLowerCase()} 26 septembre. Les données affichées sont un jeu de démonstration.</p>
                </div>
            </section>
        </main>`;

    return page('dashboard.html',
        'Espace élève — Collège Alexandre Dumas Fils',
        "Emploi du temps, bulletin, absences, annonces et messagerie : l'espace personnel des élèves du Collège Alexandre Dumas Fils.",
        body);
}

/* ================================================================ Run == */

const PAGES = {
    'index.html': buildIndex,
    'about.html': buildAbout,
    'gallery.html': buildGallery,
    'contact.html': buildContact,
    'dashboard.html': buildDashboard,
};

let total = 0;
for (const [name, fn] of Object.entries(PAGES)) {
    const html = fn();
    fs.writeFileSync(path.join(OUT, name), html);
    total += html.length;
    console.log(`  ${name.padEnd(16)} ${(html.length / 1024).toFixed(1)} Ko`);
}
console.log(`\n${Object.keys(PAGES).length} pages générées — ${(total / 1024).toFixed(1)} Ko au total.`);
