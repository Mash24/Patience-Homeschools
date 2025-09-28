# 🔧 Auth Callback Redirect Issue - Troubleshooting Guide

## Current Issue
Magic link emails are being sent and authentication is working, but users are not being redirected to the password setup page as expected.

## 🔍 Debugging Steps

### Step 1: Check Console Logs
1. **Open browser developer tools** (F12)
2. **Go to Console tab**
3. **Submit a teacher application**
4. **Click the magic link**
5. **Look for these logs**:
   - `Auth callback - Code: true ApplicationId: [id] Origin: http://localhost:3000`
   - `User authenticated: [email] Password set: undefined`
   - `Redirecting to password setup with applicationId: [id]`

### Step 2: Test Debug Page
1. **Visit**: `http://localhost:3000/debug-auth-callback`
2. **Check the debug information** to see:
   - Current URL parameters
   - User authentication status
   - Password setup status

### Step 3: Check Supabase Configuration
Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**:

**Required Settings:**
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: 
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/setup-password`
  - `http://localhost:3000/teacher/dashboard`

### Step 4: Check Magic Link URL
When you receive the magic link email, check the URL structure:
- **Expected**: `http://localhost:3000/auth/callback?code=...&applicationId=...`
- **Actual**: Check what URL you're actually getting

## 🚨 Common Issues & Solutions

### Issue 1: Wrong Redirect URL in Supabase
**Symptoms**: Magic link redirects to wrong page
**Solution**: Update Supabase URL Configuration with correct redirect URLs

### Issue 2: Missing ApplicationId Parameter
**Symptoms**: Auth callback doesn't have applicationId
**Solution**: Check magic link generation in `sendApplicationMagicLink`

### Issue 3: User Already Has Password Set
**Symptoms**: User goes directly to dashboard
**Solution**: Clear user metadata or test with new email

### Issue 4: Auth Callback Route Not Working
**Symptoms**: 404 or error on auth callback
**Solution**: Check if `/auth/callback/route.ts` exists and is properly configured

## 🔧 Quick Fixes

### Fix 1: Force Password Setup for All Users
If you want ALL users to go through password setup, modify the auth callback:

```typescript
// In src/app/auth/callback/route.ts
if (applicationId) {
  // Always redirect to password setup for teacher applications
  return NextResponse.redirect(`${origin}/setup-password?applicationId=${applicationId}&email=${user.email}`)
}
```

### Fix 2: Add Fallback Redirect
Add a fallback in case the logic fails:

```typescript
// At the end of auth callback
if (user && !user.user_metadata?.password_set) {
  return NextResponse.redirect(`${origin}/setup-password?email=${user.email}`)
}
```

### Fix 3: Test with Debug URL
Manually test the redirect by visiting:
`http://localhost:3000/setup-password?applicationId=test&email=your-email@example.com`

## 📋 Testing Checklist

- [ ] Magic link email received
- [ ] Magic link URL contains `applicationId` parameter
- [ ] Auth callback logs show correct parameters
- [ ] User is authenticated successfully
- [ ] Redirect to password setup page works
- [ ] Password setup page loads correctly
- [ ] Password setup redirects to dashboard

## 🎯 Expected Flow

1. **Submit Application** → Success modal
2. **Receive Email** → Click magic link
3. **Auth Callback** → Process authentication
4. **Check Password** → If not set, redirect to setup
5. **Password Setup** → User sets password
6. **Dashboard** → User sees application tracking

## 📞 Next Steps

1. **Check console logs** during magic link click
2. **Use debug page** to see current state
3. **Verify Supabase configuration**
4. **Test with fresh email** if needed
5. **Check if redirect URLs match**

The most likely issue is either:
- Supabase redirect URL configuration
- Missing applicationId parameter in magic link
- Auth callback logic not working as expected

Let me know what you see in the console logs and debug page!
