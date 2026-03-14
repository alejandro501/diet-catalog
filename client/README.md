# Client

This folder contains the Vercel-deployed frontend for Diet Catalog.

It is a React + Vite app that uses:

- Firebase Authentication for email/password login
- Cloud Firestore for per-user catalog storage

Local development:

```bash
cd client
npm install
npm run dev
```

Build:

```bash
cd client
npm run build
```

Environment variables live in `client/.env.local`. Use `client/.env.example` as the template.
