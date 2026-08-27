// Antigravity Removals — shared behaviour

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Gravity toggle (signature interaction) ---------- */
  var gravityToggle = document.querySelector('.gravity-toggle');
  var GRAVITY_KEY = 'antigravity-removals-gravity-state';

  function applyGravityState(isOff) {
    document.body.classList.toggle('gravity-off', isOff);
    if (gravityToggle) {
      gravityToggle.querySelector('.state-label').textContent = isOff ? 'Gravity: OFF' : 'Gravity: ON';
      gravityToggle.setAttribute('aria-pressed', isOff ? 'true' : 'false');
    }
  }

  var savedState = null;
  try { savedState = window.localStorage.getItem(GRAVITY_KEY); } catch (e) { /* storage unavailable, ignore */ }
  applyGravityState(savedState === 'off');

  if (gravityToggle) {
    gravityToggle.addEventListener('click', function () {
      var nowOff = !document.body.classList.contains('gravity-off');
      applyGravityState(nowOff);
      try { window.localStorage.setItem(GRAVITY_KEY, nowOff ? 'off' : 'on'); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var button = item.querySelector('button');
    var panel = item.querySelector('.accordion-panel');
    if (!button || !panel) return;

    button.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      // close all other items in the same accordion
      var group = item.closest('.accordion');
      if (group) {
        group.querySelectorAll('.accordion-item').forEach(function (other) {
          if (other !== item) {
            other.setAttribute('data-open', 'false');
            other.querySelector('button').setAttribute('aria-expanded', 'false');
            other.querySelector('.accordion-panel').style.maxHeight = null;
          }
        });
      }
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
      button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------- Contact form (placeholder submit handling) ---------- */
  var quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = quoteForm.querySelector('.form-status');
      if (status) {
        status.textContent = "Thanks — this form isn't connected to an inbox yet. Hook it up to Formspree, Netlify Forms, or your own backend so enquiries actually reach you.";
        status.classList.add('visible');
      }
    });
  }

});
