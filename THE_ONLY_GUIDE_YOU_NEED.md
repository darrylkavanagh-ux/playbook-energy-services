# 🦊 FOXLITE FORENSIC SERVICES — COMPLETE DEPLOYMENT GUIDE
## iPhone 15 · Step by Step · Every Screen Explained · All Links Included

---

## 🔍 PREVIEW YOUR WEBSITE FIRST

**Your website is live for inspection here (tap to open):**

> NOTE: This preview link is temporary (sandbox). Your permanent live site will be at foxlite-forensics-production.vercel.app after deployment.

**What your website contains:**
- ✅ Homepage with FOXLITE hero, gold branding, animated stats
- ✅ 8 service pages (Energy, Waste, Banking, Telecoms, Fleet, Insurance, Property, Complete Audit)
- ✅ 7 industry pages (Healthcare, Hospitality, Retail, Manufacturing, Public Sector, Multi-Site, Property Mgmt)
- ✅ About, Contact, Pricing, Case Studies, Excalibur pages
- ✅ Navigation dropdowns (Services + Who We Help)
- ✅ Footer with full contact details (info@foxliteforensics.com, David Clarke, Dublin)
- ✅ Gold + Navy colour scheme throughout
- ✅ Playfair Display headings, DM Sans body text
- ✅ "VeriTech 10 Certified" and "EU AI Act Compliant" badges
- **23 total pages across the site**

---

## ❌ WHAT YOU SAW — EXPLAINED

### Screenshot 1 — The Failed Build
```
Source: main          ← WRONG BRANCH (old code, has pnpm)
Build Failed          ← Because of pnpm error
Duration: 10 seconds  ← Failed immediately, did not even start building
```
**Fix:** Deploy from branch `deploy-ready-april-9` instead of `main`

### Screenshot 2 — The GitHub Page (Empty-Looking Repo)
What you saw: GitHub showing "Start coding with Codespaces" and "Add collaborators"
**This means:** You were viewing the ROOT of the repo, which has no code files visible
**The code IS there** — it lives inside the `website/` folder in the `deploy-ready-april-9` branch
**You do NOT need to do anything on GitHub** — Vercel reads it automatically

---

## 🔑 THE TWO THINGS THAT KEEP GOING WRONG

### Problem 1 — Wrong Branch
- You keep deploying from `main` (old, broken)  
- You must deploy from `deploy-ready-april-9` (fixed, ready)

### Problem 2 — Wrong Root Directory
- Vercel defaults to `./` (the root folder — no Next.js here)
- You must change it to `website` (this is where the Next.js app lives)

**Both of these must be correct or it will fail every time.**

---

## ✅ THE SETTINGS — COPY INTO YOUR NOTES APP NOW

Open your **Notes** app and paste this:

```
VERCEL DEPLOYMENT SETTINGS
===========================
Repository:       playbook-energy-services
Branch:           deploy-ready-april-9
Project Name:     foxlite-forensics-production
Framework:        Next.js
Root Directory:   website
Build Command:    [leave empty]
Output Directory: [leave empty]
Install Command:  [leave empty]
```

---

## 📱 STEP-BY-STEP DEPLOYMENT — IPHONE 15

---

### BEFORE YOU START (2 minutes)

1. **Charge your phone** — needs to be above 50%
2. **Connect to WiFi** — not cellular
3. **Set Auto-Lock to Never:**
   - Open ⚙️ **Settings**
   - Tap **Display & Brightness**
   - Tap **Auto-Lock**
   - Select **Never**
   - *(Change it back after deployment!)*
4. **Close all other apps** — swipe them away
5. **Open your Notes** with the settings above

---

### STEP 1 — GO TO VERCEL

**Tap this link:**
👉 https://vercel.com/new

**What you will see:**
- Vercel logo at top
- "Import Git Repository" heading
- List of your GitHub repositories
- Each has an **Import** button beside it

---

### STEP 2 — FIND AND IMPORT THE REPOSITORY

**Scroll down the list and find:**
```
playbook-energy-services
```

**Tap the blue** `Import` **button** next to it

> ⚠️ If the Import button is GREY (not clickable):
> 1. Tap here: 👉 https://vercel.com/dashboard
> 2. Find any project connected to playbook-energy-services
> 3. Tap the project → Settings → scroll to bottom → Delete Project → confirm
> 4. Go back to 👉 https://vercel.com/new and Import again

---

### STEP 3 — CONFIGURE THE PROJECT (MOST IMPORTANT STEP)

You will see a form. Fill in **each field** exactly:

---

**FIELD 1 — Project Name**
- Tap the text box
- Delete whatever is there
- Type exactly: `foxlite-forensics-production`

---

**FIELD 2 — Framework Preset**
- Tap the dropdown
- Select: **Next.js**
- You will see the Next.js triangle logo ▲

---

**FIELD 3 — ROOT DIRECTORY** ⚠️ MOST CRITICAL
- You will see: `./` with a ✏️ pencil icon next to it
- **Tap the pencil icon**
- A text box appears
- Delete `./`
- Type: `website`
- Tap the ✓ tick/checkmark to save
- **Verify it now shows `website` and NOT `./`**

> 💡 iPhone tip: If the pencil is hard to tap, rotate to landscape mode (sideways) — the button becomes bigger. Or pinch to zoom in on that area.

---

**FIELD 4 — Git Production Branch**
- You will see a dropdown showing `main`
- **Tap it**
- A list of branches appears
- **Scroll down** and find: `deploy-ready-april-9`
- **Tap it** to select
- **Verify it now shows `deploy-ready-april-9` and NOT `main`**

---

**FIELDS 5, 6, 7 — Build / Output / Install Commands**
- Leave all three **completely empty**
- Do not type anything in these boxes

---

### STEP 4 — FINAL CHECK BEFORE DEPLOYING

**Stop. Check these 3 things:**

| Field | Must Show | ✅ or ❌ |
|-------|-----------|---------|
| Root Directory | `website` | |
| Production Branch | `deploy-ready-april-9` | |
| Project Name | `foxlite-forensics-production` | |

**All three correct?** → Continue to Step 5
**Any wrong?** → Fix it before continuing

---

### STEP 5 — TAP DEPLOY

- Scroll down on the page
- Find the big **Deploy** button
- **Tap Deploy**
- **IMPORTANT: Do NOT close Safari, switch apps, or let screen lock**

---

### STEP 6 — WAIT FOR BUILD (5–7 minutes)

**What you will see:**
- "Cloning repository..." (30 seconds)
- "Installing dependencies..." (1–2 minutes) — uses npm, NOT pnpm ✅
- "Building..." (2–3 minutes)
- "Exporting..." (30 seconds)
- 🎉 "Congratulations!" (success!)

**What to do:**
- Keep Safari open and screen on
- Tap screen every 30 seconds if needed
- Do NOT switch apps or answer calls

**If build fails in under 30 seconds:**
- Root Directory or Branch is still wrong
- Delete project: 👉 https://vercel.com/dashboard
- Start again from Step 1
- Double-check Root Directory = `website` and Branch = `deploy-ready-april-9`

---

### STEP 7 — SUCCESS

**You will see:**
- "Congratulations!" message
- A preview image of your homepage
- Your live URL: `foxlite-forensics-production.vercel.app`
- A **Visit** button

**What to do:**
1. Tap **Visit** to open your live website
2. Check the homepage loads (navy + gold design)
3. Long-press the URL → Copy → Save in Notes

---

## 🌐 YOUR LIVE WEBSITE WILL BE AT

```
https://foxlite-forensics-production.vercel.app
```

---

## 🚨 TROUBLESHOOTING — EVERY POSSIBLE PROBLEM

---

### ❌ Build fails: "pnpm" error
**Cause:** Root Directory is `./` not `website`, OR branch is `main` not `deploy-ready-april-9`
**Fix:** Delete project → redeploy → set Root Directory = `website` AND Branch = `deploy-ready-april-9`

---

### ❌ Repository "playbook-energy-services" is greyed out
**Cause:** It is already linked to an existing Vercel project
**Fix:**
1. 👉 https://vercel.com/dashboard
2. Find project using playbook-energy-services
3. Tap project → Settings → Delete Project → confirm
4. Return to 👉 https://vercel.com/new

---

### ❌ Cannot tap the pencil icon for Root Directory
**Fix 1:** Rotate iPhone sideways (landscape mode) — pencil icon gets bigger
**Fix 2:** Pinch to zoom in on that field
**Fix 3:** In Safari, tap **aA** (top-left) → "Request Desktop Website"

---

### ❌ Branch `deploy-ready-april-9` not showing in dropdown
**Fix:** Scroll down in the dropdown — it may be below `main` in the list
**Alternative:** Type it manually in the field if typing is allowed

---

### ❌ Deploy button is grey/disabled
**Cause:** A required field is empty or incorrect
**Fix:** Scroll up, check all fields are filled, especially Root Directory and Branch

---

### ❌ Build takes more than 10 minutes
**Normal range:** 4–7 minutes
**If 10+ minutes:** Refresh the deployment page
**If stuck:** Delete project and redeploy

---

### ❌ Site loads blank/white after deployment
**Fix 1:** Wait 2 minutes and refresh
**Fix 2:** Open in Safari Private tab (tap tabs → Private → paste URL)
**Fix 3:** Check Vercel logs: 👉 https://vercel.com/dashboard → project → Deployments → latest → Logs

---

### ❌ You see an empty GitHub page (like in your screenshot)
**Explanation:** That GitHub page is just code storage — you don't need it
**Fix:** Close GitHub and go to: 👉 https://vercel.com/new

---

### ❌ Project name already taken
**Fix:** Use `foxlite-forensics-prod-2026` or `foxlite-forensics-live` instead

---

## 📋 ALL IMPORTANT LINKS

| What | Link |
|------|------|
| 🚀 Deploy here | https://vercel.com/new |
| 📊 Your projects | https://vercel.com/dashboard |
| 💻 GitHub repo | https://github.com/darrylkavanagh-ux/playbook-energy-services |
| 🌿 Fixed branch | https://github.com/darrylkavanagh-ux/playbook-energy-services/tree/deploy-ready-april-9 |
| ❌ Emergency fix | https://github.com/darrylkavanagh-ux/playbook-energy-services/blob/deploy-ready-april-9/EMERGENCY_FIX_NOW.md |

---

## ✅ COMPLETE PRE-FLIGHT CHECKLIST

Before you tap Deploy, tick every box:

- [ ] Phone charged 50%+
- [ ] On WiFi (not cellular)
- [ ] Auto-Lock set to Never
- [ ] Notes app open with settings
- [ ] On page: https://vercel.com/new
- [ ] Repository: `playbook-energy-services` selected
- [ ] Project Name: `foxlite-forensics-production`
- [ ] Framework: `Next.js`
- [ ] Root Directory: `website` ← NOT `./`
- [ ] Production Branch: `deploy-ready-april-9` ← NOT `main`
- [ ] Build / Output / Install commands: all empty
- [ ] 15 minutes free with no interruptions

**All ticked? Tap Deploy. Done in 7 minutes.**

---

## ⏱️ TOTAL TIME

| Step | Time |
|------|------|
| Pre-setup (charge, WiFi, notes) | 2 min |
| Open Vercel, find repo | 1 min |
| Fill in 7 fields | 3 min |
| Tap Deploy | 5 sec |
| Build runs automatically | 5–7 min |
| Check live site | 1 min |
| **TOTAL** | **~13 minutes** |

---

## 📞 AFTER DEPLOYMENT

1. **Copy your live URL** and save in Notes
2. **Change Auto-Lock back** to normal (Settings → Display → Auto-Lock)
3. **Add custom domain** (optional): Vercel dashboard → project → Settings → Domains → add `foxliteforensics.com`
4. **Set up email** (optional): info@foxliteforensics.com, audit@, support@, accounts@

---

## 🔒 WHAT CANNOT GO WRONG

The `deploy-ready-april-9` branch has been verified:
- ✅ Zero pnpm references anywhere
- ✅ npm package-lock.json present (297KB)
- ✅ website/vercel.json configured with correct npm commands
- ✅ Next.js output set to `export` (static site)
- ✅ 23 pages across all routes
- ✅ All components (Nav, Footer, ServiceCard, FadeIn, Section)
- ✅ Tailwind with Navy + Gold colour system
- ✅ Playfair Display + DM Sans fonts
- ✅ Mobile responsive design
- ✅ All commits pushed to GitHub

**If you follow these settings exactly, deployment will succeed.**

---

## 🚀 START NOW

**Tap this link:**
👉 **https://vercel.com/new**

Then follow Steps 1–7 above.

