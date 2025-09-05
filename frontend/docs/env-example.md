# Exemplo de Configuração de Variáveis de Ambiente

## 📁 Arquivo .env.example

Crie este arquivo na raiz do projeto para servir como template:

```env
# ===========================================
# CONFIGURAÇÕES DE DESENVOLVIMENTO
# ===========================================

# URL da API Backend
REACT_APP_API_URL=http://localhost:3001/api

# Ambiente de execução
REACT_APP_ENVIRONMENT=development

# ===========================================
# CONFIGURAÇÕES DE AUTENTICAÇÃO
# ===========================================

# JWT Secret (para desenvolvimento)
REACT_APP_JWT_SECRET=your-jwt-secret-key-here

# Tempo de expiração do token (em segundos)
REACT_APP_TOKEN_EXPIRY=3600

# ===========================================
# CONFIGURAÇÕES DE BANCO DE DADOS
# ===========================================

# URL de conexão com o banco
REACT_APP_DATABASE_URL=postgresql://username:password@localhost:5432/finupbi_dev

# ===========================================
# CONFIGURAÇÕES DE TERCEIROS
# ===========================================

# Chave da API de cotações
REACT_APP_EXCHANGE_API_KEY=your-exchange-api-key

# Chave da API bancária
REACT_APP_BANK_API_KEY=your-bank-api-key

# Google Analytics ID
REACT_APP_GA_TRACKING_ID=GA-XXXXXXXXX

# ===========================================
# CONFIGURAÇÕES DE EMAIL
# ===========================================

# Configurações SMTP
REACT_APP_SMTP_HOST=smtp.gmail.com
REACT_APP_SMTP_PORT=587
REACT_APP_SMTP_USER=your-email@gmail.com
REACT_APP_SMTP_PASS=your-app-password

# ===========================================
# CONFIGURAÇÕES DE STORAGE
# ===========================================

# AWS S3 (para upload de arquivos)
REACT_APP_AWS_ACCESS_KEY_ID=your-aws-access-key
REACT_APP_AWS_SECRET_ACCESS_KEY=your-aws-secret-key
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_BUCKET_NAME=finupbi-uploads

# ===========================================
# CONFIGURAÇÕES DE DESENVOLVIMENTO
# ===========================================

# Porta do servidor de desenvolvimento
PORT=4028

# Habilitar HTTPS em desenvolvimento
HTTPS=false

# Habilitar hot reload
FAST_REFRESH=true

# ===========================================
# CONFIGURAÇÕES DE BUILD
# ===========================================

# URL pública da aplicação
REACT_APP_PUBLIC_URL=http://localhost:4028

# Habilitar source maps em produção
GENERATE_SOURCEMAP=false

# ===========================================
# CONFIGURAÇÕES DE MONITORAMENTO
# ===========================================

# Sentry DSN (para tracking de erros)
REACT_APP_SENTRY_DSN=your-sentry-dsn

# LogRocket App ID
REACT_APP_LOGROCKET_ID=your-logrocket-id
```

## 🔒 Arquivo .env (Real)

Crie um arquivo `.env` na raiz do projeto com os valores reais:

```env
# NUNCA COMMITAR ESTE ARQUIVO!
# Adicione .env ao .gitignore

REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
REACT_APP_JWT_SECRET=minha-chave-secreta-super-segura-123
# ... outros valores reais
```

## 📝 Como Usar no Código

### 1. Acessando Variáveis de Ambiente

```jsx
// utils/config.js
export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  jwtSecret: process.env.REACT_APP_JWT_SECRET,
  tokenExpiry: parseInt(process.env.REACT_APP_TOKEN_EXPIRY) || 3600,
  
  // Configurações de terceiros
  exchangeApiKey: process.env.REACT_APP_EXCHANGE_API_KEY,
  bankApiKey: process.env.REACT_APP_BANK_API_KEY,
  
  // Configurações de monitoramento
  sentryDsn: process.env.REACT_APP_SENTRY_DSN,
  gaTrackingId: process.env.REACT_APP_GA_TRACKING_ID,
  
  // Flags de desenvolvimento
  isDevelopment: process.env.REACT_APP_ENVIRONMENT === 'development',
  isProduction: process.env.REACT_APP_ENVIRONMENT === 'production',
};
```

### 2. Usando no Código

```jsx
// services/api.js
import { config } from '../utils/config';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 3. Validação de Variáveis Obrigatórias

```jsx
// utils/validateEnv.js
import { config } from './config';

const requiredEnvVars = [
  'REACT_APP_API_URL',
  'REACT_APP_JWT_SECRET',
];

const optionalEnvVars = [
  'REACT_APP_SENTRY_DSN',
  'REACT_APP_GA_TRACKING_ID',
];

export const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não encontradas:');
    missing.forEach(envVar => console.error(`   - ${envVar}`));
    
    if (config.isProduction) {
      throw new Error('Variáveis de ambiente obrigatórias não configuradas');
    }
  }
  
  const missingOptional = optionalEnvVars.filter(envVar => !process.env[envVar]);
  if (missingOptional.length > 0 && config.isDevelopment) {
    console.warn('⚠️  Variáveis de ambiente opcionais não encontradas:');
    missingOptional.forEach(envVar => console.warn(`   - ${envVar}`));
  }
  
  console.log('✅ Configuração de ambiente validada com sucesso');
};
```

### 4. Inicialização no App

```jsx
// App.js
import React from 'react';
import { validateEnvironment } from './utils/validateEnv';
import { config } from './utils/config';

// Validar ambiente na inicialização
if (config.isDevelopment) {
  validateEnvironment();
}

function App() {
  return (
    <div className="App">
      {/* Sua aplicação */}
    </div>
  );
}

export default App;
```

## 🛡️ Boas Práticas de Segurança

### 1. Nunca Commitar Secrets

```gitignore
# .gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Arquivos de configuração sensíveis
config/secrets.json
config/keys.json
```

### 2. Diferentes Ambientes

```bash
# Desenvolvimento
.env.development

# Teste
.env.test

# Produção
.env.production
```

### 3. Validação de Tipos

```jsx
// utils/envTypes.js
export const parseEnvBoolean = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const parseEnvNumber = (value, defaultValue = 0) => {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const parseEnvArray = (value, separator = ',', defaultValue = []) => {
  if (value === undefined) return defaultValue;
  return value.split(separator).map(item => item.trim());
};
```

### 4. Configuração por Ambiente

```jsx
// utils/environmentConfig.js
import { config } from './config';

const environmentConfigs = {
  development: {
    logLevel: 'debug',
    enableDevTools: true,
    apiTimeout: 30000,
    enableMocking: true,
  },
  
  test: {
    logLevel: 'error',
    enableDevTools: false,
    apiTimeout: 5000,
    enableMocking: true,
  },
  
  production: {
    logLevel: 'error',
    enableDevTools: false,
    apiTimeout: 10000,
    enableMocking: false,
  },
};

export const getEnvironmentConfig = () => {
  return {
    ...environmentConfigs[config.environment],
    ...config,
  };
};
```

## 📋 Checklist de Configuração

### ✅ Arquivos Necessários
- [ ] `.env.example` criado com todas as variáveis
- [ ] `.env` criado com valores reais (não commitado)
- [ ] `.gitignore` configurado para ignorar arquivos `.env`
- [ ] `utils/config.js` criado para centralizar configurações

### ✅ Segurança
- [ ] Nenhum secret commitado no repositório
- [ ] Variáveis sensíveis usando prefixo `REACT_APP_`
- [ ] Validação de variáveis obrigatórias implementada
- [ ] Diferentes configurações por ambiente

### ✅ Documentação
- [ ] README atualizado com instruções de configuração
- [ ] Comentários explicativos no `.env.example`
- [ ] Documentação de como adicionar novas variáveis

### ✅ Desenvolvimento
- [ ] Configuração funciona em desenvolvimento
- [ ] Configuração funciona em produção
- [ ] Fallbacks adequados para variáveis opcionais
- [ ] Logs informativos sobre configuração

---

**Importante:** Sempre mantenha os secrets seguros e nunca os exponha em código público. Use serviços como AWS Secrets Manager, Azure Key Vault ou similar em produção.