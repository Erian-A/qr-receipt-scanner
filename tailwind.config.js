/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'warm-cream': '#F6F1E7',
        'soft-beige': '#E8DECF',
        'light-sand': '#EFE6D8',
        'warm-gray': '#D1C7B8',
        'dark-brown': '#4A3F35',
        'muted-taupe': '#7A6F63',
        'soft-olive': '#7C8F65',
        'deep-olive': '#6B7D56',
        'tomato-red': '#C94B3A',
        'soft-mustard': '#D9B55A',
      },
    },
  },
  plugins: [],
};
