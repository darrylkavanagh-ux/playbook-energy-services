# Foxlite Forensics Email Configuration Guide

## 📧 Email Strategy

**Domain:** foxliteforensics.com  
**Provider:** Cloudflare Email Routing (Recommended - FREE)  
**Alternative:** Google Workspace ($6/user/month)

## 🎯 Required Email Addresses

### 1. info@foxliteforensics.com
- **Purpose:** General inquiries and main contact
- **Priority:** HIGH
- **Usage:** Website contact form, footer, business cards
- **Expected Volume:** 10-20 emails/day

### 2. audit@foxliteforensics.com
- **Purpose:** Audit requests and submissions
- **Priority:** HIGH
- **Usage:** Direct audit inquiries, bill submissions
- **Expected Volume:** 5-15 emails/day

### 3. support@foxliteforensics.com
- **Purpose:** Customer support and questions
- **Priority:** MEDIUM
- **Usage:** Post-audit support, questions
- **Expected Volume:** 3-10 emails/day

### 4. accounts@foxliteforensics.com
- **Purpose:** Billing, invoicing, payments
- **Priority:** MEDIUM
- **Usage:** Financial correspondence
- **Expected Volume:** 2-5 emails/day

## 🚀 Cloudflare Email Routing Setup (FREE - RECOMMENDED)

### Step 1: Add Domain to Cloudflare

1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Click "Add Site"

2. **Enter Domain**
   - Domain: foxliteforensics.com
   - Click "Add Site"

3. **Select Plan**
   - Choose: Free ($0/month)
   - Click "Continue"

4. **Review DNS Records**
   - Cloudflare auto-imports existing DNS
   - Verify A, AAAA records for Vercel
   - Click "Continue"

5. **Change Nameservers**
   - Cloudflare provides 2 nameservers
   - Example:
     ```
     alexa.ns.cloudflare.com
     brad.ns.cloudflare.com
     ```
   - Update at your domain registrar (where you bought foxliteforensics.com)

6. **Wait for Activation**
   - DNS propagation: 2-48 hours (usually 2-6 hours)
   - Cloudflare will email when active

### Step 2: Enable Email Routing

1. **Navigate to Email**
   - In Cloudflare dashboard
   - Select: foxliteforensics.com
   - Go to: Email → Email Routing

2. **Get Started**
   - Click "Get Started" or "Enable Email Routing"
   - Review overview
   - Click "Continue"

3. **Add Destination Address**
   - Enter your personal/business Gmail address
   - Example: david.clarke@gmail.com
   - Click "Send Verification Email"
   - Check inbox and click verification link

4. **Verify Domain**
   - Cloudflare auto-adds required DNS records:
     - MX record: route.mx.cloudflare.net
     - TXT record: v=spf1 include:_spf.mx.cloudflare.net ~all
   - Click "Verify"
   - Wait 30 seconds - 5 minutes

### Step 3: Create Custom Addresses

1. **Add First Address**
   - Click "Create address"
   - Custom address: `info`
   - Full email: info@foxliteforensics.com
   - Action: Send to → Select your verified destination
   - Click "Save"

2. **Add Remaining Addresses**
   - Repeat for:
     - `audit` → audit@foxliteforensics.com
     - `support` → support@foxliteforensics.com
     - `accounts` → accounts@foxliteforensics.com
   - All forward to your verified destination email

3. **Enable Catch-All (Optional)**
   - Toggle "Catch-all address"
   - Routes any email to your destination
   - Recommended: Enabled

### Step 4: Test Email Delivery

1. **Send Test Emails**
   - From another email account, send test emails to:
     - info@foxliteforensics.com
     - audit@foxliteforensics.com
     - support@foxliteforensics.com
     - accounts@foxliteforensics.com

2. **Verify Receipt**
   - Check your destination inbox
   - Should receive all 4 test emails
   - Subject line will show which address received it

3. **Check Spam Folder**
   - If not in inbox, check spam
   - Mark as "Not Spam"

## 📤 Sending Email FROM Custom Addresses

### Option 1: Gmail with Send-As (FREE)

1. **Open Gmail Settings**
   - Go to Gmail
   - Click gear icon → "See all settings"
   - Go to "Accounts and Import" tab

2. **Add Send-As Address**
   - Click "Add another email address"
   - Name: Your name
   - Email: info@foxliteforensics.com
   - Uncheck "Treat as an alias"
   - Click "Next"

3. **SMTP Configuration**
   - SMTP Server: smtp.gmail.com
   - Port: 587
   - Username: your-gmail@gmail.com
   - Password: Your Gmail app password
   - Click "Add Account"

4. **Verify**
   - Gmail sends verification email
   - Click link in email
   - Now you can send from info@foxliteforensics.com

5. **Repeat for Other Addresses**
   - Add audit@, support@, accounts@

### Option 2: Cloudflare Workers (Advanced - FREE)

Use Cloudflare Workers for programmatic sending:
- Setup Email Workers
- Use MailChannels integration
- Free up to 100,000 requests/day

### Option 3: Google Workspace (Paid - Professional)

**Cost:** $6/user/month  
**Benefits:**
- Professional email hosting
- 30GB storage per user
- Google Drive, Calendar, Meet included
- Custom email addresses
- Better deliverability

**Setup:**
1. Go to https://workspace.google.com
2. Start 14-day free trial
3. Add domain: foxliteforensics.com
4. Verify ownership (TXT record)
5. Add MX records
6. Create user accounts or aliases

## 🔒 Email Security Setup

### SPF Record (Already Added by Cloudflare)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.mx.cloudflare.net ~all
```

### DKIM Record (Recommended)

1. **Generate DKIM Key**
   - In Cloudflare Email Routing
   - Go to Settings → DKIM
   - Click "Generate Keys"

2. **Add DNS Record**
   - Cloudflare auto-adds DKIM record
   - Improves email deliverability

### DMARC Record (Recommended)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@foxliteforensics.com; fo=1
```

## 📋 Email Management Best Practices

### Organize with Labels (Gmail)

Create Gmail filters to auto-label forwarded emails:
- **From:** `*@foxliteforensics.com`
- **To:** info@ → Label: "Foxlite - Info"
- **To:** audit@ → Label: "Foxlite - Audits"
- **To:** support@ → Label: "Foxlite - Support"
- **To:** accounts@ → Label: "Foxlite - Accounts"

### Auto-Responders

Setup auto-reply for common inquiries:
- Info requests → "Thank you, we'll respond within 24 hours"
- Audit requests → "Audit request received, we'll review within 48 hours"

### Email Signatures

Create professional signatures for each address:

```
---
David Clarke
Managing Director - Forensic Audit Lead
Foxlite Forensic Services

📧 info@foxliteforensics.com
🌐 www.foxliteforensics.com
📍 Dublin, Ireland

VeriTech 10 Certified | EU AI Act Compliant
Independent Forensic Auditing since 2019
```

## ✅ Email Configuration Checklist

- [ ] Domain added to Cloudflare
- [ ] Nameservers updated at registrar
- [ ] DNS propagation complete
- [ ] Email Routing enabled
- [ ] Destination email verified
- [ ] info@foxliteforensics.com created
- [ ] audit@foxliteforensics.com created
- [ ] support@foxliteforensics.com created
- [ ] accounts@foxliteforensics.com created
- [ ] Catch-all enabled
- [ ] SPF record verified
- [ ] DKIM enabled
- [ ] DMARC record added
- [ ] Test emails sent and received
- [ ] Gmail Send-As configured
- [ ] Email signatures created
- [ ] Auto-responders setup (optional)
- [ ] Gmail filters/labels created

## 🎯 Quick Start (30 Minutes)

1. **Add Domain to Cloudflare** (10 min)
   - Go to dash.cloudflare.com
   - Add foxliteforensics.com
   - Update nameservers

2. **Enable Email Routing** (10 min)
   - Email → Email Routing → Enable
   - Add destination email
   - Verify

3. **Create 4 Addresses** (5 min)
   - Add info@, audit@, support@, accounts@
   - All forward to destination

4. **Test** (5 min)
   - Send test emails to all 4 addresses
   - Verify receipt in destination inbox

## 📞 Support Resources

- **Cloudflare Email Docs**: https://developers.cloudflare.com/email-routing/
- **Gmail Send-As Guide**: https://support.google.com/mail/answer/22370
- **DNS Checker**: https://dnschecker.org
- **Email Header Analyzer**: https://mxtoolbox.com/emailheaders.aspx

## 💰 Cost Comparison

| Solution | Cost | Features |
|----------|------|----------|
| **Cloudflare Email Routing** | FREE | Forwarding only, unlimited addresses |
| **Gmail Send-As** | FREE | Sending via Gmail SMTP |
| **Google Workspace** | $6/user/month | Full hosting, 30GB storage |
| **Zoho Mail** | FREE (lite) | 5GB, 5 users max |
| **ProtonMail** | $4/user/month | Encrypted, privacy-focused |

**Recommendation:** Start with Cloudflare Email Routing (FREE) + Gmail Send-As. Upgrade to Google Workspace later if needed.

---

**Last Updated:** 2026-04-08  
**Status:** Ready for Configuration  
**Estimated Setup Time:** 30-45 minutes
