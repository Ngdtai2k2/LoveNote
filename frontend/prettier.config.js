/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 100,

  plugins: ['@trivago/prettier-plugin-sort-imports'],

  importOrder: [
    '^react$',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '^@api/(.*)$',
    '^@hooks/(.*)$',
    '^@components/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
