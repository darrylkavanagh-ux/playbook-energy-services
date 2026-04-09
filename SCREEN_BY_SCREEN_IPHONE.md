# 📱 SCREEN-BY-SCREEN iPhone Deployment Guide
## Complete walkthrough with EVERY screen explained

---

## 🎯 **WHAT YOU NEED**

**Copy these values now** (you'll paste them later):

```
Project Name: foxlite-forensics-production
Root Directory: website
Production Branch: deploy-ready-april-9
Framework: Next.js
```

**Repository to select:** `playbook-energy-services` OR `foxlite-website-2026`

---

## 📋 **SCREEN 1: VERCEL LOGIN/DASHBOARD**

**What you see:**
- Vercel logo at top
- Your projects listed (or "Create a New Project" button)

**What to do:**
1. If not logged in, tap **Continue with GitHub**
2. Once logged in, you'll see your dashboard
3. Look for a button that says **"Add New..."** or **"Create Project"** or **"Import Project"**
4. **Tap that button**

**Direct link to skip to next screen:**
👉 https://vercel.com/new

---

## 📋 **SCREEN 2: IMPORT GIT REPOSITORY** ⬅️ **YOU ARE HERE**

**What you see:**
- Heading: "Import Git Repository" or "Select a Git Namespace"
- Your GitHub username (darrylkavanagh-ux)
- A list of your repositories with **Import** buttons
- Some repos might be **greyed out** (already connected)

**What to do:**

### Step 1: Find the correct repository
**Look for ONE of these two repos** (either will work):

**Option A (preferred):**
- Repository name: **playbook-energy-services**
- Status: Should have an **Import** button (blue/white)

**Option B (backup):**
- Repository name: **foxlite-website-2026**
- Status: Should have an **Import** button

### Step 2: Tap Import
- **Tap the Import button** next to the repository you found
- If the Import button is greyed out, scroll down to "What if my repo is greyed out?" section below

---

## 📋 **SCREEN 3: CONFIGURE PROJECT**

**What you see:**
- "Configure Project" heading
- A form with multiple fields
- "Deploy" button at bottom (don't tap yet!)

**What to do - Fill ALL 7 fields:**

### Field 1: **Project Name**
- **What you see:** Text box, might say something like "playbook-energy-services" or be empty
- **What to do:** Clear it and type: `foxlite-forensics-production`
- **⚠️ CRITICAL:** Type it exactly, no spaces, all lowercase

### Field 2: **Framework Preset**
- **What you see:** Dropdown menu, might say "Other" or "Next.js"
- **What to do:** Tap it and select **Next.js** from the list
- **Look for:** The Next.js logo (black/white triangle)

### Field 3: **Root Directory** ⚠️ **MOST IMPORTANT**
- **What you see:** Text showing `./` with a **pencil icon** or **Edit** button next to it
- **What to do:**
  1. **Tap the pencil icon** (this is easy to miss!)
  2. A text field will appear
  3. **Delete** the `./`
  4. **Type:** `website`
  5. **Tap the checkmark** or **Save** button
- **⚠️ VERIFY:** Make sure it shows `website` NOT `./`
- **Common mistake:** Leaving it as `./` will cause build failure

### Field 4: **Build Command**
- **What you see:** Text box that might say "npm run build" or be empty
- **What to do:** **Leave it empty** or leave default
- **Don't change it**

### Field 5: **Output Directory**
- **What you see:** Text box that might say "out" or be empty
- **What to do:** **Leave it empty** or leave as "out"
- **Don't change it**

### Field 6: **Install Command**
- **What you see:** Text box that might say "npm install" or be empty
- **What to do:** **Leave it empty** or leave default
- **Don't change it**

### Field 7: **Git Production Branch**
- **What you see:** Dropdown or text showing "main" or similar
- **What to do:**
  1. Tap the dropdown
  2. Look for **deploy-ready-april-9** in the list
  3. **Select it**
- **Alternative:** If you don't see a dropdown, type: `deploy-ready-april-9`

---

## 📋 **VERIFY BEFORE DEPLOYING**

**STOP and check these 3 critical settings:**

✅ **Root Directory = `website`** (NOT `./`)
✅ **Project Name = `foxlite-forensics-production`**
✅ **Production Branch = `deploy-ready-april-9`**

**If any are wrong, fix them now!**

---

## 📋 **SCREEN 4: DEPLOY**

**What to do:**
1. Scroll down to find the big **Deploy** button
2. **Tap Deploy**
3. **DO NOT** close Safari or switch apps

---

## 📋 **SCREEN 5: BUILDING**

**What you see:**
- "Building" or "Deploying" animation
- Progress bars or logs scrolling
- Might show: "Cloning repository...", "Installing dependencies...", "Building..."

**What to do:**
1. **Keep Safari open** (don't switch apps)
2. **Keep screen on** (tap it every 30 seconds if needed)
3. **Wait 5-7 minutes** (longer on slower internet)
4. **Set your Auto-Lock to Never:**
   - Open Settings app
   - Display & Brightness
   - Auto-Lock
   - Select "Never"
   - **Remember to change it back later!**

**What NOT to do:**
- ❌ Don't close Safari
- ❌ Don't switch to another app
- ❌ Don't let the screen lock
- ❌ Don't refresh the page
- ❌ Don't tap "Cancel"

---

## 📋 **SCREEN 6: SUCCESS**

**What you see:**
- "Congratulations!" or success message
- A **Visit** button
- Your project URL (something like `foxlite-forensics-production.vercel.app`)

**What to do:**
1. **Tap Visit**
2. Your website will open in Safari
3. Check that pages load correctly

---

## 🎉 **YOU'RE DONE!**

Your site is now live at: `https://foxlite-forensics-production.vercel.app`

**Save this URL:**
- Long-press the URL
- Tap **Copy**
- Save it in Notes or Messages

---

## 🚨 **TROUBLESHOOTING**

### **Problem 1: Repository is greyed out**

**Why:** The repository is already connected to another Vercel project

**Solution:**
1. Open: https://vercel.com/dashboard
2. Look for any project named "playbook-energy-services" or similar
3. Tap the project
4. Tap **Settings** (bottom of page)
5. Scroll to bottom
6. Tap **Delete Project** (red button)
7. Type the project name to confirm
8. Tap **Delete**
9. Go back to https://vercel.com/new and try again

---

### **Problem 2: Can't tap the pencil icon for Root Directory**

**Solution 1:** Zoom in
- Pinch to zoom on the Root Directory field
- The pencil icon will be bigger
- Tap it

**Solution 2:** Use landscape mode
- Rotate your iPhone sideways
- The UI will be larger
- Tap the pencil icon

**Solution 3:** Desktop mode
- In Safari, tap the **aA** button (top left)
- Tap **Request Desktop Website**
- The buttons will be easier to tap

---

### **Problem 3: Build fails with "pnpm" error**

**Why:** Wrong Root Directory (still set to `./` instead of `website`)

**Solution:**
1. The build will fail after a few minutes
2. You'll see error logs mentioning "pnpm"
3. **Don't panic!**
4. Tap **Deployments** at the top
5. Find your failed deployment
6. Tap the **three dots** (...)
7. Tap **Redeploy**
8. This time, carefully set Root Directory to `website`
9. Deploy again

**Alternative:** Delete the project and start over with correct settings

---

### **Problem 4: Deploy button is disabled/greyed out**

**Why:** Required fields are missing

**Solution:**
- Scroll up and check all fields are filled
- Make sure Root Directory is set to `website` (not `./`)
- Make sure Project Name is filled in

---

### **Problem 5: Build is taking more than 10 minutes**

**Normal or problem?**
- 3-7 minutes = normal
- 7-10 minutes = slower internet, but still normal
- More than 10 minutes = might be stuck

**Solution if stuck:**
1. Wait until 15 minutes
2. If still building, refresh the page
3. If build failed, check the logs for errors
4. Most common error: "pnpm" → means Root Directory is wrong

---

### **Problem 6: Site is blank/white after deployment**

**Solution:**
1. Wait 1-2 minutes (sometimes pages take time to generate)
2. Refresh the page (swipe down in Safari)
3. Try opening in a private tab:
   - Tap the tabs button (bottom right)
   - Tap **Private**
   - Paste your site URL
   - Open it

**If still blank:**
- Go back to Vercel dashboard: https://vercel.com/dashboard
- Tap your project
- Tap **Deployments**
- Tap the latest deployment
- Look at the **Function Logs** for errors

---

### **Problem 7: Deploy button not visible**

**Solution:**
- Scroll down on the page
- The Deploy button is at the bottom
- If you can't scroll, try:
  - Rotating to landscape mode
  - Tapping outside text fields to dismiss keyboard
  - Zooming out (pinch with two fingers)

---

## 📞 **STILL STUCK?**

**Check these resources:**

1. **Vercel Dashboard:** https://vercel.com/dashboard
   - See all your projects
   - Check deployment status
   - View error logs

2. **GitHub Repo:** https://github.com/darrylkavanagh-ux/playbook-energy-services
   - Verify the code is there
   - Check the branch exists: deploy-ready-april-9

3. **All deployment guides:** https://github.com/darrylkavanagh-ux/playbook-energy-services/tree/deploy-ready-april-9
   - More detailed troubleshooting
   - Alternative deployment methods

---

## ⏱️ **EXPECTED TIMELINE**

| Step | Time |
|------|------|
| Login to Vercel | 30 seconds |
| Find repository | 30 seconds |
| Fill form | 3-4 minutes |
| Deploy (tap button) | 5 seconds |
| Build process | 5-7 minutes |
| Verify site works | 1 minute |
| **TOTAL** | **10-13 minutes** |

---

## ✅ **FINAL CHECKLIST**

Before you tap Deploy, verify:

- [ ] Repository: playbook-energy-services OR foxlite-website-2026
- [ ] Project Name: `foxlite-forensics-production`
- [ ] Framework: Next.js
- [ ] Root Directory: `website` (NOT `./`)
- [ ] Production Branch: `deploy-ready-april-9`
- [ ] Phone charged 50%+
- [ ] WiFi connected
- [ ] Auto-Lock set to Never (or ready to tap screen)
- [ ] 15 minutes of uninterrupted time

---

## 🔗 **IMPORTANT LINKS (tap to open)**

**Start deployment:**
👉 https://vercel.com/new

**View your projects:**
👉 https://vercel.com/dashboard

**GitHub repository:**
👉 https://github.com/darrylkavanagh-ux/playbook-energy-services

**Deployment branch:**
👉 https://github.com/darrylkavanagh-ux/playbook-energy-services/tree/deploy-ready-april-9

**All guides:**
👉 https://github.com/darrylkavanagh-ux/playbook-energy-services/tree/deploy-ready-april-9

---

## 🎯 **QUICK REFERENCE CARD**

**Copy-paste these values:**

```
Project Name: foxlite-forensics-production
Root Directory: website
Production Branch: deploy-ready-april-9
Framework: Next.js
Repository: playbook-energy-services
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: (leave empty)
```

---

## 💡 **PRO TIPS FOR iPhone DEPLOYMENT**

1. **Use Safari** (not Chrome or other browsers)
2. **Landscape mode** makes buttons easier to tap
3. **Request Desktop Website** if mobile UI is too small
4. **Copy-paste settings** from Notes app to avoid typos
5. **Take screenshots** of each step (in case you need to repeat)
6. **Set Auto-Lock to Never** before deploying
7. **Close other apps** to free up memory
8. **Use WiFi not cellular** for faster upload
9. **Keep Safari in foreground** during build
10. **Don't answer calls** during the 5-7 minute build

---

**Ready? Start here:** 👉 https://vercel.com/new

