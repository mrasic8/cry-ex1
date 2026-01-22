// js/hill_matrix_inverse.js
(function (global) {
  const {
    parseSquareMatrix,
    formatMatrix,
    determinant,
    cofactorMatrix,
    inverseMatrixMod26,
    mod,
    multiplicativeInverseMod
  } = global.HillMath;

  const form = document.getElementById('hill-matrix-inverse-form');
  const sizeField = document.getElementById('hill-size');
  const matrixField = document.getElementById('hill-matrix');

  const errorBox = document.getElementById('hill-matrix-inverse-error');
  const detBox = document.getElementById('hill-det-output');
  const detModBox = document.getElementById('hill-det-mod-output');
  const detInvBox = document.getElementById('hill-det-inv-output');
  const cofactorBox = document.getElementById('hill-cofactor-output');
  const inverseBox = document.getElementById('hill-inverse-output');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    detBox.textContent = '';
    detModBox.textContent = '';
    detInvBox.textContent = '';
    cofactorBox.textContent = '';
    inverseBox.textContent = '';

    const size = Number.parseInt(sizeField.value, 10);
    const text = matrixField.value;

    if (Number.isNaN(size) || size <= 0) {
      errorBox.textContent = 'Dimension n must be a positive integer.';
      return;
    }

    let matrix;
    try {
      matrix = parseSquareMatrix(text, size);
    } catch (e) {
      errorBox.textContent = e.message || 'Error parsing matrix.';
      return;
    }

    try {
      const det = determinant(matrix);
      const detMod = mod(det);
      detBox.textContent = String(det);
      detModBox.textContent = String(detMod);

      // Cofactor matrix
      const cof = cofactorMatrix(matrix);
      cofactorBox.textContent = formatMatrix(cof);

      // Inverse of determinant mod 26
      try {
        const detInv = multiplicativeInverseMod(detMod);
        detInvBox.textContent = String(detInv);
      } catch (e2) {
        detInvBox.textContent = e2.message;
      }

      // Inverse matrix mod 26
      try {
        const inv = inverseMatrixMod26(matrix);
        inverseBox.textContent = formatMatrix(inv);
      } catch (e3) {
        inverseBox.textContent = e3.message;
      }
    } catch (e) {
      errorBox.textContent = e.message || 'Error computing matrix properties.';
    }
  });
})(window);