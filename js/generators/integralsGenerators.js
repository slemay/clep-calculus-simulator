/**
 * Dynamic Integral Calculus Question Generators (~40% of CLEP Calculus Exam)
 */
import { getRandomInt, getRandomChoice, formatFraction, createChoiceOptions } from './mathUtils.js';

// 1. Basic Definite Integral
export function generateDefiniteIntegralPolynomial(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(-4, 4, true);
  let x1 = 0;
  let x2 = getRandomInt(1, 4);

  // int_0^x2 (3a x^2 + 2b x) dx = [a x^3 + b x^2]_0^x2 = a x2^3 + b x2^2
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
    expressionLaTeX: `\\int_{0}^{${x2}} \\left(${term1}x^2 ${term2 >= 0 ? '+' : ''}${term2}x\\right) dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Find the antiderivative $F(x) = ${a}x^3 ${b >= 0 ? '+' : ''}${b}x^2$, then calculate $F(${x2}) - F(0)$.`,
    explanation: `Find the antiderivative:
$$\\int \\left(${term1}x^2 ${term2 >= 0 ? '+' : ''}${term2}x\\right) dx = ${a}x^3 ${b >= 0 ? '+' : ''}${b}x^2 + C$$
Now evaluate from $x = 0$ to $x = ${x2}$:
$$\\left[${a}x^3 ${b >= 0 ? '+' : ''}${b}x^2\\right]_{0}^{${x2}} = \\left(${a}(${x2})^3 + (${b})(${x2})^2\\right) - 0 = ${a}(${Math.pow(x2, 3)}) ${b*x2*x2 >= 0 ? '+' : ''}${b*x2*x2} = ${result}$$`
  };
}

// 2. U-Substitution Exponential Definite Integral
export function generateUSubExponential(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(1, 3);

  // int_0^b x e^(a x^2) dx
  // Let u = a x^2 => du = 2a x dx => x dx = du / (2a)
  // When x=0 => u=0. When x=b => u = a b^2
  // int_0^(a b^2) (1/(2a)) e^u du = (1/(2a)) (e^(a b^2) - 1)
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
    hint: `Let $u = ${a}x^2 \\implies du = 2(${a})x dx$. Remember to update the lower limit ($u(0) = 0$) and upper limit ($u(${b}) = ${a*b*b}$).`,
    explanation: `Use $u$-substitution:
Let $u = ${a}x^2 \\implies du = ${twoA}x dx \\implies x dx = \\frac{du}{${twoA}}$.

Change limits of integration:
- When $x = 0 \\implies u = ${a}(0)^2 = 0$
- When $x = ${b} \\implies u = ${a}(${b})^2 = ${abSq}$

Substitute into the integral:
$$\\int_{0}^{${abSq}} \\frac{1}{${twoA}} e^u du = \\frac{1}{${twoA}} \\left[ e^u \\right]_{0}^{${abSq}} = \\frac{1}{${twoA}} \\left(e^{${abSq}} - e^0\\right) = ${correctLaTeX}$$`
  };
}

// 3. Fundamental Theorem of Calculus Part 1 (Derivative of Accumulation Function)
export function generateFTC1(difficulty) {
  let a = getRandomInt(2, 5);
  let power = getRandomInt(2, 4);

  // d/dx int_1^(x^power) (a t^2 + 1) dt
  // By FTC1 + Chain rule: (a (x^power)^2 + 1) * power x^(power-1)
  // = (a x^(2*power) + 1) * power x^(power-1)
  let pMinus1 = power - 1;
  let pMinus1Str = pMinus1 === 1 ? 'x' : `x^{${pMinus1}}`;
  let doublePower = 2 * power;

  let correctLaTeX = `${power}${pMinus1Str} (${a}x^{${doublePower}} + 1)`;

  let distractors = [
    `${a}x^{${doublePower}} + 1`,
    `${a}x^{2} + 1`,
    `${power}x^{${pMinus1}} (${a}x^{${power}} + 1)`,
    `\\frac{${a}x^{${doublePower+1}}}{${doublePower+1}} + x`,
    `${a*power}x^{${doublePower + pMinus1}}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find $\\frac{d}{dx} \\left[ \\int_{1}^{x^{${power}}} (${a}t^2 + 1) dt \\right]$.`,
    expressionLaTeX: `\\frac{d}{dx}\\left[\\int_{1}^{x^{${power}}} (${a}t^2 + 1) dt\\right]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Apply FTC1 with the Chain Rule: $\\frac{d}{dx}\\left[\\int_a^{g(x)} f(t) dt\\right] = f(g(x)) \\cdot g'(x)$. Here $g(x) = x^{${power}}$.`,
    explanation: `Apply the Fundamental Theorem of Calculus Part 1 combined with the Chain Rule:
$$\\frac{d}{dx}\\left[\\int_{a}^{g(x)} f(t) dt\\right] = f(g(x)) \\cdot g'(x)$$
Here $g(x) = x^{${power}} \\implies g'(x) = ${power}x^{${pMinus1Str}}$, and $f(t) = ${a}t^2 + 1$.

Substitute $t = x^{${power}}$ into $f(t)$:
$$f(g(x)) = ${a}(x^{${power}})^2 + 1 = ${a}x^{${doublePower}} + 1$$
Multiply by $g'(x)$:
$$\\frac{d}{dx}\\left[\\int_{1}^{x^{${power}}} (${a}t^2 + 1) dt\\right] = (${a}x^{${doublePower}} + 1) \\cdot ${power}${pMinus1Str} = ${correctLaTeX}$$`
  };
}

// 4. Area Between Curves
export function generateAreaBetweenCurves(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(2, 5);

  // Area between y = b x and y = a x^2 from x = 0 to x = b/a
  // int_0^(b/a) (b x - a x^2) dx = [ (b/2) x^2 - (a/3) x^3 ]_0^(b/a)
  // = (b/2) (b^2/a^2) - (a/3) (b^3/a^3) = b^3/(2 a^2) - b^3/(3 a^2) = b^3 / (6 a^2)
  let bCubed = b * b * b;
  let sixASq = 6 * a * a;
  let correctLaTeX = formatFraction(bCubed, sixASq);

  let distractors = [
    formatFraction(bCubed, 3 * a * a),
    formatFraction(bCubed, 2 * a * a),
    formatFraction(b * b, 6 * a),
    formatFraction(bCubed, 12 * a * a),
    '0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the area of the region bounded by the curves $y = ${a}x^2$ and $y = ${b}x$.`,
    expressionLaTeX: `y = ${a}x^2, \\quad y = ${b}x`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Find the bounds of integration by setting $y_1 = y_2$, then evaluate $\\int_{0}^{${b}/${a}} (${b}x - ${a}x^2) dx$.`,
    explanation: `1. Find the points of intersection:
$$${a}x^2 = ${b}x \\implies ${a}x^2 - ${b}x = 0 \\implies x(${a}x - ${b}) = 0$$
So the curves intersect at $x = 0$ and $x = \\frac{${b}}{${a}}$.

2. Set up the area integral (upper curve minus lower curve):
$$\\text{Area} = \\int_{0}^{\\frac{${b}}{${a}}} \\left(${b}x - ${a}x^2\\right) dx$$
3. Evaluate the antiderivative:
$$\\left[ \\frac{${b}}{2}x^2 - \\frac{${a}}{3}x^3 \\right]_{0}^{\\frac{${b}}{${a}}} = \\frac{${b}}{2}\\left(\\frac{${b^2}}{${a^2}}\\right) - \\frac{${a}}{3}\\left(\\frac{${bCubed}}{${a*a*a}}\\right) = \\frac{${bCubed}}{2${a^2}} - \\frac{${bCubed}}{3${a^2}} = ${correctLaTeX}$$`
  };
}

// 5. Average Value of a Function
export function generateAverageValue(difficulty) {
  let a = getRandomInt(1, 4);
  let k = getRandomInt(2, 4);

  // f(x) = a x^2 on [0, k]
  // f_avg = (1 / k) int_0^k a x^2 dx = (1 / k) [ (a/3) x^3 ]_0^k = (1/k) (a/3 k^3) = (a / 3) k^2
  let aKSq = a * k * k;
  let correctLaTeX = formatFraction(aKSq, 3);

  let distractors = [
    formatFraction(aKSq, 2),
    `${a * k}`,
    formatFraction(aKSq, 6),
    formatFraction(aKSq, 4),
    `${aKSq}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the average value of $f(x) = ${a === 1 ? '' : a}x^2$ on the interval $[0, ${k}]$.`,
    expressionLaTeX: `f_{avg} = \\frac{1}{${k} - 0} \\int_{0}^{${k}} ${a === 1 ? '' : a}x^2 dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Apply the average value formula: $f_{\\text{avg}} = \\frac{1}{b - a} \\int_{a}^{b} f(x) dx$. Here $a = 0$ and $b = ${k}$.`,
    explanation: `The average value formula is $f_{avg} = \\frac{1}{b - a} \\int_{a}^{b} f(x) dx$.

Here $a = 0, b = ${k}$:
$$f_{avg} = \\frac{1}{${k}} \\int_{0}^{${k}} ${a === 1 ? '' : a}x^2 dx = \\frac{1}{${k}} \\left[ \\frac{${a}}{3}x^3 \\right]_{0}^{${k}} = \\frac{1}{${k}} \\left( \\frac{${a}}{3}(${k}^3) \\right) = ${correctLaTeX}$$`
  };
}

// 6. Basic Differential Equation (Growth/Decay)
export function generateDifferentialEquation(difficulty) {
  let y0 = getRandomInt(10, 50) * 10; // e.g. 200
  let k = getRandomInt(2, 5);
  let t = getRandomInt(1, 4);

  // dy/dt = k y, y(0) = y0 => y(t) = y0 * e^(k t)
  let kt = k * t;
  let correctLaTeX = `${y0}e^{${kt}}`;

  let distractors = [
    `${y0 + k * t}`,
    `${y0}e^{${k}}`,
    `${y0 * k}e^{${t}}`,
    `${y0}e^{${t}}`,
    `${y0} + ${k}t`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Solve the differential equation $\\frac{dy}{dt} = ${k}y$ given the initial condition $y(0) = ${y0}$. What is the value of $y(${t})$?`,
    expressionLaTeX: `\\frac{dy}{dt} = ${k}y, \\quad y(0) = ${y0}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `The solution to $\\frac{dy}{dt} = k y$ is $y(t) = y(0) e^{k t}$. Plug in $y(0) = ${y0}$, $k = ${k}$, and $t = ${t}$.`,
    explanation: `Separate variables and integrate:
$$\\frac{1}{y} dy = ${k} dt \\implies \\int \\frac{1}{y} dy = \\int ${k} dt \\implies \\ln|y| = ${k}t + C \\implies y(t) = C e^{${k}t}$$
Apply initial condition $y(0) = ${y0} \\implies C = ${y0}$.
Thus $y(t) = ${y0}e^{${k}t}$.
At $t = ${t}$: $y(${t}) = ${y0}e^{${k}(${t})} = ${correctLaTeX}$.`
  };
}
