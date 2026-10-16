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
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('dashboard-sidebar') || document.querySelector('.dashboard__sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!toggle || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add('active');
    if (overlay) { overlay.classList.add('active'); }
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    if (overlay) { overlay.classList.remove('active'); }
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
  });

  // Close button inside sidebar
  const closeBtn = document.getElementById('sidebar-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  // Close when overlay is clicked
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
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

      // Close sidebar on mobile (with overlay)
      if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById('dashboard-sidebar') || document.querySelector('.dashboard__sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
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
