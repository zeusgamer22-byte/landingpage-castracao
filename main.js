/**
 * Vet Viajante — main.js
 * Módulos: FAQ, Modal, ScrollReveal, SmoothScroll, Nav
 */

const VetViajante = (() => {

  // ── Configuração ────────────────────────────────────────────────
  const WA_NUMBER = '5511996675266'; // Substitua pelo número real da clínica

  // ══════════════════════════════════════════════════════════════
  // FAQ — Accordion com transição suave de max-height
  // ══════════════════════════════════════════════════════════════
  const FAQ = {
    init() {
      document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => this._toggle(btn));
      });
    },

    _toggle(btn) {
      const item = btn.closest('.faq-it');
      const isOpen = item.classList.contains('open');

      // Fecha todos os itens abertos
      document.querySelectorAll('.faq-it.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Abre o clicado (se estava fechado)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    }
  };

  // ══════════════════════════════════════════════════════════════
  // MODAL — Captura de leads + integração WhatsApp
  // ══════════════════════════════════════════════════════════════
  const Modal = {
    overlay: null,
    form: null,

    init() {
      this.overlay = document.getElementById('modal-overlay');
      this.form    = document.getElementById('modal-form');

      // Gatilhos de abertura
      document.querySelectorAll('.js-open-modal').forEach(el => {
        el.addEventListener('click', () => this.open());
      });

      // Fechamento
      document.getElementById('modal-close').addEventListener('click', () => this.close());
      document.getElementById('modal-close-success').addEventListener('click', () => this.close());
      this.overlay.addEventListener('click', e => {
        if (e.target === this.overlay) this.close();
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !this.overlay.hidden) this.close();
      });

      // Submit
      this.form.addEventListener('submit', e => {
        e.preventDefault();
        this._submit();
      });

      // Máscara de telefone
      document.getElementById('f-whatsapp').addEventListener('input', e => {
        e.target.value = this._maskPhone(e.target.value);
      });

      // Limpar erro ao digitar
      this.form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => this._clearError(field));
      });
    },

    open() {
      this.overlay.hidden = false;
      // Aguarda o frame para a transição ser aplicada
      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.overlay.classList.add('active'));
      });
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('f-nome').focus(), 80);
    },

    close() {
      this.overlay.classList.remove('active');
      this.overlay.addEventListener('transitionend', () => {
        this.overlay.hidden = true;
        document.body.style.overflow = '';
        this._resetPanels();
      }, { once: true });
    },

    _maskPhone(value) {
      const digits = value.replace(/\D/g, '').substring(0, 11);
      if (digits.length > 6)  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
      if (digits.length > 2)  return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
      if (digits.length > 0)  return `(${digits}`;
      return digits;
    },

    _clearError(field) {
      field.classList.remove('input-err');
      const errId = field.id.replace('f-', 'err-');
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
    },

    _validate() {
      const rules = [
        {
          id: 'f-nome',
          errId: 'err-nome',
          test: v => v.trim().length >= 3,
          msg: 'Informe seu nome completo.'
        },
        {
          id: 'f-whatsapp',
          errId: 'err-whatsapp',
          test: v => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v),
          msg: 'Informe um WhatsApp válido: (11) 9966-75266.'
        },
        {
          id: 'f-pet',
          errId: 'err-pet',
          test: v => v.trim().length >= 2,
          msg: 'Informe o nome do seu pet.'
        },
        {
          id: 'f-especie',
          errId: 'err-especie',
          test: v => v !== '',
          msg: 'Selecione a espécie do pet.'
        },
      ];

      let valid = true;
      rules.forEach(({ id, errId, test, msg }) => {
        const field = document.getElementById(id);
        const errEl = document.getElementById(errId);
        if (!test(field.value)) {
          errEl.textContent = msg;
          field.classList.add('input-err');
          valid = false;
        } else {
          errEl.textContent = '';
          field.classList.remove('input-err');
        }
      });

      // Foca no primeiro campo com erro
      if (!valid) {
        const firstErr = this.form.querySelector('.input-err');
        if (firstErr) firstErr.focus();
      }

      return valid;
    },

    _submit() {
      if (!this._validate()) return;

      const nome    = document.getElementById('f-nome').value.trim();
      const wa      = document.getElementById('f-whatsapp').value.trim();
      const pet     = document.getElementById('f-pet').value.trim();
      const especie = document.getElementById('f-especie').value;
      const sintoma = document.getElementById('f-sintoma').value.trim();

      const linhas = [
        'Olá! Gostaria de agendar uma consulta na *Vet Viajante*.',
        `👤 *Tutor:* ${nome}`,
        `🐾 *Pet:* ${pet} (${especie})`,
        `📱 *WhatsApp:* ${wa}`,
        sintoma ? `📝 *Motivo:* ${sintoma}` : null
      ].filter(Boolean);

      const mensagem = linhas.join('\n');
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');

      this._showSuccess(nome, pet);
    },

    _showSuccess(nome, pet) {
      const primeiroNome = nome.split(' ')[0];
      document.getElementById('success-title').textContent = `Perfeito, ${primeiroNome}!`;
      document.getElementById('success-msg').innerHTML =
        `Abrimos o WhatsApp com a mensagem pronta sobre o <strong>${pet}</strong>. Finalize o envio e aguarde nosso retorno em instantes.`;

      document.getElementById('modal-form-panel').hidden    = true;
      document.getElementById('modal-success-panel').hidden = false;
    },

    _resetPanels() {
      document.getElementById('modal-form-panel').hidden    = false;
      document.getElementById('modal-success-panel').hidden = true;
      this.form.reset();
      this.form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      this.form.querySelectorAll('.input-err').forEach(el  => el.classList.remove('input-err'));
    }
  };

  // ══════════════════════════════════════════════════════════════
  // SCROLL REVEAL — IntersectionObserver com fade-in + slide
  // ══════════════════════════════════════════════════════════════
  const ScrollReveal = {
    init() {
      const elements = document.querySelectorAll('.reveal');

      if (!('IntersectionObserver' in window)) {
        // Fallback: exibe tudo imediatamente
        elements.forEach(el => el.classList.add('visible'));
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      elements.forEach(el => observer.observe(el));
    }
  };

  // ══════════════════════════════════════════════════════════════
  // SMOOTH SCROLL — links de âncora com scroll suave
  // ══════════════════════════════════════════════════════════════
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
          const href = link.getAttribute('href');
          if (href === '#') return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          const headerH = document.querySelector('.hd').offsetHeight;
          const top     = target.getBoundingClientRect().top + window.scrollY - headerH;
          window.scrollTo({ top, behavior: 'smooth' });
          Nav.close();
        });
      });
    }
  };

  // ══════════════════════════════════════════════════════════════
  // NAV — menu mobile hamburger
  // ══════════════════════════════════════════════════════════════
  const Nav = {
    init() {
      const btn = document.getElementById('hd-hamburger');
      if (!btn) return;
      btn.addEventListener('click', () => this._toggle());
    },

    _toggle() {
      const nav = document.getElementById('hd-nav');
      const btn = document.getElementById('hd-hamburger');
      const open = nav.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    },

    close() {
      const nav = document.getElementById('hd-nav');
      const btn = document.getElementById('hd-hamburger');
      if (!nav) return;
      nav.classList.remove('open');
      if (btn) {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  };

  // ══════════════════════════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════════════════════════
  function init() {
    FAQ.init();
    Modal.init();
    ScrollReveal.init();
    SmoothScroll.init();
    Nav.init();
  }

  return {
    init
  };
})();

document.addEventListener('DOMContentLoaded', VetViajante.init);
