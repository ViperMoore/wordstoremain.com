(function() {
  // ── CURRENCY SWITCHER ──
  const allPrices = document.querySelectorAll('[data-gbp]');
  const allBtns   = document.querySelectorAll('.currency-btn');

  function setCurrency(currency) {
    allPrices.forEach(el => { el.textContent = el.dataset[currency]; });
    allBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.currency === currency));
    try { localStorage.setItem('wtr-currency', currency); } catch(e) {}
  }

  allBtns.forEach(btn => btn.addEventListener('click', () => setCurrency(btn.dataset.currency)));

  let saved = 'gbp';
  try { saved = localStorage.getItem('wtr-currency') || 'gbp'; } catch(e) {}
  setCurrency(saved);

  // ── HAMBURGER ──
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay    = document.getElementById('overlay');

  function openMenu()  { hamburger.classList.add('open'); mobileMenu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  if (hamburger) hamburger.addEventListener('click', () => hamburger.classList.contains('open') ? closeMenu() : openMenu());
  if (overlay)   overlay.addEventListener('click', closeMenu);
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
})();
