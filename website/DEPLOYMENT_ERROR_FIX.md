# 🚨 VERCEL DEPLOYMENT ERROR - IMMEDIATE FIX

## Error You're Seeing:

```
ERROR: Headless installation requires a pnpm-lock
Error: Command "npm install -g pnpm@10.4.1 && pnpm..."
```

## Root Cause:

**Vercel is STILL building from the repository root** instead of the `website/` directory!

The root directory has `pnpm-lock.yaml` (for the monorepo), but the website uses `npm` and `package-lock.json`.

---

## ✅ IMMEDIATE FIX (5 MINUTES)

### Step 1: Delete This Failed Deployment

1. **Go to:** https://vercel.com/dashboard
2. **Find project:** The one named "Ekv3ww9Wt" or similar
3. **Click on it**
4. **Click:** Settings (or three dots menu)
5. **Scroll to bottom:** "Delete Project"
6. **Confirm deletion**

### Step 2: Create New Deployment with CORRECT Settings

1. **Go to:** https://vercel.com/new
2. **Select:** `darrylkavanagh-ux/playbook-energy-services`
3. **CRITICAL SETTINGS:**

   ```
   Project Name: foxlite-forensics
   
   Framework Preset: Next.js
   
   Root Directory: website    ← MUST BE "website" NOT ". /" or blank!
   
   Build Command: npm run build
   
   Output Directory: out
   
   Install Command: npm install
   ```

4. **Double-check Root Directory shows:** `website`
5. **Click:** "Deploy"
6. **Wait 2-3 minutes**
7. ✅ **Success!**

---

## 🔍 WHY THIS ERROR HAPPENED

Your repository structure:
```
playbook-energy-services/
├── pnpm-lock.yaml          ← ROOT (Vercel tried to build HERE ❌)
├── package.json            ← Wrong package.json
├── server/
├── client/
└── website/                ← SHOULD BUILD HERE ✅
    ├── package.json        ← Correct package.json
    ├── package-lock.json   ← Uses npm, not pnpm
    ├── next.config.mjs
    └── out/
```

**When Root Directory is NOT set to `website`:**
- Vercel sees `pnpm-lock.yaml` at root
- Tries to use pnpm
- Fails because monorepo setup is wrong
- ❌ Build fails

**When Root Directory IS set to `website`:**
- Vercel only sees website/ folder
- Uses npm and package-lock.json
- Builds Next.js site correctly
- ✅ Build succeeds

---

## 📋 STEP-BY-STEP FIX (DO NOW)

### 1. Delete Failed Project ⏰ 1 minute

- Go to: https://vercel.com/dashboard
- Click on "Ekv3ww9Wt" project
- Settings → Delete Project

### 2. Re-import with Correct Settings ⏰ 2 minutes

- Go to: https://vercel.com/new
- Select: playbook-energy-services repository
- **VERIFY Root Directory = `website` before clicking Deploy!**

### 3. Deploy ⏰ 2-3 minutes

- Click Deploy
- Watch build logs
- Should complete successfully

---

## ✅ HOW TO VERIFY ROOT DIRECTORY IS CORRECT

**Before clicking Deploy, look at the configure screen:**

**CORRECT (Will Work ✅):**
```
Root Directory
website                    [Edit]
```

**WRONG (Will Fail ❌):**
```
Root Directory
. /                        [Edit]
```

**WRONG (Will Fail ❌):**
```
Root Directory
                           [Edit]
(blank field)
```

**WRONG (Will Fail ❌):**
```
Root Directory
./                         [Edit]
```

---

## 🎯 CRITICAL CHECKLIST

Before clicking Deploy, verify:

- [ ] Root Directory field shows: `website`
- [ ] NOT `. /`
- [ ] NOT blank
- [ ] NOT `./`
- [ ] Framework: Next.js
- [ ] Build Command: npm run build
- [ ] Output Directory: out

If ALL checkboxes are ✅, then Deploy will work!

---

## 🚀 EXPECTED SUCCESS

**After correct deployment, you'll see:**

1. ✅ Build logs showing npm install (not pnpm)
2. ✅ Next.js build completing successfully
3. ✅ "Deployment Ready" status
4. ✅ Live preview URL working
5. ✅ All 26 pages accessible

**Build time:** 2-3 minutes  
**Status:** Production Ready  
**Next step:** Add custom domain

---

## 🆘 IF STILL FAILING

**Check these:**

1. Root Directory = `website` ✅
2. Using npm not pnpm ✅
3. Building from website/ folder ✅
4. No pnpm-lock.yaml errors ✅

**If you see "pnpm" anywhere in the error logs:**
→ Root Directory is WRONG, delete and try again

**If you see "npm install" in the logs:**
→ Root Directory is CORRECT, build should work

---

## 📞 IMMEDIATE SUPPORT

**Vercel Support:**
- Live chat: https://vercel.com/help
- Tell them: "Need to set Root Directory to 'website' for Next.js project in monorepo"

---

## 🎯 QUICK REFERENCE

**Working Configuration:**
```
Repository: darrylkavanagh-ux/playbook-energy-services
Root Directory: website
Framework: Next.js
Build: npm run build
Output: out
```

**Direct Import Link:**
https://vercel.com/new

**Dashboard:**
https://vercel.com/dashboard

---

**Created:** 2026-04-08  
**Status:** Critical fix required  
**Action:** Delete failed project, re-import with Root Directory = website  
**Time:** 5 minutes total
