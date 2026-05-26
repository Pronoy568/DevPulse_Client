/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1677ff', // Ant Design primary color
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Prevent Tailwind from resetting Ant Design styles
  }
}
