// Frank & Hongchen Wedding Website v4 — visual/UX refinements + conditional RSVP
const weddingDate = new Date('2027-02-21T12:00:00+08:00');
const countdownEls = {
  days: document.querySelector('#days'),
  hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'),
  seconds: document.querySelector('#seconds'),
};

function updateCountdown() {
  const now = new Date();
  let diff = Math.max(0, weddingDate - now);
  const day = 86400000;
  const hour = 3600000;
  const minute = 60000;

  const days = Math.floor(diff / day); diff -= days * day;
  const hours = Math.floor(diff / hour); diff -= hours * hour;
  const minutes = Math.floor(diff / minute); diff -= minutes * minute;
  const seconds = Math.floor(diff / 1000);

  countdownEls.days.textContent = String(days).padStart(3, '0');
  countdownEls.hours.textContent = String(hours).padStart(2, '0');
  countdownEls.minutes.textContent = String(minutes).padStart(2, '0');
  countdownEls.seconds.textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal animation
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}

// Glass navigation + mobile RSVP shortcut
const nav = document.querySelector('#site-nav');
const mobileBar = document.querySelector('#mobile-rsvp-bar');
const rsvpSection = document.querySelector('#rsvp');

function updateFloatingUI() {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 80);

  if (!mobileBar || window.innerWidth > 760) return;
  const rsvpRect = rsvpSection.getBoundingClientRect();
  const nearRsvp = rsvpRect.top < window.innerHeight * 0.70 && rsvpRect.bottom > 0;
  const show = y > window.innerHeight * 0.65 && !nearRsvp;
  mobileBar.classList.toggle('is-visible', show);
  mobileBar.setAttribute('aria-hidden', String(!show));
}
updateFloatingUI();
window.addEventListener('scroll', updateFloatingUI, { passive: true });
window.addEventListener('resize', updateFloatingUI);

// Venue address copy helper
const copyButton = document.querySelector('#copy-address');
const copyFeedback = document.querySelector('#copy-feedback');
const addressText = document.querySelector('#venue-address')?.textContent.trim();
copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(addressText);
    copyFeedback.textContent = '地址已複製';
  } catch (_) {
    copyFeedback.textContent = addressText;
  }
  window.setTimeout(() => { copyFeedback.textContent = ''; }, 2200);
});

// RSVP form
const form = document.querySelector('#rsvp-form');
const attendingFields = document.querySelector('#attending-fields');
const submitButton = document.querySelector('#submit-button');
const formError = document.querySelector('#form-error');
const successCard = document.querySelector('#success-card');
const iframe = document.querySelector('#hidden_iframe');
let submitted = false;

function setAttendanceState(isAttending) {
  attendingFields.hidden = !isAttending;

  const guestCount = form.querySelectorAll('input[name="entry.728428873"]');
  const mealType = form.querySelectorAll('input[name="entry.607079424"]');
  const highChair = form.querySelectorAll('input[name="entry.690583584"]');
  const invitationEmail = form.querySelector('input[name="entry.660573787"]');
  const paperAddress = form.querySelector('input[name="entry.538163172"]');

  guestCount.forEach((el, index) => {
    el.required = isAttending && index === 0;
    el.disabled = !isAttending;
    if (!isAttending) el.checked = false;
  });
  mealType.forEach((el, index) => {
    el.required = isAttending && index === 0;
    el.disabled = !isAttending;
    if (!isAttending) el.checked = false;
  });
  highChair.forEach((el) => {
    el.disabled = !isAttending;
    if (!isAttending) el.checked = false;
  });

  invitationEmail.required = isAttending;
  invitationEmail.disabled = !isAttending;
  paperAddress.disabled = !isAttending;

  if (!isAttending) {
    invitationEmail.value = '';
    paperAddress.value = '';
  }

  if (isAttending) {
    window.setTimeout(() => attendingFields.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }
}

form.querySelectorAll('input[name="entry.579093535"]').forEach((radio) => {
  radio.addEventListener('change', () => setAttendanceState(radio.dataset.attendance === 'yes'));
});

// Restore conditional state when browser restores form values.
const preselectedAttendance = form.querySelector('input[name="entry.579093535"]:checked');
if (preselectedAttendance) setAttendanceState(preselectedAttendance.dataset.attendance === 'yes');

document.querySelectorAll('[data-clear]').forEach((button) => {
  button.addEventListener('click', () => {
    form.querySelectorAll(`input[name="${button.dataset.clear}"]`).forEach((el) => { el.checked = false; });
  });
});

function firstInvalidMessage() {
  const name = form.querySelector('input[name="entry.927453179"]');
  const relation = form.querySelector('input[name="entry.1106889850"]:checked');
  const attendance = form.querySelector('input[name="entry.579093535"]:checked');

  if (!name.value.trim()) return { text: '請填寫您的大名。', target: name };
  if (!relation) return { text: '請選擇您與新人的關係。', target: form.querySelector('input[name="entry.1106889850"]') };
  if (!attendance) return { text: '請選擇是否出席婚宴。', target: form.querySelector('input[name="entry.579093535"]') };

  if (attendance.value === '會出席') {
    const guests = form.querySelector('input[name="entry.728428873"]:checked');
    const meal = form.querySelector('input[name="entry.607079424"]:checked');
    const email = form.querySelector('input[name="entry.660573787"]');
    if (!guests) return { text: '請選擇出席人數。', target: form.querySelector('input[name="entry.728428873"]') };
    if (!meal) return { text: '請選擇飲食需求。', target: form.querySelector('input[name="entry.607079424"]') };
    if (!email.value.trim()) return { text: '請填寫電子喜帖 Email。', target: email };
    if (!email.checkValidity()) return { text: '請確認 Email 格式是否正確。', target: email };
  }

  return null;
}

form.addEventListener('submit', (event) => {
  const error = firstInvalidMessage();
  if (error) {
    event.preventDefault();
    formError.textContent = error.text;
    formError.hidden = false;
    error.target?.focus({ preventScroll: true });
    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  formError.hidden = true;
  submitted = true;
  submitButton.disabled = true;
  submitButton.innerHTML = '<span>送出中…</span><span aria-hidden="true">···</span>';
});

iframe.addEventListener('load', () => {
  if (!submitted) return;
  form.hidden = true;
  successCard.hidden = false;
  successCard.focus();
  successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
