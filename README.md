# Cursor 2026 - React Native + Express

A React Native mobile app (Expo) with a separate Node.js/Express backend.

## Project Structure

```
├── frontend/          # React Native (Expo) mobile app
│   ├── app/           # Expo Router screens
│   ├── components/
│   └── ...
├── backend/           # Express.js API server
│   └── src/
│       └── index.js
└── package.json       # Root scripts
```

## Prerequisites

- **Node.js** 18+ (install from [nodejs.org](https://nodejs.org))
- **npm**
- For physical device: **Expo Go** ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- For Android: Android Studio (emulator)
- For iOS: macOS + Xcode

## Getting Started

### 1. Install dependencies

```bash
# From project root
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Start the backend (Express)

```bash
npm run backend
# or with auto-reload: npm run backend:dev
```

API runs at `http://localhost:3000`  
Endpoints: `GET /api/health`, `GET /api/hello`

### 3. Start the frontend (Expo)

```bash
npm run frontend
```

Then:
- **a** – Android emulator
- **w** – Web browser
- **i** – iOS simulator (macOS)
- Scan QR code with Expo Go on device

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Expo, React Native, Expo Router, NativeWind (Tailwind CSS), TypeScript |
| Backend | Node.js, Express.js, CORS |

## API Usage from Mobile

Use your machine's local IP when testing on a physical device (Expo Go can't reach `localhost`):

```javascript
// Example: fetch from API
const API_URL = 'http://YOUR_LOCAL_IP:3000';
const res = await fetch(`${API_URL}/api/hello`);
const data = await res.json();
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run frontend` | Start Expo dev server |
| `npm run backend` | Start Express server |
| `npm run backend:dev` | Start Express with `--watch` |
| `npm run android` | Run app on Android |
| `npm run ios` | Run app on iOS |
| `npm run web` | Run app in browser |
