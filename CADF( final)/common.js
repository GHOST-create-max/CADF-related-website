/* ==========================================================================
   common.js — code partagé par TOUTES les pages
   --------------------------------------------------------------------------
   Thème clair/sombre, menu mobile, loader, animations au défilement et
   défilement doux. À corriger ICI une seule fois, pas dans quatre fichiers.

   Chaque bloc est protégé : si un élément n'existe pas sur une page, la
   fonction ne fait rien au lieu de lever une erreur qui interromprait tout.
   ========================================================================== */

(function () {
    'use strict';

    /* ---------------------------------------------------------------- Thème
       Deux boutons possibles : celui du rail (desktop) et celui de la barre
       mobile. Les deux restent synchronisés.                               */
    function initTheme() {
        const buttons = [
            document.getElementById('theme-btn'),
            document.getElementById('theme-btn-m'),
        ].filter(Boolean);

        function render(isDark) {
            document.documentElement.classList.toggle('dark', isDark);

            // Chaque bouton contient son propre couple d'icônes.
            buttons.forEach(function (btn) {
                const sun = btn.querySelector('#sun, [id^="sun"]');
                const moon = btn.querySelector('#moon, [id^="moon"]');
                if (sun) sun.style.display = isDark ? 'none' : 'block';
                if (moon) moon.style.display = isDark ? 'block' : 'none';
                btn.setAttribute('aria-pressed', String(isDark));
                btn.setAttribute('aria-label',
                    isDark ? 'Passer au thème clair' : 'Passer au thème sombre');
            });
        }

        let saved = null;
        try { saved = localStorage.getItem('theme'); } catch (e) { /* mode privé */ }

        const prefersDark = window.matchMedia
            && window.matchMedia('(prefers-color-scheme: dark)').matches;
        render(saved ? saved === 'dark' : prefersDark);

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const isDark = !document.documentElement.classList.contains('dark');
                render(isDark);
                try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
            });
        });
    }

    /* ---------------------------------------------------------- Menu mobile */
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        const closeBtn = document.getElementById('mobileClose');
        if (!hamburger || !menu) return;

        function setMenu(open) {
            hamburger.classList.toggle('active', open);
            menu.classList.toggle('active', open);
            if (overlay) overlay.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
            hamburger.setAttribute('aria-expanded', String(open));
        }

        const close = function () { setMenu(false); };

        hamburger.setAttribute('aria-controls', 'mobileMenu');
        hamburger.setAttribute('aria-expanded', 'false');

        hamburger.addEventListener('click', function () {
            setMenu(!menu.classList.contains('active'));
        });

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (overlay) overlay.addEventListener('click', close);

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', close);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 860) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) close();
        });

        menu.addEventListener('transitionend', function () {
            if (menu.classList.contains('active')) {
                const first = menu.querySelector('a');
                if (first) first.focus();
            }
        });
    }

    /* --------------------------------------------------------------- Loader
       Calque opaque : le contenu n'est jamais masqué en CSS, la page reste
       donc lisible même si JavaScript échoue.                              */
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }

    function initLoader() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', hideLoader);
        } else {
            hideLoader();
        }
        window.addEventListener('load', hideLoader);
        setTimeout(hideLoader, 3000);
    }

    /* ------------------------------------------------- Animations au scroll */
    function initScrollAnimations() {
        const targets = document.querySelectorAll('.fade-in');
        if (!targets.length) return;

        const reduce = window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!('IntersectionObserver' in window) || reduce) {
            targets.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) { observer.observe(el); });
    }

    /* ----------------------------------------------------- Défilement doux */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    /* ------------------------------------------------------------ Démarrage */
    initTheme();   // avant le rendu, pour éviter le flash
    initLoader();

    function start() {
        initMobileMenu();
        initScrollAnimations();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
