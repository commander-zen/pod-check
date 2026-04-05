# Pod Check

> Commander power balance checker for your LGS table.  
> Powered by [ScryCheck](https://scrycheck.com) — the best Commander deck analysis tool out there.

## How it works

1. **Host** opens the app, creates a session, gets a QR code
2. **Players** scan the QR → land on a join page → pick a seat → analyze their deck on ScryCheck → paste the result URL
3. Everyone watches a live lobby as each player submits
4. Once all 4 are ready → results push to every screen simultaneously

---

## Setup (one-time)

### 1. Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run everything in `supabase-setup.sql`
4. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **Note:** The `/api/scrape` serverless function only runs on Vercel.  
> For local dev, you can test the UI flow — the scrape step will fail until deployed.  
> To test scraping locally, run `vercel dev` instead of `npm run dev` (requires Vercel CLI).

---

## Deploy to Vercel

### First deploy

```bash
npm install -g vercel
vercel
```

Follow the prompts. When asked about the framework, select **Vite**.

### Add environment variables in Vercel

Go to your Vercel project → **Settings → Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | your Supabase anon key |

### Redeploy after adding env vars

```bash
vercel --prod
```

---

## Supabase Realtime

Make sure realtime is enabled on the `sessions` table:

1. Go to **Supabase Dashboard → Database → Replication**
2. Find the `sessions` table and toggle it on

This is what makes all 4 players' screens update simultaneously.

---

## Project structure

```
pod-check/
├── index.html
├── vite.config.js
├── package.json
├── vercel.json              ← SPA routing + API config
├── supabase-setup.sql       ← run once in Supabase dashboard
├── .env.example
├── api/
│   └── scrape.js            ← Vercel serverless: fetches + parses ScryCheck
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── lib/
    │   ├── supabase.js
    │   └── ui.jsx           ← shared tokens + tiny components
    ├── pages/
    │   ├── HostPage.jsx     ← session creation, QR, live lobby
    │   └── JoinPage.jsx     ← player join flow + results
    └── components/
        ├── PlayerCard.jsx
        └── BalanceVerdict.jsx
```

---

## Credits

Deck analysis is entirely powered by **[ScryCheck](https://scrycheck.com)**.  
This app just reads their result pages — please support them and send your players there directly.

Magic: The Gathering and all related trademarks are property of Wizards of the Coast LLC.  
Pod Check is an unofficial fan project.
