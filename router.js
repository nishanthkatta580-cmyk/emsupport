/**
 * Emotional Support — Client-Side Hash Router
 * Orchestrates page changes, updates accessibility states, and passes query arguments.
 */

// Import views
import { renderHome } from './pages/home.js';
import { renderServices } from './pages/services.js';
import { renderAbout } from './pages/about.js';
import { renderResources } from './pages/resources.js';
import { renderContact } from './pages/contact.js';
import { renderFaq } from './pages/faq.js';
import { renderDashboard } from './pages/dashboard.js';

// Route lookup table
const routes = {
  '#/home': { render: renderHome, title: 'Home — Emotional Support' },
  '#/services': { render: renderServices, title: 'Services — Emotional Support' },
  '#/about': { render: renderAbout, title: 'About Our Mission — Emotional Support' },
  '#/resources': { render: renderResources, title: 'Resources & Self-Help Tools — Emotional Support' },
  '#/contact': { render: renderContact, title: 'Book Support & Inquiries — Emotional Support' },
  '#/faq': { render: renderFaq, title: 'FAQ & Safety Info — Emotional Support' },
  '#/dashboard': { render: renderDashboard, title: 'Clinician Console — Emotional Support' }
};

// Store active page cleanup callback to prevent memory leaks from active timers
let activePageCleanup = null;

/**
 * Resolves the current URL hash, matches to route, and loads content.
 */
export function handleRouting() {
  const fullHash = window.location.hash || '#/home';
  
  // Extract path and query params (e.g., #/contact?service=individual-counseling)
  const [path, queryString] = fullHash.split('?');
  
  // Parse query parameters into an object
  const params = {};
  if (queryString) {
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
      const [key, val] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(val || '');
    });
  }

  // Fallback to home if route not found
  const route = routes[path] || routes['#/home'];
  
  // Update document title
  document.title = route.title;

  // Render content in the main container
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    // 1. Run previous page cleanup hook if one was registered
    if (activePageCleanup) {
      activePageCleanup();
      activePageCleanup = null;
    }

    // 2. Empty element, set content and re-bind event handlers
    mainContent.innerHTML = '';
    
    // 3. Call page-specific render and capture any returned cleanup hook
    const cleanup = route.render(mainContent, params);
    if (typeof cleanup === 'function') {
      activePageCleanup = cleanup;
    }
    
    // Shift focus to main container for Screen Reader accessibility
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
    
    // Scroll view to top
    window.scrollTo(0, 0);
  }

  // Update navbar visual active class
  updateActiveNavLink(path);
}

/**
 * Updates active navigation links highlights.
 */
function updateActiveNavLink(currentPath) {
  const navLinks = document.querySelectorAll('.nav-link, .bottom-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Normalize path checking
    if (href && href.split('?')[0] === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Initialize Router listeners.
 */
export function initRouter() {
  // Listen to hash updates
  window.addEventListener('hashchange', handleRouting);
  
  // Route initial load
  handleRouting();
}
