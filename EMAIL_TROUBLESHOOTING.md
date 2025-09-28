# Email Not Working - Troubleshooting Guide

## 🚨 Issue: Applications submit successfully but no magic link emails are received

### **Step 1: Check Environment Variables**

Make sure your `.env.local` file has:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# or your production URL: https://yourdomain.com
```

### **Step 2: Check Supabase Email Configuration**

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication > Settings**
3. **Check "Email" section:**

#### **Required Settings:**
- ✅ **Enable email confirmations** should be ON
- ✅ **Enable email change confirmations** should be ON
- ✅ **Enable magic link** should be ON

#### **Email Templates:**
- Check if **Magic Link** template is configured
- Default template should work, but you can customize it

### **Step 3: Check Email Service Provider**

Supabase uses different email providers:

#### **Free Tier (Supabase Email):**
- Limited to 30 emails per day
- May have delays
- Check spam folder

#### **Custom SMTP (Recommended for Production):**
- Go to **Authentication > Settings > SMTP Settings**
- Configure your email provider (Gmail, SendGrid, etc.)

### **Step 4: Check Console Logs**

After submitting an application, check your browser console and terminal for:
- Magic link generation logs
- Any error messages
- Email sending status

### **Step 5: Test Email Functionality**

#### **Quick Test:**
1. Go to **Supabase Dashboard > Authentication > Users**
2. Click **"Invite User"**
3. Enter an email address
4. Check if invitation email is received

If invitation emails work but magic links don't, the issue is in the code.

### **Step 6: Alternative Solutions**

#### **Option A: Use OTP Instead of Magic Link**
```typescript
// In sendApplicationMagicLink function, change:
type: 'magiclink'
// to:
type: 'signup'
```

#### **Option B: Manual Account Creation**
Instead of magic links, create accounts directly and send login credentials.

#### **Option C: Use Custom Email Service**
Integrate with SendGrid, Mailgun, or similar service.

### **Step 7: Check Email Deliverability**

- **Check spam/junk folder**
- **Check email provider's delivery logs**
- **Try different email addresses** (Gmail, Yahoo, etc.)
- **Check if domain is blacklisted**

### **Common Issues & Solutions:**

| Issue | Solution |
|-------|----------|
| No emails at all | Check SMTP configuration |
| Emails in spam | Configure SPF/DKIM records |
| Rate limited | Upgrade Supabase plan or use custom SMTP |
| Wrong redirect URL | Check NEXT_PUBLIC_SITE_URL |
| Template issues | Reset to default email templates |

### **Debug Steps:**

1. **Check terminal logs** when submitting application
2. **Check Supabase logs** in Dashboard > Logs
3. **Test with different email providers**
4. **Verify environment variables**
5. **Check email template configuration**

### **Quick Fix:**

If you need immediate functionality, you can:
1. **Create accounts manually** in Supabase Dashboard
2. **Send login credentials** via your own email service
3. **Use OTP instead of magic links**

---

**Need help?** Check the console logs first - they'll show exactly what's failing.
