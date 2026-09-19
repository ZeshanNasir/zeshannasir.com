/**
 * main.js - Core Client Interaction Engine for zeshannasir.com
 * Zero external dependencies · Accessible · Performance-focused
 */

(function () {
  'use strict';

  // --- 1. THEME ENGINE ---
  const THEME_KEY = 'zn_site_theme';
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // If no explicit preference, follow system
    applyTheme(getSystemTheme());
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });

    // Keyboard shortcut: Press 'T' to toggle theme
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 't' || e.key === 'T') {
        themeBtn.click();
      }
    });
  }

  // Listen for OS theme changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  // --- 2. ACTIVE NAVIGATION SPY ---
  const navLinks = document.querySelectorAll('.site-nav__link');
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // --- 3. MOBILE MENU TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const siteNav = document.getElementById('site-nav');

  if (mobileToggle && siteNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('is-open')) {
          siteNav.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --- 4. CLIPBOARD COPY & TOAST NOTIFICATION ---
  const copyTriggers = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('site-toast');

  let toastTimeout = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2500);
  }

  copyTriggers.forEach((trigger) => {
    trigger.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = trigger.getAttribute('data-copy');
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied to clipboard: ${text}`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied to clipboard: ${text}`);
      }
    });
  });

  // --- 5. SMOOTH SCROLL TO TOP (CLEAN URL - ZERO HASH POLLUTION) ---
  const topTriggers = document.querySelectorAll('.site-brand, .footer-back-to-top');
  topTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.location.hash) {
          history.pushState('', document.title, window.location.pathname + window.location.search);
        }
      }
    });
  });

  // --- 6. DYNAMIC YEAR ---
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
