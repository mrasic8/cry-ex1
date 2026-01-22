// js/hill_decrypt.js
(function (global) {
  const { parseSquareMatrix } = global.HillMath;
  const { decryptHill } = global.HillCipher;

  const form = document.getElementById('hill-decrypt-form');
  const sizeField = document.getElementById('hill-decrypt-size');
  const matrixField = document.getElementById('hill-decrypt-matrix');
  const ciphertextField = document.getElementById('hill-ciphertext');

  const errorBox = document.getElementById('hill-decrypt-error');
  const outputBox = document.getElementById('hill-plain-output');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    outputBox.textContent = '';

    const size = Number.parseInt(sizeField.value, 10);
    if (Number.isNaN(size) || size <= 0) {
      errorBox.textContent = 'Matrix dimension n must be a positive integer.';
      return;
    }

    const matrixText = matrixField.value;
    const ciphertext = ciphertextField.value;

    let matrix;
    try {
      matrix = parseSquareMatrix(matrixText, size);
    } catch (e) {
      errorBox.textContent = e.message || 'Error parsing key matrix.';
      return;
    }

    try {
      const plaintext = decryptHill(ciphertext, matrix);
      outputBox.textContent = plaintext;
    } catch (e) {
      errorBox.textContent = e.message || 'Error during Hill decryption.';
    }
  });
})(window);