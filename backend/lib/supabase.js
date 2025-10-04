require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Service role client for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Anon client for client-side operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = {
  supabase,
  supabaseAdmin
};
