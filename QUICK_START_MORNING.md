# 📋 QUICK REFERENCE - FOXLITE DEPLOYMENT

## ✅ OVERNIGHT STATUS: ALL FIXED

**Code:** Clean and ready  
**Branch:** nocompare-cvk1100-analysis  
**Commit:** da4e6f5  
**Issues:** 0

---

## 🚀 DEPLOY IN 3 STEPS

### 1️⃣ IMPORT
**🔗 Go to:** https://vercel.com/new  
**Select:** playbook-energy-services  
**Click:** Import

### 2️⃣ CONFIGURE
```
Project Name: foxlite-production
Framework: Next.js
Root Directory: website
Production Branch: nocompare-cvk1100-analysis
```

### 3️⃣ DEPLOY
**Click:** Deploy button  
**Wait:** 2-3 minutes  
**Success:** ✅ Live website

---

## ⚠️ CRITICAL SETTINGS

| Setting | Value | Why |
|---------|-------|-----|
| Root Directory | `website` | Foxlite site location |
| Framework | `Next.js` | Auto-detects build |
| Production Branch | `nocompare-cvk1100-analysis` | Branch with fixes |

**If you forget the branch setting, you'll get pnpm errors again!**

---

## 🔗 ESSENTIAL LINKS

**Deploy:** https://vercel.com/new  
**Dashboard:** https://vercel.com/dashboard  
**Cloudflare:** https://dash.cloudflare.com  
**Repo:** https://github.com/darrylkavanagh-ux/playbook-energy-services

---

## 📧 EMAIL SETUP (AFTER DEPLOYMENT)

1. **Cloudflare:** Add foxliteforensics.com
2. **Nameservers:** Update at registrar
3. **Email Routing:** Enable in Cloudflare
4. **Addresses:** Create 4 emails (info@, audit@, support@, accounts@)

**Time:** 15 minutes  
**Cost:** FREE

---

## ✅ SUCCESS = GREEN CHECKMARK

You'll see:
- ✅ "Deployment ready"
- ✅ Preview URL
- ✅ "Visit" button
- ✅ All 26 pages work

---

## 🆘 TROUBLESHOOTING

**❌ pnpm error:** Wrong branch. Set to `nocompare-cvk1100-analysis`  
**❌ Build fails:** Check Root Directory = `website`  
**❌ 404 errors:** Check Framework = `Next.js`

---

**FULL GUIDE:** `MORNING_DEPLOYMENT_INSTRUCTIONS.md`

**START:** https://vercel.com/new

**TIME:** 10 minutes total
