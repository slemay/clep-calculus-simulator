/**
 * Dynamic Section 2 Question Generators (Calculator Permitted - 17 Questions)
 * Covers 10+ distinct, authentic calculator-active operations with extreme mode support
 */
import { getRandomInt, getRandomChoice, createChoiceOptions } from './mathUtils.js';

// Numerical integration helper (Simpson's Rule)
function numericalIntegrate(fn, a, b, n = 1000) {
  let h = (b - a) / n;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i++) {
    let x = a + i * h;
    sum += fn(x) * (i % 2 === 0 ? 2 : 4);
  }
  return (h / 3) * sum;
}

// 1. Numerical Definite Integral of Non-Elementary Functions
export function generateNumericalIntegral(difficulty) {
  let variant = getRandomChoice(['sqrt_poly', 'gaussian_exp', 'trig_quad']);
  if (difficulty === 'easy') variant = 'sqrt_poly';

  let a = getRandomInt(0, 1);
  let b = getRandomInt(2, 4);

  let val = 0;
  let exprStr = '';
  let integrandFn = null;

  if (variant === 'gaussian_exp') {
    let k = getRandomChoice([0.25, 0.5, 1.0]);
    exprStr = `\\int_{${a}}^{${b}} e^{-${k === 1.0 ? '' : k}x^2} \\, dx`;
    integrandFn = x => Math.exp(-k * x * x);
  } else if (variant === 'trig_quad') {
    exprStr = `\\int_{${a}}^{${b}} \\sin(x^2) \\, dx`;
    integrandFn = x => Math.sin(x * x);
  } else {
    let k = getRandomChoice([1.5, 2.0, 2.5, 3.0]);
    exprStr = `\\int_{${a}}^{${b}} \\sqrt{x^3 + ${k}} \\, dx`;
    integrandFn = x => Math.sqrt(Math.pow(x, 3) + k);
  }

  val = numericalIntegrate(integrandFn, a, b);
  let valRounded = val.toFixed(3);

  let correctLaTeX = `${valRounded}`;
  let distractors = [
    (val + 0.412).toFixed(3),
    (val - 0.385).toFixed(3),
    (val * 1.25).toFixed(3),
    (val / 1.5).toFixed(3),
    (val + 1.105).toFixed(3)
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus (Calculator Permitted)',
    questionText: `Use a graphing calculator to evaluate the definite integral to three decimal places:`,
    expressionLaTeX: exprStr,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use your calculator's numerical integration tool (e.g. $\\texttt{MATH} \\to \\texttt{9:fnInt}$).`,
    explanation: `📌 **Core Concept & Formula:**
**Numerical Definite Integration:**
Non-elementary integrals are evaluated using graphing calculator numerical integration routines.

**Step 1: Calculator Execution**
- **TI-84 Plus:** Press $\\texttt{MATH} \\to \\texttt{9:fnInt}$.
- Enter lower bound $a = ${a}$, upper bound $b = ${b}$, and the integrand.
- Ensure calculator is in **Radian Mode**.

**Step 2: Three Decimal Place Rounding**
$$\\text{Value} \\approx ${valRounded}$$`
  };
}

// 2. Numerical Root / Zero Finding
export function generateNumericalRoot(difficulty) {
  let a = getRandomInt(2, 5);
  let b = getRandomInt(1, 4);

  let f = x => Math.pow(x, 3) - a * x - b;
  let low = 1, high = 5;
  for (let i = 0; i < 60; i++) {
    let mid = (low + high) / 2;
    if (f(mid) > 0) high = mid;
    else low = mid;
  }
  let rootVal = ((low + high) / 2).toFixed(3);

  let correctLaTeX = `${rootVal}`;
  let distractors = [
    (parseFloat(rootVal) + 0.25).toFixed(3),
    (parseFloat(rootVal) - 0.31).toFixed(3),
    (parseFloat(rootVal) * 0.85).toFixed(3),
    (parseFloat(rootVal) + 1.12).toFixed(3),
    '0.000'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus (Calculator Permitted)',
    questionText: `Using a graphing calculator, find the positive $x$-intercept of the function $f(x) = x^3 - ${a}x - ${b}$ rounded to three decimal places.`,
    expressionLaTeX: `f(x) = x^3 - ${a}x - ${b} = 0`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Graph $Y_1 = X^3 - ${a}X - ${b}$ and use $\\texttt{2nd} \\to \\texttt{TRACE} \\to \\texttt{2:zero}$ for $x > 0$.`,
    explanation: `📌 **Core Concept & Formula:**
**Calculator Zero/Root Finding:**
Finding where $f(x) = 0$ corresponds to finding $x$-intercepts.

**Step 1: Graphing & Solving**
1. Enter $Y_1 = X^3 - ${a}X - ${b}$.
2. Press $\\texttt{2nd} \\to \\texttt{CALC} \\to \\texttt{2:zero}$.
3. Select left bound, right bound, and guess.
$$x \\approx ${rootVal}$$`
  };
}

// 3. Accumulation Rate Word Problem
export function generateAccumulationRate(difficulty) {
  let baseRate = getRandomInt(15, 30);
  let amp = getRandomInt(5, 12);
  let T = 8;

  let totalLiters = (T * baseRate).toFixed(1);

  let correctLaTeX = `${totalLiters}`;
  let distractors = [
    (T * baseRate + amp * 4).toFixed(1),
    (T * baseRate - amp * 2.5).toFixed(1),
    (baseRate + amp).toFixed(1),
    (T * (baseRate + amp)).toFixed(1),
    '0.0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus (Calculator Permitted)',
    questionText: `Water is pumped into a reservoir at a rate of $R(t) = ${baseRate} + ${amp}\\sin\\left(\\frac{\\pi t}{4}\\right)$ liters per hour, where $t$ is measured in hours. How many total liters of water are pumped into the reservoir during the time interval $0 \\le t \\le 8$?`,
    expressionLaTeX: `\\int_{0}^{8} \\left(${baseRate} + ${amp}\\sin\\left(\\frac{\\pi t}{4}\\right)\\right) dt`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Integrate the rate of change function $R(t)$ from $t = 0$ to $t = 8$.`,
    explanation: `📌 **Core Concept & Formula:**
**Net Change Theorem:**
$$\\text{Total Accumulation} = \\int_{t_1}^{t_2} R(t) \\, dt$$

**Step 1: Compute Integral**
$$\\int_{0}^{8} \\left(${baseRate} + ${amp}\\sin\\left(\\frac{\\pi t}{4}\\right)\\right) dt = ${totalLiters} \\text{ liters}$$`
  };
}

// 4. Calculator Numerical Derivative (nDeriv)
export function generateCalcNumericalDerivative(difficulty) {
  let x0 = getRandomChoice([1.5, 2.0, 2.5]);
  // f(x) = ln(x^2 + 1) / e^(0.5x)
  let f = x => Math.log(x * x + 1) / Math.exp(0.5 * x);
  let h = 0.0001;
  let deriv = ((f(x0 + h) - f(x0 - h)) / (2 * h));
  let derivRounded = deriv.toFixed(3);

  let correctLaTeX = `${derivRounded}`;
  let distractors = [
    (deriv + 0.185).toFixed(3),
    (deriv - 0.210).toFixed(3),
    (deriv * 1.5).toFixed(3),
    (-deriv).toFixed(3),
    '0.000'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus (Calculator Permitted)',
    questionText: `Use a calculator to find the value of $f'(${x0})$ for $f(x) = \\frac{\\ln(x^2 + 1)}{e^{0.5x}}$ rounded to three decimal places.`,
    expressionLaTeX: `f'(${x0}) = \\left.\\frac{d}{dx}\\left[ \\frac{\\ln(x^2 + 1)}{e^{0.5x}} \\right]\\right|_{x = ${x0}}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use your calculator's numerical derivative feature (e.g. $\\texttt{MATH} \\to \\texttt{8:nDeriv}$).`,
    explanation: `📌 **Core Concept & Formula:**
**Calculator Numerical Differentiation (nDeriv):**
$$\\texttt{nDeriv}\\left(\\frac{\\ln(X^2+1)}{e^{0.5X}}, X, ${x0}\\right) \\approx ${derivRounded}$$`
  };
}

// 5. Intersection Points & Enclosed Area on Calculator
export function generateCalcIntersectionArea(difficulty) {
  // Area between y1 = 4 - x^2 and y2 = e^x
  // Root 1 approx -1.964, Root 2 approx 1.058
  // Area approx 6.421
  let correctLaTeX = `6.421`;
  let distractors = [
    `5.185`,
    `7.234`,
    `4.890`,
    `8.112`,
    `3.421`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus (Calculator Permitted)',
    questionText: `Using a graphing calculator, find the area of the region completely enclosed between the curves $y = 4 - x^2$ and $y = e^x$ rounded to three decimal places.`,
    expressionLaTeX: `A = \\int_{x_1}^{x_2} (4 - x^2 - e^x) \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `1) Find intersection points $x_1$ and $x_2$ where $4 - x^2 = e^x$. 2) Integrate $\\int_{x_1}^{x_2} (4 - x^2 - e^x) dx$.`,
    explanation: `📌 **Core Concept & Formula:**
**Enclosed Area with Calculator:**
1. Graph $Y_1 = 4 - X^2$ and $Y_2 = e^X$.
2. Use $\\texttt{CALC} \\to \\texttt{5:intersect}$ to find $x_1 \\approx -1.964$ and $x_2 \\approx 1.058$.
3. Compute $\\int_{-1.964}^{1.058} (4 - x^2 - e^x) \\, dx \\approx 6.421$.`
  };
}

// 6. Average Rate of Change vs Instantaneous Rate
export function generateCalcAverageRateVsInstant(difficulty) {
  let a = 1;
  let b = 4;
  // f(x) = x * ln(x + 1)
  let f = x => x * Math.log(x + 1);
  let avgRate = ((f(b) - f(a)) / (b - a)).toFixed(3);

  let correctLaTeX = `${avgRate}`;
  let distractors = [
    (parseFloat(avgRate) + 0.35).toFixed(3),
    (parseFloat(avgRate) - 0.42).toFixed(3),
    (f(b) - f(a)).toFixed(3),
    (parseFloat(avgRate) * 1.5).toFixed(3),
    '1.000'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus (Calculator Permitted)',
    questionText: `Use a calculator to find the **average rate of change** of $f(x) = x\\ln(x + 1)$ on the interval $[${a}, ${b}]$ rounded to three decimal places.`,
    expressionLaTeX: `\\text{Avg Rate} = \\frac{f(${b}) - f(${a})}{${b} - ${a}}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Calculate $\\frac{f(${b}) - f(${a})}{${b} - ${a}}$.`,
    explanation: `📌 **Core Concept & Formula:**
$$\\text{Average Rate of Change} = \\frac{f(b) - f(a)}{b - a}$$

**Step 1: Compute Values**
- $f(${b}) = ${b}\\ln(${b+1}) = ${b}\\ln(5) \\approx ${(b * Math.log(5)).toFixed(4)}$
- $f(${a}) = ${a}\\ln(${a+1}) = 1\\ln(2) \\approx ${(Math.log(2)).toFixed(4)}$

**Step 2: Divide by $b - a = ${b - a}$**
$$\\frac{${(b * Math.log(5)).toFixed(4)} - ${(Math.log(2)).toFixed(4)}}{3} \\approx ${avgRate}$$`
  };
}

// 7. Motion Position from Velocity Integration
export function generateCalcMotionPosition(difficulty) {
  let s0 = getRandomInt(3, 8);
  let T = getRandomChoice([3, 4, 5]);

  // v(t) = sin(t) + sqrt(t)
  // s(T) = s0 + int_0^T (sin(t) + sqrt(t)) dt
  let fn = t => Math.sin(t) + Math.sqrt(t);
  let displacement = numericalIntegrate(fn, 0, T);
  let finalPos = (s0 + displacement).toFixed(3);

  let correctLaTeX = `${finalPos}`;
  let distractors = [
    displacement.toFixed(3),
    (s0 + displacement + 2.15).toFixed(3),
    (s0 + displacement - 1.85).toFixed(3),
    (s0 * 1.5 + displacement).toFixed(3),
    '0.000'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus (Calculator Permitted)',
    questionText: `A particle moves along a straight coordinate line with velocity $v(t) = \\sin(t) + \\sqrt{t}$ for $t \\ge 0$. If the particle's initial position is $s(0) = ${s0}$, what is the position of the particle at time $t = ${T}$?`,
    expressionLaTeX: `s(${T}) = s(0) + \\int_{0}^{${T}} (\\sin(t) + \\sqrt{t}) \\, dt`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Position at time $T$ is $s(T) = s(0) + \\int_0^T v(t) dt$.`,
    explanation: `📌 **Core Concept & Formula:**
**Net Position from Velocity:**
$$s(T) = s(0) + \\int_{0}^{T} v(t) \\, dt$$

**Step 1: Calculator Numerical Integration**
$$s(${T}) = ${s0} + \\int_{0}^{${T}} (\\sin(t) + \\sqrt{t}) \\, dt \\approx ${s0} + ${displacement.toFixed(3)} = ${finalPos}$$`
  };
}

// 8. Volume of Solid of Revolution with Calculator
export function generateCalcVolumeRevolution(difficulty) {
  // y = e^(-x^2) from 0 to 2 revolved around x-axis
  // V = pi int_0^2 e^(-2x^2) dx
  let fn = x => Math.exp(-2 * x * x);
  let intVal = numericalIntegrate(fn, 0, 2);
  let vol = (Math.PI * intVal).toFixed(3);

  let correctLaTeX = `${vol}`;
  let distractors = [
    intVal.toFixed(3),
    (parseFloat(vol) + 0.85).toFixed(3),
    (parseFloat(vol) - 0.72).toFixed(3),
    (parseFloat(vol) * 1.4).toFixed(3),
    '3.142'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus (Calculator Permitted)',
    questionText: `Find the volume of the solid generated by revolving the region bounded by $y = e^{-x^2}$, the $x$-axis, and the lines $x = 0$ and $x = 2$ about the $x$-axis rounded to three decimal places.`,
    expressionLaTeX: `V = \\pi \\int_{0}^{2} (e^{-x^2})^2 \\, dx = \\pi \\int_{0}^{2} e^{-2x^2} \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Compute $V = \\pi \\int_0^2 e^{-2x^2} dx$ using your calculator. Remember to multiply the integral result by $\\pi$.`,
    explanation: `📌 **Core Concept & Formula:**
**Volume by Disk Method:**
$$V = \\pi \\int_{0}^{2} [f(x)]^2 \\, dx = \\pi \\int_{0}^{2} e^{-2x^2} \\, dx \\approx ${vol}$$`
  };
}

// 9. Local Extrema of Transcendental Functions via Calculator Solver
export function generateCalcExtremaTranscendental(difficulty) {
  // Find local max of f(x) = x sin(x) on [0, pi]
  // f'(x) = sin(x) + x cos(x) = 0 => tan(x) = -x => x approx 2.029
  let xMax = '2.029';
  let correctLaTeX = `x \\approx 2.029`;
  let distractors = [
    `x \\approx 1.571`,
    `x \\approx 2.512`,
    `x \\approx 0.865`,
    `x \\approx 3.142`,
    `\\text{No local maximum}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus (Calculator Permitted)',
    questionText: `Using a graphing calculator, find the $x$-value where the function $f(x) = x\\sin(x)$ achieves its local maximum on the interval $[0, \\pi]$ rounded to three decimal places.`,
    expressionLaTeX: `f(x) = x\\sin(x), \\quad x \\in [0, \\pi]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Graph $Y_1 = X\\sin(X)$ in Radian Mode and use $\\texttt{2nd} \\to \\texttt{CALC} \\to \\texttt{4:maximum}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Calculator Maximum Finder:**
1. Graph $Y_1 = X\\sin(X)$ in Radian Mode on $[0, \\pi]$.
2. Use $\\texttt{2nd} \\to \\texttt{CALC} \\to \\texttt{4:maximum}$ to identify the peak at $x \\approx 2.029$.`
  };
}

// 10. Tangent Line Value Approximation
export function generateCalcTangentLineAtPoint(difficulty) {
  let x0 = 1.0;
  // f(x) = x^4 + 2x^2 - 1 => f(1) = 2, f'(x) = 4x^3 + 4x => f'(1) = 8
  // Tangent line: y - 2 = 8(x - 1) => y = 8x - 6
  // Estimate f(1.05) using tangent line: y(1.05) = 8(1.05) - 6 = 8.4 - 6 = 2.400
  let approx = '2.400';
  let correctLaTeX = `2.400`;
  let distractors = [
    `2.482`,
    `2.200`,
    `2.650`,
    `2.000`,
    `3.120`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus (Calculator Permitted)',
    questionText: `Let $f(x) = x^4 + 2x^2 - 1$. What is the tangent line approximation for $f(1.05)$ using the tangent line at $x = 1$?`,
    expressionLaTeX: `L(1.05) = f(1) + f'(1)(1.05 - 1)`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Find $f(1) = 2$ and $f'(1) = 8$. Then $L(1.05) = 2 + 8(0.05)$.`,
    explanation: `📌 **Core Concept & Formula:**
$$L(x) = f(x_0) + f'(x_0)(x - x_0)$$

**Step 1: Compute Values**
- $f(1) = 1^4 + 2(1)^2 - 1 = 2$
- $f'(x) = 4x^3 + 4x \\implies f'(1) = 8$

**Step 2: Evaluate at $x = 1.05$**
$$L(1.05) = 2 + 8(1.05 - 1) = 2 + 8(0.05) = 2 + 0.400 = 2.400$$`
  };
}
