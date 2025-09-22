// 🔧 Configuração do Supabase Client - FinupBi
// Este arquivo configura a conexão com o Supabase

import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase vindas das variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Configurações do Supabase não encontradas! ' +
    'Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas.'
  )
}

// Criar cliente do Supabase com configurações otimizadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configurações de autenticação
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    
    // URLs de redirecionamento
    redirectTo: import.meta.env.VITE_REDIRECT_URL || window.location.origin,
  },
  
  // Configurações globais
  global: {
    headers: {
      'X-Client-Info': `${import.meta.env.VITE_APP_NAME || 'FinupBi'}@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    },
  },
  
  // Configurações de realtime (opcional)
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// 🔐 Funções de autenticação simplificadas
export const auth = {
  // Fazer login com email e senha
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Registrar novo usuário
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Nome, empresa, etc.
      },
    })
    return { data, error }
  },

  // Fazer logout
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obter usuário atual
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  // Obter sessão atual
  getSession: () => {
    return supabase.auth.getSession()
  },

  // Escutar mudanças de autenticação
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Resetar senha
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },
}

// 📊 Funções para operações com dados
export const database = {
  // Clientes
  clients: {
    // Listar todos os clientes do usuário
    list: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    // Buscar cliente por ID
    getById: async (id) => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    // Criar novo cliente
    create: async (clientData) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single()
      return { data, error }
    },

    // Atualizar cliente
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    // Deletar cliente
    delete: async (id) => {
      const { data, error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
      return { data, error }
    },
  },

  // Transações
  transactions: {
    // Listar transações do usuário
    list: async (filters = {}) => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          clients (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros se fornecidos
      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.startDate) {
        query = query.gte('transaction_date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('transaction_date', filters.endDate)
      }

      const { data, error } = await query
      return { data, error }
    },

    // Criar nova transação
    create: async (transactionData) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single()
      return { data, error }
    },

    // Atualizar transação
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    // Marcar como pago
    markAsPaid: async (id, paymentDate = new Date().toISOString().split('T')[0]) => {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          status: 'paid',
          payment_date: paymentDate,
        })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },
  },

  // Perfil do usuário
  profile: {
    // Obter perfil atual
    get: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single()
      return { data, error }
    },

    // Atualizar perfil
    update: async (updates) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .select()
        .single()
      return { data, error }
    },
  },
}

// 📈 Funções para relatórios e analytics
export const analytics = {
  // Dashboard - resumo geral
  getDashboardData: async () => {
    try {
      // Buscar dados em paralelo para melhor performance
      const [clientsResult, transactionsResult] = await Promise.all([
        database.clients.list(),
        database.transactions.list(),
      ])

      if (clientsResult.error || transactionsResult.error) {
        throw new Error('Erro ao buscar dados do dashboard')
      }

      const clients = clientsResult.data || []
      const transactions = transactionsResult.data || []

      // Calcular métricas
      const totalClients = clients.length
      const activeClients = clients.filter(c => c.status === 'active').length
      
      const totalRevenue = transactions
        .filter(t => t.type === 'sale' && t.status === 'paid')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
      
      const pendingAmount = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
      
      const overdueTransactions = transactions.filter(t => 
        t.status === 'overdue' || 
        (t.status === 'pending' && new Date(t.due_date) < new Date())
      )

      return {
        data: {
          totalClients,
          activeClients,
          totalRevenue,
          pendingAmount,
          overdueCount: overdueTransactions.length,
          recentTransactions: transactions.slice(0, 5),
        },
        error: null,
      }
    } catch (error) {
      return {
        data: null,
        error: error.message,
      }
    }
  },
}

// 🔄 Utilitários
export const utils = {
  // Verificar se está conectado
  isConnected: () => {
    return supabaseUrl && supabaseAnonKey
  },

  // Obter informações de conexão
  getConnectionInfo: () => {
    return {
      url: supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      environment: import.meta.env.MODE,
    }
  },
}

// Exportar cliente principal como default
export default supabase

// 🎯 Exemplo de uso:
/*
// Importar no componente
import { auth, database, analytics } from '@/config/supabase'

// Fazer login
const { data, error } = await auth.signIn('user@email.com', 'password')

// Listar clientes
const { data: clients } = await database.clients.list()

// Obter dados do dashboard
const { data: dashboardData } = await analytics.getDashboardData()
*/