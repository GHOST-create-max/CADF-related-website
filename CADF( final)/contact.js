/* Contact — le formulaire (validation, retour visuel, brouillon).
   Le thème, le menu mobile et le loader sont dans common.js. */

(function () {
    'use strict';

    const form = document.getElementById('contactForm');
    // id du champ -> clé de sauvegarde
    const FIELDS = ['firstName', 'lastName', 'email', 'phone', 'subject', 'messageField'];

    function clearDraft() {
        FIELDS.forEach(function (id) {
            try { localStorage.removeItem('contact_' + id); } catch (e) {}
        });
    }

    function showConfirmation(message) {
        const note = document.createElement('div');
        note.className = 'form-confirmation';
        note.setAttribute('role', 'status');
        note.setAttribute('aria-live', 'polite');
        note.textContent = message;
        document.body.appendChild(note);
        setTimeout(function () { note.remove(); }, 5000);
    }

    /* ------------------------------------------------------------- Envoi */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let valid = true;
            let firstInvalid = null;

            this.querySelectorAll('[required]').forEach(function (field) {
                const empty = !field.value.trim();
                field.style.borderColor = empty ? 'var(--danger)' : '';
                if (empty) {
                    field.setAttribute('aria-invalid', 'true');
                    if (!firstInvalid) firstInvalid = field;
                    valid = false;
                } else {
                    field.removeAttribute('aria-invalid');
                }
            });

            if (!valid) {
                showConfirmation('Veuillez remplir tous les champs obligatoires.');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const button = this.querySelector('.form-button');
            const originalHTML = button ? button.innerHTML : '';

            if (button) {
                button.textContent = 'Message envoyé ✓';
                button.disabled = true;
            }

            const self = this;
            setTimeout(function () {
                if (button) {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }
                self.reset();
                clearDraft();
                showConfirmation('Message reçu ! Nous vous répondrons sous 24 h.');
            }, 1600);
        });
    }

    /* ------------------------------------------- Brouillon (localStorage) */
    FIELDS.forEach(function (id) {
        const field = document.getElementById(id);
        if (!field) return;

        try {
            const saved = localStorage.getItem('contact_' + id);
            if (saved) field.value = saved;
        } catch (e) { /* mode privé */ }

        field.addEventListener('input', function () {
            try { localStorage.setItem('contact_' + id, this.value); } catch (err) {}
        });
    });
})();
