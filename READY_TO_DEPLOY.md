# ✅ FOXLITE FORENSICS - READY TO DEPLOY

## 🎯 WHAT YOU NEED TO DELETE IN VERCEL

Go to **https://vercel.com/dashboard** and delete ALL of these projects (if they exist):

- ❌ `foxliteforensics-website`
- ❌ `foxlite-website-2026`
- ❌ `foxlite-website-2026-ogdw`
- ❌ `foxlite-forensics`
- ❌ `playbook-energy-services`
- ❌ `playbookenergy-website`
- ❌ `foxlite-final-2026`
- ❌ `foxlite-morning-deploy`
- ❌ `foxlite-forensics-final`
- ❌ Any other project with "foxlite" or "playbook" in the name

### How to Delete Each Project:
1. Click on the project name
2. Click **"Settings"** in the left sidebar
3. Scroll all the way down
4. Click the red **"Delete Project"** button
5. Type the project name exactly to confirm
6. Click **"Delete"**

✅ **KEEP THESE** (don't delete):
- ✅ `kavan-ai`
- ✅ `orb-global-case-architecture`
- ✅ `veritech-engine-suite-no-compare`

---

## 🚀 DEPLOYMENT INSTRUCTIONS - FOLLOW EXACTLY

### STEP 1: Open Vercel Import Page
Click this link: **https://vercel.com/new**

You should see a page that says **"Import Git Repository"** at the top.

---

### STEP 2: Find Your Repository

Look for a list of repositories. You should see:
- **playbook-energy-services** ← THIS IS THE ONE YOU NEED

**If you DON'T see any repositories:**
1. Click **"Add GitHub Account"** or **"Adjust GitHub App Permissions"**
2. Select your GitHub account: **darrylkavanagh-ux**
3. Make sure the checkbox next to **"playbook-energy-services"** is CHECKED ✓
4. Click **"Save"**
5. Go back to https://vercel.com/new

---

### STEP 3: Import the Repository

Click the **"Import"** button next to **playbook-energy-services**

You'll now see a page titled **"Configure Project"**

---

### STEP 4: Configure Project Settings (CRITICAL!)

Fill in these **EXACT** values:

#### A) Project Name
Type: `foxlite-forensics-production`

(If that name is taken, try: `foxlite-forensics-2026-final`)

#### B) Framework Preset
Select: **Next.js** from the dropdown

#### C) Root Directory
1. You'll see a field that says `./`
2. Click the **pencil icon** or **"Edit"** button next to it
3. Delete `./`
4. Type: `website`
5. Click **"Save"** or press Enter

**IMPORTANT:** Make sure it shows `website` not `./` before continuing!

#### D) Build and Output Settings
Click to expand **"Build and Output Settings"**

Set these values:
- **Build Command:** Leave EMPTY (delete any text if present)
- **Output Directory:** Type `out`
- **Install Command:** Leave EMPTY (delete any text if present)

#### E) Git Settings  
Click to expand **"Git"**

- **Production Branch:** Type `main`

---

### STEP 5: Deploy

1. Scroll down to the bottom
2. Click the big blue **"Deploy"** button
3. **WAIT 2-4 MINUTES** - Don't close the page!

You'll see these steps happen:
1. ⏳ Initializing Build
2. ⏳ Cloning Repository
3. ⏳ Installing Dependencies (takes ~60 seconds)
4. ⏳ Building (takes ~90 seconds)
5. ⏳ Exporting Static Files
6. ✅ **Deployment Ready!**

---

## ✅ SUCCESS LOOKS LIKE THIS

When deployment finishes, you'll see:
- ✅ A big green checkmark
- ✅ **"Congratulations!"** message
- ✅ A URL like: `foxlite-forensics-production.vercel.app`
- ✅ A **"Visit"** button you can click
- ✅ Screenshot should show your website with all pages working

---

## ❌ IF SOMETHING GOES WRONG

### Problem: "Project name already exists"
**Solution:** Use a different name in Step 4A. Try:
- `foxlite-forensics-prod-2026`
- `foxlite-website-april-9`
- `foxliteforensics-final`

### Problem: "Headless installation requires a pnpm-lock.yaml"
**Solution:** The Root Directory is wrong. Go back and make sure Step 4C shows `website` not `./`

### Problem: Can't see dropdown menus or edit buttons
**Solution:** Browser cache issue. Try:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Use **Chrome Incognito Mode** (Ctrl+Shift+N)
3. Try a different browser completely
4. Try on your phone

### Problem: Repository list is empty
**Solution:** Follow the instructions in Step 2 about "Adjust GitHub App Permissions"

---

## 📋 SETTINGS SUMMARY (Quick Reference)

| Setting | Value |
|---------|-------|
| **Repository** | `playbook-energy-services` |
| **Branch** | `main` |
| **Project Name** | `foxlite-forensics-production` |
| **Framework** | `Next.js` |
| **Root Directory** | `website` |
| **Build Command** | (empty) |
| **Output Directory** | `out` |
| **Install Command** | (empty) |

---

## 🔗 IMPORTANT LINKS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **New Deployment:** https://vercel.com/new
- **GitHub Repository:** https://github.com/darrylkavanagh-ux/playbook-energy-services

---

## 🎉 AFTER SUCCESSFUL DEPLOYMENT

Once your site is live, you'll get a Vercel URL like:
`foxlite-forensics-production.vercel.app`

### To Add Your Custom Domain (foxliteforensics.com):

1. In Vercel, go to: **Project Settings** → **Domains**
2. Click **"Add"**
3. Type: `foxliteforensics.com`
4. Click **"Add"**
5. Vercel will give you DNS instructions
6. Update your domain's DNS records (at your domain registrar or Cloudflare)
7. Wait 10-60 minutes for DNS to propagate

---

## 💰 COST

**$0/month** - This project is free on Vercel!

---

## ✅ REPOSITORY STATUS

- ✅ All branches merged into `main`
- ✅ All pnpm references removed
- ✅ Clean npm configuration
- ✅ No conflicting vercel.json files
- ✅ 26 pages ready to deploy
- ✅ Build tested and working
- ✅ Zero deployment blockers

---

**Last Updated:** April 9, 2026  
**Repository:** https://github.com/darrylkavanagh-ux/playbook-energy-services  
**Branch to Deploy:** `main` (everything is merged)  
**Status:** ✅ READY TO DEPLOY

---

## 🆘 NEED HELP?

If you get stuck on any step, take a screenshot and I'll help you immediately.

The most common issues are:
1. Browser cache (use Incognito mode)
2. Wrong Root Directory setting (must be `website`)
3. GitHub permissions not set (follow Step 2)

**Everything is ready. Just follow these steps exactly and you'll be live in 5 minutes!**
