import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        return: {
          black: "#050505",
          panel: "#111111",
          card: "#191919",
          line: "#2a2a2a",
          amber: "#f59e0b",
          red: "#ef4444"
        }
      }
    }
  },
  plugins: []
};

export default config;
