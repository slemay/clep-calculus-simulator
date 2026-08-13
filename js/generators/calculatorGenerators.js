/**
 * Dynamic Section 2 Question Generators (Calculator Permitted - 17 Questions)
 */
import { getRandomInt, getRandomChoice, createChoiceOptions } from './mathUtils.js';

// Simpson's / Numerical integration helper for definite integrals
function numericalIntegrate(fn, a, b, n = 1000) {
  let h = (b - a) / n;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i++) {
    let x = a + i * h;
    sum += fn(x) * (i % 2 === 0 ? 2 : 4);
  }
  return (h / 3) * sum;
}

// 1. Numerical Definite Integral of Sin(x^2) or e^(-x^2)
export function generateNumericalIntegral(difficulty) {
  let a = getRandomInt(0, 1);
  let b = getRandomInt(2, 4);
  let k = getRandomChoice([1.5, 2.0, 2.5, 3.0]);

  // f(x) = sqrt(x^3 + k)
  let val = numericalIntegrate(x => Math.sqrt(Math.pow(x, 3) + k), a, b);
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
    questionText: `Use a calculator to evaluate the definite integral to three decimal places:`,
    expressionLaTeX: `\\int_{${a}}^{${b}} \\sqrt{x^3 + ${k}} \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Enter the integrand $y_1 = \\sqrt{x^3 + ${k}}$ into your calculator's numerical integration function with bounds $x = ${a}$ to $x = ${b}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Numerical Definite Integration (Section 2 - Calculator Active):**
Non-elementary integrals (integrands lacking closed-form algebraic antiderivatives) are evaluated numerically using a graphing calculator's built-in numerical quadrature routines (e.g. Adaptive Gauss-Kronrod or Simpson's method).

**Step 1: Identify Integration Limits and Integrand**
- Integrand: $f(x) = \\sqrt{x^3 + ${k}}$
- Lower limit: $a = ${a}$
- Upper limit: $b = ${b}$

**Step 2: Calculator Execution Guide**
- **TI-84 Plus / TI-83 Plus:**
  1. Press $\\texttt{MATH}$, scroll down and select $\\texttt{9:fnInt(}$.
  2. Enter the math template:
     $$\\int_{${a}}^{${b}} \\sqrt{X^3 + ${k}} \\, dX$$
     *(Classic syntax: $\\texttt{fnInt(\\sqrt{}(X\\wedge3 + ${k}), X, ${a}, ${b})}$)*
  3. Press $\\texttt{ENTER}$.
- **TI-Nspire:** Press $\\texttt{menu} \\to \\texttt{4: Calculus} \\to \\texttt{2: Numerical Integral}$.
- **Casio fx-9750 / fx-CG50:** Press $\\texttt{OPTN} \\to \\texttt{CALC} \\to \\texttt{\\int dx}$.

**Step 3: Evaluate & Round to 3 Decimal Places**
The calculator computes:
$$\\int_{${a}}^{${b}} \\sqrt{x^3 + ${k}} \\, dx \\approx ${valRounded}$$

⚠️ **Common Pitfall & Pro-Tip:**
College Board CLEP guidelines require intermediate calculations to maintain maximum precision and final numerical answers to be rounded accurately to **three decimal places** (${valRounded}). Ensure all parentheses under radicals are closed properly.`
  };
}

// 2. Numerical Root / Intersection of Functions
export function generateNumericalRoot(difficulty) {
  let a = getRandomInt(2, 5);
  let b = getRandomInt(1, 4);

  // Find positive root of x^3 - a x - b = 0
  // Function f(x) = x^3 - a x - b
  let f = x => Math.pow(x, 3) - a * x - b;
  // Bisection search
  let low = 1, high = 5;
  for (let i = 0; i < 50; i++) {
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
    expressionLaTeX: `f(x) = x^3 - ${a}x - ${b}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Graph $y = x^3 - ${a}x - ${b}$ on your graphing calculator and use the zero/root feature in the region $x > 0$.`,
    explanation: `📌 **Core Concept & Formula:**
**Finding Roots/Zeros via Graphing Calculator (Section 2 - Calculator Active):**
A zero (or root) of a function $f(x)$ corresponds to the $x$-coordinate where $f(x) = 0$ ($x$-intercept on the coordinate plane).

**Step 1: Set Up the Equation**
Find $x > 0$ such that:
$$x^3 - ${a}x - ${b} = 0$$

**Step 2: Graphing Calculator Step-by-Step Method**
1. **Enter the Function:** Press $\\texttt{Y=}$ and enter $Y_1 = X^3 - ${a}X - ${b}$.
2. **View the Graph:** Press $\\texttt{GRAPH}$. Adjust $\\texttt{WINDOW}$ if needed ($X_{\\min}=0, X_{\\max}=5, Y_{\\min}=-10, Y_{\\max}=20$) to view where the curve crosses the $x$-axis in the positive region $x > 0$.
3. **Calculate the Zero:**
   - Press $\\texttt{2nd} \\to \\texttt{TRACE}$ (to access the $\\texttt{CALC}$ menu).
   - Select $\\texttt{2:zero}$.
   - **Left Bound?:** Position the cursor to the left of the $x$-intercept and press $\\texttt{ENTER}$.
   - **Right Bound?:** Position the cursor to the right of the $x$-intercept and press $\\texttt{ENTER}$.
   - **Guess?:** Move the cursor near the intercept and press $\\texttt{ENTER}$.
4. **Alternative Equation Solver:** Press $\\texttt{MATH} \\to \\texttt{B:Solver}$ (or $\\texttt{Numeric Solver}$), enter $0 = X^3 - ${a}X - ${b}$, set initial guess $X = 2$, and press $\\texttt{SOLVE}$.

**Step 3: Result & Standard Rounding**
The calculator yields the positive root:
$$x \\approx ${rootVal}$$

⚠️ **Common Pitfall & Pro-Tip:**
When equations possess multiple real roots (both positive and negative), ensure your solver guess/bounds isolate the **positive** root as requested in the question prompt.`
  };
}

// 3. Accumulation Rate Word Problem
export function generateAccumulationRate(difficulty) {
  let baseRate = getRandomInt(15, 30);
  let amp = getRandomInt(5, 12);
  let T = 8; // 8 hours

  // Water flows into a tank at rate R(t) = baseRate + amp * sin(pi * t / 4) liters/hour.
  // Total water added from t=0 to t=8 is int_0^8 (baseRate + amp sin(pi t / 4)) dt
  // int_0^8 sin(pi t / 4) dt = [ -4/pi cos(pi t / 4) ]_0^8 = -4/pi (cos(2pi) - cos(0)) = 0
  // So total = 8 * baseRate
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
    hint: `The total accumulation of water is the definite integral of the rate function $R(t)$ from $t = 0$ to $t = 8$.`,
    explanation: `📌 **Core Concept & Formula:**
**Net Change / Total Accumulation Theorem:**
The total quantity accumulated over a time interval $[t_1, t_2]$ is given by the definite integral of the rate of change function $R(t)$:
$$\\text{Total Accumulation} = \\int_{t_1}^{t_2} R(t) \\, dt$$

**Step 1: Set Up the Total Accumulation Integral**
Given rate $R(t) = ${baseRate} + ${amp}\\sin\\left(\\frac{\\pi t}{4}\\right)$ liters/hour over $[0, 8]$ hours:
$$\\text{Total Liters} = \\int_{0}^{8} \\left( ${baseRate} + ${amp}\\sin\\left(\\frac{\\pi t}{4}\\right) \\right) dt$$

**Step 2: Decompose into Constant and Periodic Rates**
$$\\text{Total Liters} = \\int_{0}^{8} ${baseRate} \\, dt + ${amp} \\int_{0}^{8} \\sin\\left(\\frac{\\pi t}{4}\\right) dt$$

**Step 3: Evaluate Each Term**
1. **Constant rate contribution:**
   $$\\int_{0}^{8} ${baseRate} \\, dt = \\left[ ${baseRate}t \\right]_{0}^{8} = ${baseRate}(8) - 0 = ${T * baseRate} \\text{ liters}$$
2. **Periodic sinusoidal contribution:**
   $$\\int_{0}^{8} \\sin\\left(\\frac{\\pi t}{4}\\right) dt = \\left[ -\\frac{4}{\\pi}\\cos\\left(\\frac{\\pi t}{4}\\right) \\right]_{0}^{8}$$
   $$= \\left(-\\frac{4}{\\pi}\\cos\\left(\\frac{8\\pi}{4}\\right)\\right) - \\left(-\\frac{4}{\\pi}\\cos(0)\\right) = -\\frac{4}{\\pi}\\cos(2\\pi) + \\frac{4}{\\pi}\\cos(0) = -\\frac{4}{\\pi}(1) + \\frac{4}{\\pi}(1) = 0$$

**Step 4: Calculate the Total Accumulated Volume**
$$\\text{Total Liters} = ${T * baseRate} + 0 = ${totalLiters} \\text{ liters}$$

**Step 5: Calculator Verification (Section 2)**
Entering $\\texttt{fnInt(${baseRate} + ${amp}*\\sin(\\pi*X/4), X, 0, 8)}$ with calculator in **Radian Mode** verifies $${totalLiters}$$.

⚠️ **Common Pitfall & Pro-Tip:**
1) Total accumulation is the integral of the rate function, NOT simply the rate at the final time $R(8)$. 2) Always ensure your calculator is set to **Radian Mode** when performing calculus operations involving trigonometric functions.`
  };
}
