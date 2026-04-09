# 🚀 DEPLOY FOXLITE - ULTIMATE NOVICE GUIDE
## For someone who has NEVER deployed a website before

**Total Time: 15 minutes**  
**Difficulty: EASY (just follow exactly)**

---

## 📱 BEFORE YOU START

**What you need:**
1. ✅ Your phone or computer (you have this!)
2. ✅ Internet connection (you have this!)
3. ✅ Your Vercel account (you already have this - you showed me your dashboard!)
4. ✅ 15 minutes of uninterrupted time

**That's it! You're ready!**

---

## 🎯 STEP 1: OPEN THE DEPLOYMENT PAGE

**On your phone or computer:**

1. **Tap or click THIS link below:**

   **👉 https://vercel.com/new 👈**

2. **The link will open in your browser** (Safari, Chrome, etc.)

3. **You'll see a page that says "Import Git Repository" at the top**

**✅ You're on the right page!**

---

## 👀 WHAT YOU'LL SEE - STEP 2

**You're now looking at a page with:**

**At the top:**
- Big text: "Import Git Repository"
- A search box

**Below that:**
- A list of repository names
- Each one has either:
  - A black "Import" button (these are available)
  - OR is grey with no button (these are already being used)

**Look at this list and find these names:**

1. **foxlite-final** - probably has "Import" button
2. **foxlite-website-2026** - probably has "Import" button  
3. **playbook-energy-services** - might be grey OR have "Import" button
4. **kavan-ai-website** - probably grey
5. **orb-global-case-architecture** - probably has "Import" button

**Don't click anything yet! Just look at them.**

---

## 🔍 STEP 3: WHICH REPOSITORY TO USE?

**Look ONLY at playbook-energy-services in the list**

### ✅ IF playbook-energy-services has a BLACK "Import" button:

**Perfect! Do this:**
1. **Click the "Import" button** next to playbook-energy-services
2. **Skip to STEP 5** (jump ahead!)

---

### ❌ IF playbook-energy-services is GREY with NO button:

**No problem! Do this instead:**

**Look at foxlite-website-2026 in the list**

1. **Click the "Import" button** next to foxlite-website-2026
2. **Continue to STEP 4**

---

## 🤔 STEP 4: STILL HAVING TROUBLE?

**If BOTH playbook-energy-services AND foxlite-website-2026 are grey:**

**Do this:**

1. **Close this browser tab** (the X in the corner)
2. **Wait 30 seconds** (count: 1 Mississippi, 2 Mississippi... to 30)
3. **Open a NEW browser tab**
4. **Copy and paste this link again:**
   
   **👉 https://vercel.com/new 👈**

5. **Press Enter**
6. **Try STEP 3 again**

**If STILL grey after trying this:**
- Look for ANY repository with a black "Import" button
- Click that Import button
- Continue to STEP 5

---

## 📝 STEP 5: CONFIGURE YOUR PROJECT

**You just clicked an "Import" button**

**Now you see a NEW page titled "Configure Project"**

**This page has several boxes to fill in. Follow these EXACTLY:**

---

### 📌 BOX 1: PROJECT NAME

**You'll see a box labeled "Project Name"**

**Inside it says something (maybe a random name)**

**Do this:**
1. **Click inside the box** (the cursor appears)
2. **Select all the text** (tap it 3 times on phone, or Ctrl+A / Cmd+A on computer)
3. **Press Delete or Backspace** (the box is now empty)
4. **Type EXACTLY this (copy and paste is best):**

```
foxlite-forensics-production
```

5. **Check:** The box now says exactly "foxlite-forensics-production"

**✅ Done with Box 1!**

---

### 🎨 BOX 2: FRAMEWORK PRESET

**You'll see a dropdown menu labeled "Framework Preset"**

**It might say "Other" or something else**

**Do this:**
1. **Click on the dropdown** (a menu opens)
2. **Scroll down and look for "Next.js"**
3. **Click on "Next.js"**
4. **The dropdown now shows "Next.js"**

**✅ Done with Box 2!**

---

### 📁 BOX 3: ROOT DIRECTORY (MOST IMPORTANT!)

**You'll see a field labeled "Root Directory"**

**It shows:** `./`

**Next to it you'll see a small PENCIL ICON (✏️) or the word "Edit"**

**This is THE MOST IMPORTANT step - follow carefully:**

1. **Click the pencil icon ✏️ OR "Edit" text**
2. **The field becomes editable** (white box with cursor)
3. **Delete the** `./` **(delete both characters)**
4. **Type EXACTLY:**

```
website
```

5. **Press Enter OR click outside the box**
6. **VERIFY:** It now shows `website` (NOT `./`)

**⚠️ CRITICAL:** If this doesn't say "website", your deployment will fail!

**✅ Done with Box 3!**

---

### 🔧 SECTION 4: BUILD AND OUTPUT SETTINGS

**Scroll down a bit**

**You'll see a section titled "Build and Output Settings"**

**It might be collapsed (folded up)**

**Do this:**
1. **Click on "Build and Output Settings"** (it expands open)

**Now you see 3 boxes:**
- Build Command
- Output Directory  
- Install Command

---

### 🧹 BOX 4A: BUILD COMMAND

**Look at the "Build Command" box**

**If it has ANY text in it:**
1. **Click inside the box**
2. **Select all** (triple tap or Ctrl+A / Cmd+A)
3. **Press Delete/Backspace**
4. **The box should be EMPTY**

**If it's already empty:**
- Perfect! Do nothing

**✅ Done with Box 4A!**

---

### 📤 BOX 4B: OUTPUT DIRECTORY

**Look at the "Output Directory" box**

**If it's empty OR says "out":**
- Perfect! Leave it alone

**If it has OTHER text:**
1. **Click inside**
2. **Delete all text**
3. **Leave it EMPTY**

**✅ Done with Box 4B!**

---

### 📥 BOX 4C: INSTALL COMMAND

**Look at the "Install Command" box**

**If it has ANY text:**
1. **Click inside**
2. **Select all**
3. **Delete**
4. **Leave it EMPTY**

**If it's already empty:**
- Perfect!

**✅ Done with Box 4C!**

---

### 🌿 SECTION 5: GIT SETTINGS

**Scroll down more**

**You'll see a section titled "Git"**

**Do this:**
1. **Click on "Git"** (it expands open)

**You'll see "Production Branch"**

**Do this:**
1. **Click inside the "Production Branch" box**
2. **Type EXACTLY:**

```
deploy-ready-april-9
```

**✅ Done with Section 5!**

---

## ✅ STEP 6: VERIFY EVERYTHING

**Before you click Deploy, scroll up and CHECK everything:**

**Your settings should look EXACTLY like this:**

```
✓ Project Name: foxlite-forensics-production
✓ Framework Preset: Next.js
✓ Root Directory: website  ← NOT ./
✓ Build Command: (empty - nothing in the box)
✓ Output Directory: (empty or says "out")
✓ Install Command: (empty - nothing in the box)
✓ Production Branch: deploy-ready-april-9
```

**If ANY of these are different:**
- Go back to Steps 5 and fix it
- Don't worry, you can't break anything!

**If ALL match:**
- Continue to Step 7!

---

## 🚀 STEP 7: CLICK DEPLOY!

**Scroll all the way to the bottom of the page**

**You'll see a BIG BLUE BUTTON**

**It says "Deploy"**

**Do this:**
1. **Click the blue "Deploy" button**
2. **Wait...**

**A new page opens!**

---

## ⏳ STEP 8: WAIT FOR BUILD (Don't close the page!)

**You're now on a page showing "Building..."**

**You'll see:**
- Spinning/loading animation at top
- A black box with scrolling green/white text
- Status updates

**The text will say things like:**
- "Cloning repository..."
- "Installing dependencies..."  
- "Building..."
- "Uploading..."

**This is NORMAL! Just wait.**

**Time: 3-5 minutes**

**DO NOT:**
- ❌ Close the page
- ❌ Click the back button
- ❌ Refresh the page

**DO:**
- ✅ Just watch it scroll
- ✅ Wait patiently
- ✅ Maybe grab a coffee ☕

---

## 🎉 STEP 9: SUCCESS!

**After 3-5 minutes, the page changes!**

**You'll see:**
- ✅ **"Ready"** at the top with a green checkmark
- OR **"Congratulations!"** message
- A preview image of your website
- A URL that looks like: `foxlite-forensics-production.vercel.app`
- A button that says **"Visit"** or **"View Deployment"**

**Do this:**
1. **Click the "Visit" button**

---

## 🌐 STEP 10: YOUR WEBSITE IS LIVE!

**A new tab opens**

**You see YOUR FOXLITE FORENSICS WEBSITE!**

**🎉 YOU DID IT! 🎉**

**Your website is now live on the internet at:**
```
https://foxlite-forensics-production.vercel.app
```

**Anyone in the world can visit this link and see your site!**

---

## 🆘 TROUBLESHOOTING

### 😰 Problem: "Project name already exists" (Step 7)

**When you click Deploy, you see an error**

**FIX:**
1. Click "Cancel" or go back
2. Change Project Name (Box 1) to: `foxlite-website-2026-final`
3. Try Deploy again

---

### 😰 Problem: Can't click the pencil icon (Step 5, Box 3)

**The pencil icon doesn't work**

**FIX:**
1. Close ALL browser tabs
2. Open Chrome or Edge browser (not Safari)
3. Press Ctrl+Shift+N or Cmd+Shift+N (opens Incognito/Private)
4. Go to: https://vercel.com/new
5. Start from Step 1 again

---

### 😰 Problem: Build fails with "pnpm" error (Step 8)

**The scrolling text shows red errors mentioning "pnpm"**

**FIX:**
1. You made a mistake in Step 5, Box 3 (Root Directory)
2. Look for a "Cancel" button and click it
3. Go to: https://vercel.com/dashboard
4. Find your project (foxlite-forensics-production)
5. Click on it
6. Click "Settings" in left sidebar
7. Click "General"
8. Find "Root Directory"
9. Change it to: `website`
10. Click "Save"
11. Go to "Deployments" at top
12. Click the "..." button on the failed deployment
13. Click "Redeploy"

---

### 😰 Problem: Taking more than 10 minutes (Step 8)

**Still building after 10 minutes**

**FIX:**
1. Something went wrong
2. Click outside the black box
3. Look for "Cancel Build" button
4. Click it
5. Take a screenshot of any errors
6. Try deploying again from Step 1

---

### 😰 Problem: Page won't load (Step 10)

**Clicked Visit but page doesn't load**

**FIX:**
1. Wait 1 minute (sometimes takes a moment)
2. Refresh the page (Ctrl+R or Cmd+R)
3. Try the URL directly: type it in browser
4. Clear browser cache and try again

---

## 📱 EXTRA HELP - ALL THE LINKS

**Copy and paste these links if you need them:**

### Main deployment link:
```
https://vercel.com/new
```

### Your Vercel dashboard:
```
https://vercel.com/dashboard
```

### GitHub repository:
```
https://github.com/darrylkavanagh-ux/playbook-energy-services
```

### Branch with all the fixes:
```
deploy-ready-april-9
```

---

## 📋 CHEAT SHEET - COPY THESE VALUES

**When filling in the Configure Project page:**

```
Project Name:
foxlite-forensics-production

Framework:
Next.js

Root Directory:
website

Build Command:
(leave empty)

Output Directory:
(leave empty)

Install Command:
(leave empty)

Production Branch:
deploy-ready-april-9
```

**Copy and paste these EXACT values!**

---

## 🎯 ALTERNATIVE: ONE OTHER OPTION

**If you've tried everything and it's still not working:**

**Use the CLI method (requires terminal/command line):**

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to your project folder
3. Type: `npx vercel --prod`
4. Press Enter
5. Follow the prompts
6. Done!

**But try the main method first - it's easier!**

---

## ✅ FINAL CHECKLIST

**Before you start:**

- [ ] I'm on a computer or phone with internet
- [ ] I have 15 minutes of time
- [ ] I'm logged into Vercel (you are - you showed me dashboard)
- [ ] I'm ready to follow steps exactly
- [ ] I won't skip any steps

**If all checked, START NOW!**

---

## 🎉 WHAT HAPPENS AFTER

**Once your site is live:**

1. ✅ Anyone can visit: `foxlite-forensics-production.vercel.app`
2. ✅ Your site is hosted FREE forever
3. ✅ You get automatic SSL (https://)
4. ✅ You can update it anytime (just push to GitHub)
5. ✅ Later you can add your custom domain (foxliteforensics.com)

---

## 💡 TIPS FOR SUCCESS

**✅ DO:**
- Follow steps exactly in order
- Read each step completely before doing it
- Double-check your typing (or copy-paste)
- Wait patiently during the build
- Ask for help if stuck

**❌ DON'T:**
- Skip steps
- Click random buttons
- Close pages while building
- Panic if something goes wrong (it's fixable!)
- Rush through it

---

## 🔗 START DEPLOYMENT NOW!

**Step 1: Click this link:**

👉 **https://vercel.com/new** 👈

**Step 2: Follow the guide starting at STEP 2 above**

**Step 3: Deploy your website!**

---

## 📞 NEED MORE HELP?

**Other guides I created for you:**

1. **EXACT_SCREEN_BY_SCREEN.md** - Same guide, slightly different format
2. **DEPLOY_CARD.md** - Quick reference card
3. **NOVICE_STEP_BY_STEP.md** - Another beginner guide
4. **Plus 10+ other guides!**

**All on GitHub:**
https://github.com/darrylkavanagh-ux/playbook-energy-services/tree/deploy-ready-april-9

---

## ⏱️ TIME BREAKDOWN

- **Steps 1-4:** 2 minutes (opening page, finding repository)
- **Steps 5-6:** 3 minutes (filling in settings)
- **Step 7:** 10 seconds (clicking Deploy)
- **Step 8:** 3-5 minutes (waiting for build)
- **Steps 9-10:** 1 minute (viewing your live site)

**Total: 10-12 minutes**

---

## 🎯 YOUR MISSION

**Start here:** https://vercel.com/new

**Goal:** See "Ready ✅" and your live website

**Time:** 15 minutes

**Difficulty:** EASY (if you follow exactly)

---

# 🚀 YOU'VE GOT THIS!

**Everything is ready.**  
**The code is perfect.**  
**Just follow the steps.**  
**You'll be live in 15 minutes!**

---

## 👉 START NOW! 👈

**Click:** https://vercel.com/new

**Then follow STEP 2 above!**

---

**GO DEPLOY YOUR WEBSITE!** 🎉
