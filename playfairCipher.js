// js/playfairCipher.js
(function (global) {
  const { ALPHABET } = global.Alphabet;

  // --- Key square construction ---

  // Sanitize key: letters only, lowercase, j -> i, remove duplicates.
  function sanitizeKey(key) {
    const seen = new Set();
    let result = '';

    for (let ch of key.toLowerCase()) {
      const code = ch.charCodeAt(0);
      if (code < 97 || code > 122) {
        continue; // skip non-letters
      }
      if (ch === 'j') {
        ch = 'i'; // merge J into I
      }
      if (!seen.has(ch)) {
        seen.add(ch);
        result += ch;
      }
    }

    if (result.length === 0) {
      throw new Error('Key must contain at least one letter A–Z.');
    }

    return { keyString: result, seen };
  }

  // Build 5×5 key square and positions map.
  function buildKeySquare(key) {
    const { keyString, seen } = sanitizeKey(key);

    let square = keyString;

    // Fill with remaining letters a–z, skipping 'j' and already used
    for (const ch0 of ALPHABET) {
      if (ch0 === 'j') continue; // merge I/J
      if (!seen.has(ch0)) {
        seen.add(ch0);
        square += ch0;
      }
    }

    if (square.length !== 25) {
      throw new Error('Internal error: Playfair key square must have 25 letters.');
    }

    const positions = {};
    for (let i = 0; i < square.length; i++) {
      const ch = square[i];
      const row = Math.floor(i / 5);
      const col = i % 5;
      positions[ch] = { row, col };
    }

    return { square, positions };
  }

  // --- Text preprocessing ---

  // Normalize plaintext:
  // - keep letters only
  // - lowercase
  // - j -> i
  // - form digraphs with filler (x; use z if letter is already x).
  function preparePlaintextForPlayfair(text) {
    let s = '';
    for (let ch of text.toLowerCase()) {
      const code = ch.charCodeAt(0);
      if (code < 97 || code > 122) continue; // skip non-letters
      if (ch === 'j') ch = 'i';
      s += ch;
    }

    if (s.length === 0) {
      throw new Error('Plaintext must contain at least one letter A–Z.');
    }

    const pairs = [];
    let i = 0;

    while (i < s.length) {
      const a = s[i];
      let b;

      if (i + 1 < s.length) {
        b = s[i + 1];
        if (a === b) {
          // repeated letter in pair -> insert filler
          b = (a === 'x') ? 'z' : 'x';
          pairs.push([a, b]);
          i += 1; // reprocess the second occurrence in the next pair
        } else {
          pairs.push([a, b]);
          i += 2;
        }
      } else {
        // single leftover letter -> pad with x
        b = 'x';
        pairs.push([a, b]);
        i += 1;
      }
    }

    return pairs;
  }

  // Normalize ciphertext:
  // - keep letters only
  // - lowercase
  // - j -> i
  // - must be even length
  function prepareCiphertextForPlayfair(text) {
    let s = '';
    for (let ch of text.toLowerCase()) {
      const code = ch.charCodeAt(0);
      if (code < 97 || code > 122) continue;
      if (ch === 'j') ch = 'i';
      s += ch;
    }

    if (s.length === 0) {
      throw new Error('Ciphertext must contain at least one letter A–Z.');
    }
    if (s.length % 2 === 1) {
      throw new Error('Ciphertext length (letters only) must be even for Playfair.');
    }

    const pairs = [];
    for (let i = 0; i < s.length; i += 2) {
      pairs.push([s[i], s[i + 1]]);
    }
    return pairs;
  }

  // --- Encryption & Decryption ---

  // Encrypt Playfair: plaintext -> UPPERCASE ciphertext
  function encryptPlayfair(plaintext, key) {
    const { square, positions } = buildKeySquare(key);
    const pairs = preparePlaintextForPlayfair(plaintext);

    const out = [];

    for (const [a, b] of pairs) {
      const pa = positions[a];
      const pb = positions[b];

      if (!pa || !pb) {
        throw new Error('Character not found in Playfair key square.');
      }

      let na, nb;

      if (pa.row === pb.row) {
        // same row: shift right
        const ca2 = (pa.col + 1) % 5;
        const cb2 = (pb.col + 1) % 5;
        na = square[pa.row * 5 + ca2];
        nb = square[pb.row * 5 + cb2];
      } else if (pa.col === pb.col) {
        // same column: shift down
        const ra2 = (pa.row + 1) % 5;
        const rb2 = (pb.row + 1) % 5;
        na = square[ra2 * 5 + pa.col];
        nb = square[rb2 * 5 + pb.col];
      } else {
        // rectangle
        na = square[pa.row * 5 + pb.col];
        nb = square[pb.row * 5 + pa.col];
      }

      out.push(na.toUpperCase(), nb.toUpperCase());
    }

    return out.join('');
  }

  // Decrypt Playfair: ciphertext -> lowercase plaintext
  function decryptPlayfair(ciphertext, key) {
    const { square, positions } = buildKeySquare(key);
    const pairs = prepareCiphertextForPlayfair(ciphertext);

    const out = [];

    for (const [a, b] of pairs) {
      const pa = positions[a];
      const pb = positions[b];

      if (!pa || !pb) {
        throw new Error('Character not found in Playfair key square.');
      }

      let na, nb;

      if (pa.row === pb.row) {
        // same row: shift left
        const ca2 = (pa.col + 4) % 5; // -1 mod 5
        const cb2 = (pb.col + 4) % 5;
        na = square[pa.row * 5 + ca2];
        nb = square[pb.row * 5 + cb2];
      } else if (pa.col === pb.col) {
        // same column: shift up
        const ra2 = (pa.row + 4) % 5;
        const rb2 = (pb.row + 4) % 5;
        na = square[ra2 * 5 + pa.col];
        nb = square[rb2 * 5 + pb.col];
      } else {
        // rectangle
        na = square[pa.row * 5 + pb.col];
        nb = square[pb.row * 5 + pa.col];
      }

      out.push(na, nb); // keep lowercase
    }

    return out.join('');
  }

  global.PlayfairCipher = {
    encryptPlayfair,
    decryptPlayfair
  };
})(window);