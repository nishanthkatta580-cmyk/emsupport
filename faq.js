/**
 * Emotional Support — FAQ Page View
 * Renders interactive details-summary accordions with dynamic text filtering.
 */

import { faqs } from '../data.js';

export function renderFaq(container, params) {
  container.innerHTML = `
    <section class="section-padding" aria-labelledby="faq-page-title">
      <div class="container" style="max-width: 800px;">
        <div class="section-header">
          <span class="hero-eyebrow">Help center</span>
          <h1 id="faq-page-title">Frequently Asked Questions</h1>
          <p>Find details on session protocols, booking safety, client privacy criteria, and clinician consults.</p>
        </div>

        <!-- FAQ Search input -->
        <div class="search-toolbar" style="margin-bottom: 40px; justify-content: stretch;">
          <div class="search-input-wrapper" style="max-width: 100%;">
            <label for="faq-search" class="visually-hidden">Search frequently asked questions</label>
            <input type="text" id="faq-search" class="form-control" placeholder="Search questions or answers...">
            <span class="search-icon" aria-hidden="true">🔍</span>
          </div>
        </div>

        <!-- Screen Reader Announcement -->
        <div id="faq-search-feedback" class="visually-hidden" aria-live="polite">Showing all FAQs.</div>

        <!-- Accordion database container -->
        <div class="faq-accordion" id="faq-accordion-list">
          ${faqs.map((f, idx) => `
            <details class="faq-item" data-category="${f.category}">
              <summary class="faq-summary" role="button" aria-expanded="false">
                <span>${f.question}</span>
                <span class="faq-summary-arrow" aria-hidden="true">▼</span>
              </summary>
              <div class="faq-details-content">
                <p>${f.answer}</p>
              </div>
            </details>
          `).join('')}
        </div>

        <!-- Direct Support CTA Block -->
        <div style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 40px; margin-top: 56px; text-align: center; box-shadow: var(--shadow-sm); transition: background-color var(--transition-normal);">
          <h3>Still have questions?</h3>
          <p style="color:var(--text-muted); max-width: 500px; margin: 8px auto 24px auto;">If you require licensing supervisor details, custom session quotes, or partners counseling explanations, get in touch with our team.</p>
          <a href="#/contact" class="btn btn-accent">Submit Custom Inquiry</a>
        </div>

      </div>
    </section>
  `;

  // Bind Accordion filters & Aria states
  initFaqLogic(container);
}

/**
 * Accordion search filtering and correct aria-expanded states updates.
 */
function initFaqLogic(container) {
  const searchInput = container.querySelector('#faq-search');
  const faqItems = container.querySelectorAll('.faq-item');
  const feedback = container.querySelector('#faq-search-feedback');

  // 1. Live search filter
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-summary span').textContent.toLowerCase();
      const answer = item.querySelector('.faq-details-content p').textContent.toLowerCase();

      const matches = question.includes(query) || answer.includes(query);
      if (matches) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.removeAttribute('open'); // Close search-hidden panels
      }
    });

    // Screen reader announcement
    if (query) {
      feedback.textContent = `Found ${visibleCount} questions matching "${query}".`;
    } else {
      feedback.textContent = `Showing all ${faqItems.length} FAQs.`;
    }
  });

  // 2. Keep details aria-expanded state updated
  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-summary');
    
    // Toggle aria state on toggle event
    item.addEventListener('toggle', () => {
      const isOpen = item.hasAttribute('open');
      summary.setAttribute('aria-expanded', String(isOpen));
    });
  });
}
