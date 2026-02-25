import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50:  "#fdf2f2",
          100: "#f5d9d9",
          200: "#e8a8a8",
          300: "#d97373",
          400: "#c44a4a",
          500: "#8B1A1A",
          600: "#6B1414",
          700: "#4f0f0f",
          800: "#360a0a",
          900: "#1e0505",
          950: "#120303",
        },
        cream: {
          50:  "#faf8f5",
          100: "#f0ebe0",
          200: "#e2d8c8",
          300: "#cebfaa",
          400: "#b8a38a",
          500: "#9e8669",
          DEFAULT: "#D4C4A8",
        },
        burgundy: "#5C0A0A",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body:    ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "wine-gradient": "linear-gradient(135deg, #1e0505 0%, #5C0A0A 50%, #8B1A1A 100%)",
        "cream-gradient": "linear-gradient(180deg, #f0ebe0 0%, #e2d8c8 100%)",
        "dark-gradient":  "linear-gradient(180deg, #0a0404 0%, #1a0808 100%)",
      },
      animation: {
        "fade-up":    "fadeUp .7s ease forwards",
        "fade-in":    "fadeIn .6s ease forwards",
        "swirl":      "swirl 20s linear infinite",
        "float":      "float 4s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:     { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:     { from: { opacity: "0" }, to: { opacity: "1" } },
        swirl:      { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        float:      { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        pulseSoft:  { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
