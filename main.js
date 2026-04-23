/**
 * Vet Viajante — main.js
 * Módulos: FAQ, Modal, Calculator, ScrollReveal, SmoothScroll, Nav
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
  // CALCULADORA NUTRICIONAL — NER = 70 × peso^0,75
  // ══════════════════════════════════════════════════════════════
  const Calculator = {
    init() {
      const btn   = document.getElementById('calc-btn');
      const input = document.getElementById('calc-peso');

      btn.addEventListener('click', () => this._calculate());
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this._calculate();
      });
    },

    _calculate() {
      const rawValue = document.getElementById('calc-peso').value.trim().replace(',', '.');
      const peso     = parseFloat(rawValue);
      const especie  = document.getElementById('calc-especie').value;
      const resultEl = document.getElementById('calc-result');

      if (!rawValue || isNaN(peso) || peso <= 0 || peso > 25) {
        resultEl.innerHTML = `<p class="calc-err">⚠️ Informe um peso entre 0,1 e 25 kg.</p>`;
        return;
      }

      const ner           = Math.round(70 * Math.pow(peso, 0.75));
      const label         = especie === 'cao' ? 'cão' : 'gato';
      const pesoFormatado = rawValue.replace('.', ',');

      resultEl.innerHTML = `
        <div class="calc-output">
          <div class="calc-num">${ner} <span>kcal/dia</span></div>
          <p>
            Necessidade Energética de Repouso (NER) estimada para um <strong>${label}</strong>
            de <strong>${pesoFormatado} kg</strong>.
          </p>
          <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Olá! Calculei o NER do meu ${label} de ${pesoFormatado} kg: ${ner} kcal/dia. Gostaria de um plano alimentar personalizado na *Vet Viajante*.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="margin-top:14px">
            Quero um plano personalizado
          </a>
        </div>
      `;
    }
  };

  // ══════════════════════════════════════════════════════════════
  // GOOGLE REVIEWS — últimas avaliações do Google Meu Negócio
  // ══════════════════════════════════════════════════════════════
  const GoogleReviews = {
    root: null,
    viewport: null,
    track: null,
    status: null,
    dots: null,
    prevBtn: null,
    nextBtn: null,

    init() {
      this.root     = document.getElementById('google-reviews');
      this.viewport = document.getElementById('reviews-viewport');
      this.track    = document.getElementById('reviews-track');
      this.status   = document.getElementById('reviews-status');
      this.dots     = document.getElementById('reviews-dots');
      this.prevBtn  = document.getElementById('reviews-prev');
      this.nextBtn  = document.getElementById('reviews-next');

      if (!this.root) return;

      this.prevBtn.addEventListener('click', () => this._scrollToPage(this._currentPage() - 1));
      this.nextBtn.addEventListener('click', () => this._scrollToPage(this._currentPage() + 1));
      this.viewport.addEventListener('scroll', () => this._updateControls(), { passive: true });
      window.addEventListener('resize', () => this._buildDots());

      this._setStatus('Carregando avaliações do Google...');

      if (window.google && window.google.maps) {
        this.load();
      }
    },

    async load() {
      if (!this.root) return;

      const config = window.GOOGLE_REVIEWS_CONFIG || {};
      const apiKeyMissing = !config.apiKey || config.apiKey === 'API_KEY';
      const placeIdMissing = !config.placeId || config.placeId === 'PLACE_ID';

      if (apiKeyMissing || placeIdMissing) {
        this._setStatus('Insira sua API_KEY e seu PLACE_ID em index.html para carregar as avaliações.');
        return;
      }

      if (!(window.google && window.google.maps)) {
        this._setStatus('Não foi possível carregar a API do Google Maps. Verifique sua chave e tente novamente.', true);
        return;
      }

      try {
        const { Place } = await google.maps.importLibrary('places');
        const place = new Place({
          id: config.placeId,
          requestedLanguage: config.language || 'pt-BR',
          requestedRegion: config.region || 'BR'
        });

        await place.fetchFields({
          fields: ['displayName', 'reviews', 'googleMapsURI']
        });

        const reviews = (place.reviews || [])
          .slice()
          .sort((a, b) => new Date(b.publishTime || 0) - new Date(a.publishTime || 0))
          .slice(0, config.maxReviews || 5);

        if (!reviews.length) {
          this._setStatus('Esse perfil ainda não tem avaliações públicas disponíveis para exibição.');
          return;
        }

        this._render(reviews, place);
      } catch (error) {
        console.error('Erro ao buscar avaliações do Google:', error);
        this._setStatus('Não conseguimos carregar as avaliações agora. Confira a API_KEY, o PLACE_ID e se a Places API está habilitada no Google Cloud.', true);
      }
    },

    handleApiFailure() {
      if (!this.root) return;
      this._setStatus('Falha na autenticação da Google Maps API. Revise a restrição da chave, o faturamento e os domínios autorizados.', true);
    },

    _render(reviews, place) {
      this.track.innerHTML = reviews.map(review => this._reviewCard(review, place)).join('');
      this.status.hidden = true;
      this.viewport.hidden = false;
      this._buildDots();
      this._updateControls();
    },

    _reviewCard(review, place) {
      const author = review.authorAttribution || {};
      const authorName = this._escapeHtml(author.displayName || 'Cliente verificado');
      const authorLink = author.uri || place.googleMapsURI || '#';
      const reviewText = this._escapeHtml(review.text || 'Avaliação sem comentário de texto.');
      const reviewDate = this._formatDate(review.publishTime);
      const avatar = author.photoURI
        ? `<img class="g-review-avatar" src="${author.photoURI}" alt="Foto de perfil de ${authorName}" loading="lazy" referrerpolicy="no-referrer" />`
        : `<div class="g-review-avatar" aria-hidden="true">${this._initials(author.displayName || 'Cliente')}</div>`;

      return `
        <article class="g-review-card">
          <div class="g-review-head">
            ${avatar}
            <div class="g-review-author">
              <strong><a href="${authorLink}" target="_blank" rel="noopener noreferrer">${authorName}</a></strong>
              <span class="g-review-date">${reviewDate}</span>
            </div>
          </div>
          <div class="g-review-stars" aria-label="Nota ${review.rating || 0} de 5 estrelas">
            ${this._stars(review.rating || 0)}
          </div>
          <p class="g-review-text">${reviewText}</p>
        </article>
      `;
    },

    _stars(rating) {
      const starPath = 'M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z';
      return Array.from({ length: 5 }, (_, index) => {
        const active = index < Math.round(rating);
        const color = active ? 'var(--go)' : 'rgba(74,122,131,.22)';
        return `<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:${color}"><path d="${starPath}"></path></svg>`;
      }).join('');
    },

    _buildDots() {
      if (this.viewport.hidden) return;

      const totalPages = Math.max(1, Math.ceil(this.track.children.length / this._cardsPerView()));
      this.dots.innerHTML = '';

      if (totalPages <= 1) {
        this.dots.hidden = true;
        this._updateControls();
        return;
      }

      this.dots.hidden = false;

      for (let i = 0; i < totalPages; i += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'g-reviews-dot';
        dot.setAttribute('aria-label', `Ir para o grupo de avaliações ${i + 1}`);
        dot.addEventListener('click', () => this._scrollToPage(i));
        this.dots.appendChild(dot);
      }

      this._updateControls();
    },

    _scrollToPage(pageIndex) {
      const maxPage = Math.max(0, this.dots.children.length - 1);
      const targetPage = Math.min(Math.max(pageIndex, 0), maxPage);
      this.viewport.scrollTo({
        left: targetPage * this.viewport.clientWidth,
        behavior: 'smooth'
      });
    },

    _currentPage() {
      if (!this.viewport || !this.viewport.clientWidth) return 0;
      return Math.round(this.viewport.scrollLeft / this.viewport.clientWidth);
    },

    _cardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    },

    _updateControls() {
      if (!this.viewport || !this.prevBtn || !this.nextBtn) return;

      const currentPage = this._currentPage();
      const lastPage = Math.max(0, this.dots.children.length - 1);

      this.prevBtn.disabled = currentPage <= 0;
      this.nextBtn.disabled = currentPage >= lastPage;

      Array.from(this.dots.children).forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPage);
      });
    },

    _setStatus(message, isError = false) {
      this.status.hidden = false;
      this.viewport.hidden = true;
      this.dots.hidden = true;
      this.status.textContent = message;
      this.status.style.color = isError ? '#c0392b' : 'var(--mu)';
      this.status.style.borderColor = isError ? 'rgba(192,57,43,.18)' : 'rgba(14,125,143,.08)';
      this.status.style.background = 'rgba(255,255,255,.82)';
    },

    _formatDate(value) {
      const date = value ? new Date(value) : null;
      if (!date || Number.isNaN(date.getTime())) return 'Data indisponível';
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    },

    _initials(name) {
      return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join('');
    },

    _escapeHtml(value) {
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
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
    Calculator.init();
    GoogleReviews.init();
    ScrollReveal.init();
    SmoothScroll.init();
    Nav.init();
  }

  return {
    init,
    initGoogleReviews: () => GoogleReviews.load(),
    handleGoogleReviewsError: () => GoogleReviews.handleApiFailure()
  };
})();

document.addEventListener('DOMContentLoaded', VetViajante.init);
window.initGoogleReviewsCarousel = () => VetViajante.initGoogleReviews();
window.googleMapsAuthFailure = () => VetViajante.handleGoogleReviewsError();
