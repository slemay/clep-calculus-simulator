/**
 * Application Version & Release History Log
 */

export const APP_VERSION = 'v1.2.0';

export const CHANGELOG_DATA = [
  {
    version: 'v1.2.0',
    date: 'August 11, 2026',
    title: 'Practice Mode Overtime & Cache-Busting Enhancements',
    badge: 'Latest Release',
    changes: [
      { type: 'feature', label: 'Feature', text: 'Count-up flex-timer starting at 00:00 for Practice Mode sessions.' },
      { type: 'feature', label: 'Feature', text: 'Red overtime visual container and warning badge when section time limit is exceeded.' },
      { type: 'fix', label: 'Fix', text: 'Prevented automatic section submission when time expires in Practice Mode.' },
      { type: 'performance', label: 'Performance', text: 'Added HTTP Cache-Control revalidation headers and module version parameters to invalidate stale browser caches on GitHub Pages.' },
      { type: 'ui', label: 'UI/UX', text: 'Added interactive Version Badge, Version History modal, and comprehensive release notes timeline.' }
    ]
  },
  {
    version: 'v1.1.0',
    date: 'August 10, 2026',
    title: 'Procedural Calculus Generator Engine & Detailed Diagnostics',
    changes: [
      { type: 'feature', label: 'Feature', text: 'Infinite procedural question generation for Limits, Derivatives, and Integral Calculus.' },
      { type: 'feature', label: 'Feature', text: 'KaTeX LaTeX mathematical equation rendering and step-by-step solution breakdowns.' },
      { type: 'feature', label: 'Feature', text: 'CLEP scaled score calculation (20 to 80) and ACE credit qualification indicators.' },
      { type: 'feature', label: 'Feature', text: 'Local exam history log for tracking past test scores and performance stats.' },
      { type: 'ui', label: 'UI/UX', text: 'Dark & Light theme switcher with automatic preference persistence.' }
    ]
  },
  {
    version: 'v1.0.0',
    date: 'August 1, 2026',
    title: 'Initial CLEP® Calculus Exam Simulator Release',
    changes: [
      { type: 'feature', label: 'Feature', text: 'Section 1 (Non-Calculator, 27 questions) and Section 2 (Calculator Permitted, 17 questions) exam simulation.' },
      { type: 'feature', label: 'Feature', text: 'Interactive question palette drawer and question flagging support.' }
    ]
  }
];
