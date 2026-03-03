# Vijay Sridhar — Portfolio Site

A React + Vite personal portfolio with animated data pipeline footer, scroll-triggered counters, and interactive experience timeline.

---

## 🚀 Deploy in 3 Minutes (Vercel — Recommended)

This is the fastest path. No terminal needed.

### Step 1: Push to GitHub

1. Go to [github.com/new](https://github.com/new)
2. Name the repo `portfolio` (or whatever you like), set it to **Public**, click **Create repository**
3. Open your terminal and run:

```bash
cd vijay-portfolio-site
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import the `portfolio` repo you just pushed
4. Vercel auto-detects Vite — just click **Deploy**
5. In ~60 seconds you get a live URL like `portfolio-xyz.vercel.app`

### Step 3 (Optional): Custom Domain

1. In Vercel dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `vijaysridhar.com`)
3. Update your domain's DNS as Vercel instructs

Done. Every future `git push` to `main` auto-deploys.

---

## Alternative: Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site" → "Import an existing project"**
3. Connect GitHub, pick your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click Deploy

---

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output goes to `/dist` — this is what gets deployed.
