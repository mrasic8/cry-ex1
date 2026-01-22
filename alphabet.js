// js/alphabet.js
(function (global) {
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

  // Convert a single character (any case) to an index 0–25.
  // Returns -1 if the character is not a letter A–Z.
  function charToIndex(ch) {
    if (!ch || typeof ch !== 'string') {
      return -1;
    }
    const lower = ch.toLowerCase();
    const code = lower.charCodeAt(0); // 'a' = 97, 'z' = 122

    if (code < 97 || code > 122) {
      return -1; // not a–z
    }

    return code - 97; // 'a' -> 0, ..., 'z' -> 25
  }

  // Convert an index 0–25 to a lowercase letter.
  function indexToLowerChar(index) {
    const normalized = ((index % 26) + 26) % 26;
    return String.fromCharCode(97 + normalized); // 97 = 'a'
  }

  // Convert an index 0–25 to an uppercase letter.
  function indexToUpperChar(index) {
    const normalized = ((index % 26) + 26) % 26;
    return String.fromCharCode(65 + normalized); // 65 = 'A'
  }

  // Expose as a library object
  global.Alphabet = {
    ALPHABET,
    charToIndex,
    indexToLowerChar,
    indexToUpperChar
  };
})(window);