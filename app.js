/**
 * Emotional Support — Core App Initializer
 * Hooks up layout event listeners, mobile responsive navigation drawers, and starts the router.
 */

import { initTheme, trapFocus, showToast } from './utils.js';
import { initRouter } from './router.js';
import { initDB } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (Light / Dark)
  initTheme();
  
  // Initialize IndexedDB
  initDB().catch(err => console.error('DB failed to boot:', err));
  
  // 2. Setup Global Layout Listeners
  initCrisisBanner();
  initMobileNavigation();
  
  // 3. Launch Routing engine
  initRouter();
});

/**
 * Manages the crisis hotline alert banner at the top of the viewport.
 */
function initCrisisBanner() {
  const crisisBanner = document.querySelector('.crisis-banner');
  const closeBtn = document.querySelector('.close-crisis');
  
  if (!crisisBanner || !closeBtn) return;
  
  // Check if user has closed it in this session already
  const isDismissed = sessionStorage.getItem('crisisDismissed') === 'true';
  if (isDismissed) {
    crisisBanner.setAttribute('hidden', '');
  }
  
  closeBtn.addEventListener('click', () => {
    crisisBanner.setAttribute('hidden', '');
    sessionStorage.setItem('crisisDismissed', 'true');
    showToast('Crisis banner dismissed', 'info');
    // Readjust sticky elements spacing if necessary by triggering layout recalculations
    window.dispatchEvent(new Event('resize'));
  });
}

/**
 * Configures the mobile nav toggle hamburger menu.
 * Uses keyboard focus trapping when open to meet WCAG AA requirements.
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!toggleBtn || !navMenu) return;
  
  let untrapFocusCallback = null;

  function toggleMenu() {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    toggleBtn.setAttribute('aria-expanded', String(newState));
    navMenu.classList.toggle('open', newState);
    
    if (newState) {
      // Menu opened: trap keyboard focus
      untrapFocusCallback = trapFocus(navMenu);
      document.body.style.overflow = 'hidden'; // Lock back scroll
    } else {
      // Menu closed: release focus and clean up
      if (untrapFocusCallback) {
        untrapFocusCallback();
        untrapFocusCallback = null;
      }
      document.body.style.overflow = '';
      toggleBtn.focus(); // Restore focus to button
    }
  }

  // Toggle on click
  toggleBtn.addEventListener('click', toggleMenu);
  
  // Close menu if a nav link is clicked (e.g. page changes)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        toggleMenu();
      }
    });
  });

  // Close menu on pressing Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      toggleMenu();
    }
  });
}
