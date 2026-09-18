/**
 * Emotional Support — Resources Page View
 * Integrates Article Search Engine, Box Breathing Widget, and Mood Journal.
 */

import { articles } from '../data.js';
import { ArticleCard } from '../components/ArticleCard.js';
import { BreathingToolHTML, initBreathingTool } from '../components/BreathingTool.js';
import { MoodTrackerHTML, initMoodTracker } from '../components/MoodTracker.js';

export function renderResources(container, params) {
  container.innerHTML = `
    <section class="section-padding" aria-labelledby="resources-page-title">
      <div class="container">
        <div class="section-header">
          <span class="hero-eyebrow">Self-Help Hub</span>
          <h1 id="resources-page-title">Articles, Tools & Grounding</h1>
          <p>Access our interactive stress-regulation guides, maintain a personal feelings diary, and search clinical advice written by our staff.</p>
        </div>

        <div class="resources-layout">
          
          <!-- LEFT SIDEBAR: Search Engine & Article grid -->
          <div class="resources-main-content">
            
            <!-- Article Filters Toolbar -->
            <div class="search-toolbar">
              <div class="search-input-wrapper">
                <label for="resources-search" class="visually-hidden">Search self-help database</label>
                <input type="text" id="resources-search" class="form-control" placeholder="Search by topic, e.g. anxiety, grounding...">
                <span class="search-icon" aria-hidden="true">🔍</span>
              </div>

              <div class="type-filters" role="tablist" aria-label="Filter resource categories">
                <button class="type-filter-btn active" data-type="all" role="tab" aria-selected="true">All</button>
                <button class="type-filter-btn" data-type="articles" role="tab" aria-selected="false">Articles</button>
                <button class="type-filter-btn" data-type="tools" role="tab" aria-selected="false">Tools</button>
              </div>
            </div>

            <!-- Screen Reader Announcement for Search updates -->
            <div id="search-feedback" class="visually-hidden" aria-live="polite">Showing all resources.</div>

            <!-- Articles Cards Grid -->
            <div class="articles-grid" id="resources-grid-element" style="margin-top: 32px;">
              ${articles.map(art => ArticleCard(art)).join('')}
            </div>
          </div>

          <!-- RIGHT SIDEBAR: Somatic Interactive Widgets -->
          <aside class="resources-widgets-sidebar" aria-label="Somatic Grounding & Logs">
            
            <!-- Breathing Guide Slot -->
            <div id="breathing-widget-container" style="margin-bottom: 40px;">
              ${BreathingToolHTML()}
            </div>

            <!-- Mood Tracker Slot -->
            <div id="mood-tracker-widget-container">
              ${MoodTrackerHTML()}
            </div>
            
          </aside>

        </div>
      </div>
    </section>

    <!-- Simple Dynamic Article Reading Modal -->
    <div id="article-reader-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reader-title">
      <div class="modal-content" style="max-width: 700px;">
        <button class="modal-close-btn" id="reader-close" aria-label="Close article modal">&times;</button>
        <span class="article-tag" id="reader-tag" style="display:inline-block; margin-bottom:16px;">Tag</span>
        <h2 id="reader-title">Article Title</h2>
        <div id="reader-body" style="margin-top:20px; line-height:1.7; color:var(--text-muted);">
          <!-- Dynamic reading content -->
        </div>
        <button class="btn btn-secondary" id="reader-cancel-btn" style="width:100%; margin-top:32px;">Close Article</button>
      </div>
    </div>
  `;

  // 1. Initialize Interactive Widgets
  const destroyBreathing = initBreathingTool(container.querySelector('#breathing-widget-container'));
  initMoodTracker(container.querySelector('#mood-tracker-widget-container'));

  // 2. Initialize Search & Filter orchestration
  initSearchEngine(container);
  
  // 3. Initialize Article Reader Modal
  initArticleReader(container);

  // 4. Inject styles
  injectResourcesPageStyles();

  // Return unmount callback hook
  return () => {
    if (destroyBreathing) destroyBreathing();
  };
}

/**
 * Filter and Search logic.
 */
function initSearchEngine(container) {
  const searchInput = container.querySelector('#resources-search');
  const typeBtns = container.querySelectorAll('.type-filter-btn');
  const cards = container.querySelectorAll('.article-card');
  const feedback = container.querySelector('#search-feedback');

  let activeType = 'all';
  let activeQuery = '';

  function filterResources() {
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.dataset.category;
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      
      const matchesType = activeType === 'all' || category === activeType;
      const matchesSearch = title.includes(activeQuery) || desc.includes(activeQuery);

      if (matchesType && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Screen reader announcement
    if (activeQuery) {
      feedback.textContent = `Found ${visibleCount} resources matching "${activeQuery}" under category "${activeType}".`;
    } else {
      feedback.textContent = `Showing ${visibleCount} resources under category "${activeType}".`;
    }
  }

  // Bind key inputs
  searchInput.addEventListener('input', (e) => {
    activeQuery = e.target.value.toLowerCase().trim();
    filterResources();
  });

  // Bind tabs
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeType = btn.dataset.type;
      filterResources();
    });
  });
}

/**
 * Reading simulation drawer/modal.
 */
function initArticleReader(container) {
  const modal = container.querySelector('#article-reader-modal');
  const closeBtn = container.querySelector('#reader-close');
  const cancelBtn = container.querySelector('#reader-cancel-btn');
  const tagSpan = container.querySelector('#reader-tag');
  const titleH2 = container.querySelector('#reader-title');
  const bodyDiv = container.querySelector('#reader-body');
  
  const readButtons = container.querySelectorAll('.read-article-btn');

  function openArticle(articleId) {
    const art = articles.find(a => a.id === articleId);
    if (!art) return;

    tagSpan.textContent = art.tag;
    titleH2.textContent = art.title;
    
    // Setup generic text for simulation
    bodyDiv.innerHTML = `
      <p><em>Originally written by Emotional Support staff • ${art.readTime}</em></p>
      <p style="margin-top:20px;"><strong>Introduction</strong><br>${art.description}</p>
      <p>Therapeutic studies have long documented the impact of cognitive structures on immediate physiological cycles. When a stress event triggers the brain's alarm circuits, heart rates elevate, blood pressure swells, and shallow chest breathing dominates. Intercepting this pattern requires conscious intervention.</p>
      <p><strong>Pacing Relational Safety</strong><br>By applying deliberate cognitive techniques, such as scheduling structured focus pauses, maintaining feeling logs to track triggers, or adopting regulatory tempo controls, clients can safely stimulate the vagus nerve. This resets the sympathetic overdrive and anchors awareness within a state of somatic safety.</p>
      <p><strong>Conclusion & Advice</strong><br>We advise practicing these exercises in calm moments rather than waiting for panic to arrive. Building psychological safety is an ongoing training loop. To discuss custom grounding approaches or explore counseling structures, reach out to our team under the Support booking page.</p>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeArticle() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bind clicks
  readButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      openArticle(btn.dataset.articleId);
    });
  });

  closeBtn.addEventListener('click', closeArticle);
  cancelBtn.addEventListener('click', closeArticle);
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeArticle();
    }
  });
}

function injectResourcesPageStyles() {
  const styleId = 'resources-page-styles';
  if (document.getElementById(styleId)) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    .search-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px 24px;
      box-shadow: var(--shadow-sm);
      transition: background-color var(--transition-normal), border-color var(--transition-normal);
    }

    .search-input-wrapper {
      position: relative;
      flex-grow: 1;
      max-width: 450px;
    }

    .search-input-wrapper input {
      padding-left: 44px;
      background-color: var(--bg-main);
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    .type-filters {
      display: flex;
      gap: 8px;
    }

    .type-filter-btn {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 8px 20px;
      border-radius: var(--radius-round);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--font-body);
      transition: all var(--transition-fast);
    }

    .type-filter-btn:hover {
      border-color: var(--primary);
      color: var(--text-main);
    }

    .type-filter-btn.active {
      background-color: var(--primary);
      border-color: var(--primary);
      color: var(--text-light);
    }

    .resources-widgets-sidebar {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    @media (max-width: 900px) {
      .resources-widgets-sidebar {
        margin-top: 40px;
      }
    }
    
    @media (max-width: 600px) {
      .search-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .search-input-wrapper {
        max-width: 100%;
      }
      .type-filters {
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
