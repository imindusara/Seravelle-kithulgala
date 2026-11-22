/**
 * SERAVELLE KITHULGALA - MAIN JAVASCRIPT BUNDLE
 * Production logic for navigation, search, date picker, testimonials,
 * lightbox, form validation, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. STICKY HEADER & SCROLL BEHAVIOR
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  const mobileStickyBar = document.querySelector('.mobile-sticky-book-bar');
  const heroSection = document.querySelector('.hero-section');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header scroll background toggle
    if (header && !header.classList.contains('header-solid')) {
      if (scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Mobile sticky booking bar toggle
    if (mobileStickyBar && heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (scrollY > heroBottom - 200) {
        mobileStickyBar.style.display = 'flex';
      } else {
        mobileStickyBar.style.display = 'none';
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run

  /* ------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     ------------------------------------------------------------------------ */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenuWrapper = document.querySelector('.nav-menu-wrapper');

  if (navToggle && navMenuWrapper) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navMenuWrapper.classList.toggle('active');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenuWrapper.classList.contains('active') &&
        !navMenuWrapper.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navMenuWrapper.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Mobile dropdown toggle
    const dropdownToggles = document.querySelectorAll('.nav-item.dropdown .dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          const menu = toggle.nextElementSibling;
          if (menu) {
            menu.classList.toggle('show');
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. DATE PICKER LOGIC & RESTRICTIONS
     ------------------------------------------------------------------------ */
  const checkinInput = document.getElementById('hero-checkin');
  const checkoutInput = document.getElementById('hero-checkout');

  // Format Date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // Setup date limits
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (checkinInput && checkoutInput) {
    checkinInput.min = formatDate(today);
    checkinInput.value = formatDate(today);

    checkoutInput.min = formatDate(tomorrow);
    checkoutInput.value = formatDate(tomorrow);

    checkinInput.addEventListener('change', () => {
      const selectedCheckin = new Date(checkinInput.value);
      if (isNaN(selectedCheckin.getTime())) return;

      const nextDay = new Date(selectedCheckin);
      nextDay.setDate(nextDay.getDate() + 1);
      const minCheckoutStr = formatDate(nextDay);

      checkoutInput.min = minCheckoutStr;

      // If current checkout is before or same as new checkin, advance it
      const currentCheckout = new Date(checkoutInput.value);
      if (isNaN(currentCheckout.getTime()) || currentCheckout <= selectedCheckin) {
        checkoutInput.value = minCheckoutStr;
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. HERO CHECK AVAILABILITY FORM
     ------------------------------------------------------------------------ */
  const heroBookingForm = document.getElementById('hero-booking-form');
  if (heroBookingForm) {
    heroBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkin = checkinInput ? checkinInput.value : '';
      const checkout = checkoutInput ? checkoutInput.value : '';
      const guests = document.getElementById('hero-guests') ? document.getElementById('hero-guests').value : '2';
      const room = document.getElementById('hero-room') ? document.getElementById('hero-room').value : '';

      if (!checkin || !checkout) {
        showToast('Please select dates', 'Choose valid check-in and check-out dates to check availability.', 'error');
        return;
      }

      // Smooth transition to booking.html with prefilled dates
      const submitBtn = heroBookingForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Searching Rooms...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        let redirectUrl = `booking.html?checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}&guests=${encodeURIComponent(guests)}`;
        if (room) {
          redirectUrl += `&room=${encodeURIComponent(room)}`;
        }
        window.location.href = redirectUrl;
      }, 400);
    });
  }

  /* ------------------------------------------------------------------------
     5. LIVE SEARCH MODAL
     ------------------------------------------------------------------------ */
  const searchModal = document.getElementById('search-modal');
  const searchOpenBtns = document.querySelectorAll('.header-search-btn, .search-trigger');
  const searchCloseBtn = document.getElementById('search-close');
  const searchInput = document.getElementById('search-modal-input');
  const searchResultsList = document.getElementById('search-results-list');

  const openSearch = () => {
    if (!searchModal) return;
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 150);
      renderSearchResults('');
    }
  };

  const closeSearch = () => {
    if (!searchModal) return;
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  searchOpenBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  }));

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // Render Search Items
  const renderSearchResults = (query) => {
    if (!searchResultsList) return;
    const cleanQuery = query.toLowerCase().trim();
    const index = window.SERAVELLE_SEARCH_INDEX || [];

    let filtered = index;
    if (cleanQuery) {
      filtered = index.filter(item => {
        return (
          item.title.toLowerCase().includes(cleanQuery) ||
          item.description.toLowerCase().includes(cleanQuery) ||
          item.tags.some(tag => tag.toLowerCase().includes(cleanQuery))
        );
      });
    }

    if (filtered.length === 0) {
      searchResultsList.innerHTML = `
        <div class="search-empty-state">
          <p>No experiences or rooms found for "<strong>${escapeHtml(query)}</strong>".</p>
          <p class="small text-muted">Try searching for "Suite", "Dining", "Spa", "Pool", or "Activities".</p>
        </div>
      `;
      return;
    }

    searchResultsList.innerHTML = filtered.map(item => `
      <li>
        <a href="${item.url}" class="search-result-item">
          <span class="search-result-category">${escapeHtml(item.category)}</span>
          <div>
            <div class="search-result-title">${escapeHtml(item.title)}</div>
            <p class="search-result-desc">${escapeHtml(item.description)}</p>
          </div>
        </a>
      </li>
    `).join('');
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  /* ------------------------------------------------------------------------
     6. TESTIMONIALS SLIDER
     ------------------------------------------------------------------------ */
  const sliderContainer = document.querySelector('.testimonial-slider-container');
  if (sliderContainer) {
    const track = sliderContainer.querySelector('.testimonial-track');
    const slides = sliderContainer.querySelectorAll('.testimonial-slide');
    const prevBtn = sliderContainer.querySelector('.slider-prev');
    const nextBtn = sliderContainer.querySelector('.slider-next');
    const dotsContainer = sliderContainer.querySelector('.slider-dots');

    if (track && slides.length > 0) {
      let currentIndex = 0;
      let autoplayTimer = null;

      // Build dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.classList.add('slider-dot');
          if (idx === 0) dot.classList.add('active');
          dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
          dot.addEventListener('click', () => goToSlide(idx));
          dotsContainer.appendChild(dot);
        });
      }

      const updateSlider = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      };

      const goToSlide = (index) => {
        if (index < 0) {
          currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
          currentIndex = 0;
        } else {
          currentIndex = index;
        }
        updateSlider();
      };

      if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

      // Auto play
      const startAutoplay = () => {
        stopAutoplay();
        autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 6500);
      };

      const stopAutoplay = () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
      };

      sliderContainer.addEventListener('mouseenter', stopAutoplay);
      sliderContainer.addEventListener('mouseleave', startAutoplay);
      sliderContainer.addEventListener('focusin', stopAutoplay);
      sliderContainer.addEventListener('focusout', startAutoplay);

      startAutoplay();
    }
  }

  /* ------------------------------------------------------------------------
     7. ACCESSIBLE LIGHTBOX GALLERY
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('[data-lightbox]');

  if (lightboxModal && galleryItems.length > 0) {
    let currentGalleryIndex = 0;
    const galleryData = Array.from(galleryItems).map(item => ({
      src: item.getAttribute('data-lightbox-src') || item.getAttribute('href') || item.src,
      caption: item.getAttribute('data-lightbox-caption') || item.getAttribute('alt') || 'Seravelle Kithulgala Resort Luxury Experience'
    }));

    const showLightboxIndex = (index) => {
      if (index < 0) index = galleryData.length - 1;
      if (index >= galleryData.length) index = 0;
      currentGalleryIndex = index;

      const item = galleryData[currentGalleryIndex];
      lightboxImg.src = item.src;
      lightboxCaption.textContent = item.caption;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    galleryItems.forEach((el, idx) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        showLightboxIndex(idx);
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxIndex(currentGalleryIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxIndex(currentGalleryIndex + 1));

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------------
     8. GLOBAL KEYBOARD ACCESSIBILITY (Esc to close overlays)
     ------------------------------------------------------------------------ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchModal && searchModal.classList.contains('active')) {
        closeSearch();
      }
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (navMenuWrapper && navMenuWrapper.classList.contains('active')) {
        navToggle.click();
      }
    }
  });

  /* ------------------------------------------------------------------------
     9. TOAST NOTIFICATION UTILITY
     ------------------------------------------------------------------------ */
  window.showToast = (title, message, type = 'info') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast custom-toast-${type}`;
    toast.setAttribute('role', 'alert');

    const iconSvg = type === 'success' 
      ? '<svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>'
      : '<svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>';

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-body">
        <div class="toast-title">${escapeHtml(title)}</div>
        <p class="toast-message">${escapeHtml(message)}</p>
      </div>
      <button type="button" class="toast-dismiss" aria-label="Dismiss notification">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    };

    toast.querySelector('.toast-dismiss').addEventListener('click', dismiss);
    setTimeout(dismiss, 5000);
  };

  /* ------------------------------------------------------------------------
     10. NEWSLETTER & CONTACT FORM VALIDATIONS
     ------------------------------------------------------------------------ */
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!emailInput || !validateEmail(emailInput.value)) {
        showToast('Invalid Email', 'Please provide a valid email address to join Seravelle Kithulgala Circle.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Subscribing...';
      }

      setTimeout(() => {
        showToast('Subscribed!', 'Welcome to the Seravelle Kithulgala family. Your 10% welcome voucher has been sent to your inbox.', 'success');
        emailInput.value = '';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Subscribe';
        }
      }, 700);
    });
  });

  const contactForm = document.getElementById('seravelle-contact-form') || document.getElementById('cozy-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#contact-name').value.trim();
      const email = contactForm.querySelector('#contact-email').value.trim();
      const message = contactForm.querySelector('#contact-message').value.trim();
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        showToast('Required Fields Missing', 'Please fill in your name, email, and message.', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Invalid Email', 'Please enter a valid email address.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Transmitting Message...';
      }

      setTimeout(() => {
        showToast('Message Delivered', `Thank you, ${name}. Our concierge will reply within 4 hours.`, 'success');
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message';
        }
      }, 900);
    });
  }

  /* ------------------------------------------------------------------------
     11. COOKIE CONSENT BANNER
     ------------------------------------------------------------------------ */
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
  const declineCookiesBtn = document.getElementById('decline-cookies-btn');

  if (cookieBanner) {
    const hasConsent = localStorage.getItem('seravelle_cookie_consent');
    if (!hasConsent) {
      setTimeout(() => {
        cookieBanner.classList.add('active');
      }, 1200);
    }

    if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('seravelle_cookie_consent', 'all');
        cookieBanner.classList.remove('active');
        showToast('Preferences Saved', 'Your cookie preferences have been recorded.', 'info');
      });
    }

    if (declineCookiesBtn) {
      declineCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('seravelle_cookie_consent', 'essential');
        cookieBanner.classList.remove('active');
      });
    }
  }

  /* ------------------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------------------ */
  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }
});

