import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Initialize Supabase
const supabaseUrl = 'https://jtrapjuwhapunkgvuzdk.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cmFwanV3aGFwdW5rZ3Z1emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTMxMzMsImV4cCI6MjA2MDM2OTEzM30._A3XEqPwB4DQqxd4MU5ukutxaQ-KRad1CcIW3WkjjRw';                   

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;