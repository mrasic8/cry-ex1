// js/hill_multiplicative_inverse.js
(function (global) {
  const { MOD, gcd, multiplicativeInverseMod } = global.HillMath;

  const form = document.getElementById('hill-multinv-form');
  const aField = document.getElementById('hill-multinv-a');
  const errorBox = document.getElementById('hill-multinv-error');
  const gcdBox = document.getElementById('hill-multinv-gcd-output');
  const invBox = document.getElementById('hill-multinv-output');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = '';
    gcdBox.textContent = '';
    invBox.textContent = '';

    const a = Number.parseInt(aField.value, 10);
    if (Number.isNaN(a)) {
      errorBox.textContent = 'Please enter an integer.';
      return;
    }

    const g = gcd(a, MOD);
    gcdBox.textContent = String(g);

    if (g !== 1) {
      invBox.textContent = `No multiplicative inverse exists because gcd(${a}, 26) = ${g}.`;
      return;
    }

    try {
      const inv = multiplicativeInverseMod(a, MOD);
      invBox.textContent = String(inv);
    } catch (e) {
      invBox.textContent = e.message || 'Error computing multiplicative inverse.';
    }
  });
})(window);