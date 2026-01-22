// js/shift_decrypt.js
(function (global) {
  const { decryptShift } = global.ShiftCipher;

  const form = document.getElementById('shift-decrypt-form');
  const ciphertextField = document.getElementById('shift-ciphertext');
  const keyField = document.getElementById('shift-decrypt-key');
  const outputBox = document.getElementById('shift-plain-output');
  const errorBox = document.getElementById('shift-decrypt-error');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    outputBox.textContent = '';

    const ciphertext = ciphertextField.value;
    const keyValue = keyField.value.trim();
    const key = Number.parseInt(keyValue, 10);

    if (Number.isNaN(key)) {
      errorBox.textContent = 'Key must be an integer.';
      return;
    }

    try {
      const plaintext = decryptShift(ciphertext, key);
      outputBox.textContent = plaintext;
    } catch (e) {
      errorBox.textContent = e.message || 'An error occurred during decryption.';
    }
  });
})(window);