# App Boilerplate

<div align="center">

[![Ionic](https://img.shields.io/badge/Ionic-8.5.0-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Vue](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>A feature-rich, production-ready application boilerplate with multi-auth, i18n, and theming</b>
</p>

<br/>

<img src="public/favicon.png" alt="App Boilerplate Logo" width="120" height="120">

</div>

## ✨ Features

- 🔒 **Multiple Authentication Methods** - Traditional, 2FA, or Passwordless
- 🌐 **Internationalization** - Multi-language support (English, Spanish)
- 🎨 **Theming** - Light/Dark modes with system preference detection
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- 📦 **State Management** - Type-safe Pinia stores
- 📊 **Analytics** - Ready-to-use tracking infrastructure
- 🚨 **Error Handling** - Centralized logging and user-friendly messages

## 🚀 Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://ionicframework.com/img/meta/logo.png" width="48" height="48" alt="Ionic" />
      <br>Ionic
    </td>
    <td align="center" width="96">
      <img src="https://vuejs.org/images/logo.png" width="48" height="48" alt="Vue" />
      <br>Vue 3
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://pinia.vuejs.org/logo.svg" width="48" height="48" alt="Pinia" />
      <br>Pinia
    </td>
    <td align="center" width="96">
      <img src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.79614a5f61617ba49a0891494521226b.svg" width="48" height="48" alt="Tailwind" />
      <br>Tailwind
    </td>
    <td align="center" width="96">
      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" width="48" height="48" alt="Vite" />
      <br>Vite
    </td>
  </tr>
</table>

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Authentication System](#-authentication-system)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development Commands](#-development-commands)
- [Customization](#-customization)
- [License](#-license)

## 🏁 Quick Start

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/iguanai/app-boilerplate.git
cd app-boilerplate

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
ionic serve
```

## 🔐 Authentication System

The boilerplate implements a flexible authentication system with three methods:

### 1. Traditional Email/Password

```
Username/Password + Remember me option
```

- Standard authentication flow
- Password reset functionality
- Secure password storage

### 2. Secure Authentication (with 2FA)

```
Username/Password + Two-factor verification
```

- Enhanced security for sensitive applications
- Support for authenticator apps
- Backup recovery codes

### 3. Easy Login (Passwordless)

```
Email/SMS + 6-digit verification code
```

- Simplified login experience
- No passwords to remember
- Support for both email and SMS verification

## 📁 Project Structure

```
src/
├── assets/            # Static assets (images, styles)
├── components/        # Reusable components
│   ├── common/        # Business logic components
│   └── ui/            # UI components
├── layouts/           # Layout components
├── locales/           # i18n translation files
├── router/            # Vue Router configuration
├── services/          # Services (API, auth, etc.)
│   └── auth/          # Authentication providers
├── stores/            # Pinia stores
├── theme/             # Theme variables and styles
├── utils/             # Utility functions
├── views/             # Page components
├── App.vue            # Root component
├── main.ts            # App entry point
└── config.ts          # App configuration
```

## ⚙️ Configuration

The application is highly configurable through the `src/config.ts` file:

```typescript
// Example configuration
const config = {
  app: {
    name: 'Your App Name',
    version: '1.0.0',
    description: 'Your app description',
    baseUrl: 'https://yourapp.com',
  },
  auth: {
    sessionDuration: 60, // Session duration in minutes
    defaultProvider: 'traditional', // Default auth provider
    providers: {
      traditional: { enabled: true },
      secure: { enabled: true, require2FA: false },
      easy: { enabled: true, methods: ['email', 'sms'] }
    }
  },
  // See config.ts for full configuration options
};
```

### Environment Variables

Create an `.env` file in the root directory:

```
# App
VITE_APP_NAME=Your App Name

# API
VITE_API_URL=https://api.example.com

# Analytics
VITE_ANALYTICS_ENABLED=true
```

## 💻 Development Commands

| Command | Description |
|---------|-------------|
| `ionic serve` | Start development server |
| `ionic build` | Build for production |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build with TypeScript check |
| `npm run lint` | Run ESLint |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run test:e2e` | Run E2E tests with Cypress |

## 🛠️ Customization

### Adding New Authentication Providers

1. Create a new provider class implementing the `AuthProvider` interface:

```typescript
// src/services/auth/CustomProvider.ts
import { AuthProvider } from './AuthProvider';

export class CustomProvider implements AuthProvider {
  // Implement required methods
}
```

2. Register the provider in the auth provider registry
3. Add UI components for the new authentication method

### Adding New Languages

1. Create a new JSON file in the `src/locales` directory (e.g., `fr.json`)
2. Copy the structure from `en.json` and translate the values
3. Update the language switcher component to include the new language

## 📱 Progressive Web App Support

This boilerplate includes PWA support out of the box:

- Installable on mobile and desktop
- Offline support
- Native-like experience
- Automatic updates

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Developed with ❤️ by IguanAI Labs Inc.</p>
  <p>
    <a href="https://github.com/iguanai/app-boilerplate/issues">Report Bug</a>
    ·
    <a href="https://github.com/iguanai/app-boilerplate/issues">Request Feature</a>
  </p>
</div>