/**
 * Emotional Support — ServiceCard Component
 * Renders individual service descriptions, features list, and direct consultation links.
 */

export function ServiceCard(service) {
  const featureListHTML = service.features
    .map(feat => `
      <li class="service-meta-item">
        <svg class="service-meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${feat}</span>
      </li>
    `)
    .join('');

  return `
    <article class="service-card" data-category="${service.category}">
      <span class="service-badge ${service.badgeClass}">${service.badgeLabel}</span>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      
      <ul class="service-meta-list" aria-label="Key features of ${service.title}">
        ${featureListHTML}
      </ul>

      <div class="service-details-meta" style="margin-top:auto; margin-bottom: 20px; background-color: var(--bg-main); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        <div class="service-meta-item">
          <strong style="color: var(--text-main);">Duration:</strong> 
          <span style="color: var(--text-muted); margin-left: 6px;">${service.duration}</span>
        </div>
      </div>

      <a href="#/contact?service=${service.id}" class="btn btn-secondary" style="width: 100%; text-align: center;" aria-label="Book a consultation for ${service.title}">
        Book Consultation
      </a>
    </article>
  `;
}
