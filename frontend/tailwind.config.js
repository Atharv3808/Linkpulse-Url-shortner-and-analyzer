/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          dark: "var(--bg-dark)",
          sidebar: "var(--bg-sidebar)",
          surface: "var(--bg-surface)",
          secondary: "var(--bg-secondary)",
          elevated: "var(--bg-elevated)",
          card: "var(--bg-card)",
        },
        border: {
          subtle: "var(--border-subtle)",
          hover: "var(--border-hover)",
        },
        txt: {
          primary: "var(--txt-primary)",
          secondary: "var(--txt-secondary)",
          muted: "var(--txt-muted)",
        },
        accent: {
          purple: "var(--accent-purple)",
          "purple-hover": "var(--accent-purple-hover)",
          teal: "var(--accent-teal)",
          green: "var(--accent-green)",
          yellow: "var(--accent-yellow)",
          red: "var(--accent-red)",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        popover: "0 10px 38px -10px rgba(0, 0, 0, 0.35), 0 10px 20px -15px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
