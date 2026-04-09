/**
 * Maison Élixir – script.js
 * Handles: sticky nav, hamburger menu, scroll reveal,
 *          active nav link, contact & newsletter forms
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. Sticky navbar – add .scrolled class after 40 px scroll
     ------------------------------------------------------------------ */
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load

  /* ------------------------------------------------------------------
     2. Hamburger menu
     ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on nav link click (mobile)
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close when clicking outside the nav on mobile
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ------------------------------------------------------------------
     3. Active navigation link (highlight current section)
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    const scrollY = window.scrollY;
    let current = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navAnchorLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink(); // run once on load

  /* ------------------------------------------------------------------
     4. Scroll Reveal – Intersection Observer
     ------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ------------------------------------------------------------------
     5. Staggered reveal for product / testimonial cards
     ------------------------------------------------------------------ */
  function addStaggerDelay(selector, delayStep) {
    var cards = document.querySelectorAll(selector);
    cards.forEach(function (card, index) {
      card.style.transitionDelay = (index * delayStep) + 's';
    });
  }

  addStaggerDelay('.product-card',     0.07);
  addStaggerDelay('.testimonial-card', 0.10);
  addStaggerDelay('.stat-item',        0.10);

  /* ------------------------------------------------------------------
     6. Contact form – client-side feedback (no real submission)
     ------------------------------------------------------------------ */
  var contactForm   = document.getElementById('contactForm');
  var formSuccess   = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = contactForm.querySelector('#contactName').value.trim();
      var email   = contactForm.querySelector('#contactEmail').value.trim();
      var message = contactForm.querySelector('#contactMessage').value.trim();

      if (!name || !email || !message) {
        formSuccess.textContent = 'Veuillez remplir tous les champs.';
        formSuccess.style.color = '#FF6B6B';
        return;
      }

      if (!isValidEmail(email)) {
        formSuccess.textContent = 'Veuillez entrer une adresse e-mail valide.';
        formSuccess.style.color = '#FF6B6B';
        return;
      }

      // Simulate success
      formSuccess.textContent = 'Merci ' + name + ' ! Votre message a bien été envoyé. Nous vous répondrons sous 24h.';
      formSuccess.style.color = '#7CEFB0';
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     7. Newsletter form
     ------------------------------------------------------------------ */
  var newsletterForm    = document.getElementById('newsletterForm');
  var newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var emailInput = newsletterForm.querySelector('input[type="email"]');
      var email      = emailInput ? emailInput.value.trim() : '';

      if (!email || !isValidEmail(email)) {
        newsletterSuccess.textContent = 'Adresse e-mail invalide.';
        newsletterSuccess.style.color = '#FF6B6B';
        return;
      }

      newsletterSuccess.textContent = 'Bienvenue dans la Maison ! Vous êtes bien inscrit(e).';
      newsletterSuccess.style.color = '#7CEFB0';
      newsletterForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     8. "Ajouter au panier" button feedback
     ------------------------------------------------------------------ */
  document.querySelectorAll('.product-card .btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var originalText = btn.textContent;
      btn.textContent = '✓ Ajouté !';
      btn.style.background    = 'rgba(124, 239, 176, 0.15)';
      btn.style.borderColor   = 'rgba(124, 239, 176, 0.50)';
      btn.style.color         = '#7CEFB0';

      setTimeout(function () {
        btn.textContent         = originalText;
        btn.style.background    = '';
        btn.style.borderColor   = '';
        btn.style.color         = '';
      }, 1800);
    });
  });

  /* ------------------------------------------------------------------
     9. Utility: simple email validation
     ------------------------------------------------------------------ */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

})();
