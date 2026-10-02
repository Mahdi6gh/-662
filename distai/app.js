/**
 * APP.JS - Vanilla JS Engine for Notary 662 Tehran
 * Pure Javascript - No Build Steps - No CORS issues - Standalone
 */

// Utility: Format numbers with commas
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '۰';
  return Math.round(num).toLocaleString('fa-IR');
}

function parseFormattedNumber(val) {
  if (!val) return 0;
  // Convert Persian/Arabic digits to English digits
  const str = String(val)
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/,/g, '')
    .trim();
  const n = parseFloat(str);
  return isNaN(n) ? 0 : n;
}

// Format input on the fly
function attachNumberFormat(inputElem, helperElem) {
  inputElem.addEventListener('input', function() {
    const raw = parseFormattedNumber(this.value);
    this.value = raw > 0 ? raw.toLocaleString('en-US') : '';
    if (helperElem) {
      const toman = Math.round(raw / 10);
      helperElem.textContent = 'معادل: ' + (toman > 0 ? toman.toLocaleString('fa-IR') : '۰') + ' تومان';
    }
    // trigger recalculation based on active tab
    calculateActive();
  });
}

// Tiered Calculator (Matching Official Tariff)
function calculateTiered(val, baseFee, tiers) {
  if (val <= 0) return 0;
  let total = baseFee;
  for (const tier of tiers) {
    if (val > tier.minLimit) {
      const taxable = Math.min(val, tier.maxLimit) - tier.minLimit;
      total += taxable * tier.rate;
    }
  }
  return Math.round(total);
}

// ----------------------------------------------------
// TAB 1: REAL ESTATE CALCULATIONS
// ----------------------------------------------------
const REAL_ESTATE_TIERS = [
  { minLimit: 2_000_000, maxLimit: 10_000_000, rate: 1.188 },
  { minLimit: 10_000_000, maxLimit: 50_000_000, rate: 0.756 },
  { minLimit: 50_000_000, maxLimit: 100_000_000, rate: 0.243 },
  { minLimit: 100_000_000, maxLimit: 200_000_000, rate: 0.108 },
  { minLimit: 200_000_000, maxLimit: 500_000_000, rate: 0.0675 },
  { minLimit: 500_000_000, maxLimit: 1_000_000_000, rate: 0.03375 },
  { minLimit: 1_000_000_000, maxLimit: Infinity, rate: 0.0135 },
];

function calculateRealEstate() {
  const priceRial = parseFormattedNumber(document.getElementById('re-price').value);
  const sellers = parseInt(document.getElementById('re-sellers').value) || 1;
  const buyers = parseInt(document.getElementById('re-buyers').value) || 1;
  const extraPages = parseInt(document.getElementById('re-pages').value) || 0;

  const inqReg = document.getElementById('re-inq-reg').checked;
  const inqTax = document.getElementById('re-inq-tax').checked;
  const inqMun = document.getElementById('re-inq-mun').checked;

  const baseTahrir = 4_725_000;
  const tahrirRial = priceRial > 0 ? calculateTiered(priceRial, baseTahrir, REAL_ESTATE_TIERS) : 0;

  // 9% Special Base for Registration and Cadastre
  const specialBase = priceRial * 0.09;
  const sabtRial = Math.round(specialBase * 0.005);
  const cadastreRial = Math.round(specialBase * 0.005);

  // VAT (10% on Tahrir only)
  const vatRial = Math.round(tahrirRial * 0.10);
  const elecRial = 300_000; // 30,000 Tomans

  // Extra sellers & buyers (109,000 Rials per extra)
  const extraPersonsRial = (Math.max(0, sellers - 1) + Math.max(0, buyers - 1)) * 109_000;
  const extraPagesRial = extraPages * 200_000;
  const totalExtra = extraPersonsRial + extraPagesRial;

  let inqRial = 0;
  if (inqReg) inqRial += 1_260_000;
  if (inqTax) inqRial += 1_500_000;
  if (inqMun) inqRial += 600_000;

  const grandTotalRial = tahrirRial + sabtRial + cadastreRial + vatRial + elecRial + totalExtra + inqRial;
  const grandTotalToman = Math.round(grandTotalRial / 10);

  // Update DOM
  document.getElementById('re-res-tahrir').textContent = formatNumber(tahrirRial) + ' ریال';
  document.getElementById('re-res-sabt').textContent = formatNumber(sabtRial) + ' ریال';
  document.getElementById('re-res-cadastre').textContent = formatNumber(cadastreRial) + ' ریال';
  document.getElementById('re-res-vat').textContent = formatNumber(vatRial) + ' ریال';

  const extraRow = document.getElementById('re-row-extra');
  if (totalExtra > 0) {
    extraRow.style.display = 'flex';
    document.getElementById('re-res-extra').textContent = formatNumber(totalExtra) + ' ریال';
  } else {
    extraRow.style.display = 'none';
  }

  const inqRow = document.getElementById('re-row-inq');
  if (inqRial > 0) {
    inqRow.style.display = 'flex';
    document.getElementById('re-res-inq').textContent = formatNumber(inqRial) + ' ریال';
  } else {
    inqRow.style.display = 'none';
  }

  document.getElementById('re-total-toman').textContent = formatNumber(grandTotalToman) + ' تومان';
  document.getElementById('re-total-rial').textContent = formatNumber(grandTotalRial) + ' ریال';

  return { tahrirRial, sabtRial, cadastreRial, vatRial, grandTotalRial, grandTotalToman };
}

// ----------------------------------------------------
// TAB 2: FINANCIAL & MORTGAGE
// ----------------------------------------------------
const FINANCIAL_TIERS = [
  { minLimit: 2_000_000, maxLimit: 10_000_000, rate: 0.945 },
  { minLimit: 10_000_000, maxLimit: 50_000_000, rate: 0.540 },
  { minLimit: 50_000_000, maxLimit: 100_000_000, rate: 0.2025 },
  { minLimit: 100_000_000, maxLimit: 200_000_000, rate: 0.081 },
  { minLimit: 200_000_000, maxLimit: 500_000_000, rate: 0.054 },
  { minLimit: 500_000_000, maxLimit: 1_000_000_000, rate: 0.027 },
  { minLimit: 1_000_000_000, maxLimit: Infinity, rate: 0.0108 },
];

function calculateFinancial() {
  const finType = document.getElementById('fin-type').value;
  const amountRial = parseFormattedNumber(document.getElementById('fin-amount').value);
  const parties = parseInt(document.getElementById('fin-parties').value) || 2;
  const pages = parseInt(document.getElementById('fin-pages').value) || 1;

  const baseTahrir = 3_780_000;
  const tahrirRial = amountRial > 0 ? calculateTiered(amountRial, baseTahrir, FINANCIAL_TIERS) : 0;

  // Haq-ol-Sabt
  let sabtRate = 0.005; // 0.5% default civil
  if (finType === 'bank_mortgage') sabtRate = 0.0005; // Article 11 (0.05%)
  else if (finType === 'financial_debt') sabtRate = 0.002;

  const sabtRial = Math.round(amountRial * sabtRate);
  const vatRial = Math.round(tahrirRial * 0.10);
  const elecRial = 300_000;

  const extraPartiesRial = Math.max(0, parties - 2) * 109_000;
  const extraPagesRial = Math.max(0, pages - 1) * 200_000;
  const totalExtra = extraPartiesRial + extraPagesRial;

  const grandTotalRial = tahrirRial + sabtRial + vatRial + elecRial + totalExtra;
  const grandTotalToman = Math.round(grandTotalRial / 10);

  document.getElementById('fin-res-tahrir').textContent = formatNumber(tahrirRial) + ' ریال';
  document.getElementById('fin-res-sabt').textContent = formatNumber(sabtRial) + ' ریال';
  document.getElementById('fin-res-vat').textContent = formatNumber(vatRial) + ' ریال';

  const extraRow = document.getElementById('fin-row-extra');
  if (totalExtra > 0) {
    extraRow.style.display = 'flex';
    document.getElementById('fin-res-extra').textContent = formatNumber(totalExtra) + ' ریال';
  } else {
    extraRow.style.display = 'none';
  }

  document.getElementById('fin-total-toman').textContent = formatNumber(grandTotalToman) + ' تومان';
  document.getElementById('fin-total-rial').textContent = formatNumber(grandTotalRial) + ' ریال';

  return { tahrirRial, sabtRial, vatRial, grandTotalRial, grandTotalToman };
}

// ----------------------------------------------------
// TAB 3: RENT CALCULATIONS
// ----------------------------------------------------
function calculateRent() {
  const depositRial = parseFormattedNumber(document.getElementById('rent-deposit').value);
  const monthlyRial = parseFormattedNumber(document.getElementById('rent-monthly').value);
  const durationMonths = parseInt(document.getElementById('rent-duration').value) || 12;

  // Base calculation: Total rent over term + 36% of deposit per year (pro-rated)
  const totalRentOverTerm = monthlyRial * durationMonths;
  const annualDepositEquivalent = depositRial * 0.36 * (durationMonths / 12);
  const baseCalcValue = totalRentOverTerm + annualDepositEquivalent;

  const baseTahrir = 3_000_000;
  const tahrirRial = baseCalcValue > 0 ? calculateTiered(baseCalcValue, baseTahrir, FINANCIAL_TIERS) : 0;
  const sabtRial = Math.round(baseCalcValue * 0.002); // 0.2%
  const vatRial = Math.round(tahrirRial * 0.10);
  const elecRial = 300_000;

  const grandTotalRial = tahrirRial + sabtRial + vatRial + elecRial;
  const grandTotalToman = Math.round(grandTotalRial / 10);

  document.getElementById('rent-res-base').textContent = formatNumber(baseCalcValue) + ' ریال';
  document.getElementById('rent-res-tahrir').textContent = formatNumber(tahrirRial) + ' ریال';
  document.getElementById('rent-res-sabt').textContent = formatNumber(sabtRial) + ' ریال';
  document.getElementById('rent-res-vat').textContent = formatNumber(vatRial) + ' ریال';

  document.getElementById('rent-total-toman').textContent = formatNumber(grandTotalToman) + ' تومان';
  document.getElementById('rent-total-rial').textContent = formatNumber(grandTotalRial) + ' ریال';

  return { tahrirRial, sabtRial, grandTotalRial, grandTotalToman };
}

// ----------------------------------------------------
// TAB 4: INHERITANCE CALCULATIONS
// ----------------------------------------------------
function calculateInheritance() {
  const deceased = document.getElementById('inh-deceased').value;
  const area = parseFloat(document.getElementById('inh-area').value) || 0;
  const spouses = parseInt(document.getElementById('inh-spouses').value) || 0;
  const sons = parseInt(document.getElementById('inh-sons').value) || 0;
  const daughters = parseInt(document.getElementById('inh-daughters').value) || 0;
  const hasFather = document.getElementById('inh-father').checked;
  const hasMother = document.getElementById('inh-mother').checked;

  const hasChildren = (sons + daughters) > 0;
  const tableBody = document.getElementById('inh-table-body');
  tableBody.innerHTML = '';

  let kmm = 24; // Common Denominator standard
  if (!hasChildren) kmm = 12;

  let totalAllocatedShares = 0;
  const rows = [];

  // 1. Spouse Share
  if (spouses > 0) {
    if (deceased === 'male') {
      // Wife gets 1/8 if children, 1/4 if no children
      const fracNumerator = hasChildren ? 1 : 2;
      const fracDenominator = 8;
      const spouseTotalDang = hasChildren ? (6 / 8) : (6 / 4);
      const dangEach = spouseTotalDang / spouses;
      const metrageEach = area > 0 ? (dangEach / 6) * area : 0;

      rows.push({
        name: 'زوجه (همسر متوفی)',
        count: spouses,
        fraction: hasChildren ? '۱/۸ کل ترکه' : '۱/۴ کل ترکه',
        dang: dangEach.toFixed(4) + (spouses > 1 ? ' (هر کدام)' : ''),
        metrage: metrageEach > 0 ? metrageEach.toFixed(2) : '-'
      });
    } else {
      // Husband gets 1/4 if children, 1/2 if no children
      const dang = hasChildren ? 1.5 : 3.0;
      const metrage = area > 0 ? (dang / 6) * area : 0;
      rows.push({
        name: 'زوج (شوهر متوفی)',
        count: 1,
        fraction: hasChildren ? '۱/۴ کل ترکه' : '۱/۲ کل ترکه',
        dang: dang.toFixed(4),
        metrage: metrage > 0 ? metrage.toFixed(2) : '-'
      });
    }
  }

  // 2. Parents
  if (hasFather) {
    const dang = hasChildren ? 1.0 : 2.0; // 1/6 with children
    const metrage = area > 0 ? (dang / 6) * area : 0;
    rows.push({
      name: 'پدر متوفی',
      count: 1,
      fraction: hasChildren ? '۱/۶ فرض قانونی' : 'باقی‌مانده ترکه',
      dang: dang.toFixed(4),
      metrage: metrage > 0 ? metrage.toFixed(2) : '-'
    });
  }

  if (hasMother) {
    const dang = hasChildren ? 1.0 : 2.0; // 1/6 with children
    const metrage = area > 0 ? (dang / 6) * area : 0;
    rows.push({
      name: 'مادر متوفی',
      count: 1,
      fraction: hasChildren ? '۱/۶ فرض قانونی' : '۱/۳ یا رد',
      dang: dang.toFixed(4),
      metrage: metrage > 0 ? metrage.toFixed(2) : '-'
    });
  }

  // 3. Children (2:1 ratio for sons and daughters)
  if (hasChildren) {
    // Remaining dang after fixed portions
    let fixedDang = 0;
    if (spouses > 0) fixedDang += (deceased === 'male' ? (6 / 8) : 1.5);
    if (hasFather) fixedDang += 1.0;
    if (hasMother) fixedDang += 1.0;

    const remainingDang = Math.max(0, 6 - fixedDang);
    const totalChildUnits = (sons * 2) + daughters;

    if (totalChildUnits > 0) {
      const perUnitDang = remainingDang / totalChildUnits;

      if (sons > 0) {
        const sonDangEach = perUnitDang * 2;
        const sonMetrage = area > 0 ? (sonDangEach / 6) * area : 0;
        rows.push({
          name: 'پسر (هر نفر)',
          count: sons,
          fraction: 'سهم پسر (۲ سهم)',
          dang: sonDangEach.toFixed(4),
          metrage: sonMetrage > 0 ? sonMetrage.toFixed(2) : '-'
        });
      }

      if (daughters > 0) {
        const daughterDangEach = perUnitDang * 1;
        const daughterMetrage = area > 0 ? (daughterDangEach / 6) * area : 0;
        rows.push({
          name: 'دختر (هر نفر)',
          count: daughters,
          fraction: 'سهم دختر (۱ سهم)',
          dang: daughterDangEach.toFixed(4),
          metrage: daughterMetrage > 0 ? daughterMetrage.toFixed(2) : '-'
        });
      }
    }
  }

  // Render rows
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${r.name}</strong></td>
      <td>${formatNumber(r.count)} نفر</td>
      <td>${r.fraction}</td>
      <td style="color:#002279; font-weight:800;">${r.dang}</td>
      <td style="color:#B89750; font-weight:800;">${r.metrage}</td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById('inh-kmm-badge').textContent = 'مخرج مشترک: ' + formatNumber(kmm);
}

// ----------------------------------------------------
// TAB 5: PROPORTION CALCULATIONS
// ----------------------------------------------------
function calculateProportion() {
  const x = parseFloat(document.getElementById('prop-x').value) || 0;
  const y = parseFloat(document.getElementById('prop-y').value) || 1;
  const area = parseFloat(document.getElementById('prop-area').value) || 0;

  if (y <= 0) return;

  const percent = (x / y) * 100;
  const dang = (x / y) * 6;
  const habeh = dang * 16; // 96 habeh total in 6 dangs
  const metrage = (x / y) * area;

  // GCD for simplified fraction
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  const divisor = gcd(Math.round(x), Math.round(y));
  const simX = Math.round(x) / (divisor || 1);
  const simY = Math.round(y) / (divisor || 1);

  document.getElementById('prop-res-percent').textContent = percent.toFixed(3) + ' ٪';
  document.getElementById('prop-res-dang').textContent = dang.toFixed(4) + ' دانگ';
  document.getElementById('prop-res-habeh').textContent = habeh.toFixed(2) + ' حبه (از ۹۶)';
  document.getElementById('prop-res-metrage').textContent = metrage > 0 ? metrage.toFixed(2) + ' مترمربع' : '-';
  document.getElementById('prop-res-fraction').textContent = simX + ' بر ' + simY;
}

// ----------------------------------------------------
// TAB 6: CADASTRE & MAP
// ----------------------------------------------------
function updateMapLinks() {
  const lat = parseFloat(document.getElementById('cad-lat').value) || 35.7725;
  const lng = parseFloat(document.getElementById('cad-lng').value) || 51.4178;

  document.getElementById('link-google').href = `https://www.google.com/maps?q=${lat},${lng}`;
  document.getElementById('link-neshan').href = `https://neshan.org/maps/@${lat},${lng},17z`;
  document.getElementById('link-balad').href = `https://balad.ir/location?latitude=${lat}&longitude=${lng}`;
  document.getElementById('link-waze').href = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

// ----------------------------------------------------
// STORAGE & HISTORY
// ----------------------------------------------------
const STORAGE_KEY = 'notary662_vanilla_history';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveHistoryItem(item) {
  const list = getHistory();
  list.unshift({ ...item, id: Date.now(), date: new Date().toLocaleDateString('fa-IR') });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 30)));
  renderHistory();
}

function renderHistory() {
  const list = getHistory();
  document.getElementById('saved-count').textContent = formatNumber(list.length);
  const container = document.getElementById('history-list');
  const emptyState = document.getElementById('history-empty');

  if (list.length === 0) {
    emptyState.style.display = 'block';
    container.innerHTML = '';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = '';

  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div>
        <div class="history-title">${item.title}</div>
        <div class="history-date">${item.date} | ${item.desc || ''}</div>
      </div>
      <div class="history-amount">${formatNumber(item.amount)} تومان</div>
    `;
    container.appendChild(div);
  });
}

// ----------------------------------------------------
// DISPATCH ACTIVE TAB CALCULATION
// ----------------------------------------------------
function calculateActive() {
  const activeTab = document.querySelector('.nav-tab.active')?.dataset.tab;
  if (activeTab === 'real_estate') calculateRealEstate();
  else if (activeTab === 'financial') calculateFinancial();
  else if (activeTab === 'rent') calculateRent();
  else if (activeTab === 'inheritance') calculateInheritance();
  else if (activeTab === 'proportions') calculateProportion();
  else if (activeTab === 'cadastre') updateMapLinks();
}

// ----------------------------------------------------
// INITIALIZATION ON DOM READY
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Tab Navigation
  const tabs = document.querySelectorAll('.nav-tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');

      calculateActive();
    });
  });

  // Attach number formatting
  attachNumberFormat(document.getElementById('re-price'), document.getElementById('re-price-toman'));
  attachNumberFormat(document.getElementById('fin-amount'), document.getElementById('fin-amount-toman'));
  attachNumberFormat(document.getElementById('rent-deposit'), document.getElementById('rent-deposit-toman'));
  attachNumberFormat(document.getElementById('rent-monthly'), document.getElementById('rent-monthly-toman'));

  // Inputs change events
  ['re-sellers', 're-buyers', 're-pages', 're-inq-reg', 're-inq-tax', 're-inq-mun'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateRealEstate);
    document.getElementById(id)?.addEventListener('change', calculateRealEstate);
  });

  ['fin-type', 'fin-parties', 'fin-pages'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', calculateFinancial);
    document.getElementById(id)?.addEventListener('input', calculateFinancial);
  });

  ['rent-duration', 'rent-nature'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', calculateRent);
  });

  ['inh-deceased', 'inh-area', 'inh-spouses', 'inh-sons', 'inh-daughters', 'inh-father', 'inh-mother'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateInheritance);
    document.getElementById(id)?.addEventListener('change', calculateInheritance);
  });

  ['prop-x', 'prop-y', 'prop-area'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateProportion);
  });

  ['cad-lat', 'cad-lng'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateMapLinks);
  });

  // Save Buttons
  document.getElementById('btn-save-re')?.addEventListener('click', () => {
    const res = calculateRealEstate();
    saveHistoryItem({
      title: 'سند قطعی غیرمنقول',
      desc: 'ارزش معاملاتی: ' + document.getElementById('re-price').value + ' ریال',
      amount: res.grandTotalToman
    });
    alert('محاسبه سند غیرمنقول با موفقیت در سوابق ذخیره شد.');
  });

  document.getElementById('btn-save-fin')?.addEventListener('click', () => {
    const res = calculateFinancial();
    saveHistoryItem({
      title: 'سند مالی / رهنی',
      desc: 'مبلغ تسهیلات: ' + document.getElementById('fin-amount').value + ' ریال',
      amount: res.grandTotalToman
    });
    alert('محاسبه سند مالی با موفقیت در سوابق ذخیره شد.');
  });

  document.getElementById('btn-save-rent')?.addEventListener('click', () => {
    const res = calculateRent();
    saveHistoryItem({
      title: 'اجاره‌نامه رسمی',
      desc: 'ودیعه و اجاره ماهانه',
      amount: res.grandTotalToman
    });
    alert('محاسبه اجاره‌نامه با موفقیت در سوابق ذخیره شد.');
  });

  // Copy Buttons
  document.getElementById('btn-copy-re')?.addEventListener('click', () => {
    const total = document.getElementById('re-total-toman').textContent;
    const tahrir = document.getElementById('re-res-tahrir').textContent;
    navigator.clipboard.writeText(`دفتر اسناد رسمی ۶۶۲ تهران\nهزینه سند قطعی غیرمنقول:\nحق‌التحریر: ${tahrir}\nمجموع کل: ${total}`);
    alert('صورت‌حساب سند غیرمنقول در کلیپ‌بورد کپی شد.');
  });

  document.getElementById('btn-copy-fin')?.addEventListener('click', () => {
    const total = document.getElementById('fin-total-toman').textContent;
    navigator.clipboard.writeText(`دفتر اسناد رسمی ۶۶۲ تهران\nهزینه سند مالی و رهنی:\nمجموع کل: ${total}`);
    alert('صورت‌حساب سند مالی کپی شد.');
  });

  document.getElementById('btn-copy-rent')?.addEventListener('click', () => {
    const total = document.getElementById('rent-total-toman').textContent;
    navigator.clipboard.writeText(`دفتر اسناد رسمی ۶۶۲ تهران\nهزینه تنظیم سند اجاره:\nمجموع کل: ${total}`);
    alert('صورت‌حساب اجاره‌نامه کپی شد.');
  });

  document.getElementById('btn-copy-prop')?.addEventListener('click', () => {
    const dang = document.getElementById('prop-res-dang').textContent;
    const metrage = document.getElementById('prop-res-metrage').textContent;
    navigator.clipboard.writeText(`تناسب سهام ملک:\nسهم دانگ: ${dang}\nمتراژ اختصاصی: ${metrage}`);
    alert('نتیجه تناسب سهام کپی شد.');
  });

  // Print Buttons
  document.getElementById('btn-print-page')?.addEventListener('click', () => window.print());
  document.getElementById('btn-print-re')?.addEventListener('click', () => window.print());
  document.getElementById('btn-print-fin')?.addEventListener('click', () => window.print());
  document.getElementById('btn-print-rent')?.addEventListener('click', () => window.print());
  document.getElementById('btn-print-inh')?.addEventListener('click', () => window.print());

  // Clear History
  document.getElementById('btn-clear-history')?.addEventListener('click', () => {
    if (confirm('آیا از حذف تمامی سوابق اطمینان دارید؟')) {
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
    }
  });

  // Initial calculation runs
  calculateRealEstate();
  calculateFinancial();
  calculateRent();
  calculateInheritance();
  calculateProportion();
  updateMapLinks();
  renderHistory();
});
