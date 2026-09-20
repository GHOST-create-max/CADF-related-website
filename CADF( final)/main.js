/* ==========================================================================
   Collège Alexandre Dumas Fils — main.js
   --------------------------------------------------------------------------
   Fichier unique. Remplace script.js, about.js, gallery.js et contact.js, qui
   dupliquaient chacun le menu et le thème (quatre copies qui avaient déjà
   divergé entre elles).

   Sommaire
     1. Configuration
     2. Utilitaires
     3. Navigation
     4. Animations GSAP (une seule orchestration au chargement)
     5. Galerie / lightbox
     6. Formulaire de contact (envoi réel)
     7. Tableau de bord élève
     8. Démarrage
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------- 1. Configuration */
    const CONFIG = {
        /* Point d'arrivée du formulaire de contact.
           À renseigner dans le HTML, sans toucher à ce fichier :
             <meta name="cadf-contact-endpoint" content="https://n8n.exemple.ht/webhook/cadf-contact">
           (la valeur se modifie en une ligne dans .tooling/build/ui.js, puis
           on relance la génération des pages).
           Tant que la valeur est vide, le formulaire bascule en mode secours
           et ouvre le client mail de l'utilisateur (mailto:) — il n'y a donc
           plus de cas où l'envoi ne fait rien, ce qui était le bug d'origine. */
        contactFallbackMail: 'info@collegealexandredumas.edu.ht',
        storageKey: 'cadf.',
    };

    /* Lu au moment de l'envoi, et non au chargement : l'URL peut ainsi être
       remplacée par la configuration du serveur ou lors des tests. */
    function contactEndpoint() {
        const m = document.querySelector('meta[name="cadf-contact-endpoint"]');
        return m ? m.content.trim() : '';
    }

    const prefersReducedMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --------------------------------------------------- 2. Utilitaires */
    const $  = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    // localStorage peut lever une exception en navigation privée.
    const store = {
        get(k) { try { return localStorage.getItem(CONFIG.storageKey + k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(CONFIG.storageKey + k, v); } catch (e) {} },
        del(k) { try { localStorage.removeItem(CONFIG.storageKey + k); } catch (e) {} },
    };

    /* --------------------------------------------------- 3. Navigation */
    function initNav() {
        const toggle = $('#navToggle');
        const drawer = $('#navDrawer');
        const scrim  = $('#navScrim');
        if (!toggle || !drawer) return;

        function setOpen(open) {
            drawer.classList.toggle('is-open', open);
            if (scrim) scrim.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        }

        toggle.addEventListener('click', () => setOpen(!drawer.classList.contains('is-open')));
        if (scrim) scrim.addEventListener('click', () => setOpen(false));
        $$('a', drawer).forEach((a) => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
        });
    }

    /* ------------------------------------------- 4. Animations (GSAP) */
    /* Une seule séquence orchestrée au chargement du hero. Aucun fade-in
       répété section par section : le reste de la page est déjà visible. */
    function initMotion() {
        const animated = $$('[data-anim]');
        if (!animated.length) return;

        // Mouvement réduit ou GSAP absent : on révèle tout immédiatement.
        if (prefersReducedMotion || typeof window.gsap === 'undefined') {
            animated.forEach((el) => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const gsap = window.gsap;
        const tl = gsap.timeline({
            defaults: { ease: 'power3.out', duration: .75 },
        });

        /* La séquence entière tient en 1,5 s environ : passé ce délai, plus
           rien ne bouge et la page est entièrement lisible. */
        tl.from('[data-anim="title"]', { y: 24, opacity: 0 })
          .from('[data-anim="lead"]', { y: 18, opacity: 0 }, '-=.52')
          .from('[data-anim="actions"] > *', { y: 14, opacity: 0, stagger: .06 }, '-=.5')
          .from('[data-anim="figure"]', { scale: .975, opacity: 0, duration: .85 }, '-=.78')
          .from('[data-anim="badge"]', { y: 12, opacity: 0, duration: .6 }, '-=.5')
          .from('[data-anim="stat"]', { y: 12, opacity: 0, duration: .6, stagger: .05 }, '-=.55');

        // Micro-interaction : léger soulèvement des cartes au survol.
        $$('[data-hover-lift]').forEach((el) => {
            el.addEventListener('mouseenter', () =>
                gsap.to(el, { y: -4, duration: .3, ease: 'power2.out' }));
            el.addEventListener('mouseleave', () =>
                gsap.to(el, { y: 0, duration: .3, ease: 'power2.out' }));
        });
    }

    /* ------------------------------------------- 5. Galerie / lightbox */
    function initGallery() {
        const box = $('#lightbox');
        const shots = $$('.shot');
        if (!box || !shots.length) return;

        const img   = $('#lightboxImg', box);
        const date  = $('#lightboxDate', box);
        const desc  = $('#lightboxDesc', box);
        const close = $('#lightboxClose', box);
        const prev  = $('#lightboxPrev', box);
        const next  = $('#lightboxNext', box);

        // Les données sont lues depuis le DOM : pas de liste parallèle de
        // chemins à maintenir (c'est ce décalage qui cassait des images).
        const slides = shots.map((s) => {
            const i = $('img', s);
            return {
                src: i ? i.getAttribute('src') : '',
                alt: i ? i.getAttribute('alt') : '',
                date: ($('.shot__date', s) || {}).textContent || '',
            };
        });

        let index = -1;
        let lastFocus = null;

        function show(i) {
            const s = slides[i];
            if (!s) return;
            index = i;
            img.src = s.src;
            img.alt = s.alt;
            date.textContent = s.date.trim();
            desc.textContent = s.alt;
        }

        function open(i) {
            lastFocus = document.activeElement;
            show(i);
            box.classList.add('is-open');
            box.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (close) close.focus();
        }

        function hide() {
            box.classList.remove('is-open');
            box.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocus) lastFocus.focus();
        }

        const step = (d) => { if (index >= 0) show((index + d + slides.length) % slides.length); };

        shots.forEach((s, i) => s.addEventListener('click', () => open(i)));
        if (close) close.addEventListener('click', hide);
        if (prev) prev.addEventListener('click', () => step(-1));
        if (next) next.addEventListener('click', () => step(1));

        box.addEventListener('click', (e) => { if (e.target === box) hide(); });

        document.addEventListener('keydown', (e) => {
            if (!box.classList.contains('is-open')) return;
            if (e.key === 'Escape') hide();
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        });
    }

    /* ------------------------------ 6. Formulaire de contact (envoi réel) */
    function initContactForm() {
        const form = $('#contactForm');
        if (!form) return;

        const status = $('#formStatus');
        const button = $('.form-button', form);
        const fields = $$('input, select, textarea', form).filter((f) => f.name);

        function setStatus(state, message) {
            if (!status) return;
            status.setAttribute('data-state', state);
            const text = $('.form-status__text', status);
            if (text) text.textContent = message;
        }

        /* Brouillon : on restaure ce que l'utilisateur avait commencé. */
        fields.forEach((f) => {
            const saved = store.get('contact.' + f.name);
            if (saved) f.value = saved;
            f.addEventListener('input', () => store.set('contact.' + f.name, f.value));
        });

        function validate() {
            let ok = true;
            let firstBad = null;

            $$('[required]', form).forEach((f) => {
                const errorEl = $('#' + f.id + 'Error');
                let message = '';

                if (!f.value.trim()) {
                    message = 'Ce champ est obligatoire.';
                } else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim())) {
                    message = 'Adresse email invalide.';
                }

                if (message) {
                    ok = false;
                    f.setAttribute('aria-invalid', 'true');
                    if (errorEl) errorEl.textContent = message;
                    if (!firstBad) firstBad = f;
                } else {
                    f.removeAttribute('aria-invalid');
                    if (errorEl) errorEl.textContent = '';
                }
            });

            if (firstBad) firstBad.focus();
            return ok;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validate()) {
                setStatus('error', 'Merci de corriger les champs signalés.');
                return;
            }

            const data = Object.fromEntries(new FormData(form).entries());
            data.page = window.location.href;
            data.sentAt = new Date().toISOString();

            /* Sans point d'arrivée configuré, on ouvre le client mail plutôt
               que de faire semblant d'envoyer. */
            const endpoint = contactEndpoint();
            if (!endpoint) {
                const subject = encodeURIComponent('[Site CADF] ' + (data.subject || 'Message'));
                const body = encodeURIComponent(
                    `Nom : ${data.firstName || ''} ${data.lastName || ''}\n` +
                    `Email : ${data.email || ''}\n` +
                    `Téléphone : ${data.phone || '—'}\n` +
                    `Sujet : ${data.subject || '—'}\n\n${data.message || ''}`);
                setStatus('ok', 'Votre messagerie va s\u2019ouvrir pour finaliser l\u2019envoi.');
                window.location.href =
                    `mailto:${CONFIG.contactFallbackMail}?subject=${subject}&body=${body}`;
                return;
            }

            if (button) button.disabled = true;
            setStatus('sending', 'Envoi en cours…');

            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error('HTTP ' + res.status);

                form.reset();
                fields.forEach((f) => store.del('contact.' + f.name));
                setStatus('ok', 'Message envoyé. Nous vous répondrons sous 24 h.');
            } catch (err) {
                setStatus('error',
                    'L\u2019envoi a échoué. Écrivez-nous à ' + CONFIG.contactFallbackMail + '.');
            } finally {
                if (button) button.disabled = false;
            }
        });
    }

    /* ------------------------------------- 7. Tableau de bord élève */
    /* Démonstration côté client uniquement : il ne s'agit pas d'une
       authentification réelle, qui exige un serveur. */
    function initDashboard() {
        const login = $('#loginForm');
        const panel = $('#dashboard');
        const gate  = $('#loginGate');
        if (!login || !panel || !gate) return;

        function showDashboard(name) {
            gate.hidden = true;
            panel.hidden = false;
            const who = $('#studentName');
            if (who) who.textContent = name;
        }

        const session = store.get('student');
        if (session) showDashboard(session);

        login.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = $('#studentId').value.trim();
            const pin = $('#studentPin').value.trim();
            const err = $('#loginError');

            // Jeu d'essai pour la démonstration.
            if (id.toLowerCase() === 'demo' && pin === '1234') {
                store.set('student', 'Élève de démonstration');
                showDashboard('Élève de démonstration');
            } else if (err) {
                err.textContent = 'Identifiant ou code incorrect. Essayez demo / 1234.';
            }
        });

        const out = $('#logout');
        if (out) out.addEventListener('click', () => {
            store.del('student');
            panel.hidden = true;
            gate.hidden = false;
        });

        initMessageForm();
    }

    /* Messagerie vers la direction, depuis le tableau de bord. */
    function initMessageForm() {
        const form = $('#messageForm');
        if (!form) return;

        const status = $('#messageStatus');
        const setStatus = (state, message) => {
            if (!status) return;
            status.setAttribute('data-state', state);
            const text = $('.form-status__text', status);
            if (text) text.textContent = message;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const subject = $('#dmSubject');
            const body = $('#dmBody');

            if (!body.value.trim()) {
                body.setAttribute('aria-invalid', 'true');
                setStatus('error', 'Écrivez votre message avant de l\u2019envoyer.');
                body.focus();
                return;
            }
            body.removeAttribute('aria-invalid');

            const endpoint = contactEndpoint();
            if (!endpoint) {
                const s = encodeURIComponent('[Espace élève] ' + (subject.value || 'Message'));
                setStatus('ok', 'Votre messagerie va s\u2019ouvrir pour finaliser l\u2019envoi.');
                window.location.href = `mailto:${CONFIG.contactFallbackMail}` +
                    `?subject=${s}&body=${encodeURIComponent(body.value)}`;
                return;
            }

            setStatus('sending', 'Envoi en cours…');
            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        from: 'espace-eleve',
                        subject: subject.value,
                        message: body.value,
                        sentAt: new Date().toISOString(),
                    }),
                });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                form.reset();
                setStatus('ok', 'Message transmis au secrétariat.');
            } catch (err) {
                setStatus('error', 'L\u2019envoi a échoué. Réessayez plus tard.');
            }
        });
    }

    /* ------------------------------------------------- 8. Démarrage */
    function start() {
        initNav();
        initMotion();
        initGallery();
        initContactForm();
        initDashboard();
    }

    document.documentElement.classList.remove('no-js');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
