import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'

/** Nuxt/Vue auto-imports и глобалы — чтобы ESLint не ругался на no-undef */
const nuxtGlobals = {
  useNuxtApp: 'readonly',
  useTheme: 'readonly',
  useSeoMeta: 'readonly',
  useRoute: 'readonly',
  useRouter: 'readonly',
  useClipboard: 'readonly',
  definePageMeta: 'readonly',
  ref: 'readonly',
  computed: 'readonly',
  watch: 'readonly',
  onMounted: 'readonly',
  onBeforeUnmount: 'readonly',
  onBeforeMount: 'readonly',
  nextTick: 'readonly',
  useRaidState: 'readonly',
  usePasswordStorage: 'readonly',
  useSiteNav: 'readonly',
  useWiki: 'readonly',
  clearError: 'readonly',
  NotificationPermission: 'readonly'
}

export default tseslint.config(
  { ignores: ['node_modules/**', '.nuxt/**', '.output/**', 'dist/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: { ...nuxtGlobals },
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-indent': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: { ...nuxtGlobals }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['tailwind.config.js', '*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: { require: 'readonly', module: 'readonly', __dirname: 'readonly' }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
)
