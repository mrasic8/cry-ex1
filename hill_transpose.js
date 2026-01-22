// js/hill_transpose.js
(function (global) {
  const { parseSquareMatrix, transpose, formatMatrix } = global.HillMath;

  const form = document.getElementById('hill-transpose-form');
  const sizeField = document.getElementById('hill-transpose-size');
  const matrixField = document.getElementById('hill-transpose-matrix');

  const errorBox = document.getElementById('hill-transpose-error');
  const outputBox = document.getElementById('hill-transpose-output');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    outputBox.textContent = '';

    const size = Number.parseInt(sizeField.value, 10);
    if (Number.isNaN(size) || size <= 0) {
      errorBox.textContent = 'Matrix dimension n must be a positive integer.';
      return;
    }

    const text = matrixField.value;

    try {
      const matrix = parseSquareMatrix(text, size);
      const trans = transpose(matrix);
      outputBox.textContent = formatMatrix(trans);
    } catch (e) {
      errorBox.textContent = e.message || 'Error computing transpose.';
    }
  });
})(window);