// js/hillMath.js
(function (global) {
  const MOD = 26;

  function mod(n, m = MOD) {
    return ((n % m) + m) % m;
  }

  // Parse a square matrix of given size from text.
  // Elements are integers; tokens separated by spaces/commas/newlines.
  function parseSquareMatrix(text, size) {
    if (!Number.isInteger(size) || size <= 0) {
      throw new Error('Matrix dimension n must be a positive integer.');
    }

    const tokens = text
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean);

    const expected = size * size;
    if (tokens.length !== expected) {
      throw new Error(
        `Expected ${expected} values for a ${size}×${size} matrix, but got ${tokens.length}.`
      );
    }

    const matrix = [];
    let index = 0;

    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const value = Number.parseInt(tokens[index], 10);
        if (Number.isNaN(value)) {
          throw new Error('All matrix entries must be integers.');
        }
        row.push(value);
        index++;
      }
      matrix.push(row);
    }

    return matrix;
  }

  function formatMatrix(matrix) {
    return matrix.map((row) => row.join(' ')).join('\n');
  }

  function minorMatrix(matrix, rowToRemove, colToRemove) {
    const n = matrix.length;
    const result = [];
    for (let i = 0; i < n; i++) {
      if (i === rowToRemove) continue;
      const row = [];
      for (let j = 0; j < n; j++) {
        if (j === colToRemove) continue;
        row.push(matrix[i][j]);
      }
      result.push(row);
    }
    return result;
  }

  function determinant(matrix) {
    const n = matrix.length;
    if (!Array.isArray(matrix) || n === 0 || !Array.isArray(matrix[0]) || matrix[0].length !== n) {
      throw new Error('Matrix must be square for determinant.');
    }

    if (n === 1) {
      return matrix[0][0];
    }
    if (n === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;
    for (let j = 0; j < n; j++) {
      const sign = (j % 2 === 0) ? 1 : -1;
      const sub = minorMatrix(matrix, 0, j);
      det += sign * matrix[0][j] * determinant(sub);
    }
    return det;
  }

  function cofactorMatrix(matrix) {
    const n = matrix.length;
    if (n === 0 || matrix[0].length !== n) {
      throw new Error('Matrix must be square for cofactor.');
    }
    const cof = new Array(n);
    for (let i = 0; i < n; i++) {
      cof[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        const sub = minorMatrix(matrix, i, j);
        const sign = ((i + j) % 2 === 0) ? 1 : -1;
        cof[i][j] = sign * determinant(sub);
      }
    }
    return cof;
  }

  function transpose(matrix) {
    const n = matrix.length;
    const m = matrix[0].length;
    const result = new Array(m);
    for (let i = 0; i < m; i++) {
      result[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        result[i][j] = matrix[j][i];
      }
    }
    return result;
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  // Extended Euclidean algorithm:
  // returns { gcd, x, y } such that a*x + b*y = gcd
  function extendedEuclid(a, b) {
    let old_r = a;
    let r = b;
    let old_s = 1;
    let s = 0;
    let old_t = 0;
    let t = 1;

    while (r !== 0) {
      const q = Math.trunc(old_r / r);
      const temp_r = old_r - q * r;
      old_r = r;
      r = temp_r;

      const temp_s = old_s - q * s;
      old_s = s;
      s = temp_s;

      const temp_t = old_t - q * t;
      old_t = t;
      t = temp_t;
    }

    // Ensure gcd is positive
    if (old_r < 0) {
      old_r = -old_r;
      old_s = -old_s;
      old_t = -old_t;
    }

    return { gcd: old_r, x: old_s, y: old_t };
  }

  // Multiplicative inverse of a modulo m using extended Euclid.
  function multiplicativeInverseMod(a, m = MOD) {
    a = mod(a, m);
    const { gcd: g, x } = extendedEuclid(a, m);
    if (g !== 1) {
      throw new Error(`No multiplicative inverse for ${a} modulo ${m} (gcd = ${g}).`);
    }
    return mod(x, m);
  }

  function modMatrix(matrix, m = MOD) {
    return matrix.map((row) => row.map((val) => mod(val, m)));
  }

  // Matrix * column vector (n×n times n×1) – kept for completeness.
  function multiplyMatrixVectorMod(matrix, vector, m = MOD) {
    const n = matrix.length;
    if (matrix[0].length !== n || vector.length !== n) {
      throw new Error('Matrix must be n×n and vector must have length n.');
    }
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += matrix[i][j] * vector[j];  // normal multiplication
      }
      result[i] = mod(sum, m);            // then mod m
    }
    return result;
  }

  // Row vector * matrix (1×n times n×n → 1×n) – this is what you want for Hill.
  function multiplyRowVectorMatrixMod(vector, matrix, m = MOD) {
    const n = matrix.length;
    if (matrix[0].length !== n || vector.length !== n) {
      throw new Error('Matrix must be n×n and row vector must have length n.');
    }
    const result = new Array(n);
    // result[j] = sum_i vector[i] * matrix[i][j]
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += vector[i] * matrix[i][j];
      }
      result[j] = mod(sum, m);
    }
    return result;
  }

  // Inverse of an n×n matrix modulo 26 using adjugate and multiplicative inverse of det.
  function inverseMatrixMod26(matrix) {
    const n = matrix.length;
    if (n === 0 || matrix[0].length !== n) {
      throw new Error('Matrix must be square for inversion.');
    }

    const det = determinant(matrix);
    const detMod = mod(det, MOD);
    const detInv = multiplicativeInverseMod(detMod, MOD); // may throw

    const cof = cofactorMatrix(matrix);
    const adj = transpose(cof);

    const inv = new Array(n);
    for (let i = 0; i < n; i++) {
      inv[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        inv[i][j] = mod(adj[i][j] * detInv, MOD);
      }
    }
    return inv;
  }

  global.HillMath = {
    MOD,
    mod,
    parseSquareMatrix,
    formatMatrix,
    determinant,
    cofactorMatrix,
    transpose,
    gcd,
    extendedEuclid,
    multiplicativeInverseMod,
    modMatrix,
    multiplyMatrixVectorMod,     // still available
    multiplyRowVectorMatrixMod,  // NEW – used for Hill cipher text blocks
    inverseMatrixMod26
  };
})(window);