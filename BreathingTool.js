/**
 * Emotional Support — BreathingTool Component
 * Renders and drives the interactive mindfulness box-breathing tool.
 * Implements accessible timers and screen-reader polite announcements.
 */

export function BreathingToolHTML() {
  return `
    <div class="breathing-card" id="breathing-tool-widget">
      <h3>Mindfulness Breathing Guide</h3>
      <p class="lead">Regulate your nervous system with box breathing. Follow the circular guide below.</p>
      
      <!-- Screen Reader Announcement Area -->
      <div id="breathing-announcement" class="visually-hidden" aria-live="polite"></div>

      <!-- Breathing Ring Graphic -->
      <div class="breathing-circle-container">
        <div class="breathing-outer-ring"></div>
        <div class="breathing-inner-ring">
          <span class="breathing-text" id="breathing-text-display">Breathe</span>
        </div>
      </div>

      <!-- Status Subtext -->
      <p class="breathing-instructions" id="breathing-instructions-display">Click Start to begin your session</p>

      <!-- Settings & Controls -->
      <div class="breathing-setting">
        <label for="tempo-selector">Breathing Cycle Speed:</label>
        <select id="tempo-selector" class="form-control" style="width: auto; padding: 6px 12px; display: inline-block;">
          <option value="4">4 Seconds (Standard)</option>
          <option value="5">5 Seconds (Deep)</option>
          <option value="6">6 Seconds (Slow)</option>
        </select>
      </div>

      <button id="btn-toggle-breath" class="btn btn-primary" style="margin-top: 24px; min-width: 140px;">
        Start Session
      </button>
    </div>
  `;
}

export function initBreathingTool(widgetContainer) {
  const toggleBtn = widgetContainer.querySelector('#btn-toggle-breath');
  const outerRing = widgetContainer.querySelector('.breathing-outer-ring');
  const innerRing = widgetContainer.querySelector('.breathing-inner-ring');
  const textDisplay = widgetContainer.querySelector('#breathing-text-display');
  const instructionDisplay = widgetContainer.querySelector('#breathing-instructions-display');
  const announcementDisplay = widgetContainer.querySelector('#breathing-announcement');
  const tempoSelector = widgetContainer.querySelector('#tempo-selector');
  const widget = widgetContainer.querySelector('#breathing-tool-widget');

  if (!toggleBtn) return;

  let isRunning = false;
  let timerId = null;
  let cycleIndex = 0; // 0 = Inhale, 1 = Hold, 2 = Exhale, 3 = Hold
  let currentTempo = parseInt(tempoSelector.value, 10);

  // States settings
  const states = [
    { name: 'inhale', text: 'Inhale', desc: 'Breathing in slowly...', class: 'inhale' },
    { name: 'hold-in', text: 'Hold', desc: 'Hold your breath...', class: 'hold' },
    { name: 'exhale', text: 'Exhale', desc: 'Breathing out slowly...', class: 'exhale' },
    { name: 'hold-out', text: 'Hold', desc: 'Rest before inhaling...', class: 'hold' }
  ];

  function updateState() {
    if (!isRunning) return;

    const state = states[cycleIndex];
    
    // Update display text
    textDisplay.textContent = state.text;
    instructionDisplay.textContent = `${state.desc} (${currentTempo}s)`;
    
    // Screen reader announcement
    announcementDisplay.textContent = `${state.text}. ${state.desc}`;

    // Manage visual classes
    widget.classList.remove('inhale', 'exhale', 'hold');
    widget.classList.add(state.class);

    // Dynamic animation durations based on selector speed
    outerRing.style.transition = `transform ${currentTempo}s linear`;
    innerRing.style.transition = `transform ${currentTempo}s linear`;

    // Queue next state
    cycleIndex = (cycleIndex + 1) % states.length;
    
    // Set timer for the next phase
    timerId = setTimeout(updateState, currentTempo * 1000);
  }

  function startSession() {
    isRunning = true;
    toggleBtn.textContent = 'Pause Session';
    toggleBtn.classList.replace('btn-primary', 'btn-accent');
    cycleIndex = 0;
    updateState();
  }

  function stopSession() {
    isRunning = false;
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    toggleBtn.textContent = 'Start Session';
    toggleBtn.classList.replace('btn-accent', 'btn-primary');
    
    // Reset visual elements
    widget.classList.remove('inhale', 'exhale', 'hold');
    textDisplay.textContent = 'Breathe';
    instructionDisplay.textContent = 'Session paused. Click Start to resume.';
    announcementDisplay.textContent = 'Breathing session paused.';
    
    outerRing.style.transform = '';
    innerRing.style.transform = '';
  }

  // Bind controls
  toggleBtn.addEventListener('click', () => {
    if (isRunning) {
      stopSession();
    } else {
      startSession();
    }
  });

  tempoSelector.addEventListener('change', (e) => {
    currentTempo = parseInt(e.target.value, 10);
    if (isRunning) {
      // Restart current state with new tempo immediately
      stopSession();
      startSession();
    }
  });

  // Export destructor cleanup function for the router to run when unmounting page
  return () => {
    if (timerId) {
      clearTimeout(timerId);
    }
  };
}
