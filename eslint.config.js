import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default tseslint.config(
  {
    ignores: [
      '.DS_Store',
      'node_modules/**',
      'coverage/**',
      'dist/**',
      'ios/**',
      'android/**',
      '.env.local',
      '.env.*.local',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-debug.log*',
      '.idea/**',
      '.vscode/**',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.node,
        ...globals.browser, // Adds window, localStorage, etc. as globals
        process: 'readonly'
      }
    },
    plugins: {
      'vue': vuePlugin
    },
    rules: {
      'no-console': isDevelopment ? 'off' : 'warn',
      'no-debugger': isDevelopment ? 'off' : 'warn',
      'vue/no-deprecated-slot-attribute': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true 
      }]
    }
  },
  {
    files: ['**/*.vue'],
    rules: {
      ...vuePlugin.configs.essential.rules,
      'vue/no-deprecated-slot-attribute': 'off', // Allow slot attribute in Vue components
      '@typescript-eslint/no-unused-vars': 'warn' // Downgrade to warning
    }
  }
);