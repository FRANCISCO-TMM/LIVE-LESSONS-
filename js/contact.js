// Contact form validation — empty fields, email format, digits-only phone
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successBox = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('nameField'), err: document.getElementById('nameError') },
    email: { el: document.getElementById('emailField'), err: document.getElementById('emailError') },
    phone: { el: document.getElementById('phoneField'), err: document.getElementById('phoneError') },
    message: { el: document.getElementById('messageField'), err: document.getElementById('messageError') }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d+$/;

  function setError(field, msg) {
    field.el.classList.toggle('invalid', !!msg);
    field.err.textContent = msg || '';
  }

  function validateField(key) {
    const field = fields[key];
    const value = field.el.value.trim();

    if (!value) {
      setError(field, 'This field cannot be empty.');
      return false;
    }
    if (key === 'email' && !emailPattern.test(value)) {
      setError(field, 'Enter a valid email address.');
      return false;
    }
    if (key === 'phone' && !phonePattern.test(value)) {
      setError(field, 'Phone number must contain digits only.');
      return false;
    }
    setError(field, '');
    return true;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    successBox.classList.remove('show');

    let allValid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) allValid = false;
    });

    if (allValid) {
      successBox.classList.add('show');
      form.reset();
      Object.keys(fields).forEach(key => setError(fields[key], ''));
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});
