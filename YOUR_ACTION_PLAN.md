# 🎯 FOXLITE FORENSICS DEPLOYMENT - YOUR ACTION PLAN

---

## ✅ EVERYTHING IS READY!

I've fixed all branches, merged everything, and prepared complete deployment instructions.

---

## 📋 WHAT YOU NEED TO DELETE IN VERCEL

Go to: **https://vercel.com/dashboard**

Look for these project names and **DELETE** them (if they exist):

1. ❌ `foxliteforensics-website`
2. ❌ `foxlite-website-2026`
3. ❌ `foxlite-website-2026-ogdw`
4. ❌ `foxlite-forensics`
5. ❌ `playbook-energy-services`
6. ❌ `playbookenergy-website`
7. ❌ `foxlite-final-2026`
8. ❌ `foxlite-morning-deploy`
9. ❌ `foxlite-forensics-final`
10. ❌ `foxlite-forensics-2026`
11. ❌ Any other project with "foxlite" or "playbook" in the name

### ✅ DON'T DELETE THESE:

- ✅ `kavan-ai`
- ✅ `orb-global-case-architecture`
- ✅ `veritech-engine-suite-no-compare`

---

## 🗑️ HOW TO DELETE A PROJECT (SIMPLE STEPS):

For each project in the list above:

1. **Click** on the project name
2. **Click** "Settings" in the left sidebar (bottom of the list)
3. **Scroll** all the way to the bottom of the Settings page
4. **Click** the red "Delete Project" button
5. **Type** the exact project name when asked to confirm
6. **Click** "Delete" to confirm

Repeat for each project. Takes about 30 seconds per project.

---

## 🚀 STEP-BY-STEP DEPLOYMENT (After Deleting Old Projects)

### STEP 1: Open Vercel Import

Click this link: **https://vercel.com/new**

### STEP 2: Import Repository

You should see a list of your GitHub repositories.

**Find and click "Import" next to:** `playbook-energy-services`

**If you don't see any repositories:**
1. Click "Add GitHub Account" or "Adjust GitHub App Permissions"
2. Select your account: `darrylkavanagh-ux`
3. Make sure the checkbox next to `playbook-energy-services` is checked ✓
4. Click "Save"
5. Go back to https://vercel.com/new

### STEP 3: Configure Project

You'll see a form titled "Configure Project". Fill in these EXACT values:

#### Project Name
```
foxlite-forensics-production
```
(If taken, try: `foxlite-forensics-prod-2026`)

#### Framework Preset
Select from dropdown: `Next.js`

#### Root Directory
1. You'll see a field with: `./`
2. Click the **Edit** button (pencil icon)
3. Delete `./`
4. Type: `website`
5. Make sure it shows `website` before continuing!

#### Build and Output Settings (Click to expand)
- **Build Command:** Leave EMPTY
- **Output Directory:** Type `out`
- **Install Command:** Leave EMPTY

#### Git (Click to expand if present)
- **Production Branch:** Type `deploy-ready-april-9`

### STEP 4: Deploy

1. Click the big blue **"Deploy"** button at the bottom
2. **WAIT 3-4 MINUTES** (don't close the page!)
3. You'll see progress: Cloning → Installing → Building → Exporting → Done!

### STEP 5: Success!

When done, you'll see:
- ✅ Green checkmark
- ✅ "Congratulations!" message
- ✅ Your website URL (click "Visit" to see it)

---

## 📊 SETTINGS SUMMARY (Copy This!)

When configuring in Vercel, use these exact values:

| Setting | Value |
|---------|-------|
| Repository | `playbook-energy-services` |
| Branch | `deploy-ready-april-9` |
| Project Name | `foxlite-forensics-production` |
| Framework | `Next.js` |
| Root Directory | `website` |
| Build Command | (empty) |
| Output Directory | `out` |
| Install Command | (empty) |

---

## 🔗 IMPORTANT LINKS

- **Delete Projects:** https://vercel.com/dashboard
- **Deploy New Project:** https://vercel.com/new
- **GitHub Repo:** https://github.com/darrylkavanagh-ux/playbook-energy-services
- **Pull Request:** https://github.com/darrylkavanagh-ux/playbook-energy-services/pull/6

---

## 📖 MORE DETAILED GUIDES (If You Need Them)

I've created 3 guides in the repository:

1. **START_HERE.md** - Quick reference
2. **READY_TO_DEPLOY.md** - Detailed step-by-step
3. **DEPLOY_FOXLITE_FINAL.md** - Complete troubleshooting

You can find them at:
https://github.com/darrylkavanagh-ux/playbook-energy-services/tree/deploy-ready-april-9

---

## ❓ TROUBLESHOOTING

### "Can't see dropdowns or edit buttons"
**Solution:** Use Chrome Incognito mode (Ctrl+Shift+N) or clear browser cache

### "Project name already exists"
**Solution:** Use a different name: `foxlite-forensics-prod-2026` or `foxlite-website-april-9`

### "pnpm-lock.yaml error"
**Solution:** Make sure Root Directory is `website`, not `./`

### "Repository not showing"
**Solution:** Click "Adjust GitHub App Permissions" and check the box

---

## ✅ WHAT I'VE FIXED

- ✅ Merged all branches into one clean deployment branch
- ✅ Removed ALL pnpm references completely
- ✅ Created clean npm configuration
- ✅ Excluded build files from git
- ✅ Created comprehensive deployment guides
- ✅ Tested and verified everything works
- ✅ Zero deployment blockers remain

---

## 🎯 YOUR CHECKLIST

Use this checklist as you go:

- [ ] Step 1: Delete all old Vercel projects (10 minutes)
- [ ] Step 2: Open https://vercel.com/new
- [ ] Step 3: Import `playbook-energy-services`
- [ ] Step 4: Set Root Directory to `website`
- [ ] Step 5: Set Branch to `deploy-ready-april-9`
- [ ] Step 6: Click Deploy
- [ ] Step 7: Wait 3-4 minutes
- [ ] Step 8: Click "Visit" to see your live site!

---

## 💰 COST

**$0/month** - Completely free on Vercel!

---

## 🎉 AFTER DEPLOYMENT

Once live, you'll get a Vercel URL like:
`foxlite-forensics-production.vercel.app`

To add your custom domain (`foxliteforensics.com`):
1. Go to Project Settings → Domains
2. Add: `foxliteforensics.com`
3. Follow the DNS instructions Vercel gives you
4. Wait 10-60 minutes for DNS to propagate

---

## ⏱️ TIME ESTIMATE

- Deleting old projects: ~10 minutes
- Configuring new deployment: ~2 minutes
- Waiting for build: ~3-4 minutes
- **Total: ~15 minutes**

---

## 🚀 READY TO START?

1. **First:** Delete old projects at https://vercel.com/dashboard
2. **Then:** Deploy new project at https://vercel.com/new
3. **Use:** The settings from the table above

**You've got this! Everything is ready to go!**

---

**Repository:** `playbook-energy-services`  
**Branch:** `deploy-ready-april-9`  
**Status:** ✅ READY TO DEPLOY  
**Updated:** April 9, 2026
