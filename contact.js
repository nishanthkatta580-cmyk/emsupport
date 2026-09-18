import { services } from '../data.js';
import { validators, sanitizeHTML, showToast } from '../utils.js';
import { addRecord } from '../db.js';

export function renderContact(container, params) {
  // Pre-select service from URL parameter
  let preselectedServiceId = params && params.service ? params.service : '';
  const matchedService = services.find(s => s.id === preselectedServiceId);

  // Set initial wizard step. If service was preselected, skip step 1
  let currentStep = matchedService ? 2 : 1;

  // Set default date range limits (no booking in the past)
  const todayStr = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <section class="section-padding" aria-labelledby="contact-page-title">
      <div class="container">
        
        <div class="section-header">
          <span class="hero-eyebrow">Get in touch</span>
          <h1 id="contact-page-title">Schedule Support</h1>
          <p>Book a consultation slot directly in our calendar or send an inquiry. All communications are strictly confidential.</p>
        </div>

        <div class="booking-container">
          
          <!-- Step Indicators -->
          <div class="wizard-steps" role="navigation" aria-label="Booking steps">
            <div class="wizard-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}" data-step="1">1</div>
            <div class="wizard-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}" data-step="2">2</div>
            <div class="wizard-step ${currentStep >= 3 ? 'active' : ''}" data-step="3">3</div>
          </div>

          <!-- Screen Reader announcements for wizard steps -->
          <div id="step-announcement" class="visually-hidden" aria-live="assertive">Step ${currentStep} of 3</div>

          <form id="appointment-wizard-form" novalidate>
            
            <!-- PANEL 1: Service Selection -->
            <div class="wizard-panel ${currentStep === 1 ? 'active' : ''}" id="panel-1">
              <h3 style="margin-bottom:20px; text-align:center;">Select Support Service</h3>
              <div class="form-group" id="service-select-group">
                <div class="options-grid">
                  ${services.map(s => `
                    <div class="option-selector ${preselectedServiceId === s.id ? 'selected' : ''}" data-service-id="${s.id}">
                      <input type="radio" name="booking-service" value="${s.id}" ${preselectedServiceId === s.id ? 'checked' : ''}>
                      <span>${s.title}</span>
                      <small style="display:block; font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${s.duration}</small>
                    </div>
                  `).join('')}
                </div>
                <div class="form-error" id="service-select-error" style="text-align:center; margin-top:16px;">Please choose a support service to proceed.</div>
              </div>
            </div>

            <!-- PANEL 2: Date & Time selection -->
            <div class="wizard-panel ${currentStep === 2 ? 'active' : ''}" id="panel-2">
              <h3 style="margin-bottom:20px; text-align:center;">Choose Date & Time Slot</h3>
              
              <div class="form-group" id="date-group">
                <label for="booking-date">Available Date</label>
                <input type="date" id="booking-date" class="form-control" min="${todayStr}" required>
                <div class="form-error">Please select a valid future date (Monday – Saturday).</div>
              </div>

              <div class="form-group" id="time-group">
                <label>Available Time Slots</label>
                <div class="slots-grid" id="slots-container">
                  <button type="button" class="slot-btn" data-time="09:00 AM">09:00 AM</button>
                  <button type="button" class="slot-btn" data-time="10:30 AM">10:30 AM</button>
                  <button type="button" class="slot-btn" data-time="01:00 PM">01:00 PM</button>
                  <button type="button" class="slot-btn" data-time="02:30 PM">02:30 PM</button>
                  <button type="button" class="slot-btn" data-time="04:00 PM">04:00 PM</button>
                </div>
                <div class="form-error" id="time-select-error">Please select an available time slot.</div>
              </div>
            </div>

            <!-- PANEL 3: Personal Intake Information -->
            <div class="wizard-panel ${currentStep === 3 ? 'active' : ''}" id="panel-3">
              <h3 style="margin-bottom:20px; text-align:center;">Secure Personal Intake</h3>
              
              <div class="form-control-row">
                <div class="form-group" id="name-group">
                  <label for="client-name">Full Name</label>
                  <input type="text" id="client-name" class="form-control" placeholder="Jane Doe" required>
                  <div class="form-error">Please enter your name.</div>
                </div>

                <div class="form-group" id="email-group">
                  <label for="client-email">Email Address</label>
                  <input type="email" id="client-email" class="form-control" placeholder="jane@example.com" required>
                  <div class="form-error">Please enter a valid email address.</div>
                </div>
              </div>

              <div class="form-group">
                <label for="client-note">Optional Note (Safe & Confidential)</label>
                <textarea id="client-note" class="form-control" style="min-height:80px;" placeholder="Brief details regarding your counseling request..."></textarea>
              </div>
            </div>

            <!-- Navigation Controls -->
            <div class="wizard-navigation">
              <button type="button" id="btn-wizard-back" class="btn btn-secondary" style="visibility: ${currentStep > 1 ? 'visible' : 'hidden'};">Back</button>
              <button type="button" id="btn-wizard-next" class="btn btn-accent">${currentStep === 3 ? 'Confirm Request' : 'Next Step'}</button>
            </div>

          </form>

        </div>

      </div>
    </section>
  `;

  // Bind Event Listeners
  initWizardLogic(container, currentStep, preselectedServiceId);
}

/**
 * Orchestrates Wizard transition, selections, and fields validators.
 */
function initWizardLogic(container, initialStep, initialServiceId) {
  const form = container.querySelector('#appointment-wizard-form');
  const btnBack = container.querySelector('#btn-wizard-back');
  const btnNext = container.querySelector('#btn-wizard-next');
  const stepIndicators = container.querySelectorAll('.wizard-step');
  const panels = container.querySelectorAll('.wizard-panel');
  const stepAnnounce = container.querySelector('#step-announcement');
  
  // Selection States
  let currentStep = initialStep;
  let selectedServiceId = initialServiceId;
  let selectedTimeSlot = '';

  // Selectors DOM
  const serviceSelectors = container.querySelectorAll('.option-selector');
  const timeSlotBtns = container.querySelectorAll('.slot-btn');
  const dateInput = container.querySelector('#booking-date');
  const nameInput = container.querySelector('#client-name');
  const emailInput = container.querySelector('#client-email');
  const noteInput = container.querySelector('#client-note');

  // Step 1: Radio button card selectors click
  serviceSelectors.forEach(sel => {
    sel.addEventListener('click', () => {
      serviceSelectors.forEach(s => s.classList.remove('selected'));
      sel.classList.add('selected');
      
      const radio = sel.querySelector('input[type="radio"]');
      radio.checked = true;
      selectedServiceId = radio.value;

      // Clear error trigger
      container.querySelector('#service-select-group').classList.remove('has-error');
    });
  });

  // Step 2: Time slot button selectors click
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTimeSlot = btn.dataset.time;

      // Clear error trigger
      container.querySelector('#time-group').classList.remove('has-error');
    });
  });

  // Back Button Navigation
  btnBack.addEventListener('click', () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  // Next/Confirm Button Navigation
  btnNext.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        goToStep(currentStep + 1);
      } else {
        submitBooking();
      }
    }
  });

  /**
   * Switches panels active views.
   */
  function goToStep(step) {
    currentStep = step;
    
    // Manage panels visible states
    panels.forEach((p, idx) => {
      if (idx + 1 === currentStep) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Update Steps Indicators classes
    stepIndicators.forEach((ind, idx) => {
      const stepNum = idx + 1;
      ind.className = 'wizard-step';
      if (stepNum === currentStep) {
        ind.classList.add('active');
      } else if (stepNum < currentStep) {
        ind.classList.add('completed');
      }
    });

    // Screen reader announce page state
    stepAnnounce.textContent = `Step ${currentStep} of 3: ${getStepTitle(currentStep)}`;

    // Manage Nav buttons visibility/text
    btnBack.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
    btnNext.textContent = currentStep === 3 ? 'Confirm Request' : 'Next Step';
  }

  function getStepTitle(step) {
    if (step === 1) return "Select Support Service";
    if (step === 2) return "Choose Date and Time Slot";
    return "Secure Personal Intake";
  }

  /**
   * Field validation routines.
   */
  function validateStep(step) {
    let isValid = true;

    if (step === 1) {
      if (!selectedServiceId) {
        container.querySelector('#service-select-group').classList.add('has-error');
        isValid = false;
      }
    } else if (step === 2) {
      // Validate Date
      const dateVal = dateInput.value;
      const isFuture = validators.futureDate(dateVal);
      const dateGroup = container.querySelector('#date-group');
      
      if (!dateVal || !isFuture) {
        dateGroup.classList.add('has-error');
        isValid = false;
      } else {
        dateGroup.classList.remove('has-error');
      }

      // Validate Time
      const timeGroup = container.querySelector('#time-group');
      if (!selectedTimeSlot) {
        timeGroup.classList.add('has-error');
        isValid = false;
      } else {
        timeGroup.classList.remove('has-error');
      }
    } else if (step === 3) {
      // Validate Name
      const nameGroup = container.querySelector('#name-group');
      if (!validators.required(nameInput.value)) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // Validate Email
      const emailGroup = container.querySelector('#email-group');
      if (!validators.email(emailInput.value)) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }
    }

    return isValid;
  }

  /**
   * Submits booking data and replaces the wizard with a checkmark.
   */
  function submitBooking() {
    // Generate mock reference
    const referenceId = `ES-${Math.floor(10000 + Math.random() * 90000)}`;
    const matchedService = services.find(s => s.id === selectedServiceId);
    
    // Sanitize user inputs
    const cleanName = sanitizeHTML(nameInput.value);
    const cleanEmail = sanitizeHTML(emailInput.value);
    const cleanNote = sanitizeHTML(noteInput.value);
    
    // Capture details inside logs for testing
    const bookingDetails = {
      id: referenceId,
      serviceId: selectedServiceId,
      serviceTitle: matchedService.title,
      date: dateInput.value,
      time: selectedTimeSlot,
      clientName: cleanName,
      clientEmail: cleanEmail,
      note: cleanNote,
      status: 'Pending',
      clinicianResponse: '',
      timestamp: Date.now()
    };

    btnNext.setAttribute('disabled', 'true');
    btnNext.textContent = 'Saving...';

    addRecord('bookings', bookingDetails)
      .then(() => {
        showToast('Request completed successfully', 'success');
        // Swap booking card layout with confirmation screen
        const wizardBox = container.querySelector('.booking-container');
        wizardBox.innerHTML = `
          <div class="booking-success-card" aria-live="polite">
            <div class="success-check-icon" aria-hidden="true">✓</div>
            <h2>Request Received Securely</h2>
            <p class="lead" style="max-width:550px; margin: 0 auto 24px auto;">Thank you, <strong>${cleanName}</strong>. Your request for <strong>${matchedService.title}</strong> has been logged in our clinic database.</p>
            
            <div style="background-color: var(--bg-main); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: left; max-width:480px; margin: 0 auto 32px auto;">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
                <span style="color:var(--text-muted);">Confidential Code:</span>
                <strong style="color:var(--text-main); font-family:var(--font-display);">${referenceId}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
                <span style="color:var(--text-muted);">Consultation Date:</span>
                <strong style="color:var(--text-main);">${dateInput.value}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
                <span style="color:var(--text-muted);">Time Slot:</span>
                <strong style="color:var(--text-main);">${selectedTimeSlot} (IST)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                <span style="color:var(--text-muted);">Intake Email:</span>
                <strong style="color:var(--text-main);">${cleanEmail}</strong>
              </div>
            </div>

            <p style="font-size:0.9rem; color:var(--text-muted); max-width:500px; margin: 0 auto 24px auto;">Our clinical team will review your inquiry details. An encrypted confirmation reply will be dispatched to your email address within 24 business hours.</p>
            
            <a href="#/home" class="btn btn-primary">Return to Home</a>
          </div>
        `;
      })
      .catch(err => {
        console.error('Failed to log booking in DB:', err);
        btnNext.removeAttribute('disabled');
        btnNext.textContent = 'Confirm Request';
        showToast('Database transaction failed. Please try again.', 'error');
      });
  }
}

