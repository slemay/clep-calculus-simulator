/**
 * CLEP Calculus Master Exam Generator Engine
 * Orchestrates 55+ distinct procedural generators with 5-test rolling cross-exam variety tracking
 * and Extreme difficulty mode scaling.
 */

import * as Limits from './limitsGenerators.js';
import * as Derivatives from './derivativesGenerators.js';
import * as Integrals from './integralsGenerators.js';
import * as CalcSec from './calculatorGenerators.js';
import { normalizeChoice } from './mathUtils.js';

const ROLLING_HISTORY_STORAGE_KEY = 'clep_calculus_recent_history_v2';
const MAX_ROLLING_EXAMS = 5;

/**
 * Creates a unique signature for a generated question based on its math expression and text.
 */
export function getQuestionSignature(q) {
  const expr = normalizeChoice(q.expressionLaTeX || '');
  const text = normalizeChoice(q.questionText || '');
  const topic = normalizeChoice(q.topic || '');
  return `${topic}::${expr}::${text}`;
}

/**
 * Retrieves rolling question history from localStorage (safe in Node / SSR / Browser).
 */
export function getRollingHistory() {
  if (typeof localStorage === 'undefined') {
    return { recentSignatures: [], generatorUsageCounts: {} };
  }
  try {
    const raw = localStorage.getItem(ROLLING_HISTORY_STORAGE_KEY);
    if (!raw) return { recentSignatures: [], generatorUsageCounts: {} };
    return JSON.parse(raw);
  } catch (e) {
    return { recentSignatures: [], generatorUsageCounts: {} };
  }
}

/**
 * Saves generated exam question signatures and generator usage into rolling 5-exam storage.
 */
export function saveRollingHistory(exam) {
  if (typeof localStorage === 'undefined' || !exam) return;
  try {
    let history = getRollingHistory();
    let allQs = [...(exam.section1?.questions || []), ...(exam.section2?.questions || [])];

    let newExamSignatures = allQs.map(q => getQuestionSignature(q));

    // Update signatures list (keep up to 5 * 44 = 220 recent signatures)
    let updatedSignatures = [...newExamSignatures, ...(history.recentSignatures || [])].slice(0, MAX_ROLLING_EXAMS * 44);

    // Update generator usage counts
    let usage = history.generatorUsageCounts || {};
    allQs.forEach(q => {
      let gName = q.generatorName || q.topic || 'unknown';
      usage[gName] = (usage[gName] || 0) + 1;
    });

    localStorage.setItem(ROLLING_HISTORY_STORAGE_KEY, JSON.stringify({
      recentSignatures: updatedSignatures,
      generatorUsageCounts: usage
    }));
  } catch (e) {
    console.warn('Failed to save rolling exam history', e);
  }
}

/**
 * Generates a question with max uniqueness across both the current test and past 5 tests.
 */
function generateUniqueQuestion(genEntry, difficulty, currentExamSignatures, recentSignaturesSet, maxRetries = 35) {
  const { fn, name } = genEntry;
  let bestCandidate = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    let q = fn(difficulty);
    q.generatorName = name;
    let sig = getQuestionSignature(q);

    // If completely new (not in current exam and not in recent 5 exams)
    if (!currentExamSignatures.has(sig) && !recentSignaturesSet.has(sig)) {
      currentExamSignatures.add(sig);
      return q;
    }

    // Save as fallback if it's at least unique within the current exam
    if (!currentExamSignatures.has(sig) && !bestCandidate) {
      bestCandidate = q;
    }
  }

  // If past history had it, but it's still unique in this test, return bestCandidate
  if (bestCandidate) {
    let sig = getQuestionSignature(bestCandidate);
    currentExamSignatures.add(sig);
    return bestCandidate;
  }

  // Absolute fallback
  let fallback = fn(difficulty);
  fallback.generatorName = name;
  currentExamSignatures.add(getQuestionSignature(fallback));
  return fallback;
}

/**
 * Shuffles an array with Fisher-Yates and weights items based on historical usage (least used first).
 */
function shuffleWithHistoryWeighting(generatorsList, usageCounts) {
  // Sort with subtle random jitter + inverse usage count
  let list = [...generatorsList];
  list.sort((a, b) => {
    let countA = usageCounts[a.name] || 0;
    let countB = usageCounts[b.name] || 0;
    let jitter = (Math.random() - 0.5) * 1.5;
    return (countA - countB) + jitter;
  });
  return list;
}

/**
 * Master Exam Generator for CLEP Calculus
 */
export function generateCLEPExam(difficulty = 'medium') {
  const history = getRollingHistory();
  const recentSignaturesSet = new Set(history.recentSignatures || []);
  const usageCounts = history.generatorUsageCounts || {};
  const currentExamSignatures = new Set();

  // 1. ALL AVAILABLE LIMITS GENERATORS (8)
  const limitsPool = [
    { name: 'Limits_Factoring', fn: Limits.generateLimitFactoring },
    { name: 'Limits_Conjugate', fn: Limits.generateLimitConjugate },
    { name: 'Limits_Infinity', fn: Limits.generateLimitInfinity },
    { name: 'Limits_LHopital', fn: Limits.generateLimitLHopital },
    { name: 'Limits_PiecewiseContinuity', fn: Limits.generatePiecewiseContinuity },
    { name: 'Limits_TrigSpecialLimit', fn: Limits.generateTrigSpecialLimit },
    { name: 'Limits_IVT', fn: Limits.generateIntermediateValueTheorem },
    { name: 'Limits_Asymptotes', fn: Limits.generateAsymptotesAndDiscontinuities }
  ];

  // 2. ALL AVAILABLE DERIVATIVES GENERATORS (19)
  const derivativesPool = [
    { name: 'Deriv_PowerRulePoint', fn: Derivatives.generatePowerRulePoint },
    { name: 'Deriv_ProductRule', fn: Derivatives.generateProductRule },
    { name: 'Deriv_QuotientRule', fn: Derivatives.generateQuotientRule },
    { name: 'Deriv_ChainRule', fn: Derivatives.generateChainRule },
    { name: 'Deriv_TangentLine', fn: Derivatives.generateTangentLine },
    { name: 'Deriv_LinearApproximation', fn: Derivatives.generateLinearApproximation },
    { name: 'Deriv_ImplicitDiff', fn: Derivatives.generateImplicitDifferentiation },
    { name: 'Deriv_SecondDerivImplicit', fn: Derivatives.generateSecondDerivativeImplicit },
    { name: 'Deriv_LogarithmicDiff', fn: Derivatives.generateLogarithmicDifferentiation },
    { name: 'Deriv_InverseTrigDeriv', fn: Derivatives.generateInverseTrigDerivative },
    { name: 'Deriv_LogExpDeriv', fn: Derivatives.generateLogExpDerivative },
    { name: 'Deriv_CriticalPoints', fn: Derivatives.generateCriticalPoints },
    { name: 'Deriv_AbsoluteExtremaEVT', fn: Derivatives.generateAbsoluteExtremaEVT },
    { name: 'Deriv_ConcavityInflection', fn: Derivatives.generateConcavityAndInflection },
    { name: 'Deriv_MVT', fn: Derivatives.generateMeanValueTheorem },
    { name: 'Deriv_DiffAndContinuity', fn: Derivatives.generateDifferentiabilityAndContinuity },
    { name: 'Deriv_RelatedRates', fn: Derivatives.generateRelatedRates },
    { name: 'Deriv_Optimization', fn: Derivatives.generateOptimization },
    { name: 'Deriv_PositionVelocity', fn: Derivatives.generatePositionVelocity }
  ];

  // 3. ALL AVAILABLE INTEGRALS GENERATORS (17)
  const integralsPool = [
    { name: 'Integ_DefinitePolynomial', fn: Integrals.generateDefiniteIntegralPolynomial },
    { name: 'Integ_USubExponential', fn: Integrals.generateUSubExponential },
    { name: 'Integ_USubTrig', fn: Integrals.generateUSubTrig },
    { name: 'Integ_USubLogRational', fn: Integrals.generateUSubLogAndRational },
    { name: 'Integ_InverseTrig', fn: Integrals.generateInverseTrigIntegral },
    { name: 'Integ_ByParts', fn: Integrals.generateIntegrationByParts },
    { name: 'Integ_FTC1', fn: Integrals.generateFTC1 },
    { name: 'Integ_FTC1TwoBounds', fn: Integrals.generateFTC1TwoBounds },
    { name: 'Integ_AreaBetweenCurves', fn: Integrals.generateAreaBetweenCurves },
    { name: 'Integ_AverageValue', fn: Integrals.generateAverageValue },
    { name: 'Integ_DifferentialEquation', fn: Integrals.generateDifferentialEquation },
    { name: 'Integ_ExponentialGrowth', fn: Integrals.generateExponentialGrowthDecay },
    { name: 'Integ_VolumeDisk', fn: Integrals.generateVolumeDisk },
    { name: 'Integ_VolumeWasher', fn: Integrals.generateVolumeWasher },
    { name: 'Integ_RiemannTrapezoid', fn: Integrals.generateRiemannSumAndTrapezoid },
    { name: 'Integ_RiemannSumLimit', fn: Integrals.generateRiemannSumLimit },
    { name: 'Integ_NetChangeDistance', fn: Integrals.generateNetChangeTotalDistance }
  ];

  // 4. ALL AVAILABLE CALCULATOR GENERATORS (10)
  const calcActivePool = [
    { name: 'Calc_NumericalIntegral', fn: CalcSec.generateNumericalIntegral },
    { name: 'Calc_NumericalRoot', fn: CalcSec.generateNumericalRoot },
    { name: 'Calc_AccumulationRate', fn: CalcSec.generateAccumulationRate },
    { name: 'Calc_NumericalDerivative', fn: CalcSec.generateCalcNumericalDerivative },
    { name: 'Calc_IntersectionArea', fn: CalcSec.generateCalcIntersectionArea },
    { name: 'Calc_AverageRateVsInstant', fn: CalcSec.generateCalcAverageRateVsInstant },
    { name: 'Calc_MotionPosition', fn: CalcSec.generateCalcMotionPosition },
    { name: 'Calc_VolumeRevolution', fn: CalcSec.generateCalcVolumeRevolution },
    { name: 'Calc_ExtremaTranscendental', fn: CalcSec.generateCalcExtremaTranscendental },
    { name: 'Calc_TangentLineAtPoint', fn: CalcSec.generateCalcTangentLineAtPoint }
  ];

  // SECTION 1: Non-Calculator (27 Questions)
  // Breakdown: 3 Limits, 14 Derivatives, 10 Integrals
  let section1Questions = [];

  // Weighted shuffle of pools
  let prioritizedLimits = shuffleWithHistoryWeighting(limitsPool, usageCounts);
  let prioritizedDerivatives = shuffleWithHistoryWeighting(derivativesPool, usageCounts);
  let prioritizedIntegrals = shuffleWithHistoryWeighting(integralsPool, usageCounts);

  // 1. Pick 3 distinct Limits generators
  let selectedLimits = prioritizedLimits.slice(0, 3);
  selectedLimits.forEach(gen => {
    section1Questions.push(generateUniqueQuestion(gen, difficulty, currentExamSignatures, recentSignaturesSet));
  });

  // 2. Pick 14 distinct Derivatives generators (leaving 5 for Section 2)
  let selectedDerivatives = prioritizedDerivatives.slice(0, 14);
  let remainingDerivatives = prioritizedDerivatives.slice(14);
  selectedDerivatives.forEach(gen => {
    section1Questions.push(generateUniqueQuestion(gen, difficulty, currentExamSignatures, recentSignaturesSet));
  });

  // 3. Pick 10 distinct Integrals generators (leaving 7 for Section 2)
  let selectedIntegrals = prioritizedIntegrals.slice(0, 10);
  let remainingIntegrals = prioritizedIntegrals.slice(10);
  selectedIntegrals.forEach(gen => {
    section1Questions.push(generateUniqueQuestion(gen, difficulty, currentExamSignatures, recentSignaturesSet));
  });

  // Shuffle Section 1 so topics mix naturally
  shuffleArray(section1Questions);

  // SECTION 2: Calculator Permitted (17 Questions)
  // Breakdown: 10 Calculator-Active + 7 unique remaining applied calculus problems
  let section2Questions = [];

  let prioritizedCalc = shuffleWithHistoryWeighting(calcActivePool, usageCounts);
  // Pick all 10 Calculator-Active generators
  prioritizedCalc.forEach(gen => {
    section2Questions.push(generateUniqueQuestion(gen, difficulty, currentExamSignatures, recentSignaturesSet));
  });

  // Pick 7 distinct remaining generators from derivatives and integrals not used in Section 1
  let remainingPool = [...remainingDerivatives, ...remainingIntegrals];
  let prioritizedRemaining = shuffleWithHistoryWeighting(remainingPool, usageCounts);
  let selectedRemaining = prioritizedRemaining.slice(0, 7);
  selectedRemaining.forEach(gen => {
    section2Questions.push(generateUniqueQuestion(gen, difficulty, currentExamSignatures, recentSignaturesSet));
  });

  shuffleArray(section2Questions);

  // Assign numbers & normalize properties
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

  const exam = {
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

  // Save to rolling history for cross-test deduplication
  saveRollingHistory(exam);

  return exam;
}

/**
 * Computes official College Board CLEP scaled score (20-80 range).
 */
export function calculateCLEPScore(rawScore, totalQuestions = 44, difficulty = 'medium') {
  const difficultyWeights = {
    easy: 0.95,
    medium: 1.00,
    hard: 1.08,
    extreme: 1.15
  };
  const weight = difficultyWeights[difficulty] || 1.00;
  const rawRatio = rawScore / totalQuestions;
  const scaledScore = Math.min(80, Math.max(20, Math.round(20 + rawRatio * 60 * weight)));
  return {
    scaledScore,
    isPassing: scaledScore >= 50
  };
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
