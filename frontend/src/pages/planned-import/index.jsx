import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import ClientSelector from './components/ClientSelector';
import FileUploadPanel from './components/FileUploadPanel';
import DataPreviewPanel from './components/DataPreviewPanel';
import ImportHistoryPanel from './components/ImportHistoryPanel';
import ImportSummary from './components/ImportSummary';
import ProcessingModal from './components/ProcessingModal';

/**
 * Página de Importação do Planejado
 * 
 * Esta página permite que usuários internos (partner, staff, freelancer) importem
 * arquivos XLS/CSV com dados de planejamento financeiro para processamento pelo BI.
 * 
 * Funcionalidades principais:
 * - Seleção de cliente
 * - Upload de arquivos de planejamento com validação
 * - Preview dos dados de planejamento importados
 * - Histórico de importações de planejamento
 * - Logs de processamento específicos para planejamento
 */
const PlannedImport = () => {
  const navigate = useNavigate();
  
  // Estados padrão
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  
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
      status: 'active',
      lastPlanImport: '2024-01-15T10:30:00Z',
      planImportCount: 12
    },
    {
      id: 2,
      name: 'Beta Comércio S.A.',
      cnpj: '98.765.432/0001-10',
      status: 'active',
      lastPlanImport: '2024-01-10T14:20:00Z',
      planImportCount: 8
    },
    {
      id: 3,
      name: 'Gamma Serviços ME',
      cnpj: '11.222.333/0001-44',
      status: 'active',
      lastPlanImport: null,
      planImportCount: 0
    }
  ]);
  
  // Dados mock do histórico de importações de planejamento
  const [importHistory] = useState([
    {
      id: 'PLN-2024-001',
      clientId: 1,
      clientName: 'Empresa Alpha Ltda',
      importName: 'Planejado 2024',
      fileName: 'planejamento_2024_q1.xlsx',
      uploadDate: '2024-01-15T10:30:00Z',
      status: 'completed',
      recordsProcessed: 245,
      recordsValid: 240,
      recordsInvalid: 5,
      planPeriod: '2024-Q1',
      planType: 'Orçamento Anual',
      processedBy: 'João Silva',
      importId: 'PLN-2024-001'
    },
    {
      id: 'PLN-2024-002',
      clientId: 2,
      clientName: 'Beta Comércio S.A.',
      importName: 'Revisão 1º Trimestre',
      fileName: 'orcamento_mensal_jan2024.csv',
      uploadDate: '2024-01-10T14:20:00Z',
      status: 'completed',
      recordsProcessed: 180,
      recordsValid: 175,
      recordsInvalid: 5,
      planPeriod: '2024-01',
      planType: 'Orçamento Mensal',
      processedBy: 'Maria Santos',
      importId: 'PLN-2024-002'
    },
    {
      id: 'PLN-2024-003',
      clientId: 1,
      clientName: 'Empresa Alpha Ltda',
      importName: 'Projeção Anual 2024',
      fileName: 'projecao_receitas_2024.xlsx',
      uploadDate: '2024-01-08T09:15:00Z',
      status: 'failed',
      recordsProcessed: 0,
      recordsValid: 0,
      recordsInvalid: 0,
      planPeriod: '2024',
      planType: 'Projeção de Receitas',
      processedBy: 'João Silva',
      importId: 'PLN-2024-003',
      errorMessage: 'Formato de arquivo inválido. Esperado: XLS/CSV com colunas específicas de planejamento.'
    }
  ]);
  
  // Handlers padrão
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setUploadedFile(null);
    setPreviewData(null);
    setActiveTab('upload');
    setSelectedItems([]);
  };
  
  const handleFileUpload = (file, importName) => {
    setUploadedFile(file);
    // Gerar ID único para a importação
    const importId = `PLN-${new Date().getFullYear()}-${String(importHistory.length + 1).padStart(3, '0')}`;
    
    // Simular preview dos dados de planejamento
    const mockPlanData = {
      importId,
      importName: importName || `Importação ${new Date().toLocaleDateString('pt-BR')}`,
      fileName: file.name,
      totalRecords: 150,
      validRecords: 145,
      invalidRecords: 5,
      planPeriod: '2024-Q2',
      planType: 'Orçamento Trimestral',
      columns: ['Conta', 'Descrição', 'Valor Planejado', 'Período', 'Centro de Custo', 'Categoria'],
      sampleData: [
        { conta: '1.1.01.001', descricao: 'Receita de Vendas', valorPlanejado: 50000, periodo: '2024-04', centroCusto: 'Vendas', categoria: 'Receita' },
        { conta: '3.1.01.001', descricao: 'Salários e Encargos', valorPlanejado: -15000, periodo: '2024-04', centroCusto: 'Administrativo', categoria: 'Despesa' },
        { conta: '3.2.01.001', descricao: 'Marketing Digital', valorPlanejado: -5000, periodo: '2024-04', centroCusto: 'Marketing', categoria: 'Despesa' }
      ]
    };
    setPreviewData(mockPlanData);
    setActiveTab('preview');
  };
  
  const handleProcessImport = () => {
    setIsProcessing(true);
    setShowProcessingModal(true);
    
    // Simular processamento
    setTimeout(() => {
      setIsProcessing(false);
      setShowProcessingModal(false);
      setActiveTab('history');
      // Aqui você adicionaria o novo registro ao histórico
    }, 3000);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
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
        <div className="p-6 space-y-6">
          {/* Cabeçalho da Página */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  Importação do Planejado
                </h1>
                <p className="text-text-secondary">
                  Importe arquivos de planejamento financeiro (orçamentos, projeções, metas) para análise no BI.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition flex items-center space-x-2">
                  <Icon name="Download" size={16} color="#2c3e50" />
                  <span>Exportar Histórico</span>
                </button>
                
                <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-700 nav-transition flex items-center space-x-2">
                  <Icon name="RefreshCw" size={16} color="white" />
                  <span>Sincronizar</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="FileText" size={16} color="#7f8c8d" />
                <span className="text-sm text-text-secondary">Total de Clientes</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{clients.length}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Upload" size={16} color="#4a90a4" />
                <span className="text-sm text-text-secondary">Importações</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{importHistory.length}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="CheckCircle" size={16} color="#27ae60" />
                <span className="text-sm text-text-secondary">Concluídas</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{importHistory.filter(item => item.status === 'completed').length}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Clock" size={16} color="#f39c12" />
                <span className="text-sm text-text-secondary">Pendentes</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{importHistory.filter(item => item.status === 'pending').length}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="AlertCircle" size={16} color="#e74c3c" />
                <span className="text-sm text-text-secondary">Com Erro</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{importHistory.filter(item => item.status === 'failed').length}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Database" size={16} color="#4a90a4" />
                <span className="text-sm text-text-secondary">Registros</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{importHistory.reduce((acc, item) => acc + item.recordsProcessed, 0)}</p>
            </div>
          </div>

          {/* Seletor de Cliente */}
          <div className="mb-6">
            <ClientSelector 
              clients={clients}
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
              userRole={user.systemRole}
              importType="planejamento"
            />
          </div>
          
          {/* Resumo de Importações */}
          {selectedClient && (
            <div className="mb-6">
              <ImportSummary 
                client={selectedClient}
                importHistory={importHistory.filter(item => item.clientId === selectedClient.id)}
                importType="planejamento"
              />
            </div>
          )}
          
          {/* Conteúdo Principal */}
          {selectedClient ? (
            <div className="space-y-6">
              {/* Navegação por Abas */}
              <div className="mb-6">
                <div className="border-b border-border">
                  <nav className="flex space-x-1">
                    {[
                      { id: 'upload', label: 'Upload de Planejamento', icon: 'Upload' },
                      { id: 'preview', label: 'Preview dos Dados', icon: 'Eye' },
                      { id: 'history', label: 'Histórico', icon: 'Clock' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        disabled={tab.id === 'preview' && !previewData}
                        className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg border-t border-l border-r transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-surface border-border text-text-primary border-b-surface -mb-px'
                            : 'bg-background border-transparent text-text-secondary hover:text-text-primary hover:bg-surface/50'
                        }`}
                      >
                        <Icon name={tab.icon} size={16} />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              
              {/* Painéis de Conteúdo */}
              <div className="bg-surface border border-border rounded-lg">
                {activeTab === 'upload' && (
                  <div className="p-6">
                    <FileUploadPanel 
                      onFileUpload={handleFileUpload}
                      uploadedFile={uploadedFile}
                      isProcessing={isProcessing}
                      importType="planejamento"
                    />
                  </div>
                )}
                
                {activeTab === 'preview' && previewData && (
                  <div className="p-6">
                    <DataPreviewPanel 
                      data={previewData}
                      onProcessImport={handleProcessImport}
                      isProcessing={isProcessing}
                      importType="planejamento"
                    />
                  </div>
                )}
                
                {activeTab === 'history' && (
                  <div className="p-6">
                    <ImportHistoryPanel 
                      history={importHistory.filter(item => item.clientId === selectedClient.id)}
                      importType="planejamento"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon 
                name="building-2" 
                className="w-16 h-16 text-muted-foreground mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Selecione um Cliente
              </h3>
              <p className="text-muted-foreground">
                Escolha um cliente para começar a importação de dados de planejamento.
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Modal de Processamento */}
      {showProcessingModal && (
        <ProcessingModal 
          isOpen={showProcessingModal}
          progress={65} // Simulado
          currentStep="Validando dados de planejamento..."
          importType="planejamento"
        />
      )}
    </div>
  );
};

export default PlannedImport;