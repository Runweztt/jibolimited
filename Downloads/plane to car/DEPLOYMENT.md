# Plane to Car — Vercel Deployment Guide (Testing)

> **Current setup:** Frontend + Backend both on Vercel (free tier).
> This is for testing and demos. When you're ready for production, you'll move
> the backend to a Hostinger VPS and connect a real domain.

---

## Table of Contents

1. [Before You Start](#1-before-you-start)
2. [Push Your Code to GitHub](#2-push-your-code-to-github)
3. [Deploy the Backend to Vercel](#3-deploy-the-backend-to-vercel)
4. [Deploy the Frontend to Vercel](#4-deploy-the-frontend-to-vercel)
5. [Connect Frontend to Backend](#5-connect-frontend-to-backend)
6. [Configure Supabase](#6-configure-supabase)
7. [Test Everything End-to-End](#7-test-everything-end-to-end)
8. [How to Push Updates](#8-how-to-push-updates)
9. [Vercel Free Tier Limits](#9-vercel-free-tier-limits)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Before You Start

### Accounts you need (all free)

| Service | Sign up at |
|---|---|
| GitHub | github.com |
| Vercel | vercel.com — sign up with GitHub |
| Supabase | supabase.com |
| Gmail | gmail.com (for sending emails) |

### Credentials to collect before starting

Write these down — you'll paste them into Vercel's environment variables panel.

**From Supabase** — go to your project → **Project Settings** → **API**:
```
SUPABASE_URL              = https://xxxxxxxxxx.supabase.co
SUPABASE_KEY              = eyJ...  (labelled "anon / public")
SUPABASE_SERVICE_ROLE_KEY = eyJ...  (labelled "service_role" — click Reveal)
```

**Generate a SECRET_KEY** — run this in any terminal that has Python:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```
Copy the output (looks like `a3f9b2...`). This signs your admin login tokens.

**Admin credentials** — you choose these yourself:
```
ADMIN_EMAIL    = admin@anything.com   (you decide)
ADMIN_PASSWORD = a strong password    (you decide)
```

**Gmail App Password** (for sending emails):
1. Go to your Google account → **Security** → turn on **2-Step Verification** if it's off
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Click **Create app password** → type `Plane to Car` → click **Create**
4. Copy the **16-character password** shown — you can't see it again after closing
```
MAIL_USERNAME = youremail@gmail.com
MAIL_PASSWORD = xxxx xxxx xxxx xxxx   (the 16-char app password, spaces are fine)
```

> ⚠️ If you skip the email setup, the app still works — emails are just silently skipped.

---

## 2. Push Your Code to GitHub

Vercel pulls your code from GitHub every time you deploy.

### Step 1 — Check .gitignore

Make sure these files are NOT being committed (they contain secrets).

Open `frontend/.gitignore` and confirm these lines exist:
```
.env
.env.local
.env.production
```

Open `backend/.gitignore` (create it if it doesn't exist) and confirm:
```
.env
venv/
__pycache__/
*.pyc
*.pyo
.env.local
```

### Step 2 — Create a GitHub repository

1. Go to [github.com](https://github.com) → click the **"+"** button (top right) → **"New repository"**
2. Name it `plane-to-car`
3. Set visibility to **Private**
4. Do **not** check "Add a README" — your project already has files
5. Click **"Create repository"**

### Step 3 — Push your project

Open your terminal in the **root folder** of your project (the `plane to car` folder) and run:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/plane-to-car.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

After it finishes, refresh your GitHub repo page — all your files should be listed there.

> If you already have git set up and just need to push changes:
> ```bash
> git add .
> git commit -m "ready for vercel"
> git push
> ```

---

## 3. Deploy the Backend to Vercel

The backend must be deployed first so you have its URL to give to the frontend.

### Step 1 — Import the backend project on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find your `plane-to-car` repository and click **"Import"**

### Step 2 — Configure the build settings

This is the most important step — get it wrong and the deploy fails.

On the **"Configure Project"** screen, fill in exactly:

| Setting | Value | Why |
|---|---|---|
| **Project Name** | `plane-to-car-api` | Distinguishes backend from frontend |
| **Framework Preset** | `Flask` | Select Flask from Vercel's preset list |
| **Root Directory** | *(leave blank)* | Backend code is already at the repo root |
| **Build Command** | *(leave blank)* | No build step needed for Python |
| **Output Directory** | *(leave blank)* | No build output |
| **Install Command** | `'pip install -r requirements.txt'` | Installs Flask and dependencies |

> ⚠️ **Leave Root Directory blank** — your backend code is already at the root of its repo. Setting it to `backend` will cause the deploy to fail.

### Step 3 — Add environment variables

Still on the same screen, scroll down to **"Environment Variables"** and add each one below.
Click **"Add"** for each row. Make sure all three checkboxes are ticked for each variable:
**Production ✓ Preview ✓ Development ✓**

| Variable | Value |
|---|---|
| `SUPABASE_URL` | `https://xxxxxxxxxx.supabase.co` |
| `SUPABASE_KEY` | your anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service_role key |
| `FLASK_APP` | `main.py` |
| `FLASK_ENV` | `production` |
| `SECRET_KEY` | your generated hex string |
| `FRONTEND_URL` | `*` (wildcard for now — you'll tighten this after the frontend is deployed) |
| `ADMIN_EMAIL` | your chosen admin email |
| `ADMIN_PASSWORD` | your chosen admin password |
| `MAIL_SERVER` | `smtp.gmail.com` |
| `MAIL_PORT` | `587` |
| `MAIL_USE_TLS` | `true` |
| `MAIL_USERNAME` | your Gmail address |
| `MAIL_PASSWORD` | your 16-char Gmail App Password |
| `MAIL_DEFAULT_SENDER` | `Plane to Car <youremail@gmail.com>` |

> `FRONTEND_URL=*` allows any origin for now during testing. Once the frontend is deployed
> you'll update this to the exact Vercel URL.

### Step 4 — Deploy

Click **"Deploy"**. Vercel will install dependencies and start your Flask app.

This takes about 1–2 minutes. When it finishes you'll see a success screen.

Your backend URL will look like:
```
https://plane-to-car-api.vercel.app
```

Copy this URL — you need it in the next section.

### Step 5 — Verify the backend is alive

In your browser or terminal, visit:
```
https://plane-to-car-api.vercel.app/health
```

You should see:
```json
{"status": "healthy"}
```

If you see an error instead, jump to [Troubleshooting](#10-troubleshooting).

---

## 4. Deploy the Frontend to Vercel

### Step 1 — Import the frontend as a separate project

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. Select the **same** `plane-to-car` repository — one repo, two projects
3. Click **"Import"**

### Step 2 — Configure the build settings

| Setting | Value | Why |
|---|---|---|
| **Project Name** | `plane-to-car` | The main user-facing project |
| **Framework Preset** | `Vite` | Vercel recognises Vite automatically |
| **Root Directory** | `frontend` | Points Vercel to the frontend folder only |
| **Build Command** | `npm run build` | Vite builds React into static files |
| **Output Directory** | `dist` | Where Vite puts the built files |
| **Install Command** | `npm install` | Installs React and dependencies |

### Step 3 — Add environment variables

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://plane-to-car-api.vercel.app/api` |

Paste the **exact backend URL** from Step 4 of the previous section, with `/api` appended.

Tick all three environments: **Production ✓ Preview ✓ Development ✓**

### Step 4 — Deploy

Click **"Deploy"**. Takes about 1–2 minutes.

Your frontend URL will look like:
```
https://plane-to-car.vercel.app
```

Click **"Visit"** to confirm the site loads.

---

## 5. Connect Frontend to Backend

Now that both are deployed, tighten the CORS setting so the backend only accepts requests from your frontend.

### Step 1 — Update FRONTEND_URL in the backend project

1. Go to Vercel → open the **`plane-to-car-api`** project (the backend)
2. Click **"Settings"** (top nav) → **"Environment Variables"**
3. Find `FRONTEND_URL` → click the edit (pencil) icon
4. Change the value from `*` to your actual frontend URL:
   ```
   https://plane-to-car.vercel.app
   ```
5. Click **"Save"**

### Step 2 — Redeploy the backend

Changing an environment variable doesn't take effect until you redeploy.

1. Click **"Deployments"** tab (top nav of the backend project)
2. Find the latest deployment → click the **three dots (⋯)** on the right
3. Click **"Redeploy"** → confirm

Wait for it to finish (~1 minute).

---

## 6. Configure Supabase

Supabase needs to know which URLs are allowed to use its authentication system.

### Step 1 — Set the Site URL

1. Go to [supabase.com](https://supabase.com) → open your project
2. Click **"Authentication"** in the left sidebar
3. Click **"URL Configuration"**
4. Set **Site URL** to your frontend Vercel URL:
   ```
   https://plane-to-car.vercel.app
   ```

### Step 2 — Add Redirect URLs

Still on the same page, under **"Redirect URLs"**, click **"Add URL"** and add:
```
https://plane-to-car.vercel.app
https://plane-to-car.vercel.app/**
```

Click **"Save"**.

> If you skip this step, users will get a redirect error from Supabase after logging in.

### Step 3 — Run the database schema (if you haven't already)

If your Supabase database tables don't exist yet:

1. In Supabase → click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open `backend/database.sql` from your project folder
4. Copy the entire contents and paste into the SQL editor
5. Click **"Run"** (green play button)
6. You should see: `Success. No rows returned`

---

## 7. Test Everything End-to-End

Run through this checklist to confirm the full app is working:

### Backend health
- [ ] Visit `https://plane-to-car-api.vercel.app/health` → should return `{"status":"healthy"}`

### User flow
- [ ] Visit `https://plane-to-car.vercel.app`
- [ ] Click **Sign Up** → create a passenger account → confirm you're redirected to the dashboard
- [ ] Click **New Booking** → fill in the form → submit → booking appears in dashboard

### Admin flow
- [ ] Go to `https://plane-to-car.vercel.app/admin/login`
- [ ] Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in the env vars
- [ ] Admin dashboard loads showing all bookings
- [ ] **Add a concierge:** fill in name, email, phone → click "Add Concierge"
  - Concierge should appear in the "Concierge Team" panel
  - A welcome email should arrive at the concierge's email address
- [ ] **Assign concierge to a booking:** select a booking → choose the concierge from the dropdown
  - Passenger should receive an email with the concierge's name and phone number
  - Concierge should receive an email with the passenger's booking details

### Email test
- [ ] If emails aren't arriving, check your spam/junk folder first
- [ ] Confirm `MAIL_PASSWORD` is a 16-character App Password, not your regular Gmail password

---

## 8. How to Push Updates

### Frontend changes

Just push to GitHub — Vercel auto-deploys instantly:

```bash
git add .
git commit -m "describe your change"
git push origin main
```

Vercel detects the push and rebuilds the frontend automatically. Takes ~1 minute.
Watch the progress at: **Vercel dashboard → plane-to-car → Deployments**

### Backend changes

Same — just push to GitHub:

```bash
git add .
git commit -m "describe your change"
git push origin main
```

Vercel auto-redeploys the backend project too.

> Both Vercel projects watch the same GitHub repo. When you push, **both** will redeploy.
> If you only changed frontend code, the backend redeploy does nothing harmful.

### Changing environment variables

1. Go to Vercel → the relevant project → **Settings** → **Environment Variables**
2. Edit the value → click **Save**
3. Go to **Deployments** → latest deployment → **⋯** → **Redeploy**

Variables only take effect after a redeploy.

---

## 9. Vercel Free Tier Limits

Know these before you start getting real users:

| Limit | Free (Hobby) | What happens if exceeded |
|---|---|---|
| Deployments per day | 100 | Deploy queue pauses |
| Serverless function timeout | **10 seconds** | Request returns a 504 error |
| Bandwidth per month | 100 GB | Site may be throttled |
| Build minutes per month | 6,000 min | Builds queue or pause |
| Functions per deployment | 12 | Deployment fails |

### The 10-second timeout is the most important limit

Every API request to your Flask backend must complete within 10 seconds.
Requests that take longer (e.g. slow SMTP email sending) will return a 504 error to the user.

In practice for this app:
- Regular API calls (login, bookings, dashboard) — typically 200–800ms ✅
- Email sending — 2–8 seconds depending on Gmail's SMTP — may occasionally hit the limit ⚠️

**If emails are timing out:** The email still sends in the background but the API returns a 504.
To fix this properly you'd need the Hostinger VPS (no timeout limit). For testing, it's fine.

---

## 10. Troubleshooting

### Backend health check returns an error

**Visit:** `https://plane-to-car-api.vercel.app/health`

If you see `{"error": "..."}` or a Vercel error page:

1. Go to Vercel → `plane-to-car-api` → **Deployments**
2. Click the latest deployment
3. Click **"Functions"** tab or **"Build Logs"**
4. Read the error — it's almost always one of:
   - A missing environment variable (re-check all vars in Step 3 of Section 3)
   - An import error in Python code (syntax issue)

---

### Frontend loads but shows blank or crashes on login

**Cause:** `VITE_API_URL` is wrong or pointing to a non-working backend.

**Fix:**
1. Open browser DevTools (`F12`) → **Console** tab → look for red errors
2. Open **Network** tab → look for failed requests → read the response
3. Confirm `VITE_API_URL` in the frontend Vercel project is:
   ```
   https://plane-to-car-api.vercel.app/api
   ```
   (must include `/api` at the end, no trailing slash)

---

### CORS error in the browser console

Looks like: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Cause:** `FRONTEND_URL` in the backend project doesn't match the actual frontend URL.

**Fix:**
1. Go to Vercel → `plane-to-car-api` → **Settings** → **Environment Variables**
2. Find `FRONTEND_URL` → confirm it matches `https://plane-to-car.vercel.app` exactly
3. No trailing slash, correct `https://`, correct subdomain
4. Redeploy the backend after changing it

---

### "504 Gateway Timeout" on certain requests

**Cause:** The request took longer than 10 seconds (Vercel free plan limit).

**Most common trigger:** Email sending via SMTP is slow.

**Quick fix for testing:** The app still works — the email might have sent even though the API returned 504. Check the recipient's inbox.

**Permanent fix:** Move the backend to a Hostinger VPS (no timeout limit) when you go to production.

---

### Admin login returns 401 Unauthorized

**Cause:** `ADMIN_EMAIL` or `ADMIN_PASSWORD` in the backend env vars doesn't match what you're typing.

**Fix:**
1. Go to Vercel → `plane-to-car-api` → **Settings** → **Environment Variables**
2. Double-check `ADMIN_EMAIL` and `ADMIN_PASSWORD` — copy them exactly as typed
3. Redeploy if you make changes

---

### Emails not arriving

Work through this checklist:
- [ ] Check the recipient's **spam / junk folder** first
- [ ] Confirm `MAIL_PASSWORD` is the **16-character App Password**, not your regular Gmail password
- [ ] Confirm **2-Step Verification is ON** in your Google account (required for App Passwords)
- [ ] Confirm `MAIL_USERNAME` is the full Gmail address (e.g. `yourname@gmail.com`)
- [ ] In Vercel → backend project → **Deployments** → latest → **Functions** → check logs for `[EMAIL]` lines

---

### Supabase login redirect fails / blank page after login

**Cause:** Your Vercel URL is not in Supabase's allowed redirect URLs.

**Fix:**
1. Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL** = `https://plane-to-car.vercel.app`
3. Add to **Redirect URLs**: `https://plane-to-car.vercel.app/**`
4. Save

---

### "Add Concierge" button does nothing / shows error

**Cause:** Usually a Supabase service role key issue or missing env var.

**Check:**
1. Visit `https://plane-to-car-api.vercel.app/health` — is it healthy?
2. In browser DevTools → **Network** → find the failed `/admin/concierges/add` request → read the response body
3. Go to Vercel → backend project → **Functions** logs → find the error

---

## When You're Ready for Production

When you want to go live with a real domain and move to Hostinger VPS, the upgrade path is:

1. Buy a VPS on Hostinger (Ubuntu 22.04)
2. Buy or connect a domain
3. Follow the full VPS deployment steps (documented separately)
4. Update `VITE_API_URL` on Vercel to point to your new VPS backend
5. Update `FRONTEND_URL` on the VPS `.env` to your domain
6. Update Supabase redirect URLs to your new domain

The frontend stays on Vercel forever — only the backend moves to the VPS.
