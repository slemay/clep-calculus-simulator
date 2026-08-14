/**
 * Dynamic Differential Calculus Question Generators (~50% of CLEP Calculus Exam)
 * Covers 19+ distinct, highly varied generators and archetypes with extreme mode support
 */
import { getRandomInt, getRandomChoice, formatFraction, formatPolynomial, createChoiceOptions, gcd } from './mathUtils.js';

// 1. Power Rule & Polynomial Derivative at a Point (including negative & fractional powers)
export function generatePowerRulePoint(difficulty) {
  let subType = getRandomChoice(['poly', 'radical_fractional', 'negative_power']);
  if (difficulty === 'easy') subType = 'poly';

  if (subType === 'radical_fractional') {
    // f(x) = a sqrt(x) + b x^(3/2) => f'(x) = a/(2 sqrt(x)) + 3b/2 sqrt(x)
    let a = 2 * getRandomInt(1, 4);
    let b = 2 * getRandomInt(1, 3);
    let x0 = getRandomChoice([4, 9, 16]);
    let sqrtX0 = Math.sqrt(x0);

    let val1 = (a / 2) / sqrtX0;
    let val2 = (3 * b / 2) * sqrtX0;
    let totalNum = a + 3 * b * x0;
    let totalDen = 2 * sqrtX0;
    let correctLaTeX = formatFraction(totalNum, totalDen);

    let distractors = [
      formatFraction(totalNum - 2, totalDen),
      formatFraction(totalNum + 4, totalDen),
      formatFraction(a * sqrtX0 + b * x0 * sqrtX0, 1),
      '0',
      formatFraction(totalNum, 4 * sqrtX0)
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `If $f(x) = ${a}\\sqrt{x} + ${b}x^{3/2}$, evaluate $f'(${x0})$.`,
      expressionLaTeX: `f'(${x0})`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Rewrite roots as fractional powers: $\\sqrt{x} = x^{1/2}$ and use the power rule $\\frac{d}{dx}[x^n] = n x^{n-1}$.`,
      explanation: `📌 **Core Concept & Formula:**
**Power Rule with Rational Exponents:**
$$\\frac{d}{dx}[x^n] = n x^{n-1}$$
$$\\frac{d}{dx}[x^{1/2}] = \\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}, \\quad \\frac{d}{dx}[x^{3/2}] = \\frac{3}{2}x^{1/2} = \\frac{3}{2}\\sqrt{x}$$

**Step 1: Compute General Derivative $f'(x)$**
$$f'(x) = ${a} \\cdot \\left(\\frac{1}{2\\sqrt{x}}\\right) + ${b} \\cdot \\left(\\frac{3}{2}\\sqrt{x}\\right) = \\frac{${a/2}}{\\sqrt{x}} + ${3*b/2}\\sqrt{x}$$

**Step 2: Evaluate at $x = ${x0}$**
$$f'(${x0}) = \\frac{${a/2}}{\\sqrt{${x0}}} + ${3*b/2}\\sqrt{${x0}} = \\frac{${a/2}}{${sqrtX0}} + ${3*b/2}(${sqrtX0}) = ${formatFraction(a/2, sqrtX0)} + ${(3*b/2)*sqrtX0} = ${correctLaTeX}$$`
    };
  } else if (subType === 'negative_power') {
    // f(x) = a / x + b / x^2 => f'(x) = -a / x^2 - 2b / x^3
    let a = getRandomInt(1, 5);
    let b = getRandomInt(1, 4);
    let x0 = getRandomChoice([1, 2, 3]);

    let fPrimeNum = -a * x0 - 2 * b;
    let fPrimeDen = Math.pow(x0, 3);
    let correctLaTeX = formatFraction(fPrimeNum, fPrimeDen);

    let distractors = [
      formatFraction(-fPrimeNum, fPrimeDen),
      formatFraction(fPrimeNum + 1, fPrimeDen),
      formatFraction(a * x0 + b, fPrimeDen),
      '0',
      formatFraction(fPrimeNum, x0 * x0)
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `If $f(x) = \\frac{${a}}{x} + \\frac{${b}}{x^2}$, find $f'(${x0})$.`,
      expressionLaTeX: `f'(${x0})`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Rewrite terms as negative powers: $\\frac{${a}}{x} = ${a}x^{-1}$ and $\\frac{${b}}{x^2} = ${b}x^{-2}$.`,
      explanation: `📌 **Core Concept & Formula:**
$$\\frac{d}{dx}[x^{-n}] = -n x^{-(n+1)} = -\\frac{n}{x^{n+1}}$$

**Step 1: Find $f'(x)$**
$$f(x) = ${a}x^{-1} + ${b}x^{-2} \\implies f'(x) = -${a}x^{-2} - ${2*b}x^{-3} = -\\frac{${a}}{x^2} - \\frac{${2*b}}{x^3}$$

**Step 2: Evaluate at $x = ${x0}$**
$$f'(${x0}) = -\\frac{${a}}{${x0*x0}} - \\frac{${2*b}}{${Math.pow(x0, 3)}} = ${correctLaTeX}$$`
    };
  } else {
    // Polynomial
    let a = getRandomInt(1, difficulty === 'extreme' ? 7 : 5);
    let b = getRandomInt(-5, 5, true);
    let c = getRandomInt(-9, 9, true);
    let d = getRandomInt(-5, 5);
    let x0 = getRandomInt(-3, 3, true);

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
      hint: `Use the power rule term-by-term on $f(x)$, then substitute $x = ${x0}$.`,
      explanation: `📌 **Core Concept & Formula:**
**Power Rule:** $\\frac{d}{dx}[x^n] = n x^{n-1}$.

**Step 1: Differentiate Term-by-Term**
$$f'(x) = ${3*a}x^2 ${2*b >= 0 ? '+' : ''}${2*b}x ${c >= 0 ? '+' : ''}${c}$$

**Step 2: Substitute $x = ${x0}$**
$$f'(${x0}) = ${3*a}(${x0})^2 + (${2*b})(${x0}) + (${c}) = ${fPrimeVal}$$`
    };
  }
}

// 2. Product Rule Derivative (with Trig, Exponentials, and Logarithms)
export function generateProductRule(difficulty) {
  let variant = getRandomChoice(['poly_exp', 'poly_trig', 'poly_log', 'exp_trig']);
  if (difficulty === 'easy') variant = 'poly_exp';

  if (variant === 'poly_trig') {
    let n = getRandomInt(2, 4);
    let a = getRandomInt(2, 5);
    let nMinus1 = n - 1;
    let pStr = nMinus1 === 1 ? 'x' : `x^{${nMinus1}}`;

    let correctLaTeX = `${pStr} (${n}\\sin(${a}x) + ${a}x\\cos(${a}x))`;
    let distractors = [
      `${n}x^{${nMinus1}} \\sin(${a}x)`,
      `${a}x^{${n}} \\cos(${a}x)`,
      `${pStr} (${n}\\cos(${a}x) - ${a}x\\sin(${a}x))`,
      `${n}x^{${nMinus1}} (${a}\\cos(${a}x))`,
      `x^{${n}} \\sin(${a}x)`
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `Find the derivative of $f(x) = x^{${n}} \\sin(${a}x)$.`,
      expressionLaTeX: `\\frac{d}{dx}\\left[x^{${n}} \\sin(${a}x)\\right]`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Use the Product Rule: $\\frac{d}{dx}[uv] = u'v + uv'$ where $u = x^{${n}}$ and $v = \\sin(${a}x)$.`,
      explanation: `📌 **Core Concept & Formula:**
**Product Rule:** $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$.
**Chain Rule for Trig:** $\\frac{d}{dx}[\\sin(${a}x)] = ${a}\\cos(${a}x)$.

**Step 1: Identify Functions & Derivatives**
$$u(x) = x^{${n}} \\implies u'(x) = ${n}x^{${nMinus1}}$$
$$v(x) = \\sin(${a}x) \\implies v'(x) = ${a}\\cos(${a}x)$$

**Step 2: Combine and Factor**
$$f'(x) = ${n}x^{${nMinus1}}\\sin(${a}x) + x^{${n}}(${a}\\cos(${a}x)) = ${correctLaTeX}$$`
    };
  } else if (variant === 'poly_log') {
    let n = getRandomInt(2, 4);
    let nMinus1 = n - 1;
    let pStr = nMinus1 === 1 ? 'x' : `x^{${nMinus1}}`;

    let correctLaTeX = `${pStr} (${n}\\ln(x) + 1)`;
    let distractors = [
      `${n}x^{${nMinus1}} \\ln(x)`,
      `x^{${nMinus1}}`,
      `${n}x^{${nMinus1}} \\cdot \\frac{1}{x}`,
      `${pStr} (${n}\\ln(x) - 1)`,
      `${n}x^{${n}}`
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `Find the derivative of $f(x) = x^{${n}} \\ln(x)$ for $x > 0$.`,
      expressionLaTeX: `\\frac{d}{dx}\\left[x^{${n}} \\ln(x)\\right]`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Apply the Product Rule: $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$ with $\\frac{d}{dx}[\\ln(x)] = \\frac{1}{x}$.`,
      explanation: `📌 **Core Concept & Formula:**
$$\\frac{d}{dx}[u \\cdot v] = u'v + uv'$$

**Step 1: Differentiate**
$$u = x^{${n}} \\implies u' = ${n}x^{${nMinus1}}$$
$$v = \\ln(x) \\implies v' = \\frac{1}{x}$$

**Step 2: Combine and Simplify**
$$f'(x) = (${n}x^{${nMinus1}})\\ln(x) + (x^{${n}})\\left(\\frac{1}{x}\\right) = ${n}x^{${nMinus1}}\\ln(x) + x^{${nMinus1}} = ${correctLaTeX}$$`
    };
  } else {
    // poly_exp
    let n = getRandomInt(2, 4);
    let a = getRandomInt(2, 5);
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
$$\\frac{d}{dx}[u(x)v(x)] = u'(x)v(x) + u(x)v'(x)$$

**Step 1: Compute Components**
$$u'(x) = ${n}x^{${nMinus1}}, \\quad v'(x) = ${a}e^{${a}x}$$

**Step 2: Combine and Factor**
$$f'(x) = ${n}x^{${nMinus1}}e^{${a}x} + ${a}x^{${n}}e^{${a}x} = ${correctLaTeX}$$`
    };
  }
}

// 3. Quotient Rule Derivative (Trig, Rational, Exponentials)
export function generateQuotientRule(difficulty) {
  let variant = getRandomChoice(['linear_rational', 'poly_exp', 'trig_quotient']);
  if (difficulty === 'easy') variant = 'linear_rational';

  if (variant === 'trig_quotient') {
    let a = getRandomInt(2, 5);
    // f(x) = sin(x) / (x + a) => f'(x) = ((x+a)cos(x) - sin(x)) / (x+a)^2
    let correctLaTeX = `\\frac{(x + ${a})\\cos(x) - \\sin(x)}{(x + ${a})^2}`;
    let distractors = [
      `\\frac{(x + ${a})\\cos(x) + \\sin(x)}{(x + ${a})^2}`,
      `\\frac{\\cos(x)}{1}`,
      `\\frac{\\cos(x)}{(x + ${a})^2}`,
      `\\frac{\\sin(x) - (x + ${a})\\cos(x)}{(x + ${a})^2}`,
      `\\frac{\\cos(x)}{(x + ${a})}`
    ];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `Find the derivative of $f(x) = \\frac{\\sin(x)}{x + ${a}}$.`,
      expressionLaTeX: `\\frac{d}{dx}\\left[\\frac{\\sin(x)}{x + ${a}}\\right]`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Use the Quotient Rule: $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$.`,
      explanation: `📌 **Core Concept & Formula:**
**Quotient Rule:** $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$.

**Step 1: Set Up Components**
$$u = \\sin(x) \\implies u' = \\cos(x)$$
$$v = x + ${a} \\implies v' = 1$$

**Step 2: Apply Formula**
$$f'(x) = \\frac{\\cos(x)(x + ${a}) - \\sin(x)(1)}{(x + ${a})^2} = ${correctLaTeX}$$`
    };
  } else {
    // Linear rational: (ax + b) / (cx + d) => derivative = (ad - bc) / (cx + d)^2
    let a = getRandomInt(2, 6);
    let b = getRandomInt(-5, 5, true);
    let c = getRandomInt(1, 4);
    let d = getRandomInt(1, 6);

    let det = a * d - b * c;
    if (det === 0) {
      d += 1;
      det = a * d - b * c;
    }

    let correctLaTeX = `\\frac{${det}}{(${c === 1 ? 'x' : `${c}x`} + ${d})^2}`;
    let distractors = [
      `\\frac{${a * d + b * c}}{(${c === 1 ? 'x' : `${c}x`} + ${d})^2}`,
      `\\frac{${det}}{${c === 1 ? 'x' : `${c}x`} + ${d}}`,
      `\\frac{${a}}{${c}}`,
      `\\frac{-${det}}{(${c === 1 ? 'x' : `${c}x`} + ${d})^2}`,
      `\\frac{${b * c - a * d}}{(${c === 1 ? 'x' : `${c}x`} + ${d})^2}`
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    let numStr = `${a}x ${b >= 0 ? '+' : ''}${b}`;
    let denStr = `${c === 1 ? 'x' : `${c}x`} + ${d}`;

    return {
      topic: 'Differential Calculus',
      questionText: `Find the derivative of $f(x) = \\frac{${numStr}}{${denStr}}$.`,
      expressionLaTeX: `\\frac{d}{dx}\\left[\\frac{${numStr}}{${denStr}}\\right]`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Apply Quotient Rule: $\\frac{u'v - uv'}{v^2}$ with $u = ${numStr}$ and $v = ${denStr}$.`,
      explanation: `📌 **Core Concept & Formula:**
$$\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$$

**Step 1: Compute Derivatives of Numerator & Denominator**
$$u' = ${a}, \\quad v' = ${c}$$

**Step 2: Combine in Quotient Rule**
$$f'(x) = \\frac{${a}(${denStr}) - (${numStr})(${c})}{(${denStr})^2} = \\frac{${a*c}x + ${a*d} - (${a*c}x ${b*c >= 0 ? '+' : ''}${b*c})}{(${denStr})^2} = \\frac{${det}}{(${denStr})^2}$$`
    };
  }
}

// 4. Chain Rule (Nested Radicals, Trig, Exponentials)
export function generateChainRule(difficulty) {
  let variant = getRandomChoice(['sqrt_poly', 'cos_exp', 'exp_poly', 'power_poly']);
  if (difficulty === 'extreme') variant = getRandomChoice(['nested_trig_exp', 'sqrt_poly', 'power_poly']);

  if (variant === 'sqrt_poly') {
    let a = getRandomInt(2, 5);
    let b = getRandomInt(1, 9);
    // f(x) = sqrt(a x^2 + b) => f'(x) = a x / sqrt(a x^2 + b)
    let correctLaTeX = `\\frac{${a}x}{\\sqrt{${a}x^2 + ${b}}}`;
    let distractors = [
      `\\frac{1}{2\\sqrt{${a}x^2 + ${b}}}`,
      `\\frac{${2*a}x}{\\sqrt{${a}x^2 + ${b}}}`,
      `\\frac{${a}x}{2\\sqrt{${a}x^2 + ${b}}}`,
      `${a}x\\sqrt{${a}x^2 + ${b}}`,
      `\\frac{1}{\\sqrt{${a}x^2 + ${b}}}`
    ];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `Find the derivative of $f(x) = \\sqrt{${a}x^2 + ${b}}$.`,
      expressionLaTeX: `\\frac{d}{dx}\\left[\\sqrt{${a}x^2 + ${b}}\\right]`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Let $u = ${a}x^2 + ${b}$ and write $f(x) = u^{1/2}$. Apply Chain Rule: $\\frac{d}{dx}[u^{1/2}] = \\frac{1}{2\\sqrt{u}} \\cdot u'$.`,
      explanation: `📌 **Core Concept & Formula:**
**Chain Rule:** $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$.

**Step 1: Identify Outer and Inner Functions**
- Outer: $f(u) = \\sqrt{u} = u^{1/2} \\implies f'(u) = \\frac{1}{2\\sqrt{u}}$
- Inner: $u(x) = ${a}x^2 + ${b} \\implies u'(x) = ${2*a}x$

**Step 2: Multiply by Inner Derivative**
$$\\frac{d}{dx}[\\sqrt{${a}x^2 + ${b}}] = \\frac{1}{2\\sqrt{${a}x^2 + ${b}}} \\cdot (${2*a}x) = \\frac{${a}x}{\\sqrt{${a}x^2 + ${b}}}$$`
    };
  } else if (variant === 'cos_exp') {
    let a = getRandomInt(2, 5);
    // f(x) = cos(e^(a x)) => f'(x) = -a e^(a x) sin(e^(a x))
    let correctLaTeX = `-${a}e^{${a}x} \\sin(e^{${a}x})`;
    let distractors = [
      `-\\sin(e^{${a}x})`,
      `${a}e^{${a}x} \\sin(e^{${a}x})`,
      `-${a}\\sin(e^{${a}x})`,
      `-e^{${a}x} \\sin(e^{${a}x})`,
      `${a}e^{${a}x} \\cos(e^{${a}x})`
    ];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `Find the derivative of $f(x) = \\cos(e^{${a}x})$.`,
      expressionLaTeX: `\\frac{d}{dx}\\left[\\cos(e^{${a}x})\\right]`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Differentiate the outer function $\\cos(u) \\to -\\sin(u)$, then multiply by the derivative of the inside $u = e^{${a}x}$.`,
      explanation: `📌 **Core Concept & Formula:**
$$\\frac{d}{dx}[\\cos(u(x))] = -\\sin(u(x)) \\cdot u'(x)$$

**Step 1: Differentiate Inside Function**
$$u(x) = e^{${a}x} \\implies u'(x) = ${a}e^{${a}x}$$

**Step 2: Apply Chain Rule**
$$f'(x) = -\\sin(e^{${a}x}) \\cdot (${a}e^{${a}x}) = ${correctLaTeX}$$`
    };
  } else {
    // power_poly: (ax^3 + bx)^n
    let a = getRandomInt(1, 3);
    let b = getRandomInt(1, 4);
    let n = getRandomInt(3, 5);
    let nMinus1 = n - 1;

    let correctLaTeX = `${n}(${3*a}x^2 + ${b})(${a === 1 ? '' : a}x^3 + ${b}x)^{${nMinus1}}`;
    let distractors = [
      `${n}(${a === 1 ? '' : a}x^3 + ${b}x)^{${nMinus1}}`,
      `(${3*a}x^2 + ${b})(${a === 1 ? '' : a}x^3 + ${b}x)^{${nMinus1}}`,
      `${n}(${3*a}x^2)(${a === 1 ? '' : a}x^3 + ${b}x)^{${nMinus1}}`,
      `${n}(${a === 1 ? '' : a}x^3 + ${b}x)^{${n}}`,
      `${3*a}x^2 + ${b}`
    ];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `Find the derivative of $f(x) = (${a === 1 ? '' : a}x^3 + ${b}x)^{${n}}$.`,
      expressionLaTeX: `\\frac{d}{dx}\\left[(${a === 1 ? '' : a}x^3 + ${b}x)^{${n}}\\right]`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Use Generalized Power Rule: $\\frac{d}{dx}[u^n] = n u^{n-1} \\cdot u'$.`,
      explanation: `📌 **Core Concept & Formula:**
$$\\frac{d}{dx}[u(x)^n] = n u(x)^{n-1} u'(x)$$

**Step 1: Inner Function Derivative**
$$u(x) = ${a === 1 ? '' : a}x^3 + ${b}x \\implies u'(x) = ${3*a}x^2 + ${b}$$

**Step 2: Apply Chain Rule**
$$f'(x) = ${n}(${a === 1 ? '' : a}x^3 + ${b}x)^{${nMinus1}} \\cdot (${3*a}x^2 + ${b}) = ${correctLaTeX}$$`
    };
  }
}

// 5. Tangent & Normal Line Equations
export function generateTangentLine(difficulty) {
  let isNormal = (difficulty === 'hard' || difficulty === 'extreme') && Math.random() > 0.5;
  let a = getRandomInt(1, 3);
  let b = getRandomInt(-4, 4);
  let c = getRandomInt(-5, 5);
  let x0 = getRandomInt(-2, 3);

  // f(x) = a x^2 + b x + c
  // y0 = a x0^2 + b x0 + c
  // m_tan = 2a x0 + b
  let y0 = a * x0 * x0 + b * x0 + c;
  let mTan = 2 * a * x0 + b;
  if (mTan === 0) {
    x0 += 1;
    y0 = a * x0 * x0 + b * x0 + c;
    mTan = 2 * a * x0 + b;
  }

  let slope = isNormal ? formatFraction(-1, mTan) : `${mTan}`;
  let lineType = isNormal ? 'normal' : 'tangent';

  // y - y0 = m (x - x0) => y = m x - m x0 + y0
  let correctLaTeX = '';
  if (!isNormal) {
    let yInt = y0 - mTan * x0;
    correctLaTeX = `y = ${mTan === 1 ? '' : (mTan === -1 ? '-' : mTan)}x ${yInt >= 0 ? '+' : ''}${yInt}`;
  } else {
    // normal line
    correctLaTeX = `y - (${y0}) = -\\frac{1}{${mTan}}(x - (${x0}))`;
  }

  let distractors = [
    `y = ${-mTan}x + ${y0 + mTan * x0}`,
    `y = ${2 * a}x + ${b}`,
    `y = ${mTan}x - ${y0}`,
    `y - (${y0}) = ${mTan}(x - (${x0}))`,
    `y = ${y0}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);
  let polyStr = formatPolynomial([a, b, c]);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the equation of the **${lineType} line** to the curve $y = ${polyStr}$ at the point where $x = ${x0}$.`,
    expressionLaTeX: `y = ${polyStr}, \\quad x = ${x0}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `1) Find $y_0 = f(${x0})$. 2) Find slope $m = f'(${x0})$. ${isNormal ? '3) Normal slope is $m_{\\text{norm}} = -1/m_{\\text{tan}}$.' : ''} 4) Use point-slope form $y - y_0 = m(x - x_0)$.`,
    explanation: `📌 **Core Concept & Formula:**
- **Tangent Line Slope:** $m_{\\text{tan}} = f'(x_0)$.
- **Normal Line Slope:** $m_{\\text{norm}} = -\\frac{1}{f'(x_0)}$ (perpendicular slope).
- **Point-Slope Form:** $y - y_0 = m(x - x_0)$.

**Step 1: Compute Point $(x_0, y_0)$**
$$y_0 = f(${x0}) = ${a}(${x0})^2 ${b >= 0 ? '+' : ''}${b}(${x0}) ${c >= 0 ? '+' : ''}${c} = ${y0}$$

**Step 2: Compute Derivative & Slope**
$$f'(x) = ${2*a}x ${b >= 0 ? '+' : ''}${b} \\implies f'(${x0}) = ${2*a}(${x0}) ${b >= 0 ? '+' : ''}${b} = ${mTan}$$
${isNormal ? `**Step 3: Compute Perpendicular Normal Slope**
$$m_{\\text{norm}} = -\\frac{1}{${mTan}}$$
Equation: $${correctLaTeX}$$` : `**Step 3: Write in Slope-Intercept Form**
$$y - (${y0}) = ${mTan}(x - (${x0})) \\implies y = ${correctLaTeX}$$`}`
  };
}

// 6. Linear Approximation / Tangent Line Estimation
export function generateLinearApproximation(difficulty) {
  let base = getRandomChoice([16, 25, 36, 49, 64]);
  let sqrtBase = Math.sqrt(base);
  let delta = getRandomChoice([0.2, 0.4, -0.2, -0.4]);
  let target = (base + delta).toFixed(1);

  // f(x) = sqrt(x), a = base
  // L(x) = f(a) + f'(a)(x - a) = sqrtBase + 1/(2 sqrtBase) * delta
  let approx = (sqrtBase + delta / (2 * sqrtBase)).toFixed(4);

  let correctLaTeX = `${approx}`;
  let distractors = [
    (sqrtBase + delta / sqrtBase).toFixed(4),
    (sqrtBase + delta).toFixed(4),
    (sqrtBase - delta / (2 * sqrtBase)).toFixed(4),
    (parseFloat(approx) + 0.05).toFixed(4),
    `${sqrtBase}.0000`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Use the linear approximation (tangent line approximation) of $f(x) = \\sqrt{x}$ at $a = ${base}$ to estimate $\\sqrt{${target}}$.`,
    expressionLaTeX: `\\sqrt{${target}} \\approx L(${target})`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use $L(x) = f(a) + f'(a)(x - a)$ where $f(x) = \\sqrt{x}$, $a = ${base}$, and $x = ${target}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Linearization / Local Linear Approximation:**
$$L(x) = f(a) + f'(a)(x - a)$$

**Step 1: Evaluate $f(a)$ and $f'(a)$**
- $f(a) = \\sqrt{${base}} = ${sqrtBase}$
- $f'(x) = \\frac{1}{2\\sqrt{x}} \\implies f'(${base}) = \\frac{1}{2\\sqrt{${base}}} = \\frac{1}{${2 * sqrtBase}}$

**Step 2: Construct Linearization Formula**
$$L(${target}) = ${sqrtBase} + \\frac{1}{${2 * sqrtBase}}(${target} - ${base}) = ${sqrtBase} + \\frac{${delta}}{${2 * sqrtBase}} = ${approx}$$`
  };
}

// 7. Implicit Differentiation (First Derivative at a Point)
export function generateImplicitDifferentiation(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(1, 3);
  let x0 = getRandomInt(1, 3);
  let y0 = getRandomInt(1, 3);

  // a x^2 + b y^2 = C => 2a x + 2b y y' = 0 => y' = -a x / (b y)
  let slopeNum = -a * x0;
  let slopeDen = b * y0;
  let correctLaTeX = formatFraction(slopeNum, slopeDen);

  let C = a * x0 * x0 + b * y0 * y0;

  let distractors = [
    formatFraction(-slopeNum, slopeDen),
    formatFraction(slopeDen, -slopeNum),
    formatFraction(-b * x0, a * y0),
    '0',
    '1'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find $\\frac{dy}{dx}$ at the point $(${x0}, ${y0})$ for the curve:`,
    expressionLaTeX: `${a === 1 ? '' : a}x^2 + ${b === 1 ? '' : b}y^2 = ${C}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Differentiate both sides with respect to $x$. Remember to multiply by $\\frac{dy}{dx}$ when differentiating terms involving $y$ by the Chain Rule.`,
    explanation: `📌 **Core Concept & Formula:**
**Implicit Differentiation:**
When differentiating $y$ with respect to $x$, treat $y$ as an implicit function $y(x)$:
$$\\frac{d}{dx}[y^2] = 2y \\frac{dy}{dx}$$

**Step 1: Differentiate Both Sides with Respect to $x$**
$$\\frac{d}{dx}[${a === 1 ? '' : a}x^2 + ${b === 1 ? '' : b}y^2] = \\frac{d}{dx}[${C}]$$
$$${2*a}x + ${2*b}y \\frac{dy}{dx} = 0$$

**Step 2: Solve for $\\frac{dy}{dx}$**
$${2*b}y \\frac{dy}{dx} = -${2*a}x \\implies \\frac{dy}{dx} = -\\frac{${a}x}{${b}y}$$

**Step 3: Evaluate at $(${x0}, ${y0})$**
$$\\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})} = -\\frac{${a}(${x0})}{${b}(${y0})} = ${correctLaTeX}$$`
  };
}

// 8. Second Derivative via Implicit Differentiation
export function generateSecondDerivativeImplicit(difficulty) {
  let rSq = getRandomChoice([4, 9, 16, 25]);
  // x^2 + y^2 = rSq => y' = -x/y => y'' = -(y - x y') / y^2 = -(y - x(-x/y))/y^2 = -(y^2 + x^2)/y^3 = -rSq / y^3
  let correctLaTeX = `-\\frac{${rSq}}{y^3}`;
  let distractors = [
    `\\frac{${rSq}}{y^3}`,
    `-\\frac{x^2}{y^3}`,
    `-\\frac{1}{y^2}`,
    `\\frac{${rSq}}{y^2}`,
    '0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `For the circle $x^2 + y^2 = ${rSq}$, find the second derivative $\\frac{d^2y}{dx^2}$ in terms of $y$.`,
    expressionLaTeX: `\\frac{d^2y}{dx^2}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `1) Find $\\frac{dy}{dx} = -\\frac{x}{y}$. 2) Differentiate using Quotient Rule. 3) Substitute $\\frac{dy}{dx} = -\\frac{x}{y}$ and use $x^2 + y^2 = ${rSq}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Second Implicit Derivative:**
Differentiate the first derivative $\\frac{dy}{dx}$ using the Quotient Rule and back-substitute the original equation.

**Step 1: First Derivative**
$$2x + 2y y' = 0 \\implies y' = -\\frac{x}{y}$$

**Step 2: Differentiate with Quotient Rule**
$$y'' = \\frac{d}{dx}\\left[-\\frac{x}{y}\\right] = -\\frac{(1)(y) - x(y')}{y^2}$$

**Step 3: Substitute $y' = -\\frac{x}{y}$**
$$y'' = -\\frac{y - x\\left(-\\frac{x}{y}\\right)}{y^2} = -\\frac{y + \\frac{x^2}{y}}{y^2} = -\\frac{\\frac{y^2 + x^2}{y}}{y^2} = -\\frac{x^2 + y^2}{y^3}$$

**Step 4: Substitute $x^2 + y^2 = ${rSq}$**
$$y'' = -\\frac{${rSq}}{y^3}$$`
  };
}

// 9. Logarithmic Differentiation
export function generateLogarithmicDifferentiation(difficulty) {
  // y = x^x => ln(y) = x ln(x) => y'/y = ln(x) + 1 => y' = x^x (ln(x) + 1)
  let correctLaTeX = `x^x (\\ln(x) + 1)`;
  let distractors = [
    `x \\cdot x^{x-1} = x^x`,
    `x^x \\ln(x)`,
    `x^{x-1} (\\ln(x) + 1)`,
    `x^x`,
    `\\ln(x) + 1`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Use logarithmic differentiation to find $\\frac{dy}{dx}$ for $y = x^x$ where $x > 0$.`,
    expressionLaTeX: `y = x^x`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Take the natural logarithm of both sides $\\ln(y) = x \\ln(x)$, then differentiate implicitly.`,
    explanation: `📌 **Core Concept & Formula:**
**Logarithmic Differentiation:**
Used when both the base and exponent contain variables ($y = f(x)^{g(x)}$).

**Step 1: Take Natural Log of Both Sides**
$$\\ln(y) = \\ln(x^x) = x \\ln(x)$$

**Step 2: Differentiate Implicitly**
$$\\frac{1}{y} \\frac{dy}{dx} = \\frac{d}{dx}[x \\ln(x)] = (1)\\ln(x) + x\\left(\\frac{1}{x}\\right) = \\ln(x) + 1$$

**Step 3: Multiply by $y$**
$$\\frac{dy}{dx} = y(\\ln(x) + 1) = x^x(\\ln(x) + 1)$$`
  };
}

// 10. Inverse Trigonometric Function Derivatives
export function generateInverseTrigDerivative(difficulty) {
  let a = getRandomInt(2, 5);
  let type = getRandomChoice(['arcsin', 'arctan']);

  let correctLaTeX = '';
  let distractors = [];
  let funcName = '';

  if (type === 'arctan') {
    funcName = `\\arctan(${a}x)`;
    correctLaTeX = `\\frac{${a}}{1 + ${a*a}x^2}`;
    distractors = [
      `\\frac{1}{1 + ${a*a}x^2}`,
      `\\frac{${a}}{\\sqrt{1 - ${a*a}x^2}}`,
      `\\frac{${a}}{1 + ${a}x^2}`,
      `\\frac{1}{1 + ${a}x}`,
      `${a}\\sec^2(${a}x)`
    ];
  } else {
    funcName = `\\arcsin(${a}x)`;
    correctLaTeX = `\\frac{${a}}{\\sqrt{1 - ${a*a}x^2}}`;
    distractors = [
      `\\frac{1}{\\sqrt{1 - ${a*a}x^2}}`,
      `\\frac{${a}}{1 + ${a*a}x^2}`,
      `-\\frac{${a}}{\\sqrt{1 - ${a*a}x^2}}`,
      `\\frac{${a}}{\\sqrt{1 - ${a}x^2}}`,
      `${a}\\cos(${a}x)`
    ];
  }

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the derivative of $f(x) = ${funcName}$.`,
    expressionLaTeX: `\\frac{d}{dx}\\left[${funcName}\\right]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Recall: $\\frac{d}{dx}[\\arcsin(u)] = \\frac{u'}{\\sqrt{1-u^2}}$ and $\\frac{d}{dx}[\\arctan(u)] = \\frac{u'}{1+u^2}$.`,
    explanation: `📌 **Core Concept & Formula:**
- **Arctangent Derivative:** $\\frac{d}{dx}[\\arctan(u)] = \\frac{u'}{1 + u^2}$
- **Arcsine Derivative:** $\\frac{d}{dx}[\\arcsin(u)] = \\frac{u'}{\\sqrt{1 - u^2}}$

**Step 1: Apply the Formula with $u = ${a}x \\implies u' = ${a}$**
${type === 'arctan' ? `$$\\frac{d}{dx}[\\arctan(${a}x)] = \\frac{${a}}{1 + (${a}x)^2} = ${correctLaTeX}$$` : `$$\\frac{d}{dx}[\\arcsin(${a}x)] = \\frac{${a}}{\\sqrt{1 - (${a}x)^2}} = ${correctLaTeX}$$`}`
  };
}

// 11. Logarithmic & Exponential Derivatives
export function generateLogExpDerivative(difficulty) {
  let a = getRandomInt(2, 6);
  let b = getRandomInt(1, 5);

  let correctLaTeX = `\\frac{${2*a}x}{${a}x^2 + ${b}}`;
  let distractors = [
    `\\frac{1}{${a}x^2 + ${b}}`,
    `\\frac{${a}x}{${a}x^2 + ${b}}`,
    `\\frac{${2*a}x}{(${a}x^2 + ${b})^2}`,
    `${2*a}x \\ln(${a}x^2 + ${b})`,
    `\\frac{2x}{x^2 + ${b}}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the derivative of $f(x) = \\ln(${a}x^2 + ${b})$.`,
    expressionLaTeX: `\\frac{d}{dx}\\left[\\ln(${a}x^2 + ${b})\\right]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Use $\\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u}$.`,
    explanation: `📌 **Core Concept & Formula:**
$$\\frac{d}{dx}[\\ln(u(x))] = \\frac{u'(x)}{u(x)}$$

**Step 1: Differentiate Inside Argument**
$$u(x) = ${a}x^2 + ${b} \\implies u'(x) = ${2*a}x$$

**Step 2: Construct Derivative**
$$f'(x) = \\frac{${2*a}x}{${a}x^2 + ${b}}$$`
  };
}

// 12. Critical Points & Local Extrema Classification
export function generateCriticalPoints(difficulty) {
  let a = 1;
  let p = getRandomInt(1, 3);
  let q = getRandomInt(4, 6);

  // f'(x) = 3(x - p)(x - q) = 3x^2 - 3(p+q)x + 3pq
  // f(x) = x^3 - (3/2)(p+q)x^2 + 3pq x
  let bCoeff = -3 * (p + q);
  let cCoeff = 3 * p * q;

  let correctLaTeX = `x = ${p} \\text{ (Local Max)}, \\quad x = ${q} \\text{ (Local Min)}`;
  let distract1 = `x = ${p} \\text{ (Local Min)}, \\quad x = ${q} \\text{ (Local Max)}`;
  let distract2 = `x = ${p} \\text{ and } x = ${q} \\text{ (Both Local Max)}`;
  let distract3 = `x = ${-p} \\text{ and } x = ${-q}`;
  let distract4 = `\\text{No critical points}`;

  let distractors = [distract1, distract2, distract3, distract4];
  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find and classify all local extrema for $f(x) = x^3 - \\frac{${3*(p+q)}}{2}x^2 + ${cCoeff}x$.`,
    expressionLaTeX: `f(x) = x^3 - \\frac{${3*(p+q)}}{2}x^2 + ${cCoeff}x`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Set $f'(x) = 0$ to find critical numbers. Use the Second Derivative Test: $f''(x) < 0 \\implies$ Local Max, $f''(x) > 0 \\implies$ Local Min.`,
    explanation: `📌 **Core Concept & Formula:**
- **Critical Numbers:** $x$ where $f'(x) = 0$ or $f'(x)$ is undefined.
- **Second Derivative Test:**
  - If $f'(c) = 0$ and $f''(c) < 0 \\implies$ Local Maximum at $x = c$.
  - If $f'(c) = 0$ and $f''(c) > 0 \\implies$ Local Minimum at $x = c$.

**Step 1: Compute First Derivative and Solve $f'(x) = 0$**
$$f'(x) = 3x^2 - ${3*(p+q)}x + ${cCoeff} = 3(x^2 - ${p+q}x + ${p*q}) = 3(x - ${p})(x - ${q}) = 0$$
Critical points at $x = ${p}$ and $x = ${q}$.

**Step 2: Apply Second Derivative Test**
$$f''(x) = 6x - ${3*(p+q)}$$
- At $x = ${p}$: $f''(${p}) = 6(${p}) - ${3*(p+q)} = ${6*p - 3*(p+q)} < 0 \\implies$ **Local Maximum**.
- At $x = ${q}$: $f''(${q}) = 6(${q}) - ${3*(p+q)} = ${6*q - 3*(p+q)} > 0 \\implies$ **Local Minimum**.`
  };
}

// 13. Absolute Extrema on a Closed Interval (EVT)
export function generateAbsoluteExtremaEVT(difficulty) {
  let c = getRandomInt(1, 3);
  // f(x) = 2x^3 - 3(2c)x^2 on [-1, 2c+1]
  // f'(x) = 6x^2 - 12cx = 6x(x - 2c) = 0 => x=0, x=2c
  let xCrit1 = 0;
  let xCrit2 = 2 * c;
  let intervalA = -1;
  let intervalB = 2 * c + 1;

  let f = x => 2 * Math.pow(x, 3) - 3 * c * Math.pow(x, 2);
  let valA = f(intervalA);
  let valCrit1 = f(xCrit1);
  let valCrit2 = f(xCrit2);
  let valB = f(intervalB);

  let maxVal = Math.max(valA, valCrit1, valCrit2, valB);
  let minVal = Math.min(valA, valCrit1, valCrit2, valB);

  let correctLaTeX = `\\text{Absolute Max: } ${maxVal}, \\quad \\text{Absolute Min: } ${minVal}`;
  let distractors = [
    `\\text{Absolute Max: } ${valCrit1}, \\text{ Absolute Min: } ${valCrit2}`,
    `\\text{Absolute Max: } ${valB}, \\text{ Absolute Min: } ${valA}`,
    `\\text{Absolute Max: } ${maxVal + 2}, \\text{ Absolute Min: } ${minVal - 2}`,
    `\\text{Absolute Max: } ${valCrit2}, \\text{ Absolute Min: } ${valCrit1}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the absolute maximum and absolute minimum values of $f(x) = 2x^3 - ${3*c}x^2$ on the closed interval $[${intervalA}, ${intervalB}]$.`,
    expressionLaTeX: `f(x) = 2x^3 - ${3*c}x^2, \\quad x \\in [${intervalA}, ${intervalB}]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `By the Extreme Value Theorem, evaluate $f(x)$ at all critical points in the interval AND at the two endpoints $x = ${intervalA}$ and $x = ${intervalB}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Closed Interval Method (Extreme Value Theorem):**
To find absolute extrema of continuous $f(x)$ on $[a, b]$:
1. Find critical points in $(a, b)$.
2. Evaluate $f(x)$ at each critical point.
3. Evaluate $f(x)$ at endpoints $a$ and $b$.
4. The largest is the absolute maximum; the smallest is the absolute minimum.

**Step 1: Find Critical Numbers**
$$f'(x) = 6x^2 - ${6*c}x = 6x(x - ${c}) = 0 \\implies x = 0, \\; x = ${c}$$

**Step 2: Evaluate All Candidate Points**
- $f(${intervalA}) = ${valA}$
- $f(0) = ${valCrit1}$
- $f(${c}) = ${f(c)}$
- $f(${intervalB}) = ${valB}$

**Step 3: Compare Values**
Absolute Maximum = $${maxVal}$, Absolute Minimum = $${minVal}$.`
  };
}

// 14. Concavity & Inflection Points
export function generateConcavityAndInflection(difficulty) {
  let a = getRandomInt(1, 3);
  let b = getRandomInt(2, 6);

  // f(x) = x^3 - 3b x^2 + a x
  // f'(x) = 3x^2 - 6b x + a
  // f''(x) = 6x - 6b = 0 => x = b
  let xInf = b;
  let correctLaTeX = `(${xInf}, \\, f(${xInf}))`;
  let distractors = [
    `(${2*xInf}, \\, f(${2*xInf}))`,
    `(${3*xInf}, \\, f(${3*xInf}))`,
    `(0, \\, 0)`,
    `(${xInf/2}, \\, f(${xInf/2}))`,
    `\\text{No points of inflection}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find the $x$-coordinate of the point of inflection for the curve $f(x) = x^3 - ${3*b}x^2 + ${a}x$.`,
    expressionLaTeX: `f(x) = x^3 - ${3*b}x^2 + ${a}x`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Set $f''(x) = 0$ and verify that concavity changes sign.`,
    explanation: `📌 **Core Concept & Formula:**
**Point of Inflection:** A point where the concavity changes (i.e. $f''(x)$ changes sign, often where $f''(x) = 0$).

**Step 1: Compute Derivatives**
$$f'(x) = 3x^2 - ${6*b}x + ${a}$$
$$f''(x) = 6x - ${6*b}$$

**Step 2: Solve $f''(x) = 0$**
$$6x - ${6*b} = 0 \\implies x = ${xInf}$$
Since $f''(x) < 0$ for $x < ${xInf}$ (concave down) and $f''(x) > 0$ for $x > ${xInf}$ (concave up), an inflection point occurs at $x = ${xInf}$.`
  };
}

// 15. Mean Value Theorem (MVT)
export function generateMeanValueTheorem(difficulty) {
  let a = getRandomInt(1, 3);
  let x1 = 0;
  let x2 = getRandomInt(2, 6);

  // f(x) = a x^2 on [0, x2]
  // (f(x2) - f(0)) / (x2 - 0) = (a x2^2) / x2 = a x2
  // f'(c) = 2a c = a x2 => c = x2 / 2
  let cVal = formatFraction(x2, 2);

  let correctLaTeX = `${cVal}`;
  let distractors = [
    `${x2}`,
    formatFraction(x2, 3),
    formatFraction(x2 * 2, 3),
    formatFraction(x2, 4),
    '0'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find all numbers $c$ that satisfy the conclusion of the **Mean Value Theorem** for $f(x) = ${a === 1 ? '' : a}x^2$ on the interval $[0, ${x2}]$.`,
    expressionLaTeX: `f(x) = ${a === 1 ? '' : a}x^2, \\quad [0, ${x2}]`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Set $f'(c) = \\frac{f(${x2}) - f(0)}{${x2} - 0}$ and solve for $c$.`,
    explanation: `📌 **Core Concept & Formula:**
**Mean Value Theorem (MVT):**
If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, there exists $c \\in (a, b)$ such that:
$$f'(c) = \\frac{f(b) - f(a)}{b - a}$$

**Step 1: Compute Average Rate of Change**
$$\\frac{f(${x2}) - f(0)}{${x2} - 0} = \\frac{${a}(${x2})^2 - 0}{${x2}} = ${a * x2}$$

**Step 2: Set $f'(c)$ Equal to Average Rate**
$$f'(c) = ${2 * a}c = ${a * x2} \\implies c = \\frac{${a * x2}}{${2 * a}} = \\frac{${x2}}{2} = ${cVal}$$`
  };
}

// 16. Differentiability & Continuity Parameters
export function generateDifferentiabilityAndContinuity(difficulty) {
  let c = getRandomInt(1, 3);
  let m = getRandomInt(2, 4);

  // Piecewise: f(x) = a x^2 + b for x <= c, and m x for x > c
  // 1) Derivatives match at x=c: 2a c = m => a = m / (2c)
  // 2) Values match at x=c: a c^2 + b = m c => (m/(2c)) c^2 + b = m c => (m c)/2 + b = m c => b = (m c)/2
  let aNum = m;
  let aDen = 2 * c;
  let bNum = m * c;
  let bDen = 2;

  let aStr = formatFraction(aNum, aDen);
  let bStr = formatFraction(bNum, bDen);
  let correctLaTeX = `a = ${aStr}, \\quad b = ${bStr}`;

  let distractors = [
    `a = ${formatFraction(m, c)}, \\quad b = 0`,
    `a = ${aStr}, \\quad b = ${formatFraction(bNum + 2, bDen)}`,
    `a = ${formatFraction(m * 2, c)}, \\quad b = ${bStr}`,
    `a = 1, \\quad b = ${c}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `Find values of constants $a$ and $b$ such that $f(x)$ is **differentiable everywhere**:`,
    expressionLaTeX: `f(x) = \\begin{cases} ax^2 + b, & x \\le ${c} \\\\ ${m}x, & x > ${c} \\end{cases}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `For differentiability at $x = ${c}$, both the function values (continuity) AND the derivatives must match at $x = ${c}$.`,
    explanation: `📌 **Core Concept & Formula:**
For $f(x)$ to be differentiable at $x = c$:
1. **Equal Derivatives:** $f'(c^-) = f'(c^+)$
2. **Equal Function Values (Continuity):** $f(c^-) = f(c^+)$

**Step 1: Match Derivatives at $x = ${c}$**
$$\\frac{d}{dx}[ax^2 + b] = 2ax \\implies 2a(${c}) = ${2*c}a$$
$$\\frac{d}{dx}[${m}x] = ${m}$$
Set equal: $${2*c}a = ${m} \\implies a = ${aStr}$$

**Step 2: Match Function Values at $x = ${c}$**
$$a(${c})^2 + b = ${m}(${c})$$
Substitute $a = ${aStr}$:
$$(${aStr})(${c*c}) + b = ${m*c} \\implies b = ${m*c} - ${formatFraction(m*c, 2)} = ${bStr}$$`
  };
}

// 17. Related Rates (Sliding Ladder / Conical Tank / Expanding Circle)
export function generateRelatedRates(difficulty) {
  let subType = getRandomChoice(['ladder', 'circle', 'sphere']);
  if (difficulty === 'easy') subType = 'circle';

  if (subType === 'ladder') {
    let L = getRandomChoice([10, 13, 15]);
    let x = L === 10 ? 6 : (L === 13 ? 5 : 9);
    let y = Math.round(Math.sqrt(L * L - x * x));
    let dxdt = getRandomInt(1, 3);

    // x^2 + y^2 = L^2 => 2x dx/dt + 2y dy/dt = 0 => dy/dt = - (x/y) dx/dt
    let dydtNum = -x * dxdt;
    let dydtDen = y;
    let correctLaTeX = formatFraction(dydtNum, dydtDen);

    let distractors = [
      formatFraction(-dydtNum, dydtDen),
      formatFraction(-x, y),
      formatFraction(-dxdt * y, x),
      '0',
      `-${dxdt}`
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `A $${L}$-foot ladder leans against a vertical wall. If the bottom of the ladder slides away from the wall at a rate of $${dxdt}$ ft/sec, how fast is the top of the ladder sliding down the wall when the bottom is $${x}$ feet from the wall?`,
      expressionLaTeX: `x^2 + y^2 = ${L}^2, \\quad \\frac{dx}{dt} = ${dxdt}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Use the Pythagorean theorem $x^2 + y^2 = ${L}^2$. Differentiate with respect to time $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$.`,
      explanation: `📌 **Core Concept & Formula:**
**Related Rates with Pythagorean Theorem:**
$$x^2 + y^2 = L^2 \\implies 2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0 \\implies \\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$$

**Step 1: Find $y$ when $x = ${x}$**
$$y = \\sqrt{${L}^2 - ${x}^2} = \\sqrt{${L*L} - ${x*x}} = ${y} \\text{ ft}$$

**Step 2: Substitute Known Rates**
$$\\frac{dy}{dt} = -\\frac{${x}}{${y}}(${dxdt}) = ${correctLaTeX} \\text{ ft/sec}$$`
    };
  } else {
    // Circle: A = pi r^2 => dA/dt = 2 pi r dr/dt
    let r = getRandomInt(4, 10);
    let drdt = getRandomInt(2, 5);
    let dAdt = 2 * r * drdt;

    let correctLaTeX = `${dAdt}\\pi`;
    let distractors = [
      `${r * drdt}\\pi`,
      `${r * r * drdt}\\pi`,
      `${2 * r}\\pi`,
      `${dAdt / 2}\\pi`,
      `${dAdt * 2}\\pi`
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Differential Calculus',
      questionText: `The radius $r$ of a circle is expanding at a constant rate of $${drdt}$ cm/s. At what rate is the area of the circle increasing when the radius is $r = ${r}$ cm?`,
      expressionLaTeX: `A = \\pi r^2, \\quad \\frac{dr}{dt} = ${drdt}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Differentiate $A = \\pi r^2$ with respect to time $t$: $\\frac{dA}{dt} = 2\\pi r \\frac{dr}{dt}$.`,
      explanation: `📌 **Core Concept & Formula:**
$$\\frac{dA}{dt} = \\frac{d}{dt}[\\pi r^2] = 2\\pi r \\frac{dr}{dt}$$

**Step 1: Substitute Known Values**
$$\\frac{dA}{dt} = 2\\pi (${r})(${drdt}) = ${dAdt}\\pi \\text{ cm}^2/\\text{s}$$`
    };
  }
}

// 18. Optimization (Fencing / Box Sheet / Rectangle)
export function generateOptimization(difficulty) {
  let perimeter = getRandomChoice([40, 60, 80, 100, 120]);
  // Fencing 3 sides against a river: 2x + y = perimeter => y = P - 2x
  // Area A(x) = x(P - 2x) = P x - 2x^2 => A'(x) = P - 4x = 0 => x = P / 4
  // Max Area = (P/4) * (P/2) = P^2 / 8
  let xOpt = perimeter / 4;
  let yOpt = perimeter / 2;
  let maxArea = xOpt * yOpt;

  let correctLaTeX = `${maxArea}`;
  let distractors = [
    `${Math.round(Math.pow(perimeter / 4, 2))}`,
    `${maxArea + 50}`,
    `${maxArea - 50}`,
    `${perimeter * 2}`,
    `${maxArea * 2}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `A farmer wants to enclose a rectangular pasture adjacent to a straight river using $${perimeter}$ meters of fencing. No fence is needed along the river. What is the **maximum area** (in $\\text{m}^2$) that can be enclosed?`,
    expressionLaTeX: `A(x) = x(${perimeter} - 2x)`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Express the area as $A(x) = x(${perimeter} - 2x)$. Set the derivative $A'(x) = 0$ to find the optimal dimension $x$.`,
    explanation: `📌 **Core Concept & Formula:**
**Optimization:**
1. Objective function: $A = x \\cdot y$.
2. Constraint equation: $2x + y = ${perimeter} \\implies y = ${perimeter} - 2x$.
3. Substitute to get $A(x) = ${perimeter}x - 2x^2$.

**Step 1: Differentiate and Find Critical Points**
$$A'(x) = ${perimeter} - 4x = 0 \\implies x = \\frac{${perimeter}}{4} = ${xOpt} \\text{ m}$$

**Step 2: Calculate Dimensions & Maximum Area**
$$y = ${perimeter} - 2(${xOpt}) = ${yOpt} \\text{ m}$$
$$\\text{Max Area} = x \\cdot y = (${xOpt})(${yOpt}) = ${maxArea} \\text{ m}^2$$`
  };
}

// 19. Position, Velocity, Acceleration, and Speed (Motion Analysis)
export function generatePositionVelocity(difficulty) {
  let tRest = getRandomInt(2, 5);
  // v(t) = 3t^2 - 6(tRest) t = 3t(t - 2*tRest) or s(t) = t^3 - 3*tRest*t^2 + 5
  // v(t) = 3t^2 - 6*tRest*t = 0 => t = 0 or t = 2*tRest
  let bCoeff = 3 * tRest;
  let sPoly = `t^3 - ${bCoeff}t^2 + 8`;

  let correctLaTeX = `t = ${2 * tRest}`;
  let distractors = [
    `t = ${tRest}`,
    `t = ${3 * tRest}`,
    `t = ${tRest / 2}`,
    `t = 0`,
    `\\text{Never at rest}`
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Differential Calculus',
    questionText: `The position of a particle moving along a horizontal line is given by $s(t) = ${sPoly}$ for $t \\ge 0$. At what time $t > 0$ is the particle momentarily at rest?`,
    expressionLaTeX: `s(t) = ${sPoly}, \\quad v(t) = s'(t) = 0`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `A particle is at rest when its velocity $v(t) = s'(t) = 0$.`,
    explanation: `📌 **Core Concept & Formula:**
- **Velocity:** $v(t) = s'(t)$.
- **At Rest Condition:** $v(t) = 0$.

**Step 1: Compute Velocity Function**
$$v(t) = \\frac{d}{dt}[${sPoly}] = 3t^2 - ${2*bCoeff}t$$

**Step 2: Solve $v(t) = 0$ for $t > 0$**
$$3t(t - ${2*tRest}) = 0 \\implies t = 0 \\quad \\text{or} \\quad t = ${2*tRest}$$
Thus, for $t > 0$, the particle is at rest at $t = ${2*tRest}$.`
  };
}
