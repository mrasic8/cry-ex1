// js/hillCipher.js
(function (global) {
  const { charToIndex, indexToLowerChar, indexToUpperChar } = global.Alphabet;
  const {
    MOD,
    mod,
    gcd,
    modMatrix,
    multiplyRowVectorMatrixMod,  // use row-vector * matrix
    inverseMatrixMod26,
    determinant
  } = global.HillMath;

  function ensureInvertibleKey(matrix) {
    const det = determinant(matrix);
    const detMod = mod(det, MOD);
    if (gcd(detMod, MOD) !== 1) {
      throw new Error(
        `Key matrix is not invertible modulo 26 (determinant mod 26 = ${detMod}, gcd != 1).`
      );
    }
  }

  function normalizePlaintext(plaintext, blockSize) {
    const indices = [];
    for (const ch of plaintext) {
      const idx = charToIndex(ch);
      if (idx !== -1) {
        indices.push(idx);
      }
    }
    if (indices.length === 0) {
      throw new Error('Plaintext must contain at least one letter A–Z.');
    }
    // pad with 'x' until multiple of blockSize
    const xIndex = charToIndex('x');
    while (indices.length % blockSize !== 0) {
      indices.push(xIndex);
    }
    return indices;
  }

  function normalizeCiphertext(ciphertext, blockSize) {
    const indices = [];
    for (const ch of ciphertext) {
      const idx = charToIndex(ch);
      if (idx !== -1) {
        indices.push(idx);
      }
    }
    if (indices.length === 0) {
      throw new Error('Ciphertext must contain at least one letter A–Z.');
    }
    if (indices.length % blockSize !== 0) {
      throw new Error(
        'Ciphertext length (letters only) must be a multiple of the matrix dimension.'
      );
    }
    return indices;
  }

  // Encrypt plaintext using Hill cipher and an n×n key matrix.
  // Uses 1×n row vectors: C = P * K (mod 26), result is 1×n.
  // Returns UPPERCASE ciphertext.
  function encryptHill(plaintext, keyMatrix) {
    const n = keyMatrix.length;
    ensureInvertibleKey(keyMatrix);

    const keyMod = modMatrix(keyMatrix, MOD);
    const ptIndices = normalizePlaintext(plaintext, n);
    let result = '';

    for (let i = 0; i < ptIndices.length; i += n) {
      const block = ptIndices.slice(i, i + n); // 1×n row vector
      const ctBlock = multiplyRowVectorMatrixMod(block, keyMod, MOD);
      for (const v of ctBlock) {
        result += indexToUpperChar(v);
      }
    }
    return result;
  }

  // Decrypt ciphertext using Hill cipher and an n×n key matrix.
  // Uses 1×n row vectors: P = C * K^{-1} (mod 26).
  // Returns lowercase plaintext.
  function decryptHill(ciphertext, keyMatrix) {
    const n = keyMatrix.length;
    ensureInvertibleKey(keyMatrix);

    const invKey = inverseMatrixMod26(keyMatrix);
    const ctIndices = normalizeCiphertext(ciphertext, n);
    let result = '';

    for (let i = 0; i < ctIndices.length; i += n) {
      const block = ctIndices.slice(i, i + n); // 1×n row vector
      const ptBlock = multiplyRowVectorMatrixMod(block, invKey, MOD);
      for (const v of ptBlock) {
        result += indexToLowerChar(v);
      }
    }
    return result;
  }

  global.HillCipher = {
    encryptHill,
    decryptHill
  };
})(window);