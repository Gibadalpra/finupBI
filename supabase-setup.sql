-- 🗄️ Script de Configuração do Banco de Dados - FinupBi MVP
-- Execute este script no SQL Editor do Supabase

-- ============================================================================
-- 1. CONFIGURAÇÃO DE AUTENTICAÇÃO
-- ============================================================================

-- Habilitar Row Level Security (RLS) para todas as tabelas
-- Isso garante que usuários só vejam seus próprios dados

-- ============================================================================
-- 2. TABELA DE PERFIS DE USUÁRIO
-- ============================================================================

-- Criar tabela de perfis (estende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver e editar apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- 3. TABELA DE CLIENTES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Dados básicos do cliente
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    document TEXT, -- CPF/CNPJ
    
    -- Endereço
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    
    -- Dados financeiros
    credit_limit DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes
CREATE POLICY "Users can view own clients" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON public.clients
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 4. TABELA DE TRANSAÇÕES/FATURAS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    
    -- Dados da transação
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('sale', 'payment', 'refund', 'adjustment')),
    
    -- Datas importantes
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    payment_date DATE,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para transações
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 5. ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índices para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients(name);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client_id ON public.transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_due_date ON public.transactions(due_date);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_date ON public.transactions(transaction_date);

-- ============================================================================
-- 6. FUNÇÕES E TRIGGERS
-- ============================================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ============================================================================

-- Função que cria perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 8. DADOS DE EXEMPLO (OPCIONAL - PARA TESTES)
-- ============================================================================

-- Inserir alguns dados de exemplo após fazer login
-- (Execute apenas após criar seu primeiro usuário)

/*
-- Exemplo de cliente (substitua USER_ID pelo seu ID real)
INSERT INTO public.clients (user_id, name, email, phone, document, credit_limit, risk_score) VALUES
('YOUR_USER_ID_HERE', 'João Silva', 'joao@email.com', '(11) 99999-9999', '123.456.789-00', 5000.00, 25);

-- Exemplo de transação
INSERT INTO public.transactions (user_id, client_id, description, amount, type, due_date, status) VALUES
('YOUR_USER_ID_HERE', 'CLIENT_ID_HERE', 'Venda de produtos', 1500.00, 'sale', CURRENT_DATE + INTERVAL '30 days', 'pending');
*/

-- ============================================================================
-- 9. CONFIGURAÇÕES DE AUTENTICAÇÃO
-- ============================================================================

-- Para configurar no painel do Supabase:
-- 1. Vá em Authentication > Settings
-- 2. Configure Site URL: https://your-frontend-url.vercel.app
-- 3. Configure Redirect URLs: https://your-frontend-url.vercel.app/**
-- 4. Habilite Email confirmations se desejar

-- ============================================================================
-- SCRIPT CONCLUÍDO! 
-- ============================================================================

-- ✅ Execute este script no SQL Editor do Supabase
-- ✅ Verifique se todas as tabelas foram criadas
-- ✅ Teste a autenticação no frontend
-- ✅ Adicione dados de exemplo se necessário