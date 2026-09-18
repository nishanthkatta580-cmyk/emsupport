/**
 * Emotional Support — Home Page View
 * Renders the main landing page, CTAs, highlight features, client quotes, and resources teaser.
 */

import { services, articles } from '../data.js';
import { ArticleCard } from '../components/ArticleCard.js';

export function renderHome(container, params) {
  // Select a couple of highlight resources to preview
  const teaserArticles = articles.slice(0, 2);

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero-section" aria-label="Introduction">
      <div class="container hero-grid">
        <div class="hero-content">
          <span class="hero-eyebrow">Professional Emotional Support</span>
          <h1>Nurturing Minds, <br>Supporting Hearts.</h1>
          <p class="lead" style="font-style: italic; font-weight: 600; color: var(--primary); font-size: 1.25rem; margin-bottom: 16px; font-family: var(--font-display);">"A better change starts here"</p>
          <p class="lead" style="margin-top:0;">A safe space offering compassionate mental health consulting, interactive self-help tools, and direct clinical therapy resources tailored for your journey.</p>
          <div class="hero-actions">
            <a href="#/contact" class="btn btn-accent btn-lg" style="padding: 16px 36px;">Get Support Now</a>
            <a href="#/services" class="btn btn-secondary btn-lg" style="padding: 16px 36px; margin-left: 12px;">Explore Services</a>
          </div>
        </div>
        
        <!-- Modern Abstract SVG illustration representing emotional balance/calm -->
        <div class="hero-illustration" aria-hidden="true">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; max-width: 400px; display: block; margin: 0 auto;">
            <!-- Background soothing blobs -->
            <circle cx="200" cy="200" r="140" fill="var(--primary-glow)"/>
            <path d="M280 200C280 244.183 234.183 280 190 280C145.817 280 120 234.183 120 190C120 145.817 155.817 120 200 120C244.183 120 280 155.817 280 200Z" fill="var(--accent-glow)" opacity="0.6"/>
            <!-- Balancing visual arcs -->
            <circle cx="200" cy="200" r="90" stroke="var(--primary)" stroke-width="2" stroke-dasharray="8 6"/>
            <!-- Human focus balance points -->
            <circle cx="140" cy="160" r="16" fill="var(--primary)"/>
            <circle cx="260" cy="240" r="24" fill="var(--accent)"/>
            <circle cx="200" cy="200" r="8" fill="var(--text-main)"/>
            <!-- Flowing connecting lines -->
            <path d="M140 176C140 210 170 200 200 200" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/>
            <path d="M200 200C230 200 260 190 260 216" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="section-padding" style="background-color: var(--bg-card); transition: background-color var(--transition-normal);" aria-labelledby="why-us-title">
      <div class="container">
        <div class="section-header">
          <h2 id="why-us-title">A Compassionate Path to Well-being</h2>
          <p>We provide evidence-based, custom-structured support that fits your lifestyle. Our mission is to make emotional wellness accessible, safe, and collaborative.</p>
        </div>

        <div class="features-grid">
          <div class="feature-box">
            <div class="feature-icon-wrapper" aria-hidden="true">🔑</div>
            <h3>100% Confidential</h3>
            <p>Your inquiries, session dialogues, and tracker journals are strictly protected by standard HIPAA and clinical safety protocols.</p>
          </div>
          <div class="feature-box">
            <div class="feature-icon-wrapper" aria-hidden="true">🛠️</div>
            <h3>Interactive Self-Help</h3>
            <p>Access our built-in box-breathing regulators, somatic grounding lists, and local mood trackers completely free of charge, anytime.</p>
          </div>
          <div class="feature-box">
            <div class="feature-icon-wrapper" aria-hidden="true">👥</div>
            <h3>Audience-Focused</h3>
            <p>Tailored options specifically structured for individuals seeking private growth, couples resolving friction, and clinical consults.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section-padding" aria-labelledby="testimonials-title">
      <div class="container">
        <div class="section-header">
          <h2 id="testimonials-title">What Our Community Says</h2>
          <p>Real feedback from individuals, partners, and clinicians who have utilized our consulting and resources.</p>
        </div>

        <div class="testimonials-grid">
          <blockquote class="testimonial-card">
            <p class="testimonial-quote">"The box-breathing tool and mood journal have changed how I manage daily corporate IT workload. Having immediate somatic regulators on the same site as my therapist makes a massive difference."</p>
            <cite class="testimonial-author">
              <strong>Rohan M.</strong>
              <span>Software Engineer, Bengaluru</span>
            </cite>
          </blockquote>

          <blockquote class="testimonial-card">
            <p class="testimonial-quote">"As an RCI candidate psychologist, the supervisor hours logging and case reviews here are top-tier. Extremely professional, compliant, and highly recommended for clinical licensing."</p>
            <cite class="testimonial-author">
              <strong>Dr. Priya N., M.Phil.</strong>
              <span>Clinical Psychologist, Delhi</span>
            </cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- Resources Teaser Section -->
    <section class="section-padding" style="background-color: var(--bg-card); transition: background-color var(--transition-normal);" aria-labelledby="teaser-title">
      <div class="container">
        <div class="teaser-header-row" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 3rem;">
          <div style="max-width: 600px;">
            <h2 id="teaser-title" style="margin-bottom:12px;">Self-Help Articles & Tools</h2>
            <p style="color:var(--text-muted); margin:0;">Explore evidence-based mental health reads and custom interactive grounding tools built directly into our platform.</p>
          </div>
          <a href="#/resources" class="btn btn-primary" style="flex-shrink:0;">Explore All Resources</a>
        </div>

        <div class="articles-grid">
          ${teaserArticles.map(art => ArticleCard(art)).join('')}
        </div>
      </div>
    </section>
  `;

  // Setup styling specific to Home views
  injectHomeStyles();
}

function injectHomeStyles() {
  // We can inject home-specific structural CSS rules in a style block to keep components tidy
  const styleId = 'home-view-styles';
  if (document.getElementById(styleId)) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    /* Hero layout */
    .hero-section {
      padding-top: clamp(4rem, 10vw, 8rem);
      padding-bottom: clamp(4rem, 10vw, 8rem);
      overflow: hidden;
    }
    
    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      align-items: center;
      gap: 48px;
    }
    
    .hero-content {
      max-width: 650px;
    }

    .hero-eyebrow {
      display: inline-block;
      font-size: 0.9rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      margin-bottom: 16px;
    }

    .hero-content h1 {
      margin-bottom: 24px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 32px;
    }

    /* Features Layout */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
      margin-top: 16px;
    }

    .feature-box {
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 36px;
      text-align: center;
      transition: transform var(--transition-fast), border-color var(--transition-fast);
    }

    .feature-box:hover {
      transform: translateY(-4px);
      border-color: var(--primary-light);
    }

    .feature-icon-wrapper {
      font-size: 2.2rem;
      margin-bottom: 20px;
      display: inline-block;
    }

    .feature-box h3 {
      font-size: 1.25rem;
      margin-bottom: 12px;
    }

    .feature-box p {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-bottom: 0;
    }

    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .testimonial-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 36px;
      box-shadow: var(--shadow-sm);
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .testimonial-quote {
      font-size: 1.1rem;
      font-style: italic;
      color: var(--text-main);
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .testimonial-author {
      display: flex;
      flex-direction: column;
      font-style: normal;
    }

    .testimonial-author strong {
      font-size: 0.95rem;
      color: var(--text-main);
    }

    .testimonial-author span {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Media query updates */
    @media (max-width: 800px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 32px;
        text-align: center;
      }
      .hero-content {
        max-width: 100%;
      }
      .hero-actions {
        justify-content: center;
      }
      .testimonials-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      .teaser-header-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
