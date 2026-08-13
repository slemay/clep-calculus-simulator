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
    explanation: `📌 **Core Concept & Formula:**
**Fundamental Theorem of Calculus Part 2 (Evaluation Theorem):**
If $f(x)$ is continuous on $[a, b]$ and $F(x)$ is an antiderivative of $f(x)$ (i.e. $F'(x) = f(x)$), then:
$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a) = \\left[ F(x) \\right]_{a}^{b}$$
**Power Rule for Integration:** $\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C$ for any real number $n \\neq -1$.

**Step 1: Find the Antiderivative $F(x)$ Term-by-Term**
- $\\int ${term1}x^2 \\, dx = ${term1} \\cdot \\frac{x^{2+1}}{2+1} = ${term1} \\cdot \\frac{x^3}{3} = ${a}x^3$
- $\\int ${term2}x \\, dx = ${term2} \\cdot \\frac{x^{1+1}}{1+1} = ${term2} \\cdot \\frac{x^2}{2} = ${b}x^2$
The antiderivative function is:
$$F(x) = ${a}x^3 ${b >= 0 ? '+' : ''}${b}x^2$$

**Step 2: Apply the Integration Bounds ($x = 0$ to $x = ${x2}$)**
$$\\int_{0}^{${x2}} \\left(${term1}x^2 ${term2 >= 0 ? '+' : ''}${term2}x\\right) dx = \\left[ ${a}x^3 ${b >= 0 ? '+' : ''}${b}x^2 \\right]_{0}^{${x2}}$$

**Step 3: Evaluate $F(${x2}) - F(0)$**
Evaluate at upper bound $x = ${x2}$:
$$F(${x2}) = ${a}(${x2})^3 + (${b})(${x2})^2 = ${a}(${Math.pow(x2, 3)}) ${b*x2*x2 >= 0 ? '+' : ''}${b*x2*x2} = ${a*Math.pow(x2, 3)} ${b*x2*x2 >= 0 ? '+' : ''}${b*x2*x2} = ${result}$$
Evaluate at lower bound $x = 0$:
$$F(0) = ${a}(0)^3 + (${b})(0)^2 = 0$$
Compute the net value:
$$\\text{Result} = F(${x2}) - F(0) = ${result} - 0 = ${result}$$

⚠️ **Common Pitfall & Pro-Tip:**
When integrating, always remember to divide by the new power ($n+1$), rather than multiplying as in differentiation.`
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
    explanation: `📌 **Core Concept & Formula:**
**Integration by $u$-Substitution (Definite Integrals):**
When making the substitution $u = g(x) \\implies du = g'(x) \\, dx$, transform the limits of integration:
$$\\int_{a}^{b} f(g(x)) g'(x) \\, dx = \\int_{g(a)}^{g(b)} f(u) \\, du$$
Transforming bounds directly eliminates the need to back-substitute to $x$ at the end.

**Step 1: Choose the Substitution Variable $u$**
Let the exponent be $u$:
$$u = ${a}x^2$$

**Step 2: Differentiate to Find $du$**
$$du = \\frac{d}{dx}[${a}x^2] \\, dx = ${twoA}x \\, dx \\implies x \\, dx = \\frac{du}{${twoA}}$$

**Step 3: Convert the Limits of Integration from $x$ to $u$**
- **Lower bound:** At $x = 0 \\implies u = ${a}(0)^2 = 0$
- **Upper bound:** At $x = ${b} \\implies u = ${a}(${b})^2 = ${a}(${b*b}) = ${abSq}$

**Step 4: Rewrite and Evaluate the Integral in Terms of $u$**
$$\\int_{0}^{${b}} x e^{${a}x^2} \\, dx = \\int_{0}^{${abSq}} e^u \\left(\\frac{du}{${twoA}}\\right) = \\frac{1}{${twoA}} \\int_{0}^{${abSq}} e^u \\, du$$
$$\\frac{1}{${twoA}} \\left[ e^u \\right]_{0}^{${abSq}} = \\frac{1}{${twoA}} \\left(e^{${abSq}} - e^0\\right)$$

**Step 5: Simplify**
Since $e^0 = 1$:
$$\\frac{1}{${twoA}} (e^{${abSq}} - 1) = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
1) Remember that $e^0 = 1$ (do not drop the constant term as $0$). 2) Converting limits to $u$ directly ($0 \\to ${abSq}$) prevents error-prone back-substitutions.`
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
    explanation: `📌 **Core Concept & Formula:**
**Fundamental Theorem of Calculus Part 1 (with Chain Rule):**
If $F(x) = \\int_{a}^{g(x)} f(t) \\, dt$, where the lower bound $a$ is constant and the upper bound is a differentiable function $g(x)$, then:
$$\\frac{d}{dx}\\left[\\int_{a}^{g(x)} f(t) \\, dt\\right] = f(g(x)) \\cdot g'(x)$$

**Step 1: Identify Functions & Boundaries**
- Integrand: $f(t) = ${a}t^2 + 1$
- Upper limit function: $g(x) = x^{${power}}$
- Lower limit: $a = 1$ (constant)

**Step 2: Differentiate the Upper Limit $g(x)$**
$$g'(x) = \\frac{d}{dx}[x^{${power}}] = ${power}${pMinus1Str}$$

**Step 3: Substitute $t = g(x) = x^{${power}}$ into $f(t)$**
$$f(g(x)) = ${a}\\left(x^{${power}}\\right)^2 + 1 = ${a}x^{${doublePower}} + 1$$

**Step 4: Multiply by the Derivative of the Bound $g'(x)$**
$$\\frac{d}{dx}\\left[\\int_{1}^{x^{${power}}} (${a}t^2 + 1) \\, dt\\right] = f(g(x)) \\cdot g'(x)$$
$$= (${a}x^{${doublePower}} + 1) \\cdot ${power}${pMinus1Str} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Do not waste time trying to integrate $f(t)$ first! FTC Part 1 allows you to directly differentiate the accumulation function by evaluating $f(g(x)) \\cdot g'(x)$. Forgetting the chain multiplier $g'(x) = ${power}${pMinus1Str}$ is the most common distractor.`
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
    explanation: `📌 **Core Concept & Formula:**
**Area Between Two Curves:**
The area enclosed between two intersecting curves $y = f(x)$ and $y = g(x)$ where $f(x) \\ge g(x)$ on $[a, b]$ is:
$$\\text{Area} = \\int_{a}^{b} \\left( y_{\\text{top}} - y_{\\text{bottom}} \\right) \\, dx = \\int_{a}^{b} (f(x) - g(x)) \\, dx$$

**Step 1: Find Intersection Points (Bounds of Integration)**
Set equations equal:
$${a}x^2 = ${b}x \\implies ${a}x^2 - ${b}x = 0 \\implies x(${a}x - ${b}) = 0$$
The curves intersect at:
$$x = 0 \\quad \\text{and} \\quad x = \\frac{${b}}{${a}}$$

**Step 2: Determine Top vs. Bottom Curve on $\\left[0, \\frac{${b}}{${a}}\\right]$**
Pick a midpoint $x = \\frac{${b}}{2${a}}$:
$$y_{\\text{line}} = ${b}\\left(\\frac{${b}}{2${a}}\\right) = \\frac{${b*b}}{2${a}}$$
$$y_{\\text{parabola}} = ${a}\\left(\\frac{${b}}{2${a}}\\right)^2 = \\frac{${b*b}}{4${a}}$$
Since $\\frac{${b*b}}{2${a}} > \\frac{${b*b}}{4${a}}$, the line $y = ${b}x$ is the upper curve ($y_{\\text{top}}$) and the parabola $y = ${a}x^2$ is the lower curve ($y_{\\text{bottom}}$).

**Step 3: Set Up and Evaluate the Definite Integral**
$$\\text{Area} = \\int_{0}^{\\frac{${b}}{${a}}} \\left( ${b}x - ${a}x^2 \\right) \\, dx$$
Find the antiderivative:
$$\\left[ \\frac{${b}}{2}x^2 - \\frac{${a}}{3}x^3 \\right]_{0}^{\\frac{${b}}{${a}}}$$

**Step 4: Substitute Limits and Simplify Fractions**
$$\\left( \\frac{${b}}{2}\\left(\\frac{${b}}{${a}}\\right)^2 - \\frac{${a}}{3}\\left(\\frac{${b}}{${a}}\\right)^3 \\right) - 0 = \\frac{${b}}{2}\\left(\\frac{${b*b}}{${a*a}}\\right) - \\frac{${a}}{3}\\left(\\frac{${bCubed}}{${a*a*a}}\\right)$$
$$= \\frac{${bCubed}}{2${a*a === 1 ? '' : a*a}} - \\frac{${bCubed}}{3${a*a === 1 ? '' : a*a}} = \\frac{3(${bCubed}) - 2(${bCubed})}{6${a*a === 1 ? '' : a*a}} = \\frac{${bCubed}}{${sixASq}} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Area is always non-negative. Subtracting $y_{\\text{bottom}} - y_{\\text{top}}$ yields a negative result; always take $y_{\\text{top}} - y_{\\text{bottom}}$.`
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
    explanation: `📌 **Core Concept & Formula:**
**Average Value of a Continuous Function:**
The average (mean) value of a continuous function $f(x)$ on $[a, b]$ is defined by:
$$f_{\\text{avg}} = \\frac{1}{b - a} \\int_{a}^{b} f(x) \\, dx$$

**Step 1: Set Up the Average Value Formula**
For $f(x) = ${a === 1 ? '' : a}x^2$ on $[a, b] = [0, ${k}]$:
$$\\text{Interval length: } b - a = ${k} - 0 = ${k}$$
$$f_{\\text{avg}} = \\frac{1}{${k}} \\int_{0}^{${k}} ${a === 1 ? '' : a}x^2 \\, dx$$

**Step 2: Evaluate the Definite Integral**
$$\\int_{0}^{${k}} ${a === 1 ? '' : a}x^2 \\, dx = \\left[ \\frac{${a}}{3}x^3 \\right]_{0}^{${k}} = \\left( \\frac{${a}}{3}(${k})^3 \\right) - 0 = \\frac{${a}}{3}(${k*k*k}) = \\frac{${a*k*k*k}}{3}$$

**Step 3: Multiply by the Factor $\\frac{1}{b - a}$**
$$f_{\\text{avg}} = \\frac{1}{${k}} \\cdot \\left(\\frac{${a*k*k*k}}{3}\\right) = \\frac{${a}}{3}(${k}^2) = \\frac{${aKSq}}{3} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Do not confuse average value $f_{\\text{avg}} = \\frac{1}{b-a}\\int_a^b f(x)dx$ (the average height of the graph) with average rate of change $\\frac{f(b)-f(a)}{b-a}$ (the secant slope). Forgetting the $\\frac{1}{b-a}$ multiplier calculates total area under the curve rather than average value.`
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
    explanation: `📌 **Core Concept & Formula:**
**Separable Differential Equations & Exponential Growth:**
The law of natural growth $\\frac{dy}{dt} = ky$ states that the rate of growth is directly proportional to the current amount $y$.
Its analytical solution via separation of variables is:
$$y(t) = y_0 e^{kt}$$
where $y_0 = y(0)$ is the initial value at $t = 0$.

**Step 1: Separate Variables**
Move all $y$-terms to the left and $t$-terms to the right:
$$\\frac{1}{y} \\, dy = ${k} \\, dt$$

**Step 2: Integrate Both Sides**
$$\\int \\frac{1}{y} \\, dy = \\int ${k} \\, dt$$
$$\\ln|y| = ${k}t + C_1$$

**Step 3: Solve for $y(t)$ via Exponentiation**
$$|y| = e^{${k}t + C_1} = e^{C_1} \\cdot e^{${k}t} \\implies y(t) = C e^{${k}t}$$

**Step 4: Apply Initial Condition $y(0) = ${y0}$**
$$y(0) = C e^{${k}(0)} = C(1) = ${y0} \\implies C = ${y0}$$
Thus, the particular solution is:
$$y(t) = ${y0}e^{${k}t}$$

**Step 5: Evaluate at $t = ${t}$**
$$y(${t}) = ${y0}e^{${k}(${t})} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Recognizing $\\frac{dy}{dt} = ky \\implies y(t) = y(0)e^{kt}$ instantly saves time on CLEP multiple-choice questions without having to carry out separation of variables from scratch.`
  };
}

// 7. U-Substitution with Trigonometric Functions
export function generateUSubTrig(difficulty) {
  let n = getRandomInt(2, 5);
  let a = getRandomInt(2, 5);

  // int sin^n(a x) cos(a x) dx = sin^(n+1)(a x) / (a(n+1)) + C
  let nPlus1 = n + 1;
  let aNPlus1 = a * nPlus1;

  let correctLaTeX = `\\frac{\\sin^{${nPlus1}}(${a}x)}{${aNPlus1}} + C`;
  let distractors = [
    `\\frac{\\cos^{${nPlus1}}(${a}x)}{${aNPlus1}} + C`,
    `\\frac{\\sin^{${nPlus1}}(${a}x)}{${nPlus1}} + C`,
    `-\\frac{\\sin^{${nPlus1}}(${a}x)}{${aNPlus1}} + C`,
    `\\frac{\\sin^{${n}}(${a}x)}{${a}} + C`,
    `${a}\\sin^{${nPlus1}}(${a}x) + C`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the indefinite integral:`,
    expressionLaTeX: `\\int \\sin^{${n}}(${a}x) \\cos(${a}x) \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use substitution with $u = \\sin(${a}x) \\implies du = ${a}\\cos(${a}x) dx$.`,
    explanation: `📌 **Core Concept & Formula:**
**Trigonometric $u$-Substitution:**
When integrating products of trigonometric functions where one function is raised to a power and the other is its derivative (e.g. $\\int [g(x)]^n g'(x) \\, dx$), use substitution:
$$u = g(x) \\implies \\int u^n \\, du = \\frac{u^{n+1}}{n+1} + C$$

**Step 1: Choose Substitution Variable $u$**
Let:
$$u = \\sin(${a}x)$$

**Step 2: Differentiate to Find $du$**
Applying the Chain Rule:
$$du = \\frac{d}{dx}[\\sin(${a}x)] \\, dx = ${a}\\cos(${a}x) \\, dx \\implies \\cos(${a}x) \\, dx = \\frac{du}{${a}}$$

**Step 3: Transform into a Polynomial Integral in $u$**
$$\\int \\sin^{${n}}(${a}x) \\cos(${a}x) \\, dx = \\int u^{${n}} \\left(\\frac{du}{${a}}\\right) = \\frac{1}{${a}} \\int u^{${n}} \\, du$$

**Step 4: Integrate via Power Rule**
$$\\frac{1}{${a}} \\left( \\frac{u^{${n} + 1}}{${n} + 1} \\right) + C = \\frac{u^{${nPlus1}}}{${a}(${nPlus1})} + C = \\frac{u^{${nPlus1}}}{${aNPlus1}} + C$$

**Step 5: Substitute Back $u = \\sin(${a}x)$**
$$\\frac{\\sin^{${nPlus1}}(${a}x)}{${aNPlus1}} + C$$

⚠️ **Common Pitfall & Pro-Tip:**
Do not forget the constant factor $\\frac{1}{${a}}$ coming from $du = ${a}\\cos(${a}x)dx$. Forgetting this factor is a frequent distractor choice.`
  };
}

// 8. Volume of Solid of Revolution (Disk Method)
export function generateVolumeDisk(difficulty) {
  let k = getRandomInt(2, 5);

  // Region bounded by y = sqrt(x), y = 0, x = k revolved about x-axis.
  // V = pi int_0^k (sqrt(x))^2 dx = pi int_0^k x dx = pi [ x^2 / 2 ]_0^k = (k^2 / 2) pi
  let kSq = k * k;
  let correctLaTeX = formatFraction(kSq, 2) + '\\pi';

  let distractors = [
    `${kSq}\\pi`,
    formatFraction(kSq, 3) + '\\pi',
    formatFraction(kSq, 4) + '\\pi',
    formatFraction(k * k * k, 3) + '\\pi',
    `${k}\\pi`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Integral Calculus',
    questionText: `Find the volume of the solid generated when the region bounded by $y = \\sqrt{x}$, $y = 0$, and $x = ${k}$ is revolved about the $x$-axis.`,
    expressionLaTeX: `V = \\pi \\int_{0}^{${k}} (\\sqrt{x})^2 \\, dx`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use the Disk Method formula $V = \\pi \\int_{a}^{b} [f(x)]^2 dx$ with $f(x) = \\sqrt{x}$ from $x = 0$ to $x = ${k}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Volume of Revolution (Disk Method):**
When a 2D region bounded by $y = f(x)$, $y = 0$, $x = a$, and $x = b$ is revolved about the $x$-axis, each cross-section is a circular disk with radius $R(x) = f(x)$ and cross-sectional area $A(x) = \\pi [R(x)]^2$.
The total volume is:
$$V = \\pi \\int_{a}^{b} [R(x)]^2 \\, dx = \\pi \\int_{a}^{b} [f(x)]^2 \\, dx$$

**Step 1: Identify the Radius Function and Limits**
- Axis of revolution: $x$-axis ($y = 0$)
- Radius: $R(x) = \\sqrt{x} - 0 = \\sqrt{x}$
- Integration interval: from $x = 0$ to $x = ${k}$

**Step 2: Set Up the Volume Integral**
$$V = \\pi \\int_{0}^{${k}} (\\sqrt{x})^2 \\, dx = \\pi \\int_{0}^{${k}} x \\, dx$$

**Step 3: Evaluate the Definite Integral**
$$V = \\pi \\left[ \\frac{x^2}{2} \\right]_{0}^{${k}} = \\pi \\left( \\frac{${k}^2}{2} - \\frac{0^2}{2} \\right) = \\pi \\left( \\frac{${kSq}}{2} \\right) = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
1) Remember to square the radius function $R(x)$: $(\\sqrt{x})^2 = x$. 2) Always include the $\\pi$ multiplier in the volume calculation.`
  };
}
