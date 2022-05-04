module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      zIndex: {
        5: '5',
      },
      backgroundImage: {
        'logo-colour': "url('src/assets/svg/logo-colour.svg')",
        'menu-icon': "url('src/assets/icons/menu.svg')",
      },
      transitionProperty: {
        height: 'height',
      },
      transitionDuration: {
        2000: '2000ms',
      },
    },
  },
  plugins: [],
};
