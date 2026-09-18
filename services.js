/**
 * Emotional Support — Services Page View
 * Renders support offerings, handles category filtering, and displays detailed information modals.
 */

import { services } from '../data.js';
import { ServiceCard } from '../components/ServiceCard.js';
import { trapFocus } from '../utils.js';

export function renderServices(container, params) {
  container.innerHTML = `
    <section class="section-padding" aria-labelledby="services-page-title">
      <div class="container">
        <div class="section-header">
          <span class="hero-eyebrow">Professional Support</span>
          <h1 id="services-page-title">Support Services & Consulting</h1>
          <p>We provide compassionate, evidence-based services for individual growth, healthy relationships, and clinical advancement. Select a category below to filter our offerings.</p>
        </div>

        <!-- Category Filters -->
        <div class="filter-controls" role="tablist" aria-label="Filter support services">
          <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true" aria-controls="services-grid-element">Show All</button>
          <button class="filter-btn" data-filter="individual" role="tab" aria-selected="false" aria-controls="services-grid-element">Individuals</button>
          <button class="filter-btn" data-filter="partner" role="tab" aria-selected="false" aria-controls="services-grid-element">Partners & Couples</button>
          <button class="filter-btn" data-filter="clinician" role="tab" aria-selected="false" aria-controls="services-grid-element">Clinicians & supervisor</button>
        </div>

        <!-- Services Grid -->
        <div id="services-grid-element" class="services-grid" style="margin-top: 40px;">
          ${services.map(serv => ServiceCard(serv)).join('')}
        </div>
      </div>
    </section>

    <!-- Detailed Modal Overlay (Hidden by default) -->
    <div id="service-detail-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
      <div class="modal-content">
        <button class="modal-close-btn" id="modal-close" aria-label="Close details dialog">&times;</button>
        <span class="service-badge" id="modal-badge" style="margin-bottom: 16px;">Category</span>
        <h2 id="modal-title">Service Title</h2>
        <div id="modal-desc" class="modal-body-content">
          <!-- Populated by JS -->
        </div>
        <div style="margin-top: 32px; display: flex; gap: 12px;">
          <a href="#/contact" id="modal-book-cta" class="btn btn-accent" style="flex:1; text-align:center;">Book Session</a>
          <button class="btn btn-secondary" id="modal-cancel" style="flex:1;">Close Details</button>
        </div>
      </div>
    </div>
  `;

  // Bind Event Listeners
  initFilterLogic(container);
  initModalLogic(container);
  injectServicesStyles();
}

/**
 * Filter list animation logic.
 */
function initFilterLogic(container) {
  const filterBtns = container.querySelectorAll('.filter-btn');
  const cards = container.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle tab active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.dataset.filter;

      // Filter animations
      cards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          // Fade-in animation hook
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.transform = 'scale(0.95)';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * Modern modal detail window.
 */
function initModalLogic(container) {
  const modal = container.querySelector('#service-detail-modal');
  const closeBtn = container.querySelector('#modal-close');
  const cancelBtn = container.querySelector('#modal-cancel');
  const modalTitle = container.querySelector('#modal-title');
  const modalBadge = container.querySelector('#modal-badge');
  const modalBody = container.querySelector('#modal-desc');
  const bookCta = container.querySelector('#modal-book-cta');
  const cards = container.querySelectorAll('.service-card');

  let cleanupFocusTrap = null;

  function openModal(service) {
    modalTitle.textContent = service.title;
    modalBadge.textContent = service.badgeLabel;
    
    // Set custom badge class colors
    modalBadge.className = `service-badge ${service.badgeClass}`;
    
    modalBody.innerHTML = `
      <p class="lead" style="margin-bottom:24px;">${service.description}</p>
      
      <h4 style="margin-bottom:12px; font-family:var(--font-body); font-weight:600;">What's Included in this Consultation:</h4>
      <ul style="padding-left:20px; margin-bottom:24px; display:flex; flex-direction:column; gap:8px;">
        ${service.features.map(f => `<li>${f}</li>`).join('')}
      </ul>

      <div style="background-color:var(--bg-main); padding:16px; border-radius:var(--radius-sm); display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div>
          <span style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:600; display:block;">Session Duration</span>
          <strong style="color:var(--text-main); font-size:1.1rem;">${service.duration}</strong>
        </div>
        <div>
          <span style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:600; display:block;">Availability</span>
          <strong style="color:var(--text-main); font-size:1.1rem;">${service.availability}</strong>
        </div>
      </div>
    `;
    
    // Set direct booking target
    bookCta.setAttribute('href', `#/contact?service=${service.id}`);
    
    modal.classList.add('open');
    cleanupFocusTrap = trapFocus(modal);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    if (cleanupFocusTrap) {
      cleanupFocusTrap();
      cleanupFocusTrap = null;
    }
    document.body.style.overflow = '';
  }

  // Inject detail click listener onto cards (excluding clicking direct anchor links)
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking consultation button, let routing handle direct jump
      if (e.target.closest('a')) return;
      
      // Find matching database entry
      const cardTitle = card.querySelector('h3').textContent;
      const matchedService = services.find(s => s.title === cardTitle);
      
      if (matchedService) {
        openModal(matchedService);
      }
    });
    
    // Accessibility: click on Card via keyboard Enter trigger
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${card.querySelector('h3').textContent}`);
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.target.closest('a')) {
        const cardTitle = card.querySelector('h3').textContent;
        const matchedService = services.find(s => s.title === cardTitle);
        if (matchedService) openModal(matchedService);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  // Close on Escape keyboard click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function injectServicesStyles() {
  const styleId = 'services-view-styles';
  if (document.getElementById(styleId)) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    .filter-controls {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
    }

    .filter-btn {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 10px 24px;
      border-radius: var(--radius-round);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      font-family: var(--font-body);
      transition: all var(--transition-fast);
    }

    .filter-btn:hover {
      border-color: var(--primary-light);
      color: var(--text-main);
    }

    .filter-btn.active {
      background-color: var(--primary);
      border-color: var(--primary);
      color: var(--text-light);
    }
    
    .service-card {
      cursor: pointer;
    }

    .service-card:focus-visible {
      outline: 3px solid var(--accent);
      outline-offset: 4px;
    }
  `;
  document.head.appendChild(styleSheet);
}
