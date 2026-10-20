/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4f46e5',
        'brand-accent': '#6366f1',
        'surface-page': '#020617',
        'surface-card': '#0f172a',
        'text-primary': '#f8fafc',
        'text-muted': '#94a3b8',
        'type-feature': '#10b981',
        'type-bug': '#f43f5e',
        'due-safe': '#64748b',
        'due-warning': '#f59e0b',
        'due-overdue': '#f43f5e',
        'due-neutral': '#475569',
      },
    },
  },
  plugins: [],
};