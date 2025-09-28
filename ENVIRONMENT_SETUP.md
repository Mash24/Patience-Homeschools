# Environment Setup for Email Functionality

## 🚨 Quick Fix: Set Up Environment Variables

### **Step 1: Create `.env.local` file**

Create a file called `.env.local` in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration (Optional - for custom SMTP)
RESEND_API_KEY=your_resend_api_key

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=+254XXXXXXXXX
```

### **Step 2: Get Your Supabase Values**

1. Go to your **Supabase Dashboard**
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### **Step 3: Restart Your Development Server**

```bash
npm run dev
```

### **Step 4: Test Email Functionality**

1. Submit a teacher application
2. Check your **browser console** and **terminal** for logs
3. Look for these messages:
   - "Attempting to send magic link to: [email]"
   - "Magic link generated successfully"
   - Any error messages

### **Step 5: Check Supabase Email Settings**

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Ensure these are **enabled**:
   - ✅ Enable email confirmations
   - ✅ Enable magic link
   - ✅ Enable email change confirmations

### **Common Issues:**

| Problem | Solution |
|---------|----------|
| No `.env.local` file | Create it with the values above |
| Wrong environment variable name | Use `NEXT_PUBLIC_APP_URL` not `NEXT_PUBLIC_SITE_URL` |
| Service role key missing | Get it from Supabase Dashboard → Settings → API |
| Email not configured | Check Supabase Authentication settings |
| Rate limited | Check Supabase usage limits |

### **Debug Commands:**

Check if environment variables are loaded:
```bash
# In your terminal, run:
echo $NEXT_PUBLIC_APP_URL
echo $NEXT_PUBLIC_SUPABASE_URL
```

### **Next Steps:**

1. **Set up environment variables** (most common fix)
2. **Check Supabase email configuration**
3. **Test with a real email address**
4. **Check spam folder**
5. **Review console logs for specific errors**

---

**The most likely issue is missing environment variables!** Set up `.env.local` first.
