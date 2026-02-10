/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette personnalisée ITU Project
        'itu-light': '#f2f5fa',       // 242,245,250
        'itu-white': '#ffffff',        // 255,255,255
        'itu-gray': '#d0d7e1',         // 208,215,225
        'itu-lighter': '#f1f4f9',      // 241,244,249
        'itu-purple': '#ecedf5',       // 236,237,245
        'itu-accent': '#4f46e5',       // Indigo pour les accents
        'itu-success': '#10b981',      // Vert
        'itu-warning': '#f59e0b',      // Orange
        'itu-danger': '#ef4444',       // Rouge
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        ituproject: {
          "primary": "#4f46e5",
          "secondary": "#8b5cf6",
          "accent": "#10b981",
          "neutral": "#d0d7e1",
          "base-100": "#ffffff",
          "base-200": "#f2f5fa",
          "base-300": "#f1f4f9",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}
