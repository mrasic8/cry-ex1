// js/shiftCipher.js
(function (global) {
  const {
    charToIndex,
    indexToUpperChar,
    indexToLowerChar
  } = global.Alphabet;

  function normalizeKey(key) {
    const k = Number(key);
    if (Number.isNaN(k)) {
      throw new Error('Key must be a number.');
    }
    // normalize into 0–25
    return ((k % 26) + 26) % 26;
  }

  // Encrypt using shift cipher (Caesar).
  // - plaintext: any string (case-insensitive)
  // - key: integer shift
  // Returns UPPERCASE ciphertext; non-letters unchanged.
  function encryptShift(plaintext, key) {
    const k = normalizeKey(key);
    let result = '';

    for (const ch of plaintext) {
      const idx = charToIndex(ch);
      if (idx === -1) {
        result += ch; // non-alphabetic character: keep as-is
      } else {
        const shifted = (idx + k) % 26;
        result += indexToUpperChar(shifted);
      }
    }

    return result;
  }

  // Decrypt using shift cipher.
  // - ciphertext: any string (case-insensitive)
  // - key: integer shift
  // Returns lowercase plaintext; non-letters unchanged.
  function decryptShift(ciphertext, key) {
    const k = normalizeKey(key);
    let result = '';

    for (const ch of ciphertext) {
      const idx = charToIndex(ch);
      if (idx === -1) {
        result += ch; // non-alphabetic character: keep as-is
      } else {
        const shifted = (idx - k + 26) % 26;
        result += indexToLowerChar(shifted);
      }
    }

    return result;
  }

  // Expose as a library object
  global.ShiftCipher = {
    encryptShift,
    decryptShift
  };
})(window);