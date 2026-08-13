/**
 * Dynamic Limits & Continuity Question Generators
 */
import { getRandomInt, getRandomChoice, formatFraction, createChoiceOptions } from './mathUtils.js';

// 1. Factoring 0/0 Limit
export function generateLimitFactoring(difficulty) {
  let range = difficulty === 'easy' ? 4 : (difficulty === 'medium' ? 7 : 10);
  let c = getRandomInt(1, range);
  let a = getRandomInt(1, difficulty === 'easy' ? 3 : 5);
  let b = getRandomInt(-range, range, true);
  
  // f(x) = (x - c)(x + b) / (a(x - c)) = (x^2 + (b-c)x - bc) / (ax - ac)
  let numCoeff1 = 1;
  let numCoeff2 = b - c;
  let numCoeff3 = -b * c;
  
  let denCoeff1 = a;
  let denCoeff2 = -a * c;

  let limitValNum = c + b;
  let limitValDen = a;
  let correctLaTeX = formatFraction(limitValNum, limitValDen);

  // Distractors
  let dist1 = formatFraction(limitValNum + 1, limitValDen);
  let dist2 = formatFraction(limitValNum - c, limitValDen);
  let dist3 = formatFraction(-limitValNum, limitValDen);
  let dist4 = '0';
  let dist5 = '\\text{Does not exist}';

  let distractors = [dist1, dist2, dist3, dist4, dist5];
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
$$\\text{Numerator: } (${c})^2 ${numCoeff2 >= 0 ? '+' : ''}${numCoeff2}(${c}) ${numCoeff3 >= 0 ? '+' : ''}${numCoeff3} = ${c*c} ${numCoeff2*c >= 0 ? '+' : ''}${numCoeff2*c} ${numCoeff3 >= 0 ? '+' : ''}${numCoeff3} = 0$$
$$\\text{Denominator: } ${denCoeff1}(${c}) ${denCoeff2 >= 0 ? '+' : ''}${denCoeff2} = ${denCoeff1*c} ${denCoeff2 >= 0 ? '+' : ''}${denCoeff2} = 0$$
Since this yields the indeterminate form $\\frac{0}{0}$, direct substitution cannot determine the limit, indicating a removable discontinuity (hole) at $x = ${c}$.

**Step 2: Factor Numerator and Denominator**
Factor the quadratic numerator and factor the leading coefficient out of the linear denominator:
$$\\text{Numerator: } ${numStr} = (x - ${c})(x ${b >= 0 ? '+' : ''}${b})$$
$$\\text{Denominator: } ${denStr} = ${a}(x - ${c})$$
Rewrite the rational expression:
$$\\frac{${numStr}}{${denStr}} = \\frac{(x - ${c})(x ${b >= 0 ? '+' : ''}${b})}{${a}(x - ${c})}$$

**Step 3: Cancel Common Factor & Simplify**
Since $x \\to ${c}$ evaluates behavior as $x$ approaches ${c}$ ($x \\neq ${c}$), we cancel $(x - ${c})$:
$$\\lim_{x \\to ${c}} \\frac{(x - ${c})(x ${b >= 0 ? '+' : ''}${b})}{${a}(x - ${c})} = \\lim_{x \\to ${c}} \\frac{x ${b >= 0 ? '+' : ''}${b}}{${a}}$$

**Step 4: Evaluate the Simplified Limit**
Now evaluate by direct substitution of $x = ${c}$:
$$\\frac{${c} ${b >= 0 ? '+' : ''}${b}}{${a}} = \\frac{${limitValNum}}{${limitValDen}} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Obtaining $\\frac{0}{0}$ does NOT mean the limit is undefined or Does Not Exist (DNE). It signals that an algebraic cancellation (or L'Hôpital's Rule) will reveal the finite limit.`
  };
}

// 2. Limit at Infinity
export function generateLimitInfinity(difficulty) {
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
For rational functions $\\lim_{x \\to \\infty} \\frac{P(x)}{Q(x)}$, the end-behavior is determined by comparing the degrees (highest powers of $x$) of the numerator and denominator:
- If $\\deg(P) = \\deg(Q)$, the limit is the ratio of leading coefficients: $\\frac{\\text{leading coeff of } P}{\\text{leading coeff of } Q}$.
- If $\\deg(P) < \\deg(Q)$, the limit is $0$ (horizontal asymptote $y = 0$).
- If $\\deg(P) > \\deg(Q)$, the limit grows without bound ($\\pm\\infty$).

**Step 1: Identify the Highest Powers (Degrees)**
$$\\text{Degree of Numerator: } \\deg(${numLaTeX}) = 2$$
$$\\text{Degree of Denominator: } \\deg(${denLaTeX}) = 2$$
Since both polynomials have equal degree ($2$), the leading terms dominate as $x \\to \\infty$.

**Step 2: Algebraic Method (Divide by Highest Power in Denominator)**
Divide every term in the numerator and denominator by $x^2$:
$$\\lim_{x \\to \\infty} \\frac{${numLaTeX}}{${denLaTeX}} = \\lim_{x \\to \\infty} \\frac{\\frac{${a}x^2}{x^2} + \\frac{${c}x}{x^2}}{\\frac{${b}x^2}{x^2} + \\frac{${d}}{x^2}} = \\lim_{x \\to \\infty} \\frac{${a} + \\frac{${c}}{x}}{${b} + \\frac{${d}}{x^2}}$$

**Step 3: Evaluate Limits of Reciprocal Terms**
As $x \\to \\infty$, $\\lim_{x \\to \\infty} \\frac{k}{x^n} = 0$ for any constant $k$ and $n > 0$:
$$\\frac{${a} + 0}{${b} + 0} = \\frac{${a}}{${b}} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
When degrees are equal, taking the ratio of leading coefficients $\\frac{${a}}{${b}} = ${correctLaTeX}$ is the fastest and most reliable method on the CLEP Calculus exam.`;
  } else if (type === 'higher_num') {
    numLaTeX = `${a}x^3 ${c >= 0 ? '+' : ''}${c}x`;
    denLaTeX = `${b}x^2 ${d >= 0 ? '+' : ''}${d}`;
    correctLaTeX = '\\infty';
    expText = `📌 **Core Concept & Formula:**
When evaluating $\\lim_{x \\to \\infty} \\frac{P(x)}{Q(x)}$, if the degree of the numerator is strictly greater than the degree of the denominator ($\\deg(P) > \\deg(Q)$), the numerator grows at a higher order of magnitude, causing the function values to increase without bound ($\\infty$ or $-\\infty$).

**Step 1: Compare Degrees of Numerator and Denominator**
$$\\text{Degree of Numerator: } \\deg(${numLaTeX}) = 3$$
$$\\text{Degree of Denominator: } \\deg(${denLaTeX}) = 2$$
Since $\\deg(\\text{Numerator}) = 3 > \\deg(\\text{Denominator}) = 2$, the fraction is "top-heavy".

**Step 2: Divide by the Highest Power of the Denominator ($x^2$)**
$$\\lim_{x \\to \\infty} \\frac{${a}x^3 ${c >= 0 ? '+' : ''}${c}x}{${b}x^2 ${d >= 0 ? '+' : ''}${d}} = \\lim_{x \\to \\infty} \\frac{${a}x + \\frac{${c}}{x}}{${b} + \\frac{${d}}{x^2}}$$

**Step 3: Evaluate End-Behavior**
As $x \\to \\infty$, the terms $\\frac{${c}}{x} \\to 0$ and $\\frac{${d}}{x^2} \\to 0$:
$$\\frac{${a}x + 0}{${b} + 0} = \\frac{${a}}{${b}} x \\to +\\infty$$
Thus, the limit grows without bound: $\\infty$ (or Does Not Exist).

⚠️ **Common Pitfall & Pro-Tip:**
When the numerator degree exceeds the denominator degree, there is no horizontal asymptote, and the limit at $\\infty$ is $\\pm\\infty$.`;
  } else {
    numLaTeX = `${a}x ${c >= 0 ? '+' : ''}${c}`;
    denLaTeX = `${b}x^2 ${d >= 0 ? '+' : ''}${d}`;
    correctLaTeX = '0';
    expText = `📌 **Core Concept & Formula:**
When evaluating $\\lim_{x \\to \\infty} \\frac{P(x)}{Q(x)}$, if the degree of the denominator is strictly greater than the degree of the numerator ($\\deg(Q) > \\deg(P)$), the denominator outgrows the numerator, driving the ratio to $0$ ($y = 0$ is the horizontal asymptote).

**Step 1: Compare Degrees**
$$\\text{Degree of Numerator: } \\deg(${numLaTeX}) = 1$$
$$\\text{Degree of Denominator: } \\deg(${denLaTeX}) = 2$$
Since $\\deg(\\text{Numerator}) < \\deg(\\text{Denominator})$, the expression is "bottom-heavy".

**Step 2: Divide by the Highest Power in the Denominator ($x^2$)**
$$\\lim_{x \\to \\infty} \\frac{${a}x ${c >= 0 ? '+' : ''}${c}}{${b}x^2 ${d >= 0 ? '+' : ''}${d}} = \\lim_{x \\to \\infty} \\frac{\\frac{${a}}{x} + \\frac{${c}}{x^2}}{${b} + \\frac{${d}}{x^2}}$$

**Step 3: Evaluate Limits as $x \\to \\infty$**
As $x \\to \\infty$, all reciprocal terms vanish to $0$:
$$\\frac{0 + 0}{${b} + 0} = \\frac{0}{${b}} = 0$$

⚠️ **Common Pitfall & Pro-Tip:**
Any rational function where the denominator has a higher degree than the numerator approaches $0$ as $x \\to \\pm\\infty$.`;
  }

  let distractors = [formatFraction(a, b), '0', '\\infty', formatFraction(b, a), '1', '\\text{Does not exist}'];
  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `Evaluate the limit at infinity:`,
    expressionLaTeX: `\\lim_{x \\to \\infty} \\frac{${numLaTeX}}{${denLaTeX}}`,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Compare the degree of the polynomial in the numerator with the degree in the denominator as $x \\to \\infty$.`,
    explanation: expText
  };
}

// 3. L'Hôpital's Rule Trig / Exponential Limit
export function generateLimitLHopital(difficulty) {
  let a = getRandomInt(2, 6);
  let b = getRandomInt(1, 5);
  let variant = getRandomChoice(['sin', 'exp', 'cos']);

  let questionLaTeX = '';
  let correctLaTeX = '';
  let explanationStr = '';

  if (variant === 'sin') {
    questionLaTeX = `\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${b}x}`;
    correctLaTeX = formatFraction(a, b);
    explanationStr = `📌 **Core Concept & Formula:**
**L'Hôpital's Rule:** If $\\lim_{x \\to c} \\frac{f(x)}{g(x)}$ produces the indeterminate form $\\frac{0}{0}$ or $\\frac{\\pm\\infty}{\\pm\\infty}$, and $f$ and $g$ are differentiable near $c$ with $g'(x) \\neq 0$, then:
$$\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f'(x)}{g'(x)}$$

**Step 1: Test Direct Substitution**
Substitute $x = 0$:
$$\\text{Numerator: } \\sin(${a}(0)) = \\sin(0) = 0$$
$$\\text{Denominator: } ${b}(0) = 0$$
Since this yields $\\frac{0}{0}$, L'Hôpital's Rule applies.

**Step 2: Differentiate Numerator and Denominator Independently**
Applying the Chain Rule to the numerator:
$$\\frac{d}{dx}[\\sin(${a}x)] = ${a}\\cos(${a}x)$$
$$\\frac{d}{dx}[${b}x] = ${b}$$

**Step 3: Set Up and Evaluate the Transformed Limit**
$$\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${b}x} = \\lim_{x \\to 0} \\frac{${a}\\cos(${a}x)}{${b}}$$
Now evaluate by direct substitution at $x = 0$:
$$\\frac{${a}\\cos(${a}(0))}{${b}} = \\frac{${a}\\cos(0)}{${b}} = \\frac{${a}(1)}{${b}} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Do NOT use the Quotient Rule! L'Hôpital's Rule takes the separate derivative of the numerator over the separate derivative of the denominator: $\\frac{f'(x)}{g'(x)}$. Also remember that $\\cos(0) = 1$.`;
  } else if (variant === 'exp') {
    questionLaTeX = `\\lim_{x \\to 0} \\frac{e^{${a}x} - 1}{${b}x}`;
    correctLaTeX = formatFraction(a, b);
    explanationStr = `📌 **Core Concept & Formula:**
**L'Hôpital's Rule:** When direct substitution yields $\\frac{0}{0}$, evaluate $\\lim_{x \\to c} \\frac{f'(x)}{g'(x)}$.

**Step 1: Test Direct Substitution**
Substitute $x = 0$:
$$\\text{Numerator: } e^{${a}(0)} - 1 = e^0 - 1 = 1 - 1 = 0$$
$$\\text{Denominator: } ${b}(0) = 0$$
Because the form is $\\frac{0}{0}$, apply L'Hôpital's Rule.

**Step 2: Differentiate Numerator and Denominator**
$$\\frac{d}{dx}[e^{${a}x} - 1] = ${a}e^{${a}x} - 0 = ${a}e^{${a}x} \\quad \\text{(Chain Rule: } \\frac{d}{dx}[e^{kx}] = k e^{kx}\\text{)}$$
$$\\frac{d}{dx}[${b}x] = ${b}$$

**Step 3: Evaluate the Transformed Limit**
$$\\lim_{x \\to 0} \\frac{e^{${a}x} - 1}{${b}x} = \\lim_{x \\to 0} \\frac{${a}e^{${a}x}}{${b}} = \\frac{${a}e^{${a}(0)}}{${b}} = \\frac{${a}e^0}{${b}} = \\frac{${a}(1)}{${b}} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Remember that $e^0 = 1$ and the derivative of the constant $-1$ is $0$.`;
  } else {
    // 1 - cos(ax) / (b x^2) -> L'hopital twice gives a^2 / (2b)
    let aSq = a * a;
    let twoB = 2 * b;
    questionLaTeX = `\\lim_{x \\to 0} \\frac{1 - \\cos(${a}x)}{${b}x^2}`;
    correctLaTeX = formatFraction(aSq, twoB);
    explanationStr = `📌 **Core Concept & Formula:**
**Repeated L'Hôpital's Rule:** If applying L'Hôpital's Rule once produces another indeterminate form $\\frac{0}{0}$, L'Hôpital's Rule can be applied consecutively:
$$\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f'(x)}{g'(x)} = \\lim_{x \\to c} \\frac{f''(x)}{g''(x)}$$

**Step 1: Check Initial Substitution**
Substitute $x = 0$:
$$\\text{Numerator: } 1 - \\cos(${a}(0)) = 1 - \\cos(0) = 1 - 1 = 0$$
$$\\text{Denominator: } ${b}(0)^2 = 0$$
Form is $\\frac{0}{0}$.

**Step 2: First Application of L'Hôpital's Rule**
$$\\frac{d}{dx}[1 - \\cos(${a}x)] = 0 - (-${a}\\sin(${a}x)) = ${a}\\sin(${a}x)$$
$$\\frac{d}{dx}[${b}x^2] = ${2*b}x$$
This gives the new limit:
$$\\lim_{x \\to 0} \\frac{${a}\\sin(${a}x)}{${2*b}x}$$

**Step 3: Test Intermediate Limit & Apply L'Hôpital's Rule Again**
Substituting $x = 0$ into $\\frac{${a}\\sin(${a}x)}{${2*b}x}$ gives $\\frac{${a}\\sin(0)}{${2*b}(0)} = \\frac{0}{0}$.
Differentiating a second time:
$$\\frac{d}{dx}[${a}\\sin(${a}x)] = ${a}(${a}\\cos(${a}x)) = ${aSq}\\cos(${a}x)$$
$$\\frac{d}{dx}[${2*b}x] = ${twoB}$$

**Step 4: Final Limit Evaluation**
$$\\lim_{x \\to 0} \\frac{${aSq}\\cos(${a}x)}{${twoB}} = \\frac{${aSq}\\cos(0)}{${twoB}} = \\frac{${aSq}(1)}{${twoB}} = ${correctLaTeX}$$

⚠️ **Common Pitfall & Pro-Tip:**
Be careful with the negative signs: $\\frac{d}{dx}[-\\cos(kx)] = +k\\sin(kx)$.`;
  }

  let distractors = [
    formatFraction(1, b),
    formatFraction(a*a, b),
    '0',
    '1',
    '\\text{Does not exist}'
  ];

  let choiceData = createChoiceOptions(correctLaTeX, distractors);

  return {
    topic: 'Limits & Continuity',
    questionText: `Evaluate the limit using algebraic methods or L'Hôpital's Rule:`,
    expressionLaTeX: questionLaTeX,
    choices: choiceData.choices,
    correctIndex: choiceData.correctIndex,
    hint: `Substitution gives $\\frac{0}{0}$. Differentiate the numerator and denominator separately with respect to $x$.`,
    explanation: explanationStr
  };
}

// 4. Piecewise Function Continuity Parameter Search
export function generatePiecewiseContinuity(difficulty) {
  let c = getRandomInt(1, 4);
  let a = getRandomInt(2, 5);
  let b = getRandomInt(1, 3);
  let d = getRandomInt(-5, 5);

  // f(x) = ax + k for x <= c, and b x^2 + d for x > c
  // Continuity at x = c => ac + k = b c^2 + d => k = b c^2 + d - ac
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
    hint: `For continuity at $x = ${c}$, set the left-hand limit $\\lim_{x \\to ${c}^-} f(x)$ equal to the right-hand limit $\\lim_{x \\to ${c}^+} f(x)$ and solve for $k$.`,
    explanation: `📌 **Core Concept & Formula:**
A function $f(x)$ is **continuous at $x = c$** if and only if three conditions hold:
1. $f(c)$ is defined.
2. The two-sided limit $\\lim_{x \\to c} f(x)$ exists, which requires $\\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x)$.
3. $\\lim_{x \\to c} f(x) = f(c)$.

**Step 1: Compute the Left-Hand Limit & Function Value ($x \\le ${c}$)**
Use the upper definition piece $f(x) = ${a}x + k$:
$$f(${c}) = \\lim_{x \\to ${c}^-} (${a}x + k) = ${a}(${c}) + k = ${leftLimitNoK} + k$$

**Step 2: Compute the Right-Hand Limit ($x > ${c}$)**
Use the lower definition piece $f(x) = ${b}x^2 ${d >= 0 ? '+' : ''}${d}$:
$$\\lim_{x \\to ${c}^+} (${b}x^2 ${d >= 0 ? '+' : ''}${d}) = ${b}(${c})^2 ${d >= 0 ? '+' : ''}${d} = ${b}(${c*c}) ${d >= 0 ? '+' : ''}${d} = ${b*c*c} ${d >= 0 ? '+' : ''}${d} = ${rightLimit}$$

**Step 3: Set One-Sided Limits Equal & Solve for $k$**
For $f(x)$ to be continuous at the transition point $x = ${c}$, the left-hand and right-hand limits must match:
$${leftLimitNoK} + k = ${rightLimit}$$
Subtract $${leftLimitNoK}$$ from both sides:
$$k = ${rightLimit} - ${leftLimitNoK} = ${kVal}$$

⚠️ **Common Pitfall & Pro-Tip:**
Continuity tests the function values matching at the boundary ($f(c^-) = f(c^+)$). Differentiability would test derivative slopes matching ($f'(c^-) = f'(c^+)$). Do not differentiate when solving for continuity.`
  };
}
