import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F5F7", ink: "#0F1F2A", muted: "#5B6B77", line: "#D5DDE3",
        teal: { DEFAULT: "#0E7C86", dark: "#0A5A62", soft: "#DCEEF0" },
        amber: { DEFAULT: "#C9821A", soft: "#F8ECD6" },
        alert: { DEFAULT: "#C23B3B", soft: "#F7DEDE" },
      },
      fontFamily: { display: ["var(--font-display)", "sans-serif"], body: ["var(--font-body)", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
