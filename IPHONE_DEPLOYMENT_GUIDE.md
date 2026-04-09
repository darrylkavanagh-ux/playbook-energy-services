# 📱 DEPLOY FOXLITE FROM YOUR IPHONE 15
## Complete guide for iPhone-only deployment

**Total Time: 15 minutes**  
**Device: iPhone 15**  
**What you need: Just your phone!**

---

## 🎯 STEP 1: OPEN SAFARI

**On your iPhone:**

1. **Tap the Safari icon** (blue compass on your home screen)
2. Safari opens

---

## 🔗 STEP 2: GO TO VERCEL

**In Safari:**

1. **Tap the address bar** (top of screen)
2. **Type or paste this:**

```
vercel.com/new
```

3. **Tap "Go"** on keyboard
4. The page loads...

**You'll see:**
- "Import Git Repository" at the top
- A list of repository names below

---

## 👀 STEP 3: LOOK AT THE LIST

**Scroll down and look at the repository names**

**Find these:**
- playbook-energy-services
- foxlite-website-2026  
- foxlite-final

**Look at playbook-energy-services:**

### ✅ IF it has a black "Import" button:
- **Tap "Import"** next to playbook-energy-services
- **Skip to STEP 5**

### ❌ IF it's grey with NO button:
- **Tap "Import"** next to foxlite-website-2026 instead
- **Continue to STEP 4**

---

## 🤔 STEP 4: STILL GREY?

**If ALL repositories are grey:**

1. **Close the Safari tab** (tap the tabs icon, swipe left on the tab)
2. **Open a NEW tab** (tap + button)
3. **Type:** `vercel.com/new` again
4. **Try STEP 3 again**

**Still grey?**
- **Tap "Import"** on ANY repository that has the button
- Continue to STEP 5

---

## 📝 STEP 5: CONFIGURE PROJECT PAGE

**You tapped "Import"**

**New page loads titled "Configure Project"**

**You'll see several boxes to fill in**

**⚠️ IMPORTANT: Read each step carefully before tapping**

---

## 📱 BOX 1: PROJECT NAME

**You see a text field labeled "Project Name"**

**Do this:**

1. **Tap inside the text field**
2. **Tap and hold** on the text until "Select All" appears
3. **Tap "Select All"**
4. The text is now highlighted blue
5. **Tap anywhere on keyboard** to start typing
6. **Type EXACTLY (use suggested text if possible):**

```
foxlite-forensics-production
```

7. **Tap "Done"** on keyboard (bottom right)

**✅ Done! The box now says "foxlite-forensics-production"**

---

## 📱 BOX 2: FRAMEWORK PRESET

**You see "Framework Preset" with a dropdown**

**Do this:**

1. **Tap the dropdown** (where it says "Other" or something)
2. A menu appears with options
3. **Scroll down** in the menu
4. **Look for "Next.js"**
5. **Tap "Next.js"**
6. The menu closes

**✅ Done! It now shows "Next.js"**

---

## 📱 BOX 3: ROOT DIRECTORY (CRITICAL!)

**You see "Root Directory" showing:** `./`

**Next to it is a small pencil icon (✏️) or "Edit"**

**⚠️ THIS IS THE MOST IMPORTANT STEP:**

1. **Tap the pencil icon ✏️** (or tap "Edit")
2. The field becomes editable (keyboard appears)
3. **Delete the** `./` **characters:**
   - Tap backspace twice OR
   - Select all and delete
4. **Type EXACTLY:**

```
website
```

5. **Tap "Done"** on keyboard

**VERIFY:** The field now shows `website` (NOT `./`)

**⚠️ If this isn't "website", your deployment WILL FAIL!**

**✅ Done! Root Directory = website**

---

## 📱 SECTION 4: BUILD SETTINGS

**Scroll down**

**You see "Build and Output Settings"**

**Do this:**

1. **Tap on "Build and Output Settings"**
2. It expands to show 3 boxes

---

## 📱 BOX 4A: BUILD COMMAND

**You see "Build Command" box**

**If it has ANY text:**
1. **Tap inside the box**
2. **Select all the text** (tap and hold → Select All)
3. **Tap backspace** to delete
4. **Leave it EMPTY**

**If already empty:**
- Perfect! Don't touch it

**✅ Done!**

---

## 📱 BOX 4B: OUTPUT DIRECTORY

**You see "Output Directory" box**

**If it's empty OR says "out":**
- Perfect! Leave it alone

**If it has other text:**
1. **Tap inside**
2. **Select all**
3. **Delete**
4. **Leave EMPTY**

**✅ Done!**

---

## 📱 BOX 4C: INSTALL COMMAND

**You see "Install Command" box**

**If it has ANY text:**
1. **Tap inside**
2. **Select all**
3. **Delete**
4. **Leave EMPTY**

**If already empty:**
- Perfect!

**✅ Done!**

---

## 📱 SECTION 5: GIT BRANCH

**Scroll down more**

**You see "Git" section**

**Do this:**

1. **Tap on "Git"** to expand it
2. You see "Production Branch" field
3. **Tap inside the field**
4. **Type EXACTLY:**

```
deploy-ready-april-9
```

5. **Tap "Done"** on keyboard

**✅ Done!**

---

## ✅ STEP 6: VERIFY EVERYTHING

**Before deploying, scroll up and CHECK:**

**Your screen should show:**

```
✓ Project Name: foxlite-forensics-production
✓ Framework: Next.js  
✓ Root Directory: website  ← NOT ./
✓ Build Command: (empty)
✓ Output Directory: (empty or "out")
✓ Install Command: (empty)
✓ Production Branch: deploy-ready-april-9
```

**If anything is different:**
- Scroll back and fix it
- Use Steps 5-6 again

**If everything matches:**
- Continue to Step 7!

---

## 🚀 STEP 7: DEPLOY!

**Scroll all the way down**

**You see a BIG BLUE BUTTON: "Deploy"**

**Do this:**

1. **Tap the "Deploy" button**
2. **Wait...**

**New page loads!**

---

## ⏳ STEP 8: WAIT FOR BUILD

**You're now on "Building" page**

**You see:**
- Spinning animation at top
- "Building..." or "Deploying..." text
- Black box with scrolling green/white text
- Progress updates

**The text shows things like:**
- "Cloning repository..."
- "Installing dependencies..."
- "Building application..."
- "Uploading..."

**This is NORMAL!**

**DO NOT:**
- ❌ Close Safari
- ❌ Switch apps
- ❌ Lock your phone
- ❌ Tap back button
- ❌ Refresh page

**DO:**
- ✅ Keep Safari open
- ✅ Watch the progress
- ✅ Wait patiently
- ✅ Keep phone unlocked (or it might pause)

**Time: 3-5 minutes**

**☕ Maybe grab a coffee while you wait!**

---

## 🎉 STEP 9: SUCCESS!

**After 3-5 minutes, the page changes!**

**You see:**
- ✅ "Ready" at top with green checkmark
- OR "Congratulations!" message
- Preview image of your website
- A URL like: `foxlite-forensics-production.vercel.app`
- A button: "Visit" or "View Deployment"

**Do this:**

1. **Tap the "Visit" button**

---

## 🌐 STEP 10: YOUR WEBSITE IS LIVE!

**New page opens in Safari**

**YOU SEE YOUR FOXLITE FORENSICS WEBSITE!**

**🎉 YOU DID IT! 🎉**

**Your website is now live at:**
```
https://foxlite-forensics-production.vercel.app
```

**Anyone with the link can see your site!**

**You can share this link with anyone!**

---

## 📱 IPHONE-SPECIFIC TIPS

### Tip 1: Keep Screen On
**While building (Step 8):**
- Tap screen occasionally to keep it awake
- Or go to Settings → Display → Auto-Lock → Set to "Never" (temporarily)
- Remember to change it back after!

### Tip 2: Use Copy-Paste
**When typing long text:**
- Take a screenshot of this guide
- Or keep this page open in another tab
- Copy text from here, paste into Vercel

### Tip 3: Zoom In
**If text is too small:**
- Use pinch-to-zoom (two fingers spread apart)
- Zoom into the form fields
- Makes it easier to see and tap

### Tip 4: Landscape Mode
**For easier typing:**
- Turn your iPhone sideways (landscape)
- Keyboard becomes larger
- Easier to type accurately

### Tip 5: Safari Reading List
**Save this guide:**
- Tap Share button (square with arrow)
- Tap "Add to Reading List"
- Access anytime even offline

---

## 🆘 IPHONE TROUBLESHOOTING

### 😰 Problem: Can't tap pencil icon (Step 5, Box 3)

**The pencil icon ✏️ doesn't work when you tap it**

**FIX:**
1. **Try tapping and holding** the pencil icon (1 second)
2. Or **try tapping directly on the** `./` **text**
3. Or **zoom in** (pinch to zoom) and tap pencil icon
4. Or **close Safari tab**, reopen vercel.com/new, try again

---

### 😰 Problem: Keyboard covers the text field

**Can't see what you're typing**

**FIX:**
1. **Scroll the page up** (swipe down on page)
2. Or **turn phone sideways** (landscape mode)
3. Or **zoom out** (pinch fingers together)
4. Type first, then zoom in to verify

---

### 😰 Problem: "Project name already exists"

**When you tap Deploy, you see error**

**FIX:**
1. **Scroll back up** to Project Name box
2. **Change it to:** `foxlite-website-final`
3. **Scroll down** to Deploy button
4. **Tap Deploy** again

---

### 😰 Problem: Build paused/stopped

**Building stopped at Step 8**

**FIX:**
1. **Tap the screen** to wake it
2. **Pull down** to refresh the page
3. If that doesn't work:
   - **Tap Safari tabs** (bottom right)
   - **Close the tab**
   - **Go to:** vercel.com/dashboard
   - **Tap your project**
   - **Tap "..."** (three dots)
   - **Tap "Redeploy"**

---

### 😰 Problem: Page won't load (Step 10)

**Tapped Visit but page doesn't open**

**FIX:**
1. **Wait 30 seconds** (might be loading)
2. **Pull down** to refresh
3. **Copy the URL** and paste in new Safari tab
4. **Close Safari completely** (swipe up from bottom, swipe Safari up)
5. **Open Safari** again and try the URL

---

### 😰 Problem: Autocorrect changed text

**iPhone changed what you typed**

**FIX:**
1. **Go back** to that field
2. **Tap inside** the field
3. **Check the text** carefully
4. **Fix any autocorrect** changes
5. Verify it says EXACTLY what this guide says

---

## 📱 IPHONE KEYBOARD SHORTCUTS

**Make typing easier:**

### Switch to Number/Symbol keyboard:
- Tap **"123"** button (bottom left)

### Quick period (.):
- Double-tap **spacebar**

### Move cursor:
- Tap and hold **spacebar**, then slide finger

### Undo typing:
- Shake your iPhone, tap "Undo"

### Paste:
- Tap and hold, tap "Paste"

---

## 🔗 IPHONE QUICK LINKS

**Tap and hold these, then "Open in New Tab":**

### Deploy here:
https://vercel.com/new

### Your dashboard:
https://vercel.com/dashboard

### Your GitHub:
https://github.com/darrylkavanagh-ux/playbook-energy-services

---

## ✏️ VALUES TO TYPE (COPY THESE!)

**Tap and hold on each, then "Copy":**

### Project Name:
```
foxlite-forensics-production
```

### Root Directory:
```
website
```

### Production Branch:
```
deploy-ready-april-9
```

### Framework:
```
Next.js
```
(Select from dropdown, don't type)

---

## ✅ IPHONE CHECKLIST

**Before you start:**

- [ ] iPhone is charged (at least 50%)
- [ ] Connected to WiFi (not cellular - uses data)
- [ ] In Safari browser (not Chrome or other)
- [ ] Have 15 minutes uninterrupted time
- [ ] Won't receive calls during deployment
- [ ] Auto-Lock set to "Never" (optional)

---

## ⏱️ IPHONE TIME ESTIMATE

- **Steps 1-2:** 1 minute (opening Safari, loading page)
- **Step 3:** 30 seconds (finding repository)
- **Steps 5-6:** 4 minutes (filling forms on iPhone)
- **Step 7:** 10 seconds (tapping Deploy)
- **Step 8:** 3-5 minutes (keeping phone awake, watching build)
- **Steps 9-10:** 1 minute (viewing live site)

**Total: 10-12 minutes on iPhone**

---

## 📱 AFTER DEPLOYMENT

**Your site is live! Now you can:**

1. ✅ **Share the link** via Messages, Email, WhatsApp
2. ✅ **Add to Home Screen:**
   - Open your site in Safari
   - Tap Share button
   - Tap "Add to Home Screen"
   - Now it's an app icon!
3. ✅ **Bookmark it** in Safari
4. ✅ **Send to your computer** via AirDrop or email

---

## 💡 IPHONE PRO TIPS

### Use Split Screen (if needed):
- Keep this guide open in one Safari tab
- Swipe between tabs while deploying

### Use Siri:
- "Hey Siri, open Safari"
- "Hey Siri, go to vercel.com/new"

### Use Low Power Mode OFF:
- Low Power Mode might slow things down
- Turn it off during deployment

### Use Do Not Disturb:
- Settings → Focus → Do Not Disturb
- Prevents interruptions during deployment

---

## 🎯 QUICK START FOR IPHONE

1. **Open Safari** on your iPhone
2. **Go to:** vercel.com/new
3. **Tap "Import"** on playbook-energy-services (or foxlite-website-2026)
4. **Fill in:**
   - Project Name: foxlite-forensics-production
   - Framework: Next.js
   - Root Directory: website (tap pencil icon!)
   - Leave Build/Output/Install empty
   - Branch: deploy-ready-april-9
5. **Tap "Deploy"**
6. **Keep phone awake** for 5 minutes
7. **Tap "Visit"**
8. **Done!** 🎉

---

## 🚀 START NOW FROM YOUR IPHONE!

**Step 1: Open Safari**

**Step 2: Type this:**
```
vercel.com/new
```

**Step 3: Follow guide starting at STEP 3 above**

---

**YOU CAN DO THIS ENTIRELY FROM YOUR IPHONE 15!**

**NO COMPUTER NEEDED!**

**GO DEPLOY YOUR WEBSITE NOW!** 📱🚀
