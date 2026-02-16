# DEREK DUNPHY DEPLOYMENT GUIDE (COMPLETE NOVICE)
**Date**: 16 February 2026  
**Task**: Deploy Foxlite Consulting frontend website  
**Domain**: www.foxlite.ie (to be registered)  
**Platform**: Cloudflare Pages (FREE hosting)  
**Estimated Time**: 2-4 hours (with WhatsApp support from Darryl)

---

## 🎯 YOUR MISSION, DEREK

**What You're Doing**:
You're going to register a domain name (www.foxlite.ie) and deploy a website to the internet. This website is for David Clarke's company (Foxlite Consulting). I (Darryl) will guide you step-by-step via WhatsApp while you do it on your laptop.

**What You'll Need**:
- ✅ Your laptop (Mac or Windows, doesn't matter)
- ✅ Internet connection (WiFi or cable)
- ✅ Credit/debit card (for domain registration, ~€15)
- ✅ Email address (to create accounts)
- ✅ WhatsApp (to message Darryl when stuck)
- ✅ 2-4 hours of time (we'll do this together in one session)

**What You DON'T Need**:
- ❌ Coding skills (I've already written all the code)
- ❌ Server setup (Cloudflare does this automatically)
- ❌ Technical knowledge (this guide explains everything like you're 5 years old)

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### ⏱️ BEFORE WE START: SET UP YOUR WORKSPACE

**1. Clear Your Schedule** (2-4 hours)
- Close all apps (email, Slack, social media)
- Turn on Do Not Disturb (except WhatsApp for Darryl)
- Get coffee/tea ☕
- Tell your family "I'm working, don't disturb for 3 hours"

**2. Open These Websites** (in separate browser tabs):
- Tab 1: https://www.blacknight.com (domain registration, Irish)
- Tab 2: https://dash.cloudflare.com/sign-up (hosting platform)
- Tab 3: https://github.com (code storage)
- Tab 4: https://web.whatsapp.com (to message Darryl)

**3. Get Darryl on WhatsApp**:
- Message: "Derek here, ready to start deployment. Do I proceed with Step 1?"
- Wait for Darryl to reply: "YES, proceed" (confirming he's available to help)

---

## 📝 STEP 1: REGISTER DOMAIN NAME (30 minutes)

### What's a Domain?
A domain is your website address (like "google.com" or "facebook.com"). You're registering "foxlite.ie" so people can type that into their browser and see the Foxlite website.

### Instructions:

**1.1 Go to Blacknight** (Irish domain registrar)
- Click Tab 1: https://www.blacknight.com
- You'll see a big search box that says "Find your perfect domain"

**1.2 Search for Domain**
- Type in the box: `foxlite.ie`
- Click "Search" button
- **If it says "AVAILABLE"**: Good! Continue to 1.3
- **If it says "TAKEN"**: WhatsApp Darryl immediately (he'll suggest alternative)

**1.3 Add to Cart**
- Click "Add to Cart" button (next to foxlite.ie)
- It will say "€14.99/year" (that's the price)
- Click "View Cart" (top right corner)

**1.4 Create Blacknight Account**
- Click "Checkout" button
- It will say "Please register or login"
- Click "Register" (you don't have an account yet)
- Fill in form:
  - First Name: Derek
  - Last Name: Dunphy
  - Email: [Your email address]
  - Password: [Make a strong password, write it down!]
  - Company: Foxlite Consulting (David Clarke's company)
  - Country: Ireland
  - Phone: [Your phone number]
- Click "Register" button

**1.5 Payment**
- Enter credit/debit card details
- Click "Complete Purchase"
- **You'll see confirmation**: "Order Complete! foxlite.ie is now yours"
- **IMPORTANT**: Check your email (registration confirmation from Blacknight)

**1.6 WhatsApp Darryl**:
- Message: "✅ Step 1 complete. Domain foxlite.ie registered. Confirmation email received."
- Wait for reply: "Great! Proceed to Step 2"

---

## 🔐 STEP 2: CREATE GITHUB ACCOUNT (10 minutes)

### What's GitHub?
GitHub is where the website code is stored. Think of it like Google Drive, but for code. Darryl has already written all the code and put it on GitHub. You just need an account to access it.

### Instructions:

**2.1 Go to GitHub**
- Click Tab 3: https://github.com/signup
- You'll see "Sign up for GitHub"

**2.2 Create Account**
- Fill in form:
  - Email: [Your email – same as Blacknight]
  - Password: [Make a password, write it down!]
  - Username: Pick something (e.g., "derekdunphy" or "derek-design")
- Click "Continue"

**2.3 Verify Email**
- GitHub will send you an email
- Open your email inbox
- Click the verification link in the email from GitHub
- You'll see "Email verified!"

**2.4 Complete Setup**
- GitHub will ask: "What do you want to do?"
- Select: "Use GitHub for work" (doesn't really matter)
- Click "Continue"
- Skip the survey (click "Skip" button)

**2.5 WhatsApp Darryl**:
- Message: "✅ Step 2 complete. GitHub account created: [your-username]"
- Darryl will reply with your next instruction

---

## 👁️ STEP 3: GET ACCESS TO CODE REPOSITORY (5 minutes)

### What's Happening Here?
Darryl will give you "read-only" access to the Foxlite code repository. This means you can SEE the code and use it to deploy the website, but you can't CHANGE anything (safety feature – you can't accidentally break anything!).

### Instructions:

**3.1 Wait for Darryl**:
- Darryl will add your GitHub username to the repository
- He'll WhatsApp you: "Access granted. Click this link: [link]"

**3.2 Accept Invitation**:
- Click the link Darryl sends
- You'll see: "You've been invited to collaborate on foxlite-consulting"
- Click "Accept invitation" button

**3.3 Confirm Access**:
- You'll see the repository page (lots of files and folders)
- URL will be: `https://github.com/darrylkavanagh-ux/foxlite-consulting`
- **DON'T TOUCH ANYTHING YET!** (just confirm you can see it)

**3.4 WhatsApp Darryl**:
- Message: "✅ Step 3 complete. I can see the repository."

---

## ☁️ STEP 4: CREATE CLOUDFLARE PAGES ACCOUNT (10 minutes)

### What's Cloudflare Pages?
Cloudflare Pages is like a magic button that turns code into a live website. It's FREE and it hosts your website on servers around the world so it loads fast for everyone.

### Instructions:

**4.1 Go to Cloudflare**
- Click Tab 2: https://dash.cloudflare.com/sign-up
- You'll see "Create a Cloudflare account"

**4.2 Create Account**
- Fill in form:
  - Email: [Your email – same as Blacknight/GitHub]
  - Password: [Make a password, write it down!]
- Click "Sign Up"

**4.3 Verify Email**
- Cloudflare will send you an email
- Open your email inbox
- Click the verification link in the email from Cloudflare
- You'll see "Email verified! Welcome to Cloudflare"

**4.4 Skip Domain Connection (For Now)**
- Cloudflare will ask: "Add a site?"
- Click "Skip this step" (we'll add the domain later)

**4.5 Navigate to Pages**
- On the Cloudflare dashboard (left sidebar)
- Click "Workers & Pages"
- Click "Create application" button
- Select "Pages" tab

**4.6 WhatsApp Darryl**:
- Message: "✅ Step 4 complete. Cloudflare account created. I'm on the Pages screen."

---

## 🔗 STEP 5: CONNECT GITHUB TO CLOUDFLARE (15 minutes)

### What's Happening Here?
You're telling Cloudflare: "Hey, take the code from GitHub and turn it into a website." Cloudflare will automatically pull the code, build it, and host it.

### Instructions:

**5.1 Connect to Git**
- On the Cloudflare Pages screen, click "Connect to Git"
- Select "GitHub" (the button with the GitHub logo)

**5.2 Authorize Cloudflare**
- GitHub will open a popup asking: "Authorize Cloudflare Pages?"
- Scroll down and click "Authorize cloudflare" button
- **You might need to enter your GitHub password** (if it asks)

**5.3 Select Repository**
- Back on Cloudflare, you'll see a list of repositories
- **Find**: `darrylkavanagh-ux/foxlite-consulting`
- Click "Select" button next to it

**5.4 Configure Build Settings**
- **Production Branch**: Leave as `main` (default)
- **Framework preset**: Select "Vite" from dropdown
- **Build command**: Should auto-fill as `npm run build` (if empty, type that)
- **Build output directory**: Should auto-fill as `dist` (if empty, type that)

**5.5 Add Environment Variables** (Optional – Darryl will tell you if needed)
- Usually you can skip this for frontend-only
- If Darryl WhatsApps you environment variables, click "Add variable" and paste them

**5.6 Click "Save and Deploy"**
- Cloudflare will now build your website (takes 2-5 minutes)
- You'll see a progress screen with logs scrolling (don't worry, this is normal)
- **Wait until it says "Success! Your site is live!"**

**5.7 Copy the URL**
- Cloudflare will show you a URL like: `https://foxlite-consulting.pages.dev`
- **Copy this URL** (you'll need it in a minute)
- **Click the URL** to open the website in a new tab
- **You should see the Foxlite website!** 🎉

**5.8 WhatsApp Darryl**:
- Message: "✅ Step 5 complete. Website deployed! URL: [paste the URL]. I can see it live."
- Darryl will check it and confirm

---

## 🌐 STEP 6: CONNECT CUSTOM DOMAIN (20 minutes)

### What's Happening Here?
Right now your website is live at `foxlite-consulting.pages.dev` (ugly URL). You're going to connect your custom domain `www.foxlite.ie` so people can use that nice, short address instead.

### Instructions:

**6.1 In Cloudflare, Go to Domain Settings**
- On the Cloudflare Pages dashboard (where you just deployed)
- Click "Custom domains" tab (near the top)
- Click "Set up a custom domain" button

**6.2 Enter Your Domain**
- Type: `www.foxlite.ie`
- Click "Continue"
- Cloudflare will say: "We need to verify you own this domain"

**6.3 Get DNS Records from Cloudflare**
- Cloudflare will show you 2 records to add:
  - **Type**: CNAME
  - **Name**: www
  - **Value**: [something like `foxlite-consulting.pages.dev`]
- **DON'T CLOSE THIS TAB!** (you need these details)
- **Take a screenshot** (or write down the CNAME value)

**6.4 Add DNS Records in Blacknight**
- Open a NEW tab: https://www.blacknight.com
- Log in (email + password from Step 1)
- Click "My Services" → "Domains"
- Click "foxlite.ie" (your domain)
- Click "Manage" → "DNS Management"

**6.5 Add CNAME Record**
- Click "Add Record" button
- Fill in form:
  - **Type**: Select "CNAME" from dropdown
  - **Name**: Type `www`
  - **Value**: Paste the value from Cloudflare (e.g., `foxlite-consulting.pages.dev`)
  - **TTL**: Leave as default (3600)
- Click "Save"

**6.6 Add Root Domain Redirect (Optional)**
- If you want `foxlite.ie` (without www) to redirect to `www.foxlite.ie`:
  - Click "Add Record" again
  - **Type**: Select "A" from dropdown
  - **Name**: Leave blank (or type `@`)
  - **Value**: (Darryl will WhatsApp you an IP address if needed)
  - Click "Save"
- **OR** skip this and just use `www.foxlite.ie` always

**6.7 Wait for DNS Propagation (5-30 minutes)**
- DNS changes take 5-30 minutes to spread across the internet
- **Go back to Cloudflare tab** (Step 6.3)
- Click "Check DNS records" button
- **If it says "Active"**: Success! You're done! ✅
- **If it says "Pending"**: Wait 10 minutes, then click "Check" again

**6.8 Test Your Domain**
- Open a NEW browser tab
- Type: `www.foxlite.ie`
- Press Enter
- **You should see the Foxlite website!** 🎉
- **If you see an error**: WhatsApp Darryl immediately

**6.9 WhatsApp Darryl**:
- Message: "✅ Step 6 complete. Domain www.foxlite.ie is live! [screenshot of the website]"

---

## 🔒 STEP 7: ENABLE HTTPS/SSL (5 minutes)

### What's HTTPS/SSL?
The little padlock 🔒 in the browser address bar. It means your website is secure (encrypted). Cloudflare does this automatically, but let's double-check.

### Instructions:

**7.1 Check SSL Status**
- In Cloudflare Pages dashboard
- Click "Settings" tab
- Scroll down to "Custom domains"
- Next to `www.foxlite.ie`, you should see a green "Active" status with a padlock icon

**7.2 If SSL Is Not Active**:
- Click "Check SSL" button
- Wait 2-5 minutes
- Refresh the page
- **Should now say "Active"**

**7.3 Test HTTPS**
- Open a new browser tab
- Type: `https://www.foxlite.ie` (with https://)
- You should see the padlock 🔒 in the address bar
- Click the padlock → should say "Connection is secure"

**7.4 WhatsApp Darryl**:
- Message: "✅ Step 7 complete. HTTPS is active. Padlock showing. [screenshot]"

---

## ✅ STEP 8: FINAL CHECKS (10 minutes)

### Let's Make Sure Everything Works

**8.1 Test the Website (Click Every Page)**
- Homepage: Does it load? Logo showing?
- About page: Does it work?
- Services page: Images loading?
- Contact form: Does it appear? (Don't submit yet)
- Mobile view: Resize your browser window → does it look good on mobile?

**8.2 Check Links**
- Click every link on the homepage
- Make sure nothing says "404 Error" or "Page not found"
- **If ANY page is broken**: WhatsApp Darryl (screenshot the error)

**8.3 Check Speed**
- Open: https://pagespeed.web.dev
- Paste: `www.foxlite.ie`
- Click "Analyze"
- **Should score 80-100** (green) for Performance
- **If score is red (<50)**: WhatsApp Darryl (but not urgent)

**8.4 Send Test Email (If Contact Form Exists)**
- Go to: www.foxlite.ie/contact
- Fill in the contact form:
  - Name: Derek Dunphy (test)
  - Email: [your email]
  - Message: "Test message from Derek – deployment successful"
- Click "Send"
- **Check if YOU receive a confirmation email**
- **AND** check if David Clarke receives the message (WhatsApp him separately)

**8.5 WhatsApp Darryl**:
- Message: "✅ Step 8 complete. All pages working. Speed score: [number]. Contact form tested."

---

## 🎉 CONGRATULATIONS! YOU'RE DONE!

### What You Just Accomplished:
1. ✅ Registered a domain name (www.foxlite.ie)
2. ✅ Created accounts (Blacknight, GitHub, Cloudflare)
3. ✅ Deployed a website to the internet
4. ✅ Connected custom domain
5. ✅ Enabled HTTPS/SSL security
6. ✅ Tested everything

### What Happens Next:
- **You**: Send final confirmation to Darryl (message: "Deployment complete! www.foxlite.ie is live.")
- **Darryl**: Will do a final review (5-10 minutes)
- **David Clarke**: Will review the website and send feedback
- **You**: Invoice David Clarke for your contractor fee (€200-400 as agreed)

---

## 📞 TROUBLESHOOTING (IF YOU GET STUCK)

### Common Issues & Fixes

**Issue 1: Domain Is Already Taken**
- **Error**: Blacknight says "foxlite.ie is not available"
- **Fix**: WhatsApp Darryl immediately (he'll suggest alternative like foxlite-consulting.ie)

**Issue 2: GitHub Invitation Not Received**
- **Error**: No email from GitHub with invitation link
- **Fix**: Check spam folder, OR WhatsApp Darryl with your GitHub username

**Issue 3: Cloudflare Build Fails**
- **Error**: Cloudflare says "Build failed" with red error message
- **Fix**: **DON'T PANIC!** Screenshot the error, WhatsApp Darryl (it's usually a simple config fix)

**Issue 4: Domain Not Loading After 30 Minutes**
- **Error**: www.foxlite.ie still shows "Page not found" after Step 6
- **Fix**: WhatsApp Darryl (might need to check DNS settings)

**Issue 5: HTTPS Not Working**
- **Error**: Browser says "Not secure" or no padlock
- **Fix**: Wait 5-10 more minutes (SSL takes time), then refresh. If still broken, WhatsApp Darryl.

**Issue 6: Website Looks Broken (Fonts/Images Missing)**
- **Error**: Website loads but looks weird (wrong fonts, no images, broken layout)
- **Fix**: Hard refresh your browser (Ctrl+F5 on Windows, Cmd+Shift+R on Mac). If still broken, WhatsApp Darryl.

---

## 📋 CHECKLIST (FOR DEREK TO PRINT)

```
[ ] Step 1: Domain registered (foxlite.ie) – 30 min
[ ] Step 2: GitHub account created – 10 min
[ ] Step 3: Access to code repository granted – 5 min
[ ] Step 4: Cloudflare Pages account created – 10 min
[ ] Step 5: GitHub connected to Cloudflare, site deployed – 15 min
[ ] Step 6: Custom domain connected (www.foxlite.ie) – 20 min
[ ] Step 7: HTTPS/SSL enabled – 5 min
[ ] Step 8: Final checks completed – 10 min
[ ] WhatsApp Darryl: "All done! www.foxlite.ie is live."
```

**Total Time**: 2-4 hours (including troubleshooting)

---

## 💰 PAYMENT

**Contractor Fee**: €200-400 (as agreed with David Clarke)

**Invoice Details**:
- **From**: Derek Dunphy, [Your address], [Your VAT number if applicable]
- **To**: Foxlite Consulting, [David Clarke's address], [Company number if applicable]
- **Date**: [Today's date]
- **Description**: "Website deployment services: Domain registration, Cloudflare Pages setup, DNS configuration, HTTPS setup, testing (4 hours @ €50-100/hour)"
- **Amount**: €200-400 (negotiate with David)
- **Payment Terms**: 14 days net
- **Bank Details**: [Your bank account for transfer]

**Send Invoice To**:
- Email: david@foxlite.ie (or WhatsApp David for his email)
- Include PDF invoice + screenshot of live website (www.foxlite.ie)

---

## 📞 CONTACTS

| Person | Role | WhatsApp | Email |
|--------|------|----------|-------|
| **Darryl Kavanagh** | Technical Support (your lifeline!) | [Darryl's WhatsApp] | darryl@playbook.ie |
| **David Clarke** | Client (Foxlite owner) | [David's WhatsApp] | david@foxlite.ie |

**IMPORTANT**: Keep WhatsApp open with Darryl the entire time. Don't struggle alone – ask questions immediately if stuck!

---

## 🎓 BONUS: WHAT YOU LEARNED TODAY

Even if you're a "novice," you now know how to:
- ✅ Register domain names
- ✅ Use GitHub (code storage)
- ✅ Deploy websites with Cloudflare Pages
- ✅ Configure DNS records
- ✅ Enable HTTPS/SSL security
- ✅ Troubleshoot web deployment issues

**These are professional web developer skills!** You could charge €500-1,000 for this service in the future (seriously).

---

## 🚀 FINAL MESSAGE FROM DARRYL

Derek, you've got this! I've made this guide as simple as possible. If you follow each step exactly as written and message me on WhatsApp when you need help, we'll have www.foxlite.ie live in 2-4 hours.

Remember:
1. **Don't rush** – Read each step carefully
2. **Don't skip steps** – Do them in order
3. **Don't panic if something breaks** – Just screenshot + WhatsApp me
4. **Don't change anything I haven't told you to** – You can't break anything as long as you follow the guide

Let's do this! 💪

**Start by messaging me on WhatsApp: "Derek here, ready to start deployment. Do I proceed with Step 1?"**

Good luck! 🍀

---

*Guide prepared by Darryl Kavanagh (Playbook Corporation) for Derek Dunphy, 16 February 2026. Complete novice-friendly instructions with WhatsApp support.*
