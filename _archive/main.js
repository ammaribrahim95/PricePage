/* ============================================
   Pawstrophe Digital — Main JavaScript
   Dark/Light Toggle, Mobile Menu, Animations, FAQ
   ============================================ */

(function () {
  'use strict';

  // ---- Dark / Light Mode Toggle ----
  const THEME_KEY = 'pawstrophe-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }

  function initThemeToggle() {
    applyTheme(getPreferredTheme());

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });
  }

  // ---- Mobile Menu ----
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      var isOpen = mobileMenu.classList.contains('open');
      hamburger.querySelector('.material-symbols-outlined').textContent = isOpen ? 'close' : 'menu';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.querySelector('.material-symbols-outlined').textContent = 'menu';
      });
    });
  }

  // ---- FAQ Accordion ----
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var wasOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item').forEach(function (el) {
          el.classList.remove('open');
        });

        // Toggle clicked
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  // ---- Scroll-Triggered Animations ----
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-fade-up');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ---- Billing Toggle ----
  function initBillingToggle() {
    var toggleBtns = document.querySelectorAll('.billing-toggle button');
    var oneTimeCards = document.getElementById('onetime-cards');
    var subCards = document.getElementById('subscription-cards');

    if (!toggleBtns.length || !oneTimeCards || !subCards) return;

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        if (btn.dataset.plan === 'subscription') {
          oneTimeCards.style.display = 'none';
          subCards.style.display = 'grid';
        } else {
          oneTimeCards.style.display = 'grid';
          subCards.style.display = 'none';
        }
      });
    });
  }

  // ---- Smooth Scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---- Nav active state by page ----
  function initActiveNav() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // ---- Counter Animation ----
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.dataset.count, 10);
          var duration = 2000;
          var start = 0;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ---- Initialize All ----
  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMobileMenu();
    initFAQ();
    initScrollAnimations();
    initBillingToggle();
    initSmoothScroll();
    initActiveNav();
    initCounters();
  });
})();
