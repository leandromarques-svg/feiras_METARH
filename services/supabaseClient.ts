
import { createClient } from '@supabase/supabase-js';


// Defina manualmente as variáveis para teste local ou produção
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cnwxpqttflndiuqymtmw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNud3hwcXR0ZmxuZGl1cXltdG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTUzMzMsImV4cCI6MjA3OTM5MTMzM30.-p59cN_rT2e7c5evmFX6-pdOpRBHJKhlrfF7V8947hk';

// Só inicializa se tivermos os parâmetros necessários
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!) 
  : null;
