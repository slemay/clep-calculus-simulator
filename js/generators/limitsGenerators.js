/**
 * Dynamic Limits & Continuity Question Generators
 * Covers ~10-15% of the CLEP Calculus Exam with rich, diverse templates
 */
import { getRandomInt, getRandomChoice, formatFraction, formatPolynomial, createChoiceOptions, gcd } from './mathUtils.js';

// 1. Factoring 0/0 Limit (Linear, Quadratic, Difference of Cubes, Rational)
export function generateLimitFactoring(difficulty) {
  let subType = getRandomChoice(['quadratic', 'diff_of_cubes', 'rational_coeff']);
  if (difficulty === 'easy') subType = 'quadratic';

  if (subType === 'diff_of_cubes') {
    // lim_{x -> c} (x^3 - c^3) / (a(x - c)) = 3 c^2 / a
    let c = getRandomInt(2, difficulty === 'extreme' ? 6 : 4);
    let a = getRandomInt(1, difficulty === 'extreme' ? 4 : 2);
    let cCubed = c * c * c;
    let limitNum = 3 * c * c;
    let limitDen = a;
    let correctLaTeX = formatFraction(limitNum, limitDen);

    let numStr = `x^3 - ${cCubed}`;
    let denStr = a === 1 ? `x - ${c}` : `${a}x - ${a * c}`;

    let distractors = [
      formatFraction(c * c, a),
      formatFraction(2 * c * c, a),
      formatFraction(limitNum + a, limitDen),
      '0',
      '\\text{Does not exist}'
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the following limit:`,
      expressionLaTeX: `\\lim_{x \\to ${c}} \\frac{${numStr}}{${denStr}}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Direct substitution yields $\\frac{0}{0}$. Use the difference of cubes identity $A^3 - B^3 = (A - B)(A^2 + AB + B^2)$ to factor the numerator.`,
      explanation: `📌 **Core Concept & Formula:**
**Difference of Cubes Identity:** $A^3 - B^3 = (A - B)(A^2 + AB + B^2)$.
When evaluating a limit that yields the indeterminate form $\\frac{0}{0}$, factor and cancel the removable discontinuity factor $(x - c)$.

**Step 1: Test Direct Substitution**
Substituting $x = ${c}$:
$$\\text{Numerator: } (${c})^3 - ${cCubed} = ${cCubed} - ${cCubed} = 0$$
$$\\text{Denominator: } ${a}(${c}) - ${a * c} = 0$$
The form is $\\frac{0}{0}$ (indeterminate).

**Step 2: Factor the Numerator**
Using the difference of cubes formula with $A = x$ and $B = ${c}$:
$$x^3 - ${cCubed} = (x - ${c})(x^2 + ${c}x + ${c * c})$$
Factor the denominator:
$$${denStr} = ${a === 1 ? `(x - ${c})` : `${a}(x - ${c})`}$$

**Step 3: Cancel the Common Factor**
$$\\lim_{x \\to ${c}} \\frac{(x - ${c})(x^2 + ${c}x + ${c * c})}{${a === 1 ? `x - ${c}` : `${a}(x - ${c})`}} = \\lim_{x \\to ${c}} \\frac{x^2 + ${c}x + ${c * c}}{${a}}$$

**Step 4: Evaluate by Direct Substitution**
$$\\frac{(${c})^2 + ${c}(${c}) + ${c * c}}{${a}} = \\frac{${c * c} + ${c * c} + ${c * c}}{${a}} = \\frac{${limitNum}}{${limitDen}} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Remember that the middle term in the quadratic factor of difference of cubes is $+AB$, NOT $+2AB$.`
    };
  } else if (subType === 'rational_coeff' || difficulty === 'extreme') {
    // (a x^2 + b x + c) / (d x^2 + e x + f) where (x - r) is common factor
    let r = getRandomInt(1, 4);
    let k1 = getRandomInt(-5, 5, true);
    let k2 = getRandomInt(-4, 4, true);
    let a1 = getRandomInt(1, 3);
    let a2 = getRandomInt(1, 3);

    // Num: (x - r)(a1 x + k1) = a1 x^2 + (k1 - a1 r)x - k1 r
    // Den: (x - r)(a2 x + k2) = a2 x^2 + (k2 - a2 r)x - k2 r
    let numA = a1;
    let numB = k1 - a1 * r;
    let numC = -k1 * r;

    let denA = a2;
    let denB = k2 - a2 * r;
    let denC = -k2 * r;

    let limitNum = a1 * r + k1;
    let limitDen = a2 * r + k2;
    if (limitDen === 0) {
      k2 += 2;
      denB = k2 - a2 * r;
      denC = -k2 * r;
      limitDen = a2 * r + k2;
    }

    let correctLaTeX = formatFraction(limitNum, limitDen);
    let numPoly = formatPolynomial([numA, numB, numC]);
    let denPoly = formatPolynomial([denA, denB, denC]);

    let distractors = [
      formatFraction(limitNum + 1, limitDen),
      formatFraction(limitNum, limitDen + 1),
      formatFraction(-limitNum, limitDen),
      formatFraction(numA, denA),
      '0'
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the limit:`,
      expressionLaTeX: `\\lim_{x \\to ${r}} \\frac{${numPoly}}{${denPoly}}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Substitution gives $\\frac{0}{0}$. Factor out $(x - ${r})$ from both the numerator and denominator.`,
      explanation: `📌 **Core Concept & Formula:**
When evaluating rational limits that result in indeterminate form $\\frac{0}{0}$, $(x - r)$ is a root of both numerator and denominator. Factor $(x - r)$ from both expressions and simplify.

**Step 1: Verify the $\\frac{0}{0}$ Indeterminate Form**
Plugging in $x = ${r}$ yields $0$ in the numerator and $0$ in the denominator.

**Step 2: Factor Both Polynomials**
$$\\text{Numerator: } ${numPoly} = (x - ${r})(${a1 === 1 ? 'x' : `${a1}x`} ${k1 >= 0 ? '+' : ''}${k1})$$
$$\\text{Denominator: } ${denPoly} = (x - ${r})(${a2 === 1 ? 'x' : `${a2}x`} ${k2 >= 0 ? '+' : ''}${k2})$$

**Step 3: Cancel Common Term $(x - ${r})$ and Evaluate**
$$\\lim_{x \\to ${r}} \\frac{${a1 === 1 ? 'x' : `${a1}x`} ${k1 >= 0 ? '+' : ''}${k1}}{${a2 === 1 ? 'x' : `${a2}x`} ${k2 >= 0 ? '+' : ''}${k2}} = \\frac{${a1}(${r}) ${k1 >= 0 ? '+' : ''}${k1}}{${a2}(${r}) ${k2 >= 0 ? '+' : ''}${k2}} = \\frac{${limitNum}}{${limitDen}} = ${correctLaTeX}$$`
    };
  } else {
    // Standard quadratic factoring
    let range = difficulty === 'easy' ? 4 : (difficulty === 'medium' ? 7 : 10);
    let c = getRandomInt(1, range);
    let a = getRandomInt(1, difficulty === 'easy' ? 3 : 5);
    let b = getRandomInt(-range, range, true);
    
    let numCoeff1 = 1;
    let numCoeff2 = b - c;
    let numCoeff3 = -b * c;
    
    let denCoeff1 = a;
    let denCoeff2 = -a * c;

    let limitValNum = c + b;
    let limitValDen = a;
    let correctLaTeX = formatFraction(limitValNum, limitValDen);

    let distract1 = formatFraction(limitValNum + 1, limitValDen);
    let distract2 = formatFraction(limitValNum - c, limitValDen);
    let distract3 = formatFraction(-limitValNum, limitValDen);
    let distract4 = '0';
    let distract5 = '\\text{Does not exist}';

    let distractors = [distract1, distract2, distract3, distract4, distract5];
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
      explanation: `📌 **Core Concept & Formula:**
When evaluating the limit of a rational function where direct substitution yields the indeterminate form $\\frac{0}{0}$, algebraic factoring must be used to cancel the removable discontinuity factor $(x - c)$.

**Step 1: Test Direct Substitution**
Substitute $x = ${c}$ into the numerator and denominator:
$$\\text{Numerator: } (${c})^2 ${numCoeff2 >= 0 ? '+' : ''}${numCoeff2}(${c}) ${numCoeff3 >= 0 ? '+' : ''}${numCoeff3} = 0$$
$$\\text{Denominator: } ${denCoeff1}(${c}) ${denCoeff2 >= 0 ? '+' : ''}${denCoeff2} = 0$$
Since this yields $\\frac{0}{0}$, factor the numerator and denominator.

**Step 2: Factor Numerator and Denominator**
$$\\text{Numerator: } ${numStr} = (x - ${c})(x ${b >= 0 ? '+' : ''}${b})$$
$$\\text{Denominator: } ${denStr} = ${a}(x - ${c})$$

**Step 3: Cancel Common Factor & Evaluate**
$$\\lim_{x \\to ${c}} \\frac{x ${b >= 0 ? '+' : ''}${b}}{${a}} = \\frac{${c} ${b >= 0 ? '+' : ''}${b}}{${a}} = \\frac{${limitValNum}}{${limitValDen}} = ${correctLaTeX}$$`
    };
  }
}

// 2. Radical Conjugate Rationalization Limit
export function generateLimitConjugate(difficulty) {
  let a = getRandomChoice([1, 4, 9, 16, 25]);
  let sqrtA = Math.sqrt(a);
  let k = getRandomInt(1, difficulty === 'extreme' ? 4 : 2);

  // lim_{x -> 0} (sqrt(kx + a) - sqrt(a)) / x
  // = lim_{x -> 0} kx / (x (sqrt(kx + a) + sqrt(a))) = k / (2 sqrt(a))
  let limitNum = k;
  let limitDen = 2 * sqrtA;
  let correctLaTeX = formatFraction(limitNum, limitDen);

  let numExpr = k === 1 ? `\\sqrt{x + ${a}} - ${sqrtA}` : `\\sqrt{${k}x + ${a}} - ${sqrtA}`;
  let conjugateExpr = k === 1 ? `\\sqrt{x + ${a}} + ${sqrtA}` : `\\sqrt{${k}x + ${a}} + ${sqrtA}`;

  let distractors = [
    formatFraction(k, sqrtA),
    formatFraction(1, 2 * sqrtA),
    formatFraction(k, a),
    '0',
    '\\infty'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `Evaluate the following radical limit:`,
    expressionLaTeX: `\\lim_{x \\to 0} \\frac{${numExpr}}{x}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Direct substitution gives $\\frac{0}{0}$. Multiply numerator and denominator by the conjugate $${conjugateExpr}$.`,
    explanation: `📌 **Core Concept & Formula:**
**Rationalization via Conjugate Multiplication:**
For radical expressions yielding $\\frac{0}{0}$, multiply the numerator and denominator by the conjugate $(\\sqrt{u} + \\sqrt{v})$ using $(A - B)(A + B) = A^2 - B^2$.

**Step 1: Identify the Indeterminate Form**
Substituting $x = 0$:
$$\\frac{\\sqrt{${a}} - ${sqrtA}}{0} = \\frac{${sqrtA} - ${sqrtA}}{0} = \\frac{0}{0}$$

**Step 2: Multiply by the Conjugate**
Multiply top and bottom by $(${conjugateExpr})$:
$$\\lim_{x \\to 0} \\frac{(${numExpr})(${conjugateExpr})}{x(${conjugateExpr})}$$
Simplify the numerator using difference of squares:
$$(\\sqrt{${k === 1 ? 'x' : `${k}x`} + ${a}})^2 - (${sqrtA})^2 = (${k === 1 ? 'x' : `${k}x`} + ${a}) - ${a} = ${k === 1 ? 'x' : `${k}x`}$$

**Step 3: Cancel $x$ and Evaluate**
$$\\lim_{x \\to 0} \\frac{${k === 1 ? 'x' : `${k}x`}}{x(${conjugateExpr})} = \\lim_{x \\to 0} \\frac{${k}}{${conjugateExpr}}$$
Substitute $x = 0$:
$$\\frac{${k}}{\\sqrt{${a}} + ${sqrtA}} = \\frac{${k}}{${sqrtA} + ${sqrtA}} = \\frac{${k}}{${2 * sqrtA}} = ${correctLaTeX}$$`
  };
}

// 3. Limit at Infinity (Rationals, Radicals at Infinity, Exponentials)
export function generateLimitInfinity(difficulty) {
  let subType = getRandomChoice(['rational', 'radical', 'exponential']);
  if (difficulty === 'easy') subType = 'rational';

  if (subType === 'radical') {
    // lim_{x -> infty} sqrt(a x^2 + b) / (c x + d) = sqrt(a) / c
    let aVals = [4, 9, 16, 25];
    let a = getRandomChoice(aVals);
    let sqrtA = Math.sqrt(a);
    let c = getRandomInt(1, 5);
    let b = getRandomInt(1, 9);
    let d = getRandomInt(-5, 5, true);

    let isNegInfinity = (difficulty === 'hard' || difficulty === 'extreme') && Math.random() > 0.5;
    let targetInf = isNegInfinity ? '-\\infty' : '\\infty';
    let limitNum = isNegInfinity ? -sqrtA : sqrtA;
    let limitDen = c;
    let correctLaTeX = formatFraction(limitNum, limitDen);

    let exprLaTeX = `\\lim_{x \\to ${targetInf}} \\frac{\\sqrt{${a}x^2 + ${b}}}{${c}x ${d >= 0 ? '+' : ''}${d}}`;

    let distractors = [
      formatFraction(sqrtA, c),
      formatFraction(-sqrtA, c),
      formatFraction(a, c),
      '0',
      '\\infty'
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the limit at infinity:`,
      expressionLaTeX: exprLaTeX,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Divide numerator and denominator by highest power of $x$. Note that for $x < 0$, $\\sqrt{x^2} = |x| = -x$.`,
      explanation: `📌 **Core Concept & Formula:**
When evaluating limits at infinity involving square roots, factor out $x^2$ from under the radical:
$$\\sqrt{x^2} = |x| = \\begin{cases} x & \\text{if } x \\to +\\infty \\\\ -x & \\text{if } x \\to -\\infty \\end{cases}$$

**Step 1: Factor $x^2$ from the Radical**
$$\\sqrt{${a}x^2 + ${b}} = \\sqrt{x^2\\left(${a} + \\frac{${b}}{x^2}\\right)} = |x|\\sqrt{${a} + \\frac{${b}}{x^2}}$$

**Step 2: Divide by $x$**
${isNegInfinity ? `Since $x \\to -\\infty$, $|x| = -x$, so the numerator becomes $-x\\sqrt{${a} + \\frac{${b}}{x^2}}$.
$$\\lim_{x \\to -\\infty} \\frac{-x\\sqrt{${a} + \\frac{${b}}{x^2}}}{x\\left(${c} + \\frac{${d}}{x}\\right)} = \\lim_{x \\to -\\infty} \\frac{-\\sqrt{${a} + \\frac{${b}}{x^2}}}{${c} + \\frac{${d}}{x}}$$` : `Since $x \\to +\\infty$, $|x| = x$.
$$\\lim_{x \\to +\\infty} \\frac{x\\sqrt{${a} + \\frac{${b}}{x^2}}}{x\\left(${c} + \\frac{${d}}{x}\\right)} = \\lim_{x \\to +\\infty} \\frac{\\sqrt{${a} + \\frac{${b}}{x^2}}}{${c} + \\frac{${d}}{x}}$$`}

**Step 3: Evaluate Limits as $x \\to ${targetInf}$**
$$\\frac{${isNegInfinity ? '-' : ''}\\sqrt{${a} + 0}}{${c} + 0} = \\frac{${isNegInfinity ? `-${sqrtA}` : `${sqrtA}`}}{${c}} = ${correctLaTeX}$$`
    };
  } else if (subType === 'exponential') {
    let a = getRandomInt(2, 6);
    let b = getRandomInt(1, 5);
    let c = getRandomInt(2, 6);
    let d = getRandomInt(1, 5);

    let isNegInf = Math.random() > 0.5;
    let targetInf = isNegInf ? '-\\infty' : '\\infty';

    let correctLaTeX = isNegInf ? formatFraction(b, d) : formatFraction(a, c);

    let distractors = [
      formatFraction(a, c),
      formatFraction(b, d),
      '0',
      '\\infty',
      '1'
    ];

    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the exponential limit:`,
      expressionLaTeX: `\\lim_{x \\to ${targetInf}} \\frac{${a}e^x + ${b}}{${c}e^x + ${d}}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Consider the behavior of $e^x$ as $x \\to ${targetInf}$ (note: $\\lim_{x \\to -\\infty} e^x = 0$ and $\\lim_{x \\to \\infty} e^x = \\infty$).`,
      explanation: `📌 **Core Concept & Formula:**
For exponential limits:
- As $x \\to +\\infty$, $e^x \\to +\\infty$. Divide numerator and denominator by $e^x$.
- As $x \\to -\\infty$, $e^x \\to 0$. Evaluate by direct substitution of $e^{-\\infty} = 0$.

**Step 1: Analyze $x \\to ${targetInf}$**
${isNegInf ? `Since $\\lim_{x \\to -\\infty} e^x = 0$:
$$\\lim_{x \\to -\\infty} \\frac{${a}e^x + ${b}}{${c}e^x + ${d}} = \\frac{${a}(0) + ${b}}{${c}(0) + ${d}} = \\frac{${b}}{${d}} = ${correctLaTeX}$$` : `Divide top and bottom by $e^x$:
$$\\lim_{x \\to \\infty} \\frac{${a} + \\frac{${b}}{e^x}}{${c} + \\frac{${d}}{e^x}} = \\frac{${a} + 0}{${c} + 0} = \\frac{${a}}{${c}} = ${correctLaTeX}$$`}`
    };
  } else {
    // Rational limit at infinity
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
      expText = `📌 **Core Concept & Formula:**
When degrees of numerator and denominator are equal, the limit at infinity is the ratio of leading coefficients:
$$\\lim_{x \\to \\infty} \\frac{${numLaTeX}}{${denLaTeX}} = \\frac{${a}}{${b}} = ${correctLaTeX}$$`;
    } else if (type === 'higher_num') {
      numLaTeX = `${a}x^3 ${c >= 0 ? '+' : ''}${c}x`;
      denLaTeX = `${b}x^2 ${d >= 0 ? '+' : ''}${d}`;
      correctLaTeX = '\\infty';
      expText = `📌 **Core Concept & Formula:**
Since degree of numerator ($3$) > degree of denominator ($2$), the fraction grows without bound as $x \\to \\infty$: $\\lim = \\infty$.`;
    } else {
      numLaTeX = `${a}x ${c >= 0 ? '+' : ''}${c}`;
      denLaTeX = `${b}x^2 ${d >= 0 ? '+' : ''}${d}`;
      correctLaTeX = '0';
      expText = `📌 **Core Concept & Formula:**
Since degree of denominator ($2$) > degree of numerator ($1$), the denominator outgrows the numerator: $\\lim = 0$.`;
    }

    let distractors = [formatFraction(a, b), '0', '\\infty', formatFraction(b, a), '1'];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the limit at infinity:`,
      expressionLaTeX: `\\lim_{x \\to \\infty} \\frac{${numLaTeX}}{${denLaTeX}}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Compare the highest degrees of the numerator and denominator.`,
      explanation: expText
    };
  }
}

// 4. L'Hôpital's Rule Trig, Log, and Exponential Limits
export function generateLimitLHopital(difficulty) {
  let variant = getRandomChoice(['sin_ratio', 'exp', 'cos_diff', 'log_limit']);
  if (difficulty === 'extreme') variant = getRandomChoice(['cos_diff', 'log_limit', 'exp_nested']);

  let a = getRandomInt(2, 6);
  let b = getRandomInt(1, 5);

  if (variant === 'sin_ratio') {
    let correctLaTeX = formatFraction(a, b);
    let distractors = [
      formatFraction(b, a),
      formatFraction(1, b),
      '0',
      '1',
      '\\text{Does not exist}'
    ];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the limit:`,
      expressionLaTeX: `\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{\\sin(${b}x)}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Substitution gives $\\frac{0}{0}$. Apply L'Hôpital's Rule by differentiating numerator and denominator.`,
      explanation: `📌 **Core Concept & Formula:**
**L'Hôpital's Rule:** $\\lim_{x \\to 0} \\frac{f(x)}{g(x)} = \\lim_{x \\to 0} \\frac{f'(x)}{g'(x)}$ when form is $\\frac{0}{0}$.

**Step 1: Apply Derivatives**
$$\\frac{d}{dx}[\\sin(${a}x)] = ${a}\\cos(${a}x)$$
$$\\frac{d}{dx}[\\sin(${b}x)] = ${b}\\cos(${b}x)$$

**Step 2: Evaluate at $x = 0$**
$$\\lim_{x \\to 0} \\frac{${a}\\cos(${a}x)}{${b}\\cos(${b}x)} = \\frac{${a}\\cos(0)}{${b}\\cos(0)} = \\frac{${a}(1)}{${b}(1)} = ${correctLaTeX}$$`
    };
  } else if (variant === 'log_limit') {
    // lim_{x -> 0} ln(1 + ax) / (bx) = a / b
    let correctLaTeX = formatFraction(a, b);
    let distractors = [
      formatFraction(1, b),
      formatFraction(a, 1),
      '0',
      '1',
      '\\text{Undefined}'
    ];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the limit:`,
      expressionLaTeX: `\\lim_{x \\to 0} \\frac{\\ln(1 + ${a}x)}{${b}x}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Check substitution: $\\ln(1)/0 = 0/0$. Use L'Hôpital's Rule with $\\frac{d}{dx}[\\ln(1+${a}x)] = \\frac{${a}}{1+${a}x}$.`,
      explanation: `📌 **Core Concept & Formula:**
**L'Hôpital's Rule with Logarithms:**
$$\\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u} \\implies \\frac{d}{dx}[\\ln(1 + ${a}x)] = \\frac{${a}}{1 + ${a}x}$$

**Step 1: Differentiate Numerator & Denominator**
$$\\lim_{x \\to 0} \\frac{\\frac{${a}}{1 + ${a}x}}{${b}} = \\frac{\\frac{${a}}{1 + 0}}{${b}} = \\frac{${a}}{${b}} = ${correctLaTeX}$$`
    };
  } else if (variant === 'cos_diff') {
    let aSq = a * a;
    let twoB = 2 * b;
    let correctLaTeX = formatFraction(aSq, twoB);
    let distractors = [
      formatFraction(a, b),
      formatFraction(aSq, b),
      '0',
      '1',
      '\\text{Does not exist}'
    ];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the limit using L'Hôpital's Rule:`,
      expressionLaTeX: `\\lim_{x \\to 0} \\frac{1 - \\cos(${a}x)}{${b}x^2}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Direct substitution yields $\\frac{0}{0}$. Apply L'Hôpital's Rule twice.`,
      explanation: `📌 **Core Concept & Formula:**
Apply L'Hôpital's Rule consecutively for repeated $\\frac{0}{0}$ forms.

**Step 1: First Application**
$$\\lim_{x \\to 0} \\frac{\\frac{d}{dx}[1 - \\cos(${a}x)]}{\\frac{d}{dx}[${b}x^2]} = \\lim_{x \\to 0} \\frac{${a}\\sin(${a}x)}{${2*b}x}$$
This still yields $\\frac{0}{0}$.

**Step 2: Second Application**
$$\\lim_{x \\to 0} \\frac{${a}^2\\cos(${a}x)}{${twoB}} = \\frac{${aSq}(1)}{${twoB}} = ${correctLaTeX}$$`
    };
  } else {
    // Exponential limit
    let correctLaTeX = formatFraction(a, b);
    let distractors = [
      formatFraction(1, b),
      formatFraction(a * a, b),
      '0',
      '1',
      'e'
    ];
    let choiceData = createChoiceOptions(correctLaTeX, distractors);

    return {
      topic: 'Limits & Continuity',
      questionText: `Evaluate the limit:`,
      expressionLaTeX: `\\lim_{x \\to 0} \\frac{e^{${a}x} - 1}{${b}x}`,
      choices: choiceData.choices,
      correctIndex: choiceData.correctIndex,
      hint: `Substitution gives $\\frac{0}{0}$. Differentiate top and bottom.`,
      explanation: `📌 **Core Concept & Formula:**
$$\\frac{d}{dx}[e^{${a}x} - 1] = ${a}e^{${a}x}, \\quad \\frac{d}{dx}[${b}x] = ${b}$$
$$\\lim_{x \\to 0} \\frac{${a}e^{${a}x}}{${b}} = \\frac{${a}e^0}{${b}} = \\frac{${a}}{${b}} = ${correctLaTeX}$$`
    };
  }
}

// 5. Piecewise Function Continuity Parameter Search
export function generatePiecewiseContinuity(difficulty) {
  let c = getRandomInt(1, 4);
  let a = getRandomInt(2, 5);
  let b = getRandomInt(1, 3);
  let d = getRandomInt(-5, 5);

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
    hint: `Set the left-hand limit $\\lim_{x \\to ${c}^-} f(x)$ equal to the right-hand limit $\\lim_{x \\to ${c}^+} f(x)$ and solve for $k$.`,
    explanation: `📌 **Core Concept & Formula:**
A function $f(x)$ is continuous at $x = ${c}$ if $\\lim_{x \\to ${c}^-} f(x) = \\lim_{x \\to ${c}^+} f(x) = f(${c})$.

**Step 1: Compute One-Sided Limits**
$$\\lim_{x \\to ${c}^-} f(x) = ${a}(${c}) + k = ${leftLimitNoK} + k$$
$$\\lim_{x \\to ${c}^+} f(x) = ${b}(${c})^2 ${d >= 0 ? '+' : ''}${d} = ${rightLimit}$$

**Step 2: Solve for $k$**
$${leftLimitNoK} + k = ${rightLimit} \\implies k = ${rightLimit} - ${leftLimitNoK} = ${kVal}$$`
  };
}

// 6. Squeeze Theorem & Special Trigonometric Bounding
export function generateTrigSpecialLimit(difficulty) {
  let k = getRandomInt(2, 5);
  let power = getRandomChoice([2, 3]);

  let correctLaTeX = '0';
  let distractors = [
    '1',
    `${k}`,
    '-1',
    '\\infty',
    '\\text{Does not exist}'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `Evaluate the following limit using the Squeeze (Sandwich) Theorem:`,
    expressionLaTeX: `\\lim_{x \\to 0} x^{${power}} \\cos\\left(\\frac{${k}}{x}\\right)`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Recall that $-1 \\le \\cos(\\theta) \\le 1$ for all $\\theta$. Multiply by $x^{${power}}$ to sandwich the function.`,
    explanation: `📌 **Core Concept & Formula:**
**The Squeeze Theorem:**
If $g(x) \\le f(x) \\le h(x)$ for all $x$ near $c$ (except possibly at $c$) and $\\lim_{x \\to c} g(x) = \\lim_{x \\to c} h(x) = L$, then $\\lim_{x \\to c} f(x) = L$.

**Step 1: Bound the Oscillating Factor**
Since the cosine function is bounded between $-1$ and $1$ for all non-zero arguments:
$$-1 \\le \\cos\\left(\\frac{${k}}{x}\\right) \\le 1$$

**Step 2: Multiply by $x^{${power}}$**
$$-x^{${power}} \\le x^{${power}} \\cos\\left(\\frac{${k}}{x}\\right) \\le x^{${power}}$$

**Step 3: Evaluate the Bounding Limits as $x \\to 0$**
$$\\lim_{x \\to 0} (-x^{${power}}) = 0 \\quad \\text{and} \\quad \\lim_{x \\to 0} x^{${power}} = 0$$
By the Squeeze Theorem:
$$\\lim_{x \\to 0} x^{${power}} \\cos\\left(\\frac{${k}}{x}\\right) = 0$$`
  };
}

// 7. Intermediate Value Theorem (IVT) Root Existence
export function generateIntermediateValueTheorem(difficulty) {
  let a = getRandomInt(1, 3);
  let rootApprox = getRandomInt(1, 3);
  let cVal = rootApprox * rootApprox * rootApprox - a * rootApprox; // f(rootApprox) = 0
  let constant = cVal + getRandomChoice([1, -1]); // slightly offset to ensure clean interval

  let f = x => Math.pow(x, 3) - a * x - constant;
  let intervalStart = rootApprox - 1;
  let intervalEnd = rootApprox + 1;

  let fStart = f(intervalStart);
  let fEnd = f(intervalEnd);

  let correctInterval = `[${intervalStart}, ${intervalEnd}]`;
  let wrongInterval1 = `[${intervalStart + 3}, ${intervalEnd + 3}]`;
  let wrongInterval2 = `[${intervalStart - 3}, ${intervalEnd - 3}]`;
  let wrongInterval3 = `[${intervalStart + 5}, ${intervalEnd + 5}]`;
  let wrongInterval4 = `[-5, -4]`;

  let distractors = [wrongInterval1, wrongInterval2, wrongInterval3, wrongInterval4];
  let choiceData = createChoiceOptions(correctInterval, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `By the Intermediate Value Theorem, which of the following closed intervals is guaranteed to contain a root of $f(x) = x^3 - ${a}x - ${constant}$?`,
    expressionLaTeX: `f(x) = x^3 - ${a}x - ${constant}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Evaluate $f(a)$ and $f(b)$ at the endpoints of each candidate interval. A root $f(c) = 0$ is guaranteed if $f(a)$ and $f(b)$ have opposite signs ($f(a) \\cdot f(b) < 0$).`,
    explanation: `📌 **Core Concept & Formula:**
**Intermediate Value Theorem (IVT):**
If $f(x)$ is continuous on a closed interval $[a, b]$ and $N$ is any number between $f(a)$ and $f(b)$, then there exists at least one number $c \\in (a, b)$ such that $f(c) = N$. For roots ($N = 0$), $f(a)$ and $f(b)$ must have opposite signs.

**Step 1: Test the Correct Interval $[${intervalStart}, ${intervalEnd}]$**
$$f(${intervalStart}) = (${intervalStart})^3 - ${a}(${intervalStart}) - ${constant} = ${fStart}$$
$$f(${intervalEnd}) = (${intervalEnd})^3 - ${a}(${intervalEnd}) - ${constant} = ${fEnd}$$

**Step 2: Verify Opposite Signs**
Since $f(${intervalStart}) = ${fStart}$ and $f(${intervalEnd}) = ${fEnd}$ have opposite signs ($0$ lies strictly between $f(${intervalStart})$ and $f(${intervalEnd})$), the IVT guarantees at least one root $c \\in [${intervalStart}, ${intervalEnd}]$.`
  };
}

// 8. Asymptotes & Discontinuities Classification
export function generateAsymptotesAndDiscontinuities(difficulty) {
  let p = getRandomInt(1, 4);
  let q = getRandomInt(5, 8);
  let a = getRandomInt(2, 4);

  // f(x) = (x - p)(x + 2) / ((x - p)(x - q))
  // Hole at x = p, Vertical Asymptote at x = q, Horizontal Asymptote at y = 1
  let correctChoice = `\\text{Vertical Asymptote at } x = ${q}, \\text{ Hole at } x = ${p}`;
  let distract1 = `\\text{Vertical Asymptotes at } x = ${p} \\text{ and } x = ${q}`;
  let distract2 = `\\text{Holes at } x = ${p} \\text{ and } x = ${q}`;
  let distract3 = `\\text{Vertical Asymptote at } x = ${p}, \\text{ Hole at } x = ${q}`;
  let distract4 = `\\text{No vertical asymptotes}`;

  let distractors = [distract1, distract2, distract3, distract4];
  let choiceData = createChoiceOptions(correctChoice, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `Classify all discontinuities and vertical asymptotes for the rational function:`,
    expressionLaTeX: `f(x) = \\frac{(x - ${p})(x + 2)}{(x - ${p})(x - ${q})}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `A factor that cancels from both numerator and denominator produces a removable discontinuity (hole). A factor remaining in the denominator produces a non-removable infinite discontinuity (vertical asymptote).`,
    explanation: `📌 **Core Concept & Formula:**
- **Removable Discontinuity (Hole):** Occurs at $x = c$ when $(x - c)$ is a common factor of both numerator and denominator and cancels completely.
- **Vertical Asymptote (Infinite Discontinuity):** Occurs at $x = d$ where the simplified denominator equals $0$.

**Step 1: Simplify $f(x)$**
$$f(x) = \\frac{(x - ${p})(x + 2)}{(x - ${p})(x - ${q})} = \\frac{x + 2}{x - ${q}}, \\quad x \\neq ${p}$$

**Step 2: Classify Each Point**
- At $x = ${p}$, the factor $(x - ${p})$ canceled $\\implies$ **Removable Discontinuity (Hole)** at $x = ${p}$.
- At $x = ${q}$, the factor $(x - ${q})$ remains in the denominator $\\implies$ **Vertical Asymptote** at $x = ${q}$.`
  };
}
