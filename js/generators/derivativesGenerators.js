/**
 * Dynamic Differential Calculus Question Generators (~50% of CLEP Calculus Exam)
 */
import { getRandomInt, getRandomChoice, formatFraction, formatPolynomial, createChoiceOptions } from './mathUtils.js';

// 1. Power Rule & Polynomial Derivative at a Point
export function generatePowerRulePoint(difficulty) {
  let a = getRandomInt(1, 5);
  let b = getRandomInt(-5, 5, true);
  let c = getRandomInt(-9, 9, true);
  let d = getRandomInt(-5, 5);
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
  let polyStr = formatPolynomial([a, b, c, d]);

  return {
    topic: 'Differential Calculus',
    questionText: `If $f(x) = ${polyStr}$, evaluate $f'(${x0})$.`,
    expressionLaTeX: `f'(${x0})`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use the power rule $\\frac{d}{dx}[x^n] = n x^{n-1}$ term-by-term to find $f'(x)$, then plug in $x = ${x0}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Power Rule for Differentiation:** $\\frac{d}{dx}[x^n] = n x^{n-1}$ for any real exponent $n$.
**Linearity of Derivatives:** $\\frac{d}{dx}[c_1 u(x) + c_2 v(x)] = c_1 u'(x) + c_2 v'(x)$ and $\\frac{d}{dx}[C] = 0$.

**Step 1: Differentiate the Polynomial Term-by-Term**
Given $f(x) = ${polyStr}$:
- Differentiate cubic term: $\\frac{d}{dx}[${a}x^3] = ${a} \\cdot 3x^{3-1} = ${3*a}x^2$
- Differentiate quadratic term: $\\frac{d}{dx}[${b}x^2] = ${b} \\cdot 2x^{2-1} = ${2*b}x$
- Differentiate linear term: $\\frac{d}{dx}[${c}x] = ${c}$
- Differentiate constant term: $\\frac{d}{dx}[${d}] = 0$

Combine to obtain the general derivative function $f'(x)$:
$$f'(x) = ${3*a}x^2 ${2*b >= 0 ? '+' : ''}${2*b}x ${c >= 0 ? '+' : ''}${c}$$

**Step 2: Substitute $x = ${x0}$ into $f'(x)$**
$$f'(${x0}) = ${3*a}(${x0})^2 + (${2*b})(${x0}) + (${c})$$
$$f'(${x0}) = ${3*a}(${x0*x0}) ${2*b*x0 >= 0 ? '+' : ''}${2*b*x0} ${c >= 0 ? '+' : ''}${c}$$
$$f'(${x0}) = ${3*a*x0*x0} ${2*b*x0 >= 0 ? '+' : ''}${2*b*x0} ${c >= 0 ? '+' : ''}${c} = ${fPrimeVal}$$

⚠️ **Common Pitfall & Pro-Tip:**
Never plug $x = ${x0}$ into the original function $f(x)$ prior to taking the derivative; differentiating a constant number $f(${x0})$ yields $0$. Always find the general derivative function $f'(x)$ first, and evaluate at $x = ${x0}$ last.`
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
    explanation: `📌 **Core Concept & Formula:**
**Product Rule:** When differentiating the product of two functions $u(x)$ and $v(x)$:
$$\\frac{d}{dx}[u(x) \\cdot v(x)] = u'(x)v(x) + u(x)v'(x)$$

**Step 1: Identify the Component Functions**
Let:
$$u(x) = x^{${n}}$$
$$v(x) = e^{${a}x}$$

**Step 2: Differentiate Each Component**
- By the Power Rule: $u'(x) = \\frac{d}{dx}[x^{${n}}] = ${n}x^{${nMinus1}}$
- By the Chain Rule for exponentials: $v'(x) = \\frac{d}{dx}[e^{${a}x}] = ${a}e^{${a}x}$

**Step 3: Apply the Product Rule Formula**
$$f'(x) = u'(x)v(x) + u(x)v'(x)$$
$$f'(x) = (${n}x^{${nMinus1}})(e^{${a}x}) + (x^{${n}})(${a}e^{${a}x})$$

**Step 4: Factor Out Greatest Common Terms**
Both terms share the common factor $x^{${nMinus1}} e^{${a}x}$:
$$f'(x) = x^{${nMinus1}} e^{${a}x} (${n} + ${a}x)$$

⚠️ **Common Pitfall & Pro-Tip:**
$(u \\cdot v)' \\neq u' \\cdot v'$. Simply multiplying individual derivatives to get $(${n}x^{${nMinus1}})(${a}e^{${a}x})$ is an intentional distractor trap on the exam. Always apply both terms of the product rule.`
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
    `-\\frac{${ab}}{(x + ${b})^2}`,
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
    explanation: `📌 **Core Concept & Formula:**
**Quotient Rule:** For differentiable functions $u(x)$ and $v(x)$ with $v(x) \\neq 0$:
$$\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$$
*(Mnemonic: "Low d-High minus High d-Low, over the square of what's below")*

**Step 1: Identify Numerator and Denominator Functions**
Let:
$$u(x) = ${a}x \\implies u'(x) = ${a}$$
$$v(x) = x + ${b} \\implies v'(x) = 1$$

**Step 2: Apply the Quotient Rule Formula**
$$f'(x) = \\frac{(${a})(x + ${b}) - (${a}x)(1)}{(x + ${b})^2}$$

**Step 3: Expand and Simplify the Numerator**
$$f'(x) = \\frac{${a}x + ${ab} - ${a}x}{(x + ${b})^2}$$
Cancel the opposing terms $${a}x - ${a}x = 0$:
$$f'(x) = \\frac{${ab}}{(x + ${b})^2}$$

⚠️ **Common Pitfall & Pro-Tip:**
Order matters in the numerator: $u'v - uv' \\neq uv' - u'v$. Flipping the order produces an incorrect sign error. Also, never forget to square the denominator.`
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
    explanation: `📌 **Core Concept & Formula:**
**Chain Rule with Natural Logarithms:** If $y = \\ln(u(x))$ where $u(x) > 0$ is differentiable:
$$\\frac{dy}{dx} = \\frac{1}{u(x)} \\cdot u'(x) = \\frac{u'(x)}{u(x)}$$

**Step 1: Identify the Inside (Argument) Function**
Let $u(x) = ${a}x^2 + ${b}$.

**Step 2: Differentiate the Inside Function $u(x)$**
$$u'(x) = \\frac{d}{dx}[${a}x^2 + ${b}] = 2(${a})x + 0 = ${twoA}x$$

**Step 3: Assemble the Derivative via Chain Rule**
$$\\frac{dy}{dx} = \\frac{u'(x)}{u(x)} = \\frac{${twoA}x}{${a}x^2 + ${b}}$$

⚠️ **Common Pitfall & Pro-Tip:**
Forgetting the Chain Rule multiplier $u'(x) = ${twoA}x$ results in the incorrect answer $\\frac{1}{${a}x^2 + ${b}}$. Always multiply by the derivative of the inner expression.`
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
    explanation: `📌 **Core Concept & Formula:**
**Equation of Tangent Line:** The tangent line to $y = f(x)$ at $x = x_0$ is given in point-slope form by:
$$y - y_0 = m(x - x_0)$$
where $(x_0, y_0) = (x_0, f(x_0))$ is the point of tangency, and $m = f'(x_0)$ is the instantaneous slope.

**Step 1: Find the Point of Tangency $(x_0, y_0)$**
Evaluate $f(${x0})$:
$$y_0 = f(${x0}) = ${a}(${x0})^2 + (${b})(${x0}) + (${c})$$
$$y_0 = ${a}(${x0*x0}) ${b*x0 >= 0 ? '+' : ''}${b*x0} ${c >= 0 ? '+' : ''}${c} = ${y0}$$
Thus, the point of tangency is $(${x0}, ${y0})$.

**Step 2: Find the Derivative Function $f'(x)$**
$$f'(x) = \\frac{d}{dx}[${formatPolynomial([a, b, c])}] = ${2*a}x ${b >= 0 ? '+' : ''}${b}$$

**Step 3: Calculate the Slope $m = f'(${x0})$**
Substitute $x = ${x0}$ into $f'(x)$:
$$m = f'(${x0}) = ${2*a}(${x0}) ${b >= 0 ? '+' : ''}${b} = ${2*a*x0} ${b >= 0 ? '+' : ''}${b} = ${m}$$

**Step 4: Formulate the Tangent Line in Slope-Intercept Form ($y = mx + b$)**
Apply point-slope form $y - y_0 = m(x - x_0)$:
$$y - (${y0}) = ${m}(x - ${x0})$$
$$y - ${y0} = ${m}x - ${m*x0}$$
$$y = ${m}x - ${m*x0} + ${y0}$$
$$y = ${m}x ${yIntercept >= 0 ? '+' : ''}${yIntercept}$$

⚠️ **Common Pitfall & Pro-Tip:**
Make sure not to confuse the function value $y_0 = f(${x0}) = ${y0}$ with the tangent slope $m = f'(${x0}) = ${m}$. Always verify by plugging $x = ${x0}$ into your final line equation.`
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
    explanation: `📌 **Core Concept & Formula:**
**Implicit Differentiation:** When $y$ is an implicitly defined function of $x$, differentiate both sides with respect to $x$.
- Use the Chain Rule when differentiating $y$-terms: $\\frac{d}{dx}[y^n] = n y^{n-1} \\frac{dy}{dx}$.
- Use the Product Rule for mixed terms: $\\frac{d}{dx}[x \\cdot y] = (1)y + x\\frac{dy}{dx}$.
- Differentiate constants to $0$: $\\frac{d}{dx}[C] = 0$.

**Step 1: Differentiate Both Sides with Respect to $x$**
$$\\frac{d}{dx}[x^2] + \\frac{d}{dx}[${a}xy] + \\frac{d}{dx}[y^2] = \\frac{d}{dx}[${b}]$$
- $\\frac{d}{dx}[x^2] = 2x$
- $\\frac{d}{dx}[${a}xy] = ${a}\\left(\\frac{d}{dx}[x] \\cdot y + x \\cdot \\frac{d}{dx}[y]\\right) = ${a}\\left(1 \\cdot y + x\\frac{dy}{dx}\\right) = ${a}y + ${a}x\\frac{dy}{dx}$
- $\\frac{d}{dx}[y^2] = 2y\\frac{dy}{dx}$
- $\\frac{d}{dx}[${b}] = 0$

**Step 2: Collect the Differentiated Terms**
$$2x + ${a}y + ${a}x\\frac{dy}{dx} + 2y\\frac{dy}{dx} = 0$$

**Step 3: Factor Out $\\frac{dy}{dx}$ and Move Other Terms**
$$\\left(${a}x + 2y\\right)\\frac{dy}{dx} = -(2x + ${a}y)$$

**Step 4: Isolate $\\frac{dy}{dx}$**
$$\\frac{dy}{dx} = -\\frac{2x + ${a}y}{${a}x + 2y}$$

⚠️ **Common Pitfall & Pro-Tip:**
A common mistake is treating $y$ as a constant in the product $axy$ (writing only $ax\\frac{dy}{dx}$ or $ay$). Always apply the product rule $(u'v + uv')$ to mixed products.`
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
    explanation: `📌 **Core Concept & Formula:**
**Critical Numbers & The Second Derivative Test:**
- A **critical number** of $f$ is a number $c$ where $f'(c) = 0$ or $f'(c)$ does not exist.
- **Second Derivative Test:**
  - If $f'(c) = 0$ and $f''(c) < 0 \\implies$ graph is concave down ($\\cap$) $\\implies$ **Relative Maximum** at $x = c$.
  - If $f'(c) = 0$ and $f''(c) > 0 \\implies$ graph is concave up ($\\cup$) $\\implies$ **Relative Minimum** at $x = c$.

**Step 1: Compute the First Derivative $f'(x)$**
Given $f(x) = x^3 ${bOver2 >= 0 ? '+' : ''}${bOver2 === 0 ? '' : bOver2 + 'x^2'} ${cCoeff >= 0 ? '+' : ''}${cCoeff}x$:
$$f'(x) = 3x^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff}x ${cCoeff >= 0 ? '+' : ''}${cCoeff}$$

**Step 2: Find Critical Numbers ($f'(x) = 0$)**
Factor out the common factor $3$:
$$f'(x) = 3\\left(x^2 - (${x1 + x2})x + (${x1 * x2})\\right) = 3(x - (${x1}))(x - (${x2})) = 0$$
Setting each factor to $0$ gives two critical numbers:
$$x = ${x1} \\quad \\text{and} \\quad x = ${x2}$$

**Step 3: Classify Using the Second Derivative Test**
Compute the second derivative $f''(x)$:
$$f''(x) = \\frac{d}{dx}[3x^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff}x ${cCoeff >= 0 ? '+' : ''}${cCoeff}] = 6x ${bCoeff >= 0 ? '+' : ''}${bCoeff}$$
Evaluate $f''(x)$ at each critical number:
- At $x = ${x1}$: $f''(${x1}) = 6(${x1}) ${bCoeff >= 0 ? '+' : ''}${bCoeff} = ${6*x1 + bCoeff} < 0 \\implies$ **Relative Maximum** at $x = ${x1}$.
- At $x = ${x2}$: $f''(${x2}) = 6(${x2}) ${bCoeff >= 0 ? '+' : ''}${bCoeff} = ${6*x2 + bCoeff} > 0 \\implies$ **Relative Minimum** at $x = ${x2}$.

**Step 4: Conclusion**
The question asks for the $x$-coordinate of the **${typeStr}**, which is $x = ${targetX}$.

⚠️ **Common Pitfall & Pro-Tip:**
Remember that $f''(c) < 0$ corresponds to a **maximum** (concave downward like a frown), and $f''(c) > 0$ corresponds to a **minimum** (concave upward like a cup).`
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
    explanation: `📌 **Core Concept & Formula:**
**Mean Value Theorem (MVT):** If a function $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, there exists at least one value $c \\in (a, b)$ such that:
$$f'(c) = \\frac{f(b) - f(a)}{b - a}$$
*(The instantaneous rate of change at $c$ equals the average rate of change over $[a, b]$)*

**Step 1: Verify MVT Hypotheses**
$f(x) = x^2$ is a polynomial, which is continuous on $[0, ${k}]$ and differentiable on $(0, ${k})$. Thus, MVT applies.

**Step 2: Calculate the Average Rate of Change (Secant Slope)**
Evaluate function values at the endpoints $a = 0$ and $b = ${k}$:
$$f(0) = 0^2 = 0$$
$$f(${k}) = ${k}^2 = ${k*k}$$
$$\\text{Average Rate of Change} = \\frac{f(${k}) - f(0)}{${k} - 0} = \\frac{${k*k} - 0}{${k}} = \\frac{${k*k}}{${k}} = ${k}$$

**Step 3: Compute the Derivative $f'(x)$**
$$f'(x) = \\frac{d}{dx}[x^2] = 2x \\implies f'(c) = 2c$$

**Step 4: Equate and Solve for $c$**
$$f'(c) = \\text{Average Rate of Change}$$
$$2c = ${k} \\implies c = \\frac{${k}}{2} = ${correctLaTeX}$$
Note that $c = ${correctLaTeX}$ lies strictly inside the open interval $(0, ${k})$.

⚠️ **Common Pitfall & Pro-Tip:**
The value of $c$ must be strictly in the OPEN interval $(a, b)$. Endpoints can never be the solution for $c$.`
  };
}

// 9. Related Rates (Area of Expanding Circle or Spherical Balloon)
export function generateRelatedRates(difficulty) {
  let r = getRandomInt(3, 10);
  let drdt = getRandomInt(2, 6);

  // A = pi r^2 => dA/dt = 2 pi r (dr/dt)
  let dAdtCoeff = 2 * r * drdt;
  let correctLaTeX = `${dAdtCoeff}\\pi`;

  let distractors = [
    `${r * drdt}\\pi`,
    `${r * r * drdt}\\pi`,
    `${2 * r}\\pi`,
    `${dAdtCoeff}`,
    `${dAdtCoeff / 2}\\pi`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `The radius $r$ of a circle is expanding at a constant rate of $${drdt}$ cm/s. At what rate is the area of the circle increasing when the radius is $r = ${r}$ cm?`,
    expressionLaTeX: `\\frac{dr}{dt} = ${drdt}, \\quad r = ${r}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use the circle area formula $A = \\pi r^2$ and differentiate with respect to time $t$: $\\frac{dA}{dt} = 2\\pi r \\frac{dr}{dt}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Related Rates via Implicit Differentiation with Respect to Time:**
When two or more related variables are changing over time $t$, differentiate the geometric equation connecting them implicitly with respect to $t$ using the Chain Rule.

**Step 1: Identify the Geometric Formula & Given Quantities**
- Geometric formula for circle area: $A = \\pi r^2$
- Given rate of change of radius: $\\frac{dr}{dt} = ${drdt} \\text{ cm/s}$
- Instantaneous radius: $r = ${r} \\text{ cm}$
- Target quantity: $\\frac{dA}{dt}$

**Step 2: Differentiate with Respect to Time $t$**
Applying the Chain Rule:
$$\\frac{dA}{dt} = \\frac{d}{dt}[\\pi r^2] = \\pi \\cdot \\left(2r \\frac{dr}{dt}\\right) = 2\\pi r \\frac{dr}{dt}$$

**Step 3: Substitute the Instantaneous Values**
Substitute $r = ${r}$ and $\\frac{dr}{dt} = ${drdt}$:
$$\\frac{dA}{dt} = 2\\pi (${r})(${drdt}) = 2 \\cdot ${r} \\cdot ${drdt} \\cdot \\pi = ${dAdtCoeff}\\pi \\text{ cm}^2\\text{/s}$$

⚠️ **Common Pitfall & Pro-Tip:**
Never substitute $r = ${r}$ before differentiating! If you plug in $r = ${r}$ first, $A = \\pi(${r})^2$ becomes a constant, and differentiating gives an incorrect rate of $0$. Always differentiate the general function first.`
  };
}

// 10. Optimization (Maximize Rectangular Area)
export function generateOptimization(difficulty) {
  let perimeter = getRandomInt(4, 12) * 10; // e.g. 80, 100, 120
  // 2x + 2y = perimeter => y = (perimeter/2) - x
  // A(x) = x * ((perimeter/2) - x) = (P/2) x - x^2
  // A'(x) = (P/2) - 2x = 0 => x = P/4
  let halfP = perimeter / 2;
  let maxSide = perimeter / 4;
  let maxArea = maxSide * maxSide;

  let correctLaTeX = `${maxArea}`;
  let distractors = [
    `${maxSide * halfP}`,
    `${maxArea / 2}`,
    `${maxSide * 2}`,
    `${perimeter * 2}`,
    `${maxArea + 50}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `A farmer wants to enclose a rectangular field using $${perimeter}$ meters of fencing. What is the maximum possible area of the field?`,
    expressionLaTeX: `2x + 2y = ${perimeter}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Express the area function $A(x) = x \\cdot (${halfP} - x)$, find its critical point by setting $A'(x) = 0$, and evaluate the area.`,
    explanation: `📌 **Core Concept & Formula:**
**Optimization with Constraints:**
1. Formulate the constraint equation and solve for one variable.
2. Formulate the objective function (the quantity to be maximized) in terms of a single variable.
3. Find critical points by setting the derivative to zero ($A'(x) = 0$).
4. Verify maximum via the Second Derivative Test ($A''(x) < 0$).

**Step 1: Formulate the Perimeter Constraint**
Let $x$ and $y$ denote the length and width of the field:
$$\\text{Perimeter: } 2x + 2y = ${perimeter} \\implies x + y = ${halfP} \\implies y = ${halfP} - x$$

**Step 2: Express Area as a Single-Variable Function**
$$\\text{Area: } A(x) = x \\cdot y = x(${halfP} - x) = ${halfP}x - x^2$$

**Step 3: Find Critical Points by Setting $A'(x) = 0$**
$$A'(x) = \\frac{d}{dx}[${halfP}x - x^2] = ${halfP} - 2x$$
Setting $A'(x) = 0$:
$${halfP} - 2x = 0 \\implies 2x = ${halfP} \\implies x = \\frac{${halfP}}{2} = ${maxSide} \\text{ m}$$

**Step 4: Verify Absolute Maximum**
$$A''(x) = \\frac{d}{dx}[${halfP} - 2x] = -2 < 0$$
Since $A''(x) < 0$ everywhere, $x = ${maxSide}$ yields the unique absolute maximum.

**Step 5: Calculate the Maximum Area**
When $x = ${maxSide}$, $y = ${halfP} - ${maxSide} = ${maxSide} \\text{ m}$.
$$\\text{Maximum Area } = A(${maxSide}) = (${maxSide} \\text{ m})(${maxSide} \\text{ m}) = ${maxArea} \\text{ m}^2$$

⚠️ **Common Pitfall & Pro-Tip:**
For any rectangle with a fixed perimeter $P$, the configuration that maximizes enclosed area is always a square where each side length equals $\\frac{P}{4}$. Area $= \\left(\\frac{P}{4}\\right)^2 = ${maxArea} \\text{ m}^2$.`
  };
}

// 11. Position, Velocity, and Acceleration
export function generatePositionVelocity(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(2, 6);
  let c = getRandomInt(1, 9);
  let t0 = getRandomInt(1, 4);

  // s(t) = a t^3 - b t^2 + c t
  // v(t) = 3a t^2 - 2b t + c
  // a(t) = 6a t - 2b
  let vVal = 3 * a * t0 * t0 - 2 * b * t0 + c;
  let aVal = 6 * a * t0 - 2 * b;

  let isAskingVelocity = getRandomChoice([true, false]);
  let targetVal = isAskingVelocity ? vVal : aVal;
  let targetName = isAskingVelocity ? 'velocity' : 'acceleration';
  let funcSymbol = isAskingVelocity ? `v(${t0})` : `a(${t0})`;

  let correctLaTeX = `${targetVal}`;
  let distractors = [
    `${targetVal + 4}`,
    `${targetVal - 4}`,
    `${isAskingVelocity ? aVal : vVal}`,
    `${a * t0 * t0 * t0 - b * t0 * t0 + c * t0}`,
    '0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `A particle moves along a line with position function $s(t) = ${formatPolynomial([a, -b, c, 0])}$ for $t \\ge 0$. Find the ${targetName} of the particle at time $t = ${t0}$.`,
    expressionLaTeX: `${funcSymbol}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Velocity is $v(t) = s'(t)$ and acceleration is $a(t) = v'(t) = s''(t)$. Differentiate and plug in $t = ${t0}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Rectilinear Motion Derivatives:**
- **Position:** $s(t)$
- **Velocity:** $v(t) = s'(t) = \\frac{ds}{dt}$ (rate of change of position)
- **Acceleration:** $a(t) = v'(t) = s''(t) = \\frac{d^2s}{dt^2}$ (rate of change of velocity)

**Step 1: Find Velocity Function $v(t) = s'(t)$**
Given $s(t) = ${a}t^3 - ${b}t^2 + ${c}t$:
$$v(t) = s'(t) = \\frac{d}{dt}[${a}t^3 - ${b}t^2 + ${c}t] = 3(${a})t^2 - 2(${b})t + ${c} = ${3*a}t^2 - ${2*b}t + ${c}$$

**Step 2: Find Acceleration Function $a(t) = v'(t)$**
$$a(t) = v'(t) = \\frac{d}{dt}[${3*a}t^2 - ${2*b}t + ${c}] = 2(${3*a})t - ${2*b} = ${6*a}t - ${2*b}$$

**Step 3: Evaluate at Time $t = ${t0}$**
${isAskingVelocity ? 
  `To calculate **velocity** $v(${t0})$:
$$v(${t0}) = ${3*a}(${t0})^2 - ${2*b}(${t0}) + ${c}$$
$$v(${t0}) = ${3*a}(${t0*t0}) - ${2*b*t0} + ${c} = ${3*a*t0*t0} - ${2*b*t0} + ${c} = ${vVal}$$` : 
  `To calculate **acceleration** $a(${t0})$:
$$a(${t0}) = ${6*a}(${t0}) - ${2*b}$$
$$a(${t0}) = ${6*a*t0} - ${2*b} = ${aVal}$$`}

⚠️ **Common Pitfall & Pro-Tip:**
Make sure you differentiate the correct number of times: 1 derivative for velocity $v(t)$, 2 derivatives for acceleration $a(t)$. Speed is the absolute magnitude $|v(t)|$.`
  };
}
