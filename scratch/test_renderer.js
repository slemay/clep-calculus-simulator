import { generateCLEPExam } from '../js/generators/examEngine.js';

function formatExplanationMarkdown(text) {
  if (!text) return '';
  let str = String(text);
  str = str.replace(/\\texttt\{([^}]+)\}/g, '<code class="calc-code">$1</code>');
  str = str.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return str;
}

function renderStructuredExplanation(rawText) {
  if (!rawText) return '<p>Apply standard rules and definitions for this topic.</p>';
  rawText = String(rawText).trim();
  const hasConcept = rawText.includes('Core Concept');
  const hasSteps = /Step\s*\d+:/i.test(rawText);
  const hasPitfall = rawText.includes('Common Pitfall') || rawText.includes('Pro-Tip') || rawText.includes('Key Takeaway');

  if (!hasConcept && !hasSteps && !hasPitfall) {
    const paragraphs = rawText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    if (paragraphs.length === 0) return `<p>${formatExplanationMarkdown(rawText)}</p>`;
    return paragraphs.map(p => {
      const formatted = p.split('\n').map(l => formatExplanationMarkdown(l.trim())).join('<br>');
      return `<p style="margin-bottom: 0.65rem; line-height: 1.65;">${formatted}</p>`;
    }).join('');
  }

  const lines = rawText.split('\n');
  let html = '<div class="solution-details-wrapper">';
  let currentSectionType = 'general';
  let currentHeader = '';
  let currentContentLines = [];

  const flushCurrentSection = () => {
    if (currentContentLines.length === 0 && !currentHeader) return;
    const contentBody = currentContentLines
      .join('\n')
      .split('\n\n')
      .map(para => {
        let pTrim = para.trim();
        if (!pTrim) return '';
        let formattedLines = pTrim.split('\n').map(l => formatExplanationMarkdown(l.trim())).join('<br>');
        return `<p style="margin-bottom: 0.5rem; line-height: 1.65;">${formattedLines}</p>`;
      })
      .filter(Boolean)
      .join('');

    if (currentSectionType === 'concept') {
      html += `
        <div class="solution-concept-card">
          <div class="concept-header">
            <span class="concept-icon">📌</span>
            <span class="concept-title">${currentHeader || 'Core Concept & Formula'}</span>
          </div>
          <div class="concept-body">${contentBody}</div>
        </div>
      `;
    } else if (currentSectionType === 'step') {
      const stepMatch = currentHeader.match(/Step\s*(\d+):?\s*(.*)/i);
      const stepNum = stepMatch ? `Step ${stepMatch[1]}` : 'Step';
      let stepTitle = stepMatch && stepMatch[2] ? stepMatch[2].trim() : '';
      stepTitle = stepTitle.replace(/^\*{1,3}|\*{1,3}$/g, '').trim();

      html += `
        <div class="solution-step-card">
          <div class="step-card-header">
            <span class="step-badge">${stepNum}</span>
            ${stepTitle ? `<span class="step-title">${stepTitle}</span>` : ''}
          </div>
          <div class="step-card-body">${contentBody}</div>
        </div>
      `;
    } else if (currentSectionType === 'pitfall') {
      html += `
        <div class="solution-pitfall-card">
          <div class="pitfall-header">
            <span class="pitfall-icon">⚠️</span>
            <span class="pitfall-title">${currentHeader || 'Common Pitfall & Pro-Tip'}</span>
          </div>
          <div class="pitfall-body">${contentBody}</div>
        </div>
      `;
    } else if (contentBody) {
      html += `<div class="solution-general-block">${contentBody}</div>`;
    }

    currentHeader = '';
    currentContentLines = [];
  };

  for (let line of lines) {
    let trimmed = line.trim();
    if (/^(📌\s*)?\*{0,2}Core Concept/i.test(trimmed)) {
      flushCurrentSection();
      currentSectionType = 'concept';
      currentHeader = trimmed.replace(/^[📌\s*]+/, '').replace(/^[:\s*]+|[:\s*]+$/g, '').trim();
    } else if (/^\*{0,2}Step\s*\d+:/i.test(trimmed)) {
      flushCurrentSection();
      currentSectionType = 'step';
      currentHeader = trimmed.replace(/^\*{0,2}/, '').replace(/\*{0,2}$/, '').trim();
    } else if (/^(⚠️\s*)?\*{0,2}(Common Pitfall|Key Takeaway|Pro-Tip)/i.test(trimmed)) {
      flushCurrentSection();
      currentSectionType = 'pitfall';
      currentHeader = trimmed.replace(/^[⚠️\s*]+/, '').replace(/^[:\s*]+|[:\s*]+$/g, '').trim();
    } else {
      currentContentLines.push(line);
    }
  }

  flushCurrentSection();
  html += '</div>';
  return html;
}

const exam = generateCLEPExam('medium');
for (let i = 0; i < 5; i++) {
  const q = exam.section1.questions[i];
  console.log(`=== Q${i+1}: ${q.topic} ===`);
  console.log(renderStructuredExplanation(q.explanation));
}
