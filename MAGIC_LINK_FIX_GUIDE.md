# 🚨 MAGIC LINK EMAIL TROUBLESHOOTING GUIDE

## Current Issue: Users showing as "Waiting for verification"

This means Supabase is receiving the requests but emails aren't being delivered.

## 🔧 IMMEDIATE FIXES REQUIRED

### 1. **Fix Environment Variable Mismatch**

Your `.env.local` currently has:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

But your code expects:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Action**: Change `NEXT_PUBLIC_SITE_URL` to `NEXT_PUBLIC_APP_URL` in your `.env.local`

### 2. **Configure Supabase URL Configuration**

Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**

Set these exact values:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs** (Additional): `http://localhost:3000/auth/callback`

### 3. **Enable Email Provider**

Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Email**

Ensure:
- ✅ **Enable Email provider** is ON
- ✅ **Enable email signup** is ON
- ✅ **Enable magic link** is ON

### 4. **Restart Development Server**

After updating `.env.local`:
```bash
# Stop current server (Ctrl + C)
npm run dev
```

## 🧪 **TEST EMAIL DELIVERY**

I've created a test page at `/test-email` to verify email delivery independently.

1. **Visit**: `http://localhost:3000/test-email`
2. **Enter your email** and click "Send Magic Link"
3. **Check your inbox and spam folder**

This will show you exactly what's happening with email delivery.

## 📊 **CHECK SUPABASE LOGS**

Go to **Supabase Dashboard** → **Authentication** → **Logs**

Filter for "Email" to see:
- If emails are being attempted
- Any error messages
- Delivery status

## 🔧 **COMMON ISSUES & SOLUTIONS**

### Issue 1: Wrong Redirect URL
**Symptoms**: Users show as "Waiting for verification"
**Solution**: Ensure redirect URL in Supabase matches your app's callback route

### Issue 2: Environment Variables Not Loaded
**Symptoms**: Console shows undefined values
**Solution**: Restart dev server after updating `.env.local`

### Issue 3: Emails Going to Spam
**Symptoms**: No emails received
**Solution**: Check spam/promotions folder, especially with Gmail

### Issue 4: Supabase Rate Limiting
**Symptoms**: Some emails work, others don't
**Solution**: Configure custom SMTP provider (see below)

## 🚀 **PRODUCTION SOLUTION: Configure SMTP**

For reliable email delivery, configure a custom SMTP provider:

### Option A: Resend (Recommended)
1. **Create account** at [resend.com](https://resend.com)
2. **Get API key**
3. **In Supabase**: Authentication → Emails → SMTP Settings
   - **SMTP Host**: `smtp.resend.com`
   - **Port**: `587`
   - **User**: `resend`
   - **Password**: `YOUR_RESEND_API_KEY`
   - **Sender name**: `Nelimac Learning`
   - **Sender email**: `noreply@your-domain.com`

### Option B: Gmail SMTP
1. **Enable 2FA** on Gmail account
2. **Generate App Password**
3. **Configure in Supabase**:
   - **SMTP Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **User**: `your-gmail@gmail.com`
   - **Password**: `your-app-password`

## ✅ **VERIFICATION CHECKLIST**

- [ ] `.env.local` has `NEXT_PUBLIC_APP_URL` (not `NEXT_PUBLIC_SITE_URL`)
- [ ] Supabase Site URL = `http://localhost:3000`
- [ ] Supabase Redirect URLs include `http://localhost:3000/auth/callback`
- [ ] Email provider is enabled in Supabase
- [ ] Dev server restarted after env changes
- [ ] Test page `/test-email` works
- [ ] Check spam folder for emails
- [ ] Supabase logs show email attempts

## 🎯 **EXPECTED RESULT**

After these fixes:
1. **Test page** should show "✅ Magic link sent!"
2. **Email arrives** in inbox (or spam folder)
3. **Clicking magic link** redirects to your app
4. **User is authenticated** and redirected to dashboard

## 📞 **NEXT STEPS**

1. **Update `.env.local`** with correct variable name
2. **Configure Supabase** URL settings
3. **Test with `/test-email`** page
4. **If still not working**: Configure SMTP provider
5. **Verify** with teacher application flow

The most likely fix is the environment variable mismatch. Once that's corrected and you restart the dev server, magic links should work!
