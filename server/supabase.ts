import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Missing Supabase URL or Service Role Key in environment variables');
}

// Create connection to Supabase with Service Role (Admin privileges)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
