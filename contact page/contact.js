

// Client-side validation and success message:

const form = document.getElementById('contact-form');
const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const msgEl = document.getElementById('message');

const nameErr = document.getElementById('name-error');
const emailErr = document.getElementById('email-error');
const msgErr = document.getElementById('message-error');
const successEl = document.getElementById('form-success');

//  mail pattern validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // reset messages
  nameErr.textContent = '';
  emailErr.textContent = '';
  msgErr.textContent = '';
  successEl.textContent = '';

  let ok = true;

  // name
  if (!nameEl.value.trim()) {
    nameErr.textContent = 'Please enter your name.';
    ok = false;
  }

  // email
  if (!emailEl.value.trim()) {
    emailErr.textContent = 'Please enter your email.';
    ok = false;
  } else if (!emailPattern.test(emailEl.value.trim())) {
    emailErr.textContent = 'Please enter a valid email address.';
    ok = false;
  }

  // message
  if (!msgEl.value.trim()) {
    msgErr.textContent = 'Please add a comment.';
    ok = false;
  }

  if (!ok) return;

  // show confirmation
  successEl.textContent = 'Thanks! Your message has been sent.';
  form.reset();
});

//clears the error as user types
[nameEl, emailEl, msgEl].forEach((el) => {
  el.addEventListener('input', () => {
    successEl.textContent = '';
    if (el === nameEl) nameErr.textContent = '';
    if (el === emailEl) emailErr.textContent = '';
    if (el === msgEl) msgErr.textContent = '';
  });
});
