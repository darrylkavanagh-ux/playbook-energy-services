# DEREK DUNPHY - ORB AI PLATFORM DEPLOYMENT
**Mission**: Get www.playbook.ie (or www.foxlite.ie) LIVE on the internet  
**Time**: 2-4 hours (with Darryl's WhatsApp support)  
**Difficulty**: EASY (complete novice-friendly)  
**Cost**: €15 (domain registration only)

---

## 🎯 WHAT YOU'RE DEPLOYING

**Orb AI Platform**: The complete forensic verification system that powers:
- ✅ **Foxlite Consulting** (Irish energy auditing for David Clarke)
- ✅ **Thornbook Legal Services** (AI+human legal docs for Ger Corcoran)
- ✅ **VeriTech-10 Certification** (blockchain-verified evidence certificates)

**Your Job**: Get the website live so customers can use it.

---

## 📋 STEP-BY-STEP DEPLOYMENT (8 SIMPLE STEPS)

### ⏱️ BEFORE WE START (10 minutes setup)

**1. Clear Your Schedule**
- Block 4 hours (10am-2pm works best)
- Close all apps except your browser + WhatsApp
- Tell your family: "Working, don't disturb for 4 hours"
- Get coffee ☕

**2. Open These Websites** (in separate browser tabs):
- Tab 1: https://www.blacknight.com (Irish domain registrar)
- Tab 2: https://dash.cloudflare.com/sign-up (FREE hosting)
- Tab 3: https://github.com (code storage)
- Tab 4: https://web.whatsapp.com (to message Darryl)

**3. WhatsApp Darryl**:
```
Derek here. Ready to deploy. I have 4 hours blocked.
Current time: [your time]
Do I start with Step 1?
```

**Wait for Darryl to reply "YES, proceed" before starting.**

---

## 🔧 STEP 1: REGISTER DOMAIN (30 minutes)

### What You're Doing
Registering the website address (like "google.com" but for Playbook).

**Darryl will tell you which domain to register:**
- Option A: **www.playbook.ie** (main Orb AI platform)
- Option B: **www.foxlite.ie** (Foxlite Consulting white-label)

### Instructions

**1.1 Go to Blacknight**
- Click Tab 1: https://www.blacknight.com
- See the big search box? That's where you search for domains.

**1.2 Search for Domain**
- Type in the box: `playbook.ie` (or whatever Darryl tells you)
- Click "Search"
- **If it says "AVAILABLE"**: Great! Continue to 1.3
- **If it says "TAKEN"**: WhatsApp Darryl immediately (he'll suggest alternative)

**1.3 Add to Cart & Purchase**
- Click "Add to Cart"
- Price should be ~€14.99/year
- Click "Checkout"
- Create account (email, password, name, phone)
- Enter credit/debit card details
- Click "Complete Purchase"
- **You'll receive confirmation email** (check your inbox)

**1.4 WhatsApp Darryl**:
```
✅ Step 1 done. Domain [playbook.ie] registered.
Confirmation email received.
Proceeding to Step 2?
```

**Wait for "YES" before continuing.**

---

## 👤 STEP 2: CREATE GITHUB ACCOUNT (10 minutes)

### What You're Doing
Creating an account on GitHub (where the website code is stored).

### Instructions

**2.1 Sign Up**
- Click Tab 3: https://github.com/signup
- Enter your email (same as Blacknight)
- Create password (write it down!)
- Pick username (e.g., "derekdunphy")
- Solve puzzle (proves you're human)
- Click "Create account"

**2.2 Verify Email**
- GitHub sends you an email
- Open your inbox
- Click the verification link
- You'll see "Email verified!"

**2.3 Skip Setup**
- GitHub asks questions → click "Skip" (doesn't matter)
- You'll see the GitHub homepage (dashboard)

**2.4 WhatsApp Darryl**:
```
✅ Step 2 done. GitHub account created.
Username: [your-github-username]
Proceeding to Step 3?
```

---

## 🔐 STEP 3: GET REPOSITORY ACCESS (5 minutes)

### What You're Doing
Darryl will give you access to the website code (read-only, you can't break anything).

### Instructions

**3.1 Wait for Darryl**
- Darryl will add your GitHub username to the repository
- He'll WhatsApp: "Access granted. Click this link: [link]"

**3.2 Accept Invitation**
- Click the link Darryl sends
- You'll see: "You've been invited to collaborate"
- Click "Accept invitation"

**3.3 Confirm Access**
- You should now see a page with lots of files and folders
- URL will be: `https://github.com/darrylkavanagh-ux/foxlite-consulting`
- **DON'T CLICK ANYTHING YET!** (just confirm you can see it)

**3.4 WhatsApp Darryl**:
```
✅ Step 3 done. I can see the repository.
Lots of files showing. Proceeding to Step 4?
```

---

## ☁️ STEP 4: CREATE CLOUDFLARE ACCOUNT (10 minutes)

### What You're Doing
Creating an account on Cloudflare (the FREE hosting platform that will run your website).

### Instructions

**4.1 Sign Up**
- Click Tab 2: https://dash.cloudflare.com/sign-up
- Enter your email (same as Blacknight/GitHub)
- Create password (write it down!)
- Click "Sign Up"

**4.2 Verify Email**
- Cloudflare sends you an email
- Open your inbox
- Click the verification link
- You'll see "Email verified!"

**4.3 Skip Domain Connection**
- Cloudflare asks "Add a site?"
- Click "Skip this step" (we'll do this later)

**4.4 Navigate to Pages**
- On the Cloudflare dashboard (left sidebar)
- Click "Workers & Pages"
- Click "Create application"
- Select "Pages" tab (should be selected by default)

**4.5 WhatsApp Darryl**:
```
✅ Step 4 done. Cloudflare account created.
I'm on the Pages screen (says "Connect to Git").
Proceeding to Step 5?
```

---

## 🔗 STEP 5: CONNECT GITHUB TO CLOUDFLARE (15 minutes)

### What You're Doing
Telling Cloudflare: "Take the code from GitHub and turn it into a live website."

### Instructions

**5.1 Connect to Git**
- On the Cloudflare Pages screen
- Click "Connect to Git"
- Select "GitHub" (button with GitHub logo)

**5.2 Authorize Cloudflare**
- GitHub opens a popup
- Asks: "Authorize Cloudflare Pages?"
- Scroll down
- Click "Authorize cloudflare" (green button)
- **Might ask for your GitHub password** (enter it)

**5.3 Select Repository**
- Back on Cloudflare
- You'll see a list of repositories
- **Find**: `darrylkavanagh-ux/foxlite-consulting`
- Click "Select" button next to it

**5.4 Configure Build Settings**
- **Production Branch**: Leave as `main` (or `genspark_ai_developer` if Darryl tells you)
- **Framework preset**: Select "Vite" from dropdown
- **Build command**: Should say `npm run build` (if empty, type that)
- **Build output directory**: Should say `dist` (if empty, type that)

**5.5 Environment Variables (SKIP FOR NOW)**
- Leave empty (unless Darryl WhatsApps you specific variables)

**5.6 Deploy!**
- Click "Save and Deploy" button
- Cloudflare will now build your website (takes 2-5 minutes)
- **You'll see logs scrolling** (green text = good, red = error)
- **Wait until it says "Success! Your site is live!"**

**5.7 Copy the URL**
- Cloudflare shows you a URL like: `https://foxlite-consulting-abc123.pages.dev`
- **Copy this URL** (you'll need it in Step 6)
- **Click the URL** to open the website in a new tab
- **You should see the Orb AI platform!** 🎉

**5.8 WhatsApp Darryl**:
```
✅ Step 5 done. Website deployed!
URL: [paste the .pages.dev URL]
I can see it live. Screenshot attached.
Proceeding to Step 6 (custom domain)?
```

---

## 🌐 STEP 6: CONNECT CUSTOM DOMAIN (20 minutes)

### What You're Doing
Connecting your nice domain (www.playbook.ie) to the ugly Cloudflare URL (foxlite-consulting-abc123.pages.dev).

### Instructions

**6.1 In Cloudflare, Go to Custom Domains**
- On the Cloudflare Pages dashboard (where you just deployed)
- Click "Custom domains" tab (near top)
- Click "Set up a custom domain" button

**6.2 Enter Your Domain**
- Type: `www.playbook.ie` (or whatever domain you registered)
- Click "Continue"
- Cloudflare says: "We need to verify you own this domain"

**6.3 Get DNS Records**
- Cloudflare shows you records to add:
  - **Type**: CNAME
  - **Name**: www
  - **Value**: [something like `foxlite-consulting-abc123.pages.dev`]
- **SCREENSHOT THIS** (or write down the CNAME value)
- **DON'T CLOSE THIS TAB!**

**6.4 Add DNS Records in Blacknight**
- Open NEW tab: https://www.blacknight.com
- Log in (email + password from Step 1)
- Click "My Services" → "Domains"
- Click your domain (e.g., "playbook.ie")
- Click "Manage" → "DNS Management"

**6.5 Add CNAME Record**
- Click "Add Record" button
- Fill in:
  - **Type**: Select "CNAME"
  - **Name**: Type `www`
  - **Value**: Paste the value from Cloudflare (e.g., `foxlite-consulting-abc123.pages.dev`)
  - **TTL**: Leave as default (3600)
- Click "Save"

**6.6 Wait for DNS Propagation (5-30 minutes)**
- DNS changes take 5-30 minutes to work
- **Go back to Cloudflare tab** (from Step 6.3)
- Click "Check DNS records" button
- **If "Active"**: Success! ✅
- **If "Pending"**: Wait 10 minutes, click "Check" again

**6.7 Test Your Domain**
- Open NEW browser tab
- Type: `www.playbook.ie` (your domain)
- Press Enter
- **You should see the Orb AI website!** 🎉
- **If error**: WhatsApp Darryl (screenshot the error)

**6.8 WhatsApp Darryl**:
```
✅ Step 6 done. Domain www.playbook.ie is LIVE!
Screenshot attached.
Proceeding to Step 7 (HTTPS)?
```

---

## 🔒 STEP 7: ENABLE HTTPS (5 minutes)

### What You're Doing
Enabling the padlock 🔒 in the browser (makes website secure).

### Instructions

**7.1 Check SSL Status**
- In Cloudflare Pages dashboard
- Click "Settings" tab
- Scroll to "Custom domains"
- Next to `www.playbook.ie`, should see "Active" with padlock icon

**7.2 If SSL Not Active**
- Click "Check SSL" button
- Wait 2-5 minutes
- Refresh page
- Should now say "Active"

**7.3 Test HTTPS**
- Open new browser tab
- Type: `https://www.playbook.ie` (with https://)
- Should see padlock 🔒 in address bar
- Click padlock → should say "Connection is secure"

**7.4 WhatsApp Darryl**:
```
✅ Step 7 done. HTTPS active. Padlock showing.
Screenshot attached.
Proceeding to Step 8 (final checks)?
```

---

## ✅ STEP 8: FINAL CHECKS (10 minutes)

### What You're Doing
Testing everything works before calling it "DONE".

### Instructions

**8.1 Test Every Page**
- Homepage: Loads? Logo showing?
- About page: Works?
- Services page: Images loading?
- Contact form: Appears? (don't submit yet)
- Resize browser window: Looks good on mobile?

**8.2 Check Links**
- Click every link on homepage
- Make sure no "404 Error" or "Page not found"
- **If ANY page broken**: WhatsApp Darryl (screenshot error)

**8.3 Check Speed** (optional but recommended)
- Open: https://pagespeed.web.dev
- Paste: `www.playbook.ie`
- Click "Analyze"
- **Should score 80-100** (green)
- **If red (<50)**: WhatsApp Darryl (not urgent, but good to know)

**8.4 WhatsApp Darryl**:
```
✅ Step 8 done. All pages working.
Speed score: [number].
DEPLOYMENT COMPLETE! 🎉

Website live at: www.playbook.ie
Total time: [X hours]

Ready for next task (Irish grants coordination).
```

---

## 🎉 CONGRATULATIONS, DEREK!

**You just deployed a professional website to the internet!**

**What you accomplished:**
1. ✅ Registered domain (www.playbook.ie)
2. ✅ Created GitHub account
3. ✅ Got repository access
4. ✅ Created Cloudflare account
5. ✅ Connected GitHub to Cloudflare
6. ✅ Connected custom domain
7. ✅ Enabled HTTPS/SSL
8. ✅ Tested everything

**Skills you now have:**
- ✅ Domain registration
- ✅ DNS configuration
- ✅ Web hosting
- ✅ GitHub basics
- ✅ SSL/HTTPS setup

**You could charge €500-1,000 for this service!** (seriously)

---

## 💰 YOUR PAYMENT

**Contractor Fee**: €200-400 (as agreed with Darryl/David)

**Invoice Template**:
```
INVOICE

From: Derek Dunphy
      [Your address]
      [Your VAT number if applicable]

To: Playbook Corporation Limited (or Foxlite Consulting)
    [Company address]

Date: [Today's date]
Invoice #: 001

Description:
Website deployment services for Orb AI Platform:
- Domain registration (www.playbook.ie)
- Cloudflare Pages setup
- GitHub repository connection
- DNS configuration
- HTTPS/SSL security setup
- Testing and quality assurance

Time: 4 hours @ €50-100/hour
Amount: €200-400

Payment Terms: 14 days net
Bank Details: [Your IBAN]

Thank you!
Derek Dunphy
```

**Send Invoice To**:
- Email: darryl@playbook.ie (or david@foxlite.ie)
- Include PDF invoice + screenshot of live website

---

## 🚨 TROUBLESHOOTING (IF YOU GET STUCK)

### "Domain already taken"
- **Fix**: WhatsApp Darryl (he'll suggest alternative like playbook-consulting.ie)

### "GitHub invitation not received"
- **Fix**: Check spam folder, OR WhatsApp Darryl with your GitHub username

### "Cloudflare build failed" (red error)
- **Fix**: Screenshot error, WhatsApp Darryl (usually a simple config fix)

### "Domain not loading after 30 minutes"
- **Fix**: WhatsApp Darryl (might need to check DNS settings)

### "HTTPS not working"
- **Fix**: Wait 10 more minutes, then refresh. If still broken, WhatsApp Darryl.

### "Website looks broken" (fonts/images missing)
- **Fix**: Hard refresh (Ctrl+F5 on Windows, Cmd+Shift+R on Mac). If still broken, WhatsApp Darryl.

---

## 📞 SUPPORT

**Darryl's WhatsApp**: [Your number]  
**Response Time**: Within 5 minutes during deployment session

**IMPORTANT**: Don't struggle alone! WhatsApp Darryl immediately if stuck. That's what he's there for! 😊

---

## ➡️ WHAT'S NEXT?

After deployment complete, you'll move to:
- **Task 2**: Irish grants coordination (work with Ger Corcoran's office)
- **Task 3**: Training support (forensic, legal, auditing services)

Darryl will send you the next instructions after deployment is done.

**For now, focus on deployment. Let's get www.playbook.ie LIVE!** 🚀

---

*Document prepared by Darryl Kavanagh (Playbook Corporation) for Derek Dunphy, 16 February 2026. Complete novice-friendly with live WhatsApp support.*
