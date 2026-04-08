# 🚨 VERCEL DEPLOYMENT FIX - STEP BY STEP

## Problem Identified:
Your Vercel project is configured incorrectly. It's trying to deploy from the root directory instead of the `website/` directory.

---

## ✅ SOLUTION 1: Delete & Re-Import Project (RECOMMENDED)

### Step 1: Delete the Failed Project
1. Go to: https://vercel.com/dashboard
2. Find project: "playbook-energy-services" or similar
3. Click on the project
4. Click "Settings" (gear icon)
5. Scroll to bottom: "Delete Project"
6. Type project name to confirm
7. Click "Delete"

### Step 2: Import Project Correctly
1. Go to: https://vercel.com/dashboard
2. Click: **"Add New..."** → **"Project"**
3. Click: **"Import Git Repository"**
4. Select: `darrylkavanagh-ux/playbook-energy-services`
5. **IMPORTANT**: Configure these settings:

   ```
   Project Name: foxlite-forensics
   Framework Preset: Next.js
   Root Directory: website          👈 CRITICAL!
   Build Command: npm run build
   Output Directory: out
   Install Command: npm install
   ```

6. Click: **"Deploy"**
7. Wait 2-3 minutes
8. ✅ Deployment will succeed

### Step 3: Add Custom Domain
1. After successful deployment, go to: Project Settings → Domains
2. Add domain: `foxliteforensics.com`
3. Add domain: `www.foxliteforensics.com`
4. Vercel will auto-configure DNS
5. ✅ Site live at https://foxliteforensics.com

---

## ✅ SOLUTION 2: Fix Existing Project (Alternative)

If you don't want to delete, fix the existing project:

### Step 1: Update Project Settings
1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Click: **"Settings"**
4. Go to: **"General"** section

### Step 2: Change Root Directory
1. Find: "Root Directory"
2. Click: **"Edit"**
3. Change to: `website`
4. Click: **"Save"**

### Step 3: Clear Build Cache
1. In Settings, go to: **"General"**
2. Scroll to: "Build & Development Settings"
3. Find: "Build Cache"
4. Click: **"Clear Build Cache"**

### Step 4: Redeploy
1. Go to: **"Deployments"** tab
2. Click: **"..." (three dots)** on latest deployment
3. Click: **"Redeploy"**
4. Check: **"Use existing Build Cache"** is UNCHECKED
5. Click: **"Redeploy"**
6. ✅ Should deploy successfully

---

## 🎯 QUICK START (For First-Time Users)

### Option A: Use Vercel CLI (Easiest for Beginners)

```bash
# 1. Navigate to website directory
cd /home/user/webapp/website

# 2. Install Vercel CLI locally
npm install vercel

# 3. Login to Vercel
npx vercel login
# Follow the browser prompts to login

# 4. Deploy to production
npx vercel --prod

# 5. Add custom domain
npx vercel domains add foxliteforensics.com

# 6. Done! ✅
```

### Option B: Use Vercel Dashboard (Visual Interface)

**DETAILED WALKTHROUGH:**

1. **Open Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Login with your account

2. **Start New Import**
   - Look for big button: "Add New..." or "Import Project"
   - Click it

3. **Connect GitHub** (if not already connected)
   - Click: "Continue with GitHub"
   - Authorize Vercel to access your repositories

4. **Import Repository**
   - Find: `darrylkavanagh-ux/playbook-energy-services`
   - Click: "Import"

5. **Configure Project** (MOST IMPORTANT STEP!)
   ```
   Project Name: foxlite-forensics
   Framework: Next.js
   Root Directory: website    👈 CLICK "Edit" and type "website"
   Build Command: npm run build
   Output Directory: out
   ```

6. **Click Deploy**
   - Vercel will show build logs
   - Wait 2-3 minutes
   - ✅ Success message appears

7. **Add Your Domain**
   - Go to: Project Settings → Domains
   - Type: foxliteforensics.com
   - Click: "Add"
   - Vercel auto-configures DNS
   - ✅ Done!

---

## 📸 VISUAL GUIDE - What You Should See

### ✅ CORRECT Configuration:
```
Root Directory: website
Build Command: npm run build
Output Directory: out
```

### ❌ WRONG Configuration (Your Current Issue):
```
Root Directory: (blank or /)
Build Command: npm run build
Output Directory: out
```

---

## 🚨 TROUBLESHOOTING COMMON ERRORS

### Error: "This deployment cannot be redeployed"
**Fix:** Delete project and re-import OR clear build cache and redeploy

### Error: "Build failed - Cannot find package.json"
**Fix:** Set Root Directory to `website`

### Error: "Command 'npm run build' exited with 1"
**Fix:** Clear build cache, ensure Root Directory is `website`

### Error: Multiple deployments queued
**Fix:** Cancel all deployments, delete project, start fresh

---

## 🎯 DIRECT LINKS FOR YOUR ACCOUNT

### 1. Vercel Dashboard
https://vercel.com/dashboard

### 2. Import New Project
https://vercel.com/new

### 3. GitHub Authorization
https://vercel.com/account/git-integrations

### 4. Vercel Documentation (Deploying Next.js)
https://vercel.com/docs/frameworks/nextjs

### 5. Domain Configuration Guide
https://vercel.com/docs/projects/domains

---

## 📋 COMPLETE CHECKLIST

Before you start:
- [ ] Open Vercel Dashboard: https://vercel.com/dashboard
- [ ] Delete existing failed project (if any)
- [ ] Have GitHub account connected

During import:
- [ ] Select correct repository
- [ ] Set Root Directory to `website`
- [ ] Verify Framework is Next.js
- [ ] Verify Build Command is `npm run build`
- [ ] Verify Output Directory is `out`

After deployment:
- [ ] Check deployment succeeded (green checkmark)
- [ ] Add domain: foxliteforensics.com
- [ ] Add domain: www.foxliteforensics.com
- [ ] Test site loads: https://foxliteforensics.com

---

## 💡 BEGINNER TIP

**The #1 reason your deployment is failing:**

You're trying to deploy the entire repository (which contains multiple projects) instead of just the `website/` folder.

**The fix is simple:**
When importing, set **Root Directory** to `website`

This tells Vercel: "Only build the files in the website folder, ignore everything else."

---

## 🎬 VIDEO TUTORIAL (If You Need Visual Help)

Vercel's official guide:
https://vercel.com/docs/getting-started-with-vercel

YouTube search: "How to deploy Next.js to Vercel"
Recommended: https://www.youtube.com/results?search_query=deploy+nextjs+vercel+tutorial

---

## 📞 NEED HELP?

1. Vercel Support: https://vercel.com/support
2. Vercel Community: https://github.com/vercel/vercel/discussions
3. Discord: https://vercel.com/discord

---

**Created:** 2026-04-08  
**Status:** Ready to use  
**Difficulty:** Beginner-friendly ✅
