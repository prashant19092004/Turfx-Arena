(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('load', () => window.scrollTo(0, 0), { once: true });
  const c = window.TURF_CONFIG;
  const msg = 'Hi, I would like to enquire about booking a turf slot. Could you please share the available timings and pricing?';
  const valid = value => value && !value.startsWith('[');
  const whatsUrl = valid(c.whatsapp)
    ? `https://wa.me/${c.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  const phoneUrl = valid(c.phone) ? `tel:${c.phone.replace(/[^+\d]/g, '')}` : '#contact';
  const mapUrl = valid(c.mapsUrl) ? c.mapsUrl : '#location';
  document.title = valid(c.name) ? `${c.name} | ${c.sport} Turf Booking` : 'Sports Turf Booking';
  const set = (selector, value) => document.querySelectorAll(selector).forEach(el => el.textContent = value);
  set('[data-business-name]', c.name); set('[data-sport]', c.sport); set('[data-city]', c.city); set('[data-address]', c.address); set('[data-hours]', c.hours); set('[data-phone]', c.phone);
  // document.querySelectorAll('.whatsapp-link, .book-link').forEach(a => { a.href = whatsUrl; a.target = '_blank'; a.rel = 'noopener'; });
  // document.querySelectorAll('.phone-link').forEach(a => a.href = phoneUrl);
  // document.querySelectorAll('.directions-link').forEach(a => { a.href = mapUrl; a.target = valid(c.mapsUrl) ? '_blank' : ''; a.rel = 'noopener'; });
  // document.getElementById('pricing-copy').textContent = c.pricing ? c.pricing : 'Contact us for pricing and available timings.';
  // document.getElementById('facility-grid').innerHTML = c.facilities.map(f => `<article class="facility"><span>${f.icon}</span><h3>${f.title}</h3><p>${f.description}</p></article>`).join('');
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = c.gallery.map((item, i) => `<button class="gallery-item item-${i}" type="button"><img src="${item.src}" alt="${item.alt}" loading="lazy" /><span>View image ↗</span></button>`).join('');
  const dialog = document.getElementById('lightbox');
  grid.querySelectorAll('button').forEach((button, i) => button.addEventListener('click', () => { const image = dialog.querySelector('img'); image.src = c.gallery[i].src; image.alt = c.gallery[i].alt; dialog.showModal(); }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  const promo = document.getElementById('promo-modal');
  if (c.showDiscountPopup) {
    window.setTimeout(() => promo.showModal(), 350);
    promo.querySelector('.promo-close').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); promo.close(); });
    // promo.addEventListener('click', event => {
    //   if (event.target.closest('.promo-close') || event.target.closest('.promo-card')) return;
    //   window.location.assign(whatsUrl);
    // });
  }
  const toggle = document.querySelector('.menu-toggle'), nav = document.querySelector('nav');
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', !open); nav.classList.toggle('open', !open); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }));
  document.getElementById('year').textContent = new Date().getFullYear();
})();
