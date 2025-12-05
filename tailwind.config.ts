import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './types.ts',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

