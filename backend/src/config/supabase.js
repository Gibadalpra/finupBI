/**
 * Configuração do cliente Supabase
 * 
 * Este arquivo centraliza a configuração do Supabase para o backend.
 * Utiliza as variáveis de ambiente para manter as credenciais seguras.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Validação das variáveis de ambiente obrigatórias
const requiredEnvVars = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
};

// Verifica se todas as variáveis obrigatórias estão definidas
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Variável de ambiente ${key} é obrigatória mas não foi definida`);
  }
}

/**
 * Cliente Supabase para operações públicas (frontend)
 * Usa a chave anônima (anon key) com Row Level Security
 */
export const supabaseClient = createClient(
  requiredEnvVars.SUPABASE_URL,
  requiredEnvVars.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    }
  }
);

/**
 * Cliente Supabase para operações administrativas (backend)
 * Usa a service role key que bypassa RLS quando necessário
 */
export const supabaseAdmin = createClient(
  requiredEnvVars.SUPABASE_URL,
  requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

/**
 * Configurações do Supabase
 */
export const supabaseConfig = {
  url: requiredEnvVars.SUPABASE_URL,
  anonKey: requiredEnvVars.SUPABASE_ANON_KEY,
  serviceRoleKey: requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY
};

console.log('✅ Supabase configurado com sucesso');
console.log(`📍 URL: ${requiredEnvVars.SUPABASE_URL}`);
console.log(`🔑 Anon Key: ${requiredEnvVars.SUPABASE_ANON_KEY.substring(0, 20)}...`);
console.log(`🔐 Service Role: ${requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`);