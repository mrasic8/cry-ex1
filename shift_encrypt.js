// js/shift_encrypt.js
(function (global) {
  const { encryptShift } = global.ShiftCipher;

  const form = document.getElementById('shift-encrypt-form');
  const plaintextField = document.getElementById('shift-plaintext');
  const keyField = document.getElementById('shift-key');
  const outputBox = document.getElementById('shift-cipher-output');
  const errorBox = document.getElementById('shift-encrypt-error');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    outputBox.textContent = '';

    const plaintext = plaintextField.value;
    const keyValue = keyField.value.trim();
    const key = Number.parseInt(keyValue, 10);

    if (Number.isNaN(key)) {
      errorBox.textContent = 'Key must be an integer.';
      return;
    }

    try {
      const ciphertext = encryptShift(plaintext, key);
      outputBox.textContent = ciphertext;
    } catch (e) {
      errorBox.textContent = e.message || 'An error occurred during encryption.';
    }
  });
})(window);