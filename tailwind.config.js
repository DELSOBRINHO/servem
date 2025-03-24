/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'servem-primary': '#3B82F6',    // Azul primário
        'servem-secondary': '#10B981',  // Verde Servem
        'servem-accent': '#F59E0B',     // Dourado/Amarelo
        'servem-neutral': '#6B7280',    // Cinza neutro
        'servem-light': '#F3F4F6',      // Cinza claro para fundos
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}