import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Icon from 'components/AppIcon';
import ClientSelector from './components/ClientSelector';
import AccountHierarchy from './components/AccountHierarchy';
import AccountModal from './components/AccountModal';
import AccountSearch from './components/AccountSearch';
import CostCenterList from './components/CostCenterList';
import CostCenterModal from './components/CostCenterModal';

/**
 * Página de Cadastro do Plano de Contas
 * 
 * Esta página permite que usuários internos (partner, staff, freelancer) gerenciem
 * o Plano de Contas específico de cada cliente com estrutura hierárquica de três níveis:
 * - Grupo (nível 1)
 * - SubGrupo (nível 2) 
 * - Conta (nível 3)
 * 
 * Funcionalidades principais:
 * - Seleção de cliente
 * - Visualização da hierarquia de contas
 * - Adição/edição/exclusão de grupos, subgrupos e contas
 * - Busca e filtros
 * - Validações de estrutura hierárquica
 */
const ChartOfAccounts = () => {
  const navigate = useNavigate();
  
  // Estados padrão
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('hierarchy'); // hierarchy, search, cost-centers
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  
  // Estados para Centros de Custo
  const [selectedCostCenter, setSelectedCostCenter] = useState(null);
  const [showCostCenterModal, setShowCostCenterModal] = useState(false);
  const [costCenterModalMode, setCostCenterModalMode] = useState('add');
  
  // Dados do usuário (mock)
  const user = {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@finupbi.com',
    systemRole: 'staff',
    avatar: '/avatars/joao.jpg',
    company: 'FinupBI'
  };
  
  // Dados mock de clientes disponíveis
  const [clients] = useState([
    {
      id: 1,
      name: 'Empresa Alpha Ltda',
      cnpj: '12.345.678/0001-90',
      status: 'active'
    },
    {
      id: 2,
      name: 'Corporação Beta S.A.',
      cnpj: '98.765.432/0001-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'Comércio Gamma ME',
      cnpj: '11.222.333/0001-44',
      status: 'active'
    }
  ]);
  
  // Dados mock do plano de contas
  const [chartOfAccounts, setChartOfAccounts] = useState({
    1: { // clientId
      groups: [
        {
          id: '1',
          code: '1',
          name: 'ATIVO',
          type: 'group',
          level: 1,
          parentId: null,
          subGroups: [
            {
              id: '1.1',
              code: '1.1',
              name: 'ATIVO CIRCULANTE',
              type: 'subgroup',
              level: 2,
              parentId: '1',
              accounts: [
                {
                  id: '1.1.1',
                  code: '1.1.1',
                  name: 'Caixa e Equivalentes',
                  type: 'account',
                  level: 3,
                  parentId: '1.1',
                  description: 'Disponibilidades em caixa e bancos'
                },
                {
                  id: '1.1.2',
                  code: '1.1.2',
                  name: 'Contas a Receber',
                  type: 'account',
                  level: 3,
                  parentId: '1.1',
                  description: 'Valores a receber de clientes'
                }
              ]
            },
            {
              id: '1.2',
              code: '1.2',
              name: 'ATIVO NÃO CIRCULANTE',
              type: 'subgroup',
              level: 2,
              parentId: '1',
              accounts: [
                {
                  id: '1.2.1',
                  code: '1.2.1',
                  name: 'Imobilizado',
                  type: 'account',
                  level: 3,
                  parentId: '1.2',
                  description: 'Bens de uso da empresa'
                }
              ]
            }
          ]
        },
        {
          id: '2',
          code: '2',
          name: 'PASSIVO',
          type: 'group',
          level: 1,
          parentId: null,
          subGroups: [
            {
              id: '2.1',
              code: '2.1',
              name: 'PASSIVO CIRCULANTE',
              type: 'subgroup',
              level: 2,
              parentId: '2',
              accounts: [
                {
                  id: '2.1.1',
                  code: '2.1.1',
                  name: 'Fornecedores',
                  type: 'account',
                  level: 3,
                  parentId: '2.1',
                  description: 'Valores a pagar para fornecedores'
                }
              ]
            }
          ]
        }
      ]
    }
  });
  
  // Dados mock de centros de custo
  const [costCenters, setCostCenters] = useState({
    1: [ // clientId
      {
        id: 1,
        code: 'CC001',
        name: 'Departamento Comercial',
        description: 'Centro de custo para atividades comerciais e vendas',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        code: 'CC002',
        name: 'Departamento Administrativo',
        description: 'Centro de custo para atividades administrativas',
        status: 'active',
        createdAt: '2024-01-16T14:30:00Z'
      },
      {
        id: 3,
        code: 'CC003',
        name: 'Departamento de TI',
        description: 'Centro de custo para tecnologia da informação',
        status: 'active',
        createdAt: '2024-01-17T09:15:00Z'
      },
      {
        id: 4,
        code: 'CC004',
        name: 'Departamento Financeiro',
        description: 'Centro de custo para atividades financeiras',
        status: 'inactive',
        createdAt: '2024-01-18T11:45:00Z'
      }
    ],
    2: [ // clientId
      {
        id: 5,
        code: 'CC001',
        name: 'Produção',
        description: 'Centro de custo para atividades de produção',
        status: 'active',
        createdAt: '2024-01-20T08:00:00Z'
      },
      {
        id: 6,
        code: 'CC002',
        name: 'Logística',
        description: 'Centro de custo para atividades logísticas',
        status: 'active',
        createdAt: '2024-01-21T13:20:00Z'
      }
    ],
    3: [ // clientId
      {
        id: 7,
        code: 'CC001',
        name: 'Vendas',
        description: 'Centro de custo para atividades de vendas',
        status: 'active',
        createdAt: '2024-01-22T16:10:00Z'
      }
    ]
  });
  
  // Handlers
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setActiveTab('hierarchy');
  };
  
  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };
  
  const handleAddAccount = () => {
    setSelectedAccount(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setModalMode('edit');
    setShowModal(true);
  };
  
  const handleSaveAccount = async (accountData) => {
    try {
      // Aqui você faria a chamada para a API
      console.log('Salvando conta:', accountData);
      
      // Simular salvamento
      if (modalMode === 'add') {
        // Adicionar nova conta
        console.log('Adicionando nova conta');
      } else {
        // Atualizar conta existente
        console.log('Atualizando conta existente');
      }
      
      setShowModal(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      throw error; // Re-throw para o modal tratar
    }
  };
  
  const handleDeleteAccount = async (accountId) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.')) {
      try {
        // Aqui você faria a chamada para a API
        console.log('Excluindo conta:', accountId);
        
        // Simular exclusão
        console.log('Conta excluída com sucesso');
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
        alert('Erro ao excluir conta. Tente novamente.');
      }
    }
  };
  
  const toggleGroupExpansion = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };
  
  // Handlers para Centros de Custo
  const handleAddCostCenter = () => {
    setSelectedCostCenter(null);
    setCostCenterModalMode('add');
    setShowCostCenterModal(true);
  };

  const handleEditCostCenter = (costCenter) => {
    setSelectedCostCenter(costCenter);
    setCostCenterModalMode('edit');
    setShowCostCenterModal(true);
  };
  
  const handleSaveCostCenter = async (costCenterData) => {
    try {
      if (costCenterModalMode === 'add') {
        // Simular adição de centro de custo
        const newCostCenter = {
          ...costCenterData,
          id: Date.now(), // ID temporário
          createdAt: new Date().toISOString()
        };
        
        // Atualizar estado local
        setCostCenters(prev => ({
          ...prev,
          [selectedClient.id]: [
            ...(prev[selectedClient.id] || []),
            newCostCenter
          ]
        }));
        
        console.log('Centro de custo adicionado:', newCostCenter);
      } else {
        // Simular edição de centro de custo
        setCostCenters(prev => ({
          ...prev,
          [selectedClient.id]: prev[selectedClient.id].map(cc => 
            cc.id === selectedCostCenter.id 
              ? { ...cc, ...costCenterData }
              : cc
          )
        }));
        
        console.log('Centro de custo atualizado:', costCenterData);
      }
      
      setShowCostCenterModal(false);
      setSelectedCostCenter(null);
    } catch (error) {
      console.error('Erro ao salvar centro de custo:', error);
      throw error; // Re-throw para o modal tratar
    }
  };
  
  const handleDeleteCostCenter = async (costCenterId) => {
    if (window.confirm('Tem certeza que deseja excluir este centro de custo? Esta ação não pode ser desfeita.')) {
      try {
        // Simular exclusão
        setCostCenters(prev => ({
          ...prev,
          [selectedClient.id]: prev[selectedClient.id].filter(cc => cc.id !== costCenterId)
        }));
        
        console.log('Centro de custo excluído:', costCenterId);
      } catch (error) {
        console.error('Erro ao excluir centro de custo:', error);
        alert('Erro ao excluir centro de custo. Tente novamente.');
      }
    }
  };
  
  // Obter dados do cliente selecionado
  const currentChartOfAccounts = selectedClient ? chartOfAccounts[selectedClient.id] : null;
  const currentCostCenters = selectedClient ? costCenters[selectedClient.id] || [] : [];
  
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
        userRole={user.systemRole}
      />
      <main className={`pt-header-height nav-transition ${
        sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar-width'
      }`}>
        <div className="p-6 space-y-6">
          {/* Cabeçalho da Página */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Plano de Contas
              </h1>
              <p className="text-text-secondary mt-1">
                Gerencie a estrutura hierárquica de contas de cada cliente
              </p>
            </div>
            
            {selectedClient && (
              <div className="flex items-center gap-3">
                {activeTab === 'hierarchy' && (
                  <button
                    onClick={handleAddAccount}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Icon name="Plus" size={16} />
                    Nova Conta
                  </button>
                )}
                {activeTab === 'cost-centers' && (
                  <button
                    onClick={handleAddCostCenter}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Icon name="Plus" size={16} />
                    Novo Centro de Custo
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Seletor de Cliente */}
          <div className="mb-6">
            <ClientSelector 
              clients={clients}
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
              userRole={user.systemRole}
            />
          </div>
          
          {/* Conteúdo Principal */}
          {selectedClient ? (
            <div className="space-y-6">
              {/* Navegação por Abas */}
              <div className="mb-6">
                <div className="border-b border-border">
                  <nav className="flex space-x-1">
                    {[
                      { id: 'hierarchy', label: 'Hierarquia de Contas', icon: 'TreePine' },
                      { id: 'search', label: 'Buscar Contas', icon: 'Search' },
                      { id: 'cost-centers', label: 'Centros de Custo', icon: 'Building2' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                        }`}
                      >
                        <Icon name={tab.icon} size={16} />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              
              {/* Conteúdo das Abas */}
              <div className="space-y-6">
                {activeTab === 'hierarchy' && (
                  <AccountHierarchy 
                    chartOfAccounts={currentChartOfAccounts}
                    selectedAccount={selectedAccount}
                    onAccountSelect={handleAccountSelect}
                    onEditAccount={handleEditAccount}
                    onDeleteAccount={handleDeleteAccount}
                    expandedGroups={expandedGroups}
                    onToggleGroup={toggleGroupExpansion}
                    loading={loading}
                  />
                )}
                
                {activeTab === 'search' && (
                  <AccountSearch 
                    chartOfAccounts={currentChartOfAccounts}
                    onAccountSelect={handleAccountSelect}
                    onEditAccount={handleEditAccount}
                    loading={loading}
                  />
                )}
                
                {activeTab === 'cost-centers' && (
                  <CostCenterList 
                    costCenters={currentCostCenters}
                    onEditCostCenter={handleEditCostCenter}
                    onDeleteCostCenter={handleDeleteCostCenter}
                    loading={loading}
                  />
                )}
              </div>
              
              {/* Modal de Formulário de Contas */}
              {showModal && (
                <AccountModal 
                  isOpen={showModal}
                  mode={modalMode}
                  account={selectedAccount}
                  chartOfAccounts={currentChartOfAccounts}
                  onSave={handleSaveAccount}
                  onClose={() => {
                    setShowModal(false);
                    setSelectedAccount(null);
                  }}
                />
              )}
              
              {/* Modal de Formulário de Centros de Custo */}
              {showCostCenterModal && (
                <CostCenterModal 
                  isOpen={showCostCenterModal}
                  mode={costCenterModalMode}
                  costCenter={selectedCostCenter}
                  existingCostCenters={currentCostCenters}
                  onSave={handleSaveCostCenter}
                  onClose={() => {
                    setShowCostCenterModal(false);
                    setSelectedCostCenter(null);
                  }}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Building" size={48} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Selecione um Cliente
              </h3>
              <p className="text-text-secondary">
                Escolha um cliente para visualizar e gerenciar seu Plano de Contas
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChartOfAccounts;