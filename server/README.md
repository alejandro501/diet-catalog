# Server

This folder contains the Firebase server-side configuration for the project.

It includes:

- Firestore security rules
- Firestore indexes
- Firebase CLI project config

Typical commands:

```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes
```

After deploying the rules:

- enable Email/Password auth in Firebase Authentication
- create a Firestore database in production mode
- copy the web app config values into `client/.env.local`
- deploy `client/` separately to Vercel
