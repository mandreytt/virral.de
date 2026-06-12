import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#060608",
        bg2: "#0c0c0f",
        bg3: "#121215",
        card: "#16161a",
        ink: "#f0ece6",
        ink2: "#a8a29e",
        ink3: "#6b665c",
        accent: "#fe2c55",
        accenth: "#e52249",
      },
      borderColor: {
        line: "rgba(255,255,255,.07)",
        line2: "rgba(255,255,255,.12)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
    },
  },
  plugins: [],
} satisfies Config;
