import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design tokens -- grounded in "Zatoona" (olive). Deep olive-black
        // background, olive-oil gold accent, living olive-leaf green for
        // progress/success states. Not the generic cream+terracotta /
        // near-black+acid-green defaults.
        bg: {
          DEFAULT: "#1B1F14",
          card: "#262B1C",
        },
        ink: {
          DEFAULT: "#F2EEDF",
          muted: "#A8A692",
        },
        gold: {
          DEFAULT: "#C9A227",
          hover: "#DDB53A",
        },
        leaf: {
          DEFAULT: "#7A8B4F",
          bright: "#95A868",
        },
        line: "#3A4029",
        danger: "#C4542E",
      },
      fontFamily: {
        arabic: ["var(--font-tajawal)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
