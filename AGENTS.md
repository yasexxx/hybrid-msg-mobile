# Agent Instructions & Project Policies

This file outlines the standards, configurations, and architectural patterns used in this project. All agents and developers must adhere to these guidelines.

## Rules & Policies

### 1. Magic Values & Constants (STRICT)
**Do not use magic values or hardcoded strings in the codebase.**
- All API endpoints, configuration keys, timeout values, and specific string literals must be defined in `constants/` files (e.g., `api-constants.ts`, `app-constants.ts`).
- **Reasoning**: To maintain maintainability and ease of configuration changes.
- **Violation**: Code containing hardcoded URLs, keys, or unexplained numbers will be rejected.

### 2. File Structure & Organization
- Follow the existing folder structure (`app/`, `components/`, `services/`, `constants/`, `hooks/`).
- Place reusable logic in `hooks/`.
- Place API calls in `services/`.
- Place reusable UI elements in `components/`.

## Technical Setup & Architecture

### Localization (i18n)
The project uses `i18next` for internationalization.
- **Configuration**: `services/i18n.ts`
- **Translation Files**: Located in `lang/` (e.g., `en.json`, `ja.json`).
- **Usage**:
  - Use the `useTranslation` hook in components: `const { t } = useTranslation();`.
  - Display text using `t('key_name')`.
  - When adding new text, ensure it is added to all language JSON files.

### UI Themes
The application supports Light and Dark modes.
- **Configuration**:
  - `constants/theme.ts`: Defines the color palettes for `light` and `dark` modes.
  - `constants/SettingsContext.tsx`: Manages the theme state (user preference or system default).
- **Usage**:
  - Access colors via `useSettings()` hook: `const { theme } = useSettings(); const activeColors = Colors[theme];`.
  - Apply colors dynamically to styles: `backgroundColor: activeColors.background`, `color: activeColors.text`.

### Real-time Data (WebSockets)
Real-time features use Laravel Reverb (WebSocket server) via Laravel Echo.
- **Dependencies**: `laravel-echo`, `pusher-js`.
- **Configuration**:
  - `constants/api-constants.ts`: Contains Reverb host, port, and key configuration.
  - `services/EchoService.ts`: Singleton service to manage the Echo instance.
- **Authentication**:
  - WebSockets are authenticated using the Bearer token stored in `SecureStore`.
  - Endpoint: `/broadcasting/auth`.
- **Usage**:
  - Use `getEcho()` to retrieve the instance.
  - Listen to channels using `.listen()` or `.private()`.
  - Ensure to cleanup listeners or disconnect when appropriate (though the service manages a singleton).

### API & Networking
- **Client**: `axios` is used for HTTP requests (wrapped in `services/api.ts`).
- **Security**:
  - Auth tokens are stored in `Expo SecureStore`.
  - Tokens are automatically attached to requests via interceptors (or manual header insertion in `api.ts`).
