/**
 * QuantSplit — Premium Futuristic Bill Splitter Engine
 * Pure Vanilla JavaScript · Zero External Libraries
 */

(function () {
  'use strict';

  // Constants & Storage Keys
  const STORAGE_KEY = 'quantsplit_v2_storage';
  const THEME_KEY = 'quantsplit_theme';
  const PROFILE_KEY = 'quantsplit_user_profile';

  const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #06b6d4, #0284c7)',
    'linear-gradient(135deg, #8b5cf6, #6366f1)',
    'linear-gradient(135deg, #ec4899, #db2777)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'linear-gradient(135deg, #14b8a6, #0f766e)',
    'linear-gradient(135deg, #f43f5e, #e11d48)',
  ];

  // DOM Elements — Inputs & Form
  const form = document.getElementById('splitterForm');
  const occasionInput = document.getElementById('occasionInput');
  const billInput = document.getElementById('billInput');
  const peopleInput = document.getElementById('peopleInput');
  const currencySelect = document.getElementById('currencySelect');
  const currencyPrefix = document.getElementById('currencyPrefix');
  const tipButtons = document.querySelectorAll('.tip-btn');
  const tipAmountDisplay = document.getElementById('tipAmountDisplay');
  const decrementPeopleBtn = document.getElementById('decrementPeople');
  const incrementPeopleBtn = document.getElementById('incrementPeople');
  const errorBanner = document.getElementById('errorBanner');
  const errorMessageText = document.getElementById('errorMessageText');
  const resetBtn = document.getElementById('resetBtn');

  // DOM Elements — Results View
  const emptyState = document.getElementById('emptyState');
  const resultsView = document.getElementById('resultsView');
  const displayOccasion = document.getElementById('displayOccasion');
  const displayParticipants = document.getElementById('displayParticipants');
  const displayTotalAmount = document.getElementById('displayTotalAmount');
  const displayTipSubtext = document.getElementById('displayTipSubtext');
  const verificationExplanation = document.getElementById('verificationExplanation');
  const distributionTrack = document.getElementById('distributionTrack');
  const paidProgressText = document.getElementById('paidProgressText');
  const sharesList = document.getElementById('sharesList');
  const copySummaryBtn = document.getElementById('copySummaryBtn');
  const copyBtnLabel = document.getElementById('copyBtnLabel');
  const shareLinkBtn = document.getElementById('shareLinkBtn');
  const shareBtnLabel = document.getElementById('shareBtnLabel');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // DOM Elements — Theme & Profile
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeStatusText = document.getElementById('themeStatusText');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const mobileThemeStatusText = document.getElementById('mobileThemeStatusText');

  const profileBtn = document.getElementById('profileBtn');
  const mobileProfileBtn = document.getElementById('mobileProfileBtn');
  const navAvatarPreview = document.getElementById('navAvatarPreview');
  const mobileNavAvatarPreview = document.getElementById('mobileNavAvatarPreview');

  const profileModalOverlay = document.getElementById('profileModalOverlay');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeProfileModal = document.getElementById('closeProfileModal');
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  const profileSettingsForm = document.getElementById('profileSettingsForm');
  const profileNameInput = document.getElementById('profileNameInput');
  const profileHandleInput = document.getElementById('profileHandleInput');
  const avatarPalettePicker = document.getElementById('avatarPalettePicker');
  const modalAvatarBadge = document.getElementById('modalAvatarBadge');
  const defaultCurrencySelect = document.getElementById('defaultCurrencySelect');
  const defaultTipSelect = document.getElementById('defaultTipSelect');
  const autoFlipSetting = document.getElementById('autoFlipSetting');
  const celebrationSparklesSetting = document.getElementById('celebrationSparklesSetting');
  const resetUserDataBtn = document.getElementById('resetUserDataBtn');

  // DOM Elements — 3D Page Flip System
  const calculatorLayout = document.getElementById('calculatorLayout');
  const tabFlipView = document.getElementById('tabFlipView');
  const tabDualView = document.getElementById('tabDualView');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageFlipBtn = document.getElementById('pageFlipBtn');
  const pageTab1 = document.getElementById('pageTab1');
  const pageTab2 = document.getElementById('pageTab2');
  const pageTab3 = document.getElementById('pageTab3');

  const formCard = document.getElementById('formCard');
  const resultsCard = document.getElementById('resultsCard');
  const ledgerCard = document.getElementById('ledgerCard');

  const cornerCurl1 = document.getElementById('cornerCurl1');
  const cornerCurl2 = document.getElementById('cornerCurl2');
  const cornerCurl3 = document.getElementById('cornerCurl3');

  const quickFlipToReceipt = document.getElementById('quickFlipToReceipt');
  const quickFlipToForm = document.getElementById('quickFlipToForm');
  const quickFlipToLedger = document.getElementById('quickFlipToLedger');
  const emptyFlipToForm = document.getElementById('emptyFlipToForm');
  const page1ToLedger = document.getElementById('page1ToLedger');
  const page2BackToForm = document.getElementById('page2BackToForm');
  const page2ToLedger = document.getElementById('page2ToLedger');
  const ledgerBackToShares = document.getElementById('ledgerBackToShares');
  const ledgerToShares = document.getElementById('ledgerToShares');
  const ledgerToSetup = document.getElementById('ledgerToSetup');

  // DOM Elements — Ledger Card (Page 3)
  const ledgerCollectedAmount = document.getElementById('ledgerCollectedAmount');
  const ledgerPendingAmount = document.getElementById('ledgerPendingAmount');
  const ledgerPaidCountText = document.getElementById('ledgerPaidCountText');
  const ledgerUnpaidCountText = document.getElementById('ledgerUnpaidCountText');
  const ledgerProgressPercent = document.getElementById('ledgerProgressPercent');
  const ledgerProgressBar = document.getElementById('ledgerProgressBar');
  const ledgerMembersList = document.getElementById('ledgerMembersList');
  const ledgerMarkAllPaidBtn = document.getElementById('ledgerMarkAllPaidBtn');
  const copyUnpaidReminderBtn = document.getElementById('copyUnpaidReminderBtn');

  // State
  let currentTipPercent = 0;
  let customNames = {};
  let paidStatus = {};
  let hasCalculated = false;
  let currentPage = 1; // 1 = Setup, 2 = Shares, 3 = Ledger
  let isFlipMode = true; // true = 3D Page Flip, false = Side-by-side
  let currentTheme = 'dark'; // 'dark' | 'light'

  // User Profile State
  let userProfile = {
    name: 'Alex Hunter',
    handle: 'alex_split',
    avatarIndex: 0,
    defaultCurrency: '$',
    defaultTip: 0,
    autoFlip: true,
    celebrationSparkles: true,
  };

  /* ==========================================================================
     1. Initialization & Reload Persistence (Requirement #5)
     ========================================================================== */
  function initState() {
    loadSavedState();
    setupThemeEngine();
    setupProfileEngine();
    setupEventListeners();
    setupPageFlipEngine();
    setupMagicBubblesEngine();
    setupDynamicText();
    setupScrollReveal();
    setupCounterAnimations();
    setupCardTilt();
    setupCustomCursor();
    setupButtonRipples();
    setupMobileNav();
    updateTipPreview();

    // If state had a valid calculation, render result and ledger
    if (hasCalculated) {
      const isValid = validateInputs(false);
      if (isValid) {
        renderSplit();
      } else {
        hasCalculated = false;
        showEmptyState();
        saveState();
      }
    } else {
      showEmptyState();
    }

    syncPageUI(currentPage);
  }

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        occasionInput.value = 'Cyber Rooftop Dinner';
        billInput.value = '120.00';
        peopleInput.value = '3';
        return;
      }

      const data = JSON.parse(raw);
      if (data.occasion !== undefined) occasionInput.value = data.occasion;
      if (data.bill !== undefined) billInput.value = data.bill;
      if (data.people !== undefined) peopleInput.value = data.people;
      if (data.currency) {
        currencySelect.value = data.currency;
        currencyPrefix.textContent = data.currency;
      }
      if (data.tipPercent !== undefined) {
        currentTipPercent = Number(data.tipPercent);
        tipButtons.forEach(btn => {
          btn.classList.toggle('active', Number(btn.dataset.tip) === currentTipPercent);
        });
      }
      if (data.customNames) customNames = data.customNames;
      if (data.paidStatus) paidStatus = data.paidStatus;
      if (data.hasCalculated !== undefined) hasCalculated = Boolean(data.hasCalculated);
      if (data.currentPage !== undefined) currentPage = Number(data.currentPage) || 1;
      if (data.isFlipMode !== undefined) isFlipMode = Boolean(data.isFlipMode);
    } catch (e) {
      console.warn('Storage parse error, resetting defaults', e);
    }
  }

  function saveState() {
    try {
      const data = {
        occasion: occasionInput.value,
        bill: billInput.value,
        people: peopleInput.value,
        currency: currencySelect.value,
        tipPercent: currentTipPercent,
        customNames,
        paidStatus,
        hasCalculated,
        currentPage,
        isFlipMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }

  /* ==========================================================================
     2. Light & Dark Theme Mode Engine
     ========================================================================== */
  function setupThemeEngine() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      currentTheme = savedTheme;
    } else {
      // Default to dark theme as per futuristic styling
      currentTheme = 'dark';
    }

    applyTheme(currentTheme);

    function toggleTheme() {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem(THEME_KEY, currentTheme);
      showToast(`Switched to ${currentTheme === 'light' ? 'Light' : 'Dark'} mode ✨`);
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggleBtn) {
      mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    if (themeStatusText) {
      themeStatusText.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
    if (mobileThemeStatusText) {
      mobileThemeStatusText.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', `Active: ${theme.toUpperCase()} mode (Click to toggle)`);
    }
  }

  /* ==========================================================================
     3. User Profile & Settings Engine
     ========================================================================== */
  function setupProfileEngine() {
    // Load profile from storage
    try {
      const rawProfile = localStorage.getItem(PROFILE_KEY);
      if (rawProfile) {
        userProfile = { ...userProfile, ...JSON.parse(rawProfile) };
      }
    } catch (e) {
      console.warn('Profile parse error', e);
    }

    updateNavbarProfileUI();

    // Open Modal
    function openModal() {
      if (!profileModalOverlay) return;
      profileNameInput.value = userProfile.name || '';
      profileHandleInput.value = userProfile.handle || '';
      defaultCurrencySelect.value = userProfile.defaultCurrency || '$';
      defaultTipSelect.value = String(userProfile.defaultTip || 0);
      autoFlipSetting.checked = Boolean(userProfile.autoFlip);
      celebrationSparklesSetting.checked = Boolean(userProfile.celebrationSparkles);

      renderAvatarSwatches();
      updateModalAvatarPreview();

      profileModalOverlay.classList.remove('hidden');
    }

    function closeModal() {
      if (!profileModalOverlay) return;
      profileModalOverlay.classList.add('hidden');
    }

    if (profileBtn) profileBtn.addEventListener('click', openModal);
    if (mobileProfileBtn) mobileProfileBtn.addEventListener('click', openModal);
    if (closeProfileModal) closeProfileModal.addEventListener('click', closeModal);
    if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileModalOverlay && !profileModalOverlay.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Save Profile Form
    if (profileSettingsForm) {
      profileSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        userProfile.name = profileNameInput.value.trim() || 'Alex Hunter';
        userProfile.handle = profileHandleInput.value.trim().replace(/^@/, '');
        userProfile.defaultCurrency = defaultCurrencySelect.value;
        userProfile.defaultTip = Number(defaultTipSelect.value);
        userProfile.autoFlip = autoFlipSetting.checked;
        userProfile.celebrationSparkles = celebrationSparklesSetting.checked;

        // Apply currency if changed
        if (currencySelect.value !== userProfile.defaultCurrency) {
          currencySelect.value = userProfile.defaultCurrency;
          currencyPrefix.textContent = userProfile.defaultCurrency;
        }

        try {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
        } catch (err) {
          console.warn('Profile save failed', err);
        }

        updateNavbarProfileUI();
        if (hasCalculated && validateInputs(false)) {
          renderSplit();
        }

        closeModal();
        showToast('Profile & settings saved successfully! 👤');
      });
    }

    // Reset All App Data
    if (resetUserDataBtn) {
      resetUserDataBtn.addEventListener('click', () => {
        const confirmed = confirm('Are you sure you want to reset all split history, participant names, and local settings?');
        if (confirmed) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(PROFILE_KEY);
          userProfile = {
            name: 'Alex Hunter',
            handle: 'alex_split',
            avatarIndex: 0,
            defaultCurrency: '$',
            defaultTip: 0,
            autoFlip: true,
            celebrationSparkles: true,
          };
          customNames = {};
          paidStatus = {};
          hasCalculated = false;
          occasionInput.value = 'Cyber Rooftop Dinner';
          billInput.value = '';
          peopleInput.value = '3';
          currentTipPercent = 0;
          tipButtons.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.tip) === 0));
          currencySelect.value = '$';
          currencyPrefix.textContent = '$';

          updateNavbarProfileUI();
          hideError();
          showEmptyState();
          updateTipPreview();
          turnToPage(1);
          closeModal();
          showToast('All app data has been restored to factory defaults');
        }
      });
    }
  }

  function renderAvatarSwatches() {
    if (!avatarPalettePicker) return;
    avatarPalettePicker.innerHTML = '';

    AVATAR_GRADIENTS.forEach((grad, idx) => {
      const swatch = document.createElement('div');
      swatch.className = `avatar-swatch ${userProfile.avatarIndex === idx ? 'active' : ''}`;
      swatch.style.background = grad;
      swatch.title = `Palette ${idx + 1}`;

      swatch.addEventListener('click', () => {
        userProfile.avatarIndex = idx;
        document.querySelectorAll('.avatar-swatch').forEach((s, i) => {
          s.classList.toggle('active', i === idx);
        });
        updateModalAvatarPreview();
      });

      avatarPalettePicker.appendChild(swatch);
    });
  }

  function updateModalAvatarPreview() {
    if (!modalAvatarBadge) return;
    const name = profileNameInput ? profileNameInput.value.trim() : userProfile.name;
    const initial = (name || 'A').charAt(0).toUpperCase();
    modalAvatarBadge.textContent = initial;
    modalAvatarBadge.style.background = AVATAR_GRADIENTS[userProfile.avatarIndex] || AVATAR_GRADIENTS[0];
  }

  function updateNavbarProfileUI() {
    const firstName = (userProfile.name || 'Alex').split(' ')[0];
    const initial = (userProfile.name || 'A').charAt(0).toUpperCase();
    const grad = AVATAR_GRADIENTS[userProfile.avatarIndex] || AVATAR_GRADIENTS[0];

    if (navAvatarPreview) {
      navAvatarPreview.textContent = initial;
      navAvatarPreview.style.background = grad;
      navAvatarPreview.title = `${userProfile.name} (${userProfile.handle ? '@' + userProfile.handle : 'Profile'})`;
    }
    if (mobileNavAvatarPreview) {
      mobileNavAvatarPreview.textContent = initial;
      mobileNavAvatarPreview.style.background = grad;
    }
  }

  /* ==========================================================================
     4. Validation Logic (Requirement #4)
     ========================================================================== */
  function validateInputs(showErrorInUI = true) {
    const rawBill = billInput.value.trim();
    const bill = parseFloat(rawBill);

    const rawPeople = peopleInput.value.trim();
    const people = parseInt(rawPeople, 10);

    const isBillEmpty = rawBill === '';
    const isBillInvalid = isNaN(bill) || bill <= 0;

    const isPeopleEmpty = rawPeople === '';
    const isPeopleInvalid = isNaN(people) || people <= 0;

    if ((isBillEmpty || isBillInvalid) && (isPeopleEmpty || isPeopleInvalid)) {
      if (showErrorInUI) {
        showError('Please enter both a valid bill amount greater than 0 and at least 1 person.');
      }
      return false;
    }

    if (isBillEmpty || isBillInvalid) {
      if (showErrorInUI) {
        showError('Please enter a bill amount greater than 0. Empty, zero, or negative amounts cannot be calculated.');
      }
      return false;
    }

    if (isPeopleEmpty || isPeopleInvalid) {
      if (showErrorInUI) {
        showError('Please enter at least 1 person. Number of people cannot be empty, zero, or negative.');
      }
      return false;
    }

    hideError();
    return true;
  }

  function showError(msg) {
    errorMessageText.textContent = msg;
    errorBanner.classList.remove('hidden');
    showEmptyState();
  }

  function hideError() {
    errorBanner.classList.add('hidden');
  }

  function showEmptyState() {
    emptyState.classList.remove('hidden');
    resultsView.classList.add('hidden');
    renderLedger();
  }

  function showResultsView() {
    emptyState.classList.add('hidden');
    resultsView.classList.remove('hidden');
  }

  /* ==========================================================================
     5. Exact Penny-Balancing Math (Requirement #3)
     ========================================================================== */
  function renderSplit() {
    const bill = parseFloat(billInput.value);
    const count = parseInt(peopleInput.value, 10);
    const currency = currencySelect.value;
    const occasion = occasionInput.value.trim() || 'Bill Split';

    const tipAmount = (bill * currentTipPercent) / 100;
    const effectiveTotal = bill + tipAmount;

    // Convert total to integer cents to guarantee 100% precision
    const totalCents = Math.round(effectiveTotal * 100);
    const baseShareCents = Math.floor(totalCents / count);
    const remainderCents = totalCents % count;

    const shares = [];
    let runningSumCents = 0;

    for (let i = 0; i < count; i++) {
      const isExtra = i < remainderCents;
      const shareCents = isExtra ? baseShareCents + 1 : baseShareCents;
      runningSumCents += shareCents;

      const personId = `person_${i}`;
      // Person 0 defaults to the logged-in user profile name if not renamed
      const defaultName = i === 0 && userProfile.name ? userProfile.name : `Person ${i + 1}`;
      const name = customNames[i] ? customNames[i].trim() : defaultName;
      const isPaid = Boolean(paidStatus[personId]);

      // Avatar gradient: Person 0 uses user profile chosen gradient
      const avatarGrad = i === 0 
        ? (AVATAR_GRADIENTS[userProfile.avatarIndex] || AVATAR_GRADIENTS[0]) 
        : AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];

      shares.push({
        id: personId,
        index: i,
        name: name || defaultName,
        cents: shareCents,
        amount: shareCents / 100,
        isExtraPenny: isExtra,
        avatarColor: avatarGrad,
        isPaid,
      });
    }

    const exactTotal = runningSumCents / 100;

    // Update Header Display
    displayOccasion.textContent = occasion;
    displayParticipants.textContent = `${count} participant${count > 1 ? 's' : ''}`;
    displayTotalAmount.textContent = `${currency}${exactTotal.toFixed(2)}`;

    if (currentTipPercent > 0) {
      displayTipSubtext.textContent = `Includes ${currency}${tipAmount.toFixed(2)} (${currentTipPercent}% tip)`;
      displayTipSubtext.classList.remove('hidden');
    } else {
      displayTipSubtext.classList.add('hidden');
    }

    // Mathematical Guarantee Explanation
    if (remainderCents > 0) {
      const penniesWord = remainderCents === 1 ? '1 cent' : `${remainderCents} cents`;
      const peopleWord = remainderCents === 1 ? '1 participant' : `${remainderCents} participants`;
      verificationExplanation.textContent = `Exact Total: ${currency}${exactTotal.toFixed(2)}. ${penniesWord} evenly balanced to ${peopleWord} so shares add up 100% perfectly with zero loss.`;
    } else {
      verificationExplanation.textContent = `Exact Total: ${currency}${exactTotal.toFixed(2)}. Evenly divisible down to the last penny across all ${count} participants.`;
    }

    // Render Shares & Visual Bars
    renderSharesList(shares, currency);
    renderDistributionBar(shares);
    showResultsView();
    renderLedger();
  }

  function renderDistributionBar(shares) {
    distributionTrack.innerHTML = '';
    const total = shares.reduce((acc, s) => acc + s.amount, 0);
    const paidCount = shares.filter(s => s.isPaid).length;

    paidProgressText.textContent = `${paidCount} of ${shares.length} Paid`;

    shares.forEach((share) => {
      const slice = document.createElement('div');
      slice.className = 'progress-slice';
      const pct = (share.amount / total) * 100;
      slice.style.width = `${pct}%`;
      slice.style.background = share.avatarColor;
      slice.style.opacity = share.isPaid ? '1' : '0.4';
      slice.title = `${share.name}: ${share.amount.toFixed(2)} (${share.isPaid ? 'Paid' : 'Unpaid'})`;
      distributionTrack.appendChild(slice);
    });
  }

  function renderSharesList(shares, currency) {
    sharesList.innerHTML = '';

    shares.forEach((share) => {
      const row = document.createElement('div');
      row.className = `share-row ${share.isPaid ? 'is-paid' : ''}`;

      // Left Column: Avatar + Name
      const left = document.createElement('div');
      left.className = 'share-left';

      const avatar = document.createElement('div');
      avatar.className = 'share-avatar';
      avatar.style.background = share.avatarColor;
      avatar.textContent = share.name.charAt(0).toUpperCase();

      const nameWrap = document.createElement('div');
      nameWrap.className = 'share-name-wrap';

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'share-name-input';
      nameInput.value = share.name;
      nameInput.title = 'Click to edit person name';

      nameInput.addEventListener('change', () => {
        const val = nameInput.value.trim();
        customNames[share.index] = val || `Person ${share.index + 1}`;
        avatar.textContent = (val || `P`).charAt(0).toUpperCase();
        saveState();
        renderLedger();
      });

      nameWrap.appendChild(nameInput);

      if (share.isExtraPenny) {
        const extraBadge = document.createElement('span');
        extraBadge.className = 'extra-penny-badge';
        extraBadge.textContent = '+1¢ balanced';
        nameWrap.appendChild(extraBadge);
      }

      left.appendChild(avatar);
      left.appendChild(nameWrap);

      // Right Column: Paid Checkbox + Amount
      const right = document.createElement('div');
      right.className = 'share-right';

      const paidLabel = document.createElement('label');
      paidLabel.className = 'paid-checkbox-label';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = share.isPaid;

      checkbox.addEventListener('change', () => {
        paidStatus[share.id] = checkbox.checked;
        row.classList.toggle('is-paid', checkbox.checked);
        saveState();
        if (hasCalculated && validateInputs(false)) {
          renderSplit();
        }
      });

      paidLabel.appendChild(checkbox);
      paidLabel.appendChild(document.createTextNode(share.isPaid ? 'Paid' : 'Unpaid'));

      const amountSpan = document.createElement('span');
      amountSpan.className = 'share-amount';
      amountSpan.textContent = `${currency}${share.amount.toFixed(2)}`;

      right.appendChild(paidLabel);
      right.appendChild(amountSpan);

      row.appendChild(left);
      row.appendChild(right);
      sharesList.appendChild(row);
    });
  }

  /* ==========================================================================
     6. Settlement Ledger & Group Audit (Page 3)
     ========================================================================== */
  function renderLedger() {
    if (!ledgerMembersList) return;

    const currency = currencySelect.value;
    const rawBill = parseFloat(billInput.value) || 0;
    const count = parseInt(peopleInput.value, 10) || 1;
    const tip = (rawBill * currentTipPercent) / 100;
    const total = rawBill + tip;

    const totalCents = Math.round(total * 100);
    const baseCents = Math.floor(totalCents / count);
    const remainder = totalCents % count;

    let collectedCents = 0;
    let paidCount = 0;
    ledgerMembersList.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const isExtra = i < remainder;
      const shareCents = isExtra ? baseCents + 1 : baseCents;
      const shareAmount = shareCents / 100;
      const personId = `person_${i}`;
      const isPaid = Boolean(paidStatus[personId]);
      const defaultName = i === 0 && userProfile.name ? userProfile.name : `Person ${i + 1}`;
      const name = customNames[i] ? customNames[i].trim() : defaultName;

      if (isPaid) {
        collectedCents += shareCents;
        paidCount++;
      }

      const item = document.createElement('div');
      item.className = `ledger-member-item ${isPaid ? 'is-paid' : ''}`;
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-weight:600; color:${isPaid ? '#34d399' : 'var(--text-main)'}">${escapeHtml(name)}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">(${currency}${shareAmount.toFixed(2)})</span>
        </div>
        <span style="font-size:0.75rem; font-weight:700; color:${isPaid ? '#10b981' : '#f59e0b'}">
          ${isPaid ? '✓ PAID' : 'PENDING'}
        </span>
      `;
      ledgerMembersList.appendChild(item);
    }

    const collectedTotal = collectedCents / 100;
    const pendingTotal = Math.max(0, total - collectedTotal);
    const percent = total > 0 ? Math.round((collectedTotal / total) * 100) : 0;

    ledgerCollectedAmount.textContent = `${currency}${collectedTotal.toFixed(2)}`;
    ledgerPendingAmount.textContent = `${currency}${pendingTotal.toFixed(2)}`;
    ledgerPaidCountText.textContent = `${paidCount} of ${count} settled`;
    ledgerUnpaidCountText.textContent = `${count - paidCount} pending settlement`;
    ledgerProgressPercent.textContent = `${percent}% Settled`;
    ledgerProgressBar.style.width = `${percent}%`;

    // Trigger celebration breeze if everyone is paid and user enabled sparkles!
    if (paidCount === count && count > 0 && hasCalculated && userProfile.celebrationSparkles) {
      if (typeof window.triggerCelebrationBreeze === 'function') {
        window.triggerCelebrationBreeze();
      }
    }
  }

  /* ==========================================================================
     7. 3D Page Flip Book Engine
     ========================================================================== */
  function setupPageFlipEngine() {
    // Mode Toggles: 3D Flip vs Side-by-side
    tabFlipView.addEventListener('click', () => setFlipMode(true));
    tabDualView.addEventListener('click', () => setFlipMode(false));

    // Page indicator tabs
    pageTab1.addEventListener('click', () => turnToPage(1));
    pageTab2.addEventListener('click', () => turnToPage(2));
    pageTab3.addEventListener('click', () => turnToPage(3));

    // Navigation buttons
    prevPageBtn.addEventListener('click', () => turnToPage(Math.max(1, currentPage - 1)));
    nextPageBtn.addEventListener('click', () => turnToPage(Math.min(3, currentPage + 1)));

    pageFlipBtn.addEventListener('click', () => {
      const next = currentPage === 1 ? 2 : (currentPage === 2 ? 3 : 1);
      turnToPage(next);
    });

    // Page corner curls
    if (cornerCurl1) cornerCurl1.addEventListener('click', () => turnToPage(2));
    if (cornerCurl2) cornerCurl2.addEventListener('click', () => turnToPage(3));
    if (cornerCurl3) cornerCurl3.addEventListener('click', () => turnToPage(1));

    // Inter-page jump buttons
    if (quickFlipToReceipt) quickFlipToReceipt.addEventListener('click', () => turnToPage(2));
    if (quickFlipToForm) quickFlipToForm.addEventListener('click', () => turnToPage(1));
    if (quickFlipToLedger) quickFlipToLedger.addEventListener('click', () => turnToPage(3));
    if (emptyFlipToForm) emptyFlipToForm.addEventListener('click', () => turnToPage(1));
    if (page1ToLedger) page1ToLedger.addEventListener('click', () => turnToPage(3));
    if (page2BackToForm) page2BackToForm.addEventListener('click', () => turnToPage(1));
    if (page2ToLedger) page2ToLedger.addEventListener('click', () => turnToPage(3));
    if (ledgerBackToShares) ledgerBackToShares.addEventListener('click', () => turnToPage(2));
    if (ledgerToShares) ledgerToShares.addEventListener('click', () => turnToPage(2));
    if (ledgerToSetup) ledgerToSetup.addEventListener('click', () => turnToPage(1));

    // Ledger actions
    if (ledgerMarkAllPaidBtn) {
      ledgerMarkAllPaidBtn.addEventListener('click', () => {
        const count = parseInt(peopleInput.value, 10) || 1;
        for (let i = 0; i < count; i++) {
          paidStatus[`person_${i}`] = true;
        }
        saveState();
        if (hasCalculated && validateInputs(false)) renderSplit();
        renderLedger();
        showToast('All participants marked as Paid! 🎉');
      });
    }

    if (copyUnpaidReminderBtn) {
      copyUnpaidReminderBtn.addEventListener('click', handleCopyUnpaidReminder);
    }
  }

  function setFlipMode(enableFlip) {
    isFlipMode = enableFlip;
    tabFlipView.classList.toggle('active', isFlipMode);
    tabDualView.classList.toggle('active', !isFlipMode);
    tabFlipView.setAttribute('aria-selected', isFlipMode ? 'true' : 'false');
    tabDualView.setAttribute('aria-selected', !isFlipMode ? 'true' : 'false');

    calculatorLayout.classList.toggle('flip-mode', isFlipMode);

    if (isFlipMode) {
      showToast('Switched to 3D Page Flip Book mode');
      syncPageUI(currentPage);
    } else {
      showToast('Switched to Side-by-Side Dual View');
      [formCard, resultsCard, ledgerCard].forEach(c => {
        c.classList.remove('page-turned-back', 'page-turned-next');
        c.classList.add('active-page');
      });
    }
    saveState();
  }

  function turnToPage(targetPage) {
    if (targetPage === currentPage) return;
    currentPage = targetPage;

    if (isFlipMode) {
      const pages = [formCard, resultsCard, ledgerCard];
      pages.forEach((card, idx) => {
        const pageNum = idx + 1;
        card.classList.remove('active-page', 'page-turned-back', 'page-turned-next');

        if (pageNum === targetPage) {
          card.classList.add('active-page');
        } else if (pageNum < targetPage) {
          card.classList.add('page-turned-back');
        } else {
          card.classList.add('page-turned-next');
        }
      });

      if (userProfile.celebrationSparkles && typeof window.triggerPageTurnBreeze === 'function') {
        window.triggerPageTurnBreeze();
      }
    }

    syncPageUI(currentPage);
    saveState();
  }

  function syncPageUI(pageNum) {
    [pageTab1, pageTab2, pageTab3].forEach((tab, idx) => {
      tab.classList.toggle('active', idx + 1 === pageNum);
    });

    prevPageBtn.disabled = pageNum === 1;
    prevPageBtn.style.opacity = pageNum === 1 ? '0.4' : '1';
    nextPageBtn.disabled = pageNum === 3;
    nextPageBtn.style.opacity = pageNum === 3 ? '0.4' : '1';

    const flipBtnText = document.getElementById('flipBtnText');
    if (flipBtnText) {
      flipBtnText.textContent = pageNum === 1 ? 'Turn to Shares' : (pageNum === 2 ? 'Turn to Ledger' : 'Back to Setup');
    }
  }

  function handleCopyUnpaidReminder() {
    const count = parseInt(peopleInput.value, 10) || 1;
    const occasion = occasionInput.value.trim() || 'Bill Split';

    const unpaidList = [];
    for (let i = 0; i < count; i++) {
      if (!paidStatus[`person_${i}`]) {
        const defaultName = i === 0 && userProfile.name ? userProfile.name : `Person ${i + 1}`;
        const name = customNames[i] ? customNames[i].trim() : defaultName;
        unpaidList.push(name);
      }
    }

    if (unpaidList.length === 0) {
      showToast('Everyone has already settled their payment!');
      return;
    }

    let text = `👋 Gentle reminder for *${occasion}*\n`;
    text += `Pending settlement: ${unpaidList.join(', ')}\n`;
    if (userProfile.handle) {
      text += `💸 Please settle up via: @${userProfile.handle}\n`;
    }
    text += `Thank you! 🙏`;

    navigator.clipboard.writeText(text).then(() => {
      showToast('Payment reminder copied to clipboard!');
    });
  }

  /* ==========================================================================
     8. Supercharged Magic Bubble & Wind Physics Engine
     ========================================================================== */
  function setupMagicBubblesEngine() {
    const canvas = document.getElementById('bubbleWindCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 5 Magical Color Palettes
    const MAGIC_THEMES = [
      {
        name: 'Cosmic',
        icon: '🌌',
        colors: [
          { r: 139, g: 92, b: 246 },
          { r: 6, g: 182, b: 212 },
          { r: 59, g: 130, b: 246 },
          { r: 236, g: 72, b: 153 },
          { r: 244, g: 63, b: 94 },
        ],
        desc: 'Cosmic holographic spectral sheen',
      },
      {
        name: 'Rainbow',
        icon: '🌈',
        colors: [
          { r: 239, g: 68, b: 68 },
          { r: 245, g: 158, b: 11 },
          { r: 16, g: 185, b: 129 },
          { r: 6, g: 182, b: 212 },
          { r: 139, g: 92, b: 246 },
        ],
        desc: 'Vibrant prismatic rainbow magic',
      },
      {
        name: 'Stardust',
        icon: '✨',
        colors: [
          { r: 251, g: 191, b: 36 },
          { r: 245, g: 158, b: 11 },
          { r: 254, g: 240, b: 138 },
          { r: 251, g: 113, b: 133 },
        ],
        desc: 'Twinkling golden celestial stardust',
      },
      {
        name: 'Cyber Neon',
        icon: '⚡',
        colors: [
          { r: 16, g: 185, b: 129 },
          { r: 6, g: 182, b: 212 },
          { r: 244, g: 63, b: 94 },
          { r: 168, g: 85, b: 247 },
        ],
        desc: 'Electrified cyberpunk glow',
      },
      {
        name: 'Aurora',
        icon: '🍃',
        colors: [
          { r: 5, g: 150, b: 105 },
          { r: 20, g: 184, b: 166 },
          { r: 99, g: 102, b: 241 },
          { r: 56, g: 189, b: 248 },
        ],
        desc: 'Mystic boreal aurora glow',
      },
    ];

    let currentMagicIndex = 0;
    const magicColorBtn = document.getElementById('magicColorBtn');
    const magicStatusText = document.getElementById('magicStatusText');

    if (magicColorBtn && magicStatusText) {
      magicColorBtn.addEventListener('click', () => {
        currentMagicIndex = (currentMagicIndex + 1) % MAGIC_THEMES.length;
        const currentThemeObj = MAGIC_THEMES[currentMagicIndex];
        magicStatusText.textContent = `Magic: ${currentThemeObj.name}`;
        const iconSpan = magicColorBtn.querySelector('.magic-icon');
        if (iconSpan) iconSpan.textContent = currentThemeObj.icon;

        bubbles.forEach(b => {
          b.color = currentThemeObj.colors[Math.floor(Math.random() * currentThemeObj.colors.length)];
        });

        triggerCelebrationBreeze();
        showToast(`Magic Palette: ${currentThemeObj.name} — ${currentThemeObj.desc}`);
      });
    }

    // Wind Dynamics
    const WIND_MODES = [
      { name: 'Breeze', icon: '🍃', baseSpeed: 0.9, gustFreq: 0.0008, desc: 'Gentle organic drift' },
      { name: 'Gust', icon: '💨', baseSpeed: 2.4, gustFreq: 0.0016, desc: 'Energetic cyber wind' },
      { name: 'Vortex', icon: '🌪️', baseSpeed: 0.6, gustFreq: 0.002, desc: 'Whirling magic swirl' },
      { name: 'Calm', icon: '☁️', baseSpeed: 0.15, gustFreq: 0.0003, desc: 'Peaceful float' },
    ];
    let currentWindIndex = 0;
    const windToggleBtn = document.getElementById('windToggleBtn');
    const windStatusText = document.getElementById('windStatusText');

    if (windToggleBtn && windStatusText) {
      windToggleBtn.addEventListener('click', () => {
        currentWindIndex = (currentWindIndex + 1) % WIND_MODES.length;
        const currentMode = WIND_MODES[currentWindIndex];
        windStatusText.textContent = `Wind: ${currentMode.name}`;
        const iconSpan = windToggleBtn.querySelector('.wind-icon');
        if (iconSpan) iconSpan.textContent = currentMode.icon;
        showToast(`Wind Mode: ${currentMode.name} — ${currentMode.desc}`);
      });
    }

    // Mouse Interaction
    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 };
    window.addEventListener('mousemove', (e) => {
      mouse.vx = (e.clientX - mouse.lastX) * 0.25;
      mouse.vy = (e.clientY - mouse.lastY) * 0.25;
      mouse.lastX = mouse.x = e.clientX;
      mouse.lastY = mouse.y = e.clientY;

      if (userProfile.celebrationSparkles && Math.random() < 0.25) {
        sparkles.push(createSparkle(e.clientX, e.clientY, 1.2, 0.5));
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        mouse.vx = (touch.clientX - mouse.lastX) * 0.25;
        mouse.vy = (touch.clientY - mouse.lastY) * 0.25;
        mouse.lastX = mouse.x = touch.clientX;
        mouse.lastY = mouse.y = touch.clientY;
      }
    }, { passive: true });

    // Click/Tap to POP Bubbles or SPAWN
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let poppedAny = false;
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        const dist = Math.hypot(b.x - clickX, b.y - clickY);
        if (dist <= b.radius + 16) {
          popBubble(b, i);
          poppedAny = true;
          break;
        }
      }

      if (!poppedAny) {
        for (let j = 0; j < 3; j++) {
          const newB = createBubble(clickY + (Math.random() - 0.5) * 30);
          newB.x = clickX + (Math.random() - 0.5) * 40;
          newB.vy = -(1.2 + Math.random() * 1.5);
          bubbles.push(newB);
        }
        for (let s = 0; s < 12; s++) {
          sparkles.push(createSparkle(clickX, clickY, 3.5, 0.9));
        }
      }
    });

    // Bubbles Array
    const isMobile = window.innerWidth < 768;
    const BUBBLE_COUNT = isMobile ? 32 : 55;
    const bubbles = [];
    const sparkles = [];
    const popTexts = [];

    function createBubble(startY) {
      const currentThemeObj = MAGIC_THEMES[currentMagicIndex];
      const radius = 8 + Math.random() * 26;
      const color = currentThemeObj.colors[Math.floor(Math.random() * currentThemeObj.colors.length)];
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        radius,
        baseRadius: radius,
        vy: -(0.4 + Math.random() * 0.75),
        vx: (Math.random() - 0.5) * 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.015 + Math.random() * 0.025,
        wobbleAmp: 1.2 + Math.random() * 2.2,
        color,
        alpha: 0.25 + Math.random() * 0.42,
        hueShift: Math.random() * 360,
      };
    }

    function createSparkle(x, y, maxSpeed = 3, maxAlpha = 0.8) {
      const currentThemeObj = MAGIC_THEMES[currentMagicIndex];
      const color = currentThemeObj.colors[Math.floor(Math.random() * currentThemeObj.colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * maxSpeed;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        radius: 1.5 + Math.random() * 2.5,
        color,
        alpha: maxAlpha,
        decay: 0.018 + Math.random() * 0.025,
      };
    }

    function popBubble(b, index) {
      for (let i = 0; i < 20; i++) {
        sparkles.push(createSparkle(b.x, b.y, 4.5, 1));
      }
      popTexts.push({
        x: b.x,
        y: b.y,
        text: '✨ Pop!',
        alpha: 1,
        vy: -1.2,
      });

      bubbles.splice(index, 1);
      setTimeout(() => {
        if (bubbles.length < BUBBLE_COUNT) {
          bubbles.push(createBubble(height + 20));
        }
      }, 800);
    }

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      bubbles.push(createBubble());
    }

    const heroCastBubbleBtn = document.getElementById('heroCastBubbleBtn');
    if (heroCastBubbleBtn) {
      heroCastBubbleBtn.addEventListener('click', () => {
        triggerCelebrationBreeze();
        showToast('Magical bubble shower cast into the wind! ✨');
      });
    }

    window.triggerCelebrationBreeze = function () {
      for (let i = 0; i < 24; i++) {
        const b = createBubble(height + Math.random() * 100);
        b.vy = -(1.8 + Math.random() * 2.4);
        b.vx = (Math.random() - 0.3) * 2.5;
        b.alpha = 0.65;
        bubbles.push(b);
      }
      setTimeout(() => {
        while (bubbles.length > BUBBLE_COUNT) {
          bubbles.shift();
        }
      }, 6000);
    };

    window.triggerPageTurnBreeze = function () {
      for (let i = 0; i < 8; i++) {
        const b = createBubble(height * 0.5 + (Math.random() - 0.5) * 200);
        b.x = width * 0.5 + (Math.random() - 0.5) * 150;
        b.vy = -(1.4 + Math.random() * 1.8);
        b.vx = (Math.random() - 0.5) * 2;
        bubbles.push(b);
      }
    };

    let lastTime = performance.now();

    function render(currentTime) {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const mode = WIND_MODES[currentWindIndex];
      const baseWindX = mode.baseSpeed * (0.8 + 0.4 * Math.sin(currentTime * mode.gustFreq));

      mouse.vx *= 0.92;
      mouse.vy *= 0.92;

      // 1. Update & Render Sparkles
      for (let s = sparkles.length - 1; s >= 0; s--) {
        const sp = sparkles[s];
        sp.x += sp.vx * 60 * dt;
        sp.y += (sp.vy + 0.2) * 60 * dt;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          sparkles.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, ${sp.alpha})`;
        ctx.shadowColor = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // 2. Update & Render Floating Pop Text
      for (let t = popTexts.length - 1; t >= 0; t--) {
        const pt = popTexts[t];
        pt.y += pt.vy * 60 * dt;
        pt.alpha -= 0.025;

        if (pt.alpha <= 0) {
          popTexts.splice(t, 1);
          continue;
        }

        ctx.save();
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = `rgba(56, 189, 248, ${pt.alpha})`;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fillText(pt.text, pt.x - 14, pt.y);
        ctx.restore();
      }

      // 3. Update & Draw Smooth Iridescent Magic Bubbles
      bubbles.forEach(b => {
        b.wobble += b.wobbleSpeed;
        const wobbleX = Math.sin(b.wobble) * b.wobbleAmp;
        const wobbleY = Math.cos(b.wobble) * (b.wobbleAmp * 0.5);

        let vortexX = 0;
        if (mode.name === 'Vortex') {
          const centerX = width / 2;
          const centerY = height / 2;
          const angle = Math.atan2(b.y - centerY, b.x - centerX);
          vortexX = Math.cos(angle + Math.PI / 2) * 1.5;
        }

        b.x += (b.vx + baseWindX + wobbleX * 0.18 + vortexX) * 60 * dt;
        b.y += (b.vy + wobbleY * 0.1) * 60 * dt;

        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const mouseRadius = 140;

        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * 2.8;
          b.x += (dx / dist) * force + mouse.vx * 0.3;
          b.y += (dy / dist) * force + mouse.vy * 0.3;
        }

        if (b.y + b.radius < -25) {
          b.y = height + b.radius + Math.random() * 30;
          b.x = Math.random() * width;
        }
        if (b.x - b.radius > width + 40) {
          b.x = -b.radius - Math.random() * 40;
        } else if (b.x + b.radius < -50) {
          b.x = width + b.radius + Math.random() * 40;
        }

        ctx.save();
        ctx.translate(b.x, b.y);

        const stretch = Math.min(Math.abs(baseWindX) * 0.04, 0.25);
        ctx.scale(1 + stretch, 1 - stretch * 0.6);

        const r = b.radius;
        const c = b.color;

        const rimGrad = ctx.createRadialGradient(
          -r * 0.3, -r * 0.3, r * 0.15,
          0, 0, r
        );
        rimGrad.addColorStop(0, `rgba(255, 255, 255, ${b.alpha * 0.25})`);
        rimGrad.addColorStop(0.65, `rgba(${c.r}, ${c.g}, ${c.b}, ${b.alpha * 0.25})`);
        rimGrad.addColorStop(0.88, `rgba(${c.r}, ${c.g}, ${c.b}, ${b.alpha * 0.88})`);
        rimGrad.addColorStop(1, `rgba(255, 255, 255, ${b.alpha * 0.95})`);

        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${b.alpha * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Top-left Specular Glare Dot
        ctx.beginPath();
        ctx.arc(-r * 0.36, -r * 0.36, r * 0.24, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.95})`;
        ctx.fill();

        // Bottom-right soft reflection
        ctx.beginPath();
        ctx.arc(r * 0.28, r * 0.28, r * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${b.alpha * 0.55})`;
        ctx.fill();

        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  /* ==========================================================================
     9. Form Controls & Event Listeners
     ========================================================================== */
  function setupEventListeners() {
    // Submit / Calculate Button (Requirement #2)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isValid = validateInputs(true);
      if (isValid) {
        hasCalculated = true;
        saveState();
        renderSplit();

        // Auto-turn page if enabled in user settings
        if (userProfile.autoFlip) {
          turnToPage(2);
        }
        if (userProfile.celebrationSparkles && typeof window.triggerCelebrationBreeze === 'function') {
          window.triggerCelebrationBreeze();
        }
      } else {
        hasCalculated = false;
        saveState();
      }
    });

    // Reset Button
    resetBtn.addEventListener('click', () => {
      occasionInput.value = 'Cyber Rooftop Dinner';
      billInput.value = '';
      peopleInput.value = '3';
      currentTipPercent = 0;
      tipButtons.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.tip) === 0));
      customNames = {};
      paidStatus = {};
      hasCalculated = false;
      hideError();
      showEmptyState();
      updateTipPreview();
      turnToPage(1);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Splitter cleared to defaults');
    });

    // Currency Switcher
    currencySelect.addEventListener('change', () => {
      currencyPrefix.textContent = currencySelect.value;
      updateTipPreview();
      if (hasCalculated && validateInputs(false)) {
        renderSplit();
      }
      saveState();
    });

    // Live Tip Preview & recalculation
    billInput.addEventListener('input', () => {
      hideError();
      updateTipPreview();
      if (hasCalculated) {
        if (validateInputs(false)) {
          renderSplit();
        } else {
          showEmptyState();
        }
      }
      saveState();
    });

    peopleInput.addEventListener('input', () => {
      hideError();
      if (hasCalculated) {
        if (validateInputs(false)) {
          renderSplit();
        } else {
          showEmptyState();
        }
      }
      saveState();
    });

    occasionInput.addEventListener('input', () => {
      if (hasCalculated && validateInputs(false)) {
        displayOccasion.textContent = occasionInput.value.trim() || 'Bill Split';
      }
      saveState();
    });

    // Preset Chips for Occasion
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        occasionInput.value = chip.dataset.preset;
        if (hasCalculated && validateInputs(false)) {
          displayOccasion.textContent = occasionInput.value;
        }
        saveState();
      });
    });

    // Tip Buttons
    tipButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tipButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTipPercent = Number(btn.dataset.tip);
        updateTipPreview();
        if (hasCalculated && validateInputs(false)) {
          renderSplit();
        }
        saveState();
      });
    });

    // Steppers for People
    decrementPeopleBtn.addEventListener('click', () => {
      let val = parseInt(peopleInput.value, 10) || 1;
      val = Math.max(1, val - 1);
      peopleInput.value = val;
      hideError();
      if (hasCalculated && validateInputs(false)) renderSplit();
      saveState();
    });

    incrementPeopleBtn.addEventListener('click', () => {
      let val = parseInt(peopleInput.value, 10) || 0;
      val = val + 1;
      peopleInput.value = val;
      hideError();
      if (hasCalculated && validateInputs(false)) renderSplit();
      saveState();
    });

    // People Preset Pills
    const pillBtns = document.querySelectorAll('.pill-btn');
    pillBtns.forEach(pill => {
      pill.addEventListener('click', () => {
        peopleInput.value = pill.dataset.people;
        hideError();
        if (hasCalculated && validateInputs(false)) renderSplit();
        saveState();
      });
    });

    // Copy Summary Button
    copySummaryBtn.addEventListener('click', handleCopySummary);

    // Share Link Button
    shareLinkBtn.addEventListener('click', handleShareLink);
  }

  function updateTipPreview() {
    const bill = parseFloat(billInput.value);
    const curr = currencySelect.value;
    if (isNaN(bill) || bill <= 0 || currentTipPercent === 0) {
      tipAmountDisplay.textContent = `+ ${curr}0.00`;
    } else {
      const tip = (bill * currentTipPercent) / 100;
      tipAmountDisplay.textContent = `+ ${curr}${tip.toFixed(2)}`;
    }
  }

  /* ==========================================================================
     10. Export & Share Tools
     ========================================================================== */
  function handleCopySummary() {
    if (!hasCalculated) return;

    const bill = parseFloat(billInput.value);
    const count = parseInt(peopleInput.value, 10);
    const curr = currencySelect.value;
    const occasion = occasionInput.value.trim() || 'Bill Split';
    const tip = (bill * currentTipPercent) / 100;
    const effectiveTotal = bill + tip;

    let text = `🧾 *${occasion}*\n`;
    text += `Total: ${curr}${effectiveTotal.toFixed(2)} (${count} participants)\n`;
    if (currentTipPercent > 0) {
      text += `Includes ${curr}${tip.toFixed(2)} (${currentTipPercent}% tip)\n`;
    }
    if (userProfile.handle) {
      text += `💸 Settle via: @${userProfile.handle}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━\n`;

    const totalCents = Math.round(effectiveTotal * 100);
    const baseCents = Math.floor(totalCents / count);
    const remainder = totalCents % count;

    for (let i = 0; i < count; i++) {
      const shareAmount = (i < remainder ? baseCents + 1 : baseCents) / 100;
      const defaultName = i === 0 && userProfile.name ? userProfile.name : `Person ${i + 1}`;
      const name = customNames[i] || defaultName;
      const isPaid = paidStatus[`person_${i}`] ? ' [PAID ✓]' : '';
      text += `• ${name}: ${curr}${shareAmount.toFixed(2)}${isPaid}\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Sum: ${curr}${effectiveTotal.toFixed(2)} (100% Balanced ✓)\n`;
    text += `Generated with QuantSplit`;

    navigator.clipboard.writeText(text).then(() => {
      copyBtnLabel.textContent = 'Copied!';
      showToast('Summary message copied for WhatsApp/iMessage!');
      setTimeout(() => {
        copyBtnLabel.textContent = 'Copy Message';
      }, 2000);
    });
  }

  function handleShareLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('occ', occasionInput.value);
    url.searchParams.set('bill', billInput.value);
    url.searchParams.set('ppl', peopleInput.value);
    url.searchParams.set('tip', currentTipPercent.toString());

    navigator.clipboard.writeText(url.toString()).then(() => {
      shareBtnLabel.textContent = 'Link Copied!';
      showToast('Shareable link copied to clipboard!');
      setTimeout(() => {
        shareBtnLabel.textContent = 'Share Link';
      }, 2000);
    });
  }

  function showToast(msg) {
    toastMessage.textContent = msg;
    toastNotification.classList.remove('hidden');
    setTimeout(() => {
      toastNotification.classList.add('hidden');
    }, 2800);
  }

  /* ==========================================================================
     11. Visual Effects & Animations
     ========================================================================== */
  function setupDynamicText() {
    const dynamicWord = document.getElementById('dynamicWord');
    if (!dynamicWord) return;
    const words = ['Team Dinners', 'Group Trips', 'Loft Rent', 'Weekend Brunch', 'Party Bills'];
    let idx = 0;

    setInterval(() => {
      idx = (idx + 1) % words.length;
      dynamicWord.style.opacity = '0';
      dynamicWord.style.transform = 'translateY(6px)';
      setTimeout(() => {
        dynamicWord.textContent = words[idx];
        dynamicWord.style.opacity = '1';
        dynamicWord.style.transform = 'translateY(0)';
      }, 250);
    }, 3200);
  }

  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
  }

  function setupCounterAnimations() {
    const statValues = document.querySelectorAll('.stat-value');
    if (!('IntersectionObserver' in window)) {
      statValues.forEach(el => el.textContent = el.dataset.target);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const isDecimal = target % 1 !== 0;
          const duration = 1600;
          const start = 0;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * ease;
            el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = isDecimal ? target.toFixed(1) : target;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    statValues.forEach(el => observer.observe(el));
  }

  function setupCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  function setupCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    if (!cursorDot || !cursorOutline) return;

    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
      requestAnimationFrame(animateOutline);
    }
    requestAnimationFrame(animateOutline);

    const interactables = document.querySelectorAll('button, a, input, select, .chip, .pill-btn, .page-corner-curl');
    interactables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '48px';
        cursorOutline.style.height = '48px';
        cursorOutline.style.borderColor = 'rgba(6, 182, 212, 0.8)';
      });
      item.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '36px';
        cursorOutline.style.height = '36px';
        cursorOutline.style.borderColor = 'rgba(139, 92, 246, 0.6)';
      });
    });
  }

  function setupButtonRipples() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn, .chip, .pill-btn, .stepper-btn, .tip-btn, .btn-flip-nav, .page-dot');
      if (!btn) return;
      const ripple = document.createElement('span');
      ripple.className = 'click-ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  }

  function setupMobileNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!mobileToggle || !mobileDrawer) return;

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on page ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initState);
  } else {
    initState();
  }
})();
