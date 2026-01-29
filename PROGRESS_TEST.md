# Progress & Testing Checklist

This file tracks the testing progress of the application features.

## Authentication
- [ ] **Login Success**: Verify user can login with valid credentials.
- [ ] **Login Failure**: Verify error message for invalid credentials.
- [ ] **Login 2FA**: Verify 2FA prompt appears if enabled for the user.
- [ ] **Registration**: Verify new user signup flow.
- [ ] **Forgot Password**: Verify password reset email request.
- [ ] **Logout**: Verify session is cleared and user is redirected to login.
- [ ] **Token Persistence**: Verify user remains logged in after app restart.

## Dashboard
- [ ] **Data Loading**: Verify stats (pending, sent, failed) load correctly from API.
- [ ] **Real-time Connection**: Verify "Connected" status when WebSocket is active.
- [ ] **SMS Toggle On**: Verify toggling "Forwarding" to ON starts the poller/listener.
- [ ] **SMS Toggle Off**: Verify toggling "Forwarding" to OFF stops activity.
- [ ] **Device Info**: Verify correct device model and brand are displayed.

## SMS Forwarding
- [ ] **Poll Pending**: Verify app fetches pending messages periodically when active.
- [ ] **WebSocket Trigger**: Verify app fetches messages immediately upon "sms.queued" event.
- [ ] **Send SMS (Happy Path)**: Verify `expo-sms` composer opens with correct number and body.
- [ ] **Send SMS (Success)**: Verify status updates to "Sent" after successful transmission.
- [ ] **Send SMS (Error/Cancel)**: Verify handling of cancelled or failed sending attempts.
- [ ] **Heartbeat**: Verify heartbeat pings are sent to the server.

## Activity History
- [ ] **List Display**: Verify history list renders fetched data.
- [ ] **Pagination**: Verify scrolling to bottom loads more items.
- [ ] **Pull to Refresh**: Verify pulling down refreshes the list.
- [ ] **Status Badges**: Verify correct color/text for Sent vs Failed vs Pending.

## Profile & Settings
- [ ] **Update Email**: Verify email update flow.
- [ ] **Phone Verification - Send OTP**: Verify OTP is sent to phone.
- [ ] **Phone Verification - Verify OTP**: Verify valid code confirms phone number.
- [ ] **Enable 2FA**: Verify QR code generation and secret display.
- [ ] **Confirm 2FA**: Verify entering valid code enables 2FA.
- [ ] **Disable 2FA**: Verify 2FA can be disabled.
- [ ] **Notification Toggle**: Verify preference is saved to server.

## Localization & Theme
- [ ] **Theme Switch (Dark)**: Verify UI updates to dark mode colors.
- [ ] **Theme Switch (Light)**: Verify UI updates to light mode colors.
- [ ] **Theme Auto**: Verify app respects system theme settings.
- [ ] **Language Change**: Verify app text updates immediately when language is changed (e.g., to Japanese).
- [ ] **Language Persistence**: Verify selected language persists after restart.

## Subscription
- [ ] **Plan Display**: Verify subscription plans are rendered correctly.
