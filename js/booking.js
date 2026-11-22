/**
 * SERAVELLE KITHULGALA - INTERACTIVE BOOKING ENGINE
 * Dynamic multi-step reservation system for Seravelle Kithulgala Hotel, Kitulgala, Sri Lanka.
 * Features real rates ($72 - $104/night, 6-bedroom villa), pet-friendly options,
 * check-in from 1:00 PM, check-out until 12:00 PM.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Room Catalog Data aligned with Kitulgala property details
  const ROOMS_DATA = {
    'araliya-nil-manel': {
      id: 'araliya-nil-manel',
      name: 'Araliya & Nil Manel (Deluxe Garden View)',
      roomNo: 'Room No. 01 & 02',
      tag: 'Deluxe Room • Garden View',
      baseRate: 14000,
      capacity: 2,
      beds: '1 King / Twin Bed with Private Terrace Access',
      size: '34 m²',
      view: 'Tranquil Rainforest Garden Ambiance',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    'saman-sanctuary': {
      id: 'saman-sanctuary',
      name: 'The Saman Sanctuary (Super Deluxe Family Cabana)',
      roomNo: 'Room No. 03',
      tag: 'Super Deluxe Family Cabana • Garden View',
      baseRate: 18000,
      capacity: 4,
      beds: 'Master Bed + Two Twin Beds (Up to 4 Pax)',
      size: '68 m²',
      view: 'Lush Tropical Garden Cabana',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    },
    'seravelle-suite': {
      id: 'seravelle-suite',
      name: 'The Seravelle Suite (Super Deluxe River View)',
      roomNo: 'Room No. 04',
      tag: 'Super Deluxe Room • River View',
      baseRate: 14000,
      capacity: 2,
      beds: 'Handcrafted King Bed + Private Balcony',
      size: '56 m²',
      view: 'Emerald Waters of the Kelani River',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    },
    'seravelle-camp': {
      id: 'seravelle-camp',
      name: 'The Seravelle Camp (Luxury Glamping)',
      roomNo: 'Bespoke Outdoor Sanctuary',
      tag: 'Luxury Glamping • Nature Immersion',
      baseRate: 12000,
      capacity: 2,
      beds: 'Bespoke Glamping Bed + Canopy Deck',
      size: '48 m²',
      view: 'Open-Air Kitulgala Rainforest Canopy',
      image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80'
    }
  };

  // Backwards compatibility aliases
  ROOMS_DATA['deluxe-single'] = ROOMS_DATA['araliya-nil-manel'];
  ROOMS_DATA['deluxe-garden'] = ROOMS_DATA['seravelle-suite'];
  ROOMS_DATA['entire-villa'] = ROOMS_DATA['saman-sanctuary'];

  const TAX_RATE = 0.10; // 10% Local Tourism & Service Tax

  // DOM Elements
  const bookingCheckin = document.getElementById('booking-checkin');
  const bookingCheckout = document.getElementById('booking-checkout');
  const bookingGuests = document.getElementById('booking-guests');
  const roomSelectCards = document.querySelectorAll('.booking-room-option');
  const addonCheckboxes = document.querySelectorAll('.booking-addon-checkbox');
  const promoCodeInput = document.getElementById('promo-code-input');
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  const promoMessage = document.getElementById('promo-message');

  // Summary Elements
  const summaryRoomName = document.getElementById('summary-room-name');
  const summaryNights = document.getElementById('summary-nights');
  const summaryDates = document.getElementById('summary-dates');
  const summaryGuests = document.getElementById('summary-guests');
  const summaryRoomTotal = document.getElementById('summary-room-total');
  const summaryAddonsTotal = document.getElementById('summary-addons-total');
  const summaryTaxes = document.getElementById('summary-taxes');
  const summaryResortFee = document.getElementById('summary-resort-fee');
  const summaryDiscountRow = document.getElementById('summary-discount-row');
  const summaryDiscountVal = document.getElementById('summary-discount-val');
  const summaryGrandTotal = document.getElementById('summary-grand-total');

  // Step Containers
  const step1 = document.getElementById('booking-step-1');
  const step2 = document.getElementById('booking-step-2');
  const step3 = document.getElementById('booking-step-3');
  const stepIndicators = document.querySelectorAll('.booking-step-badge');

  const goToStep2Btn = document.getElementById('go-to-step-2');
  const backToStep1Btn = document.getElementById('back-to-step-1');
  const finalizeBookingForm = document.getElementById('finalize-booking-form');

  // State
  let state = {
    selectedRoomId: 'deluxe-single',
    checkin: '',
    checkout: '',
    nights: 1,
    guests: 2,
    addons: [],
    discountPercent: 0,
    appliedPromo: ''
  };

  // 1. Parse URL Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const paramRoom = urlParams.get('room');
  const paramCheckin = urlParams.get('checkin');
  const paramCheckout = urlParams.get('checkout');
  const paramGuests = urlParams.get('guests');

  const formatDateStr = (d) => {
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  const today = new Date();
  const defCheckin = new Date(today);
  defCheckin.setDate(defCheckin.getDate() + 1);
  const defCheckout = new Date(defCheckin);
  defCheckout.setDate(defCheckout.getDate() + 1); // 1 night min stay

  if (bookingCheckin && bookingCheckout) {
    bookingCheckin.min = formatDateStr(today);
    bookingCheckin.value = paramCheckin || formatDateStr(defCheckin);

    const minCheckout = new Date(bookingCheckin.value);
    minCheckout.setDate(minCheckout.getDate() + 1);
    bookingCheckout.min = formatDateStr(minCheckout);
    bookingCheckout.value = paramCheckout || formatDateStr(defCheckout);

    state.checkin = bookingCheckin.value;
    state.checkout = bookingCheckout.value;

    bookingCheckin.addEventListener('change', () => {
      const newIn = new Date(bookingCheckin.value);
      if (isNaN(newIn.getTime())) return;

      const nextD = new Date(newIn);
      nextD.setDate(nextD.getDate() + 1);
      bookingCheckout.min = formatDateStr(nextD);

      const currentOut = new Date(bookingCheckout.value);
      if (isNaN(currentOut.getTime()) || currentOut <= newIn) {
        bookingCheckout.value = formatDateStr(nextD);
      }
      state.checkin = bookingCheckin.value;
      state.checkout = bookingCheckout.value;
      calculateNights();
      updatePriceSummary();
    });

    bookingCheckout.addEventListener('change', () => {
      state.checkout = bookingCheckout.value;
      calculateNights();
      updatePriceSummary();
    });
  }

  if (bookingGuests) {
    if (paramGuests) bookingGuests.value = paramGuests;
    state.guests = parseInt(bookingGuests.value, 10) || 2;
    bookingGuests.addEventListener('change', () => {
      state.guests = parseInt(bookingGuests.value, 10) || 2;
      updatePriceSummary();
    });
  }

  if (paramRoom && ROOMS_DATA[paramRoom]) {
    state.selectedRoomId = paramRoom;
  }

  function calculateNights() {
    const d1 = new Date(state.checkin);
    const d2 = new Date(state.checkout);
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime()) && d2 > d1) {
      const diffTime = Math.abs(d2 - d1);
      state.nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else {
      state.nights = 1;
    }
  }

  calculateNights();

  roomSelectCards.forEach(card => {
    const roomId = card.getAttribute('data-room-id');
    if (roomId === state.selectedRoomId) {
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }

    card.addEventListener('click', () => {
      roomSelectCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      state.selectedRoomId = roomId;
      updatePriceSummary();
    });
  });

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updatePriceSummary();
    });
  });

  if (applyPromoBtn && promoCodeInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoCodeInput.value.trim().toUpperCase();
      if (code === 'SERAVELLE10' || code === 'KITULGALA' || code === 'SRILANKA') {
        state.discountPercent = 0.10;
        state.appliedPromo = code;
        if (promoMessage) {
          promoMessage.className = 'text-success small mt-1';
          promoMessage.textContent = '10% Welcome Discount applied!';
        }
        if (window.showToast) window.showToast('Promo Code Applied', '10% discount has been applied to your stay!', 'success');
      } else if (code === '') {
        state.discountPercent = 0;
        if (promoMessage) promoMessage.textContent = '';
      } else {
        state.discountPercent = 0;
        if (promoMessage) {
          promoMessage.className = 'text-danger small mt-1';
          promoMessage.textContent = 'Invalid code. Try "SERAVELLE10" for 10% off.';
        }
      }
      updatePriceSummary();
    });
  }

  function updatePriceSummary() {
    const room = ROOMS_DATA[state.selectedRoomId] || ROOMS_DATA['deluxe-single'];
    const roomSubtotal = room.baseRate * state.nights;

    let addonsTotal = 0;
    state.addons = [];
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const cost = parseFloat(cb.getAttribute('data-cost')) || 0;
        const perGuest = cb.getAttribute('data-per-guest') === 'true';
        const finalCost = perGuest ? cost * state.guests : cost;
        addonsTotal += finalCost;
        state.addons.push({
          title: cb.getAttribute('data-name'),
          price: finalCost
        });
      }
    });

    const taxableBase = roomSubtotal + addonsTotal;
    const taxes = taxableBase * TAX_RATE;

    let discountAmount = 0;
    if (state.discountPercent > 0) {
      discountAmount = roomSubtotal * state.discountPercent;
    }

    const grandTotal = taxableBase + taxes - discountAmount;

    if (summaryRoomName) summaryRoomName.textContent = room.name;
    if (summaryNights) summaryNights.textContent = `${state.nights} ${state.nights === 1 ? 'Night (Min 1)' : 'Nights'}`;
    if (summaryDates) {
      const inFormat = new Date(state.checkin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const outFormat = new Date(state.checkout).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      summaryDates.textContent = `${inFormat} (from 2 PM) – ${outFormat} (until 11 AM)`;
    }
    if (summaryGuests) summaryGuests.textContent = `${state.guests} ${state.guests === 1 ? 'Guest' : 'Guests'}`;
    if (summaryRoomTotal) summaryRoomTotal.textContent = `LKR ${roomSubtotal.toLocaleString('en-US')}`;
    if (summaryAddonsTotal) summaryAddonsTotal.textContent = `LKR ${addonsTotal.toLocaleString('en-US')}`;
    if (summaryTaxes) summaryTaxes.textContent = `LKR ${Math.round(taxes).toLocaleString('en-US')}`;

    if (summaryDiscountRow && summaryDiscountVal) {
      if (discountAmount > 0) {
        summaryDiscountRow.style.display = 'flex';
        summaryDiscountVal.textContent = `-LKR ${Math.round(discountAmount).toLocaleString('en-US')}`;
      } else {
        summaryDiscountRow.style.display = 'none';
      }
    }

    if (summaryGrandTotal) summaryGrandTotal.textContent = `LKR ${Math.round(grandTotal).toLocaleString('en-US')}`;
  }

  updatePriceSummary();

  if (goToStep2Btn) {
    goToStep2Btn.addEventListener('click', () => {
      if (!state.checkin || !state.checkout) {
        if (window.showToast) window.showToast('Select Dates', 'Please select check-in (from 1 PM) and check-out (by 12 PM) dates.', 'error');
        return;
      }
      step1.style.display = 'none';
      step2.style.display = 'block';
      window.scrollTo({ top: 180, behavior: 'smooth' });

      stepIndicators.forEach((badge, idx) => {
        badge.classList.toggle('active', idx === 1);
      });
    });
  }

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      step2.style.display = 'none';
      step1.style.display = 'block';
      window.scrollTo({ top: 180, behavior: 'smooth' });

      stepIndicators.forEach((badge, idx) => {
        badge.classList.toggle('active', idx === 0);
      });
    });
  }

  if (finalizeBookingForm) {
    finalizeBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestName = document.getElementById('guest-name').value.trim();
      const guestEmail = document.getElementById('guest-email').value.trim();
      const guestPhone = document.getElementById('guest-phone').value.trim();
      const submitBtn = finalizeBookingForm.querySelector('button[type="submit"]');

      if (!guestName || !guestEmail || !guestPhone) {
        if (window.showToast) window.showToast('Missing Details', 'Please complete your contact details.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Confirming Free Cancellation Booking...';
      }

      setTimeout(() => {
        const bookingRef = 'SERAVELLE-LK-' + Math.floor(100000 + Math.random() * 900000);
        const room = ROOMS_DATA[state.selectedRoomId];

        document.getElementById('confirmed-ref-number').textContent = bookingRef;
        document.getElementById('confirmed-guest-name').textContent = guestName;
        document.getElementById('confirmed-guest-email').textContent = guestEmail;
        document.getElementById('confirmed-room-name').textContent = room.name;
        document.getElementById('confirmed-dates').textContent = `${state.checkin} (Check-in 2:00 PM) to ${state.checkout} (Check-out 11:00 AM) – ${state.nights} night(s)`;
        document.getElementById('confirmed-grand-total').textContent = summaryGrandTotal ? summaryGrandTotal.textContent : '$0.00';

        step2.style.display = 'none';
        step3.style.display = 'block';
        window.scrollTo({ top: 150, behavior: 'smooth' });

        stepIndicators.forEach((badge, idx) => {
          badge.classList.toggle('active', idx === 2);
        });

        if (window.showToast) {
          window.showToast('Reservation Confirmed!', `Booking ${bookingRef} confirmed. Free cancellation policy applies.`, 'success');
        }
      }, 1000);
    });
  }
});
