const form = document.querySelector('.card-form');
const inputs = form.querySelectorAll('input');

const expiryGroup = document.querySelector('.expiry-group');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');

// helpers
function showError(field, message) {
  field.classList.add('has-error');
  field.querySelector('.error-msg').textContent = message;
}

function clearError(field) {
  field.classList.remove('has-error');
  field.querySelector('.error-msg').textContent = '';
}

// single input validation
function validateField(input) {
  const field = input.closest('.form-field');
  if (input.value.trim() === '') {
    showError(field, "Can't be blank");
    return false;
  }
  clearError(field);
  return true;
}

// expiry validation (shared error)
function validateExpiry() {
  const m = monthInput.value.trim();
  const y = yearInput.value.trim();

  if (!m || !y) {
    showError(expiryGroup, "Can't be blank");
    return false;
  }

  const monthNum = Number(m);
  if (monthNum < 1 || monthNum > 12) {
    showError(expiryGroup, "Invalid month");
    return false;
  }

  clearError(expiryGroup);
  return true;
}

// events
inputs.forEach(input => {
  input.addEventListener('focusin', () => {
    const field = input.closest('.form-field');
    clearError(field);
  });

  if (!input.closest('.expiry-group')) {
    input.addEventListener('focusout', () => validateField(input));
  }
});

monthInput.addEventListener('focusout', validateExpiry);
yearInput.addEventListener('focusout', validateExpiry);

// submit
form.addEventListener('submit', e => {
  e.preventDefault();

  let valid = true;

  inputs.forEach(input => {
    if (!input.closest('.expiry-group')) {
      valid = validateField(input) && valid;
    }
  });

  valid = validateExpiry() && valid;

  if (valid) {
    alert('Form submitted 🎉');
  }
});
