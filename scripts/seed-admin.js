// Database seeding script for initial admin user
// Run this after setting up your Supabase project

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin seeding...')

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .single()

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
      return
    }

    // Create admin user
    const adminEmail = 'admin@nelimaclearning.co.ke'
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      email_confirm: true,
      user_metadata: {
        full_name: 'System Administrator',
        role: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Error creating admin user:', authError.message)
      return
    }

    console.log('✅ Admin user created:', authData.user.email)

    // Create admin profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        role: 'admin',
        full_name: 'System Administrator',
        email: adminEmail
      })

    if (profileError) {
      console.error('❌ Error creating admin profile:', profileError.message)
      return
    }

    console.log('✅ Admin profile created successfully!')
    console.log('📧 Admin email:', adminEmail)
    console.log('🆔 Admin ID:', authData.user.id)

    // Generate magic link for admin
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: adminEmail,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/admin`
      }
    })

    if (linkError) {
      console.error('❌ Error generating magic link:', linkError.message)
    } else {
      console.log('🔗 Magic link generated for admin login')
      console.log('📧 Check your email or use this link:', linkData.properties.action_link)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the seeding
seedAdmin()
