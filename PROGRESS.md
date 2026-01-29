# Progress & Roadmap

## Known Limitations / Todo

### SMS Automation
- [ ] **[LIMITATION] Fully Automated Sending**:
  - The current implementation uses `expo-sms`, which opens the system SMS composer and requires user interaction to hit "Send" for each message.
  - **Todo**: Investigate solutions for fully automated background SMS sending without user intervention. This may require:
    - Custom native modules for Android.
    - Reviewing Google Play Store permissions (SEND_SMS) policies.
    - Alternative approaches like using a dedicated gateway app or hardware API if strictly for enterprise/internal use.

### Background Execution
- [ ] **Background Tasks**: Ensure reliable background execution for polling and WebSocket connections when the app is minimized or the screen is off.

## Pending Features

### Subscription System
- [x] **Plan Selection UI**: The UI for subscription plans exists.
- [ ] **Plan Selection Logic**: The logic for selecting and upgrading plans is not implemented.
- [ ] **Payment Integration**: No payment gateway (Stripe, PayPal, In-app Purchase) is currently connected.

### Help & Support
- [x] **Services UI**: The "Services" tab UI structure is implemented.
- [ ] **Content**: Actual content and navigation to resources (Customer Support, FAQ, User Guide) need to be implemented.

### Testing & Quality Assurance
- [ ] **Automated Tests**: Implement a comprehensive suite of unit and integration tests (see `PROGRESS_TEST.md`).

## Future Enhancements

- [ ] **Offline Queue**: Implement a local queue to store SMS requests if the device loses internet connection, syncing when connectivity is restored.
- [ ] **Multi-SIM Support**: Explicitly handle and select between multiple SIM cards on supported devices.
- [ ] **Analytics**: Add detailed analytics for success rates and delivery times.
