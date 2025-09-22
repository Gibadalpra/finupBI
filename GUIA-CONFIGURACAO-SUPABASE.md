# 🚀 Guia de Configuração do Supabase - Finup_BI

## 📋 Visão Geral

Este guia te ajudará a configurar o Supabase para o projeto Finup_BI. O Supabase é nossa plataforma Backend-as-a-Service que fornece:

- 🗄️ **Banco de dados PostgreSQL** (com interface visual)
- 🔐 **Sistema de autenticação** (login, registro, recuperação de senha)
- 📁 **Storage de arquivos** (upload de planilhas e documentos)
- 🔗 **APIs automáticas** (REST e GraphQL)
- 🛡️ **Row Level Security** (segurança a nível de linha)

## 🎯 Passo 1: Criar Conta no Supabase

### 1.1 Acesse o Supabase
1. Vá para [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado) ou crie uma conta

### 1.2 Criar Novo Projeto
1. No dashboard, clique em **"New Project"**
2. Preencha os dados:
   - **Organization**: Selecione ou crie uma organização
   - **Name**: `finup-bi-mvp`
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: `South America (São Paulo)` (mais próximo do Brasil)
   - **Pricing Plan**: `Free` (suficiente para o MVP)

3. Clique em **"Create new project"**
4. ⏳ Aguarde 2-3 minutos para o projeto ser criado

## 🔑 Passo 2: Obter as Chaves de API

### 2.1 Acessar Configurações
1. No seu projeto, vá para **Settings** (ícone de engrenagem)
2. Clique em **"API"** no menu lateral

### 2.2 Copiar as Chaves
Você verá 3 informações importantes:

#### 📍 **Project URL**
```
https://[seu-project-id].supabase.co
```

#### 🔓 **Anon (public) Key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*Esta chave é segura para usar no frontend*

#### 🔐 **Service Role Key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*⚠️ CUIDADO: Esta chave tem acesso total! Nunca exponha no frontend*

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### 3.1 Editar o arquivo .env
1. Abra o arquivo `backend/.env` no seu editor
2. Substitua os valores placeholder pelas suas chaves reais:

```env
# =============================================================================
# FINUP_BI - CONFIGURAÇÕES LOCAIS DE DESENVOLVIMENTO
# =============================================================================

# -----------------------------------------------------------------------------
# SUPABASE - Backend as a Service
# -----------------------------------------------------------------------------
SUPABASE_URL="https://[SEU-PROJECT-ID].supabase.co"
SUPABASE_ANON_KEY="[SUA-ANON-KEY-AQUI]"
SUPABASE_SERVICE_ROLE_KEY="[SUA-SERVICE-ROLE-KEY-AQUI]"

# -----------------------------------------------------------------------------
# SERVIDOR BACKEND
# -----------------------------------------------------------------------------
PORT=3001
NODE_ENV=development
```

### 3.2 Exemplo Preenchido
```env
SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk..."
```

## 🧪 Passo 4: Testar a Conexão

### 4.1 Reiniciar o Servidor Backend
1. No terminal do backend, pressione `Ctrl+C` para parar o servidor
2. Execute novamente: `npm start`
3. Você deve ver:
```
✅ Supabase configurado com sucesso
📍 URL: https://[seu-project-id].supabase.co
🔑 Anon Key: eyJhbGciOiJIUzI1NiIs...
🔐 Service Role: eyJhbGciOiJIUzI1NiIs...
🚀 Finup_BI Backend iniciado com sucesso!
```

### 4.2 Testar Endpoints
Abra no navegador:
- **Health Check**: http://localhost:3001/health
- **API Info**: http://localhost:3001/api/info

Você deve ver respostas JSON com informações do servidor.

## 🎨 Passo 5: Configurar o Frontend

### 5.1 Criar arquivo .env no Frontend
Crie o arquivo `frontend/.env`:

```env
# =============================================================================
# FINUP_BI FRONTEND - CONFIGURAÇÕES
# =============================================================================

# Supabase (apenas chaves públicas no frontend)
VITE_SUPABASE_URL="https://[SEU-PROJECT-ID].supabase.co"
VITE_SUPABASE_ANON_KEY="[SUA-ANON-KEY-AQUI]"

# Backend API
VITE_API_URL="http://localhost:3001"
```

## 🔒 Segurança e Boas Práticas

### ✅ O que PODE ser exposto no frontend:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### ❌ O que NUNCA deve ser exposto no frontend:
- `SUPABASE_SERVICE_ROLE_KEY`
- Senhas do banco de dados
- Chaves de APIs externas

### 🛡️ Dicas de Segurança:
1. **Nunca commite** arquivos `.env` no Git
2. **Use Row Level Security** no Supabase
3. **Valide dados** sempre no backend
4. **Limite permissões** por usuário

## 🚨 Solução de Problemas

### Erro: "Invalid API key"
- ✅ Verifique se copiou as chaves corretamente
- ✅ Certifique-se de não ter espaços extras
- ✅ Confirme se o projeto está ativo no Supabase

### Erro: "Network error"
- ✅ Verifique sua conexão com internet
- ✅ Confirme se a URL do projeto está correta
- ✅ Tente acessar a URL no navegador

### Servidor não inicia
- ✅ Verifique se todas as variáveis estão definidas
- ✅ Confirme se não há erros de sintaxe no .env
- ✅ Reinicie o terminal e tente novamente

## 📚 Próximos Passos

Após configurar o Supabase:
1. 🗄️ **Criar tabelas** do banco de dados
2. 🔐 **Configurar autenticação** de usuários
3. 📁 **Configurar storage** para uploads
4. 🛡️ **Implementar Row Level Security**
5. 🔗 **Integrar frontend** com backend

## 💡 Recursos Úteis

- 📖 [Documentação do Supabase](https://supabase.com/docs)
- 🎥 [Tutoriais em vídeo](https://www.youtube.com/c/Supabase)
- 💬 [Comunidade Discord](https://discord.supabase.com/)
- 🐛 [Suporte GitHub](https://github.com/supabase/supabase/discussions)

---

**🎯 Meta**: Ter o Supabase configurado e funcionando em 15-20 minutos!

**❓ Dúvidas?** Consulte este guia ou peça ajuda no desenvolvimento.