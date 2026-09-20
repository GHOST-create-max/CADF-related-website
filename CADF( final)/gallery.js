/* Galerie — la lightbox (zoom d'image).
   Les données sont lues depuis le HTML (src + alt des vignettes), il n'y a
   donc plus de liste de chemins à maintenir en double : c'est ce décalage
   qui faisait échouer trois images auparavant.

   Le thème, le menu mobile et le loader sont dans common.js. */

(function () {
    'use strict';

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalDate = document.getElementById('modalDate');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.getElementById('modalClose');
    const items = Array.from(document.querySelectorAll('.gallery-item'));

    if (!modal || !items.length) return;

    // Chaque vignette porte déjà son image, sa date et sa description.
    const slides = items.map(function (item) {
        const img = item.querySelector('.gallery-image');
        const date = item.querySelector('.gallery-date');
        return {
            src: img ? img.getAttribute('src') : '',
            alt: img ? img.getAttribute('alt') : '',
            date: date ? date.textContent.trim() : '',
        };
    });

    let current = -1;
    let lastFocused = null;

    function show(index) {
        const slide = slides[index];
        if (!slide) return;
        current = index;
        modalImage.src = slide.src;
        modalImage.alt = slide.alt;
        modalDate.textContent = slide.date;
        modalDescription.textContent = slide.alt;
    }

    function open(index) {
        lastFocused = document.activeElement;
        show(index);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    }

    function close() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    function step(delta) {
        if (current < 0) return;
        show((current + delta + slides.length) % slides.length);
    }

    items.forEach(function (item, i) {
        item.addEventListener('click', function () { open(i); });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);

    // Clic en dehors de l'image.
    modal.addEventListener('click', function (e) {
        if (e.target === modal) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
    });

    // Les fonctions restent accessibles pour d'éventuels appels externes.
    window.openModal = open;
    window.closeModal = close;
})();
