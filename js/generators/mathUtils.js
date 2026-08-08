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

// Shuffle answer choices (A, B, C, D, E) and track correct index
export function createChoiceOptions(correctAnswer, distractors) {
  let uniqueDistractors = [];
  for (let d of distractors) {
    if (d !== correctAnswer && !uniqueDistractors.includes(d)) {
      uniqueDistractors.push(d);
    }
  }

  let fallbackCount = 1;
  while (uniqueDistractors.length < 4) {
    let alt = `${correctAnswer} + ${fallbackCount}`;
    if (typeof correctAnswer === 'number') {
      alt = (correctAnswer + fallbackCount * (fallbackCount % 2 === 0 ? 1 : -1)).toString();
    }
    if (alt !== correctAnswer && !uniqueDistractors.includes(alt)) {
      uniqueDistractors.push(alt);
    }
    fallbackCount++;
  }

  uniqueDistractors = uniqueDistractors.slice(0, 4);

  let optionsList = [
    { text: correctAnswer, isCorrect: true },
    ...uniqueDistractors.map(d => ({ text: d, isCorrect: false }))
  ];

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
