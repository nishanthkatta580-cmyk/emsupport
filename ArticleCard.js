/**
 * Emotional Support — ArticleCard Component
 * Renders individual blog/resource cards with custom aesthetic gradient placeholders.
 */

export function ArticleCard(article) {
  return `
    <article class="article-card" data-category="${article.category}">
      <div class="article-banner ${article.gradientClass}" aria-hidden="true">
        <span class="article-tag">${article.tag}</span>
      </div>
      
      <div class="article-body">
        <span class="article-time">${article.readTime}</span>
        <h3>${article.title}</h3>
        <p>${article.description}</p>
        
        <button class="article-link read-article-btn" data-article-id="${article.id}" style="background:none; border:none; padding:0; cursor:pointer;" aria-label="Read full article: ${article.title}">
          Read Article
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-left: 4px; display: inline-block; vertical-align: middle;">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </article>
  `;
}
