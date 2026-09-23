/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scoped to the new landing page only. This project styles everything else with
  // styled-components / CSS modules, so Tailwind is deliberately kept from touching it.
  content: [
    './pages/new-landing.tsx',
    './pages/index.tsx',
    './pages/new-landing-2.tsx',
    './components/immersive-home/**/*.{js,ts,jsx,tsx}',
    './components/3d/**/*.{js,ts,jsx,tsx}',
    './components/new-landing-2/**/*.{js,ts,jsx,tsx}',
  ],
  // Generates `#nl-root .utility` instead of `.utility`, so utilities can only ever
  // apply inside the new landing page and always outrank globals.css element rules.
  important: '#nl-root',
  corePlugins: {
    // Preflight is a global reset; enabling it would restyle every existing page.
    preflight: false,
    // globals.css already defines a `.container` used across the site.
    container: false,
  },
  theme: {
    extend: {
      colors: {
        ink: '#0b1220',
        electric: '#3b82f6',
        magenta: '#8b5cf6',
      },
      fontFamily: {
        display: ['var(--nl-font)', 'Outfit', 'Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
