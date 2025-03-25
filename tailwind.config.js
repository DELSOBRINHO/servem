/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'servem': {
          primary: '#4F46E5',    // Cor principal (indigo-600)
          secondary: '#10B981',  // Cor secundária (emerald-500)
          neutral: '#4B5563',    // Cor neutra para textos (gray-600)
          light: '#F9FAFB',      // Cor de fundo clara (gray-50)
          dark: '#1F2937',       // Cor escura (gray-800)
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}