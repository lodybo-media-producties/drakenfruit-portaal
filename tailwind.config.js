const { neutral } = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      neutral,
      black: '#000000',
      white: '#FFFFFF',
      'dark-blue': '#6F8D9C',
      'light-blue': '#BDCACF',
      'egg-white': '#FDF7F4',
      'light-pink': '#F6CAC9',
      'dark-pink': '#C4475C',
      orange: '#F4B855',
    },
    fontFamily: {
      heading: ['Satoshi-Black', 'sans-serif'],
      body: ['Satoshi-Regular', 'sans-serif'],
      type: ['Typewrite Condensed', 'sans-serif'],
    },
    fontWeight: {
      normal: '400',
      bold: '900',
    },
    data: {
      'ui-open': 'state=open',
      'parent-ui-open': 'state=open & ',
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
