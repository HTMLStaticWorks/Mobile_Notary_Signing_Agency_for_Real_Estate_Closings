/* ═══════════════════════════════════════════════════════
   SignSure Mobile Notary — Dashboard JavaScript
   Handles: Sidebar, Panels, Dashboard-specific interactions
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
  initDashboardNav();
  initDashboardTheme();
  initDashboardRTL();
});

// ═══════════════════════════════════════════════════════
// SIDEBAR TOGGLE (Mobile)
// ═══════════════════════════════════════════════════════
function initDashboardSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.dashboard__sidebar');

  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 &&
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });
}

// ═══════════════════════════════════════════════════════
// DASHBOARD NAV
// ═══════════════════════════════════════════════════════
function initDashboardNav() {
  const navLinks = document.querySelectorAll('.dashboard__nav-link[data-panel]');
  const panels = document.querySelectorAll('.dashboard__content-panel');

  if (!navLinks.length || !panels.length) return;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetPanel = link.getAttribute('data-panel');

      // Update active nav
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show target panel
      panels.forEach(panel => {
        panel.style.display = panel.id === targetPanel ? 'block' : 'none';
      });

      // Update header title
      const headerTitle = document.querySelector('.dashboard__header h1');
      if (headerTitle) {
        headerTitle.textContent = link.textContent.trim();
      }

      // Close sidebar on mobile
      if (window.innerWidth <= 1024) {
        document.querySelector('.dashboard__sidebar').classList.remove('active');
      }
    });
  });
}

// ═══════════════════════════════════════════════════════
// DASHBOARD THEME
// ═══════════════════════════════════════════════════════
function initDashboardTheme() {
  const savedTheme = localStorage.getItem('signsure-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateDashThemeIcon(theme);

  const toggle = document.getElementById('dashboard-theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('signsure-theme', next);
      updateDashThemeIcon(next);
    });
  }
}

function updateDashThemeIcon(theme) {
  const icons = document.querySelectorAll('.dash-theme-icon');
  icons.forEach(icon => {
    icon.className = theme === 'dark'
      ? 'ri-sun-line dash-theme-icon'
      : 'ri-moon-line dash-theme-icon';
  });
}

// ═══════════════════════════════════════════════════════
// DASHBOARD RTL
// ═══════════════════════════════════════════════════════
function initDashboardRTL() {
  const savedDir = localStorage.getItem('signsure-dir');
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  const toggle = document.getElementById('dashboard-rtl-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir');
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('signsure-dir', next);
    });
  }
}
