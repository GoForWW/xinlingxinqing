/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Natural Healing Palette
        cream: '#F7F4EF',
        sage: {
          50: '#F4F6F2',
          100: '#E6EBE4',
          200: '#CDD7C9',
          300: '#A8B5A3',
          400: '#84937D',
          500: '#6B7A64',
          600: '#556152',
          700: '#454D43',
          800: '#3A4038',
          900: '#32362F',
        },
        amber: {
          50: '#FDF8F3',
          100: '#FAEBD7',
          200: '#F5D7AF',
          300: '#E9B87A',
          400: '#D49950',
          500: '#C4833D',
          600: '#A86B30',
          700: '#8B5527',
          800: '#724623',
          900: '#5E3A20',
        },
        earth: {
          50: '#FAF9F7',
          100: '#F2EDE6',
          200: '#E4DBCB',
          300: '#D0C3A8',
          400: '#B5A380',
          500: '#9A8661',
          600: '#806C52',
          700: '#6A5844',
          800: '#574A3C',
          900: '#4A4035',
        },
        // Redesign warm palette
        warm: {
          50: '#faf8f5',
          100: '#f5f0ea',
          200: '#e8dfd3',
          300: '#d4c4b0',
          400: '#b89f83',
          500: '#a08160',
          600: '#8a6950',
          700: '#735544',
          800: '#5f473a',
          900: '#513d32',
        },
        // Category accent colors
        mind: {
          DEFAULT: '#4f6f52',
          light: '#e8f0e6',
          mid: '#86a788',
        },
        heart: {
          DEFAULT: '#b05b6f',
          light: '#f7e8ec',
          mid: '#d48b9a',
        },
        grow: {
          DEFAULT: '#c4943e',
          light: '#faf0dc',
          mid: '#dbb668',
        },
        connect: {
          DEFAULT: '#6b7fa8',
          light: '#e8edf5',
          mid: '#95a8c9',
        },
      },
      fontFamily: {
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
}
