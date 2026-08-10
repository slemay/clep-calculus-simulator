/**
 * Math utilities for dynamic CLEP Calculus question generation
 */

// Helper to pick random integer in range [min, max]
export function getRandomInt(min, max, excludeZero = false) {
  let val = Math.floor(Math.random() * (max - min + 1)) + min;
  if (excludeZero && val === 0) {
    return getRandomInt(min, max, excludeZero);
  }
  return val;
}

// Helper to pick random element from an array
export function getRandomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Greatest Common Divisor
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Format fraction to LaTeX string
export function formatFraction(num, den, keepSign = true) {
  if (den === 0) return '\\text{undefined}';
  if (num === 0) return '0';
  let g = gcd(num, den);
  num /= g;
  den /= g;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  if (den === 1) return `${num}`;
  
  if (num < 0 && keepSign) {
    return `-\\frac{${Math.abs(num)}}{${den}}`;
  }
  return `\\frac{${num}}{${den}}`;
}

// Format coefficient for display (e.g. 1x^2 -> x^2, -1x -> -x, 0x -> "")
export function formatTerm(coeff, variablePower, isFirstTerm = false) {
  if (coeff === 0) return '';
  let sign = '';
  if (coeff > 0) {
    sign = isFirstTerm ? '' : ' + ';
  } else {
    sign = isFirstTerm ? '-' : ' - ';
  }
  let absCoeff = Math.abs(coeff);
  let coeffStr = (absCoeff === 1 && variablePower !== '') ? '' : `${absCoeff}`;
  return `${sign}${coeffStr}${variablePower}`;
}

// Format polynomial: coeffs array for [x^n, x^(n-1), ..., x^0]
export function formatPolynomial(coeffs) {
  let degree = coeffs.length - 1;
  let terms = [];
  let isFirst = true;
  for (let i = 0; i <= degree; i++) {
    let c = coeffs[i];
    if (c === 0) continue;
    let power = degree - i;
    let varPow = '';
    if (power === 1) varPow = 'x';
    else if (power > 1) varPow = `x^{${power}}`;
    
    terms.push(formatTerm(c, varPow, isFirst));
    isFirst = false;
  }
  return terms.length > 0 ? terms.join('') : '0';
}

/**
 * Normalizes choice string representation to prevent visual duplicate answer choices.
 */
export function normalizeChoice(item) {
  if (item === null || item === undefined) return '';
  let str = String(item).trim();
  // Strip LaTeX text wrappers, spaces, and formatting
  str = str.replace(/\\text\{([^}]+)\}/gi, '$1');
  str = str.replace(/\s+/g, '');
  // Normalize simple numeric values (e.g. "2.0" -> "2", "+0" -> "0")
  if (!isNaN(Number(str))) {
    return String(Number(str));
  }
  return str.toLowerCase();
}

/**
 * Shuffle answer choices (A, B, C, D, E) and track correct index.
 * Strictly guarantees that all 5 returned choice strings are 100% unique.
 */
export function createChoiceOptions(correctAnswer, rawDistractors) {
  const correctStr = String(correctAnswer).trim();
  const correctNorm = normalizeChoice(correctStr);

  const seenNorms = new Set([correctNorm]);
  const uniqueDistractors = [];

  for (let rawD of rawDistractors) {
    if (rawD === null || rawD === undefined) continue;
    let dStr = String(rawD).trim();
    let dNorm = normalizeChoice(dStr);

    if (dNorm && !seenNorms.has(dNorm)) {
      seenNorms.add(dNorm);
      uniqueDistractors.push(dStr);
    }
  }

  // Fallback generator if fewer than 4 unique distractors were supplied
  let fallbackIndex = 1;
  let numVal = parseFloat(correctStr);
  const isNumeric = !isNaN(numVal) && String(numVal) === correctStr.replace(/^[+]/, '');

  while (uniqueDistractors.length < 4 && fallbackIndex < 100) {
    let altStr = '';
    if (isNumeric) {
      let step = fallbackIndex % 2 === 1 ? fallbackIndex : -fallbackIndex;
      altStr = String(numVal + step);
    } else {
      altStr = `${correctStr} + ${fallbackIndex}`;
    }

    let altNorm = normalizeChoice(altStr);
    if (altNorm && !seenNorms.has(altNorm)) {
      seenNorms.add(altNorm);
      uniqueDistractors.push(altStr);
    }
    fallbackIndex++;
  }

  const selectedDistractors = uniqueDistractors.slice(0, 4);

  let optionsList = [
    { text: correctStr, isCorrect: true },
    ...selectedDistractors.map(d => ({ text: d, isCorrect: false }))
  ];

  // Fisher-Yates Shuffle
  for (let i = optionsList.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [optionsList[i], optionsList[j]] = [optionsList[j], optionsList[i]];
  }

  let correctIndex = optionsList.findIndex(o => o.isCorrect);
  let choices = optionsList.map(o => o.text);

  return {
    choices,
    correctIndex
  };
}
