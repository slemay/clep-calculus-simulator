import { generateCLEPExam } from '../js/generators/examEngine.js';

const exam = generateCLEPExam('medium');
console.log("Section 1 Question Count:", exam.section1.questions.length);
console.log("Section 2 Question Count:", exam.section2.questions.length);

let missingCount = 0;
const allQs = [...exam.section1.questions, ...exam.section2.questions];

allQs.forEach((q, idx) => {
  if (!q.explanation && !q.explanationLaTeX) {
    console.error(`Question ${idx + 1} (${q.topic}) HAS NO EXPLANATION!`, q);
    missingCount++;
  } else {
    console.log(`Q${idx + 1} (${q.topic}):`, {
      hasExplanation: !!q.explanation,
      hasExplanationLaTeX: !!q.explanationLaTeX,
      sample: (q.explanation || q.explanationLaTeX).substring(0, 60) + '...'
    });
  }
});

console.log("Total missing explanations:", missingCount);
