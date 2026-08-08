/**
 * Dynamic Limits & Continuity Question Generators
 */
import { getRandomInt, getRandomChoice, formatFraction, createChoiceOptions } from './mathUtils.js';

// 1. Factoring 0/0 Limit
export function generateLimitFactoring(difficulty) {
  let range = difficulty === 'easy' ? 4 : (difficulty === 'medium' ? 7 : 10);
  let c = getRandomInt(1, range);
  let a = getRandomInt(1, difficulty === 'easy' ? 3 : 5);
  let b = getRandomInt(-range, range, true);
  
  // f(x) = (x - c)(x + b) / (a(x - c)) = (x^2 + (b-c)x - bc) / (ax - ac)
  let numCoeff1 = 1;
  let numCoeff2 = b - c;
  let numCoeff3 = -b * c;
  
  let denCoeff1 = a;
  let denCoeff2 = -a * c;

  let limitValNum = c + b;
  let limitValDen = a;
  let correctLaTeX = formatFraction(limitValNum, limitValDen);

  // Distractors
  let dist1 = formatFraction(limitValNum + 1, limitValDen);
  let dist2 = formatFraction(limitValNum - c, limitValDen);
  let dist3 = formatFraction(-limitValNum, limitValDen);
  let dist4 = '0';
  let dist5 = '\\text{Does not exist}';

  let distractors = [dist1, dist2, dist3, dist4, dist5];
  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  let numStr = `x^2 ${numCoeff2 >= 0 ? '+' : ''}${numCoeff2 === 0 ? '' : numCoeff2 + 'x'} ${numCoeff3 >= 0 ? '+' : ''}${numCoeff3}`;
  let denStr = `${denCoeff1}x ${denCoeff2 >= 0 ? '+' : ''}${denCoeff2}`;

  return {
    topic: 'Limits & Continuity',
    questionText: `Evaluate the following limit:`,
    expressionLaTeX: `\\lim_{x \\to ${c}} \\frac{${numStr}}{${denStr}}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Direct substitution yields $\\frac{0}{0}$. Try factoring both the numerator and denominator to cancel the common factor $(x - ${c})$.`,
    explanation: `Direct substitution yields the indeterminate form $\\frac{0}{0}$. 
Factor the numerator and denominator:
$$\\frac{${numStr}}{${denStr}} = \\frac{(x - ${c})(x ${b >= 0 ? '+' : ''}${b})}{${a}(x - ${c})}$$
Cancel the common factor $(x - ${c})$ for $x \\neq ${c}$:
$$\\lim_{x \\to ${c}} \\frac{x ${b >= 0 ? '+' : ''}${b}}{${a}} = \\frac{${c} ${b >= 0 ? '+' : ''}${b}}{${a}} = ${correctLaTeX}$$`
  };
}

// 2. Limit at Infinity
export function generateLimitInfinity(difficulty) {
  let a = getRandomInt(1, 9);
  let b = getRandomInt(1, 9);
  let c = getRandomInt(-5, 5, true);
  let d = getRandomInt(-5, 5, true);

  let type = getRandomChoice(['same', 'higher_num', 'higher_den']);
  if (difficulty === 'easy') type = 'same';

  let numLaTeX = '';
  let denLaTeX = '';
  let correctLaTeX = '';
  let expText = '';

  if (type === 'same') {
    numLaTeX = `${a}x^2 ${c >= 0 ? '+' : ''}${c}x`;
    denLaTeX = `${b}x^2 ${d >= 0 ? '+' : ''}${d}`;
    correctLaTeX = formatFraction(a, b);
    expText = `Since the degree of the numerator (2) equals the degree of the denominator (2), the limit as $x \\to \\infty$ is the ratio of the leading coefficients: $\\frac{${a}}{${b}} = ${correctLaTeX}$.`;
  } else if (type === 'higher_num') {
    numLaTeX = `${a}x^3 ${c >= 0 ? '+' : ''}${c}x`;
    denLaTeX = `${b}x^2 ${d >= 0 ? '+' : ''}${d}`;
    correctLaTeX = '\\infty';
    expText = `Since the degree of the numerator (3) is greater than the degree of the denominator (2), the limit grows without bound as $x \\to \\infty$, so the limit is $\\infty$ (or does not exist).`;
  } else {
    numLaTeX = `${a}x ${c >= 0 ? '+' : ''}${c}`;
    denLaTeX = `${b}x^2 ${d >= 0 ? '+' : ''}${d}`;
    correctLaTeX = '0';
    expText = `Since the degree of the denominator (2) is greater than the degree of the numerator (1), the denominator grows much faster, resulting in a limit of $0$.`;
  }

  let distractors = [formatFraction(a, b), '0', '\\infty', formatFraction(b, a), '1', '\\text{Does not exist}'];
  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `Evaluate the limit at infinity:`,
    expressionLaTeX: `\\lim_{x \\to \\infty} \\frac{${numLaTeX}}{${denLaTeX}}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Compare the degree of the polynomial in the numerator with the degree in the denominator as $x \\to \\infty$.`,
    explanation: expText
  };
}

// 3. L'Hôpital's Rule Trig / Exponential Limit
export function generateLimitLHopital(difficulty) {
  let a = getRandomInt(2, 6);
  let b = getRandomInt(1, 5);
  let variant = getRandomChoice(['sin', 'exp', 'cos']);

  let questionLaTeX = '';
  let correctLaTeX = '';
  let explanationStr = '';

  if (variant === 'sin') {
    questionLaTeX = `\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${b}x}`;
    correctLaTeX = formatFraction(a, b);
    explanationStr = `Direct substitution yields $\\frac{0}{0}$. Applying L'Hôpital's Rule (differentiating numerator and denominator):
$$\\lim_{x \\to 0} \\frac{\\frac{d}{dx}[\\sin(${a}x)]}{\\frac{d}{dx}[${b}x]} = \\lim_{x \\to 0} \\frac{${a}\\cos(${a}x)}{${b}} = \\frac{${a}(1)}{${b}} = ${correctLaTeX}$$`;
  } else if (variant === 'exp') {
    questionLaTeX = `\\lim_{x \\to 0} \\frac{e^{${a}x} - 1}{${b}x}`;
    correctLaTeX = formatFraction(a, b);
    explanationStr = `Direct substitution yields $\\frac{0}{0}$. Applying L'Hôpital's Rule:
$$\\lim_{x \\to 0} \\frac{\\frac{d}{dx}[e^{${a}x} - 1]}{\\frac{d}{dx}[${b}x]} = \\lim_{x \\to 0} \\frac{${a}e^{${a}x}}{${b}} = \\frac{${a}(1)}{${b}} = ${correctLaTeX}$$`;
  } else {
    // 1 - cos(ax) / (b x^2) -> L'hopital twice gives a^2 / (2b)
    let aSq = a * a;
    let twoB = 2 * b;
    questionLaTeX = `\\lim_{x \\to 0} \\frac{1 - \\cos(${a}x)}{${b}x^2}`;
    correctLaTeX = formatFraction(aSq, twoB);
    explanationStr = `Direct substitution yields $\\frac{0}{0}$. Applying L'Hôpital's Rule once gives $\\lim_{x \\to 0} \\frac{${a}\\sin(${a}x)}{${2*b}x}$.
Applying L'Hôpital's Rule a second time gives:
$$\\lim_{x \\to 0} \\frac{${aSq}\\cos(${a}x)}{${twoB}} = \\frac{${aSq}(1)}{${twoB}} = ${correctLaTeX}$$`;
  }

  let distractors = [
    formatFraction(1, b),
    formatFraction(a*a, b),
    '0',
    '1',
    '\\text{Does not exist}'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `Evaluate the limit using algebraic methods or L'Hôpital's Rule:`,
    expressionLaTeX: questionLaTeX,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Substitution gives $\\frac{0}{0}$. Differentiate the numerator and denominator separately with respect to $x$.`,
    explanation: explanationStr
  };
}

// 4. Piecewise Function Continuity Parameter Search
export function generatePiecewiseContinuity(difficulty) {
  let c = getRandomInt(1, 4);
  let a = getRandomInt(2, 5);
  let b = getRandomInt(1, 3);
  let d = getRandomInt(-5, 5);

  // f(x) = ax + k for x <= c, and b x^2 + d for x > c
  // Continuity at x = c => ac + k = b c^2 + d => k = b c^2 + d - ac
  let rightLimit = b * c * c + d;
  let leftLimitNoK = a * c;
  let kVal = rightLimit - leftLimitNoK;

  let correctLaTeX = `${kVal}`;
  let distractors = [
    `${kVal + c}`,
    `${kVal - c}`,
    `${rightLimit}`,
    `${leftLimitNoK}`,
    '0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `Find the value of $k$ that makes the function $f(x)$ continuous everywhere:`,
    expressionLaTeX: `f(x) = \\begin{cases} ${a}x + k, & x \\le ${c} \\\\ ${b}x^2 ${d >= 0 ? '+' : ''}${d}, & x > ${c} \\end{cases}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `For continuity at $x = ${c}$, set the left-hand limit $\\lim_{x \\to ${c}^-} f(x)$ equal to the right-hand limit $\\lim_{x \\to ${c}^+} f(x)$ and solve for $k$.`,
    explanation: `For $f(x)$ to be continuous at $x = ${c}$, the left-hand limit, right-hand limit, and function value at $x = ${c}$ must all be equal:
$$\\lim_{x \\to ${c}^-} f(x) = \\lim_{x \\to ${c}^+} f(x)$$
Left-hand limit & function value: $f(${c}) = ${a}(${c}) + k = ${leftLimitNoK} + k$
Right-hand limit: $\\lim_{x \\to ${c}^+} (${b}x^2 ${d >= 0 ? '+' : ''}${d}) = ${b}(${c})^2 ${d >= 0 ? '+' : ''}${d} = ${rightLimit}$

Set them equal:
$${leftLimitNoK} + k = ${rightLimit} \\implies k = ${rightLimit} - ${leftLimitNoK} = ${kVal}$.`
  };
}
