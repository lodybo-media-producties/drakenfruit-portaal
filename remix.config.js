/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/.*', '**/*.test.{js,jsx,ts,tsx}'],
  postcss: true,
  serverModuleFormat: 'cjs',
  devServerPort: 8002,
  tailwind: true,
  serverDependenciesToBundle: [
    /@sindresorhus/,
    /remix-utils/,
    /escape-string-regexp/,
  ],
  browserNodeBuiltinsPolyfill: {
    modules: {
      crypto: true,
    },
  },
};
