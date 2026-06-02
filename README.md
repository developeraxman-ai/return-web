# THE RETURN - Daily Ledger

A private discipline tracking MVP built with Next.js App Router, TypeScript, MongoDB Atlas, Mongoose, Tailwind CSS, and OpenAI.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these variables in `.env.local` and in Vercel:

```bash
MONGODB_URI=
JWT_SECRET=
OPENAI_API_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:you@example.com
CRON_SECRET=
```

Generate browser notification keys:

```bash
npx web-push generate-vapid-keys
```

Use the public key for both `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PUBLIC_KEY`.

The Vercel cron in `vercel.json` calls `/api/cron/notifications` hourly. The route checks each user's saved timezone and sends challenge notifications only when that user's local hour is 9 PM. In production, call it with:

```bash
Authorization: Bearer <CRON_SECRET>
```

## Deploy

Push the repo to GitHub, import it in Vercel, add the environment variables, and deploy. MongoDB Atlas must allow Vercel network access.
