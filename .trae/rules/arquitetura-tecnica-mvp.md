# Documento de Arquitetura Técnica - Finup_BI MVP

## 1. Arquitetura Geral

```mermaid
graph TD
    A[Cliente Browser] --> B[React Frontend - Vercel]
    B --> C[Supabase Client SDK]
    C --> D[Supabase Backend]
    D --> E[PostgreSQL Database]
    D --> F[Supabase Auth]
    D --> G[Supabase Storage]
    
    subgraph "Frontend Layer (Vercel)"
        B
    end
    
    subgraph "Backend-as-a-Service (Supabase)"
        C
        D
        F
    end
    
    subgraph "Data Layer (Supabase)"
        E
        G
    end
```

## 2. Descrição das Tecnologias

### Frontend
- **React 18.2.0** + **Vite 5.0.0** para desenvolvimento rápido
- **Tailwind CSS 3.4.6** para estilização
- **Redux Toolkit 2.6.1** para gerenciamento de estado
- **React Router DOM 6.0.2** para navegação
- **Recharts 2.15.2** + **D3 7.9.0** para visualização de dados
- **React Hook Form 7.55.0** para formulários
- **Axios 1.8.4** para requisições HTTP
- **Framer Motion 10.16.4** para animações

### Backend
- **Supabase** como Backend-as-a-Service
- **Supabase Client SDK** para integração com frontend
- **PostgreSQL 15+** gerenciado pelo Supabase
- **Row Level Security (RLS)** para isolamento lógico por client_id
- **Supabase Auth** para autenticação (sem 2FA)
- **Supabase Functions** para processamento de dados (se necessário)
- **Supabase Storage** para upload de planilhas

### Banco de Dados
- **PostgreSQL 15+** gerenciado pelo Supabase
- **Backup diário automático** via Supabase
- **Multi-tenancy** com isolamento lógico por client_id

### Infraestrutura
- **Vercel** para deploy do frontend
- **Supabase** para backend e banco de dados
- **SSL automático** via Vercel
- **Domínio customizado**: www.app.finup.com.br

## 3. Definições de Rotas Frontend

| Rota | Propósito | Componente |
|------|-----------|------------|
| `/` | Página inicial/dashboard | Dashboard |
| `/login` | Autenticação de usuários | Login |
| `/clients` | Gestão de clientes | ClientManagement |
| `/users` | Gestão de usuários | UserManagement |
| `/chart-of-accounts` | Plano de contas | ChartOfAccounts |
| `/account-mapping` | Mapeamento DE/PARA | AccountMapping |
| `/data-import` | Importação de dados realizados | DataImport |
| `/planned-import` | Importação de dados planejados | PlannedImport |
| `/dashboard/realized` | Dashboard realizado | DashboardRealized |
| `/dashboard/planned` | Dashboard planejado | DashboardPlanned |
| `/dashboard/comparison` | Dashboard comparativo | DashboardComparison |
| `/financial-reports` | Relatórios financeiros | FinancialReports |
| `/profile` | Configurações do usuário | ProfileSettings |

## 4. Integração com Supabase

### 4.1 Autenticação via Supabase Auth

#### Login
```javascript
// Usando Supabase Client SDK
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

**Configuração:**
- **Método**: Email + Password (sem 2FA)
- **Criação de usuários**: Apenas admin pode criar
- **Políticas RLS**: Isolamento por client_id

#### Registro (Admin apenas)
```javascript
// Admin cria usuários
const { data, error } = await supabase.auth.admin.createUser({
  email: 'newuser@example.com',
  password: 'password',
  user_metadata: {
    name: 'Nome Completo',
    role: 'user',
    client_id: 'uuid-do-cliente'
  }
})
```

### 4.2 Gestão de Clientes via Supabase

#### Listar Clientes
```javascript
// Com RLS automático por client_id
const { data, error } = await supabase
  .from('clients')
  .select('*')
```

#### Criar Cliente
```javascript
const { data, error } = await supabase
  .from('clients')
  .insert({
    name: 'Razão Social',
    cnpj: '12.345.678/0001-90',
    email: 'contato@empresa.com',
    phone: '(11) 99999-9999',
    address: { /* objeto endereço */ },
    client_id: 'uuid-gerado' // Para isolamento
  })
```

**Políticas RLS:**
- Usuários só veem dados do próprio client_id
- Admin pode ver todos os clientes

### 4.3 Plano de Contas via Supabase

#### Listar Grupos
```javascript
const { data, error } = await supabase
  .from('account_groups')
  .select('*')
  .eq('client_id', userClientId) // Isolamento automático
```

#### Criar Conta
```javascript
const { data, error } = await supabase
  .from('accounts')
  .insert({
    code: '1.1.01',
    name: 'Caixa',
    group_id: 'uuid-do-grupo',
    parent_id: 'uuid-conta-pai', // opcional
    account_type: 'ativo',
    client_id: userClientId // Isolamento obrigatório
  })
```

### 4.4 Importação de Dados via Supabase

#### Upload de Planilha (1.000-10.000 linhas)
```javascript
// 1. Upload do arquivo
const { data, error } = await supabase.storage
  .from('imports')
  .upload(`${client_id}/${filename}`, file)

// 2. Processamento via Supabase Function
const { data, error } = await supabase.functions.invoke('process-import', {
  body: {
    file_path: data.path,
    client_id: userClientId,
    import_type: 'realized' // ou 'planned'
  }
})
```

**Validação Automática:**
- Relatório de erros detalhado
- Processamento semanal
- Logs detalhados para troubleshooting
- Isolamento por client_id

## 5. Arquitetura Supabase

```mermaid
graph TD
    A[Cliente Browser] --> B[React App - Vercel]
    B --> C[Supabase Client SDK]
    C --> D[Supabase Auth]
    C --> E[Supabase Database]
    C --> F[Supabase Storage]
    C --> G[Supabase Functions]
    
    D --> H[Row Level Security]
    E --> H
    F --> H
    G --> H
    
    subgraph "Frontend (Vercel)"
        B
    end
    
    subgraph "Backend-as-a-Service (Supabase)"
        C
        D
        E
        F
        G
        H
    end
```

### 5.1 Benefícios da Arquitetura Supabase
- **Simplicidade**: Menos código backend para manter
- **Segurança**: RLS automático para isolamento
- **Escalabilidade**: Gerenciado automaticamente
- **Ideal para equipe júnior**: Menos complexidade
- **Custo**: Dentro do orçamento < $30/mês

## 6. Modelo de Dados

### 6.1 Diagrama ER

```mermaid
erDiagram
    CLIENT ||--o{ USER : has
    CLIENT ||--o{ CHART_OF_ACCOUNTS : owns
    CLIENT ||--o{ TRANSACTION : has
    
    USER {
        uuid id PK
        string name
        string email UK
        string password_hash
        string role
        uuid client_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    CLIENT {
        uuid id PK
        string name
        string cnpj UK
        string email
        string phone
        json address
        timestamp created_at
        timestamp updated_at
    }
    
    CHART_OF_ACCOUNTS {
        uuid id PK
        string code UK
        string name
        uuid client_id FK
        uuid parent_id FK
        string account_type
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    TRANSACTION {
        uuid id PK
        uuid client_id FK
        uuid account_id FK
        date issue_date
        date due_date
        date payment_date
        string person
        decimal original_value
        decimal treated_value
        string description
        string cost_center
        timestamp created_at
        timestamp updated_at
    }
    
    PLANNED_TRANSACTION {
        uuid id PK
        uuid client_id FK
        uuid account_id FK
        string planning_name
        string cost_center
        date reference_month
        decimal planned_value
        timestamp created_at
        timestamp updated_at
    }
    
    ACCOUNT_MAPPING {
        uuid id PK
        uuid client_id FK
        string original_account
        uuid mapped_account_id FK
        timestamp created_at
        timestamp updated_at
    }
```

### 6.2 Scripts de Criação das Tabelas

#### Tabela de Usuários
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin_cliente', 'usuario_interno', 'usuario_externo')),
    client_id UUID REFERENCES clients(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_client_id ON users(client_id);
```

#### Tabela de Clientes
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clients_cnpj ON clients(cnpj);
CREATE INDEX idx_clients_name ON clients(name);
```

#### Tabela do Plano de Contas
```sql
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id),
    parent_id UUID REFERENCES chart_of_accounts(id),
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('receita', 'despesa', 'ativo', 'passivo')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, code)
);

CREATE INDEX idx_chart_accounts_client ON chart_of_accounts(client_id);
CREATE INDEX idx_chart_accounts_parent ON chart_of_accounts(parent_id);
CREATE INDEX idx_chart_accounts_type ON chart_of_accounts(account_type);
```

#### Tabela de Transações
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    issue_date DATE,
    due_date DATE,
    payment_date DATE,
    person VARCHAR(255),
    original_value DECIMAL(15,2) NOT NULL,
    treated_value DECIMAL(15,2) NOT NULL,
    installment INTEGER,
    total_installments INTEGER,
    bank_account VARCHAR(255),
    description TEXT,
    cost_center VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_client ON transactions(client_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_dates ON transactions(issue_date, due_date, payment_date);
CREATE INDEX idx_transactions_cost_center ON transactions(cost_center);
```

#### Tabela de Transações Planejadas
```sql
CREATE TABLE planned_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    planning_name VARCHAR(255) NOT NULL,
    cost_center VARCHAR(255),
    reference_month DATE NOT NULL,
    planned_value DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_planned_transactions_client ON planned_transactions(client_id);
CREATE INDEX idx_planned_transactions_month ON planned_transactions(reference_month);
CREATE INDEX idx_planned_transactions_planning ON planned_transactions(planning_name);
```

#### Tabela de Mapeamento de Contas
```sql
CREATE TABLE account_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    original_account VARCHAR(255) NOT NULL,
    mapped_account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, original_account)
);

CREATE INDEX idx_account_mapping_client ON account_mapping(client_id);

### 6.3 Políticas de Row Level Security (RLS)

#### Habilitação do RLS
```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_mapping ENABLE ROW LEVEL SECURITY;
```

#### Políticas para Isolamento por client_id
```sql
-- Política para clientes (apenas próprios dados)
CREATE POLICY "Users can only see their own client data" ON clients
  FOR ALL USING (
    id = (auth.jwt() ->> 'client_id')::uuid OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Política para usuários
CREATE POLICY "Users can only see users from their client" ON users
  FOR ALL USING (
    client_id = (auth.jwt() ->> 'client_id')::uuid OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Política para plano de contas
CREATE POLICY "Users can only see their client's chart of accounts" ON chart_of_accounts
  FOR ALL USING (
    client_id = (auth.jwt() ->> 'client_id')::uuid OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Política para transações
CREATE POLICY "Users can only see their client's transactions" ON transactions
  FOR ALL USING (
    client_id = (auth.jwt() ->> 'client_id')::uuid OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Política para transações planejadas
CREATE POLICY "Users can only see their client's planned transactions" ON planned_transactions
  FOR ALL USING (
    client_id = (auth.jwt() ->> 'client_id')::uuid OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Política para mapeamento de contas
CREATE POLICY "Users can only see their client's account mapping" ON account_mapping
  FOR ALL USING (
    client_id = (auth.jwt() ->> 'client_id')::uuid OR
    auth.jwt() ->> 'role' = 'super_admin'
  );
```

### 6.4 Configuração de Backup e Compliance

#### Backup Diário Automático
- **Supabase**: Backup automático diário incluído no plano
- **Retenção**: 7 dias no plano gratuito, 30 dias no plano pago
- **Restauração**: Via dashboard do Supabase

#### Compliance LGPD
```sql
-- Função para anonimização de dados (LGPD)
CREATE OR REPLACE FUNCTION anonymize_client_data(client_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Anonimizar dados sensíveis do cliente
  UPDATE clients 
  SET 
    name = 'Cliente Anonimizado',
    cnpj = 'ANONIMIZADO',
    email = 'anonimizado@example.com',
    phone = NULL,
    address = NULL
  WHERE id = client_uuid;
  
  -- Anonimizar transações
  UPDATE transactions 
  SET 
    person = 'Anonimizado',
    description = 'Dados anonimizados por solicitação LGPD'
  WHERE client_id = client_uuid;
END;
$$ LANGUAGE plpgsql;
```
CREATE INDEX idx_account_mapping_original ON account_mapping(original_account);
```

## 7. Próximos Passos para Implementação

### 7.1 Configuração Inicial (Dias 1-2)
1. **Criar projeto no Supabase**
   - Configurar autenticação
   - Criar estrutura de banco de dados
   - Configurar políticas RLS

2. **Configurar Vercel**
   - Conectar repositório GitHub
   - Configurar variáveis de ambiente
   - Configurar domínio www.app.finup.com.br

### 7.2 Desenvolvimento (Dias 3-18)
1. **Frontend React + Supabase**
   - Integração com Supabase Auth
   - Implementação das telas principais
   - Sistema de upload de planilhas
   - Dashboards e relatórios

2. **Processamento de Dados**
   - Supabase Functions para ETL
   - Validação de planilhas (1.000-10.000 linhas)
   - Relatórios de erro detalhados

### 7.3 Testes e Deploy (Dias 19-21)
1. **Testes de Volume**
   - Importação de 10.000 linhas
   - Performance com múltiplos usuários
   - Isolamento entre clientes

2. **Documentação para Equipe Júnior**
   - Guias step-by-step
   - Troubleshooting comum
   - Compliance LGPD

### 7.4 Considerações Finais

#### Vantagens da Arquitetura Escolhida
- ✅ **Orçamento**: < $30/mês conforme especificado
- ✅ **Equipe júnior**: Documentação excelente e menos complexidade
- ✅ **Prazo**: 21 dias viável com menos configuração
- ✅ **Escalabilidade**: Pode crescer até 50 usuários facilmente
- ✅ **Segurança**: RLS automático garante isolamento
- ✅ **Compliance**: LGPD implementável
- ✅ **Backup**: Automático e confiável

#### Limitações Conhecidas
- ❌ **Relatórios agendados**: Não prioritário no MVP
- ❌ **Ambiente de homologação**: Opcional se orçamento permitir
- ❌ **Monitoramento avançado**: Básico no MVP

#### Próximas Evoluções (Pós-MVP)
- Relatórios agendados automáticos
- Integração com sistemas externos
- Notificações por email
- Monitoramento avançado
- Ambiente de homologação dedicado

### 6.3 Dados Iniciais

```sql
-- Inserir usuário super admin
INSERT INTO users (name, email, password_hash, role) VALUES 
('Super Admin', 'admin@finup.com.br', '$2b$12$...', 'super_admin');

-- Inserir cliente de exemplo
INSERT INTO clients (name, cnpj, email) VALUES 
('Empresa Exemplo LTDA', '12.345.678/0001-90', 'contato@exemplo.com.br');

-- Inserir plano de contas padrão
INSERT INTO chart_of_accounts (code, name, client_id, account_type) VALUES 
('1', 'ATIVO', (SELECT id FROM clients WHERE cnpj = '12.345.678/0001-90'), 'ativo'),
('2', 'PASSIVO', (SELECT id FROM clients WHERE cnpj = '12.345.678/0001-90'), 'passivo'),
('3', 'RECEITAS', (SELECT id FROM clients WHERE cnpj = '12.345.678/0001-90'), 'receita'),
('4', 'DESPESAS', (SELECT id FROM clients WHERE cnpj = '12.345.678/0001-90'), 'despesa');
```

## 7. Configurações de Segurança

### 7.1 Variáveis de Ambiente
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/finup_bi
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_FOLDER=/app/uploads

# Email (futuro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 7.2 Configurações de Segurança
- **Rate Limiting**: 100 requests/minuto por IP
- **CORS**: Apenas origens permitidas
- **JWT**: Tokens com expiração de 30 minutos
- **Passwords**: Hash com bcrypt (12 rounds)
- **File Upload**: Validação de tipo e tamanho
- **SQL Injection**: Queries parametrizadas via SQLAlchemy

## 8. Monitoramento e Logs

### 8.1 Logs Estruturados
```python
import structlog

logger = structlog.get_logger()

# Exemplo de uso
logger.info("User login", user_id=user.id, email=user.email)
logger.error("Database error", error=str(e), query=query)
```

### 8.2 Métricas
- **Response Time**: Tempo de resposta das APIs
- **Error Rate**: Taxa de erro por endpoint
- **Database Connections**: Conexões ativas
- **Memory Usage**: Uso de memória
- **Disk Space**: Espaço em disco

## 9. Estratégia de Backup

### 9.1 PostgreSQL
```bash
# Backup diário automático
pg_dump -h localhost -U user -d finup_bi > backup_$(date +%Y%m%d).sql

# Retenção: 30 dias
find /backups -name "backup_*.sql" -mtime +30 -delete
```

### 9.2 Arquivos Uploaded
```bash
# Sync para S3 ou similar
aws s3 sync /app/uploads s3://finup-bi-uploads/
```

## 10. Performance e Otimização

### 10.1 Cache Strategy
- **Redis**: Cache de sessões e dados frequentes
- **Application Cache**: Cache de queries pesadas
- **CDN**: Assets estáticos (futuro)

### 10.2 Database Optimization
- **Índices**: Em campos de busca frequente
- **Connection Pooling**: Pool de conexões
- **Query Optimization**: Análise de queries lentas

---

**Próximos Passos**: Implementar estrutura básica do FastAPI com autenticação JWT e conexão com PostgreSQL.