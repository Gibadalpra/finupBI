import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import BankTransactionsPanel from './components/BankTransactionsPanel';
import MatchSuggestionsPanel from './components/MatchSuggestionsPanel';
import RecordedTransactionsPanel from './components/RecordedTransactionsPanel';
import ReconciliationSummary from './components/ReconciliationSummary';
import BulkActionsBar from './components/BulkActionsBar';

const BankReconciliation = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedBankTransactions, setSelectedBankTransactions] = useState([]);
  const [selectedRecordedTransactions, setSelectedRecordedTransactions] = useState([]);
  const [matchedTransactions, setMatchedTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('bank'); // For mobile view
  const [reconciliationProgress, setReconciliationProgress] = useState(0);

  // Mock user data
  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@accountingpro.com",
    role: "Contador Sênior"
  };

  // Mock bank transactions data
  const bankTransactions = [
    {
      id: 'bank_001',
      date: '2024-01-15',
      description: 'PAGAMENTO DE ACME CORP',
      amount: 2500.00,
      type: 'credit',
      reference: 'TXN123456',
      balance: 15750.00,
      matched: false,
      confidence: null
    },
    {
      id: 'bank_002',
      date: '2024-01-14',
      description: 'MATERIAL DE ESCRITÓRIO - STAPLES',
      amount: -125.50,
      type: 'debit',
      reference: 'TXN123455',
      balance: 13250.00,
      matched: false,
      confidence: 0.85
    },
    {
      id: 'bank_003',
      date: '2024-01-13',
      description: 'PAGAMENTO SALÁRIO - J.SMITH',
      amount: -3200.00,
      type: 'debit',
      reference: 'TXN123454',
      balance: 13375.50,
      matched: false,
      confidence: 0.92
    },
    {
      id: 'bank_004',
      date: '2024-01-12',
      description: 'PAGAMENTO CLIENTE - TECH SOLUTIONS',
      amount: 1800.00,
      type: 'credit',
      reference: 'TXN123453',
      balance: 16575.50,
      matched: false,
      confidence: 0.78
    },
    {
      id: 'bank_005',
      date: '2024-01-11',
      description: 'CONTA DE LUZ - COMPANHIA ELÉTRICA',
      amount: -245.75,
      type: 'debit',
      reference: 'TXN123452',
      balance: 14775.50,
      matched: false,
      confidence: 0.95
    }
  ];

  // Mock recorded transactions data
  const recordedTransactions = [
    {
      id: 'rec_001',
      date: '2024-01-15',
      description: 'Pagamento de Fatura - ACME Corporation',
      amount: 2500.00,
      type: 'credit',
      account: 'Contas a Receber',
      reference: 'INV-2024-001',
      matched: false,
      confidence: null
    },
    {
      id: 'rec_002',
      date: '2024-01-14',
      description: 'Compra de Material de Escritório',
      amount: -125.50,
      type: 'debit',
      account: 'Despesas de Escritório',
      reference: 'EXP-2024-015',
      matched: false,
      confidence: 0.85
    },
    {
      id: 'rec_003',
      date: '2024-01-13',
      description: 'Pagamento de Salário - John Smith',
      amount: -3200.00,
      type: 'debit',
      account: 'Despesas de Folha de Pagamento',
      reference: 'PAY-2024-003',
      matched: false,
      confidence: 0.92
    },
    {
      id: 'rec_004',
      date: '2024-01-12',
      description: 'Receita de Serviços - Tech Solutions Ltda',
      amount: 1800.00,
      type: 'credit',
      account: 'Receita de Serviços',
      reference: 'INV-2024-002',
      matched: false,
      confidence: 0.78
    },
    {
      id: 'rec_005',
      date: '2024-01-11',
      description: 'Pagamento de Conta de Energia',
      amount: -245.75,
      type: 'debit',
      account: 'Despesas de Utilidades',
      reference: 'UTIL-2024-001',
      matched: false,
      confidence: 0.95
    }
  ];

  // Mock suggested matches
  const suggestedMatches = [
    {
      id: 'match_001',
      bankTransaction: bankTransactions?.[0],
      recordedTransaction: recordedTransactions?.[0],
      confidence: 0.98,
      matchReason: 'Valor e data exatos coincidem',
      status: 'suggested'
    },
    {
      id: 'match_002',
      bankTransaction: bankTransactions?.[1],
      recordedTransaction: recordedTransactions?.[1],
      confidence: 0.85,
      matchReason: 'Valor coincide, descrição similar',
      status: 'suggested'
    },
    {
      id: 'match_003',
      bankTransaction: bankTransactions?.[2],
      recordedTransaction: recordedTransactions?.[2],
      confidence: 0.92,
      matchReason: 'Valor e data coincidem',
      status: 'suggested'
    }
  ];

  // Calculate reconciliation progress
  useEffect(() => {
    const totalTransactions = bankTransactions?.length;
    const matchedCount = matchedTransactions?.length;
    const progress = totalTransactions > 0 ? (matchedCount / totalTransactions) * 100 : 0;
    setReconciliationProgress(progress);
  }, [matchedTransactions]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleBankTransactionSelect = (transactionId) => {
    setSelectedBankTransactions(prev => 
      prev?.includes(transactionId) 
        ? prev?.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleRecordedTransactionSelect = (transactionId) => {
    setSelectedRecordedTransactions(prev => 
      prev?.includes(transactionId) 
        ? prev?.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleMatchAccept = (matchId) => {
    const match = suggestedMatches?.find(m => m?.id === matchId);
    if (match) {
      setMatchedTransactions(prev => [...prev, { ...match, status: 'accepted' }]);
    }
  };

  const handleMatchReject = (matchId) => {
    console.log('Rejeitando correspondência:', matchId);
  };

  const handleBulkAccept = () => {
    const highConfidenceMatches = suggestedMatches?.filter(match => match?.confidence >= 0.9);
    setMatchedTransactions(prev => [
      ...prev, 
      ...highConfidenceMatches?.map(match => ({ ...match, status: 'accepted' }))
    ]);
  };

  const handleManualMatch = () => {
    if (selectedBankTransactions?.length === 1 && selectedRecordedTransactions?.length === 1) {
      const bankTxn = bankTransactions?.find(t => t?.id === selectedBankTransactions?.[0]);
      const recordedTxn = recordedTransactions?.find(t => t?.id === selectedRecordedTransactions?.[0]);
      
      if (bankTxn && recordedTxn) {
        const manualMatch = {
          id: `manual_${Date.now()}`,
          bankTransaction: bankTxn,
          recordedTransaction: recordedTxn,
          confidence: 1.0,
          matchReason: 'Correspondência manual pelo usuário',
          status: 'manual'
        };
        
        setMatchedTransactions(prev => [...prev, manualMatch]);
        setSelectedBankTransactions([]);
        setSelectedRecordedTransactions([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onMenuToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        userRole="staff"
      />
      <main className={`pt-header-height nav-transition ${
        sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar-width'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  Conciliação Bancária
                </h1>
                <p className="text-text-secondary">
                  Concilie transações bancárias com lançamentos registrados para garantir precisão
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-700 nav-transition">
                  <Icon name="Download" size={16} color="white" />
                  <span>Importar Extrato Bancário</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition">
                  <Icon name="RefreshCw" size={16} color="white" />
                  <span>Sincronizar Feed Bancário</span>
                </button>
              </div>
            </div>

            {/* Reconciliation Summary */}
            <ReconciliationSummary 
              progress={reconciliationProgress}
              totalTransactions={bankTransactions?.length}
              matchedCount={matchedTransactions?.length}
              suggestedCount={suggestedMatches?.length}
            />
          </div>

          {/* Bulk Actions Bar */}
          <BulkActionsBar 
            selectedBankCount={selectedBankTransactions?.length}
            selectedRecordedCount={selectedRecordedTransactions?.length}
            onBulkAccept={handleBulkAccept}
            onManualMatch={handleManualMatch}
            canManualMatch={selectedBankTransactions?.length === 1 && selectedRecordedTransactions?.length === 1}
          />

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-6">
            <div className="flex bg-surface rounded-lg p-1 border border-border">
              <button
                onClick={() => setActiveTab('bank')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium nav-transition ${
                  activeTab === 'bank' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Transações Bancárias
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium nav-transition ${
                  activeTab === 'suggestions' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sugestões
              </button>
              <button
                onClick={() => setActiveTab('recorded')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium nav-transition ${
                  activeTab === 'recorded' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Registradas
              </button>
            </div>
          </div>

          {/* Three-Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bank Transactions Panel */}
            <div className={`${activeTab === 'bank' ? 'block' : 'hidden'} lg:block`}>
              <BankTransactionsPanel 
                transactions={bankTransactions}
                selectedTransactions={selectedBankTransactions}
                onTransactionSelect={handleBankTransactionSelect}
              />
            </div>

            {/* Match Suggestions Panel */}
            <div className={`${activeTab === 'suggestions' ? 'block' : 'hidden'} lg:block`}>
              <MatchSuggestionsPanel 
                suggestions={suggestedMatches}
                onMatchAccept={handleMatchAccept}
                onMatchReject={handleMatchReject}
              />
            </div>

            {/* Recorded Transactions Panel */}
            <div className={`${activeTab === 'recorded' ? 'block' : 'hidden'} lg:block`}>
              <RecordedTransactionsPanel 
                transactions={recordedTransactions}
                selectedTransactions={selectedRecordedTransactions}
                onTransactionSelect={handleRecordedTransactionSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BankReconciliation;