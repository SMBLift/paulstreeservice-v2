/* ===== Paul's Tree Service — Main JS ===== */

(function () {
  'use strict';

  /* --- Mobile menu --- */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-backdrop');
  const drawer = document.getElementById('mobile-drawer');

  function openMenu() {
    mobileMenu.classList.remove('invisible');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () {
      backdrop.style.opacity = '1';
      drawer.style.transform = 'translateX(0)';
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    backdrop.style.opacity = '0';
    drawer.style.transform = 'translateX(100%)';
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      mobileMenu.classList.add('invisible');
    }, 300);
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  /* --- Mobile services accordion --- */
  const servicesToggle = document.getElementById('mobile-services-toggle');
  const servicesList = document.getElementById('mobile-services-list');

  if (servicesToggle && servicesList) {
    servicesToggle.addEventListener('click', function () {
      var expanded = servicesToggle.getAttribute('aria-expanded') === 'true';
      servicesToggle.setAttribute('aria-expanded', String(!expanded));
      servicesList.classList.toggle('hidden');
      var chevron = servicesToggle.querySelector('svg');
      if (chevron) {
        chevron.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  }

  /* --- Scroll-triggered fade-in (only for content below the fold) --- */
  var fadeEls = document.querySelectorAll('.fade-in-up');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });
    fadeEls.forEach(function (el) { observer.observe(el); });
  }

  /* --- Form handling (only runs on pages with contact-form) --- */
  var contactForm = document.getElementById('contact-form');
  var timestampField = document.getElementById('form-timestamp');

  if (timestampField) {
    timestampField.value = Date.now();
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var form = e.target;
      var data = Object.fromEntries(new FormData(form));

      // Honeypot check
      if (data._honeypot) return;

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        var res = await fetch('WORKER_URL', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          form.reset();
          var msg = document.getElementById('form-success');
          if (msg) {
            msg.classList.remove('hidden');
            msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          // Clean URL params
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        alert('Something went wrong. Please call us directly at (412) 881-0946.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    });
  }
})();
