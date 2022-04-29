module.exports = {
  purge: {
    content: [
      '_site/**/*.html'
    ],
    options: {
      safelist: [],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        clarke: ['Clarke', 'Arial', 'Helvetica', 'sans-serif'],
        sansserif: ['Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        change: 'white',
        ci_darkgrey: '#595959',
        ci_brightgreen: '#CDC6AA',
        ci_green: '#80A694',
        ci_skincolor: '#F299A0',
        ci_beige: '#F2C7AE',
        ci_pink: '#F24B78',
      },
      padding: {
        '3/2': '150%',
        '3/4': '75%',
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
