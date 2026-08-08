/**
 * Desmos Calculator Suite Integration for Section 2 (Calculator Permitted)
 * Includes embedded Desmos Graphing & Scientific Calculators with tab switching & direct external links.
 */

export class CalculatorTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentMode = 'graphing'; // 'graphing' | 'scientific'
    this.initUI();
  }

  initUI() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="desmos-modal-card">
        <!-- Header & Nav Tabs -->
        <div class="desmos-modal-header">
          <div class="desmos-header-left">
            <div class="desmos-title">
              <span style="font-size: 1.25rem;">🧮</span>
              <span>Desmos Calculator Suite</span>
            </div>
            
            <div class="desmos-tab-group">
              <button id="desmosTabGraphing" class="desmos-tab-btn active">
                📈 Graphing
              </button>
              <button id="desmosTabScientific" class="desmos-tab-btn">
                🔢 Scientific
              </button>
            </div>
          </div>

          <div class="desmos-header-right">
            <a href="https://www.desmos.com/calculator" target="_blank" rel="noopener noreferrer" class="desmos-ext-link" title="Open Desmos Graphing Calculator in new tab">
              ↗ Open Graphing Tab
            </a>
            <a href="https://www.desmos.com/scientific" target="_blank" rel="noopener noreferrer" class="desmos-ext-link" title="Open Desmos Scientific Calculator in new tab">
              ↗ Open Scientific Tab
            </a>
            <button id="desmosCloseBtn" class="desmos-close-btn" title="Close Calculator">&times;</button>
          </div>
        </div>

        <!-- Calculator Embed Frame Body -->
        <div class="desmos-frame-container">
          <iframe 
            id="desmosGraphingFrame" 
            class="desmos-iframe" 
            src="https://www.desmos.com/calculator" 
            title="Desmos Graphing Calculator"
            allow="clipboard-write">
          </iframe>
          <iframe 
            id="desmosScientificFrame" 
            class="desmos-iframe hidden" 
            src="https://www.desmos.com/scientific" 
            title="Desmos Scientific Calculator"
            allow="clipboard-write">
          </iframe>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const graphingTab = this.container.querySelector('#desmosTabGraphing');
    const scientificTab = this.container.querySelector('#desmosTabScientific');
    const graphingFrame = this.container.querySelector('#desmosGraphingFrame');
    const scientificFrame = this.container.querySelector('#desmosScientificFrame');
    const closeBtn = this.container.querySelector('#desmosCloseBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.container.classList.add('hidden');
      });
    }

    if (graphingTab && scientificTab && graphingFrame && scientificFrame) {
      graphingTab.addEventListener('click', () => {
        this.currentMode = 'graphing';
        graphingTab.classList.add('active');
        scientificTab.classList.remove('active');
        graphingFrame.classList.remove('hidden');
        scientificFrame.classList.add('hidden');
      });

      scientificTab.addEventListener('click', () => {
        this.currentMode = 'scientific';
        scientificTab.classList.add('active');
        graphingTab.classList.remove('active');
        scientificFrame.classList.remove('hidden');
        graphingFrame.classList.add('hidden');
      });
    }
  }

  setMode(mode) {
    if (mode === 'scientific') {
      const btn = this.container.querySelector('#desmosTabScientific');
      if (btn) btn.click();
    } else {
      const btn = this.container.querySelector('#desmosTabGraphing');
      if (btn) btn.click();
    }
  }
}
