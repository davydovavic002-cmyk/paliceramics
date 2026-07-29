import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1c",
        porcelain: "#F3F4F6",
        "porcelain-muted": "#E5E5E5",
        slip: "#E5E3DE",
        paper: "#EDE8DF",
        gosu: { DEFAULT: "#101A26", stroke: "#2A3F5C" },
        indigo: { accent: "#1e3a5f", light: "#2a5080" },
      },
      fontFamily: {
        display: ['"Shippori Mincho"', '"Zen Old Mincho"', "Georgia", "serif"],
        body: ['"Noto Serif JP"', "Georgia", "serif"],
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        "stroke-drift": "strokeDrift 22s ease-in-out infinite alternate",
        "stroke-drift-organic": "strokeDriftOrganic 22s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        strokeDrift: {
          "0%": { transform: "translate(0, 0) rotate(var(--tw-rotate, 0deg))" },
          "100%": { transform: "translate(1.2%, -0.6%) rotate(calc(var(--tw-rotate, 0deg) + 1deg))" },
        },
        strokeDriftOrganic: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "35%": { transform: "translate(1.4%, -1.1%) scale(1.012)" },
          "68%": { transform: "translate(-0.9%, 0.7%) scale(0.994)" },
          "100%": { transform: "translate(1.1%, -0.5%) scale(1.008)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
