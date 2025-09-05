import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import ClientSelector from './components/ClientSelector';
import ImportedAccountsPanel from './components/ImportedAccountsPanel';
import ChartOfAccountsPanel from './components/ChartOfAccountsPanel';
import MappingSuggestionsPanel from './components/MappingSuggestionsPanel';
import MappingProgressSummary from './components/MappingProgressSummary';
import BulkMappingBar from './components/BulkMappingBar';
import MappingWorkspace from './components/MappingWorkspace';
import MappingsList from './components/MappingsList';

/**
 * Página de Mapeamento DE/PARA de Contas
 * 
 * Esta página permite que usuários internos façam o mapeamento entre:
 * - Contas recebidas de importações (DE)
 * - Contas do Plano de Contas cadastrado no sistema (PARA)
 * 
 * Inspirada na estrutura da página de Conciliação Bancária
 */
const AccountMapping = () => {
  const navigate = useNavigate();
  
  // Estados principais da aplicação
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedImportedAccounts, setSelectedImportedAccounts] = useState([]);
  const [selectedChartAccounts, setSelectedChartAccounts] = useState([]);
  const [mappedAccounts, setMappedAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState('mapping'); // mapping, workspace, suggestions, history
  const [mappingProgress, setMappingProgress] = useState({
    total: 0,
    mapped: 0,
    pending: 0,
    percentage: 0
  });

  // Dados mock para desenvolvimento
  const user = {
    id: 1,
    name: 'João Silva',
    email: 'joao@finupbi.com',
    role: 'staff',
    avatar: null
  };

  // Handler para toggle do sidebar
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Clientes disponíveis (apenas para usuários internos)
  const mockClients = [
    {
      id: 1,
      name: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      status: 'active',
      lastImport: '2024-01-15',
      lastMappingUpdate: '2024-01-14',
      importedAccountsCount: 150,
      mappedAccountsCount: 120,
      mappingProgress: 80
    },
    {
      id: 2,
      name: 'Comércio XYZ S.A.',
      cnpj: '98.765.432/0001-10',
      status: 'active',
      lastImport: '2024-01-10',
      lastMappingUpdate: '2024-01-09',
      importedAccountsCount: 89,
      mappedAccountsCount: 45,
      mappingProgress: 51
    },
    {
      id: 3,
      name: 'Indústria DEF Ltda',
      cnpj: '11.222.333/0001-44',
      status: 'active',
      lastImport: '2024-01-12',
      lastMappingUpdate: null,
      importedAccountsCount: 200,
      mappedAccountsCount: 0,
      mappingProgress: 0
    }
  ];

  // Contas importadas (simulando dados de importação)
  const mockImportedAccounts = {
    1: [ // Cliente 1
      {
        id: 'imp_1',
        originalCode: 'RECEITA_VENDAS',
        originalName: 'Receita de Vendas de Produtos',
        importSource: 'Sistema ERP Legacy',
        importDate: '2024-01-15',
        frequency: 45, // quantas vezes aparece nos dados
        status: 'pending', // pending, mapped, ignored
        suggestedMapping: null
      },
      {
        id: 'imp_2',
        originalCode: 'CUSTO_MERCADORIA',
        originalName: 'Custo das Mercadorias Vendidas',
        importSource: 'Sistema ERP Legacy',
        importDate: '2024-01-15',
        frequency: 38,
        status: 'pending',
        suggestedMapping: null
      },
      {
        id: 'imp_3',
        originalCode: 'DESPESA_ADMINISTRATIVA',
        originalName: 'Despesas Administrativas Gerais',
        importSource: 'Sistema ERP Legacy',
        importDate: '2024-01-15',
        frequency: 22,
        status: 'mapped',
        suggestedMapping: 'chart_15'
      }
    ],
    2: [ // Cliente 2
      {
        id: 'imp_4',
        originalCode: 'REC_SERVICOS',
        originalName: 'Receita de Prestação de Serviços',
        importSource: 'Planilha Excel',
        importDate: '2024-01-10',
        frequency: 67,
        status: 'pending',
        suggestedMapping: null
      }
    ]
  };

  // Plano de Contas cadastrado no sistema (por cliente)
  const mockChartOfAccounts = {
    1: [ // Cliente 1
      {
        id: 'chart_1',
        code: '3.1.001',
        name: 'Receita Bruta de Vendas',
        type: 'receita',
        level: 3,
        parentId: 'chart_parent_1',
        status: 'active'
      },
      {
        id: 'chart_2',
        code: '3.1.002',
        name: 'Receita de Serviços',
        type: 'receita',
        level: 3,
        parentId: 'chart_parent_1',
        status: 'active'
      },
      {
        id: 'chart_15',
        code: '4.2.001',
        name: 'Despesas Administrativas',
        type: 'despesa',
        level: 3,
        parentId: 'chart_parent_4',
        status: 'active'
      }
    ],
    2: [ // Cliente 2
      {
        id: 'chart_20',
        code: '3.2.001',
        name: 'Receita de Prestação de Serviços',
        type: 'receita',
        level: 3,
        parentId: 'chart_parent_2',
        status: 'active'
      }
    ]
  };

  // Mapeamentos já realizados
  const mockMappings = {
    1: [
      {
        id: 'mapping_1',
        importedAccountId: 'imp_3',
        chartAccountId: 'chart_15',
        mappedBy: 'João Silva',
        mappedAt: '2024-01-16T10:30:00Z',
        confidence: 0.95,
        status: 'confirmed'
      }
    ]
  };

  // Efeito para calcular progresso do mapeamento
  useEffect(() => {
    if (selectedClient) {
      const importedAccounts = mockImportedAccounts[selectedClient.id] || [];
      const mappings = mockMappings[selectedClient.id] || [];
      
      const total = importedAccounts.length;
      const mapped = mappings.length;
      const pending = total - mapped;
      const percentage = total > 0 ? Math.round((mapped / total) * 100) : 0;
      
      setMappingProgress({ total, mapped, pending, percentage });
    }
  }, [selectedClient, mappedAccounts]);

  // Handlers para seleção de contas
  const handleImportedAccountSelect = (account) => {
    setSelectedImportedAccounts(prev => {
      const isSelected = prev.find(acc => acc.id === account.id);
      if (isSelected) {
        return prev.filter(acc => acc.id !== account.id);
      } else {
        return [...prev, account];
      }
    });
  };

  const handleChartAccountSelect = (account) => {
    setSelectedChartAccounts(prev => {
      const isSelected = prev.find(acc => acc.id === account.id);
      if (isSelected) {
        return prev.filter(acc => acc.id !== account.id);
      } else {
        return [...prev, account];
      }
    });
  };

  // Handler para criar mapeamento
  const handleCreateMapping = (importedAccount, chartAccount) => {
    const newMapping = {
      id: `mapping_${Date.now()}`,
      importedAccountId: importedAccount.id,
      chartAccountId: chartAccount.id,
      mappedBy: user.name,
      mappedAt: new Date().toISOString(),
      confidence: 1.0, // Mapeamento manual tem confiança máxima
      status: 'confirmed'
    };
    
    setMappedAccounts(prev => [...prev, newMapping]);
    
    // Limpar seleções após mapeamento
    setSelectedImportedAccounts([]);
    setSelectedChartAccounts([]);
  };

  // Handler para remover mapeamento
  const handleRemoveMapping = (mappingId) => {
    setMappedAccounts(prev => prev.filter(mapping => mapping.id !== mappingId));
  };

  // Obter dados do cliente selecionado
  const currentImportedAccounts = selectedClient ? mockImportedAccounts[selectedClient.id] || [] : [];
  const currentChartAccounts = selectedClient ? mockChartOfAccounts[selectedClient.id] || [] : [];
  const currentMappings = selectedClient ? mockMappings[selectedClient.id] || [] : [];

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
        userRole={user.role}
      />
      <main className={`
        pt-header-height nav-transition
        ${sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar-width'}
      `}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                  Mapeamento de Contas
                </h1>
                <p className="text-text-secondary">
                  Faça o mapeamento entre contas importadas e o Plano de Contas cadastrado
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-700 nav-transition">
                  <Icon name="Download" size={16} color="white" />
                  <span className="hidden sm:inline">Exportar Mapeamentos</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition">
                  <Icon name="Plus" size={16} color="white" />
                  <span className="hidden sm:inline">Novo Mapeamento</span>
                </button>
              </div>
            </div>
          </div>

          {/* Client Selector */}
          <div className="mb-6">
            <ClientSelector
              clients={mockClients}
              selectedClient={selectedClient}
              onClientSelect={setSelectedClient}
            />
          </div>

            {/* Conteúdo principal */}
            {selectedClient ? (
              <>
                {/* Progress Summary */}
                <div className="mb-6">
                  <MappingProgressSummary progress={mappingProgress} />
                </div>
                
                {/* Tab Navigation */}
                <div className="bg-surface rounded-lg border border-border overflow-hidden">
                  <div className="border-b border-border">
                    <nav className="flex overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('mapping')}
                        className={`
                          flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap nav-transition
                          ${activeTab === 'mapping'
                            ? 'text-primary border-b-2 border-primary bg-primary-50' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                          }
                        `}
                      >
                        <Icon 
                          name="ArrowLeftRight" 
                          size={16} 
                          color={activeTab === 'mapping' ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                        />
                        <span>Mapeamento Manual</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('workspace')}
                        className={`
                          flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap nav-transition
                          ${activeTab === 'workspace'
                            ? 'text-primary border-b-2 border-primary bg-primary-50' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                          }
                        `}
                      >
                        <Icon 
                          name="Layout" 
                          size={16} 
                          color={activeTab === 'workspace' ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                        />
                        <span>Área de Trabalho</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('suggestions')}
                        className={`
                          flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap nav-transition
                          ${activeTab === 'suggestions'
                            ? 'text-primary border-b-2 border-primary bg-primary-50' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                          }
                        `}
                      >
                        <Icon 
                          name="Lightbulb" 
                          size={16} 
                          color={activeTab === 'suggestions' ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                        />
                        <span>Sugestões Automáticas</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('history')}
                        className={`
                          flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap nav-transition
                          ${activeTab === 'history'
                            ? 'text-primary border-b-2 border-primary bg-primary-50' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                          }
                        `}
                      >
                        <Icon 
                          name="History" 
                          size={16} 
                          color={activeTab === 'history' ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                        />
                        <span>Histórico</span>
                      </button>
                    </nav>
                  </div>

                {/* Bulk Actions Bar */}
                {(selectedImportedAccounts.length > 0 || selectedChartAccounts.length > 0) && (
                  <div className="content-section">
                    <BulkMappingBar
                      selectedImportedAccounts={selectedImportedAccounts}
                      selectedChartAccounts={selectedChartAccounts}
                      onCreateMapping={handleCreateMapping}
                      onClearSelection={() => {
                        setSelectedImportedAccounts([]);
                        setSelectedChartAccounts([]);
                      }}
                    />
                  </div>
                )}

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'mapping' && (
                      <div className="grid-layout grid-cols-2">
                        <ImportedAccountsPanel
                          selectedClient={selectedClient}
                          accounts={currentImportedAccounts}
                          selectedAccounts={selectedImportedAccounts}
                          onAccountSelect={handleImportedAccountSelect}
                          mappings={currentMappings}
                        />
                        
                        <ChartOfAccountsPanel
                          selectedClient={selectedClient}
                          accounts={currentChartAccounts}
                          selectedAccounts={selectedChartAccounts}
                          onAccountSelect={handleChartAccountSelect}
                          mappings={currentMappings}
                        />
                      </div>
                    )}
                    
                    {activeTab === 'workspace' && (
                      <div className="full-width-content">
                        <MappingWorkspace
                          importedAccounts={currentImportedAccounts}
                          chartAccounts={currentChartAccounts}
                          existingMappings={currentMappings}
                          onCreateMapping={handleCreateMapping}
                          onRemoveMapping={handleRemoveMapping}
                        />
                      </div>
                    )}
                    
                    {activeTab === 'suggestions' && (
                      <div className="full-width-content">
                        <MappingSuggestionsPanel
                          importedAccounts={currentImportedAccounts}
                          chartAccounts={currentChartAccounts}
                          existingMappings={currentMappings}
                          onAcceptSuggestion={handleCreateMapping}
                        />
                      </div>
                    )}
                    
                    {activeTab === 'history' && (
                      <div className="full-width-content">
                        <MappingsList
                          mappings={currentMappings}
                          importedAccounts={currentImportedAccounts}
                          chartAccounts={currentChartAccounts}
                          onRemoveMapping={handleRemoveMapping}
                          onEditMapping={(mapping) => {
                            // Implementar edição de mapeamento
                            console.log('Editar mapeamento:', mapping);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="content-section">
                <div className="empty-state">
                  <Icon name="Users" size={48} color="var(--color-text-muted)" />
                  <h3 className="empty-state-title">
                    Nenhum cliente selecionado
                  </h3>
                  <p className="empty-state-description">
                    Escolha um cliente acima para visualizar e mapear as contas importadas
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
    </div>
  );
};

export default AccountMapping;