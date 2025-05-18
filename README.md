# StorageFS

StorageFS is a modern, secure storage management system built with React, Ionic, and TypeScript. It provides an intuitive interface for organizing and tracking items across different locations with voice command support and secure storage capabilities.

## Features

- **Voice Commands**: Add, move, search, and manage items using natural voice commands
- **Secure Storage**: Password-protected storage with encryption for sensitive data
- **Location Management**: Organize items by modes (e.g., Home, Business, School) and zones
- **Modern UI**: Built with Ionic React for a beautiful, responsive interface
- **TypeScript**: Full TypeScript support for better development experience

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/StorageFS.git
cd StorageFS
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

The production build will be available in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── PasswordManager.tsx
│   ├── VoiceAssistant.tsx
│   └── SecureStorageService.ts
├── pages/              # Page components
│   └── StorageFS.tsx
├── utils/              # Utility functions
│   ├── SpeechUtils.ts
│   └── processVoiceCommand.ts
├── theme/              # Theme configuration
├── context/            # React context providers
└── App.tsx            # Main application component
```

## Voice Commands

StorageFS supports the following voice commands:

- **Adding Items**:
  - "Add [item name]"
  - "Put [item name]"
  - "Store [item name]"

- **Moving Items**:
  - "Move [item] to [location]"
  - "Transfer [item] to [location]"

- **Searching**:
  - "Find [item]"
  - "Search for [item]"
  - "Where is [item]"

- **Navigation**:
  - "Go to [location]"
  - "Open [location]"
  - "Show [location]"

## Security

StorageFS uses the following security measures:

- Password protection for accessing the app
- AES encryption for sensitive data
- Secure storage using CryptoJS
- Password hashing using SHA-256

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ionic Framework](https://ionicframework.com/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [CryptoJS](https://github.com/brix/crypto-js) 