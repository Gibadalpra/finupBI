# Perguntas Estratégicas - Finup_BI MVP

## 1. Perguntas sobre Infraestrutura e Deploy

### 1.1 Plataforma de Deploy
**❓ Qual plataforma de deploy você prefere?**
- [ ] **AWS ECS + RDS** (mais robusto, ~$50-100/mês)
- [ ] **DigitalOcean App Platform** (mais simples, ~$25-50/mês)
- [ ] **Vercel + Supabase** (mais rápido para MVP, ~$20-40/mês)
- [ ] **Railway** (equilibrio simplicidade/custo, ~$20-35/mês)

**Justificativa**: Cada opção tem trade-offs diferentes entre simplicidade, custo e escalabilidade.

### 1.2 Domínio e SSL
**❓ Você já tem um domínio definido?**
- [ ] Sim, qual? ________________
- [ ] Não, precisa de sugestões
- [ ] Vai usar subdomínio de plataforma (ex: app.railway.app)

**❓ Precisa de certificado SSL customizado?**
- [ ] Sim, certificado próprio
- [ ] Não, Let's Encrypt é suficiente
- [ ] Não sei a diferença

### 1.3 Backup e Recuperação
**❓ Qual a criticidade dos dados?**
- [ ] **Alta** - Backup diário + replicação
- [ ] **Média** - Backup diário simples
- [ ] **Baixa** - Backup semanal

**❓ Tempo máximo aceitável de indisponibilidade?**
- [ ] < 1 hora (precisa alta disponibilidade)
- [ ] < 4 horas (configuração padrão)
- [ ] < 24 horas (configuração simples)

## 2. Perguntas sobre Segurança e Compliance

### 2.1 Dados Sensíveis
**❓ Que tipos de dados sensíveis serão armazenados?**
- [ ] CPF/CNPJ de clientes
- [ ] Dados financeiros detalhados
- [ ] Informações bancárias
- [ ] Outros: ________________

**❓ Há requisitos de compliance específicos?**
- [ ] LGPD (Lei Geral de Proteção de Dados)
- [ ] SOX (Sarbanes-Oxley)
- [ ] Auditoria contábil específica
- [ ] Não há requisitos específicos

### 2.2 Autenticação e Autorização
**❓ Como os usuários serão criados inicialmente?**
- [ ] Admin cria todos os usuários
- [ ] Auto-registro com aprovação
- [ ] Auto-registro livre
- [ ] Integração com AD/LDAP (futuro)

**❓ Precisa de autenticação de dois fatores (2FA)?**
- [ ] Sim, obrigatório para todos
- [ ] Sim, opcional
- [ ] Não, apenas senha
- [ ] Não sei, você decide

### 2.3 Auditoria
**❓ Precisa de log de auditoria detalhado?**
- [ ] Sim, todas as ações dos usuários
- [ ] Sim, apenas ações críticas (login, alterações)
- [ ] Básico, apenas erros
- [x] Não é necessário

## 3. Perguntas sobre Funcionalidades

### 3.1 Importação de Dados
**❓ Qual o volume esperado de dados por importação?**
- [ ] < 1.000 linhas
- [ ] 1.000 - 10.000 linhas
- [ ] 10.000 - 100.000 linhas
- [ ] > 100.000 linhas

**❓ Com que frequência os dados serão importados?**
- [ ] Diariamente
- [ ] Semanalmente
- [ ] Mensalmente
- [ ] Esporadicamente

**❓ Precisa de validação automática dos dados importados?**
- [ ] Sim, com relatório de erros detalhado
- [ ] Sim, validação básica
- [ ] Não, usuário valida manualmente

### 3.2 Relatórios e Dashboards
**❓ Os relatórios precisam ser exportados?**
- [x] Sim, PDF
- [ ] Sim, Excel
- [ ] Sim, ambos
- [ ] Não, apenas visualização

**❓ Precisa de relatórios agendados/automáticos?**
- [ ] Sim, envio por email
- [ ] Sim, apenas geração automática
- [x] Não, apenas sob demanda

### 3.3 Multi-tenancy
**❓ Como será o isolamento entre clientes?**
- [ ] **Isolamento total** - cada cliente tem sua própria base
- [ ] **Isolamento lógico** - mesma base, filtro por client_id
- [ ] **Híbrido** - dados sensíveis isolados, configurações compartilhadas

**❓ Clientes podem ver dados de outros clientes?**
- [ ] Nunca, isolamento total
- [ ] Apenas dados agregados/anônimos
- [ ] Sim, se autorizado

## 4. Perguntas sobre Performance

### 4.1 Usuários Simultâneos
**❓ Quantos usuários simultâneos são esperados?**
- [ ] < 10 usuários
- [ ] 10-50 usuários
- [ ] 50-200 usuários
- [ ] > 200 usuários

**❓ Qual o tempo de resposta aceitável?**
- [ ] < 1 segundo (alta performance)
- [ ] < 3 segundos (performance normal)
- [ ] < 5 segundos (aceitável)
- [ ] Não é crítico

### 4.2 Crescimento
**❓ Qual o crescimento esperado nos próximos 12 meses?**
- [ ] 2x usuários e dados
- [ ] 5x usuários e dados
- [ ] 10x usuários e dados
- [ ] Crescimento incerto

## 5. Perguntas sobre Integração

### 5.1 Sistemas Externos
**❓ Precisa integrar com sistemas externos no MVP?**
- [ ] Sim, quais? ________________
- [ ] Não, apenas importação manual
- [ ] Futuro, após MVP

**❓ Precisa de API pública para terceiros?**
- [ ] Sim, documentação completa
- [ ] Sim, básica
- [ ] Não, apenas frontend próprio

### 5.2 Notificações
**❓ Precisa de notificações por email?**
- [ ] Sim, para eventos críticos
- [ ] Sim, para relatórios
- [ ] Sim, para ambos
- [x] Não é necessário no MVP

**❓ Precisa de notificações push/in-app?**
- [ ] Sim, crítico
- [ ] Sim, nice-to-have
- [x] Não é necessário no MVP

## 6. Perguntas sobre Orçamento e Timeline

### 6.1 Orçamento Mensal
**❓ Qual o orçamento mensal para infraestrutura?**
- [ ] < $30/mês (configuração básica)
- [ ] $30-100/mês (configuração intermediária)
- [ ] $100-300/mês (configuração robusta)
- [ ] > $300/mês (configuração enterprise)

### 6.2 Prioridades
**❓ Se o prazo de 21 dias for apertado, qual a prioridade?**
1. **Mais importante**: ________________
2. **Importante**: ________________
3. **Nice-to-have**: ________________
4. **Pode ficar para depois**: ________________

**Opções**:
- Autenticação e gestão de usuários
- Importação de dados realizados
- Importação de dados planejados
- Dashboards básicos
- Relatórios detalhados
- Plano de contas personalizado
- Mapeamento DE/PARA

### 6.3 Recursos da Equipe
**❓ Quantas pessoas vão trabalhar no projeto?**
- [ ] 1 pessoa (full-stack)
- [x] 2 pessoas (front + back)
- [ ] 3+ pessoas

**❓ Qual o nível de experiência da equipe?**
- [x] **Júnior** - precisa mais suporte e documentação
- [ ] **Pleno** - consegue trabalhar com autonomia
- [ ] **Sênior** - pode tomar decisões arquiteturais

## 7. Perguntas sobre Manutenção

### 7.1 Monitoramento
**❓ Precisa de monitoramento de performance?**
- [ ] Sim, detalhado (APM completo)
- [ ] Sim, básico (uptime + erros)
- [ ] Não é necessário no MVP

**❓ Precisa de alertas automáticos?**
- [ ] Sim, para indisponibilidade
- [ ] Sim, para performance
- [ ] Sim, para ambos
- [ ] Não é necessário no MVP

### 7.2 Atualizações
**❓ Como serão feitas as atualizações?**
- [ ] Deploy automático (CI/CD)
- [ ] Deploy manual com aprovação
- [ ] Deploy apenas em horários específicos

**❓ Precisa de ambiente de staging?**
- [ ] Sim, obrigatório
- [ ] Sim, mas simples
- [ ] Não é necessário no MVP

---

## 📋 Resumo das Decisões Tomadas

### 🚀 Infraestrutura Escolhida:
- **Deploy**: Vercel + Supabase (~$20-40/mês)
- **Domínio**: www.app.finup.com.br (precisa configurar subdomínio)
- **SSL**: Certificado próprio
- **Backup**: Diário simples (criticidade média)
- **Indisponibilidade**: < 24 horas aceitável

### 🔒 Segurança e Compliance:
- **Dados Sensíveis**: CPF/CNPJ + dados financeiros detalhados
- **Compliance**: LGPD obrigatório
- **Autenticação**: Admin cria usuários, sem 2FA
- **Auditoria**: Não necessária no momento

### ⚡ Funcionalidades Priorizadas:
- **Importação**: < 1.000 linhas, semanalmente, com validação detalhada
- **Relatórios**: Export PDF + visualização, apenas sob demanda
- **Multi-tenancy**: Isolamento híbrido, dados nunca compartilhados
- **Performance**: < 3 segundos, < 10 usuários no MVP

### 🎯 Prioridades do MVP (21 dias):
1. **CRÍTICO**: Cliente/usuário cadastrado + sistema publicado + upload base + DFC Realizado
2. **IMPORTANTE**: DFC Planejado e Realizado
3. **DEPOIS**: Mapeamento de Contas e DE PARA

### 💰 Orçamento e Recursos:
- **Orçamento mensal**: < $30/mês para MVP
- **Equipe**: 2 pessoas (front + back), nível júnior
- **Crescimento**: 5x usuários/dados em 12 meses
- **Integrações**: Futuras, após MVP
- **Notificações**: Não necessárias no MVP

## 8. Perguntas sobre Dados de Teste

### 8.1 Dados para Desenvolvimento
**❓ Tem dados reais para testar?**
- [ ] Sim, posso compartilhar (anonimizados)
- [ ] Sim, mas são sensíveis
- [ ] Não, precisa de dados fictícios

**❓ Precisa de ambiente de homologação separado?**
- [ ] Sim, obrigatório
- [ ] Sim, se possível
- [ ] Não é necessário

## 9. Decisões Recomendadas (Baseadas na Análise)

### 9.1 Para MVP Rápido (21 dias)
**Recomendações**:
- ✅ **Deploy**: DigitalOcean App Platform
- ✅ **Banco**: PostgreSQL gerenciado
- ✅ **Cache**: Redis gerenciado
- ✅ **SSL**: Let's Encrypt automático
- ✅ **Backup**: Diário automático
- ✅ **Monitoramento**: Básico da plataforma

### 9.2 Para Produção Robusta (futuro)
**Migração para**:
- 🔄 **Deploy**: AWS ECS + RDS
- 🔄 **Monitoramento**: CloudWatch + alertas
- 🔄 **Backup**: Multi-região
- 🔄 **CDN**: CloudFront
- 🔄 **Segurança**: WAF + Shield

## 10. Próximas Ações Baseadas nas Respostas

**Após responder essas perguntas, podemos**:
1. ✅ Finalizar escolha da plataforma de deploy
2. ✅ Configurar ambiente de desenvolvimento
3. ✅ Definir estrutura do banco de dados
4. ✅ Implementar autenticação
5. ✅ Criar pipeline de CI/CD
6. ✅ Começar desenvolvimento das APIs

---

**⚡ Ação Imediata**: Responda as perguntas marcadas como críticas (❓) para definirmos a arquitetura final e começarmos o desenvolvimento.

**🎯 Meta**: Com essas respostas, conseguimos criar um plano de implementação detalhado e começar o desenvolvimento com confiança de que estamos na direção certa.