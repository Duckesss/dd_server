module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
      node: true,
      es2021: true
  },
  plugins: [
      '@typescript-eslint'
  ],
  extends: [
      'plugin:@typescript-eslint/recommended',
      'standard'
  ],
  parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module'
  },
  rules: {
      "no-useless-constructor": 0,
      "no-unused-vars": 0
  }
}
