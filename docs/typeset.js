export const typography = {
  type: {
    heading: '"Satoshi-Black", sans-serif"',
    body: '"Satoshi-Regular", sans-serif"',
    type: '"Typewrite Condensed", sans-serif"',
  },
  weights: {
    normal: 400,
    bold: 900,
  },
  sizes: [
    { name: 'xs', size: '0.75rem' },
    { name: 'sm', size: '0.875rem' },
    { name: 'base', size: '1rem' },
    { name: 'lg', size: '1.125rem' },
    { name: 'xl', size: '1.25rem' },
    { name: '2xl', size: '1.5rem' },
    { name: '3xl', size: '1.875rem' },
    { name: '4xl', size: '2.25rem' },
    { name: '5xl', size: '3rem' },
    { name: '6xl', size: '3.75rem' },
    { name: '7xl', size: '4.5rem' },
    { name: '8xl', size: '6rem' },
    { name: '9xl', size: '8rem' },
  ],
};

export function convertToPx(rem) {
  return `${rem * 16}px`;
}

export function convertToRem(px) {
  return `${px / 16}rem`;
}

export function mapSizesToTypeset(sizes) {
  return sizes.map(({ size }) => convertToPx(getPureRem(size)));
}

export function getPureRem(size) {
  return Number(size.split('rem')[0]);
}
