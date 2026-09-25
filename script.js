// Frank & Hongchen Wedding Website v3 — conditional RSVP validation + Google Forms submission
const weddingDate = new Date('2027-02-21T12:00:00+08:00');
const countdownEls = {
  days: document.querySelector('#days'),
  hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'),
  seconds: document.querySelector('#seconds'),
};

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate - now;
  if (diff < 0) diff = 0;

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  const days = Math.floor(diff / day);
  diff -= days * day;
  const hours = Math.floor(diff / hour);
  diff -= hours * hour;
  const minutes = Math.floor(diff / minute);
  diff -= minutes * minute;
  const seconds = Math.floor(diff / 1000);

  countdownEls.days.textContent = String(days).padStart(3, '0');
  countdownEls.hours.textContent = String(hours).padStart(2, '0');
  countdownEls.minutes.textContent = String(minutes).padStart(2, '0');
  countdownEls.seconds.textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

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
}

form.querySelectorAll('input[name="entry.579093535"]').forEach((radio) => {
  radio.addEventListener('change', () => setAttendanceState(radio.dataset.attendance === 'yes'));
});

document.querySelectorAll('[data-clear]').forEach((button) => {
  button.addEventListener('click', () => {
    form.querySelectorAll(`input[name="${button.dataset.clear}"]`).forEach((el) => { el.checked = false; });
  });
});

function firstInvalidMessage() {
  const name = form.querySelector('input[name="entry.927453179"]');
  const relation = form.querySelector('input[name="entry.1106889850"]:checked');
  const attendance = form.querySelector('input[name="entry.579093535"]:checked');

  if (!name.value.trim()) return '請填寫您的大名。';
  if (!relation) return '請選擇您與新人的關係。';
  if (!attendance) return '請選擇是否出席婚宴。';

  if (attendance.value === '會出席') {
    const guests = form.querySelector('input[name="entry.728428873"]:checked');
    const meal = form.querySelector('input[name="entry.607079424"]:checked');
    const email = form.querySelector('input[name="entry.660573787"]');
    if (!guests) return '請選擇出席人數。';
    if (!meal) return '請選擇飲食需求。';
    if (!email.value.trim()) return '請填寫電子喜帖 Email。';
    if (!email.checkValidity()) return '請確認 Email 格式是否正確。';
  }

  return '';
}

form.addEventListener('submit', (event) => {
  const message = firstInvalidMessage();
  if (message) {
    event.preventDefault();
    formError.textContent = message;
    formError.hidden = false;
    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  formError.hidden = true;
  submitted = true;
  submitButton.disabled = true;
  submitButton.textContent = '送出中…';
});

iframe.addEventListener('load', () => {
  if (!submitted) return;
  form.hidden = true;
  successCard.hidden = false;
  successCard.focus();
  successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
