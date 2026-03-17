// ===== API BASE URL =====
// Automatically uses live Vercel URL in production, localhost in dev
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : '';  // Empty string = same domain on Vercel

// ===== MOBILE MENU =====
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// ===== BOOKING TABS =====
function switchTab(el, type) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const returnField = document.querySelector('.return-field');
  returnField.style.display = type === 'roundtrip' ? 'flex' : 'none';
}

// ===== SWAP CITIES =====
function swapCities() {
  const inputs = document.querySelectorAll('.booking-form input[type="text"]');
  if (inputs.length >= 2) {
    const temp = inputs[0].value;
    inputs[0].value = inputs[1].value;
    inputs[1].value = temp;
  }
}

// ===== SEARCH HANDLER =====
function handleSearch() {
  const inputs = document.querySelectorAll('.booking-form input');
  const from = inputs[0].value.trim();
  const to = inputs[1].value.trim();
  if (!from || !to) { showToast('⚠️ Please enter pickup and destination cities.'); return; }
  const date = inputs[2].value;
  const vehicle = document.querySelector('.booking-form select').value;
  showToast(`🔍 Searching vehicles from ${from} to ${to}...`);
  fetch(`${API_BASE}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, date, vehicleType: vehicle }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) showToast(`✅ Found ${data.vehicles.length} vehicles for ${from} → ${to}`);
    })
    .catch(() => showToast('⚠️ Server not reachable. Please try again.'));
}

// ===== ROUTE CARD CLICK =====
function selectRoute(from, to) {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const inputs = document.querySelectorAll('.booking-form input[type="text"]');
    if (inputs.length >= 2) { inputs[0].value = from; inputs[1].value = to; inputs[0].focus(); }
    showToast(`📍 Route set: ${from} → ${to}`);
  }, 700);
}

// ===== CONTACT FORM =====
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  const formData = {
    name: e.target[0].value, phone: e.target[1].value,
    from: e.target[2].value, to: e.target[3].value,
    vehicle: e.target[4].value, message: e.target[5].value,
  };
  fetch(`${API_BASE}/api/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then(data => {
      showToast(data.success ? '✅ ' + data.message : '❌ Something went wrong.');
      if (data.success) e.target.reset();
    })
    .catch(() => showToast('❌ Cannot connect to server. Please try again.'))
    .finally(() => { btn.textContent = 'Send Enquiry'; btn.disabled = false; });
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-card, .fleet-card, .route-card, .feature-item, .testi-card')
    .forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
      observer.observe(el);
    });
}

// ===== NAVBAR SCROLL =====
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 80
      ? '0 4px 30px rgba(13,27,62,0.15)'
      : '0 2px 16px rgba(13,27,62,0.07)';
  });
}

// ===== ACTIVE NAV =====
function initActiveSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id'); });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--amber)' : '';
    });
  });
}

// ===== DEFAULT DATES =====
function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  if (dateInputs[0]) dateInputs[0].value = today;
  if (dateInputs[1]) dateInputs[1].value = tomorrow;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbarScroll();
  initActiveSectionHighlight();
  setDefaultDates();
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => { document.getElementById('mobileMenu').style.display = 'none'; });
  });
});