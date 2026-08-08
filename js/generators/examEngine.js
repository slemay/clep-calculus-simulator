/**
 * CLEP Calculus Master Exam Generator Engine
 */

import * as Limits from './limitsGenerators.js';
import * as Derivatives from './derivativesGenerators.js';
import * as Integrals from './integralsGenerators.js';
import * as CalcSec from './calculatorGenerators.js';

export function generateCLEPExam(difficulty = 'medium') {
  let section1Questions = [];
  let section2Questions = [];

  // SECTION 1: Non-Calculator (27 Questions)
  // Target Breakdown: ~3 Limits, ~14 Derivatives, ~10 Integrals

  // 1. Limits (~3 questions)
  let limitsGenerators = [
    Limits.generateLimitFactoring,
    Limits.generateLimitInfinity,
    Limits.generateLimitLHopital,
    Limits.generatePiecewiseContinuity
  ];
  for (let i = 0; i < 3; i++) {
    let gen = limitsGenerators[i % limitsGenerators.length];
    section1Questions.push(gen(difficulty));
  }

  // 2. Derivatives (~14 questions)
  let derivativeGenerators = [
    Derivatives.generatePowerRulePoint,
    Derivatives.generateProductRule,
    Derivatives.generateQuotientRule,
    Derivatives.generateChainRule,
    Derivatives.generateTangentLine,
    Derivatives.generateImplicitDifferentiation,
    Derivatives.generateCriticalPoints,
    Derivatives.generateMeanValueTheorem
  ];
  for (let i = 0; i < 14; i++) {
    let gen = derivativeGenerators[i % derivativeGenerators.length];
    section1Questions.push(gen(difficulty));
  }

  // 3. Integrals (~10 questions)
  let integralGenerators = [
    Integrals.generateDefiniteIntegralPolynomial,
    Integrals.generateUSubExponential,
    Integrals.generateFTC1,
    Integrals.generateAreaBetweenCurves,
    Integrals.generateAverageValue,
    Integrals.generateDifferentialEquation
  ];
  for (let i = 0; i < 10; i++) {
    let gen = integralGenerators[i % integralGenerators.length];
    section1Questions.push(gen(difficulty));
  }

  // Shuffle Section 1 questions so topics are mixed naturally
  shuffleArray(section1Questions);

  // SECTION 2: Calculator Permitted (17 Questions)
  let calcGenerators = [
    CalcSec.generateNumericalIntegral,
    CalcSec.generateNumericalRoot,
    CalcSec.generateAccumulationRate,
    Derivatives.generateTangentLine,
    Integrals.generateUSubExponential,
    Derivatives.generateCriticalPoints,
    Integrals.generateAreaBetweenCurves
  ];
  for (let i = 0; i < 17; i++) {
    let gen = calcGenerators[i % calcGenerators.length];
    section2Questions.push(gen(difficulty));
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
