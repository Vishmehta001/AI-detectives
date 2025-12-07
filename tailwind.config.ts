import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Detective Terminal color scheme (dark with green accents)
        terminal: {
          bg: '#0a0e0a',
          surface: '#0f1410',
          border: '#1a2618',
          text: '#00ff41',
          'text-secondary': '#00cc33',
          'text-dim': '#009929',
          accent: '#39ff14',
        },
      },
    },
  },
  plugins: [],
};
export default config;
