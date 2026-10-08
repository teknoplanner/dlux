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
        background: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        foreground: "var(--text)",
        muted: "var(--muted)",
        neon: {
          purple: "#8b5cf6",
          cyan: "#22d3ee",
          pink: "#f472b6",
          green: "#22c55e",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["'Space Grotesk'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        "neon-purple": "0 0 25px -5px rgba(139, 92, 246, 0.4)",
        "neon-cyan": "0 0 25px -5px rgba(34, 211, 238, 0.4)",
        "neon-pink": "0 0 25px -5px rgba(244, 114, 182, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
