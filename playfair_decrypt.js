// js/playfair_decrypt.js
(function (global) {
  const { decryptPlayfair } = global.PlayfairCipher;

  const form = document.getElementById('playfair-decrypt-form');
  const keyField = document.getElementById('playfair-decrypt-key');
  const ciphertextField = document.getElementById('playfair-ciphertext');
  const errorBox = document.getElementById('playfair-decrypt-error');
  const outputBox = document.getElementById('playfair-plain-output');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    outputBox.textContent = '';

    const key = keyField.value;
    const ciphertext = ciphertextField.value;

    try {
      const plaintext = decryptPlayfair(ciphertext, key);
      outputBox.textContent = plaintext;
    } catch (e) {
      errorBox.textContent = e.message || 'An error occurred during Playfair decryption.';
    }
  });
})(window);