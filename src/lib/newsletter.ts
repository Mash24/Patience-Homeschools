'use server'

export async function subscribe(formData: FormData) {
  const email = (formData.get('email') || '').toString().trim();
  if (!email) return;
  
  // TODO: plug into your newsletter provider (Resend, MailerLite, Supabase, etc).
  // Example with Supabase or an API route is fine; keep it server-only here.
  
  console.log('Newsletter subscription:', email);
  
  // For now, just return success
  return { success: true, message: 'Thank you for subscribing!' };
}
