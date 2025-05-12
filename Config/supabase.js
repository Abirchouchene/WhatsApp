import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Initialize Supabase
const supabaseUrl = 'https://jheyurhrihomobgadbxc.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZXl1cmhyaWhvbW9iZ2FkYnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTU0NzQsImV4cCI6MjA2MjUzMTQ3NH0.b-_JRXMYQo652BftSICSVNkjp0MuGbkiJoZvVJYfWMU';                   

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;