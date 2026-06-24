const STORAGE_REPORT_KEY = 'equalvoice_reports_v1';
const STORAGE_CONTACT_KEY = 'equalvoice_contacts_v1';

const INCIDENT_TYPES = [
  'Workplace discrimination',
  'School discrimination',
  'Harassment',
  'Gender-based violence',
  'LGBTQ discrimination',
  'Other',
];

const RECOMMENDATIONS = {
  'Workplace discrimination': [
    'Document the incident details and any witnesses.',
    'Review your company or school policy on discrimination.',
    'Consider discussing it with trusted HR or support staff.',
  ],
  'School discrimination': [
    'Preserve any written communication or records.',
    'Contact a counselor or ombudsperson for guidance.',
    'Ask about formal school complaint procedures.',
  ],
  Harassment: [
    'Set clear boundaries when it is safe to do so.',
    'Save messages, images, or any evidence.',
    'Reach out to a trusted advocate or counselor.',
  ],
  'Gender-based violence': [
    'Seek immediate help from health or emergency services.',
    'Do not delete evidence before speaking to a support worker.',
    'Use a safe reporting channel if you are in immediate danger.',
  ],
  'LGBTQ discrimination': [
    'Identify safe allies and community organizations.',
    'Record events with dates, names, and locations.',
    'Use confidential reporting options where available.',
  ],
  Other: [
    'Collect details and share them with a trusted person.',
    'Keep evidence in a secure location.',
    'Report to the appropriate support network for your situation.',
  ],
};

const backend = {
  init() {
    console.log('Backend placeholder: configure Firebase or Supabase here.');
  },
  async syncReport(report) {
    if (window.firebase) {
      // Future: upload report to Firestore and secure storage.
    }
    if (window.supabase) {
      // Future: push report to Supabase table and storage.
    }
    return Promise.resolve(report);
  },
};

function loadReports() {
  const stored = window.localStorage.getItem(STORAGE_REPORT_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveReports(reports) {
  window.localStorage.setItem(STORAGE_REPORT_KEY, JSON.stringify(reports));
}

function createReportId() {
  return `rpt_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function updateStepProgress(stepIndex, steps) {
  // Deprecated: no longer used with flexible form
}

function renderRecommendation(type) {
  // Deprecated: recommendations now updated dynamically
}

function validateStep(stepIndex) {
  // Deprecated: no longer using step validation
}

function initReportPage() {
  const form = document.getElementById('incidentReportForm');
  if (!form) return;

  const fileInput = document.getElementById('incidentEvidence');
  const fileList = document.getElementById('evidenceList');
  const fileUploadArea = document.querySelector('.file-upload-area');
  const anonymousInput = document.getElementById('anonymousReport');
  const statusBanner = document.getElementById('reportStatusBanner');
  const recommendationsSection = document.getElementById('recommendationsSection');
  const recommendationList = document.getElementById('recommendationList');

  // Handle file upload area click
  if (fileUploadArea && fileInput) {
    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUploadArea.style.backgroundColor = 'rgba(212, 109, 228, 0.1)';
    });
    fileUploadArea.addEventListener('dragleave', () => {
      fileUploadArea.style.backgroundColor = 'transparent';
    });
    fileUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUploadArea.style.backgroundColor = 'transparent';
      fileInput.files = e.dataTransfer.files;
      updateFileList();
    });
  }

  function updateFileList() {
    const files = fileInput.files;
    if (files.length === 0) {
      fileList.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 1rem;">No files selected yet</div>';
    } else {
      fileList.innerHTML = Array.from(files)
        .map((file, index) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(255,255,255,0.04); border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span>${file.type.includes('image') ? '🖼️' : '📄'}</span>
              <div>
                <div style="font-weight: 500;">${file.name}</div>
                <div style="color: var(--text-muted); font-size: 0.85rem;">${(file.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            <button type="button" data-file-index="${index}" class="remove-file-btn" style="background: rgba(255,107,107,0.2); color: var(--danger); border: none; border-radius: 6px; padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.85rem;">Remove</button>
          </div>
        `)
        .join('');
      
      // Add remove file listeners
      document.querySelectorAll('.remove-file-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const index = parseInt(btn.dataset.fileIndex);
          const dt = new DataTransfer();
          Array.from(files).forEach((file, i) => {
            if (i !== index) dt.items.add(file);
          });
          fileInput.files = dt.files;
          updateFileList();
          updateSummary();
        });
      });
    }
    updateSummary();
  }

  function updateSummary() {
    const selectedTypes = Array.from(document.querySelectorAll('input[name="incidentType"]:checked'))
      .map(cb => cb.value);
    
    document.getElementById('summaryTypes').textContent = selectedTypes.length > 0 
      ? selectedTypes.join(', ') 
      : 'Not selected';
    
    document.getElementById('summaryAnonymous').textContent = anonymousInput.checked ? 'Yes' : 'No';
    
    const fileCount = fileInput.files.length;
    document.getElementById('summaryFileCount').textContent = fileCount > 0 
      ? `${fileCount} file${fileCount !== 1 ? 's' : ''}`
      : '0 files';

    // Update recommendations based on selected types
    updateRecommendations(selectedTypes);
  }

  function updateRecommendations(types) {
    if (types.length === 0) {
      recommendationsSection.style.display = 'none';
      return;
    }

    recommendationsSection.style.display = 'block';
    const allRecommendations = new Set();
    types.forEach(type => {
      const recs = RECOMMENDATIONS[type] || RECOMMENDATIONS.Other;
      recs.forEach(rec => allRecommendations.add(rec));
    });

    recommendationList.innerHTML = Array.from(allRecommendations)
      .map(rec => `<li>${rec}</li>`)
      .join('');
  }

  // File input change listener
  fileInput.addEventListener('change', updateFileList);

  // Summary update listeners
  document.querySelectorAll('input[name="incidentType"], #anonymousReport').forEach(input => {
    input.addEventListener('change', updateSummary);
  });

  // Form submission
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const selectedTypes = Array.from(document.querySelectorAll('input[name="incidentType"]:checked'))
      .map(cb => cb.value);

    const report = {
      id: createReportId(),
      createdAt: Date.now(),
      types: selectedTypes,
      name: document.getElementById('reporterName').value.trim() || 'Anonymous',
      email: document.getElementById('reporterEmail').value.trim() || '',
      phone: document.getElementById('reporterPhone').value.trim() || '',
      date: document.getElementById('incidentDate').value || '',
      location: document.getElementById('incidentLocation').value.trim() || '',
      description: document.getElementById('incidentDescription').value.trim() || '',
      witnesses: document.getElementById('incidentWitnesses').value.trim() || '',
      anonymous: anonymousInput.checked,
      evidence: Array.from(fileInput.files).map(file => file.name),
      supportNeeds: Array.from(document.querySelectorAll('input[name="support"]:checked'))
        .map(cb => cb.value),
      status: 'Submitted',
      recommendedActions: RECOMMENDATIONS[selectedTypes[0]] || RECOMMENDATIONS.Other,
    };

    const reports = loadReports();
    reports.unshift(report);
    saveReports(reports);
    await backend.syncReport(report);

    statusBanner.style.display = 'block';
    statusBanner.textContent = '✓ Report submitted successfully! You can review it in My Reports.';
    statusBanner.className = 'status-banner success';
    statusBanner.setAttribute('aria-live', 'polite');

    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      fileInput.value = '';
      updateFileList();
      updateSummary();
      statusBanner.style.display = 'none';
    }, 2000);
  });

  // Initial summary update
  updateSummary();
}

function renderReports() {
  const container = document.getElementById('reportList');
  const emptyState = document.getElementById('noReportsState');
  if (!container || !emptyState) return;

  const reports = loadReports();
  if (!reports.length) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  container.innerHTML = reports.map(report => {
    const statusClass = report.status === 'Resolved' ? 'resolved' : report.status === 'Submitted' ? 'submitted' : 'review';
    const evidenceCount = report.evidence?.length || 0;
    const types = Array.isArray(report.types) ? report.types.join(', ') : report.type || 'Unknown';
    return `
      <article class="report-card" aria-label="Report ${types}">
        <div class="report-header">
          <div>
            <p class="card-title">${types}</p>
            <p class="report-meta">${formatDate(report.createdAt)} · ${report.anonymous ? 'Anonymous' : 'Identified'}</p>
          </div>
          <span class="status-pill ${statusClass}">${report.status}</span>
        </div>
        <div class="report-details">
          ${report.date ? `<p><strong>Date:</strong> ${report.date}</p>` : ''}
          ${report.location ? `<p><strong>Location:</strong> ${report.location}</p>` : ''}
          ${report.description ? `<p><strong>Description:</strong> ${report.description}</p>` : ''}
          ${report.witnesses ? `<p><strong>Witnesses:</strong> ${report.witnesses}</p>` : ''}
          <p><strong>Evidence:</strong> ${evidenceCount} item(s)</p>
          ${report.supportNeeds?.length > 0 ? `<p><strong>Support Needed:</strong> ${report.supportNeeds.join(', ')}</p>` : ''}
        </div>
      </article>`;
  }).join('');
}

function initMyReportsPage() {
  renderReports();
}

function initEmergencyPage() {
  const alertButton = document.getElementById('sendAlertButton');
  const statusOutput = document.getElementById('emergencyStatus');
  const geoStatus = document.getElementById('geoStatus');
  const contactName = document.getElementById('trustedContactName');
  const contactInfo = document.getElementById('trustedContactInfo');

  if (!alertButton) return;

  function updateStatus(message, isError = false) {
    statusOutput.textContent = message;
    statusOutput.className = `status-banner ${isError ? 'error' : 'success'}`;
    statusOutput.setAttribute('aria-live', 'polite');
  }

  function saveTrustedContact() {
    const contact = {
      name: contactName.value.trim(),
      info: contactInfo.value.trim(),
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(STORAGE_CONTACT_KEY, JSON.stringify(contact));
    return contact;
  }

  function loadTrustedContact() {
    const stored = window.localStorage.getItem(STORAGE_CONTACT_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  const savedContact = loadTrustedContact();
  if (savedContact) {
    contactName.value = savedContact.name;
    contactInfo.value = savedContact.info;
  }

  if (!navigator.geolocation) {
    geoStatus.textContent = 'Geolocation is unavailable in this browser. Use the contact alert safely or access emergency services directly.';
    geoStatus.className = 'status-banner error';
  }

  alertButton.addEventListener('click', () => {
    const name = contactName.value.trim();
    const info = contactInfo.value.trim();
    if (!name || !info) {
      updateStatus('Add at least one trusted contact name and phone or email before sending an alert.', true);
      return;
    }

    const contact = saveTrustedContact();
    if (!navigator.geolocation) {
      updateStatus(`Alert prepared for ${contact.name}. Unable to attach location from this browser.`, false);
      return;
    }

    geoStatus.textContent = 'Acquiring location…';
    geoStatus.className = 'status-banner';

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        geoStatus.textContent = `Location captured: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${accuracy}m).`;
        updateStatus(`Trusted alert sent to ${contact.name}. If this were connected to a backend, your contact and safety services would receive your current location.`);
      },
      () => {
        geoStatus.textContent = 'Could not capture location. Share your location with your trusted contact manually if it is safe to do so.';
        geoStatus.className = 'status-banner error';
        updateStatus(`Alert saved for ${contact.name}. Location was unavailable, but your trusted contact details are stored securely in your browser.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function initGlobalLinks() {
  const versionNote = document.getElementById('platformVersion');
  if (versionNote) {
    versionNote.textContent = 'MVP platform ready';
  }
}

function initApp() {
  backend.init();
  initGlobalLinks();
  initReportPage();
  initMyReportsPage();
  initEmergencyPage();
}

document.addEventListener('DOMContentLoaded', initApp);
