// js/playfair_encrypt.js
(function (global) {
  const { encryptPlayfair } = global.PlayfairCipher;

  const form = document.getElementById('playfair-encrypt-form');
  const keyField = document.getElementById('playfair-key');
  const plaintextField = document.getElementById('playfair-plaintext');
  const errorBox = document.getElementById('playfair-encrypt-error');
  const outputBox = document.getElementById('playfair-cipher-output');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    outputBox.textContent = '';

    const key = keyField.value;
    const plaintext = plaintextField.value;

    try {
      const ciphertext = encryptPlayfair(plaintext, key);
      outputBox.textContent = ciphertext;
    } catch (e) {
      errorBox.textContent = e.message || 'An error occurred during Playfair encryption.';
    }
  });
})(window);