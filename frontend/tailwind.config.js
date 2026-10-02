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
          dark: "#090A0D",
          sidebar: "#0C0D11",
          surface: "#111318",
          elevated: "#16181E",
          card: "#111318",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.07)",
          hover: "rgba(255, 255, 255, 0.12)",
        },
        txt: {
          primary: "#F3F5F9",
          secondary: "#949EAE",
          muted: "#5A6578",
        },
        accent: {
          purple: "#7C6CFF",
          "purple-hover": "#6B59FF",
          teal: "#35C9B5",
          yellow: "#FBBF24",
          red: "#F87171",
          green: "#34D399",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
