/* Accueil — filtrage des filières par catégorie.
   Le reste (thème, menu, loader, animations) est dans common.js. */

(function () {
    'use strict';

    const chips = document.querySelectorAll('.chip[data-filter]');
    const grid = document.getElementById('courseGrid');
    if (!chips.length || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.course-card'));

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            const filter = chip.dataset.filter;

            chips.forEach(function (c) {
                const on = c === chip;
                c.classList.toggle('active', on);
                c.setAttribute('aria-selected', String(on));
            });

            cards.forEach(function (card) {
                const match = filter === 'all'
                    || card.classList.contains('course-card--' + filter);
                card.style.display = match ? '' : 'none';
            });
        });
    });
})();
