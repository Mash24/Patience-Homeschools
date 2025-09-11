module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    'react/no-unescaped-entities': 'off',   // allow Don't, We're, "quotes"
    'jsx-a11y/alt-text': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
}
