/**
 * CLEP Calculus Main Web Application Controller
 */

import { generateCLEPExam } from './generators/examEngine.js';

class CLEPCalculusApp {
  constructor() {
    this.currentExam = null;
    this.currentSectionNum = 1;
    this.currentQuestionIdx = 0;
    this.userAnswers = {}; // { q_1: choiceIndex }
    this.flaggedQuestions = new Set();
    this.timerInterval = null;
    this.secondsRemaining = 0;

    this.testMode = 'exam';
    this.storageKey = 'clep_calculus_active_exam';
    this.historyStorageKey = 'clep_calculus_exam_history';
    this.checkedQuestions = new Set();

    this.initDOM();
    if (!this.restoreState()) {
      this.showDashboard();
    }
  }

  initDOM() {
    // Buttons
    document.getElementById('startExamBtn').addEventListener('click', () => this.startExam());
    document.getElementById('prevQuestionBtn').addEventListener('click', () => this.navigateQuestion(-1));
    document.getElementById('nextQuestionBtn').addEventListener('click', () => this.navigateQuestion(1));
    document.getElementById('flagQuestionBtn').addEventListener('click', () => this.toggleFlag());
    document.getElementById('hintBtn').addEventListener('click', () => this.showHintModal());
    document.getElementById('checkAnsBtn').addEventListener('click', () => this.checkCurrentAnswer());
    document.getElementById('closeHintModalBtn').addEventListener('click', () => this.closeHintModal());
    document.getElementById('gotItHintBtn').addEventListener('click', () => this.closeHintModal());
    document.getElementById('closeSectionSubmitModalBtn').addEventListener('click', () => this.closeSectionSubmitModal());
    document.getElementById('quitExamBtn').addEventListener('click', () => this.showQuitModal());
    document.getElementById('closeQuitModalBtn').addEventListener('click', () => this.closeQuitModal());
    document.getElementById('cancelQuitBtn').addEventListener('click', () => this.closeQuitModal());
    document.getElementById('confirmQuitBtn').addEventListener('click', () => this.executeQuitExam());
    document.getElementById('retakeExamBtn').addEventListener('click', () => this.showDashboard());
    document.getElementById('clearHistoryBtn').addEventListener('click', () => this.confirmClearHistory());
    document.getElementById('togglePaletteBtn').addEventListener('click', () => this.togglePalette());
    document.getElementById('closePaletteBtn').addEventListener('click', () => this.togglePalette(false));
    document.getElementById('pauseExamBtn')?.addEventListener('click', () => this.pausePracticeSession());
    document.getElementById('resumeExamBtn')?.addEventListener('click', () => this.resumePracticeSession());
    document.getElementById('closePauseModalBtn')?.addEventListener('click', () => this.resumePracticeSession());
    const pauseModal = document.getElementById('pauseModalContainer');
    if (pauseModal) {
      pauseModal.addEventListener('click', (e) => {
        if (e.target === pauseModal) this.resumePracticeSession();
      });
    }

    // Help Modal listeners
    document.getElementById('helpBtn')?.addEventListener('click', () => this.showHelpModal());
    document.getElementById('closeHelpModalBtn')?.addEventListener('click', () => this.closeHelpModal());
    document.getElementById('gotItHelpBtn')?.addEventListener('click', () => this.closeHelpModal());
    const helpModal = document.getElementById('helpModalContainer');
    if (helpModal) {
      helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) this.closeHelpModal();
      });
    }

    // Radio selection visual updates
    document.querySelectorAll('.radio-option input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => this.updateRadioSelections());
    });
    this.updateRadioSelections();

    // Theme initialization
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('clep_calculus_theme');
    let theme = savedTheme;
    if (!theme) {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    this.applyTheme(theme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem('clep_calculus_theme', newTheme);
    this.showToast(`Switched to ${newTheme === 'light' ? 'Light' : 'Dark'} Mode`, 'info', 2000);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const iconElem = document.getElementById('themeToggleIcon');
    const labelElem = document.getElementById('themeToggleLabel');
    if (iconElem && labelElem) {
      if (theme === 'light') {
        iconElem.innerText = '🌙';
        labelElem.innerText = 'Dark';
      } else {
        iconElem.innerText = '☀️';
        labelElem.innerText = 'Light';
      }
    }
  }

  showHelpModal() {
    const modal = document.getElementById('helpModalContainer');
    if (modal) modal.classList.remove('hidden');
  }

  closeHelpModal() {
    const modal = document.getElementById('helpModalContainer');
    if (modal) modal.classList.add('hidden');
  }

  updateRadioSelections() {
    document.querySelectorAll('.radio-option').forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio && radio.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    });
  }

  saveState() {
    if (!this.currentExam) return;
    try {
      const data = {
        currentExam: this.currentExam,
        currentSectionNum: this.currentSectionNum,
        currentQuestionIdx: this.currentQuestionIdx,
        userAnswers: this.userAnswers,
        flaggedQuestions: Array.from(this.flaggedQuestions),
        checkedQuestions: Array.from(this.checkedQuestions),
        secondsRemaining: this.secondsRemaining,
        testMode: this.testMode,
        savedAt: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save exam state to localStorage', e);
    }
  }

  clearState() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {}
  }

  restoreState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.currentExam) return false;

      this.currentExam = data.currentExam;
      this.currentSectionNum = data.currentSectionNum || 1;
      this.currentQuestionIdx = data.currentQuestionIdx || 0;
      this.userAnswers = data.userAnswers || {};
      this.flaggedQuestions = new Set(data.flaggedQuestions || []);
      this.checkedQuestions = new Set(data.checkedQuestions || []);
      this.testMode = data.testMode || 'exam';

      // Normalize all questions in restored exam
      if (this.currentExam) {
        this.normalizeExamExplanations(this.currentExam);
      }

      const elapsedSecs = Math.floor((Date.now() - (data.savedAt || Date.now())) / 1000);
      this.secondsRemaining = Math.max(0, (data.secondsRemaining || 0) - elapsedSecs);

      document.getElementById('dashboardView').classList.add('hidden');
      document.getElementById('resultsView').classList.add('hidden');
      document.getElementById('examView').classList.remove('hidden');

      this.resumeSection(this.currentSectionNum);
      return true;
    } catch (e) {
      console.error('Failed to restore exam state from localStorage', e);
      return false;
    }
  }

  normalizeExamExplanations(exam) {
    if (!exam) return;
    const allQs = [
      ...(exam.section1?.questions || []),
      ...(exam.section2?.questions || [])
    ];
    allQs.forEach(q => {
      let exp = q.explanation || q.explanationLaTeX || q.hint;
      if (!exp || exp === 'undefined' || String(exp).trim() === '' || String(exp) === 'undefined') {
        exp = `Apply fundamental calculus rules and properties for ${q.topic || 'this problem'}.`;
      }
      q.explanation = exp;
      q.explanationLaTeX = exp;
    });
  }

  getQuestionExplanation(q) {
    if (!q) return '<p>Apply standard rules and definitions for this topic.</p>';
    let exp = q.explanation || q.explanationLaTeX || q.hint;
    if (!exp || exp === 'undefined' || String(exp).trim() === '' || String(exp) === 'undefined') {
      exp = `Apply fundamental calculus rules and properties for ${q.topic || 'this problem'}.`;
    }
    const paragraphs = String(exp)
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (paragraphs.length === 0) return `<p>${exp}</p>`;
    return paragraphs.map(p => `<p style="margin-bottom: 0.6rem; line-height: 1.6;">${p}</p>`).join('');
  }

  showToast(msg, type = 'info', duration = 3500) {
    const toast = document.getElementById('toastNotification');
    const msgElem = document.getElementById('toastMessage');
    const iconElem = document.getElementById('toastIcon');

    if (!toast || !msgElem) return;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    msgElem.innerText = msg;
    toast.className = `toast-notification ${type}`;

    if (type === 'success') {
      if (iconElem) iconElem.innerText = '✓';
    } else if (type === 'warning') {
      if (iconElem) iconElem.innerText = '⚠️';
    } else {
      if (iconElem) iconElem.innerText = 'ℹ️';
    }

    toast.classList.remove('hidden');

    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, duration);
  }

  showDashboard() {
    clearInterval(this.timerInterval);
    this.clearState();

    const modeBadge = document.getElementById('testModeBadge');
    const calcBadge = document.getElementById('calcStatusBadge');
    const statusDot = document.getElementById('footerStatusDot');
    const pauseBadge = document.getElementById('pauseExamBtn');
    if (modeBadge) modeBadge.classList.add('hidden');
    if (calcBadge) calcBadge.classList.add('hidden');
    if (statusDot) statusDot.classList.add('hidden');
    if (pauseBadge) pauseBadge.classList.add('hidden');
    document.getElementById('pauseModalContainer')?.classList.add('hidden');

    this.renderExamHistory();

    document.getElementById('dashboardView').classList.remove('hidden');
    document.getElementById('examView').classList.add('hidden');
    document.getElementById('resultsView').classList.add('hidden');
  }

  startExam() {
    const diffRadio = document.querySelector('input[name="difficultyRadio"]:checked');
    const difficulty = diffRadio ? diffRadio.value : 'medium';

    const modeRadio = document.querySelector('input[name="testModeRadio"]:checked');
    this.testMode = modeRadio ? modeRadio.value : 'exam';

    // Generate new procedural test
    this.currentExam = generateCLEPExam(difficulty);
    this.normalizeExamExplanations(this.currentExam);

    this.currentSectionNum = 1;
    this.currentQuestionIdx = 0;
    this.userAnswers = {};
    this.flaggedQuestions = new Set();
    this.checkedQuestions = new Set();

    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('resultsView').classList.add('hidden');
    document.getElementById('examView').classList.remove('hidden');

    this.startSection(1);
  }

  startSection(secNum) {
    this.currentSectionNum = secNum;
    this.currentQuestionIdx = 0;

    const secData = secNum === 1 ? this.currentExam.section1 : this.currentExam.section2;
    this.secondsRemaining = secData.timeLimitMinutes * 60;

    this.resumeSection(secNum);
  }

  resumeSection(secNum) {
    this.currentSectionNum = secNum;
    const secData = secNum === 1 ? this.currentExam.section1 : this.currentExam.section2;

    this.updateTimerDisplay();
    this.saveState();
    this.startTimer();

    // Update Test Mode badge
    const modeBadge = document.getElementById('testModeBadge');
    const statusDot = document.getElementById('footerStatusDot');
    if (modeBadge) {
      modeBadge.classList.remove('hidden');
      if (this.testMode === 'practice') {
        modeBadge.innerText = 'Practice Mode';
        modeBadge.className = 'footer-status-label mode-badge practice';
      } else {
        modeBadge.innerText = 'Exam Mode';
        modeBadge.className = 'footer-status-label mode-badge';
      }
    }
    if (statusDot) statusDot.classList.remove('hidden');

    // Pause button visibility based on Test Mode
    const pauseExamBtn = document.getElementById('pauseExamBtn');
    if (pauseExamBtn) {
      if (this.testMode === 'practice') {
        pauseExamBtn.classList.remove('hidden');
      } else {
        pauseExamBtn.classList.add('hidden');
      }
    }

    // Update Banner & Calc permissions
    const secBadge = document.getElementById('sectionBadge');
    const calcStatus = document.getElementById('calcStatusBadge');

    if (calcStatus) calcStatus.classList.remove('hidden');

    if (secNum === 1) {
      secBadge.innerText = 'Section 1: Non-Calculator (27 Questions | 50 Mins)';
      calcStatus.innerText = 'Calculator PROHIBITED';
      calcStatus.className = 'footer-status-label prohibited';
    } else {
      secBadge.innerText = 'Section 2: Calculator Permitted (17 Questions | 40 Mins)';
      calcStatus.innerText = 'Calculator PERMITTED';
      calcStatus.className = 'footer-status-label permitted';
    }

    this.renderQuestionPalette();
    this.renderCurrentQuestion();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    const secData = this.currentSectionNum === 1 ? this.currentExam.section1 : this.currentExam.section2;
    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      this.updateTimerDisplay();
      this.saveState();
      if (this.secondsRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.showToast(`Time is up for ${secData.title}! Transitioning...`, 'warning', 4000);
        this.submitSection();
      }
    }, 1000);
  }

  pausePracticeSession() {
    if (this.testMode !== 'practice') return;
    clearInterval(this.timerInterval);
    const modal = document.getElementById('pauseModalContainer');
    if (modal) modal.classList.remove('hidden');
  }

  resumePracticeSession() {
    const modal = document.getElementById('pauseModalContainer');
    if (modal) modal.classList.add('hidden');
    this.startTimer();
  }

  showQuitModal() {
    const modal = document.getElementById('quitModalContainer');
    if (modal) modal.classList.remove('hidden');
  }

  closeQuitModal() {
    const modal = document.getElementById('quitModalContainer');
    if (modal) modal.classList.add('hidden');
  }

  executeQuitExam() {
    this.closeQuitModal();
    this.showDashboard();
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.secondsRemaining / 60);
    const secs = this.secondsRemaining % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const timerElem = document.getElementById('timerDisplay');
    if (timerElem) {
      timerElem.innerText = timeStr;
      if (mins < 5) {
        timerElem.classList.add('warning');
      } else {
        timerElem.classList.remove('warning');
      }
    }
  }

  getCurrentQuestions() {
    return this.currentSectionNum === 1 ? this.currentExam.section1.questions : this.currentExam.section2.questions;
  }

  checkCurrentAnswer() {
    if (this.testMode !== 'practice') return;
    const questions = this.getCurrentQuestions();
    const q = questions[this.currentQuestionIdx];
    const userChoice = this.userAnswers[q.id];
    if (userChoice === undefined) {
      this.showToast('Please select an answer choice first!', 'warning', 3000);
      return;
    }

    this.checkedQuestions.add(q.id);
    this.saveState();
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    const questions = this.getCurrentQuestions();
    const q = questions[this.currentQuestionIdx];

    document.getElementById('qNumberLabel').innerText = `Question ${q.number} of 44 (${q.topic})`;

    // Flag button state
    const flagBtn = document.getElementById('flagQuestionBtn');
    if (this.flaggedQuestions.has(q.id)) {
      flagBtn.classList.add('flagged');
      flagBtn.innerText = '★ Flagged';
    } else {
      flagBtn.classList.remove('flagged');
      flagBtn.innerText = '☆ Flag for Review';
    }

    // Hint button visibility based on Test Mode
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
      if (this.testMode === 'practice') {
        hintBtn.classList.remove('hidden');
        hintBtn.disabled = false;
        hintBtn.title = 'Click to view a practice hint for this question';
        hintBtn.classList.add('enabled');
      } else {
        hintBtn.classList.add('hidden');
        hintBtn.disabled = true;
      }
    }

    // Check Answer button visibility & state
    const checkAnsBtn = document.getElementById('checkAnsBtn');
    const isChecked = this.checkedQuestions.has(q.id);
    const hasAnswered = this.userAnswers[q.id] !== undefined;

    if (checkAnsBtn) {
      if (this.testMode === 'practice') {
        checkAnsBtn.classList.remove('hidden');
        if (isChecked) {
          checkAnsBtn.disabled = true;
          checkAnsBtn.innerText = 'Checked ✓';
        } else if (hasAnswered) {
          checkAnsBtn.disabled = false;
          checkAnsBtn.innerText = '✓ Check Answer';
        } else {
          checkAnsBtn.disabled = true;
          checkAnsBtn.innerText = '✓ Check Answer';
        }
      } else {
        checkAnsBtn.classList.add('hidden');
      }
    }

    // Question content & LaTeX
    const qTextElem = document.getElementById('questionText');
    qTextElem.innerHTML = `
      <p>${q.questionText}</p>
      ${q.expressionLaTeX ? `<div class="math-block">$$${q.expressionLaTeX}$$</div>` : ''}
    `;

    // Choices
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D', 'E'];
    q.choices.forEach((choiceLaTeX, idx) => {
      const isSelected = this.userAnswers[q.id] === idx;
      const optionDiv = document.createElement('div');

      let extraClass = '';
      if (isSelected) extraClass += ' selected';

      if (isChecked) {
        extraClass += ' locked';
        if (idx === q.correctIndex) {
          extraClass += ' correct-choice';
        } else if (isSelected && idx !== q.correctIndex) {
          extraClass += ' incorrect-choice';
        }
      }

      optionDiv.className = `choice-option${extraClass}`;
      optionDiv.innerHTML = `
        <span class="choice-letter">${letters[idx]}</span>
        <div class="choice-content">$$${choiceLaTeX}$$</div>
      `;

      if (!isChecked) {
        optionDiv.addEventListener('click', () => {
          this.userAnswers[q.id] = idx;
          this.renderCurrentQuestion();
          this.renderQuestionPalette();
          this.saveState();
        });
      }

      choicesContainer.appendChild(optionDiv);
    });

    // Render inline solution box inside dedicated inlineSolutionContainer
    const solContainer = document.getElementById('inlineSolutionContainer');
    if (solContainer) {
      if (isChecked && this.testMode === 'practice') {
        const isCorrect = this.userAnswers[q.id] === q.correctIndex;
        solContainer.innerHTML = `
          <div class="inline-solution-card ${isCorrect ? 'correct-banner' : 'incorrect-banner'}" style="margin-top: 1.5rem; padding: 1.25rem 1.5rem; border-radius: var(--radius-md); border: ${isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'}; background: ${isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'};">
            <div class="solution-status-title ${isCorrect ? 'correct' : 'incorrect'}" style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; font-weight: 800; color: ${isCorrect ? '#34d399' : '#f87171'};">
              <span style="font-size: 1.35rem;">${isCorrect ? '🎉' : '❌'}</span>
              <span>${isCorrect ? 'Correct Answer!' : `Incorrect. The correct answer is (${letters[q.correctIndex]})`}</span>
            </div>
            <div class="review-explanation" style="margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <div class="exp-title" style="font-weight: 700; color: #38bdf8; margin-bottom: 0.5rem; font-size: 0.95rem;">💡 Step-by-Step Solution & Explanation:</div>
              <div class="exp-body" style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6;">
                ${this.getQuestionExplanation(q)}
              </div>
            </div>
          </div>
        `;
      } else {
        solContainer.innerHTML = '';
      }
    }

    // Prev/Next Nav & Submit state
    document.getElementById('prevQuestionBtn').disabled = (this.currentQuestionIdx === 0);
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
      nextBtn.disabled = false;
      if (this.currentQuestionIdx === questions.length - 1) {
        nextBtn.innerText = 'Review & Submit Section →';
      } else {
        nextBtn.innerText = 'Next →';
      }
    }

    this.updateProgressBar();

    // Render KaTeX Math
    if (window.renderMathInElement) {
      window.renderMathInElement(document.getElementById('questionCard'), {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    }
  }

  updateProgressBar() {
    const questions = this.getCurrentQuestions();
    const total = questions.length;
    const answeredCount = questions.filter(q => this.userAnswers[q.id] !== undefined).length;
    const pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

    const fillElem = document.getElementById('progressBarFill');
    const textElem = document.getElementById('progressText');
    const pctElem = document.getElementById('progressPercent');

    if (fillElem) fillElem.style.width = `${pct}%`;
    if (textElem) textElem.innerText = `${answeredCount} / ${total} Answered`;
    if (pctElem) pctElem.innerText = `${pct}%`;
  }

  navigateQuestion(dir) {
    const questions = this.getCurrentQuestions();
    if (dir === 1 && this.currentQuestionIdx === questions.length - 1) {
      this.promptSectionSubmit();
      return;
    }
    let newIdx = this.currentQuestionIdx + dir;
    if (newIdx >= 0 && newIdx < questions.length) {
      this.currentQuestionIdx = newIdx;
      this.renderCurrentQuestion();
      this.saveState();
    }
  }

  toggleFlag() {
    const questions = this.getCurrentQuestions();
    const q = questions[this.currentQuestionIdx];
    if (this.flaggedQuestions.has(q.id)) {
      this.flaggedQuestions.delete(q.id);
    } else {
      this.flaggedQuestions.add(q.id);
    }
    this.renderCurrentQuestion();
    this.renderQuestionPalette();
    this.saveState();
  }

  showHintModal() {
    if (this.testMode !== 'practice') return;

    const questions = this.getCurrentQuestions();
    const q = questions[this.currentQuestionIdx];
    const modal = document.getElementById('hintModalContainer');
    const content = document.getElementById('hintModalContent');

    if (modal && content && q) {
      const hintText = q.hint || `Topic Strategy (${q.topic}): Review the fundamental properties and definitions for ${q.topic}.`;
      content.innerHTML = `
        <div class="hint-topic-badge">${q.topic}</div>
        <p>${hintText}</p>
      `;

      modal.classList.remove('hidden');

      if (window.renderMathInElement) {
        window.renderMathInElement(content, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ]
        });
      }
    }
  }

  closeHintModal() {
    const modal = document.getElementById('hintModalContainer');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  renderQuestionPalette() {
    const questions = this.getCurrentQuestions();
    const paletteGrid = document.getElementById('paletteGrid');
    paletteGrid.innerHTML = '';

    questions.forEach((q, idx) => {
      const item = document.createElement('button');
      const isAnswered = this.userAnswers[q.id] !== undefined;
      const isFlagged = this.flaggedQuestions.has(q.id);
      const isCurrent = idx === this.currentQuestionIdx;

      let classes = ['palette-item'];
      if (isCurrent) classes.push('current');
      if (isAnswered) classes.push('answered');
      if (isFlagged) classes.push('flagged');

      item.className = classes.join(' ');
      item.innerText = q.number;
      item.addEventListener('click', () => {
        this.currentQuestionIdx = idx;
        this.renderCurrentQuestion();
        this.togglePalette(false);
      });

      paletteGrid.appendChild(item);
    });

    let submitPaletteContainer = document.getElementById('paletteSubmitContainer');
    if (!submitPaletteContainer) {
      submitPaletteContainer = document.createElement('div');
      submitPaletteContainer.id = 'paletteSubmitContainer';
      submitPaletteContainer.style.marginTop = '1.5rem';
      submitPaletteContainer.style.paddingTop = '1rem';
      submitPaletteContainer.style.borderTop = '1px solid var(--border-color)';
      const drawer = document.getElementById('paletteDrawer');
      if (drawer) drawer.appendChild(submitPaletteContainer);
    }
    submitPaletteContainer.innerHTML = `
      <button id="paletteSubmitBtn" class="primary-btn" style="width: 100%; padding: 0.6rem; font-size: 0.9rem;">
        ${this.currentSectionNum === 1 ? 'Submit Section 1 →' : 'Submit Exam & Grade →'}
      </button>
    `;
    const submitBtn = document.getElementById('paletteSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.togglePalette(false);
        this.promptSectionSubmit();
      });
    }
  }

  togglePalette(forceState) {
    const drawer = document.getElementById('paletteDrawer');
    if (forceState !== undefined) {
      if (forceState) drawer.classList.add('open');
      else drawer.classList.remove('open');
    } else {
      drawer.classList.toggle('open');
    }
  }

  promptSectionSubmit() {
    const secData = this.currentSectionNum === 1 ? this.currentExam.section1 : this.currentExam.section2;
    const questions = secData.questions;
    const unanswered = questions
      .map((q, idx) => ({ q, idx, number: q.number }))
      .filter(item => this.userAnswers[item.q.id] === undefined);

    const modal = document.getElementById('sectionSubmitModalContainer');
    const titleElem = document.getElementById('sectionSubmitModalTitle');
    const bodyElem = document.getElementById('sectionSubmitModalBody');
    const footerElem = document.getElementById('sectionSubmitModalFooter');

    if (!modal || !bodyElem || !footerElem) {
      this.submitSection();
      return;
    }

    if (titleElem) {
      titleElem.innerText = `📋 End of Section ${this.currentSectionNum} Review`;
    }

    if (unanswered.length > 0) {
      bodyElem.innerHTML = `
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
          <h4 style="color: #fbbf24; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.35rem;">⚠️ ${unanswered.length} Unanswered Question(s) Remaining</h4>
          <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.5;">
            You have <strong>${unanswered.length} unanswered question(s)</strong> remaining in Section ${this.currentSectionNum}.
            You can go back to review and answer them, or proceed with submitting the section.
          </p>
        </div>
        <div style="margin-bottom: 0.5rem; font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">
          Click any question below to jump directly to it:
        </div>
        <div class="unanswered-grid" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${unanswered.map(item => `<button class="secondary-btn unanswered-jump-btn" data-idx="${item.idx}" style="padding: 0.3rem 0.65rem; font-size: 0.85rem;">Question ${item.number}</button>`).join('')}
        </div>
      `;
    } else {
      bodyElem.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.35rem;">🎉</div>
          <h4 style="color: #34d399; font-weight: 800; font-size: 1.1rem; margin-bottom: 0.35rem;">All ${questions.length} Questions Answered!</h4>
          <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.5;">
            You have completed all questions in Section ${this.currentSectionNum}.
            <br>
            ${this.currentSectionNum === 1 ? 'Submitting Section 1 will move to Section 2 (Calculator Permitted).' : 'Submitting Section 2 will finalize and grade your complete exam.'}
          </p>
        </div>
      `;
    }

    footerElem.innerHTML = `
      <button id="cancelSectionSubmitBtn" class="secondary-btn" style="font-size: 0.9rem; padding: 0.55rem 1.1rem;">← Back to Review Questions</button>
      <button id="confirmSectionSubmitBtn" class="primary-btn" style="padding: 0.6rem 1.4rem; font-size: 0.9rem;">
        ${this.currentSectionNum === 1 ? 'Submit Section 1 →' : 'Submit & Grade Exam →'}
      </button>
    `;

    bodyElem.querySelectorAll('.unanswered-jump-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let idx = parseInt(btn.getAttribute('data-idx'), 10);
        this.currentQuestionIdx = idx;
        this.closeSectionSubmitModal();
        this.renderCurrentQuestion();
      });
    });

    const cancelBtn = document.getElementById('cancelSectionSubmitBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.closeSectionSubmitModal());
    }

    const confirmBtn = document.getElementById('confirmSectionSubmitBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        this.closeSectionSubmitModal();
        this.submitSection();
      });
    }

    modal.classList.remove('hidden');
  }

  showSectionSubmitModal() {
    this.promptSectionSubmit();
  }

  closeSectionSubmitModal() {
    const modal = document.getElementById('sectionSubmitModalContainer');
    if (modal) modal.classList.add('hidden');
  }

  submitSection() {
    clearInterval(this.timerInterval);
    if (this.currentSectionNum === 1) {
      this.showToast('Section 1 Submitted! Moving to Section 2 (Calculator Permitted).', 'success', 4000);
      this.startSection(2);
    } else {
      this.showToast('Exam Complete! Displaying results...', 'success', 3500);
      this.finishExam();
    }
  }

  finishExam() {
    this.clearState();
    document.getElementById('examView').classList.add('hidden');
    document.getElementById('resultsView').classList.remove('hidden');

    // Calculate score
    let totalCorrect = 0;
    let topicStats = {
      'Limits & Continuity': { correct: 0, total: 0 },
      'Differential Calculus': { correct: 0, total: 0 },
      'Integral Calculus': { correct: 0, total: 0 },
      'Calculator Permitted': { correct: 0, total: 0 }
    };

    const allQuestions = [...this.currentExam.section1.questions, ...this.currentExam.section2.questions];

    allQuestions.forEach(q => {
      const userChoice = this.userAnswers[q.id];
      const isCorrect = userChoice === q.correctIndex;
      if (isCorrect) totalCorrect++;

      // General category
      let cat = 'Differential Calculus';
      if (q.topic.includes('Limits')) cat = 'Limits & Continuity';
      else if (q.topic.includes('Integral')) cat = 'Integral Calculus';

      if (!topicStats[cat]) topicStats[cat] = { correct: 0, total: 0 };
      topicStats[cat].total++;
      if (isCorrect) topicStats[cat].correct++;
    });

    // CLEP Scaled Score (20 to 80)
    // Passing score is 50/80 (~50% raw correct)
    const rawRatio = totalCorrect / 44;
    const scaledScore = Math.min(80, Math.max(20, Math.round(20 + rawRatio * 60)));
    const isPassing = scaledScore >= 50;

    // Save completed exam record to history log
    this.saveExamRecord({
      id: 'exam_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
      }),
      difficulty: (this.currentExam.difficulty || 'medium').toUpperCase(),
      testMode: this.testMode === 'practice' ? 'Practice' : 'Exam',
      rawScore: `${totalCorrect} / 44`,
      rawCorrect: totalCorrect,
      scaledScore: scaledScore,
      isPassing: isPassing,
      examData: JSON.parse(JSON.stringify(this.currentExam)),
      userAnswers: JSON.parse(JSON.stringify(this.userAnswers))
    });

    // Render Summary Header
    document.getElementById('rawScoreText').innerText = `${totalCorrect} / 44`;
    document.getElementById('scaledScoreText').innerText = `${scaledScore} / 80`;

    const statusBadge = document.getElementById('passFailBadge');
    if (isPassing) {
      statusBadge.innerText = 'PASSED (ACE Credit Qualified)';
      statusBadge.className = 'status-badge pass';
    } else {
      statusBadge.innerText = 'NEEDS IMPROVEMENT';
      statusBadge.className = 'status-badge fail';
    }

    // Render Topic Breakdown
    const topicContainer = document.getElementById('topicBreakdownContainer');
    topicContainer.innerHTML = '';
    Object.keys(topicStats).forEach(topicName => {
      const stat = topicStats[topicName];
      if (stat.total === 0) return;
      const pct = Math.round((stat.correct / stat.total) * 100);
      const div = document.createElement('div');
      div.className = 'topic-card';
      div.innerHTML = `
        <div class="topic-header">
          <span class="topic-title">${topicName}</span>
          <span class="topic-score">${stat.correct}/${stat.total} (${pct}%)</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${pct}%"></div>
        </div>
      `;
      topicContainer.appendChild(div);
    });

    // Render Questions Corrections & Solutions List
    const reviewList = document.getElementById('correctionsList');
    reviewList.innerHTML = '';

    allQuestions.forEach(q => {
      const userChoice = this.userAnswers[q.id];
      const isCorrect = userChoice === q.correctIndex;
      const letters = ['A', 'B', 'C', 'D', 'E'];

      const card = document.createElement('div');
      card.className = `review-card ${isCorrect ? 'correct' : 'incorrect'}`;

      card.innerHTML = `
        <div class="review-header">
          <span class="q-num-badge">Q${q.number} (Sec ${q.section})</span>
          <span class="q-topic-tag">${q.topic}</span>
          <span class="result-badge ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
          </span>
        </div>
        <div class="review-question">
          <p>${q.questionText}</p>
          ${q.expressionLaTeX ? `<div class="math-block">$$${q.expressionLaTeX}$$</div>` : ''}
        </div>
        <div class="review-answers">
          <div class="user-ans ${isCorrect ? 'correct' : 'incorrect'}">
            Your Answer: ${userChoice !== undefined ? `<strong>${letters[userChoice]}</strong> ($$${q.choices[userChoice]}$$)` : '<em>Unanswered</em>'}
          </div>
          <div class="correct-ans">
            Correct Answer: <strong>${letters[q.correctIndex]}</strong> ($$${q.choices[q.correctIndex]}$$)
          </div>
        </div>
        <div class="review-explanation">
          <div class="exp-title">Step-by-Step Explanation:</div>
          <div class="exp-content">${this.getQuestionExplanation(q)}</div>
        </div>
      `;

      reviewList.appendChild(card);
    });

    // Render KaTeX Math in Results
    if (window.renderMathInElement) {
      window.renderMathInElement(document.getElementById('resultsView'), {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }
  }

  saveExamRecord(record) {
    try {
      let history = JSON.parse(localStorage.getItem(this.historyStorageKey) || '[]');
      history.unshift(record); // newest first
      localStorage.setItem(this.historyStorageKey, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save exam history record', e);
    }
  }

  confirmClearHistory() {
    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn && !clearBtn.dataset.confirming) {
      clearBtn.dataset.confirming = 'true';
      clearBtn.innerText = 'Click again to confirm clear';
      clearBtn.style.background = 'var(--danger)';
      clearBtn.style.color = '#fff';
      setTimeout(() => {
        if (clearBtn && clearBtn.dataset.confirming) {
          delete clearBtn.dataset.confirming;
          clearBtn.innerText = 'Clear History';
          clearBtn.style.background = '';
          clearBtn.style.color = '';
        }
      }, 3500);
      return;
    }
    if (clearBtn) {
      delete clearBtn.dataset.confirming;
      clearBtn.innerText = 'Clear History';
      clearBtn.style.background = '';
      clearBtn.style.color = '';
    }
    try {
      localStorage.removeItem(this.historyStorageKey);
    } catch (e) {}
    this.renderExamHistory();
    this.showToast('Exam history cleared.', 'info', 3000);
  }

  renderExamHistory() {
    const container = document.getElementById('historyLogContainer');
    const statTotal = document.getElementById('statTotalExams');
    const statAvg = document.getElementById('statAvgScore');
    const statPass = document.getElementById('statPassRate');
    if (!container) return;

    let history = [];
    try {
      history = JSON.parse(localStorage.getItem(this.historyStorageKey) || '[]');
    } catch (e) {}

    if (history.length === 0) {
      if (statTotal) statTotal.innerText = '0';
      if (statAvg) statAvg.innerText = '--';
      if (statPass) statPass.innerText = '--';

      container.innerHTML = `
        <div class="empty-history-card">
          <p style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: #f8fafc;">No Past Exam Logs</p>
          <p>Complete your first practice exam above to start tracking your scores and performance history!</p>
        </div>
      `;
      return;
    }

    // Calculate statistics
    let totalExams = history.length;
    let sumScaled = 0;
    let passedCount = 0;

    history.forEach(rec => {
      sumScaled += rec.scaledScore;
      if (rec.isPassing) passedCount++;
    });

    let avgScore = Math.round(sumScaled / totalExams);
    let passPct = Math.round((passedCount / totalExams) * 100);

    if (statTotal) statTotal.innerText = totalExams;
    if (statAvg) statAvg.innerText = `${avgScore} / 80`;
    if (statPass) statPass.innerText = `${passPct}%`;

    // Render Table
    let rowsHTML = history.map((rec, index) => `
      <tr>
        <td><strong>${rec.date}</strong></td>
        <td><span class="status-badge ${rec.testMode === 'Practice' ? 'permitted' : 'mode-badge'}" style="font-size: 0.75rem;">${rec.testMode}</span></td>
        <td><span style="font-weight: 600;">${rec.difficulty}</span></td>
        <td>${rec.rawScore}</td>
        <td><strong style="font-size: 1.05rem; color: #38bdf8;">${rec.scaledScore} / 80</strong></td>
        <td>
          <span class="status-badge ${rec.isPassing ? 'pass' : 'fail'}" style="padding: 0.2rem 0.6rem; font-size: 0.8rem;">
            ${rec.isPassing ? 'PASSED (50+)' : 'NEEDS WORK'}
          </span>
        </td>
        <td>
          <button class="secondary-btn review-history-btn" data-index="${index}" style="padding: 0.3rem 0.7rem; font-size: 0.8rem;">Review Test</button>
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="history-table-wrapper">
        <table class="history-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Mode</th>
              <th>Difficulty</th>
              <th>Raw Score</th>
              <th>Scaled Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>
    `;

    // Bind click listeners for "Review Test"
    container.querySelectorAll('.review-history-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let idx = parseInt(btn.getAttribute('data-index'), 10);
        let record = history[idx];
        if (record) {
          this.reviewPastExamRecord(record);
        }
      });
    });
  }

  reviewPastExamRecord(record) {
    this.currentExam = record.examData;
    this.userAnswers = record.userAnswers;

    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('examView').classList.add('hidden');
    document.getElementById('resultsView').classList.remove('hidden');

    let totalCorrect = record.rawCorrect;
    let scaledScore = record.scaledScore;
    let isPassing = record.isPassing;

    document.getElementById('rawScoreText').innerText = `${totalCorrect} / 44`;
    document.getElementById('scaledScoreText').innerText = `${scaledScore} / 80`;

    const statusBadge = document.getElementById('passFailBadge');
    if (isPassing) {
      statusBadge.innerText = 'PASSED (ACE Credit Qualified)';
      statusBadge.className = 'status-badge pass';
    } else {
      statusBadge.innerText = 'NEEDS IMPROVEMENT';
      statusBadge.className = 'status-badge fail';
    }

    const allQuestions = [...this.currentExam.section1.questions, ...this.currentExam.section2.questions];

    let topicStats = {
      'Limits & Continuity': { correct: 0, total: 0 },
      'Differential Calculus': { correct: 0, total: 0 },
      'Integral Calculus': { correct: 0, total: 0 }
    };

    allQuestions.forEach(q => {
      const userChoice = this.userAnswers[q.id];
      const isCorrect = userChoice === q.correctIndex;

      let cat = 'Differential Calculus';
      if (q.topic.includes('Limits')) cat = 'Limits & Continuity';
      else if (q.topic.includes('Integral')) cat = 'Integral Calculus';

      if (!topicStats[cat]) topicStats[cat] = { correct: 0, total: 0 };
      topicStats[cat].total++;
      if (isCorrect) topicStats[cat].correct++;
    });

    const topicContainer = document.getElementById('topicBreakdownContainer');
    topicContainer.innerHTML = '';
    Object.keys(topicStats).forEach(topicName => {
      const stat = topicStats[topicName];
      if (stat.total === 0) return;
      const pct = Math.round((stat.correct / stat.total) * 100);
      const div = document.createElement('div');
      div.className = 'topic-card';
      div.innerHTML = `
        <div class="topic-header">
          <span class="topic-title">${topicName}</span>
          <span class="topic-score">${stat.correct}/${stat.total} (${pct}%)</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${pct}%"></div>
        </div>
      `;
      topicContainer.appendChild(div);
    });

    const reviewList = document.getElementById('correctionsList');
    reviewList.innerHTML = '';

    allQuestions.forEach(q => {
      const userChoice = this.userAnswers[q.id];
      const isCorrect = userChoice === q.correctIndex;
      const letters = ['A', 'B', 'C', 'D', 'E'];

      const card = document.createElement('div');
      card.className = `review-card ${isCorrect ? 'correct' : 'incorrect'}`;

      const userChoiceText = userChoice !== undefined ? `(${letters[userChoice]}) $$${q.choices[userChoice]}$$` : '<em>Unanswered</em>';
      const correctChoiceText = `(${letters[q.correctIndex]}) $$${q.choices[q.correctIndex]}$$`;

      card.innerHTML = `
        <div class="review-card-header">
          <span class="q-num-tag">Question ${q.number}</span>
          <span class="q-topic-tag">${q.topic}</span>
          <span class="result-badge ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
          </span>
        </div>
        <div class="review-question-text">
          <p>${q.questionText}</p>
          ${q.expressionLaTeX ? `<div class="math-block">$$${q.expressionLaTeX}$$</div>` : ''}
        </div>
        <div class="review-answers">
          <div>Your Answer: <span class="user-ans ${isCorrect ? 'correct' : 'incorrect'}">${userChoiceText}</span></div>
          ${!isCorrect ? `<div>Correct Answer: <span class="correct-ans">${correctChoiceText}</span></div>` : ''}
        </div>
        <div class="review-explanation">
          <div class="exp-title">Step-by-Step Solution:</div>
          <p>${this.getQuestionExplanation(q)}</p>
        </div>
      `;

      reviewList.appendChild(card);
    });

    if (window.renderMathInElement) {
      window.renderMathInElement(document.getElementById('resultsView'), {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new CLEPCalculusApp();
});
