# 🚀 Deploy FoxLite Forensics - FINAL INSTRUCTIONS

## ✅ WHAT YOU NEED TO KNOW

**Repository Name:** `playbook-energy-services`  
**GitHub URL:** https://github.com/darrylkavanagh-ux/playbook-energy-services  
**Branch to Deploy:** `nocompare-cvk1100-analysis`  
**Folder with Website:** `website`

---

## 🎯 STEP-BY-STEP DEPLOYMENT (5 MINUTES)

### STEP 1: Open Vercel Dashboard
Click this link: **https://vercel.com/dashboard**

Delete ALL these old/failed projects if they still exist:
- foxliteforensics-website
- foxlite-website-2026
- playbook-energy-services  
- Any other foxlite projects

To delete: Click project → Settings (bottom left) → Scroll down → Delete Project (red button)

---

### STEP 2: Start Fresh Import
Click this link: **https://vercel.com/new**

You'll see a page that says "Import Git Repository"

---

### STEP 3: Connect GitHub Repository
1. Look for "Import Git Repository" section
2. If you see a list of repositories, find and click: **playbook-energy-services**
3. If you DON'T see any repositories, click "Add GitHub Account" or "Adjust GitHub App Permissions"
   - Select your GitHub account (darrylkavanagh-ux)
   - Make sure "playbook-energy-services" is checked
   - Click Save

---

### STEP 4: Configure Project (CRITICAL SETTINGS)

You'll now see a page titled "Configure Project"

**Type these EXACT values:**

1. **Project Name:** `foxlite-forensics-final`  
   (or any unique name if that's taken)

2. **Framework Preset:** Select `Next.js` from dropdown

3. Click **"Build and Output Settings"** to expand it

4. **Root Directory:** Click EDIT button, then type: `website`

5. **Build Command:** Leave EMPTY (or if it has text, delete it)

6. **Output Directory:** Type: `out`

7. **Install Command:** Leave EMPTY (or if it has text, delete it)

8. Click **"Git"** to expand it (if present)

9. **Production Branch:** Type: `nocompare-cvk1100-analysis`

---

### STEP 5: Deploy
Click the big blue **Deploy** button at the bottom

Wait 2-3 minutes. You'll see:
- ✓ Cloning repository
- ✓ Installing dependencies  
- ✓ Building
- ✓ Deploying

When done, you'll see: **"Congratulations! Your project is live!"**

---

## 🎉 SUCCESS LOOKS LIKE THIS

✅ Green checkmark  
✅ A URL like: `foxlite-forensics-final.vercel.app`  
✅ A "Visit" button you can click  
✅ Your website loads with all pages working

---

## ❌ IF IT FAILS

**If you see pnpm errors:**
The branch setting is wrong. Delete the project and try again, making sure Step 4.9 says `nocompare-cvk1100-analysis`

**If dropdown menus don't appear:**
Your browser might be caching old Vercel data. Try:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Use a different browser (Chrome, Firefox, Edge)
3. Use Incognito/Private mode
4. Try on your phone

**If the repository list is empty:**
Click "Adjust GitHub App Permissions" and make sure the checkbox next to "playbook-energy-services" is CHECKED.

---

## 📋 QUICK REFERENCE

| Setting | Value |
|---------|-------|
| Repository | `playbook-energy-services` |
| Branch | `nocompare-cvk1100-analysis` |
| Root Directory | `website` |
| Framework | `Next.js` |
| Build Command | (empty) |
| Output Directory | `out` |
| Install Command | (empty) |

---

## 🆘 ALTERNATIVE: Use Direct Link

If the above doesn't work, try this pre-configured link:

**https://vercel.com/new/clone?repository-url=https://github.com/darrylkavanagh-ux/playbook-energy-services/tree/nocompare-cvk1100-analysis/website**

This should auto-fill most settings. Just:
1. Set Project Name to something unique
2. Click Deploy

---

## 💰 Cost
**$0/month** - Vercel is free for this project

---

## 📞 After Deployment
Once live, you'll get a URL. To add your custom domain `foxliteforensics.com`:
1. Go to Project Settings → Domains
2. Add `foxliteforensics.com`
3. Follow the DNS instructions Vercel provides

---

**Last Updated:** April 9, 2026  
**Repository:** https://github.com/darrylkavanagh-ux/playbook-energy-services  
**Branch:** nocompare-cvk1100-analysis  
**Commit:** Latest clean build with no pnpm references
