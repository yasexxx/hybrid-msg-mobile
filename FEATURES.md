# Features

## Authentication
- **Login**: Secure user login with email and password.
- **Two-Factor Authentication (2FA)**:
  - Verification code requirement during login if enabled.
  - Setup process with QR code and secret key.
  - Option to enable/disable 2FA from profile.
- **Registration**: User signup functionality.
- **Password Management**: Forgot password flow and password reset capabilities.
- **Session Management**: Secure storage of auth tokens and automatic session restoration.

## Dashboard
- **Real-time Status**:
  - Visual indicators for connection status.
  - WebSocket (Laravel Reverb) integration for real-time updates.
- **SMS Forwarding Control**:
  - Main toggle to start/stop the SMS forwarding service.
  - Device information display (Brand, Model).
- **Statistics**:
  - Dashboard overview of Pending, Sent, and Failed messages.
- **Recent Activity**:
  - Preview of the most recent SMS transactions.

## SMS Management
- **Automated Polling**: Periodic checking for pending messages.
- **Real-time Trigger**: Immediate check for messages upon receiving WebSocket events.
- **Sending Mechanism**: Integration with `expo-sms` to initiate message sending.
- **Status Tracking**: Updates message status (Sent/Failed) back to the server.

## Activity History
- **Comprehensive List**: View all past SMS activities.
- **Filtering & Navigation**:
  - Pagination support for large datasets.
  - Pull-to-refresh functionality.
- **Detailed Status**: Visual status badges for easy identification of message outcomes.

## Profile & Settings
- **Account Management**: Update email and personal details.
- **Phone Verification**:
  - OTP-based phone number verification.
- **Preferences**:
  - Toggle for app notifications.
- **Subscription View**: View current subscription plan details.

## Customization & UX
- **Internationalization (i18n)**:
  - Multi-language support.
  - Supported languages: English (en), Japanese (ja), Tagalog (tl), Vietnamese (vi), Chinese (zh).
  - In-app language switcher.
- **Theming**:
  - Dark Mode and Light Mode support.
  - Automatic system theme detection.
  - Consistent color palette across the application.
