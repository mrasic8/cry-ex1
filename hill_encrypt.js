// js/hill_encrypt.js
(function (global) {
  const { parseSquareMatrix } = global.HillMath;
  const { encryptHill } = global.HillCipher;

  const form = document.getElementById('hill-encrypt-form');
  const sizeField = document.getElementById('hill-encrypt-size');
  const matrixField = document.getElementById('hill-encrypt-matrix');
  const plaintextField = document.getElementById('hill-plaintext');

  const errorBox = document.getElementById('hill-encrypt-error');
  const outputBox = document.getElementById('hill-cipher-output');

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
    const plaintext = plaintextField.value;

    let matrix;
    try {
      matrix = parseSquareMatrix(matrixText, size);
    } catch (e) {
      errorBox.textContent = e.message || 'Error parsing key matrix.';
      return;
    }

    try {
      const ciphertext = encryptHill(plaintext, matrix);
      outputBox.textContent = ciphertext;
    } catch (e) {
      errorBox.textContent = e.message || 'Error during Hill encryption.';
    }
  });
})(window);