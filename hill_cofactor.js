// js/hill_cofactor.js
(function (global) {
  const { parseSquareMatrix, cofactorMatrix, formatMatrix } = global.HillMath;

  const form = document.getElementById('hill-cofactor-form');
  const sizeField = document.getElementById('hill-cofactor-size');
  const matrixField = document.getElementById('hill-cofactor-matrix');

  const errorBox = document.getElementById('hill-cofactor-error');
  const outputBox = document.getElementById('hill-cofactor-only-output');

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
      const cof = cofactorMatrix(matrix);
      outputBox.textContent = formatMatrix(cof);
    } catch (e) {
      errorBox.textContent = e.message || 'Error computing cofactor matrix.';
    }
  });
})(window);