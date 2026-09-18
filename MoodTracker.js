/**
 * Emotional Support — MoodTracker Component
 * Provides a self-guided daily mood logger, trend tracking, and history list.
 * Persists data to localStorage with XSS sanitation.
 */

import { storage, sanitizeHTML, showToast } from '../utils.js';

const MOODS = [
  { val: 1, label: 'Awful', emoji: '😢' },
  { val: 2, label: 'Bad', emoji: '🙁' },
  { val: 3, label: 'Okay', emoji: '😐' },
  { val: 4, label: 'Good', emoji: '🙂' },
  { val: 5, label: 'Excellent', emoji: '😄' }
];

export function MoodTrackerHTML() {
  return `
    <div class="mood-tracker-container" id="mood-tracker-widget">
      <h3>Personal Mood Journal</h3>
      <p class="lead">Track your emotional patterns over time. Your records are saved privately on your device.</p>
      
      <!-- Stats Summary -->
      <div class="mood-stats">
        <div class="mood-stat-box">
          <div class="mood-stat-val" id="stat-logged-days">0</div>
          <div class="mood-stat-lbl">Total Logs</div>
        </div>
        <div class="mood-stat-box">
          <div class="mood-stat-val" id="stat-average-mood">—</div>
          <div class="mood-stat-lbl">Average Mood</div>
        </div>
      </div>

      <!-- Log Form -->
      <form id="mood-log-form" novalidate>
        <div class="form-group" id="mood-select-group">
          <label>How are you feeling right now?</label>
          <div class="mood-selector" role="radiogroup" aria-label="Select current mood">
            ${MOODS.map(m => `
              <button type="button" class="mood-btn" data-value="${m.val}" role="radio" aria-checked="false" aria-label="${m.label}">
                <span class="mood-emoji" aria-hidden="true">${m.emoji}</span>
                <span class="mood-label">${m.label}</span>
              </button>
            `).join('')}
          </div>
          <div class="form-error" id="mood-select-error">Please select a mood level to log.</div>
        </div>

        <div class="form-group">
          <label for="mood-note">Optional Journal Note</label>
          <textarea id="mood-note" class="form-control mood-textarea" placeholder="Write down any thoughts, triggers, or reflections..."></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">Save Daily Log</button>
      </form>

      <!-- History List -->
      <div class="mood-history">
        <h4>Recent Logs</h4>
        <div class="mood-history-list" id="mood-logs-history-container">
          <p style="color:var(--text-muted); font-style:italic;">No logs recorded yet. Start tracking above!</p>
        </div>
      </div>
    </div>
  `;
}

export function initMoodTracker(container) {
  const form = container.querySelector('#mood-log-form');
  const moodBtns = container.querySelectorAll('.mood-btn');
  const moodError = container.querySelector('#mood-select-error');
  const moodGroup = container.querySelector('#mood-select-group');
  const noteInput = container.querySelector('#mood-note');
  const historyContainer = container.querySelector('#mood-logs-history-container');
  const statDays = container.querySelector('#stat-logged-days');
  const statAvg = container.querySelector('#stat-average-mood');

  if (!form) return;

  let selectedMoodValue = null;
  const localStorageKey = 'emotional_support_moods';

  // 1. Setup Mood button choices
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear error state
      moodGroup.classList.remove('has-error');

      // Clear previous active checks
      moodBtns.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });

      // Active current selection
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
      selectedMoodValue = parseInt(btn.dataset.value, 10);
    });
  });

  // 2. Load stats and history list
  function renderHistoryAndStats() {
    const logs = storage.get(localStorageKey, []);
    
    // RENDER STATS
    statDays.textContent = logs.length;
    if (logs.length > 0) {
      const sum = logs.reduce((acc, log) => acc + log.value, 0);
      const avg = (sum / logs.length).toFixed(1);
      
      // Get corresponding emoji for the average score
      const avgRounded = Math.round(avg);
      const moodInfo = MOODS.find(m => m.val === avgRounded) || MOODS[2];
      statAvg.innerHTML = `${avg} <span style="font-size:1.2rem;" aria-hidden="true">${moodInfo.emoji}</span>`;
    } else {
      statAvg.textContent = '—';
    }

    // RENDER LIST
    if (logs.length === 0) {
      historyContainer.innerHTML = `
        <p style="color:var(--text-muted); font-style:italic; text-align:center;">No logs recorded yet. Start tracking above!</p>
      `;
      return;
    }

    // Sort logs descending (latest first)
    const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

    historyContainer.innerHTML = sortedLogs.map((log, idx) => {
      const moodDetails = MOODS.find(m => m.val === log.value) || MOODS[2];
      const formattedDate = new Date(log.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const cleanNote = sanitizeHTML(log.note);

      return `
        <div class="mood-log-item" style="border-left-color: ${getMoodColor(log.value)};">
          <div class="mood-log-emoji" aria-hidden="true">${moodDetails.emoji}</div>
          <div class="mood-log-content">
            <div class="mood-log-header">
              <span><strong>${moodDetails.label}</strong> • ${formattedDate}</span>
              <button class="delete-log-btn" data-timestamp="${log.timestamp}" style="background:none; border:none; color:hsl(6, 70%, 55%); font-size:0.8rem; cursor:pointer;" aria-label="Delete log from ${formattedDate}">Delete</button>
            </div>
            ${cleanNote ? `<p class="mood-log-note">"${cleanNote}"</p>` : `<span style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">No thoughts logged.</span>`}
          </div>
        </div>
      `;
    }).join('');

    // Bind delete listeners
    const deleteBtns = historyContainer.querySelectorAll('.delete-log-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const timeToDel = parseInt(e.target.dataset.timestamp, 10);
        deleteLog(timeToDel);
      });
    });
  }

  // Helper to color borders based on feeling level
  function getMoodColor(val) {
    switch(val) {
      case 5: return 'hsl(150, 40%, 45%)'; // bright sage/green
      case 4: return 'hsl(150, 25%, 50%)'; // lighter sage
      case 3: return 'hsl(36, 40%, 65%)';  // warm cream-tan
      case 2: return 'hsl(24, 70%, 55%)';  // orange accent
      case 1: return 'hsl(6, 70%, 50%)';   // reddish warning
      default: return 'var(--primary)';
    }
  }

  // Delete Log handler
  function deleteLog(timestamp) {
    const logs = storage.get(localStorageKey, []);
    const filtered = logs.filter(l => l.timestamp !== timestamp);
    storage.set(localStorageKey, filtered);
    renderHistoryAndStats();
    showToast('Log deleted permanently', 'info');
  }

  // 3. Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedMoodValue === null) {
      moodGroup.classList.add('has-error');
      moodError.focus();
      return;
    }

    const newLog = {
      value: selectedMoodValue,
      note: noteInput.value.trim(),
      timestamp: Date.now()
    };

    // Save
    const logs = storage.get(localStorageKey, []);
    logs.push(newLog);
    storage.set(localStorageKey, logs);

    // Reset Form
    noteInput.value = '';
    selectedMoodValue = null;
    moodBtns.forEach(b => {
      b.classList.remove('selected');
      b.setAttribute('aria-checked', 'false');
    });
    moodGroup.classList.remove('has-error');

    // Refresh UI
    renderHistoryAndStats();
    showToast('Mood log securely saved', 'success');
  });

  // Initial load
  renderHistoryAndStats();
}
