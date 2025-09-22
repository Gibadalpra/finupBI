/**
 * Servidor principal do Finup_BI Backend
 * 
 * Este arquivo configura o servidor Express que será usado como
 * ponte entre o frontend React e o Supabase.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { supabaseClient, supabaseConfig } from './config/supabase.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co"]
    }
  }
}));

// Configuração CORS para desenvolvimento
app.use(cors({
  origin: [
    'http://localhost:4028', // Frontend em desenvolvimento
    'http://localhost:3000', // Frontend alternativo
    'https://app.finup.com.br' // Produção
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey']
}));

// Middlewares para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Finup_BI Backend',
    version: '1.0.0',
    supabase: {
      connected: true,
      url: supabaseConfig.url
    }
  });
});

// Rota de informações da API
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Finup_BI API',
    version: '1.0.0',
    description: 'API para o sistema de Business Intelligence Financeiro',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      clients: '/api/clients/*',
      uploads: '/api/uploads/*',
      reports: '/api/reports/*'
    },
    documentation: 'https://docs.finup.com.br'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Erro interno do servidor' 
        : err.message,
      status: err.status || 500,
      timestamp: new Date().toISOString()
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Rota não encontrada',
      status: 404,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log('🚀 Finup_BI Backend iniciado com sucesso!');
  console.log(`📍 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Supabase URL: ${supabaseConfig.url}`);
  console.log('\n📋 Rotas disponíveis:');
  console.log('   GET  /health          - Status do servidor');
  console.log('   GET  /api/info        - Informações da API');
  console.log('\n✅ Pronto para receber requisições!');
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', () => {
  console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Recebido SIGINT, encerrando servidor...');
  process.exit(0);
});

export default app;