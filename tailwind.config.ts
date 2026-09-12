import type { Config } from "tailwindcss";

/**
 * The runtime theme tokens are hex custom properties (see `globals.css` and
 * `DemoControlsContext`), not `r g b` triplets, so `rgb(var(--x) / <alpha-value>)` cannot be
 * used. `color-mix` applies the alpha without duplicating every token as a triplet.
 *
 * Tailwind substitutes `<alpha-value>` with the slash modifier (`border-theme/25` -> `0.25`)
 * and with `1` when there is no modifier, so `calc(<alpha-value> * 100%)` resolves to a
 * valid `color-mix` percentage in both cases.
 */
const themeToken = (token: string) =>
  `color-mix(in srgb, var(${token}) calc(<alpha-value> * 100%), transparent)`;

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
        theme: {
          DEFAULT: themeToken("--theme-text"),
          muted: themeToken("--theme-text-muted"),
          surface: themeToken("--theme-surface"),
          elevated: themeToken("--theme-surface-elevated"),
        },
      },
        fontFamily: {
        display: ["var(--font-display)", '"Zen Old Mincho"', "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        product: ["var(--font-product)", "system-ui", "sans-serif"],
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
