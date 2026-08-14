# 📐 CLEP® Calculus Exam Simulator

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-10b981?style=for-the-badge&logo=github)](https://slemay.github.io/clep-calculus-simulator/)
[![Theme: Light & Dark](https://img.shields.io/badge/Theme-Light_%26_Dark-38bdf8?style=for-the-badge)](https://slemay.github.io/clep-calculus-simulator/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![CLEP Score Scale](https://img.shields.io/badge/CLEP_Score_Scale-20--80-6366f1?style=for-the-badge)](https://clep.collegeboard.org/clep-exams/calculus)
[![Stack](https://img.shields.io/badge/Stack-ES6_Modules_%7C_KaTeX-f59e0b?style=for-the-badge)](https://slemay.github.io/clep-calculus-simulator/)

A high-performance, responsive web application designed to simulate the official **College Board CLEP® Calculus examination**. Built with vanilla JavaScript (ES6+ modules), KaTeX mathematical typesetting, custom procedural math generators, and full **Light/Dark UI theme customization**.

🔗 **Try the Live Simulator:** [https://slemay.github.io/clep-calculus-simulator/](https://slemay.github.io/clep-calculus-simulator/)

---

## 🌟 Key Features

### ⏱️ Authentic CLEP® Exam Simulation
- **Exact Time & Section Structure**:
  - **Section 1**: 27 Questions | 50 Minutes | **Calculator PROHIBITED**
  - **Section 2**: 17 Questions | 40 Minutes | **Calculator PERMITTED** (Physical CLEP®-approved graphing calculator, e.g. TI-84 Plus CE)
- **Official 20–80 Scaled Scoring**: Converts raw correct answers into standard College Board scaled scores (20–80, with a passing threshold of 50).
- **Interactive Question Palette**: Jump quickly between questions, track answered/unanswered states, and highlight flagged items.
- **Section Transition & Review Screen**: Dedicated mid-test review screen allowing review of unanswered or flagged items before advancing.
- **Uncluttered UI & Bottom Status Bar**: Clean top navigation header with test mode & calculator status indicators centered in the bottom status bar.
- **Interactive Help & Guide Modal**: Integrated navbar Help guide (`❓ Help`) detailing exam rules, topic weightings, 20–80 scaled scoring, difficulty levels, and test modes.

### ☀️/🌙 Dual Light & Dark Theme System
- **One-Click Theme Toggle**: Switch instantly between Light and Dark UI modes using the navbar theme toggle (`☀️ Light` / `🌙 Dark`).
- **OS Auto-Detection & Persistence**: Automatically respects OS color scheme preferences (`prefers-color-scheme`) and persists user theme choices in `localStorage`.
- **High-Contrast Typography & Equation Blocks**: Custom-tuned contrast ratios for KaTeX math blocks, choice cards, glassmorphism overlays, and toast notifications in both light and dark environments.

### 🧪 Dual Practice & Exam Modes
- **Exam Mode**: Strict timed testing conditions, full 44-question exam flow, disabled hints/instant solutions, and final diagnostic score breakdown.
- **Practice Mode**:
  - Instant step-by-step LaTeX solution explanations rendered via **KaTeX**.
  - Contextual problem-solving hints (`💡 Hint`).
  - Pause session timer (`⏸ Pause`) with blurred background modal overlay.
  - Interactive answer checking (`✓ Check Answer`) with non-locking option choices.

### 🎲 Infinite Procedural Problem Generator (55+ Distinct Templates)
Generates fresh, mathematically rigorous calculus questions with randomized coefficients, step-by-step solutions, and realistic distractors covering all major CLEP domain areas:
- **Limits & Continuity (~10%)**: Factoring limits, difference of cubes, conjugate rationalization, limits at infinity with radicals/exponentials, L'Hôpital's Rule (trig/log/exp), Squeeze Theorem, Intermediate Value Theorem (IVT), and asymptote classifications.
- **Differential Calculus (~50%)**: Power, Product, Quotient, & Chain Rules, linear approximation, implicit differentiation, second implicit derivatives, logarithmic differentiation, inverse trig derivatives, critical points, Absolute Extrema (EVT), concavity & points of inflection, Mean Value Theorem, differentiability conditions, related rates (ladder/cone/circle), optimization, and motion analysis ($v(t), a(t)$).
- **Integral Calculus (~40%)**: Definite integrals with fractional exponents, $u$-substitution (exponential, trig, log), inverse trig integrals, integration by parts, Fundamental Theorem of Calculus (FTC Parts 1 & 2), two-variable bounds, area between curves, average value, separable differential equations, exponential growth/decay, disk/washer solids of revolution, Riemann sums, and total distance vs. displacement.
- **Calculator-Active Operations**: Numerical integration (nInt), numerical root finding, accumulation rate models, numerical derivatives (nDeriv), intersection area solvers, motion position accumulation, and transcendental extrema.

### 🎯 4 Difficulty Modes & 5-Test Cross-Exam Variety Engine
- **Difficulty Modes**:
  - **Easy**: Core calculus operations and straightforward 1-step rules ($w_d = 0.95$).
  - **Medium**: Authentic College Board CLEP standard calibration ($w_d = 1.00$).
  - **Hard**: Multi-step composite rules and tricky algebraic distractors ($w_d = 1.08$).
  - **Extreme (🔥)**: Mastery challenge mode featuring intricate implicit curves, multi-layer chain rules, washer volumes, non-elementary integrals, and deep analytical problem-solving ($w_d = 1.15$).
- **5-Test Rolling Cross-Exam Variety**: The engine tracks question signatures and generator usage across the last 5 exams in `localStorage`, prioritizing unused generators and fresh coefficient sets so repeat test-takers always encounter wildly diverse, non-repetitive exams.

### 📊 Performance Analytics & Persistent History
- **Automatic State Recovery**: Test progress is saved automatically to `localStorage` — resume interrupted exams seamlessly upon page refresh.
- **Detailed Diagnostic Reports**: Complete score breakdown with raw accuracy, scaled score (20–80), domain mastery breakdown, and full item-by-item review.

---

## 🏛️ Exam Domain Breakdown

| Topic Domain | Weight | Key Skills Tested |
| :--- | :--- | :--- |
| **Limits & Continuity** | ~10% | One-sided & two-sided limits, algebraic simplification, L'Hôpital's Rule, continuity criteria |
| **Differential Calculus** | ~50% | Derivative rules, rate of change, implicit differentiation, optimization, Mean Value Theorem |
| **Integral Calculus** | ~40% | Antiderivatives, $u$-substitution, FTC Parts 1 & 2, area between curves, average value, separable ODEs |

---

## 🛠️ Technology Stack & Architecture

- **Core**: HTML5, CSS Custom Properties (Design System), Vanilla JavaScript (ES6 Modules)
- **Math Rendering**: [KaTeX](https://katex.org/) (Fast, lightweight math typesetting engine)
- **Storage**: Browser `localStorage` API for state persistence, theme preference, and exam history tracking
- **Deployment**: GitHub Pages (Static Hosting)

---

## 📁 Repository Structure

```text
clep-calculus-simulator/
├── index.html                  # Main application structure, modals, and views
├── styles.css                  # Custom design system with Light/Dark CSS variables & layouts
├── js/
│   ├── app.js                  # Main controller: timer loops, theme toggling, navigation & state
│   └── generators/             # Procedural calculus question generators
│       ├── examEngine.js       # Exam construction & CLEP 20-80 scaling engine
│       ├── limitsGenerators.js # Limits & continuity problem generators
│       ├── derivativesGenerators.js # Differential calculus problem generators
│       ├── integralsGenerators.js   # Integral calculus problem generators
│       ├── calculatorGenerators.js  # Section 2 calculator-active problem generators
│       └── mathUtils.js        # Math helpers (fractions, LaTeX formatting, distractors)
└── README.md                   # Project documentation
```

---

## 💻 Local Development Setup

No build tools, bundlers, or `npm install` required! 

1. **Clone the repository**:
   ```bash
   git clone https://github.com/slemay/clep-calculus-simulator.git
   cd clep-calculus-simulator
   ```

2. **Serve locally using any HTTP server**:
   - Python:
     ```bash
     python3 -m http.server 8000
     ```
   - Node.js (`http-server`):
     ```bash
     npx http-server -p 8000
     ```

3. **Open in your browser**:
   Navigate to `http://localhost:8000`

---

## 📜 License & Disclaimer

- **License**: Released under the [MIT License](LICENSE).
- **Disclaimer**: *CLEP® and College Board® are registered trademarks of the College Board, which was not involved in the production of, and does not endorse, this application.*

---

<p align="center">
  Developed by <a href="https://github.com/slemay">slemay</a>
</p>
