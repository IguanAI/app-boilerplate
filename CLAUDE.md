# Ionic Vue Boilerplate Dev Guide

## Commands
- Build: ionic build
- Dev server: ionic serve
- Lint: `npm run lint`
- Unit tests: `npm run test:unit`
- Single unit test: `npm run test:unit -- -t "test name"`
- E2E tests: `npm run test:e2e`
- Type check: `vue-tsc --noEmit`

## Code Style
- **Imports**: Group by type (Vue, 3rd party, local) with @/ alias for src
- **Components**: Use Vue 3 composition API with `<script setup lang="ts">`
- **Types**: Use TypeScript, explicit return types, avoid `any`
- **Naming**: PascalCase for components, camelCase for variables/functions
- **State**: Use Pinia for state management
- **I18n**: Use vue-i18n with keys in locales/*.json
- **Theme**: Support light/dark/system themes
- **Error handling**: Use try/catch with appropriate logging
- **CSS**: Use scoped styles with Tailwind utility classes

## Color Scheme
- **Primary**: #10664F (deep green)
- **Secondary**: #10664F (matching green)
- **Tertiary**: #085E4A (darker green)
- **Dark Mode Background**: #121212 with green radial gradient (rgba(16, 102, 79, 0.4))
- **Light Mode Background**: #f5f9f7 with subtle green tint
- **Navbar**: Transparent with green text (#10664F) in light mode, white text in dark mode
- **Text Gradients**: Linear gradient from #10664F to #085E4A