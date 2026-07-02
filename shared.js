(function() {
  // ── CURRENCY SWITCHER ──
  const allPrices = document.querySelectorAll('[data-gbp]');
  const allBtns   = document.querySelectorAll('.currency-btn');

  // Updates the visible prices/buttons only — does not persist anything.
  function applyCurrency(currency) {
    allPrices.forEach(el => { el.textContent = el.dataset[currency]; });
    allBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.currency === currency));
  }

  // Used when the visitor explicitly clicks a currency button —
  // this is the only path that saves an explicit preference.
  function setCurrency(currency) {
    applyCurrency(currency);
    try { localStorage.setItem('wtr-currency', currency); } catch(e) {}
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }

  allBtns.forEach(btn => btn.addEventListener('click', () => setCurrency(btn.dataset.currency)));

  // Preference order:
  // 1) an explicit choice the visitor already made (localStorage)
  // 2) a geo-based default set on an earlier page view this visit (cookie)
  // 3) GBP shown immediately, upgraded live via a geo lookup on the visitor's
  //    very first page view — replaces the Cloudflare Worker that was never deployed.
  let saved = null;
  try { saved = localStorage.getItem('wtr-currency'); } catch(e) {}

  if (saved === 'usd' || saved === 'gbp') {
    applyCurrency(saved);
  } else {
    const geo = getCookie('wtr-geo-currency');
    if (geo === 'usd' || geo === 'gbp') {
      applyCurrency(geo);
    } else {
      applyCurrency('gbp');
      fetch('/cdn-cgi/trace')
        .then(r => r.text())
        .then(text => {
          const match = text.match(/loc=([A-Z]{2})/);
          const country = match ? match[1] : null;
          if (!country) return;
          const currency = country === 'GB' ? 'gbp' : 'usd';
          setCookie('wtr-geo-currency', currency, 365);
          let clicked = null;
          try { clicked = localStorage.getItem('wtr-currency'); } catch(e) {}
          if (!clicked) applyCurrency(currency);
        })
        .catch(function() {});
    }
  }

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
