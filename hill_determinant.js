// js/hill_determinant.js
(function (global) {
  const { parseSquareMatrix, determinant, mod } = global.HillMath;

  const form = document.getElementById('hill-det-form');
  const sizeField = document.getElementById('hill-det-size');
  const matrixField = document.getElementById('hill-det-matrix');

  const errorBox = document.getElementById('hill-det-error');
  const detBox = document.getElementById('hill-det-only-output');
  const detModBox = document.getElementById('hill-det-only-mod-output');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    detBox.textContent = '';
    detModBox.textContent = '';

    const size = Number.parseInt(sizeField.value, 10);
    const text = matrixField.value;

    if (Number.isNaN(size) || size <= 0) {
      errorBox.textContent = 'Dimension n must be a positive integer.';
      return;
    }

    try {
      const matrix = parseSquareMatrix(text, size);
      const det = determinant(matrix);
      const detMod = mod(det);

      detBox.textContent = String(det);
      detModBox.textContent = String(detMod);
    } catch (e) {
      errorBox.textContent = e.message || 'Error computing determinant.';
    }
  });
})(window);