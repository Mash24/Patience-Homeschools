export const runtime = 'nodejs'; // ensure Node runtime if imported by an API route

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.SUPABASE_PROJECT_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET_SERVICE_ROLE_KEY;

console.log('Checking Supabase config:', {
  url: SUPABASE_URL ? 'OK' : 'Missing',
  serviceKey: SERVICE_KEY ? 'OK' : 'Missing',
});

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

export const supabaseServer = createClient(SUPABASE_URL, SERVICE_KEY);
