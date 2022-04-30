module.exports = {
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    './.eslintrc-auto-import.json',
    'prettier',
  ],
  plugins: ['vue', 'prettier','@typescript-eslint'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser:"@typescript-eslint/parser",
    sourceType:"module"
  },
  rules: {
    'vue/require-default-prop': 'off'
  },
  ignorePatterns: ['.eslintrc.js']
};
