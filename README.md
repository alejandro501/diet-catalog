# Diet Catalog

Diet Catalog is split into two parts:

- `client/`: the React + Vite frontend to deploy on Vercel
- `server/`: the Firebase configuration for shared persistence

This layout separates the browser app from the persistence layer so catalog changes live in Firebase and stay available across browsers and devices.

## Structure

```text
.
├── client/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
├── server/
│   ├── firebase.json
│   ├── firestore.indexes.json
│   └── firestore.rules
└── README.md
```

## Client

The client is a React + Vite app that now uses:

- Firebase Authentication for email/password login
- Cloud Firestore for catalog persistence
- server-stored user preferences for language and one-time seed initialization

Environment variables should live in `client/.env.local`. A template is included at `client/.env.example`.

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Run it locally:

```bash
cd client
npm install
npm run dev
```

Build it:

```bash
cd client
npm run build
```

## Server

The `server/` folder contains Firebase project config for:

- Firestore security rules
- Firestore indexes

The data model is designed for per-user persistence using Firebase Auth:

- each row belongs to an authenticated user
- users can only read and write their own data
- language preference is stored on the server
- starter catalog items are inserted once for a new account

Main files:

- `server/firebase.json`
- `server/firestore.rules`
- `server/firestore.indexes.json`

## Firebase workflow

From `server/`:

```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes
```

Then in Firebase console:

1. enable Authentication with the Email/Password provider
2. create a Firestore database in production mode
3. create a Firebase web app
4. copy the web app config values into `client/.env.local`
5. set the same values in your Vercel project environment variables

## Deployment

1. deploy the Firestore rules in `server/`
2. deploy `client/` to Vercel
3. set the `VITE_FIREBASE_*` variables in Vercel
4. sign up in the app and verify the same catalog appears from another browser
