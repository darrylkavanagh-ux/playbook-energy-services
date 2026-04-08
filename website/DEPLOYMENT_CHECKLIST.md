# ✅ Vercel Deployment Checklist - Foxlite Forensics

## 🎯 **CRITICAL: Root Directory MUST be "website"**

---

## **Pre-Flight Check**
- [ ] Local build works: `cd /home/user/webapp/website && npm run build` ✅
- [ ] 26 pages generated successfully ✅
- [ ] Repository: `darrylkavanagh-ux/playbook-energy-services` ✅
- [ ] Branch: `nocompare-cvk1100-analysis` ✅

---

## **Deployment Steps**

### 1️⃣ **Delete Failed Project** (if exists)
- [ ] Go to: https://vercel.com/dashboard
- [ ] Select project → Settings → Delete Project
- [ ] Confirm deletion

### 2️⃣ **Import Repository**
- [ ] Go to: https://vercel.com/new
- [ ] Select `darrylkavanagh-ux/playbook-energy-services`
- [ ] Click Import

### 3️⃣ **Configure Settings** ⚠️ **MOST IMPORTANT**
- [ ] **Project Name:** `foxlite-forensics`
- [ ] **Framework:** Next.js
- [ ] **Root Directory:** `website` ← **NOT "./" or blank**
- [ ] **Build Command:** `npm run build`
- [ ] **Output Directory:** `out`
- [ ] **Install Command:** `npm install`

### 4️⃣ **Deploy**
- [ ] Click **Deploy** button
- [ ] Wait 2-3 minutes
- [ ] Verify green checkmark ✅

### 5️⃣ **Add Custom Domain** (after successful deploy)
- [ ] Settings → Domains
- [ ] Add: `foxliteforensics.com`
- [ ] Add: `www.foxliteforensics.com`
- [ ] Follow DNS instructions
- [ ] Wait 10-60 min for propagation

---

## **Success Indicators**

✅ **Build succeeds in 2-3 minutes**  
✅ **Green "Ready" status**  
✅ **Preview URL works**  
✅ **Build logs show 26 pages**  
✅ **No pnpm errors**  
✅ **Site loads at preview URL**  

---

## **Red Flags 🚨**

❌ **Build fails with pnpm error** → Root Directory wrong  
❌ **"Project name exists"** → Use different name  
❌ **Build takes >10 min** → Wrong folder being built  
❌ **404 errors** → Domain DNS not configured  

---

## **Quick Links**

- **Dashboard:** https://vercel.com/dashboard
- **New Import:** https://vercel.com/new
- **Direct Repo Import:** https://vercel.com/new/git/external?repository-url=https://github.com/darrylkavanagh-ux/playbook-energy-services
- **Support:** https://vercel.com/help

---

## **One-Line Fix**

**The entire problem:** Vercel builds from `/` (pnpm) instead of `/website/` (npm).  
**The entire solution:** Set Root Directory to `website` when importing.

---

**Status:** Ready to Deploy ✅  
**Estimated Time:** 5-10 minutes total  
**Difficulty:** Beginner-friendly  
**Last Tested:** 2026-04-08 (Local build successful)
