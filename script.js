const valid = value => typeof value === 'string' && value.trim() !== '' && !value.startsWith('[');
const cleanPhone = value => (typeof value === 'string' ? value.replace(/[^+\d]/g, '') : '');

(() => {
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = value;
    });
  };

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.addEventListener('load', () => window.scrollTo(0, 0), { once: true });

  const c = window.TURF_CONFIG || {};
  const msg = 'Hi, I would like to enquire about booking a turf slot. Could you please share the available timings and pricing?';
  const whatsUrl = valid(c.whatsapp)
    ? `https://wa.me/${cleanPhone(c.whatsapp)}?text=${encodeURIComponent(msg)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  const phoneUrl = valid(c.phone) ? `tel:${cleanPhone(c.phone)}` : '#contact';
  const mapUrl = valid(c.mapsUrl) ? c.mapsUrl : '#location';

  document.title = valid(c.name) ? `${c.name} | ${valid(c.sport) ? c.sport : 'Sports'} Turf Booking` : 'Sports Turf Booking';

  setText('[data-business-name]', valid(c.name) ? c.name : 'TurfX Arena');
  setText('[data-sport]', valid(c.sport) ? c.sport : 'Football / Cricket / Both');
  setText('[data-city]', valid(c.city) ? c.city : 'Your city');
  setText('[data-address]', valid(c.address) ? c.address : 'Your turf address');
  setText('[data-hours]', valid(c.hours) ? c.hours : 'Open daily');
  setText('[data-phone]', valid(c.phone) ? c.phone : '[YOUR PHONE NUMBER]');

  document.querySelectorAll('.whatsapp-link, .book-link').forEach(link => {
    link.href = whatsUrl;
    link.target = '_blank';
    link.rel = 'noopener';
  });

  document.querySelectorAll('.phone-link').forEach(link => {
    link.href = phoneUrl;
  });

  document.querySelectorAll('.directions-link').forEach(link => {
    link.href = mapUrl;
    if (valid(c.mapsUrl)) {
      link.target = '_blank';
      link.rel = 'noopener';
    } else {
      link.removeAttribute('target');
      link.removeAttribute('rel');
    }
  });

  const pricingCopy = document.getElementById('pricing-copy');
  if (pricingCopy) {
    pricingCopy.textContent = valid(c.pricing) ? c.pricing : 'Contact us for pricing and available timings.';
  }

  const facilityGrid = document.getElementById('facility-grid');
  if (facilityGrid) {
    const facilities = Array.isArray(c.facilities) ? c.facilities : [];
    facilityGrid.innerHTML = facilities.length
      ? facilities.map(facility => `
        <article class="facility">
          <span>${facility.icon || '✦'}</span>
          <h3>${facility.title || 'Facility'}</h3>
          <p>${facility.description || 'Add a verified feature offered at your turf.'}</p>
        </article>
      `).join('')
      : '';
  }

  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    const gallery = Array.isArray(c.gallery) ? c.gallery : [];
    galleryGrid.innerHTML = gallery.map((item, index) => `
      <button class="gallery-item item-${index}" type="button">
        <img src="${item.src || ''}" alt="${item.alt || 'Sports turf image'}" loading="lazy" />
        <span>View image ↗</span>
      </button>
    `).join('');
  }

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });

    nav.querySelectorAll('a').forEach(anchor => {
      anchor.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      });
    });
  }

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();

const promo = document.getElementById('promoOverlay');
const promoClose = document.getElementById('promoClose');
const promoBook = document.getElementById('promoBook');
let lastFocused = null;
const config = window.TURF_CONFIG || {};
const shouldShowPromo = config.showDiscountPopup !== false;

function openPromo() {
  if (!promo || !shouldShowPromo) return;

  lastFocused = document.activeElement;
  promo.classList.add('show');
  promo.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  if (promoClose) {
    setTimeout(() => promoClose.focus(), 50);
  }
}

function closePromo() {
  if (!promo) return;

  promo.classList.remove('show');
  promo.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
}

if (promo) {
  if (promoBook) {
    const defaultOfferLink = 'https://wa.me/9835307159?text=Hi,%20I%20want%20Id.';
    const offerLink = valid(config.whatsapp)
      ? `https://wa.me/${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I would like to enquire about the current turf offer.')}`
      : defaultOfferLink;

    promoBook.href = offerLink;
    promoBook.setAttribute('target', '_blank');
    promoBook.setAttribute('rel', 'noopener');
    promoBook.addEventListener('click', closePromo);
  }

  if (promoClose) {
    promoClose.addEventListener('click', event => {
      event.preventDefault();
      closePromo();
    });
  }

  promo.addEventListener('click', event => {
    if (event.target === promo) {
      closePromo();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && promo.classList.contains('show')) {
      closePromo();
    }

    if (event.key === 'Tab' && promo.classList.contains('show')) {
      const focusable = [...promo.querySelectorAll('button, a')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (shouldShowPromo) {
    openPromo();
  }
}
