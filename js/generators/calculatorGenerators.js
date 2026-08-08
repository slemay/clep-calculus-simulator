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
    explanation: `Using a graphing or scientific calculator's numerical integration function (e.g. \\texttt{fnInt} or numerical quadrature):
$$\\int_{${a}}^{${b}} \\sqrt{x^3 + ${k}} \\, dx \\approx ${valRounded}$$`
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
    explanation: `Graph $y = x^3 - ${a}x - ${b}$ on a graphing calculator and use the zero/root solver feature in the positive domain.
The positive root is $x \\approx ${rootVal}$.`
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
    explanation: `Total accumulation is given by the integral of the rate of change $R(t)$:
$$\\text{Total Liters} = \\int_{0}^{8} R(t) \\, dt = \\int_{0}^{8} \\left(${baseRate} + ${amp}\\sin\\left(\\frac{\\pi t}{4}\\right)\\right) dt$$
Evaluating numerically or analytically gives:
$$\\int_{0}^{8} ${baseRate} \\, dt + ${amp}\\int_{0}^{8} \\sin\\left(\\frac{\\pi t}{4}\\right) dt = ${baseRate}(8) + 0 = ${totalLiters} \\text{ liters}$$`
  };
}
