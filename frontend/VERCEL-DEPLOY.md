# 🚀 Deploy do Frontend no Vercel

## 📋 Pré-requisitos
- [x] Conta no Vercel (https://vercel.com)
- [x] Projeto conectado ao GitHub
- [x] Build local testado e funcionando
- [x] Variáveis de ambiente configuradas

## 🔧 Configuração das Variáveis de Ambiente

### No Painel do Vercel:
1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**⚠️ IMPORTANTE:** Use as mesmas credenciais do arquivo `.env.production`

## 📁 Estrutura de Arquivos Criados

```
frontend/
├── .vercelignore          # Arquivos ignorados no build
├── vercel.json           # Configurações do Vercel
├── vite.config.mjs       # Configuração otimizada do Vite
└── dist/                 # Pasta de build (criada após npm run build)
```

## 🚀 Passos para Deploy

### 1. **Conectar Repositório**
```bash
# Se ainda não conectou o GitHub ao Vercel:
# 1. Acesse vercel.com
# 2. Clique em "New Project"
# 3. Conecte seu repositório GitHub
# 4. Selecione o projeto finupBi
```

### 2. **Configurar Build**
O Vercel detectará automaticamente as configurações do `vercel.json`:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3. **Deploy Automático**
```bash
# Faça push para o GitHub:
git add .
git commit -m "feat: configuração para deploy no Vercel"
git push origin main
```

O Vercel fará deploy automaticamente a cada push!

## 🔍 Verificações Pós-Deploy

### ✅ Checklist de Funcionamento:
- [ ] Site carrega sem erros
- [ ] Console do navegador sem erros críticos
- [ ] Conexão com Supabase funcionando
- [ ] Rotas SPA funcionando (refresh em qualquer página)
- [ ] Assets carregando corretamente

### 🐛 Troubleshooting Comum:

#### **Erro 404 em rotas:**
- Verificar se `vercel.json` tem a configuração de SPA
- Confirmar que todas as rotas redirecionam para `index.html`

#### **Erro de variáveis de ambiente:**
- Verificar se as variáveis estão no painel do Vercel
- Confirmar que começam com `VITE_`
- Testar build local com as mesmas variáveis

#### **Erro de build:**
- Verificar se `npm run build` funciona localmente
- Checar se todas as dependências estão no `package.json`
- Verificar logs de build no painel do Vercel

## 📊 Otimizações Aplicadas

### **Performance:**
- ✅ Chunks separados por vendor/ui/app
- ✅ Minificação com Terser
- ✅ Tree-shaking automático
- ✅ Cache otimizado para assets

### **SEO & Headers:**
- ✅ Headers de segurança configurados
- ✅ Cache-Control otimizado
- ✅ Compressão gzip automática

## 🔗 URLs Importantes

Após o deploy, você terá:
- **URL de Produção:** `https://seu-projeto.vercel.app`
- **URL de Preview:** `https://git-branch-seu-projeto.vercel.app`
- **Dashboard:** `https://vercel.com/dashboard`

## 📱 Próximos Passos

1. **Testar funcionalidades principais**
2. **Configurar domínio customizado (opcional)**
3. **Configurar analytics (opcional)**
4. **Deploy do backend no Railway**

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no painel do Vercel
2. Teste o build localmente primeiro
3. Confirme as variáveis de ambiente
4. Verifique a conexão com o Supabase

**Lembre-se:** O Vercel faz deploy automático a cada push no GitHub! 🎉