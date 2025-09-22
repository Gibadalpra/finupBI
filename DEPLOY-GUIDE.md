# 🚀 Guia de Deploy Gratuito - FinupBi MVP

## 📋 Checklist de Deploy

### ✅ Preparação (Concluída)
- [x] Configurações de ambiente criadas
- [x] Arquivos de deploy configurados
- [x] Scripts de build verificados

### 🔄 Próximos Passos

#### 1. **Configurar Supabase (Gratuito)** ✅
✅ **Concluído!** Projeto criado com sucesso:
- **URL**: `https://ykoddsohrwcmleugiyoy.supabase.co`
- **Região**: `sa-east-1` (São Paulo)
- **Plano**: Gratuito
- **Credenciais**: Configuradas nos arquivos `.env.production`

**PRÓXIMO PASSO:** Execute o script SQL no Supabase:

1. **Abra o Supabase Dashboard**:
   - Acesse: https://ykoddsohrwcmleugiyoy.supabase.co
   - Faça login na sua conta

2. **Execute o Script SQL**:
   - Vá em **SQL Editor** (menu lateral)
   - Clique em **New Query**
   - Copie todo o conteúdo do arquivo `supabase-setup.sql`
   - Cole no editor e clique em **Run**

3. **Verificar Criação das Tabelas**:
   - Vá em **Table Editor**
   - Verifique se foram criadas:
     - `profiles` (perfis de usuário)
     - `clients` (clientes)
     - `transactions` (transações/faturas)

4. **Configurar Autenticação**:
   - Vá em **Authentication** → **Settings**
   - Configure:
     - **Site URL**: `https://your-frontend-url.vercel.app` (atualize após deploy)
     - **Redirect URLs**: `https://your-frontend-url.vercel.app/**`

#### 2. **Deploy Frontend (Vercel)**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte com GitHub
3. Importe repositório
4. Configure variáveis de ambiente
5. Deploy automático

#### 3. **Deploy Backend (Railway)**
1. Acesse [railway.app](https://railway.app)
2. Conecte com GitHub
3. Selecione pasta `backend`
4. Configure variáveis de ambiente
5. Deploy automático

## 🔧 Configurações Necessárias

### **Variáveis de Ambiente - Frontend (Vercel)**
```
VITE_API_URL=https://finup-bi-backend.railway.app
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### **Variáveis de Ambiente - Backend (Railway)**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
SUPABASE_ANON_KEY=xxx
CORS_ORIGIN=https://finup-bi.vercel.app
NODE_ENV=production
```

## 🎯 URLs Finais (Após Deploy)
- **Frontend**: https://finup-bi.vercel.app
- **Backend**: https://finup-bi-backend.railway.app
- **Database**: Supabase Dashboard

## 💰 Custos
- **Total**: R$ 0/mês (dentro dos limites gratuitos)
- **Vercel**: Gratuito (100GB/mês)
- **Railway**: $5 crédito grátis
- **Supabase**: Gratuito (500MB)

## 🔍 Monitoramento
- Vercel: Dashboard de analytics
- Railway: Logs em tempo real
- Supabase: Dashboard de métricas

## 🆘 Troubleshooting
- **Build falha**: Verificar dependências
- **CORS error**: Verificar CORS_ORIGIN
- **DB connection**: Verificar credenciais Supabase