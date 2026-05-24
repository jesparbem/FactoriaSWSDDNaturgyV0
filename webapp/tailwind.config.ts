import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        // Paleta Naturgy
        naturgy: {
          // Naranja corporativo
          orange: {
            50: "#FFF4ED",
            100: "#FFE6D5",
            200: "#FFC9AA",
            300: "#FFA374",
            400: "#FF7A3D",
            500: "#FF671B", // base
            600: "#F04E0A",
            700: "#C73B07",
            800: "#9E3010",
            900: "#7F2A11",
          },
          // Azul corporativo
          blue: {
            50: "#EFF6FB",
            100: "#D9EAF5",
            200: "#B8D6EB",
            300: "#8ABBDC",
            400: "#5398C7",
            500: "#0066B3", // base
            600: "#0058A0",
            700: "#054882",
            800: "#0A3D6C",
            900: "#0C355B", // fondo oscuro principal
            950: "#08243F",
          },
          // Neutros
          neutral: {
            50: "#FAFAFA",
            100: "#F4F4F5",
            200: "#E4E4E7",
            300: "#D4D4D8",
            400: "#A1A1AA",
            500: "#71717A",
            600: "#52525B",
            700: "#3F3F46",
            800: "#27272A",
            900: "#18181B",
            950: "#09090B",
          },
          success: "#0E8746",
          warning: "#FFB300",
          danger: "#D72631",
        },
        // Aliases semánticos
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-fg": "rgb(var(--muted-fg) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-fg": "rgb(var(--card-fg) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(255 103 27 / 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgb(255 103 27 / 0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
