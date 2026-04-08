# Foxlite Forensics Website Deployment Instructions

## ✅ Domain Status (2026-04-08)

**Active Domain:** foxliteforensics.com (Vercel)
- Status: Connected to Vercel (returns 404 - needs deployment)
- DNS: Properly configured
- SSL: Auto-configured by Vercel

**Inactive Domain:** foxliteservices.ie (Squarespace)
- Status: Not responding
- Action: Do NOT use this domain

## 🚀 Vercel Deployment Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Login to Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Login with your account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Connect your GitHub account if not already connected
   - Select repository: `darrylkavanagh-ux/playbook-energy-services`

3. **Configure Project**
   - Root Directory: `website`
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `out`
   - Install Command: `npm install`

4. **Domain Configuration**
   - Go to Project Settings → Domains
   - Add domain: `foxliteforensics.com`
   - Add domain: `www.foxliteforensics.com`
   - Vercel will auto-configure DNS

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build completion
   - Site will be live at https://foxliteforensics.com

### Method 2: Vercel CLI (Alternative)

```bash
# Install Vercel CLI locally
cd /home/user/webapp/website
npm install vercel

# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod

# Link domain
npx vercel domains add foxliteforensics.com
```

### Method 3: GitHub Integration (Automated)

1. **Connect GitHub Repository**
   - In Vercel Dashboard, connect your GitHub account
   - Import the repository: `darrylkavanagh-ux/playbook-energy-services`
   - Set root directory: `website`

2. **Auto-Deployment**
   - Every push to `main` branch will auto-deploy
   - Pull requests create preview deployments
   - Production: https://foxliteforensics.com

## 📧 Email Configuration

### Required Email Addresses

Setup these 4 email addresses for foxliteforensics.com:

1. **info@foxliteforensics.com** - General inquiries (Primary)
2. **audit@foxliteforensics.com** - Audit requests
3. **support@foxliteforensics.com** - Customer support
4. **accounts@foxliteforensics.com** - Billing/invoicing

### Cloudflare Email Routing Setup (Recommended - FREE)

1. **Add Domain to Cloudflare**
   - Go to https://dash.cloudflare.com
   - Click "Add Site"
   - Enter: foxliteforensics.com
   - Choose Free plan
   - Update nameservers at your domain registrar

2. **Enable Email Routing**
   - Go to Email → Email Routing
   - Click "Get Started"
   - Verify domain ownership
   - Enable Email Routing

3. **Create Destination Address**
   - Add your Gmail/personal email as destination
   - Verify the destination email

4. **Create Custom Addresses**
   ```
   info@foxliteforensics.com → your-email@gmail.com
   audit@foxliteforensics.com → your-email@gmail.com
   support@foxliteforensics.com → your-email@gmail.com
   accounts@foxliteforensics.com → your-email@gmail.com
   ```

5. **Catch-All (Optional)**
   - Enable catch-all to receive all emails
   - Route to your main email address

### Alternative: Google Workspace (Paid - $6/user/month)

1. **Sign up for Google Workspace**
   - Go to https://workspace.google.com
   - Start free trial (14 days)
   - Add domain: foxliteforensics.com

2. **Verify Domain**
   - Add TXT record to DNS
   - Wait for verification

3. **Create Email Accounts**
   - Create 4 accounts or use aliases
   - Configure in Gmail

4. **DNS Records**
   - Add MX records provided by Google
   - Add SPF, DKIM records

### Alternative: Vercel Email (if available)

Check Vercel dashboard for integrated email solutions:
- Vercel may offer email forwarding
- Check: Project Settings → Email

## 🔒 DNS Records

### For Vercel (Automatic)

Vercel auto-configures these when you add the domain:
- A record: points to Vercel IP
- AAAA record: points to Vercel IPv6
- CNAME (www): points to cname.vercel-dns.com

### For Cloudflare Email

Add these DNS records:
```
Type: MX
Name: @
Value: route.mx.cloudflare.net
Priority: 1

Type: TXT
Name: @
Value: v=spf1 include:_spf.mx.cloudflare.net ~all
```

## ✅ Post-Deployment Checklist

- [ ] Website loads at https://foxliteforensics.com
- [ ] SSL certificate is active (HTTPS)
- [ ] All pages load correctly
- [ ] Contact form shows correct email
- [ ] Footer shows correct email
- [ ] Email forwarding is working
- [ ] Test email delivery to all 4 addresses
- [ ] Setup email signatures
- [ ] Configure email auto-responders (optional)

## 📊 Current Status

| Item | Status | Notes |
|------|--------|-------|
| Domain Purchase | ✅ Complete | foxliteforensics.com via Vercel |
| Website Build | ✅ Complete | Static export in `out/` directory |
| Domain Update | ✅ Complete | All references updated to .com |
| Email Update | ✅ Complete | All emails updated to @foxliteforensics.com |
| Vercel Deployment | ⏳ Pending | Ready to deploy |
| Email Configuration | ⏳ Pending | Awaiting setup |

## 🎯 Next Actions (In Order)

1. **Deploy to Vercel** (30 minutes)
   - Use Vercel Dashboard method
   - Import from GitHub
   - Configure domain
   - Deploy

2. **Configure Cloudflare Email** (30 minutes)
   - Add domain to Cloudflare
   - Enable Email Routing
   - Create 4 email addresses
   - Test email delivery

3. **Verify Everything** (15 minutes)
   - Test website at https://foxliteforensics.com
   - Send test emails to all 4 addresses
   - Check email delivery
   - Verify SSL certificate

## 📞 Support

- **Vercel Support**: https://vercel.com/support
- **Cloudflare Support**: https://support.cloudflare.com
- **DNS Propagation Check**: https://dnschecker.org

---

**Last Updated:** 2026-04-08  
**Status:** Ready for Deployment  
**Estimated Time:** 1-2 hours total
