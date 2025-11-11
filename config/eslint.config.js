import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: [
      '.nuxt/**',
      'node_modules/**',
      '**/*.d.ts',
      'dist/**',
      'build/**'
    ]
  },
  {
    files: ['components/**/*.vue', 'pages/**/*.vue', 'layouts/**/*.vue', 'app.vue'],
    plugins: { vue },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      ...vue.configs['flat/recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'no-console': 'warn',
      'no-unused-vars': 'warn'
    }
  },
  {
    files: ['composables/**/*.ts', 'utils/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn'
    }
  }
]
