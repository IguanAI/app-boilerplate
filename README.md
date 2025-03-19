# Ionic Vue Boilerplate

A feature-rich, production-ready boilerplate for Ionic Vue 3 applications developed by IguanAI Labs Inc.

## Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Mobile Framework**: Ionic Framework
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **TypeScript**: Strong typing throughout

## Key Features

### 1. Flexible Authentication System
- **Multiple Authentication Methods**:
  - Traditional Email/Password login
  - Secure Authentication with 2FA support
  - Easy Login with Email/SMS verification codes
- Extensible authentication provider architecture
- Session persistence with localStorage/sessionStorage
- Complete authentication flows (login, register, password reset)

### 2. Internationalization (i18n)
- Multi-language support using vue-i18n
- Default languages: English (en), Spanish (es)
- Easy to extend with additional languages
- Language switcher component

### 3. Theming
- Light and Dark mode using Tailwind CSS
- System preference detection and override
- Theme persistence with Pinia
- Customizable color schemes

### 4. Layout System
- Responsive layouts for all device sizes
- Proper mobile support with Ionic components
- Consistent header and navigation

### 5. State Management
- Centralized state management with Pinia
- Type-safe stores
- Persistent state across sessions

### 6. Error Handling and Logging
- Global error handling
- Centralized logging service
- User-friendly error messages

### 7. Analytics Integration
- Event tracking infrastructure
- Screen view tracking
- User action monitoring

## Project Structure

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

## Authentication System

The boilerplate implements a flexible authentication system with three methods:

### 1. Traditional Email/Password
- Standard username/password login experience
- Password reset functionality
- "Remember me" option

### 2. Secure Authentication (with 2FA)
- Username/password + authenticator code
- Two-factor authentication support
- Enhanced security for sensitive applications

### 3. Easy Login
- Email/SMS verification codes (passwordless)
- Simple 6-digit verification code
- Support for both email and SMS verification methods

The authentication system is built on a modular provider architecture that makes it easy to:
- Add new authentication providers
- Customize existing providers
- Switch between different auth methods

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/iguanai/ionic-vue-boilerplate.git
cd ionic-vue-boilerplate
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
ionic serve
```

4. Build for production
```bash
npm run build
# or
ionic build
```

## Configuration

The application is highly configurable through the `src/config.ts` file:

```typescript
// Example configuration
const config = {
  app: {
    name: 'Your App Name',
    version: '1.0.0',
    description: 'Your app description'
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
  // Additional configurations...
};
```

## Environment Variables

Create an `.env` file in the root directory:

```
# App
VITE_APP_NAME=Your App Name

# API
VITE_API_URL=https://api.example.com

# Analytics
VITE_ANALYTICS_ENABLED=true
```

## Customization

### Adding New Authentication Providers

1. Create a new provider class implementing the `AuthProvider` interface
2. Register the provider in the auth provider registry
3. Add UI components for the new authentication method

### Adding New Languages

1. Create a new JSON file in the `src/locales` directory (e.g., `fr.json`)
2. Copy the structure from `en.json` and translate the values
3. Update the language switcher component

## Development Commands

- `ionic serve`: Start development server
- `ionic build`: Build for production
- `npm run lint`: Run linting
- `npm run test:unit`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests

## About IguanAI Labs Inc.

IguanAI Labs Inc. specializes in building innovative mobile and web applications with a focus on AI-powered features, robust architecture, and exceptional user experiences.

## License

This project is licensed under the MIT License - see the LICENSE file for details.