/**
 * Dynamic Differential Calculus Question Generators (~50% of CLEP Calculus Exam)
 */
import { getRandomInt, getRandomChoice, formatFraction, formatPolynomial, createChoiceOptions } from './mathUtils.js';

// 1. Power Rule & Polynomial Derivative at a Point
export function generatePowerRulePoint(difficulty) {
  let a = getRandomInt(1, 5);
  let b = getRandomInt(-5, 5, true);
  let c = getRandomInt(-9, 9, true);
  let x0 = getRandomInt(-3, 3, true);

  // f(x) = a x^3 + b x^2 + c x + d
  // f'(x) = 3a x^2 + 2b x + c
  // f'(x0) = 3a x0^2 + 2b x0 + c
  let fPrimeVal = 3 * a * x0 * x0 + 2 * b * x0 + c;
  
  let correctLaTeX = `${fPrimeVal}`;
  let distractors = [
    `${fPrimeVal + 2}`,
    `${fPrimeVal - 2}`,
    `${3 * a * x0 + 2 * b}`,
    `${a * Math.pow(x0, 3) + b * Math.pow(x0, 2) + c * x0}`,
    '0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);
  let polyStr = formatPolynomial([a, b, c, getRandomInt(-5, 5)]);

  return {
    topic: 'Differential Calculus',
    questionText: `If $f(x) = ${polyStr}$, evaluate $f'(${x0})$.`,
    expressionLaTeX: `f'(${x0})`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use the power rule $\\frac{d}{dx}[x^n] = n x^{n-1}$ term-by-term to find $f'(x)$, then plug in $x = ${x0}$.`,
    explanation: `First, find the derivative function $f'(x)$ using the power rule:
$$f'(x) = \\frac{d}{dx}[${polyStr}] = ${3*a}x^2 ${2*b >= 0 ? '+' : ''}${2*b}x ${c >= 0 ? '+' : ''}${c}$$
Next, substitute $x = ${x0}$:
$$f'(${x0}) = ${3*a}(${x0})^2 + (${2*b})(${x0}) + (${c}) = ${3*a}(${x0*x0}) ${2*b*x0 >= 0 ? '+' : ''}${2*b*x0} ${c >= 0 ? '+' : ''}${c} = ${fPrimeVal}$$`
  };
}

// 2. Product Rule Derivative
export function generateProductRule(difficulty) {
  let n = getRandomInt(2, 4);
  let a = getRandomInt(2, 5);

  // f(x) = x^n * e^(a x)
  // f'(x) = n x^(n-1) e^(a x) + a x^n e^(a x) = x^(n-1) e^(a x) (n + a x)
  let nMinus1 = n - 1;
  let powerStr = nMinus1 === 1 ? 'x' : `x^{${nMinus1}}`;

  let correctLaTeX = `${powerStr} e^{${a}x} (${n} + ${a}x)`;
  let distractors = [
    `${n}x^{${nMinus1}} e^{${a}x}`,
    `${a}x^{${n}} e^{${a}x}`,
    `${n}x^{${nMinus1}} (${a}e^{${a}x})`,
    `x^{${nMinus1}} e^{${a}x} (${a}x - ${n})`,
    `e^{${a}x} (${n}x + ${a})`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the derivative of $f(x) = x^{${n}} e^{${a}x}$.`,
    expressionLaTeX: `\\frac{d}{dx}\\left[x^{${n}} e^{${a}x}\\right]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use the Product Rule: $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$ with $u = x^{${n}}$ and $v = e^{${a}x}$.`,
    explanation: `Use the Product Rule $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$:
Let $u = x^{${n}} \\implies u' = ${n}x^{${nMinus1}}$
Let $v = e^{${a}x} \\implies v' = ${a}e^{${a}x}$

$$f'(x) = (${n}x^{${nMinus1}})(e^{${a}x}) + (x^{${n}})(${a}e^{${a}x})$$
Factor out $x^{${nMinus1}} e^{${a}x}$:
$$f'(x) = ${correctLaTeX}$$`
  };
}

// 3. Quotient Rule Derivative
export function generateQuotientRule(difficulty) {
  let a = getRandomInt(2, 6);
  let b = getRandomInt(1, 5);

  // f(x) = (a x) / (x + b)
  // f'(x) = [a(x + b) - a x(1)] / (x + b)^2 = (a b) / (x + b)^2
  let ab = a * b;
  let correctLaTeX = `\\frac{${ab}}{(x + ${b})^2}`;

  let distractors = [
    `\\frac{${a}}{(x + ${b})^2}`,
    `\\frac{${ab}x}{(x + ${b})^2}`,
    `\\frac{-${ab}}{(x + ${b})^2}`,
    `\\frac{${a}x + ${ab}}{x + ${b}}`,
    `\\frac{${a}}{1}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the derivative $f'(x)$ for the function:`,
    expressionLaTeX: `f(x) = \\frac{${a}x}{x + ${b}}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Apply the Quotient Rule: $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$ where $u = ${a}x$ and $v = x + ${b}$.`,
    explanation: `Apply the Quotient Rule $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$:
Here $u = ${a}x \\implies u' = ${a}$, and $v = x + ${b} \\implies v' = 1$.

$$f'(x) = \\frac{(${a})(x + ${b}) - (${a}x)(1)}{(x + ${b})^2} = \\frac{${a}x + ${ab} - ${a}x}{(x + ${b})^2} = ${correctLaTeX}$$`
  };
}

// 4. Chain Rule (Logarithm / Composite)
export function generateChainRule(difficulty) {
  let a = getRandomInt(2, 5);
  let b = getRandomInt(1, 7);

  // f(x) = ln(a x^2 + b)
  // f'(x) = 2 a x / (a x^2 + b)
  let twoA = 2 * a;
  let correctLaTeX = `\\frac{${twoA}x}{${a}x^2 + ${b}}`;

  let distractors = [
    `\\frac{1}{${a}x^2 + ${b}}`,
    `\\frac{${a}x}{${a}x^2 + ${b}}`,
    `\\frac{${twoA}x}{x}`,
    `\\frac{${a}x^2 + ${b}}{${twoA}x}`,
    `${twoA}x \\ln(${a}x^2 + ${b})`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find $\\frac{dy}{dx}$ if $y = \\ln(${a}x^2 + ${b})$.`,
    expressionLaTeX: `\\frac{d}{dx}\\left[\\ln(${a}x^2 + ${b})\\right]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use the Chain Rule for natural logarithms: $\\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u}$.`,
    explanation: `Use the Chain Rule for logarithms $\\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u}$:
Here $u = ${a}x^2 + ${b} \\implies u' = ${twoA}x$.

$$\\frac{dy}{dx} = \\frac{${twoA}x}{${a}x^2 + ${b}}$$`
  };
}

// 5. Tangent Line Equation
export function generateTangentLine(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(-4, 4, true);
  let c = getRandomInt(-5, 5);
  let x0 = getRandomInt(1, 3);

  // f(x) = a x^2 + b x + c
  // y0 = a x0^2 + b x0 + c
  // f'(x) = 2a x + b => m = 2a x0 + b
  // Tangent line: y - y0 = m(x - x0) => y = m x + (y0 - m x0)
  let y0 = a * x0 * x0 + b * x0 + c;
  let m = 2 * a * x0 + b;
  let yIntercept = y0 - m * x0;

  let correctLaTeX = `y = ${m}x ${yIntercept >= 0 ? '+' : ''}${yIntercept}`;

  let distractors = [
    `y = ${m}x + ${y0}`,
    `y = ${2*a}x ${yIntercept >= 0 ? '+' : ''}${yIntercept}`,
    `y = ${-m}x ${yIntercept >= 0 ? '+' : ''}${yIntercept}`,
    `y = ${m}x ${y0 >= 0 ? '+' : ''}${y0}`,
    `y = ${m}x - ${yIntercept}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the equation of the line tangent to the graph of $f(x) = ${formatPolynomial([a, b, c])}$ at $x = ${x0}$.`,
    expressionLaTeX: `f(x) = ${formatPolynomial([a, b, c])}, \\quad x = ${x0}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `1. Evaluate $f(${x0})$ to get point $(x_0, y_0)$. 2. Evaluate $f'(${x0})$ to get slope $m$. 3. Use point-slope form $y - y_0 = m(x - x_0)$.`,
    explanation: `1. Find the point of tangency $(x_0, y_0)$:
$$y_0 = f(${x0}) = ${a}(${x0})^2 + (${b})(${x0}) + ${c} = ${y0}$$

2. Find the slope $m = f'(${x0})$:
$$f'(x) = ${2*a}x ${b >= 0 ? '+' : ''}${b} \\implies m = f'(${x0}) = ${2*a}(${x0}) ${b >= 0 ? '+' : ''}${b} = ${m}$$

3. Use point-slope form $y - y_0 = m(x - x_0)$:
$$y - ${y0} = ${m}(x - ${x0}) \\implies y = ${m}x - ${m*x0} + ${y0} = ${correctLaTeX}$$`
  };
}

// 6. Implicit Differentiation
export function generateImplicitDifferentiation(difficulty) {
  let a = getRandomInt(2, 5);
  let b = getRandomInt(2, 6);

  // x^2 + a x y + y^2 = b
  // 2x + a y + a x dy/dx + 2y dy/dx = 0
  // dy/dx (a x + 2 y) = -(2 x + a y)
  // dy/dx = -(2x + a y) / (a x + 2 y)
  let correctLaTeX = `-\\frac{2x + ${a}y}{${a}x + 2y}`;

  let distractors = [
    `\\frac{2x + ${a}y}{${a}x + 2y}`,
    `-\\frac{x + ${a}y}{${a}x + y}`,
    `-\\frac{2x}{2y}`,
    `\\frac{${a}y - 2x}{${a}x + 2y}`,
    `-\\frac{2x + y}{x + 2y}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find $\\frac{dy}{dx}$ implicitly for the equation:`,
    expressionLaTeX: `x^2 + ${a}xy + y^2 = ${b}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Differentiate both sides with respect to $x$. Use product rule on ${a}x y$ and remember $\\frac{d}{dx}[y^2] = 2y \\frac{dy}{dx}$.`,
    explanation: `Differentiate both sides with respect to $x$:
$$\\frac{d}{dx}[x^2] + \\frac{d}{dx}[${a}xy] + \\frac{d}{dx}[y^2] = \\frac{d}{dx}[${b}]$$
Apply the product rule to ${a}xy$:
$$2x + \\left(${a}y + ${a}x \\frac{dy}{dx}\\right) + 2y \\frac{dy}{dx} = 0$$
Group terms containing $\\frac{dy}{dx}$:
$$\\left(${a}x + 2y\\right)\\frac{dy}{dx} = -(2x + ${a}y)$$
Solve for $\\frac{dy}{dx}$:
$$\\frac{dy}{dx} = ${correctLaTeX}$$`
  };
}

// 7. Critical Points & Local Extrema
export function generateCriticalPoints(difficulty) {
  let x1 = getRandomInt(-4, -1);
  let x2 = getRandomInt(1, 4);

  // f'(x) = 3(x - x1)(x - x2) = 3(x^2 - (x1+x2)x + x1*x2) = 3x^2 - 3(x1+x2)x + 3 x1 x2
  let bCoeff = -3 * (x1 + x2);
  let cCoeff = 3 * x1 * x2;
  
  // f(x) = x^3 + (bCoeff/2) x^2 + cCoeff x
  // f''(x) = 6x + 2*(bCoeff/2) = 6x + bCoeff
  // f''(x1) = 6 x1 + bCoeff = 6 x1 - 3 x1 - 3 x2 = 3(x1 - x2) < 0 => Local MAX at x1
  // f''(x2) = 3(x2 - x1) > 0 => Local MIN at x2

  let isAskingMax = getRandomChoice([true, false]);
  let targetX = isAskingMax ? x1 : x2;
  let typeStr = isAskingMax ? 'relative maximum' : 'relative minimum';

  let correctLaTeX = `x = ${targetX}`;
  let distractors = [
    `x = ${isAskingMax ? x2 : x1}`,
    `x = 0`,
    `x = ${targetX + 1}`,
    `x = ${targetX - 1}`,
    `\\text{No relative extrema exist}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);
  let bOver2 = bCoeff / 2;

  return {
    topic: 'Differential Calculus',
    questionText: `Find the $x$-coordinate where $f(x)$ has a ${typeStr}:`,
    expressionLaTeX: `f(x) = x^3 ${bOver2 >= 0 ? '+' : ''}${bOver2 === 0 ? '' : bOver2 + 'x^2'} ${cCoeff >= 0 ? '+' : ''}${cCoeff}x`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Set $f'(x) = 0$ to find critical numbers, then evaluate $f''(x)$ at each critical number to test for a relative ${typeStr}.`,
    explanation: `1. Find critical points by setting $f'(x) = 0$:
$$f'(x) = 3x^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff}x ${cCoeff >= 0 ? '+' : ''}${cCoeff} = 3(x - (${x1}))(x - (${x2})) = 0$$
So critical numbers are $x = ${x1}$ and $x = ${x2}$.

2. Test second derivative $f''(x) = 6x ${bCoeff >= 0 ? '+' : ''}${bCoeff}$:
- $f''(${x1}) = 6(${x1}) ${bCoeff >= 0 ? '+' : ''}${bCoeff} < 0 \\implies$ Relative Maximum at $x = ${x1}$.
- $f''(${x2}) = 6(${x2}) ${bCoeff >= 0 ? '+' : ''}${bCoeff} > 0 \\implies$ Relative Minimum at $x = ${x2}$.

Thus, $f(x)$ has a ${typeStr} at $x = ${targetX}$.`
  };
}

// 8. Mean Value Theorem
export function generateMeanValueTheorem(difficulty) {
  let a = getRandomInt(1, 3);
  let k = getRandomInt(2, 5);

  // f(x) = x^2 on interval [0, k]
  // f'(c) = 2c = (f(k) - f(0)) / (k - 0) = (k^2 - 0) / k = k => 2c = k => c = k / 2
  let correctLaTeX = formatFraction(k, 2);

  let distractors = [
    `${k}`,
    formatFraction(k, 3),
    formatFraction(k, 4),
    `0`,
    formatFraction(2 * k, 3)
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the value of $c$ that satisfies the Mean Value Theorem for $f(x) = x^2$ on the interval $[0, ${k}]$.`,
    expressionLaTeX: `f(x) = x^2, \\quad x \\in [0, ${k}]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Set the derivative $f'(c) = 2c$ equal to the average rate of change $\\frac{f(${k}) - f(0)}{${k} - 0}$ and solve for $c$.`,
    explanation: `The Mean Value Theorem states there exists $c \\in (0, ${k})$ such that:
$$f'(c) = \\frac{f(${k}) - f(0)}{${k} - 0}$$
Calculate average rate of change:
$$\\frac{${k}^2 - 0^2}{${k}} = \\frac{${k*k}}{${k}} = ${k}$$
Since $f'(x) = 2x$, set $f'(c) = 2c = ${k} \\implies c = ${correctLaTeX}$.`
  };
}
