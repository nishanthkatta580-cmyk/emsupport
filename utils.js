/**
 * Emotional Support — Utility Functions
 * Contains Accessibility (focus trap), Theme Management, Security (XSS prevention), and Form Validation helpers.
 */

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
export function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  // Bind click event
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
  
  // Set flag so subsequent clicks show toast
  window.themeInitialized = true;
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Accessibility description update
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    const nextThemeLabel = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    themeToggleBtn.setAttribute('aria-label', nextThemeLabel);
  }
  
  // Add an interactive toast if the user explicitly switches the theme
  if (window.themeInitialized) {
    showToast(`Switched to ${theme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info', 2000);
  }
}

/* ==========================================================================
   2. Security: XSS Sanitization
   ========================================================================== */
export function sanitizeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/* ==========================================================================
   3. Keyboard Accessibility: Focus Trapping
   ========================================================================== */
/**
 * Traps keyboard focus inside a specific container element (e.g. mobile drawer or modal).
 * Returns a cleanup/release function.
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
  );
  
  if (focusableElements.length === 0) return () => {};

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Set focus on first element initially
  firstElement.focus();

  function keydownHandler(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) { // Shift + Tab (Backward)
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else { // Tab (Forward)
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  container.addEventListener('keydown', keydownHandler);
  
  // Return cleanup hook
  return () => {
    container.removeEventListener('keydown', keydownHandler);
  };
}

/* ==========================================================================
   4. LocalStorage Safe Wrappers
   ========================================================================== */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage', e);
      return false;
    }
  }
};

/* ==========================================================================
   5. Form Validators
   ========================================================================== */
export const validators = {
  email(val) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  },
  
  required(val) {
    return val !== undefined && val !== null && val.toString().trim() !== '';
  },

  futureDate(dateStr) {
    if (!dateStr) return false;
    const selected = new Date(dateStr);
    const today = new Date();
    // Normalize hours
    today.setHours(0,0,0,0);
    selected.setHours(0,0,0,0);
    return selected >= today;
  }
};

/* ==========================================================================
   6. UI Feedback (Toasts)
   ========================================================================== */
export function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast-message">${sanitizeHTML(message)}</span>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger reflow for animation
  void toast.offsetWidth;
  toast.classList.add('show');

  const closeBtn = toast.querySelector('.toast-close');
  
  const dismiss = () => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  };

  closeBtn.addEventListener('click', dismiss);
  
  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}

