/**
 * SlimScroll - Micro-framework d'animations au scroll
 * @version 1.0.0
 * @license MIT
 */
(function() {
  'use strict';

  // Configuration par défaut
  const defaults = {
    threshold: 0.1,
    rootMargin: '0px',
    delay: 0,
    mode: 'normal', // 'normal', 'moderate', 'spectacular'
    stagger: 0.1,
    disableOnMobile: false,
    mobileBreakpoint: 768,
    once: true
  };

  class SlimScroll {
    constructor(options = {}) {
      this.config = { ...defaults, ...options };
      this.elements = [];
      this.observer = null;
      this.animatedElements = new Set();
      this.init();
    }

    init() {
      // Vérifier si on est sur mobile et si désactivé
      if (this.config.disableOnMobile && window.innerWidth <= this.config.mobileBreakpoint) {
        this.activateAll(); // Tout afficher sans animation
        return;
      }

      // Récupérer tous les éléments avec data-slim
      this.elements = Array.from(document.querySelectorAll('[data-slim]'));

      if (!this.elements.length) return;

      // Préparer les éléments
      this.prepareElements();

      // Créer l'IntersectionObserver
      this.createObserver();

      // Observer les éléments
      this.observeElements();

      // Gérer le redimensionnement
      this.handleResize();
    }

    prepareElements() {
      this.elements.forEach(element => {
        // Ajouter la classe de base
        element.classList.add('slim-element');

        // Déterminer l'animation
        const animation = element.getAttribute('data-slim') || 'fade';
        element.classList.add(`slim-${animation}`);

        // Appliquer le mode
        const mode = element.getAttribute('data-slim-mode') || this.config.mode;
        if (mode !== 'normal') {
          element.classList.add(`slim-${mode}`);
        }

        // Appliquer le délai personnalisé
        const delay = element.getAttribute('data-slim-delay') || this.config.delay;
        if (delay && delay > 0) {
          element.style.transitionDelay = `${delay}ms`;
        }

        // Appliquer la durée personnalisée
        const duration = element.getAttribute('data-slim-duration');
        if (duration) {
          element.style.setProperty('--slim-duration', `${duration}ms`);
        }

        // Gestion du stagger (décalage entre éléments enfants)
        if (element.hasAttribute('data-slim-stagger')) {
          element.classList.add('slim-stagger');
          const staggerDelay = element.getAttribute('data-slim-stagger-delay') || this.config.stagger;

          // Appliquer un délai progressif aux enfants
          Array.from(element.children).forEach((child, index) => {
            child.style.transitionDelay = `${index * staggerDelay * 1000}ms`;
          });
        }
      });
    }

    createObserver() {
      const threshold = parseFloat(this.config.threshold);
      const rootMargin = this.config.rootMargin;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const element = entry.target;

            if (entry.isIntersecting) {
              this.animateIn(element);

              // Si once est vrai, on arrête d'observer après l'animation
              if (this.config.once) {
                this.observer.unobserve(element);
              }
            } else if (!this.config.once) {
              this.animateOut(element);
            }
          });
        },
        { threshold, rootMargin }
      );
    }

    observeElements() {
      this.elements.forEach(element => {
        this.observer.observe(element);
      });
    }

    animateIn(element) {
      // Éviter les animations en double
      if (this.animatedElements.has(element) && this.config.once) return;

      this.animatedElements.add(element);

      // Forcer un reflow pour déclencher la transition
      void element.offsetWidth;

      // Ajouter la classe visible
      element.classList.add('slim-visible');

      // Déclencher un événement personnalisé
      const event = new CustomEvent('slim:in', { detail: { element } });
      element.dispatchEvent(event);
    }

    animateOut(element) {
      // Supprimer la classe visible
      element.classList.remove('slim-visible');

      // Déclencher un événement personnalisé
      const event = new CustomEvent('slim:out', { detail: { element } });
      element.dispatchEvent(event);
    }

    activateAll() {
      this.elements.forEach(element => {
        element.classList.add('slim-visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
      });
    }

    handleResize() {
      let resizeTimeout;

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
          if (this.config.disableOnMobile && window.innerWidth <= this.config.mobileBreakpoint) {
            this.activateAll();
          }
        }, 250);
      });
    }

    // Méthodes publiques
    refresh() {
      // Réinitialiser et réobserver les éléments
      this.observer.disconnect();
      this.elements = Array.from(document.querySelectorAll('[data-slim]'));
      this.animatedElements.clear();
      this.prepareElements();
      this.observeElements();
    }

    add(element, options = {}) {
      if (!element) return;

      // Préparer l'élément
      element.setAttribute('data-slim', options.animation || 'fade');

      if (options.mode) {
        element.setAttribute('data-slim-mode', options.mode);
      }

      if (options.delay) {
        element.setAttribute('data-slim-delay', options.delay);
      }

      // Ajouter aux éléments et observer
      this.elements.push(element);
      this.prepareElement(element);
      this.observer.observe(element);
    }

    prepareElement(element) {
      // Même logique que prepareElements mais pour un seul élément
      element.classList.add('slim-element');

      const animation = element.getAttribute('data-slim') || 'fade';
      element.classList.add(`slim-${animation}`);

      const mode = element.getAttribute('data-slim-mode') || this.config.mode;
      if (mode !== 'normal') {
        element.classList.add(`slim-${mode}`);
      }

      const delay = element.getAttribute('data-slim-delay') || this.config.delay;
      if (delay && delay > 0) {
        element.style.transitionDelay = `${delay}ms`;
      }

      const duration = element.getAttribute('data-slim-duration');
      if (duration) {
        element.style.setProperty('--slim-duration', `${duration}ms`);
      }
    }

    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }

      // Réinitialiser les éléments
      this.elements.forEach(element => {
        element.classList.remove('slim-element', 'slim-visible');
        const animation = element.getAttribute('data-slim');
        if (animation) {
          element.classList.remove(`slim-${animation}`);
        }
        element.style.transitionDelay = '';
        element.style.setProperty('--slim-duration', '');
      });

      this.elements = [];
      this.animatedElements.clear();
    }
  }

  // Exposer SlimScroll globalement
  window.SlimScroll = SlimScroll;

  // Initialisation automatique si data-slim-auto est présent
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-slim]') && !window.slimScrollInstance) {
      const autoConfig = {};

      // Lire les options depuis data-slim-config
      const configElement = document.querySelector('[data-slim-config]');
      if (configElement) {
        try {
          Object.assign(autoConfig, JSON.parse(configElement.textContent));
        } catch (e) {
          console.warn('SlimScroll: Configuration invalide', e);
        }
      }

      window.slimScrollInstance = new SlimScroll(autoConfig);
    }
  });
})();
