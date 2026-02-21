/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "brand-sky-top": "#C7E6F3",
        "brand-sky-bottom": "#9CD9F0",
        "brand-cyan": "#0C7B9E",
        "brand-coral": "#CC2954",
        "brand-text": "#1A1D1E",
        "brand-muted": "#546570",
        "glass-bg": "#0B1120",
        "glass-card": "rgba(255, 255, 255, 0.08)",
        "glass-border": "rgba(255, 255, 255, 0.15)",
        "glass-text": "#F8FAFC",
        "glass-muted": "#94A3B8",
        "glass-cyan": "#22D3EE",
        "glass-coral": "#FB7185",
      },
    },
  },
  plugins: [],
};
