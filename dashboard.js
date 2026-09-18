/**
 * Emotional Support — Clinician Dashboard Page View
 * Renders lock screens, dashboard metrics, client lists, and intake response panel.
 * Connects directly to IndexedDB.
 */

import { getAllRecords, updateRecord } from '../db.js';
import { sanitizeHTML, showToast } from '../utils.js';

const PASSCODE = '1234';

export function renderDashboard(container, params) {
  const isLoggedIn = sessionStorage.getItem('clinician_logged_in') === 'true';

  if (!isLoggedIn) {
    renderLockScreen(container);
  } else {
    renderPortal(container);
  }
}

/**
 * Renders the portal passcode page.
 */
function renderLockScreen(container) {
  container.innerHTML = `
    <section class="section-padding" style="min-height:70vh; display:flex; align-items:center;">
      <div class="container" style="max-width: 480px;">
        <div class="lock-card">
          <div class="lock-icon-wrapper" aria-hidden="true">🔒</div>
          <h2>Clinician Portal</h2>
          <p style="color:var(--text-muted); text-align:center;">Enter the authorization passcode to review client intake databases. (Passcode: <strong>1234</strong>)</p>
          
          <form id="dashboard-login-form" novalidate style="margin-top:24px;">
            <div class="form-group" id="login-group">
              <label for="passcode-input">Passcode</label>
              <input type="password" id="passcode-input" class="form-control" placeholder="••••" required style="text-align:center; letter-spacing:0.4em; font-size:1.2rem;">
              <div class="form-error" id="login-error">Passcode is incorrect. Please try again.</div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">Unlock Database</button>
          </form>
        </div>
      </div>
    </section>
  `;

  // Bind Submit listener
  const form = container.querySelector('#dashboard-login-form');
  const input = container.querySelector('#passcode-input');
  const group = container.querySelector('#login-group');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value === PASSCODE) {
      sessionStorage.setItem('clinician_logged_in', 'true');
      group.classList.remove('has-error');
      // Reload this route to render the authenticated portal
      window.location.reload();
    } else {
      group.classList.add('has-error');
      input.value = '';
      input.focus();
      showToast('Incorrect passcode', 'error');
    }
  });

  injectLockStyles();
}

/**
 * Renders the main Portal structure.
 */
async function renderPortal(container) {
  container.innerHTML = `
    <section class="section-padding">
      <div class="container">
        
        <!-- Header row -->
        <div class="dashboard-header-row">
          <div>
            <span class="hero-eyebrow">Clinician Console</span>
            <h1 style="margin-bottom:8px;">Client Intake Database</h1>
            <p style="color:var(--text-muted); margin:0;">Monitor intake requests, manage schedules, and coordinate counselor assignments.</p>
          </div>
          <button id="btn-portal-logout" class="btn btn-secondary" style="flex-shrink:0;">Log Out</button>
        </div>

        <!-- Metrics Row -->
        <div class="dashboard-metrics-grid" style="margin-top:36px;">
          <div class="metric-card">
            <span class="metric-val" id="metric-total-bookings">0</span>
            <span class="metric-lbl">Total Consults</span>
          </div>
          <div class="metric-card">
            <span class="metric-val" id="metric-pending-bookings" style="color:var(--accent);">0</span>
            <span class="metric-lbl">Pending Review</span>
          </div>
          <div class="metric-card">
            <span class="metric-val" id="metric-confirmed-bookings" style="color:hsl(150, 40%, 45%);">0</span>
            <span class="metric-lbl">Sessions Confirmed</span>
          </div>
          <div class="metric-card">
            <span class="metric-val" id="metric-total-clients">0</span>
            <span class="metric-lbl">Unique Clients</span>
          </div>
        </div>

        <!-- Working Workspace layout -->
        <div class="dashboard-workspace" style="margin-top:40px;">
          
          <!-- Left list col -->
          <div class="workspace-list-col">
            <div class="list-search-bar">
              <input type="text" id="workspace-search" class="form-control" placeholder="Search by name or email...">
            </div>
            
            <div class="list-status-filters" style="margin-top:12px; display:flex; gap:6px;">
              <button class="status-tab active" data-status="all">All</button>
              <button class="status-tab" data-status="Pending">Pending</button>
              <button class="status-tab" data-status="Confirmed">Confirmed</button>
              <button class="status-tab" data-status="Responded">Responded</button>
            </div>

            <!-- List items scroll box -->
            <div class="workspace-list-container" id="bookings-list-viewport" style="margin-top:20px;">
              <p style="text-align:center; color:var(--text-muted); padding:32px 0;">Loading intake database...</p>
            </div>
          </div>

          <!-- Right details col -->
          <div class="workspace-details-col" id="booking-details-viewport">
            <div class="details-empty-state">
              <div style="font-size:3rem; margin-bottom:16px;" aria-hidden="true">📁</div>
              <h3>Review Client Case</h3>
              <p>Select a consultation record from the list to update progress, log internal notes, and write response coordinates.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  `;

  // Bind logout click
  container.querySelector('#btn-portal-logout').addEventListener('click', () => {
    sessionStorage.removeItem('clinician_logged_in');
    showToast('Logged out successfully', 'info');
    setTimeout(() => window.location.reload(), 500);
  });

  // Load Database records and bind page events
  await setupPortalDatabaseLogic(container);
  
  injectPortalStyles();
}

/**
 * Reads DB records, calculates stats, and handles selections.
 */
async function setupPortalDatabaseLogic(container) {
  const bookingsListViewport = container.querySelector('#bookings-list-viewport');
  const detailsViewport = container.querySelector('#booking-details-viewport');
  
  const totalVal = container.querySelector('#metric-total-bookings');
  const pendingVal = container.querySelector('#metric-pending-bookings');
  const confirmedVal = container.querySelector('#metric-confirmed-bookings');
  const clientsVal = container.querySelector('#metric-total-clients');

  const searchInput = container.querySelector('#workspace-search');
  const statusTabs = container.querySelectorAll('.status-tab');

  let activeBookings = [];
  let selectedBooking = null;
  let activeSearch = '';
  let activeStatusFilter = 'all';

  async function refreshData() {
    try {
      activeBookings = await getAllRecords('bookings');
      
      // Update statistics indicators
      totalVal.textContent = activeBookings.length;
      pendingVal.textContent = activeBookings.filter(b => b.status === 'Pending').length;
      confirmedVal.textContent = activeBookings.filter(b => b.status === 'Confirmed').length;
      
      const uniqueEmails = [...new Set(activeBookings.map(b => b.clientEmail))];
      clientsVal.textContent = uniqueEmails.length;

      // Render search-filtered list
      renderList();

      // Refresh details panel if a booking is currently selected
      if (selectedBooking) {
        const reloaded = activeBookings.find(b => b.id === selectedBooking.id);
        if (reloaded) {
          renderDetails(reloaded);
        } else {
          renderEmptyState();
        }
      }
    } catch (err) {
      console.error('Error refreshing portal database logic:', err);
      bookingsListViewport.innerHTML = `<p style="color:hsl(6, 70%, 55%); text-align:center;">Failed to access DB records.</p>`;
      showToast('Failed to load database records', 'error');
    }
  }

  function renderList() {
    const query = activeSearch.toLowerCase().trim();
    
    // Apply filters
    const filtered = activeBookings.filter(b => {
      const matchesSearch = b.clientName.toLowerCase().includes(query) || b.clientEmail.toLowerCase().includes(query);
      const matchesStatus = activeStatusFilter === 'all' || b.status === activeStatusFilter;
      return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
      bookingsListViewport.innerHTML = `
        <p style="text-align:center; color:var(--text-muted); font-style:italic; padding:40px 0;">No matching records found.</p>
      `;
      return;
    }

    // Sort descending (newest first)
    const sorted = [...filtered].sort((a,b) => b.timestamp - a.timestamp);

    bookingsListViewport.innerHTML = sorted.map(b => {
      const formattedDate = new Date(b.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const isActive = selectedBooking && selectedBooking.id === b.id ? 'active' : '';
      
      return `
        <div class="workspace-list-item ${isActive}" data-id="${b.id}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <strong style="color:var(--text-main); font-size:0.95rem;">${b.clientName}</strong>
            <span class="status-badge badge-${b.status.toLowerCase()}">${b.status}</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">${b.serviceTitle}</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Scheduled: ${b.date} • ${b.time}</div>
          <div style="font-size:0.75rem; text-align:right; color:var(--text-muted); margin-top:2px;">Logged: ${formattedDate}</div>
        </div>
      `;
    }).join('');

    // Bind list clicks
    const items = bookingsListViewport.querySelectorAll('.workspace-list-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const record = activeBookings.find(b => b.id === id);
        if (record) {
          selectedBooking = record;
          
          // Toggle active class visually
          items.forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          renderDetails(record);
        }
      });
    });
  }

  function renderEmptyState() {
    selectedBooking = null;
    detailsViewport.innerHTML = `
      <div class="details-empty-state">
        <div style="font-size:3rem; margin-bottom:16px;" aria-hidden="true">📁</div>
        <h3>Review Client Case</h3>
        <p>Select a consultation record from the list to update progress, log internal notes, and write response coordinates.</p>
      </div>
    `;
  }

  function renderDetails(b) {
    const formattedLogDate = new Date(b.timestamp).toLocaleString();
    const cleanNote = sanitizeHTML(b.note);
    const cleanClinicianResponse = sanitizeHTML(b.clinicianResponse);

    detailsViewport.innerHTML = `
      <div class="details-card">
        <div class="details-header">
          <div>
            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600; display:block;">CONFIDENTIAL REF: ${b.id}</span>
            <h2 style="margin: 4px 0 0 0; font-size:1.6rem;">${b.clientName}</h2>
            <a href="mailto:${b.clientEmail}" style="font-size:0.9rem; color:var(--primary);">${b.clientEmail}</a>
          </div>
          <span class="status-badge badge-${b.status.toLowerCase()}" style="font-size:0.9rem; padding:6px 14px;">${b.status}</span>
        </div>

        <div style="margin-top:24px; border-bottom:1px solid var(--border-color); padding-bottom:20px;">
          <h4 style="margin-bottom:12px;">Consultation Schedule</h4>
          <table class="details-info-table">
            <tr>
              <td><strong>Service:</strong></td>
              <td>${b.serviceTitle}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong></td>
              <td>${b.date}</td>
            </tr>
            <tr>
              <td><strong>Time Slot:</strong></td>
              <td>${b.time}</td>
            </tr>
            <tr>
              <td><strong>Request Timestamp:</strong></td>
              <td>${formattedLogDate}</td>
            </tr>
          </table>
        </div>

        <!-- Intake notes -->
        <div style="margin-top:20px; border-bottom:1px solid var(--border-color); padding-bottom:20px;">
          <h4 style="margin-bottom:8px;">Client Intake Statement</h4>
          <div style="background-color:var(--bg-main); padding:16px; border-radius:var(--radius-sm); font-size:0.95rem; font-style:italic;">
            "${cleanNote || 'No custom intake statement provided by the client.'}"
          </div>
        </div>

        <!-- Admin Response Forms -->
        <form id="details-response-form" style="margin-top:24px;" novalidate>
          <h4 style="margin-bottom:16px;">Coordinate Support & Response</h4>
          
          <div class="form-group">
            <label for="detail-status-select">Consultation Status</label>
            <select id="detail-status-select" class="form-control">
              <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending Review</option>
              <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirm Booking</option>
              <option value="Responded" ${b.status === 'Responded' ? 'selected' : ''}>Mark Responded</option>
              <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancel Request</option>
            </select>
          </div>

          <div class="form-group">
            <label for="detail-clinician-notes">Clinician Case Notes (Internal Only)</label>
            <textarea id="detail-clinician-notes" class="form-control" style="min-height:100px;" placeholder="Add private clinical reflections or tracking coordinates...">${cleanClinicianResponse}</textarea>
          </div>

          <div class="form-group">
            <label for="simulated-email-draft">Draft Client Response Email (Simulated)</label>
            <textarea id="simulated-email-draft" class="form-control" style="min-height:100px; font-family:monospace; font-size:0.9rem;" placeholder="To: ${b.clientEmail}\nSubject: Re: Consultation for ${b.serviceTitle}\n\nHi ${b.clientName.split(' ')[0]},\n\nWe have received your intake details..."></textarea>
          </div>

          <button type="submit" class="btn btn-accent" style="width:100%;">Save Case Updates</button>
        </form>
      </div>
    `;

    // Bind save click
    const detailsForm = detailsViewport.querySelector('#details-response-form');
    detailsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const newStatus = detailsForm.querySelector('#detail-status-select').value;
      const newNotes = detailsForm.querySelector('#detail-clinician-notes').value.trim();

      const updatedRecord = {
        ...b,
        status: newStatus,
        clinicianResponse: newNotes
      };

      try {
        await updateRecord('bookings', updatedRecord);
        // Alert success
        showToast('Case updates saved securely', 'success');
        const btnSave = detailsForm.querySelector('button[type="submit"]');
        btnSave.textContent = 'Changes Saved! ✓';
        btnSave.classList.replace('btn-accent', 'btn-primary');
        
        // Refresh listings and details panel
        await refreshData();

        setTimeout(() => {
          if (container.querySelector('#details-response-form')) {
            const reBtn = container.querySelector('#details-response-form button[type="submit"]');
            if (reBtn) {
              reBtn.textContent = 'Save Case Updates';
              reBtn.classList.replace('btn-primary', 'btn-accent');
            }
          }
        }, 1500);

      } catch (err) {
        console.error('Failed to update booking:', err);
        showToast('Database save failed', 'error');
      }
    });
  }

  // Bind Search events
  searchInput.addEventListener('input', (e) => {
    activeSearch = e.target.value;
    renderList();
  });

  // Bind Status filters clicks
  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeStatusFilter = tab.dataset.status;
      renderList();
    });
  });

  // Initial Data load
  await refreshData();
}

function injectLockStyles() {
  const styleId = 'dashboard-lock-styles';
  if (document.getElementById(styleId)) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    .lock-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 48px 36px;
      box-shadow: var(--shadow-md);
      text-align: center;
      transition: background-color var(--transition-normal);
    }
    
    .lock-icon-wrapper {
      font-size: 3rem;
      margin-bottom: 16px;
      display: inline-block;
    }
  `;
  document.head.appendChild(styleSheet);
}

function injectPortalStyles() {
  const styleId = 'dashboard-portal-styles';
  if (document.getElementById(styleId)) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    .dashboard-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    /* Metrics Grid */
    .dashboard-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .metric-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 24px;
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: background-color var(--transition-normal);
    }

    .metric-val {
      font-family: var(--font-display);
      font-size: 2.2rem;
      font-weight: 700;
      display: block;
      color: var(--text-main);
      line-height: 1.1;
      margin-bottom: 6px;
    }

    .metric-lbl {
      font-size: 0.85rem;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.02em;
    }

    /* Workspace */
    .dashboard-workspace {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 32px;
      align-items: start;
    }

    /* Left col listing */
    .workspace-list-col {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: var(--shadow-sm);
      transition: background-color var(--transition-normal);
    }

    .status-tab {
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      padding: 6px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      flex: 1;
      transition: all var(--transition-fast);
      font-family: var(--font-body);
    }

    .status-tab.active, .status-tab:hover {
      background-color: var(--primary-glow);
      color: var(--primary-dark);
      border-color: var(--primary);
    }
    
    [data-theme="dark"] .status-tab.active {
      color: var(--text-main);
    }

    .workspace-list-container {
      max-height: 480px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-right: 4px;
    }

    .workspace-list-item {
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 16px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .workspace-list-item:hover {
      border-color: var(--primary-light);
      transform: translateY(-2px);
    }

    .workspace-list-item.active {
      border-color: var(--primary);
      background-color: var(--primary-glow);
    }

    /* Status Badges */
    .status-badge {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
    }

    .badge-pending {
      background-color: hsla(24, 82%, 58%, 0.12);
      color: hsl(24, 75%, 45%);
    }

    .badge-confirmed {
      background-color: hsla(150, 40%, 45%, 0.12);
      color: hsl(150, 40%, 30%);
    }
    
    [data-theme="dark"] .badge-confirmed {
      color: hsl(150, 40%, 75%);
    }

    .badge-responded {
      background-color: hsla(210, 25%, 34%, 0.12);
      color: hsl(210, 25%, 30%);
    }
    
    [data-theme="dark"] .badge-responded {
      color: hsl(210, 25%, 75%);
    }

    .badge-cancelled {
      background-color: hsla(6, 70%, 55%, 0.12);
      color: hsl(6, 70%, 45%);
    }

    /* Details Right Col */
    .workspace-details-col {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 40px;
      min-height: 520px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      transition: background-color var(--transition-normal);
    }

    .details-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 100%;
      margin: auto;
      max-width: 400px;
      color: var(--text-muted);
    }

    .details-empty-state h3 {
      color: var(--text-main);
      margin-bottom: 8px;
    }

    .details-card {
      width: 100%;
      height: 100%;
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 20px;
    }

    .details-info-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    .details-info-table td {
      padding: 6px 0;
      color: var(--text-main);
    }

    .details-info-table td:first-child {
      width: 150px;
      color: var(--text-muted);
    }

    /* Responsive */
    @media (max-width: 900px) {
      .dashboard-workspace {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      .workspace-details-col {
        min-height: auto;
        padding: 24px;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
