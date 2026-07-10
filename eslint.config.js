import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**'],
  },

  // Error-prevention rules for Vue SFCs (no formatting opinions).
  ...pluginVue.configs['flat/essential'],

  // TypeScript rules wired for <script setup lang="ts">.
  ...vueTsEslintConfig(),

  // Must be last: turns off any rules that would conflict with Prettier.
  skipFormatting,
]
