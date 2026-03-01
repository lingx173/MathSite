# Deploy to GitHub

The site is built and committed locally. Remote is set to **https://github.com/lingx173/MathSite.git**.

## 1. Create the repo on GitHub (one-time)

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** `MathSite` (or another name—if different, run `git remote set-url origin https://github.com/lingx173/YOUR-REPO-NAME.git`).
3. Leave it **empty** (no README, .gitignore, or license).
4. Click **Create repository**.

## 2. Push

In a terminal, from this folder (`MathSite`), run:

```bash
git push -u origin master
```

If your new repo uses `main` as the default branch:

```bash
git branch -M main
git push -u origin main
```

## 3. Host on Vercel

1. **Sign in**  
   Go to [vercel.com](https://vercel.com) and click **Sign Up** or **Log In**. Choose **Continue with GitHub** and authorize Vercel to access your GitHub account.

2. **Import the repo**  
   - Click **Add New…** → **Project**.  
   - Find **MathSite** in the list (or paste `https://github.com/lingx173/MathSite` if it doesn’t show up).  
   - Click **Import** next to it.

3. **Configure (optional)**  
   Vercel will detect Next.js and prefill:
   - **Framework Preset:** Next.js  
   - **Build Command:** `next build` (or leave default)  
   - **Output Directory:** leave default  
   - **Install Command:** `npm install` or `pnpm install`  
   You can leave these as-is.

4. **Set environment variable (required for practice generation)**  
   Before or after the first deploy, add the n8n webhook URL so “Generate 10 Questions” works:
   - In the Vercel project, go to **Settings** → **Environment Variables**.
   - Add **one** of:
     - **Name:** `N8N_PRACTICE_WEBHOOK_URL` (server-only, recommended), or  
     - **Name:** `NEXT_PUBLIC_N8N_WEBHOOK_URL` (same pattern as the Debate site)
     - **Value:** `https://ling-xue-uga.app.n8n.cloud/webhook/math-practice`
   - Apply to **Production** (and **Preview** if you want). Save, then **Redeploy** so the variable is used.

   **Local development:** Copy `.env.example` to `.env.local` and set the same URL so “Generate 10 Questions” works locally.

5. **Deploy**  
   Click **Deploy**. Vercel will build and deploy. When it’s done, you’ll get a URL like `mathsite-xxx.vercel.app`. You can add a custom domain later in **Settings → Domains**.

6. **Updates**  
   Pushing to the connected branch (e.g. `main`) on GitHub triggers a new deployment automatically.

---

**Other option:** [Netlify](https://netlify.com) — connect the repo and use build command `npm run build` and Next.js preset.
