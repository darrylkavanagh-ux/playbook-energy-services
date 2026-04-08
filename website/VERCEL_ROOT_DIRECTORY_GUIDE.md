# 🎯 HOW TO FIND ROOT DIRECTORY IN VERCEL

## Option 1: During Project Import (EASIEST)

If you haven't successfully deployed yet, **DELETE THE PROJECT** and re-import:

### Step-by-Step:

1. **Go to:** https://vercel.com/dashboard
2. **Find your project** in the list
3. **Click on the project name**
4. **Look for:** Three dots menu (**...**) or Settings
5. **Click:** "Delete Project" (scroll to bottom)
6. **Confirm deletion**

### Now Re-Import:

1. **Click:** "Add New..." → "Project"
2. **Select:** `darrylkavanagh-ux/playbook-energy-services`
3. **You'll see a configuration screen with:**
   ```
   Configure Project
   
   Project Name: [foxlite-forensics]
   
   Framework Preset: [Next.js ▼]
   
   Root Directory: ./     [Edit →]   ← CLICK HERE!
   
   Build and Output Settings
   Build Command: npm run build
   Output Directory: out
   Install Command: npm install
   ```

4. **Click "Edit"** next to Root Directory
5. **Type:** `website`
6. **Click:** "Continue" or "Deploy"
7. ✅ **Done!**

---

## Option 2: If Project Already Exists

The location of settings has changed in Vercel's interface. Here's where to look:

### Method A: Project Settings

1. **Go to:** https://vercel.com/dashboard
2. **Click your project**
3. **Look at the tabs at the top:**
   - Overview
   - Deployments
   - Analytics
   - Settings ← **CLICK HERE**

4. **In Settings, look for these sections in the left sidebar:**
   - General
   - Domains
   - Git
   - Functions
   - Environment Variables
   - Build & Development ← **CHECK HERE FIRST!**
   
5. **Click "Build & Development"**
6. **Look for "Root Directory"** field
7. **Edit it to:** `website`
8. **Save**

### Method B: If No Sidebar Menu

Some Vercel interfaces show everything on one page:

1. **Click:** Settings
2. **Scroll down** through all settings
3. **Look for section called:**
   - "Build & Development Settings" OR
   - "Build Settings" OR
   - "Git" section
4. **Find:** "Root Directory" field
5. **Edit to:** `website`
6. **Save**

### Method C: Direct Settings URL

Try these direct links (replace YOUR-PROJECT-NAME):

1. **General Settings:**
   ```
   https://vercel.com/darrylkavanagh-ux/YOUR-PROJECT-NAME/settings
   ```

2. **Build Settings:**
   ```
   https://vercel.com/darrylkavanagh-ux/YOUR-PROJECT-NAME/settings/build-output
   ```

---

## Option 3: Use Vercel CLI (GUARANTEED TO WORK)

This method bypasses the dashboard entirely:

### Install and Deploy:

```bash
cd /home/user/webapp/website
npm install -g vercel

# Login
vercel login

# Deploy with correct directory
vercel --prod

# Vercel will ask questions, answer:
# - Project name? foxlite-forensics
# - Directory? website (or just press Enter since you're already in it)
# - Framework? Next.js
```

✅ **This automatically sets the root directory correctly!**

---

## 🔍 WHAT TO LOOK FOR

### Visual Clues in Vercel Dashboard:

**Look for fields labeled:**
- "Root Directory"
- "Project Directory"  
- "Base Directory"
- "Source Directory"

**Look in these sections:**
- Build & Development Settings
- Build Settings
- Git Settings
- Project Settings
- General Settings

### Current Value Might Show:
- `./` (wrong - this is root)
- `.` (wrong - this is root)
- (blank) (wrong - defaults to root)
- `website` (correct! ✅)

---

## 📸 WHAT YOU SHOULD SEE

### During Import (Configure Project Screen):

```
┌──────────────────────────────────────────┐
│ Configure Project                        │
│                                          │
│ Project Name                             │
│ [foxlite-forensics              ]        │
│                                          │
│ Framework Preset                         │
│ [Next.js                        ▼]       │
│                                          │
│ Root Directory                           │
│ ./                              [Edit]   │ ← CLICK EDIT
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Root Directory: [website       ]   │  │ ← TYPE HERE
│ │                         [Cancel] [Save]│
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### In Settings:

```
┌──────────────────────────────────────────┐
│ Build & Development Settings             │
│                                          │
│ Root Directory                           │
│ The directory where your code is located │
│                                          │
│ Current: ./                     [Edit]   │ ← CLICK EDIT
│                                          │
│ After Edit:                              │
│ [website                ]      [Save]    │ ← TYPE & SAVE
└──────────────────────────────────────────┘
```

---

## 🆘 STILL CAN'T FIND IT?

### Screenshot What You See

Take a screenshot of:
1. Your Vercel project page
2. The Settings page
3. Any tabs or menus you see

Send them to me and I'll tell you exactly where to click!

### Or Try This:

**Search the Settings Page:**
1. Click Settings
2. Press `Ctrl+F` (Windows) or `Cmd+F` (Mac)
3. Search for: "Root"
4. It should highlight "Root Directory"

---

## ✅ EASIEST SOLUTION: DELETE & RE-IMPORT

**Seriously, this is faster:**

1. Delete the failing project (30 seconds)
2. Click "Import Project" (30 seconds)
3. Set Root Directory during import (30 seconds)
4. Deploy (3 minutes)
5. ✅ Done! (5 minutes total)

**vs.**

1. Navigate through confusing settings (5-10 minutes)
2. Find the right field (frustration)
3. Maybe miss something else
4. Still need to redeploy (3 minutes)

---

## 🎯 MY RECOMMENDATION

**DO THIS NOW (5 minutes total):**

1. Go to: https://vercel.com/dashboard
2. Find your project
3. Delete it (don't worry, your code is safe in GitHub!)
4. Click "Add New..." → "Project"
5. Import: `darrylkavanagh-ux/playbook-energy-services`
6. **DURING IMPORT:** Set Root Directory to `website`
7. Click Deploy
8. ✅ Success!

This is **guaranteed to work** and is **faster** than hunting through settings!

---

## 📞 NEED HELP?

Tell me:
1. What tabs do you see when you click on your project?
2. What options are in the Settings menu?
3. Can you see "Build & Development" anywhere?

I'll give you exact instructions for YOUR interface!

---

**Created:** 2026-04-08  
**Status:** Beginner-friendly guide for finding Root Directory  
**Best Option:** Delete & re-import with Root Directory set during import
