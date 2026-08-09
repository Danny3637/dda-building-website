/* DDA Building LTD — shared behaviour.
   Progressive enhancement only: every page works with JS disabled. */
(function () {
  'use strict';

  /* --- Mobile navigation ------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    // Close the menu when a link is used or the viewport grows past the breakpoint.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* --- Current year in the footer --------------------------------------- */
  function initYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* --- Project filtering ------------------------------------------------- */
  function initProjectFilters() {
    var filters = document.querySelectorAll('.filter');
    var projects = document.querySelectorAll('[data-sector]');
    var empty = document.querySelector('.no-results');
    if (!filters.length || !projects.length) return;

    function apply(sector) {
      var shown = 0;
      projects.forEach(function (card) {
        var match = sector === 'all' || card.dataset.sector === sector;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    }

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        apply(btn.dataset.filter);
      });
    });
  }

  /* --- Contact form validation ------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById('enquiry-form');
    if (!form) return;

    var status = document.getElementById('form-status');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function errorFor(field) {
      return document.getElementById(field.id + '-error');
    }

    function validate(field) {
      var value = field.value.trim();
      var message = '';

      if (field.required && !value && field.type !== 'checkbox') {
        message = 'This field is required.';
      } else if (field.required && field.type === 'checkbox' && !field.checked) {
        message = 'Please confirm before sending.';
      } else if (field.type === 'email' && value && !emailPattern.test(value)) {
        message = 'Enter a valid email address, e.g. name@company.com';
      } else if (field.id === 'message' && value && value.length < 20) {
        message = 'Please give us a little more detail (20 characters minimum).';
      }

      var slot = errorFor(field);
      if (slot) slot.textContent = message;
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    }

    var fields = Array.prototype.slice.call(
      form.querySelectorAll('input, select, textarea')
    ).filter(function (f) { return f.type !== 'hidden'; });

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validate(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validate(field);
      });
    });

    var submitBtn = form.querySelector('button[type="submit"]');

    function resetFieldState() {
      fields.forEach(function (field) {
        field.setAttribute('aria-invalid', 'false');
        var slot = errorFor(field);
        if (slot) slot.textContent = '';
      });
    }

    function showStatus(message, isError) {
      if (!status) return;
      status.textContent = message;
      status.hidden = false;
      status.classList.toggle('form-status--error', !!isError);
      status.scrollIntoView({ block: 'center' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;

      fields.forEach(function (field) {
        if (!validate(field) && !firstBad) firstBad = field;
      });

      if (firstBad) {
        if (status) status.hidden = true;
        firstBad.focus();
        return;
      }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Submission failed');
          showStatus('Thanks — your enquiry has been received. A member of the estimating team will reply within one business day.', false);
          form.reset();
          resetFieldState();
        })
        .catch(function () {
          showStatus('Something went wrong sending that — please call or email us directly instead.', true);
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send enquiry'; }
        });
    });
  }

  /* --- Boot -------------------------------------------------------------- */
  function init() {
    initNav();
    initYear();
    initProjectFilters();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
