/* ═══════════════════════════════════════════════════════
   SignSure Mobile Notary — Main JavaScript
   Handles: Navigation, Theme, RTL, Animations, Forms
   ═══════════════════════════════════════════════════════ */

'use strict';

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initBackToTop();
  initScrollReveal();
  initLazyImages();
  initTestimonialCarousel();
  initCountdown();
  initFormValidation();
});

// ═══════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════
function initTheme() {
  const savedTheme = localStorage.getItem('signsure-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcons(theme);

  // Desktop toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Drawer toggle
  const drawerThemeToggle = document.getElementById('drawer-theme-toggle');
  if (drawerThemeToggle) {
    drawerThemeToggle.addEventListener('click', toggleTheme);
  }


}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('signsure-theme', next);
  updateThemeIcons(next);
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    icon.className = theme === 'dark'
      ? 'ri-sun-line theme-icon'
      : 'ri-moon-line theme-icon';
  });
}

// ═══════════════════════════════════════════════════════
// RTL TOGGLE
// ═══════════════════════════════════════════════════════
function initRTL() {
  const savedDir = localStorage.getItem('signsure-dir');
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  const rtlToggle = document.getElementById('rtl-toggle');
  if (rtlToggle) {
    rtlToggle.addEventListener('click', toggleRTL);
  }

  const drawerRtlToggle = document.getElementById('drawer-rtl-toggle');
  if (drawerRtlToggle) {
    drawerRtlToggle.addEventListener('click', toggleRTL);
  }


}

function toggleRTL() {
  const current = document.documentElement.getAttribute('dir');
  const next = current === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', next);
  localStorage.setItem('signsure-dir', next);
}

// ═══════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn = document.getElementById('drawer-close');

  // Scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Check on load
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
  }

  // Hamburger toggle
  if (hamburger && drawer && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      drawer.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
    });

    overlay.addEventListener('click', closeDrawer);

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  function closeDrawer() {
    hamburger.classList.remove('active');
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ═══════════════════════════════════════════════════════
// SCROLL REVEAL ANIMATION
// ═══════════════════════════════════════════════════════
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════
// LAZY IMAGES
// ═══════════════════════════════════════════════════════
function initLazyImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded'));
    }
  });

  // Also handle eagerly loaded images
  const allImages = document.querySelectorAll('img:not([loading="lazy"])');
  allImages.forEach(img => {
    img.classList.add('loaded');
  });
}

// ═══════════════════════════════════════════════════════
// TESTIMONIAL CAROUSEL
// ═══════════════════════════════════════════════════════
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const slides = track.querySelectorAll('.testimonial-slide');
  const totalSlides = slides.length;

  function getSlidesPerView() {
    if (window.innerWidth >= 1025) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function updateCarousel() {
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, totalSlides - slidesPerView);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    const percentage = -(currentIndex * (100 / slidesPerView));
    track.style.transform = `translateX(${percentage}%)`;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    const slidesPerView = getSlidesPerView();
    const maxIndex = totalSlides - slidesPerView;
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Handle RTL
  const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
  if (isRtl) {
    track.style.direction = 'rtl';
  }

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

// ═══════════════════════════════════════════════════════
// COUNTDOWN TIMER
// ═══════════════════════════════════════════════════════
function initCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  // Set target to 30 days from now
  const target = new Date();
  target.setDate(target.getDate() + 30);

  function update() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ═══════════════════════════════════════════════════════
// FORM VALIDATION
// ═══════════════════════════════════════════════════════
function initFormValidation() {
  const forms = document.querySelectorAll('[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        showFormSuccess(form);
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('.form__input, .form__textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });
  });
}

function validateForm(form) {
  const fields = form.querySelectorAll('.form__input, .form__textarea');
  let isValid = true;

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  // Check checkbox
  const termsCheckbox = form.querySelector('input[name="terms"]');
  if (termsCheckbox && !termsCheckbox.checked) {
    const error = termsCheckbox.closest('.form__group').querySelector('.form__error');
    if (error) {
      error.textContent = 'You must accept the Terms & Conditions';
      error.classList.add('visible');
    }
    isValid = false;
  }

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.getAttribute('type') || field.tagName.toLowerCase();
  const required = field.hasAttribute('required');
  const errorEl = field.parentElement.querySelector('.form__error');
  let errorMsg = '';

  // Required check
  if (required && !value) {
    errorMsg = 'This field is required';
  }

  // Email validation
  if (!errorMsg && type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMsg = 'Please enter a valid email address';
    }
  }

  // Password validation
  if (!errorMsg && type === 'password' && value && field.name !== 'confirm-password') {
    if (value.length < 8) {
      errorMsg = 'Password must be at least 8 characters';
    }
  }

  // Confirm password
  if (!errorMsg && field.name === 'confirm-password' && value) {
    const passwordField = field.closest('form').querySelector('input[name="password"]');
    if (passwordField && value !== passwordField.value) {
      errorMsg = 'Passwords do not match';
    }
  }

  // Update UI
  if (errorMsg) {
    field.classList.add('error');
    field.classList.remove('success');
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add('visible');
    }
    return false;
  } else {
    field.classList.remove('error');
    if (value) field.classList.add('success');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
    return true;
  }
}

function showFormSuccess(form) {
  const successEl = form.querySelector('.form__success');
  if (successEl) {
    successEl.classList.add('visible');
    form.reset();
    form.querySelectorAll('.form__input, .form__textarea').forEach(field => {
      field.classList.remove('success', 'error');
    });
    setTimeout(() => {
      successEl.classList.remove('visible');
    }, 5000);
  }
}

// ═══════════════════════════════════════════════════════
// BACK TO TOP BUTTON
// ═══════════════════════════════════════════════════════
function initBackToTop() {
  let btn = document.getElementById('back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '<i class="ri-arrow-up-line"></i>';
    document.body.appendChild(btn);
  }

  const toggleVisibility = () => {
    if (window.scrollY > 250) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

