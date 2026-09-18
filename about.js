/**
 * Emotional Support — About Page View
 * Renders the mission statements, core team slide carousel, and detailed privacy policy statement.
 */

const TEAM = [
  {
    name: "Dr. Shreya Iyer",
    role: "Clinical Director & Lead Psychologist",
    qualification: "Ph.D. (NIMHANS), Licensed Psychologist",
    image: "./assets/sarah.png",
    bio: "Dr. Iyer has over 14 years of case experience specializing in anxiety mitigation, somatic grounding methodologies, and cognitive behavioral adjustments. She oversees clinical protocols and student exam-burnout coaching circles."
  },
  {
    name: "Aditya Sharma, LMFT",
    role: "Relational Care Specialist",
    qualification: "M.A. in Counseling (TISS), Couples Therapist",
    image: "./assets/michael.png",
    bio: "Aditya focus on family communication, boundary-setting within joint family dynamics, and couples behavioral coaching. He is certified in Gottman relational strategies and helps partnerships build relational safety."
  },
  {
    name: "Ananya Sen, M.Phil.",
    role: "Senior Supervisor & Consult Representative",
    qualification: "RCI Registered Clinical Psychologist",
    image: "./assets/marcus.png",
    bio: "Ananya conducts professional supervisions for licensing candidates and post-graduate interns. With 20 years in ethical reviews, she counsels Indian counseling groups on practice compliance under RCI guidelines."
  }
];

export function renderAbout(container, params) {
  container.innerHTML = `
    <!-- Mission & Values Section -->
    <section class="section-padding" aria-labelledby="about-page-title">
      <div class="container">
        <div class="about-hero-grid">
          <div>
            <span class="hero-eyebrow">Our Mission</span>
            <h1 id="about-page-title">Fostering Psychological Safety</h1>
            <p class="lead">We believe emotional wellness is a collaborative right, not a private luxury.</p>
            <p>Our organization was founded to bridge the gap between clinical excellence and everyday accessibility. By combining personalized therapeutic consulting with interactive digital somatic tools, we support a wellness strategy that is safe, educational, and responsive.</p>
            <p>Whether you are navigating acute work stress, seeking to strengthen relationship connections, or tracking clinical licensing hours as a practicing counselor, we provide structured resources to support your developmental pacing.</p>
          </div>
          <div class="values-sidebar">
            <h3 style="margin-bottom:20px;">Our Core Principles</h3>
            <div class="about-value-item">
              <strong>🔬 Evidence-Based</strong>
              <p>We combine proven cognitive methodologies (CBT, Gottman, somatic therapy) with modern responsive care models.</p>
            </div>
            <div class="about-value-item">
              <strong>🤝 Client-Focused</strong>
              <p>Your agency and emotional timeline are primary. You choose the frequency and level of support that feels safe.</p>
            </div>
            <div class="about-value-item">
              <strong>🌈 Inclusivity & Respect</strong>
              <p>We maintain an affirming space welcoming all identities, family structures, and clinician experience levels.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Bios Carousel Section -->
    <section class="section-padding" style="background-color: var(--bg-card); transition: background-color var(--transition-normal);" aria-labelledby="team-section-title">
      <div class="container">
        <div class="section-header">
          <h2 id="team-section-title">Meet Our Support Specialists</h2>
          <p>Our dedicated clinicians bring diverse specialized training, licensing, and case experience to support your unique goals.</p>
        </div>

        <!-- Carousel Widget Frame -->
        <div class="carousel-container" aria-label="Team member slide gallery" role="region">
          <div class="carousel-track-wrapper">
            <div class="carousel-track" id="team-carousel-track" style="transform: translateX(0%);">
              ${TEAM.map((member, idx) => `
                <div class="carousel-slide" data-index="${idx}" aria-hidden="${idx === 0 ? 'false' : 'true'}" role="group" aria-label="Slide ${idx + 1} of ${TEAM.length}: ${member.name}">
                  <div class="team-card-inner">
                    <div class="team-image-col">
                      <img src="${member.image}" alt="${member.name} - ${member.role}" class="team-avatar-img">
                    </div>
                    <div class="team-info-col">
                      <span class="team-qual">${member.qualification}</span>
                      <h3>${member.name}</h3>
                      <strong class="team-role-title">${member.role}</strong>
                      <p class="team-bio-text">${member.bio}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Slider Arrow Controls -->
          <button class="carousel-control prev-btn" id="btn-carousel-prev" aria-label="Previous team profile">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button class="carousel-control next-btn" id="btn-carousel-next" aria-label="Next team profile">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <!-- Bullet Indicators -->
          <div class="carousel-dots" id="carousel-dots-container">
            ${TEAM.map((_, idx) => `
              <button class="carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Go to slide ${idx + 1}" aria-selected="${idx === 0 ? 'true' : 'false'}" role="tab"></button>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Client Privacy Statement Section -->
    <section class="section-padding" id="privacy-section" aria-labelledby="privacy-section-title">
      <div class="container" style="max-width:850px;">
        <div class="privacy-statement-card">
          <div style="font-size:2.5rem; margin-bottom:16px;" aria-hidden="true">🔒</div>
          <h2 id="privacy-section-title">Client Privacy & HIPAA Safety Statement</h2>
          <p>At Emotional Support, trust and data safety are foundational to care. We enforce standard compliance protocols regarding the custody and protection of mental health inquiries:</p>
          
          <ul class="privacy-points-list">
            <li><strong>Encrypted Intake Pipelines:</strong> All contact and booking requests are transmitted over secure HTTPS layers. Your answers remain confidential and are accessible only to our designated clinicians.</li>
            <li><strong>Zero-Tracking Self-Help Tools:</strong> Interactive features like the Mood Journal and Breathing regulators operate entirely client-side. Your logged mood numbers and text notes are stored locally in your browser cache (localStorage) and never upload to external servers.</li>
            <li><strong>Rights of Access & Deletion:</strong> You retain complete control over your logged records. You can wipe your local mood diary at any time using the built-in "Delete" options.</li>
            <li><strong>Clinical Confidentiality:</strong> Session dialogue notes and consultation reports are archived in certified HIPAA-compliant electronic health records (EHR) databases, protected from unauthorized release.</li>
          </ul>

          <div class="privacy-disclaimer-box">
            <p style="margin:0; font-size:0.9rem; color:var(--text-muted);">For questions regarding medical record requests or licensing compliance supervision audits, please contact our privacy compliance officer directly at <strong>privacy@emotionalsupport.org</strong>.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  // Bind Carousel Listeners
  initCarouselLogic(container);
  
  // Handle auto-scroll hash jumping if URL requests privacy (#/about?section=privacy)
  if (params && params.section === 'privacy') {
    setTimeout(() => {
      const pSection = document.getElementById('privacy-section');
      if (pSection) {
        pSection.scrollIntoView({ behavior: 'smooth' });
        pSection.setAttribute('tabindex', '-1');
        pSection.focus();
      }
    }, 150);
  }

  // Handle privacy link in footer jumping directly to section
  const footerPrivTrigger = document.querySelector('.privacy-link-trigger');
  if (footerPrivTrigger) {
    footerPrivTrigger.addEventListener('click', () => {
      setTimeout(() => {
        const pSection = document.getElementById('privacy-section');
        if (pSection) {
          pSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  injectAboutStyles();
}

/**
 * Slide carousel interaction.
 */
function initCarouselLogic(container) {
  const track = container.querySelector('#team-carousel-track');
  const prevBtn = container.querySelector('#btn-carousel-prev');
  const nextBtn = container.querySelector('#btn-carousel-next');
  const dots = container.querySelectorAll('.carousel-dot');
  const slides = container.querySelectorAll('.carousel-slide');

  let activeIndex = 0;

  function updateCarousel(newIndex) {
    activeIndex = (newIndex + TEAM.length) % TEAM.length;
    
    // Shift track
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    // Update dots styling
    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    // Update slides accessibility hiding
    slides.forEach((slide, idx) => {
      if (idx === activeIndex) {
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Bind Buttons
  prevBtn.addEventListener('click', () => updateCarousel(activeIndex - 1));
  nextBtn.addEventListener('click', () => updateCarousel(activeIndex + 1));

  // Bind Dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIdx = parseInt(e.target.dataset.index, 10);
      updateCarousel(targetIdx);
    });
  });

  // Support swipe / arrow key press navigation
  container.querySelector('.carousel-container').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      updateCarousel(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateCarousel(activeIndex + 1);
    }
  });
}

function injectAboutStyles() {
  const styleId = 'about-view-styles';
  if (document.getElementById(styleId)) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    .about-hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 48px;
      align-items: start;
    }

    .values-sidebar {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 32px;
      box-shadow: var(--shadow-sm);
    }

    .about-value-item {
      margin-bottom: 20px;
    }
    
    .about-value-item:last-child {
      margin-bottom: 0;
    }

    .about-value-item strong {
      font-size: 1rem;
      display: block;
      margin-bottom: 6px;
      color: var(--text-main);
    }

    .about-value-item p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0;
    }

    /* Carousel elements styling */
    .carousel-container {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      padding: 0 48px;
    }

    .carousel-track-wrapper {
      overflow: hidden;
      width: 100%;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      background-color: var(--bg-main);
    }

    .carousel-track {
      display: flex;
      width: 100%;
      transition: transform var(--transition-slow) ease;
    }

    .carousel-slide {
      min-width: 100%;
      width: 100%;
      box-sizing: border-box;
      padding: 40px;
    }

    .team-card-inner {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 36px;
      align-items: center;
    }

    .team-image-col {
      width: 200px;
      height: 200px;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 3px solid var(--primary-glow);
    }

    .team-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .team-info-col h3 {
      font-size: 1.6rem;
      margin-bottom: 4px;
    }

    .team-qual {
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 0.05em;
      display: block;
      margin-bottom: 8px;
    }

    .team-role-title {
      font-size: 1rem;
      color: var(--accent);
      display: block;
      margin-bottom: 16px;
    }

    .team-bio-text {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.6;
    }

    /* Controls */
    .carousel-control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      width: 44px;
      height: 44px;
      border-radius: var(--radius-round);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }

    .carousel-control:hover {
      border-color: var(--primary);
      color: var(--primary);
      background-color: var(--bg-light);
    }

    .prev-btn { left: -10px; }
    .next-btn { right: -10px; }

    .carousel-dots {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 24px;
    }

    .carousel-dot {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-round);
      border: none;
      background-color: var(--border-color);
      cursor: pointer;
      padding: 0;
      transition: all var(--transition-fast);
    }

    .carousel-dot.active {
      background-color: var(--primary);
      transform: scale(1.2);
    }

    /* Privacy policy card */
    .privacy-statement-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 48px;
      box-shadow: var(--shadow-md);
      transition: background-color var(--transition-normal);
    }

    .privacy-points-list {
      list-style: none;
      padding: 0;
      margin: 28px 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .privacy-points-list li {
      position: relative;
      padding-left: 28px;
      font-size: 0.95rem;
      color: var(--text-muted);
    }

    .privacy-points-list li::before {
      content: "✓";
      position: absolute;
      left: 0;
      top: 2px;
      color: var(--primary);
      font-weight: 700;
    }

    .privacy-disclaimer-box {
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
      margin-top: 24px;
    }

    /* Responsive */
    @media (max-width: 800px) {
      .about-hero-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      .carousel-container {
        padding: 0;
      }
      .prev-btn, .next-btn {
        display: none; /* Hide buttons on small screens, rely on dot tabs */
      }
      .team-card-inner {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .team-image-col {
        margin: 0 auto;
      }
      .privacy-statement-card {
        padding: 32px 20px;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
