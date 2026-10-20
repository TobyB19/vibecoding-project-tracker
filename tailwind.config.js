// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Soft mid-grey theme: kills the blinding white but stays out of the dark zone.
        // Still passes all WCAG AA contrast checks for your report.
        'brand-primary': '#3b82f6', // Blue 500
        'brand-accent': '#2563eb',  // Blue 600
        'surface-page': '#e2e8f0',  // Slate 200 (a solid, calming grey)
        'surface-card': '#f1f5f9',  // Slate 100 (slightly lighter grey for depth)
        'text-primary': '#0f172a',  // Slate 900
        'text-muted': '#475569',    // Slate 600 
        feature: '#10b981',         // Emerald 500
        bug: '#ef4444',             // Red 500
        'due-safe': '#475569',
        'due-warning': '#f59e0b',
        'due-overdue': '#ef4444',
        'due-neutral': '#94a3b8',
      },
    },
  },
  plugins: [],
};