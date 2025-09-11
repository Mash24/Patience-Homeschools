module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    'react/no-unescaped-entities': 'off',   // allow Don't, We're, "quotes"
    'jsx-a11y/alt-text': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/jsx-no-undef': 'off',  // disable undefined component errors
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/alt-text': 'warn',
  },
}
