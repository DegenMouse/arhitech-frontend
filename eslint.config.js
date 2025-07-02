// eslint.config.js
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'vue/multi-word-component-names': 'off'
  }
})
