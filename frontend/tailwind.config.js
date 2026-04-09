/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#845333",
          container: "#c68b67",
          fixed: "#ffdbc8",
          "fixed-variant": "#6e3d1f",
        },
        secondary: {
          container: "#fdd8c5",
        },
        tertiary: {
          DEFAULT: "#2b666f",
        },
        surface: {
          DEFAULT: "#faf6f3",
          "container-lowest": "#ffffff",
          "container-low": "#f5f0ec",
          "container": "#efebe7",
          "container-high": "#e9e5e1",
          "container-highest": "#e3dfdb",
        },
        "on-surface": {
          DEFAULT: "#1b1c1c",
          variant: "#4a4643",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          "fixed-variant": "#5a3018",
        },
        outline: {
          DEFAULT: "#7d7672",
          variant: "#d6c3b9",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        ambient: "0 8px 40px rgba(27, 28, 28, 0.06)",
        "ambient-lg": "0 16px 60px rgba(27, 28, 28, 0.08)",
        glow: "0 0 40px rgba(132, 83, 51, 0.08)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      letterSpacing: {
        display: "-0.02em",
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["2.75rem", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-sm": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-md": ["1.75rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        "title-lg": ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        "title-md": ["1rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        "label-lg": ["0.875rem", { lineHeight: "1.4", fontWeight: "500" }],
        "label-md": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.3", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};
