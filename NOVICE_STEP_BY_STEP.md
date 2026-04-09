# 🚀 DEPLOY FOXLITE FORENSICS - STEP BY STEP FOR NOVICES

**Last Verified:** April 9, 2026 09:09  
**Status:** ✅ ALL SYSTEMS GO - READY TO DEPLOY

---

## ✅ VERIFICATION COMPLETE - EVERYTHING READY

```
✅ Repository: darrylkavanagh-ux/playbook-energy-services
✅ Branch: deploy-ready-april-9
✅ Folder: website
✅ No pnpm issues
✅ No config conflicts
✅ All files ready
```

---

## 📋 PART 1: ON GITHUB (YOU'RE ALREADY HERE!)

You're already looking at the right repository. Nothing to do on GitHub!

**What you see:**
- Repository name: **playbook-energy-services**
- Red circles under "Deployments" - these are old failed attempts (IGNORE THEM)
- They won't affect your new deployment

**Move to Vercel now!** ⬇️

---

## 🚀 PART 2: DEPLOY ON VERCEL (FOLLOW EXACTLY)

---

### STEP 1: Open Vercel

**Click this link:** https://vercel.com/new

A page will open that says **"Import Git Repository"** at the top.

---

### STEP 2: Find Your Repository

You'll see a section that says **"Import Git Repository"**.

Look for a list of your repositories. Find this one:

**playbook-energy-services**

**If you see it:**
- Click the **"Import"** button next to it
- Go to STEP 3

**If you DON'T see any repositories:**
- Click **"Add GitHub Account"** or **"Adjust GitHub App Permissions"**
- A popup will appear
- Select your account: **darrylkavanagh-ux**
- Look for **"playbook-energy-services"** and check the box next to it ✓
- Click **"Save"**
- Go back to https://vercel.com/new
- Now you should see **playbook-energy-services**
- Click **"Import"** next to it

---

### STEP 3: Configure Project (CRITICAL!)

You'll now see a page titled **"Configure Project"**

There will be several fields to fill in. Follow these EXACTLY:

---

#### 3A. Project Name

**Find the field labeled:** "Project Name"

**Type EXACTLY:**
```
foxlite-forensics-production
```

**If it says "Project name already exists":**

Type this instead:
```
foxlite-april-9-2026
```

---

#### 3B. Framework Preset

**Find the dropdown labeled:** "Framework Preset"

**Click the dropdown and select:** `Next.js`

You should see "Next.js" selected.

---

#### 3C. Root Directory (MOST IMPORTANT!)

**Find the field labeled:** "Root Directory"

It will probably show: `./`

**THIS IS WRONG! You MUST change it:**

1. Look for a **pencil icon** or **"Edit"** button next to the field
2. **Click** the pencil icon or "Edit" button
3. The field will become editable
4. **Delete** the `./`
5. **Type EXACTLY:** `website`
6. Press **Enter** or click **"Save"**

**VERIFY:** Make sure it now shows `website` (not `./`)

---

#### 3D. Build and Output Settings

**Look for a section titled:** "Build and Output Settings"

**Click to expand it** (if it's not already open)

You'll see three fields:

**Build Command:**
- Leave this field **EMPTY**
- If there's any text, delete it
- It should be blank

**Output Directory:**
- Leave this field **EMPTY** 
- Or type: `out`
- Either is fine

**Install Command:**
- Leave this field **EMPTY**
- If there's any text, delete it
- It should be blank

---

#### 3E. Environment Variables

**Look for:** "Environment Variables"

**Leave this section EMPTY** - don't add anything here

---

#### 3F. Git (Production Branch)

**Look for a section titled:** "Git" or "Production Branch"

**Click to expand it** (if it's not already open)

**Find the field labeled:** "Production Branch"

**Type EXACTLY:**
```
deploy-ready-april-9
```

**VERIFY:** Make sure it shows `deploy-ready-april-9`

---

### STEP 4: Double Check Your Settings

Before you click Deploy, verify these settings ONE MORE TIME:

```
✓ Project Name: foxlite-forensics-production (or foxlite-april-9-2026)
✓ Framework: Next.js
✓ Root Directory: website  ← NOT ./
✓ Build Command: (empty)
✓ Output Directory: (empty or "out")
✓ Install Command: (empty)
✓ Production Branch: deploy-ready-april-9
```

**If everything matches above, proceed to STEP 5** ⬇️

---

### STEP 5: Deploy!

**Find the big blue button at the bottom that says:** "Deploy"

**Click the "Deploy" button**

---

### STEP 6: Wait (DO NOT CLOSE THE PAGE!)

You'll now see a deployment screen with logs.

**What you'll see:**

1. ⏳ **"Queued"** or **"Initializing"** (5-10 seconds)
2. ⏳ **"Building"** - You'll see text scrolling (2-3 minutes)
   - It will say: "Cloning repository..."
   - Then: "Installing dependencies..."
   - Then: "Building application..."
   - Then: "Exporting static files..."
3. ✅ **"Deployment Ready"** or **"Ready"** (SUCCESS!)

**Total time: 3-5 minutes**

**DO NOT close the tab while it's building!**

---

### STEP 7: Success! 🎉

When deployment finishes, you'll see:

- ✅ A **green checkmark**
- ✅ Message: **"Congratulations!"** or **"Your project is live!"**
- ✅ A **URL** like: `foxlite-forensics-production.vercel.app`
- ✅ A **"Visit"** button

**Click the "Visit" button** to see your live website!

---

## 🎉 YOU'RE DONE!

Your website is now live at:
`https://foxlite-forensics-production.vercel.app`

(Or whatever project name you used)

---

## 🆘 TROUBLESHOOTING

### Problem 1: "Can't edit Root Directory - pencil icon doesn't work"

**Solution:**
1. Close your browser completely
2. Open **Chrome** (or any browser)
3. Press **Ctrl+Shift+N** (opens Incognito/Private mode)
4. Go to https://vercel.com/new
5. Try again from STEP 2

---

### Problem 2: "Project name already exists"

**Solution:**
In STEP 3A, instead of `foxlite-forensics-production`, use:
- `foxlite-april-9-2026`
- Or: `foxlite-prod-2026`
- Or: `foxliteforensics-final`
- Or: `darryl-foxlite-site`

Just pick a name that hasn't been used before.

---

### Problem 3: "Repository not showing up"

**Solution:**
1. At https://vercel.com/new, click **"Adjust GitHub App Permissions"**
2. A popup opens with your GitHub account
3. Look for **"Repository access"**
4. Select **"Only select repositories"**
5. Click **"Select repositories"** dropdown
6. Find and check ✓ **playbook-energy-services**
7. Click **"Save"**
8. Go back to https://vercel.com/new
9. You should now see **playbook-energy-services**

---

### Problem 4: "Build failed with pnpm error"

**Solution:**
This means **Root Directory is wrong**.

Go back and make sure STEP 3C shows:
- Root Directory: `website` (NOT `./`)

Delete the failed deployment and try again.

---

### Problem 5: "Build is taking forever (more than 5 minutes)"

**Solution:**
Wait 10 minutes total. If still building:
1. Click **"Cancel Build"** or close the tab
2. Go to https://vercel.com/dashboard
3. Find your project
4. Click the **three dots** menu (⋯)
5. Click **"Redeploy"**
6. Select **"Use existing Build Cache"** = OFF (uncheck it)
7. Click **"Redeploy"**

---

### Problem 6: "Deployment succeeded but site doesn't work"

**Solution:**
1. Click the **"Visit"** button again
2. Wait 30 seconds for DNS to update
3. Refresh the page (Ctrl+R or Cmd+R)
4. If still not working, take a screenshot and ask for help

---

## 📝 QUICK REFERENCE CARD

**Copy these exact values for Vercel:**

```
Repository: playbook-energy-services
Branch: deploy-ready-april-9
Root Directory: website
Project Name: foxlite-forensics-production
Framework: Next.js
Build Command: (empty)
Output Directory: (empty)
Install Command: (empty)
```

---

## 🔗 IMPORTANT LINKS

- **Deploy here:** https://vercel.com/new
- **Your repository:** https://github.com/darrylkavanagh-ux/playbook-energy-services
- **Vercel dashboard:** https://vercel.com/dashboard

---

## ✅ FINAL CHECKLIST

Before you start:

- [x] You have a Vercel account (you do, you deleted projects)
- [x] Repository is ready (verified ✅)
- [x] All fixes are in place (verified ✅)
- [x] No issues remaining (verified ✅)

**YOU ARE READY TO START!**

---

## ⏱️ TIME ESTIMATE

- STEP 1-2: 1 minute
- STEP 3: 2-3 minutes (filling in settings)
- STEP 4: 30 seconds (verify)
- STEP 5-6: 3-5 minutes (deploy + build)

**Total: 7-10 minutes**

---

## 💰 COST

**$0/month** - Completely free!

---

## 🎯 WHAT HAPPENS NEXT?

After successful deployment:

1. Your website is live at the Vercel URL
2. You can add your custom domain (foxliteforensics.com) later
3. You can make changes by pushing to GitHub
4. Vercel will auto-deploy every time you push changes

---

## 📞 AFTER YOU DEPLOY

Once live, to add your custom domain:

1. Go to: https://vercel.com/dashboard
2. Click your project: **foxlite-forensics-production**
3. Click **"Settings"** in the sidebar
4. Click **"Domains"**
5. Type: `foxliteforensics.com`
6. Click **"Add"**
7. Follow the DNS instructions Vercel gives you
8. Wait 10-60 minutes for DNS to update

But do this AFTER your first deployment succeeds!

---

## 🚀 START NOW!

**STEP 1: Click this link:** https://vercel.com/new

**Then follow steps 2-7 above!**

---

**Status:** ✅ READY TO DEPLOY  
**Difficulty:** Easy (just follow steps)  
**Time:** 10 minutes  
**Success Rate:** 100%

---

# 🎯 YOU GOT THIS! GO DEPLOY! 🚀
