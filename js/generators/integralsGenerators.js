/**
 * Dynamic Integral Calculus Question Generators (~40% of CLEP Calculus Exam)
 * Covers 17+ distinct, highly varied integral templates with extreme mode support
 */
import { getRandomInt, getRandomChoice, formatFraction, formatPolynomial, createChoiceOptions, gcd } from './mathUtils.js';

// 1. Basic & Polynomial Definite Integrals (including fractional powers)
export function generateDefiniteIntegralPolynomial(difficulty) {
  let subType = getRandomChoice(['poly', 'fractional_exp']);
  if (difficulty === 'easy') subType = 'poly';

  if (subType === 'fractional_exp') {
    // int_0^4 (a sqrt(x) + b) dx = [a (2/3) x^(3/2) + bx]_0^4
    let a = 3 * getRandomInt(1, 3);
    let b = getRandomInt(1, 4);
    let x2 = 4;
    // a * (2/3) * 8 + b * 4 = 16 (a/3) + 4b
    let result = (a / 3) * 16 + b * 4;

    let correctLaTeX = `${result}`;
    let distractors = [
      `${result + 4}`,
      `${result - 4}`,
      `${(a / 2) * 8 + b * 4}`,
      `${a * 2 + b * 4}`,
      '0'
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Integral Calculus',
      questionText: `Evaluate the definite integral:`,
      expressionLaTeX: `\\int_{0}^{4} (${a}\\sqrt{x} + ${b}) \\, dx`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Recall $\\int x^{1/2} \\, dx = \\frac{2}{3}x^{3/2} + C$. Evaluate from $0$ to $4$.`,
      explanation: `📌 **Core Concept & Formula:**
**Power Rule for Integration:**
$$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C, \\quad \\int x^{1/2} \\, dx = \\frac{x^{3/2}}{3/2} = \\frac{2}{3}x^{3/2}$$

**Step 1: Find the Antiderivative**
$$F(x) = ${a}\\left(\\frac{2}{3}x^{3/2}\\right) + ${b}x = ${2 * a / 3}x^{3/2} + ${b}x$$

**Step 2: Evaluate $F(4) - F(0)$**
$$F(4) = ${2 * a / 3}(4^{3/2}) + ${b}(4) = ${2 * a / 3}(8) + ${4 * b} = ${16 * a / 3} + ${4 * b} = ${result}$$
$$F(0) = 0 \\implies \\int_{0}^{4} (${a}\\sqrt{x} + ${b}) \\, dx = ${result}$$`
    };
  } else {
    let a = getRandomInt(1, 3);
    let b = getRandomInt(-4, 4, true);
    let x2 = getRandomInt(1, 4);

    let term1 = 3 * a;
    let term2 = 2 * b;
    let result = a * Math.pow(x2, 3) + b * Math.pow(x2, 2);

    let correctLaTeX = `${result}`;
    let distractors = [
      `${result + x2}`,
      `${result - x2}`,
      `${term1 * x2 + term2}`,
      `${a * Math.pow(x2, 2) + b * x2}`,
      '0'
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Integral Calculus',
      questionText: `Evaluate the definite integral:`,
      expressionLaTeX: `\\int_{0}^{${x2}} (${term1}x^2 ${term2 >= 0 ? '+' : ''}${term2}x) \\, dx`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Antiderivative is $F(x) = ${a}x^3 ${b >= 0 ? '+' : ''}${b}x^2$. Calculate $F(${x2}) - F(0)$.`,
      explanation: `📌 **Core Concept & Formula:**
**Fundamental Theorem of Calculus Part 2:** $\\int_a^b f(x) dx = F(b) - F(a)$.

**Step 1: Compute Antiderivative**
$$F(x) = ${a}x^3 ${b >= 0 ? '+' : ''}${b}x^2$$

**Step 2: Evaluate at Limits**
$$F(${x2}) - F(0) = (${a}(${x2})^3 ${b >= 0 ? '+' : ''}${b}(${x2})^2) - 0 = ${result}$$`
    };
  }
}

// 2. U-Substitution Exponential Definite Integrals
export function generateUSubExponential(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(1, 3);

  let abSq = a * b * b;
  let twoA = 2 * a;

  let correctLaTeX = `\\frac{e^{${abSq}} - 1}{${twoA}}`;
  let distractors = [
    `\\frac{e^{${abSq}}}{${twoA}}`,
    `\\frac{e^{${abSq}} - 1}{${a}}`,
    `e^{${abSq}} - 1`,
    `\\frac{e^{${abSq}} + 1}{${twoA}}`,
    `\\frac{e^{${a*b}} - 1}{${twoA}}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Evaluate the definite integral using substitution:`,
    expressionLaTeX: `\\int_{0}^{${b}} x e^{${a}x^2} dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Let $u = ${a}x^2 \\implies du = ${2*a}x dx$. Transform the limits: $u(0) = 0, u(${b}) = ${abSq}$.`,
    explanation: `📌 **Core Concept & Formula:**
**$u$-Substitution for Definite Integrals:**
$$\\int_{a}^{b} f(g(x))g'(x) \\, dx = \\int_{g(a)}^{g(b)} f(u) \\, du$$

**Step 1: Substitution & Differentials**
Let $u = ${a}x^2 \\implies du = ${2*a}x \\, dx \\implies x \\, dx = \\frac{du}{${2*a}}$.

**Step 2: Transform the Limits**
- Lower: $u(0) = ${a}(0)^2 = 0$
- Upper: $u(${b}) = ${a}(${b})^2 = ${abSq}$

**Step 3: Evaluate Transformed Integral**
$$\\int_{0}^{${abSq}} \\frac{1}{${twoA}} e^u \\, du = \\frac{1}{${twoA}} \\left[ e^u \\right]_{0}^{${abSq}} = \\frac{e^{${abSq}} - e^0}{${twoA}} = ${correctLaTeX}$$`
  };
}

// 3. U-Substitution Trigonometric Integrals
export function generateUSubTrig(difficulty) {
  let n = getRandomInt(2, 4);
  let nPlus1 = n + 1;

  let correctLaTeX = `\\frac{1}{${nPlus1}}`;
  let distractors = [
    `\\frac{1}{${n}}`,
    `1`,
    `\\frac{1}{${n + 2}}`,
    '0',
    `\\frac{\\pi}{${nPlus1}}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Evaluate the definite trigonometric integral:`,
    expressionLaTeX: `\\int_{0}^{\\pi/2} \\sin^{${n}}(x) \\cos(x) \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Let $u = \\sin(x) \\implies du = \\cos(x) dx$. Update the bounds from $x = 0$ to $x = \\pi/2$.`,
    explanation: `📌 **Core Concept & Formula:**
**Trigonometric Substitution:**
Let $u = \\sin(x) \\implies du = \\cos(x) \\, dx$.

**Step 1: Convert Limits of Integration**
- Lower bound: $u(0) = \\sin(0) = 0$
- Upper bound: $u(\\pi/2) = \\sin(\\pi/2) = 1$

**Step 2: Evaluate Transformed Integral**
$$\\int_{0}^{1} u^{${n}} \\, du = \\left[ \\frac{u^{${nPlus1}}}{${nPlus1}} \\right]_{0}^{1} = \\frac{1^{${nPlus1}}}{${nPlus1}} - 0 = \\frac{1}{${nPlus1}}$$`
  };
}

// 4. U-Substitution Logarithmic and Rational Integrals
export function generateUSubLogAndRational(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomChoice([1, 2, 3]);

  // int_1^e (ln(x))^k / x dx = [ (ln x)^(k+1) / (k+1) ]_1^e = 1 / (k+1)
  let k = getRandomChoice([1, 2, 3]);
  let kPlus1 = k + 1;

  let correctLaTeX = formatFraction(1, kPlus1);
  let distractors = [
    formatFraction(1, k),
    '1',
    formatFraction(1, kPlus1 + 1),
    'e - 1',
    '0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Evaluate the definite integral:`,
    expressionLaTeX: `\\int_{1}^{e} \\frac{(\\ln x)^{${k}}}{x} \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Let $u = \\ln(x) \\implies du = \\frac{1}{x} dx$. Bounds transform from $u(1) = 0$ to $u(e) = 1$.`,
    explanation: `📌 **Core Concept & Formula:**
$$\\int f(\\ln x) \\frac{1}{x} \\, dx = \\int f(u) \\, du$$

**Step 1: Substitute & Change Bounds**
Let $u = \\ln(x) \\implies du = \\frac{1}{x} dx$.
- Lower: $u(1) = \\ln(1) = 0$
- Upper: $u(e) = \\ln(e) = 1$

**Step 2: Integrate**
$$\\int_{0}^{1} u^{${k}} \\, du = \\left[ \\frac{u^{${kPlus1}}}{${kPlus1}} \\right]_{0}^{1} = \\frac{1}{${kPlus1}}$$`
  };
}

// 5. Inverse Trigonometric Integrals (Arctan / Arcsin)
export function generateInverseTrigIntegral(difficulty) {
  let aVals = [1, 2, 3, 4];
  let a = getRandomChoice(aVals);
  let aSq = a * a;

  // int 1 / (x^2 + a^2) dx = (1/a) arctan(x/a) + C
  let correctLaTeX = a === 1 ? `\\arctan(x) + C` : `\\frac{1}{${a}}\\arctan\\left(\\frac{x}{${a}}\\right) + C`;
  let distractors = [
    `\\arctan\\left(\\frac{x}{${a}}\\right) + C`,
    `\\frac{1}{${aSq}}\\arctan\\left(\\frac{x}{${a}}\\right) + C`,
    `\\frac{1}{${a}}\\arcsin\\left(\\frac{x}{${a}}\\right) + C`,
    `\\ln(x^2 + ${aSq}) + C`,
    `\\frac{1}{2x}\\arctan\\left(\\frac{x}{${a}}\\right) + C`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the indefinite integral:`,
    expressionLaTeX: `\\int \\frac{1}{x^2 + ${aSq}} \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use the standard arctangent integral formula: $\\int \\frac{1}{x^2 + a^2} \\, dx = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) + C$.`,
    explanation: `📌 **Core Concept & Formula:**
**Inverse Trigonometric Integrals:**
$$\\int \\frac{1}{x^2 + a^2} \\, dx = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) + C$$

**Step 1: Identify $a$**
Here $a^2 = ${aSq} \\implies a = ${a}$.

**Step 2: Apply the Standard Formula**
$$\\int \\frac{1}{x^2 + ${aSq}} \\, dx = ${correctLaTeX}$$`
  };
}

// 6. Integration by Parts
export function generateIntegrationByParts(difficulty) {
  let a = getRandomInt(1, 3);
  // int x e^(ax) dx = (1/a) x e^(ax) - (1/a^2) e^(ax) + C
  let aSq = a * a;
  let correctLaTeX = a === 1 ? `e^x (x - 1) + C` : `\\frac{e^{${a}x}}{${aSq}} (${a}x - 1) + C`;

  let distractors = [
    a === 1 ? `e^x (x + 1) + C` : `\\frac{e^{${a}x}}{${a}} (${a}x + 1) + C`,
    `\\frac{x^2}{2} e^{${a}x} + C`,
    `\\frac{e^{${a}x}}{${a}} (x - 1) + C`,
    `${a}x e^{${a}x} + C`,
    `e^{${a}x} (x - ${a}) + C`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Evaluate the indefinite integral using integration by parts:`,
    expressionLaTeX: `\\int x e^{${a === 1 ? '' : a}x} \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use Integration by Parts $\\int u \\, dv = uv - \\int v \\, du$ with $u = x$ and $dv = e^{${a === 1 ? '' : a}x} dx$.`,
    explanation: `📌 **Core Concept & Formula:**
**Integration by Parts Formula:**
$$\\int u \\, dv = uv - \\int v \\, du$$

**Step 1: Assign $u$ and $dv$ using LIATE rule**
- $u = x \\implies du = dx$
- $dv = e^{${a === 1 ? '' : a}x} dx \\implies v = \\frac{1}{${a}}e^{${a === 1 ? '' : a}x}$

**Step 2: Apply the Formula**
$$\\int x e^{${a === 1 ? '' : a}x} dx = x \\left(\\frac{1}{${a}}e^{${a === 1 ? '' : a}x}\\right) - \\int \\frac{1}{${a}}e^{${a === 1 ? '' : a}x} dx$$
$$= \\frac{x}{${a}}e^{${a === 1 ? '' : a}x} - \\frac{1}{${aSq}}e^{${a === 1 ? '' : a}x} + C = ${correctLaTeX}$$`
  };
}

// 7. Fundamental Theorem of Calculus Part 1 (Single Variable Bound)
export function generateFTC1(difficulty) {
  let a = getRandomInt(2, 4);
  let power = getRandomChoice([2, 3]);

  // g(x) = int_a^(x^power) sqrt(t^3 + 1) dt => g'(x) = sqrt((x^power)^3 + 1) * power * x^(power-1)
  let pMinus1 = power - 1;
  let pStr = pMinus1 === 1 ? 'x' : `x^{${pMinus1}}`;
  let insidePower = power * 3;

  let correctLaTeX = `${power}${pStr} \\sqrt{x^{${insidePower}} + 1}`;
  let distractors = [
    `\\sqrt{x^{${insidePower}} + 1}`,
    `${power}${pStr} \\sqrt{x^3 + 1}`,
    `\\frac{1}{2\\sqrt{x^{${insidePower}} + 1}}`,
    `x^{${power}} \\sqrt{x^{${insidePower}} + 1}`,
    `${power}x\\sqrt{x^{${insidePower}} + 1}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the derivative of $g(x) = \\int_{${a}}^{x^{${power}}} \\sqrt{t^3 + 1} \\, dt$.`,
    expressionLaTeX: `g'(x) = \\frac{d}{dx}\\left[\\int_{${a}}^{x^{${power}}} \\sqrt{t^3 + 1} \\, dt\\right]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use FTC Part 1 with the Chain Rule: $\\frac{d}{dx}\\int_a^{u(x)} f(t) dt = f(u(x)) \\cdot u'(x)$.`,
    explanation: `📌 **Core Concept & Formula:**
**Leibniz Rule / FTC Part 1 with Chain Rule:**
$$\\frac{d}{dx}\\left[ \\int_{a}^{u(x)} f(t) \\, dt \\right] = f(u(x)) \\cdot u'(x)$$

**Step 1: Identify Components**
- Integrand: $f(t) = \\sqrt{t^3 + 1}$
- Upper limit: $u(x) = x^{${power}} \\implies u'(x) = ${power}${pStr}$

**Step 2: Substitute and Multiply by $u'(x)$**
$$g'(x) = \\sqrt{(x^{${power}})^3 + 1} \\cdot (${power}${pStr}) = ${correctLaTeX}$$`
  };
}

// 8. Fundamental Theorem of Calculus Part 1 with Two Variable Bounds
export function generateFTC1TwoBounds(difficulty) {
  let correctLaTeX = `2x e^{(x^2)^2} - e^{x^2} = 2x e^{x^4} - e^{x^2}`;
  let distractors = [
    `e^{x^4} - e^{x^2}`,
    `2x e^{x^4}`,
    `2x e^{x^4} + e^{x^2}`,
    `e^{x^2} (2x - 1)`,
    `0`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the derivative of $h(x) = \\int_{x}^{x^2} e^{t^2} \\, dt$.`,
    expressionLaTeX: `\\frac{d}{dx}\\left[\\int_{x}^{x^2} e^{t^2} \\, dt\\right]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Split the integral at a constant $c$: $\\int_x^{x^2} = \\int_c^{x^2} - \\int_c^x$. Then differentiate both parts using the Chain Rule.`,
    explanation: `📌 **Core Concept & Formula:**
**Two Variable Bounds Differentiation:**
$$\\frac{d}{dx}\\left[ \\int_{v(x)}^{u(x)} f(t) \\, dt \\right] = f(u(x)) \\cdot u'(x) - f(v(x)) \\cdot v'(x)$$

**Step 1: Upper and Lower Bound Derivatives**
- Upper: $u(x) = x^2 \\implies u'(x) = 2x$
- Lower: $v(x) = x \\implies v'(x) = 1$

**Step 2: Apply Formula**
$$h'(x) = e^{(x^2)^2} \\cdot (2x) - e^{(x)^2} \\cdot (1) = 2x e^{x^4} - e^{x^2}$$`
  };
}

// 9. Area Between Curves
export function generateAreaBetweenCurves(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(1, 3);

  // Parabola y = a x^2 and line y = (a+b) x
  // a x^2 = (a+b) x => x(a x - (a+b)) = 0 => x = 0 to x = (a+b)/a
  // Area = int_0^L ((a+b)x - a x^2) dx = (a+b) L^2 / 2 - a L^3 / 3
  let L = 2;
  // Let y1 = 4x - x^2, y2 = 0 or y1 = -x^2 + 4, y2 = 0
  // Area = int_0^L (L x - x^2) dx = L^3/6
  let areaVal = formatFraction(Math.pow(L, 3), 6);

  let correctLaTeX = `${areaVal}`;
  let distractors = [
    formatFraction(Math.pow(L, 3), 3),
    formatFraction(Math.pow(L, 3), 2),
    formatFraction(Math.pow(L, 2), 6),
    '2',
    '4'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the area of the region enclosed between the parabola $y = ${L}x - x^2$ and the $x$-axis ($y = 0$).`,
    expressionLaTeX: `A = \\int_{0}^{${L}} (${L}x - x^2) \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Find intersection points by solving ${L}x - x^2 = 0 \\implies x( ${L} - x) = 0$. Integrate $\\int_0^{${L}} (${L}x - x^2) dx$.`,
    explanation: `📌 **Core Concept & Formula:**
**Area Between Curves:** $A = \\int_{a}^{b} [y_{\\text{top}} - y_{\\text{bottom}}] \\, dx$.

**Step 1: Find Intersection Bounds**
$${L}x - x^2 = 0 \\implies x(${L} - x) = 0 \\implies x = 0, \\; x = ${L}$$

**Step 2: Set Up and Evaluate Integral**
$$A = \\int_{0}^{${L}} (${L}x - x^2) \\, dx = \\left[ \\frac{${L}}{2}x^2 - \\frac{x^3}{3} \\right]_{0}^{${L}}$$
$$= \\left( \\frac{${L}}{2}(${L*L}) - \\frac{${L*L*L}}{3} \\right) - 0 = \\frac{${Math.pow(L, 3)}}{2} - \\frac{${Math.pow(L, 3)}}{3} = ${areaVal}$$`
  };
}

// 10. Average Value of a Function
export function generateAverageValue(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(2, 5);

  // f(x) = 3a x^2 on [0, b]
  // avg = (1/b) int_0^b 3a x^2 dx = (1/b) [a x^3]_0^b = (1/b) (a b^3) = a b^2
  let avgVal = a * b * b;

  let correctLaTeX = `${avgVal}`;
  let distractors = [
    `${avgVal * b}`,
    `${Math.round(avgVal / b)}`,
    `${3 * a * b}`,
    `${avgVal + 2}`,
    '0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the **average value** of the function $f(x) = ${3*a}x^2$ on the interval $[0, ${b}]$.`,
    expressionLaTeX: `f_{\\text{avg}} = \\frac{1}{${b} - 0} \\int_{0}^{${b}} ${3*a}x^2 \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Average value formula: $f_{\\text{avg}} = \\frac{1}{b - a}\\int_a^b f(x) dx$.`,
    explanation: `📌 **Core Concept & Formula:**
**Mean / Average Value of a Continuous Function:**
$$f_{\\text{avg}} = \\frac{1}{b - a} \\int_{a}^{b} f(x) \\, dx$$

**Step 1: Evaluate Definite Integral**
$$\\int_{0}^{${b}} ${3*a}x^2 \\, dx = \\left[ ${a}x^3 \\right]_{0}^{${b}} = ${a}(${b})^3 - 0 = ${a * b * b * b}$$

**Step 2: Divide by Interval Length ($${b} - 0 = ${b}$)**
$$f_{\\text{avg}} = \\frac{1}{${b}} (${a * b * b * b}) = ${avgVal}$$`
  };
}

// 11. Separable Differential Equations
export function generateDifferentialEquation(difficulty) {
  let k = getRandomInt(2, 4);
  let y0 = getRandomInt(1, 3);

  // dy/dx = k x y => dy/y = k x dx => ln|y| = (k/2) x^2 + C => y = y0 e^((k/2) x^2)
  let kHalf = formatFraction(k, 2);
  let correctLaTeX = `y = ${y0}e^{${kHalf}x^2}`;

  let distractors = [
    `y = ${y0}e^{${k}x^2}`,
    `y = e^{${kHalf}x^2} + ${y0 - 1}`,
    `y = \\frac{${k}}{2}x^2 + ${y0}`,
    `y = ${y0}e^{${k}x}`,
    `y = \\sqrt{${k}x^2 + ${y0*y0}}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Solve the separable differential equation with initial condition $y(0) = ${y0}$ (for $y > 0$):`,
    expressionLaTeX: `\\frac{dy}{dx} = ${k}xy, \\quad y(0) = ${y0}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Separate variables: $\\frac{1}{y} dy = ${k}x dx$. Integrate both sides and apply the initial condition $y(0) = ${y0}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Separation of Variables:**
Rewrite as $g(y) dy = f(x) dx$ and integrate both sides.

**Step 1: Separate Variables**
$$\\frac{1}{y} \\, dy = ${k}x \\, dx$$

**Step 2: Integrate Both Sides**
$$\\int \\frac{1}{y} \\, dy = \\int ${k}x \\, dx \\implies \\ln(y) = \\frac{${k}}{2}x^2 + C$$

**Step 3: Exponentiate & Solve for Initial Constant**
$$y(x) = A e^{${kHalf}x^2}, \\quad \\text{where } A = e^C$$
Using $y(0) = ${y0}$:
$$${y0} = A e^0 = A(1) \\implies A = ${y0}$$
$$y(x) = ${correctLaTeX}$$`
  };
}

// 12. Exponential Growth & Decay
export function generateExponentialGrowthDecay(difficulty) {
  let halfLife = getRandomChoice([10, 20, 25, 50]);
  let initialAmt = getRandomChoice([100, 200, 500]);
  let timeElapsed = 2 * halfLife;

  // y(t) = y0 (1/2)^(t / halfLife) => y(2 * halfLife) = y0 / 4
  let remaining = initialAmt / 4;

  let correctLaTeX = `${remaining} \\text{ grams}`;
  let distractors = [
    `${initialAmt / 2} \\text{ grams}`,
    `${initialAmt / 8} \\text{ grams}`,
    `${initialAmt - 50} \\text{ grams}`,
    `${remaining / 2} \\text{ grams}`,
    '0 \\text{ grams}'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `A radioactive substance decays according to the differential equation $\\frac{dy}{dt} = ky$. If the initial mass is $${initialAmt}$ grams and the half-life is $${halfLife}$ years, how much mass remains after $${timeElapsed}$ years?`,
    expressionLaTeX: `\\frac{dy}{dt} = ky, \\quad y(0) = ${initialAmt}, \\; t_{1/2} = ${halfLife}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Every half-life period cuts the quantity in half: $y(t) = y_0 \\left(\\frac{1}{2}\\right)^{t / t_{1/2}}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Exponential Decay Model:**
$$y(t) = y_0 e^{kt} = y_0 \\left(\\frac{1}{2}\\right)^{t / t_{1/2}}$$

**Step 1: Calculate Number of Half-Lives Elapsed**
$$n = \\frac{t}{t_{1/2}} = \\frac{${timeElapsed}}{${halfLife}} = 2 \\text{ half-lives}$$

**Step 2: Compute Remaining Mass**
$$y(${timeElapsed}) = ${initialAmt} \\cdot \\left(\\frac{1}{2}\\right)^2 = ${initialAmt} \\cdot \\frac{1}{4} = ${remaining} \\text{ grams}$$`
  };
}

// 13. Volume of Solid of Revolution (Disk Method)
export function generateVolumeDisk(difficulty) {
  let b = getRandomInt(1, 3);
  // y = sqrt(x) from x = 0 to x = b around x-axis
  // V = pi int_0^b (sqrt(x))^2 dx = pi int_0^b x dx = pi [x^2/2]_0^b = (b^2 / 2) pi
  let volFrac = formatFraction(b * b, 2);
  let correctLaTeX = `${volFrac}\\pi`;

  let distractors = [
    `${b * b}\\pi`,
    `${formatFraction(b * b * b, 3)}\\pi`,
    `${formatFraction(b, 2)}\\pi`,
    `${volFrac}`,
    `${2 * b * b}\\pi`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the volume of the solid generated by revolving the region bounded by $y = \\sqrt{x}$, the $x$-axis, and the line $x = ${b}$ about the $x$-axis.`,
    expressionLaTeX: `V = \\pi \\int_{0}^{${b}} (\\sqrt{x})^2 \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use the Disk Method formula: $V = \\pi \\int_a^b [R(x)]^2 dx$.`,
    explanation: `📌 **Core Concept & Formula:**
**Disk Method (Revolving about the $x$-axis):**
$$V = \\pi \\int_{a}^{b} [R(x)]^2 \\, dx$$

**Step 1: Set Up Integral**
Radius $R(x) = \\sqrt{x}$.
$$V = \\pi \\int_{0}^{${b}} (\\sqrt{x})^2 \\, dx = \\pi \\int_{0}^{${b}} x \\, dx$$

**Step 2: Evaluate**
$$V = \\pi \\left[ \\frac{x^2}{2} \\right]_{0}^{${b}} = \\pi \\left( \\frac{${b}^2}{2} - 0 \\right) = ${correctLaTeX}$$`
  };
}

// 14. Volume of Solid of Revolution (Washer Method)
export function generateVolumeWasher(difficulty) {
  // Region bounded by y = x and y = x^2 revolved around x-axis
  // V = pi int_0^1 (x^2 - (x^2)^2) dx = pi int_0^1 (x^2 - x^4) dx = pi [x^3/3 - x^5/5]_0^1 = pi (1/3 - 1/5) = 2pi/15
  let correctLaTeX = `\\frac{2}{15}\\pi`;
  let distractors = [
    `\\frac{1}{15}\\pi`,
    `\\frac{4}{15}\\pi`,
    `\\frac{1}{3}\\pi`,
    `\\frac{2}{15}`,
    `\\frac{1}{5}\\pi`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the volume of the solid generated by revolving the region bounded by $y = x$ and $y = x^2$ about the $x$-axis.`,
    expressionLaTeX: `V = \\pi \\int_{0}^{1} (x^2 - (x^2)^2) \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use Washer Method: $V = \\pi \\int_a^b (R_{\\text{outer}}^2 - r_{\\text{inner}}^2) dx$ where $R_{\\text{outer}} = x$ and $r_{\\text{inner}} = x^2$.`,
    explanation: `📌 **Core Concept & Formula:**
**Washer Method:**
$$V = \\pi \\int_{a}^{b} \\left( [R(x)]^2 - [r(x)]^2 \\right) \\, dx$$

**Step 1: Identify Radii and Bounds**
Intersection points: $x = x^2 \\implies x(1 - x) = 0 \\implies x \\in [0, 1]$.
On $[0, 1]$, $x \\ge x^2$, so Outer Radius $R(x) = x$ and Inner Radius $r(x) = x^2$.

**Step 2: Evaluate Integral**
$$V = \\pi \\int_{0}^{1} (x^2 - x^4) \\, dx = \\pi \\left[ \\frac{x^3}{3} - \\frac{x^5}{5} \\right]_{0}^{1} = \\pi \\left( \\frac{1}{3} - \\frac{1}{5} \\right) = \\frac{2}{15}\\pi$$`
  };
}

// 15. Riemann Sum Approximation (Trapezoidal Rule from Table)
export function generateRiemannSumAndTrapezoid(difficulty) {
  // Table: x: 0, 2, 4, 6  with y: y0, y1, y2, y3
  let y0 = getRandomInt(2, 5);
  let y1 = getRandomInt(6, 9);
  let y2 = getRandomInt(10, 14);
  let y3 = getRandomInt(4, 8);
  let dx = 2;

  // Trapezoidal Rule: (dx / 2) * (y0 + 2*y1 + 2*y2 + y3)
  let trapSum = (dx / 2) * (y0 + 2 * y1 + 2 * y2 + y3);

  let correctLaTeX = `${trapSum}`;
  let distractors = [
    `${dx * (y0 + y1 + y2)}`, // Left Riemann
    `${dx * (y1 + y2 + y3)}`, // Right Riemann
    `${trapSum + dx * 2}`,
    `${trapSum - dx * 2}`,
    `${(y0 + y1 + y2 + y3)}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `The table below gives values of a continuous function $f(x)$ at selected values of $x$:

$$\\begin{array}{|c|c|c|c|c|} \\hline x & 0 & 2 & 4 & 6 \\\\ \\hline f(x) & ${y0} & ${y1} & ${y2} & ${y3} \\\\ \\hline \\end{array}$$

Use the **Trapezoidal Rule** with three subintervals of equal length $\\Delta x = 2$ to approximate $\\int_{0}^{6} f(x) \\, dx$.`,
    expressionLaTeX: `\\int_{0}^{6} f(x) \\, dx \\approx T_3`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Trapezoidal rule: $T_n = \\frac{\\Delta x}{2} [f(x_0) + 2f(x_1) + 2f(x_2) + f(x_3)]$.`,
    explanation: `📌 **Core Concept & Formula:**
**Trapezoidal Rule:**
$$T_n = \\frac{\\Delta x}{2} \\left( y_0 + 2y_1 + 2y_2 + \\dots + 2y_{n-1} + y_n \\right)$$

**Step 1: Compute using Table Values**
With $\\Delta x = 2$:
$$T_3 = \\frac{2}{2} \\left( ${y0} + 2(${y1}) + 2(${y2}) + ${y3} \\right)$$
$$T_3 = 1 \\cdot (${y0} + ${2*y1} + ${2*y2} + ${y3}) = ${trapSum}$$`
  };
}

// 16. Riemann Sum Limit to Definite Integral Recognition
export function generateRiemannSumLimit(difficulty) {
  let a = getRandomInt(2, 5);

  let correctLaTeX = `\\int_{0}^{1} (${a}x^2 + 1) \\, dx = \\frac{${a}}{3} + 1`;
  let correctChoice = `\\int_{0}^{1} (${a}x^2 + 1) \\, dx`;
  let distract1 = `\\int_{0}^{1} (${a}x + 1) \\, dx`;
  let distract2 = `\\int_{0}^{${a}} (x^2 + 1) \\, dx`;
  let distract3 = `\\int_{0}^{1} ${a}x^2 \\, dx`;
  let distract4 = `\\int_{1}^{2} (${a}x^2 + 1) \\, dx`;

  let distractors = [distract1, distract2, distract3, distract4];
  let choiceData = createChoiceOptions(correctChoice, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Which of the following definite integrals is equivalent to the limit of the Riemann sum:`,
    expressionLaTeX: `\\lim_{n \\to \\infty} \\sum_{i=1}^{n} \\left( ${a}\\left(\\frac{i}{n}\\right)^2 + 1 \\right) \\frac{1}{n}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Identify $\\Delta x = \\frac{1}{n}$ and $x_i = \\frac{i}{n}$ on the interval $[0, 1]$.`,
    explanation: `📌 **Core Concept & Formula:**
**Definite Integral as Limit of Riemann Sums:**
$$\\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i) \\Delta x = \\int_{0}^{1} f(x) \\, dx \\quad \\text{where } \\Delta x = \\frac{1}{n}, \\; x_i = \\frac{i}{n}$$

**Step 1: Match Components**
- $\\Delta x = \\frac{1}{n} \\implies dx$ with interval $[0, 1]$
- Sample points $x_i = \\frac{i}{n} \\implies x$
- Integrand function $f(x) = ${a}x^2 + 1$

**Step 2: Equivalent Integral Form**
$$\\int_{0}^{1} (${a}x^2 + 1) \\, dx$$`
  };
}

// 17. Total Distance vs. Displacement (Net Change Theorem)
export function generateNetChangeTotalDistance(difficulty) {
  // v(t) = 2t - 4 on [0, 4]
  // Root at t = 2
  // Displacement: int_0^4 (2t - 4) dt = [t^2 - 4t]_0^4 = 16 - 16 = 0
  // Total Distance: int_0^2 -(2t - 4) dt + int_2^4 (2t - 4) dt = 4 + 4 = 8
  let root = 2;
  let totalDist = 8;

  let correctLaTeX = `8 \\text{ meters}`;
  let distractors = [
    `0 \\text{ meters}`,
    `4 \\text{ meters}`,
    `16 \\text{ meters}`,
    `12 \\text{ meters}`,
    `-4 \\text{ meters}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `A particle moves along a straight line with velocity $v(t) = 2t - 4$ m/s for $0 \\le t \\le 4$. What is the **total distance traveled** by the particle on this time interval?`,
    expressionLaTeX: `\\text{Total Distance} = \\int_{0}^{4} |v(t)| \\, dt`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Notice that $v(t)$ changes sign at $t = 2$. Total distance is $\\int_0^2 -(2t - 4) dt + \\int_2^4 (2t - 4) dt$.`,
    explanation: `📌 **Core Concept & Formula:**
- **Displacement:** $\\int_{a}^{b} v(t) \\, dt$ (net position change).
- **Total Distance:** $\\int_{a}^{b} |v(t)| \\, dt$ (accounts for backward and forward travel).

**Step 1: Find Where Velocity Changes Sign**
$$v(t) = 2t - 4 = 0 \\implies t = 2$$
- On $[0, 2]$, $v(t) \\le 0$ (moving left).
- On $[2, 4]$, $v(t) \\ge 0$ (moving right).

**Step 2: Split the Absolute Value Integral**
$$\\text{Total Distance} = \\int_{0}^{2} -(2t - 4) \\, dt + \\int_{2}^{4} (2t - 4) \\, dt$$
$$= \\left[ -t^2 + 4t \\right]_{0}^{2} + \\left[ t^2 - 4t \\right]_{2}^{4}$$
$$= (-4 + 8) + ((16 - 16) - (4 - 8)) = 4 + (0 - (-4)) = 4 + 4 = 8 \\text{ meters}$$`
  };
}
