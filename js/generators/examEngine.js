/**
 * CLEP Calculus Master Exam Generator Engine
 */

import * as Limits from './limitsGenerators.js';
import * as Derivatives from './derivativesGenerators.js';
import * as Integrals from './integralsGenerators.js';
import * as CalcSec from './calculatorGenerators.js';
import { normalizeChoice } from './mathUtils.js';

/**
 * Creates a unique signature for a generated question based on its math expression and text.
 */
function getQuestionSignature(q) {
  const expr = normalizeChoice(q.expressionLaTeX || '');
  const text = normalizeChoice(q.questionText || '');
  return `${expr}::${text}`;
}

/**
 * Helper to generate a question guaranteed to be unique within the current exam.
 */
function generateUniqueQuestion(genFn, difficulty, seenSignatures, maxRetries = 30) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    let q = genFn(difficulty);
    let sig = getQuestionSignature(q);

    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      return q;
    }
  }
  // Fallback if maxRetries exhausted
  let fallback = genFn(difficulty);
  seenSignatures.add(getQuestionSignature(fallback));
  return fallback;
}

export function generateCLEPExam(difficulty = 'medium') {
  let section1Questions = [];
  let section2Questions = [];
  let seenSignatures = new Set();

  // SECTION 1: Non-Calculator (27 Questions)
  // Breakdown: 3 Limits, 14 Derivatives, 10 Integrals

  // 1. Limits (3 questions)
  let limitsGenerators = [
    Limits.generateLimitFactoring,
    Limits.generateLimitInfinity,
    Limits.generateLimitLHopital,
    Limits.generatePiecewiseContinuity
  ];
  shuffleArray(limitsGenerators);

  for (let i = 0; i < 3; i++) {
    let gen = limitsGenerators[i % limitsGenerators.length];
    section1Questions.push(generateUniqueQuestion(gen, difficulty, seenSignatures));
  }

  // 2. Derivatives (14 questions)
  let derivativeGenerators = [
    Derivatives.generatePowerRulePoint,
    Derivatives.generateProductRule,
    Derivatives.generateQuotientRule,
    Derivatives.generateChainRule,
    Derivatives.generateTangentLine,
    Derivatives.generateImplicitDifferentiation,
    Derivatives.generateCriticalPoints,
    Derivatives.generateMeanValueTheorem,
    Derivatives.generateRelatedRates,
    Derivatives.generateOptimization,
    Derivatives.generatePositionVelocity
  ];
  shuffleArray(derivativeGenerators);

  for (let i = 0; i < 14; i++) {
    let gen = derivativeGenerators[i % derivativeGenerators.length];
    section1Questions.push(generateUniqueQuestion(gen, difficulty, seenSignatures));
  }

  // 3. Integrals (10 questions)
  let integralGenerators = [
    Integrals.generateDefiniteIntegralPolynomial,
    Integrals.generateUSubExponential,
    Integrals.generateFTC1,
    Integrals.generateAreaBetweenCurves,
    Integrals.generateAverageValue,
    Integrals.generateDifferentialEquation,
    Integrals.generateUSubTrig,
    Integrals.generateVolumeDisk
  ];
  shuffleArray(integralGenerators);

  for (let i = 0; i < 10; i++) {
    let gen = integralGenerators[i % integralGenerators.length];
    section1Questions.push(generateUniqueQuestion(gen, difficulty, seenSignatures));
  }

  // Shuffle Section 1 questions so topics are mixed naturally
  shuffleArray(section1Questions);

  // SECTION 2: Calculator Permitted (17 Questions)
  let calcGenerators = [
    CalcSec.generateNumericalIntegral,
    CalcSec.generateNumericalRoot,
    CalcSec.generateAccumulationRate,
    Derivatives.generateRelatedRates,
    Derivatives.generateOptimization,
    Derivatives.generatePositionVelocity,
    Integrals.generateVolumeDisk,
    Integrals.generateAreaBetweenCurves,
    Derivatives.generateCriticalPoints,
    Integrals.generateDifferentialEquation
  ];
  shuffleArray(calcGenerators);

  for (let i = 0; i < 17; i++) {
    let gen = calcGenerators[i % calcGenerators.length];
    section2Questions.push(generateUniqueQuestion(gen, difficulty, seenSignatures));
  }
  shuffleArray(section2Questions);

  // Assign question IDs, numbers & ensure explanation properties
  let qNum = 1;
  section1Questions.forEach(q => {
    q.id = `q_${qNum}`;
    q.number = qNum;
    q.section = 1;
    q.explanationLaTeX = q.explanationLaTeX || q.explanation || '';
    q.explanation = q.explanation || q.explanationLaTeX || '';
    qNum++;
  });

  section2Questions.forEach(q => {
    q.id = `q_${qNum}`;
    q.number = qNum;
    q.section = 2;
    q.explanationLaTeX = q.explanationLaTeX || q.explanation || '';
    q.explanation = q.explanation || q.explanationLaTeX || '';
    qNum++;
  });

  return {
    difficulty,
    createdAt: new Date().toISOString(),
    section1: {
      title: 'Section 1: Non-Calculator',
      questionCount: 27,
      timeLimitMinutes: 50,
      calculatorAllowed: false,
      questions: section1Questions
    },
    section2: {
      title: 'Section 2: Calculator Permitted',
      questionCount: 17,
      timeLimitMinutes: 40,
      calculatorAllowed: true,
      questions: section2Questions
    }
  };
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
