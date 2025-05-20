# Dream Interpreter

A React Native mobile app that provides psychoanalytic interpretations of dreams using AI. Users can type or speak their dreams and receive interpretations from various psychoanalytic perspectives.

## Features

- 🧠 AI-powered dream interpretation using OpenAI's GPT-4
- 👥 Multiple psychoanalyst personas (Freud, Jung, Fromm)
- 🗣️ Text and voice input support
- 🌍 Multilingual (English & Turkish)
- 🌓 Light/Dark theme
- 💾 Local storage for chat history
- 📱 Responsive Material Design UI
- 🔒 Privacy-focused (no data collection)

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- iOS Simulator / Android Emulator
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dream-interpreter.git
   cd dream-interpreter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API Keys:
   - Open `src/config/config.ts`
   - Replace the following placeholders:
     ```typescript
     // OpenAI Configuration
     apiKey: 'your-openai-api-key-here'
     
     // AdMob Configuration
     bannerAdUnitId: 'your-admob-banner-id'
     interstitialAdUnitId: 'your-admob-interstitial-id'
     ```

## Running the App

1. Start the development server:
   ```bash
   npm start
   ```

2. Run on iOS:
   ```bash
   npm run ios
   ```

3. Run on Android:
   ```bash
   npm run android
   ```

## Customization

### Adding/Modifying Psychoanalysts

Edit `src/config/config.ts`:

```typescript
psychoanalysts: [
  {
    id: 'custom-analyst',
    name: 'Analyst Name',
    badgeColor: '#HEX_COLOR',
    description: 'Analyst description',
  },
  // ... existing analysts
]
```

### Modifying Pre-chat Questions

Edit `src/config/config.ts`:

```typescript
preChatQuestions: [
  {
    id: 'custom-question',
    label: 'Your question?',
    type: 'text', // or 'dropdown'
    options: ['Option 1', 'Option 2'], // for dropdown type
  },
  // ... existing questions
]
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/      # API and storage services
├── config/        # App configuration
├── hooks/         # Custom React hooks
├── i18n/          # Translations
└── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT-4 API
- React Native community
- Expo team
- Material Design team

## Privacy Policy

This app:
- Does not collect or store personal data
- Stores all conversations locally on device
- Uses OpenAI API for dream interpretation
- Displays ads via Google AdMob
- Requires user acceptance of terms on install

For full details, see the Privacy Policy in the app settings. 