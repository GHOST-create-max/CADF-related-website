# Outillage (site CADF)

Outils de développement du site statique de `CADF( final)/` : un générateur de
pages, un convertisseur d'images et une suite de tests en navigateur sans
interface. Ce dossier ne fait pas partie du site publié.

## Premier lancement dans un environnement neuf

    cd .tooling
    npm run setup      # installe les dépendances + extrait Chromium dans ../.cache/
    npm run assets     # convertit les images, copie GSAP et les polices
    npm run build      # génère les 5 pages HTML
    npm run serve      # http://localhost:8000

`.cache/` et `node_modules/` sont ignorés par git et ne survivent pas d'une
session à l'autre ; `npm run setup` est idempotent et peut être relancé.

### Pourquoi un Chromium spécifique

`cdn.playwright.dev` et `storage.googleapis.com` sont injoignables depuis cet
environnement : `npx playwright install` échoue. `setup-browser.js` décompresse
à la place le Chromium distribué par le registre npm (`@sparticuz/chromium`)
dans `../.cache/chrome/`, avec ses bibliothèques système. Le GPU et Vulkan sont
désactivés dans les options de lancement, ANGLE plantant en mode sans interface
dans ce conteneur.

## Générer les pages

    npm run build      # node build/build.js

Les cinq pages HTML sont **générées**, jamais modifiées à la main.

- `build/ui.js` — fragments communs : jeu d'icônes SVG, barre latérale, tiroir
  mobile, barre basse, pied de page, `<head>`. C'est aussi là que se règle
  `CONTACT_ENDPOINT` (voir plus bas).
- `build/build.js` — contenu de chaque page et assemblage final.

Modifier un fichier `.html` directement serait écrasé au prochain build.

## Préparer les médias

    npm run assets     # node build/assets.js

Ce script :

1. convertit `CADF( final)/images/*.jpg` en WebP dans `CADF( final)/assets/img/`,
   en réduisant la qualité par paliers jusqu'à passer **sous 200 Ko** ;
2. écrit `build/images.json`, le manifeste `{base: {w, h, bytes}}` utilisé par
   le générateur pour émettre des attributs `width`/`height` exacts — c'est ce
   qui évite tout décalage de mise en page pendant le chargement ;
3. copie GSAP et les deux polices variables depuis `node_modules` vers
   `CADF( final)/assets/`, les CDN étant inaccessibles.

Les JPEG d'origine sont conservés dans `CADF( final)/images/` comme sources.

## Brancher le formulaire de contact

Le formulaire envoie un `POST` JSON vers l'URL déclarée dans la balise
`<meta name="cadf-contact-endpoint">`. Pour la renseigner, éditez
`CONTACT_ENDPOINT` en haut de `build/ui.js` puis relancez `npm run build` :

    const CONTACT_ENDPOINT = 'https://n8n.votre-domaine.ht/webhook/cadf-contact';

Charge utile envoyée :

    { firstName, lastName, email, phone, subject, message, page, sentAt }

Tant que la valeur reste vide, le formulaire bascule sur un envoi via le client
mail de l'utilisateur (`mailto:`) : il n'existe aucun cas où l'envoi ne fait
rien. En cas de panne du service, l'utilisateur voit un message d'erreur avec
l'adresse de repli.

## Tests

    npm test           # enchaîne les huit contrôles ci-dessous

| Script | Ce qu'il vérifie |
| --- | --- |
| `npm run contrast` | Contraste WCAG de chaque paire texte/fond (aucun navigateur requis) |
| `npm run check`    | Chargement des 5 pages : erreurs JS, requêtes en échec, images cassées, `alt` manquants, emoji |
| `npm run shared`   | Comportements communs : navigation active, pastille or, tiroir mobile, révélation du contenu |
| `npm run features` | Lightbox, formulaire de contact (validation, brouillon, envoi réel, panne), espace élève |
| `npm run modal`    | Ouverture des 12 photos dans la lightbox |
| `npm run motion`   | `prefers-reduced-motion` et lisibilité sans JavaScript |
| `npm run visual`   | Mise en page à 375 px et 1600 px : débordement, cibles tactiles, SVG hors-format ; captures dans `shots/` |
| `npm run audit`    | Accessibilité : un seul `h1`, hiérarchie des titres, étiquettes, repères, lien d'évitement |

Les captures d'écran sont écrites dans `shots/` (ignoré par git).

## Points de vigilance

- **Les icônes SVG doivent avoir une taille explicite.** Sans `width`/`height`
  et `flex: 0 0 auto`, un SVG s'étire pour remplir son conteneur flex.
  `visual.js` échoue au-delà de 60 px.
- **Pas d'emoji.** Beaucoup de machines n'ont pas de police emoji et affichent
  un carré vide. `check.js` échoue si le texte rendu en contient.
- **Ne pas sauter de niveau de titre** (`h1` → `h3`) : `audit.js` le détecte.
- **L'or `#8A6A1E` n'est pas conforme en texte** sur les fonds teintés
  (4,28:1 et 4,16:1 pour 4,5 requis). Utilisez `--gold-text` pour du texte et
  réservez `--gold` aux traits, pastilles et bordures.
- **L'iframe OpenStreetMap est bloquée** dans cet environnement : la page
  contact décrit l'accès en texte plutôt que d'intégrer une carte.
