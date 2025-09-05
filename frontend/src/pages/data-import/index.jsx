import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ClientSelector from './components/ClientSelector';
import FileUploadPanel from './components/FileUploadPanel';
import DataPreviewPanel from './components/DataPreviewPanel';
import ImportHistoryPanel from './components/ImportHistoryPanel';
import ImportSummary from './components/ImportSummary';
import ProcessingModal from './components/ProcessingModal';

/**
 * Página de Importação de Dados
 * 
 * Esta página permite que usuários internos (partner, staff, freelancer) importem
 * arquivos XLS/CSV com layouts específicos para processamento pelo BI.
 * 
 * Funcionalidades principais:
 * - Seleção de cliente
 * - Upload de arquivos com validação
 * - Preview dos dados importados
 * - Histórico de importações
 * - Logs de processamento
 */
const DataImport = () => {
  // Estados do sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Estados da página
  const [selectedClient, setSelectedClient] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // upload, preview, history
  
  // Estados dos modais
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  
  // Dados mock do usuário atual (usuário interno)
  const currentUser = {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@finupbi.com',
    systemRole: 'staff', // partner, staff, freelancer
    avatar: null,
    company: 'FinupBI'
  };
  
  // Dados mock de clientes disponíveis
  const [clients] = useState([
    {
      id: 1,
      name: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      status: 'active'
    },
    {
      id: 2,
      name: 'Corporação XYZ S.A.',
      cnpj: '98.765.432/0001-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'Indústria DEF Ltda',
      cnpj: '11.222.333/0001-44',
      status: 'active'
    }
  ]);
  
  // Dados mock do histórico de importações
  const [importHistory] = useState([
    {
      id: 1,
      clientId: 1,
      clientName: 'Empresa ABC Ltda',
      fileName: 'dados_realizados_202401.xlsx',
      fileSize: '2.5 MB',
      uploadDate: '2024-01-15T10:30:00Z',
      processedDate: '2024-01-15T10:35:00Z',
      status: 'success',
      recordsProcessed: 1250,
      recordsErrors: 0,
      uploadedBy: 'João Silva'
    },
    {
      id: 2,
      clientId: 2,
      clientName: 'Corporação XYZ S.A.',
      fileName: 'realizados_dez2023.csv',
      fileSize: '1.8 MB',
      uploadDate: '2024-01-10T14:20:00Z',
      processedDate: '2024-01-10T14:25:00Z',
      status: 'success',
      recordsProcessed: 980,
      recordsErrors: 5,
      uploadedBy: 'Maria Santos'
    },
    {
      id: 3,
      clientId: 1,
      clientName: 'Empresa ABC Ltda',
      fileName: 'dados_nov2023.xlsx',
      fileSize: '3.2 MB',
      uploadDate: '2024-01-05T09:15:00Z',
      processedDate: null,
      status: 'error',
      recordsProcessed: 0,
      recordsErrors: 1500,
      uploadedBy: 'João Silva',
      errorMessage: 'Formato de data inválido na coluna C'
    }
  ]);
  
  // Handlers
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setUploadedFile(null);
    setPreviewData(null);
  };
  
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    // Simular processamento do arquivo para preview
    setTimeout(() => {
      setPreviewData({
        fileName: file.name,
        fileSize: file.size,
        totalRows: 1000,
        validRows: 950,
        errorRows: 50,
        columns: ['Data', 'Descrição', 'Valor', 'Categoria', 'Centro de Custo'],
        sampleData: [
          { data: '2024-01-01', descricao: 'Receita de Vendas', valor: 15000.00, categoria: 'Receita', centroCusto: 'Vendas' },
          { data: '2024-01-02', descricao: 'Despesa com Fornecedores', valor: -5000.00, categoria: 'Despesa', centroCusto: 'Compras' },
          { data: '2024-01-03', descricao: 'Pagamento de Salários', valor: -8000.00, categoria: 'Folha', centroCusto: 'RH' }
        ]
      });
      setActiveTab('preview');
    }, 2000);
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
    }, 5000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={currentUser} 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={currentUser?.systemRole}
      />
      <main className={`pt-header-height nav-transition ${
        sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar-width'
      }`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  Importação de Dados
                </h1>
                <p className="text-text-secondary">
                  Importe arquivos XLS ou CSV com dados realizados para processamento pelo BI
                </p>
              </div>
            </div>
          </div>
          
          {/* Client Selector */}
          <div className="mb-6">
            <ClientSelector 
              clients={clients}
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
            />
          </div>
          
          {/* Quick Actions - Moved to be right after Client Selector */}
          {selectedClient && (
            <div className="mb-6">
              <div className="bg-surface rounded-lg border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Zap" className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    Ações Rápidas
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button className="flex items-center gap-3 p-4 bg-background hover:bg-primary/5 border border-border hover:border-primary/20 rounded-lg transition-all duration-200 group">
                    <Icon name="Download" className="w-5 h-5 text-text-secondary group-hover:text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-text-primary">Baixar Template</p>
                      <p className="text-sm text-text-secondary">Modelo de arquivo para importação</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 bg-background hover:bg-primary/5 border border-border hover:border-primary/20 rounded-lg transition-all duration-200 group">
                    <Icon name="FileText" className="w-5 h-5 text-text-secondary group-hover:text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-text-primary">Ver Documentação</p>
                      <p className="text-sm text-text-secondary">Guia de importação de dados</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 bg-background hover:bg-primary/5 border border-border hover:border-primary/20 rounded-lg transition-all duration-200 group">
                    <Icon name="BarChart3" className="w-5 h-5 text-text-secondary group-hover:text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-text-primary">Relatório Completo</p>
                      <p className="text-sm text-text-secondary">Análise detalhada das importações</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Import Summary - Now without Quick Actions */}
          {selectedClient && (
            <div className="mb-6">
              <ImportSummary 
                client={selectedClient}
                recentImports={importHistory.filter(imp => imp.clientId === selectedClient.id).slice(0, 3)}
                hideQuickActions={true}
              />
            </div>
          )}
          
          {/* Tab Navigation */}
          {selectedClient && (
            <div className="mb-6">
              <div className="flex bg-surface rounded-lg p-1 border border-border w-fit">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`py-2 px-4 rounded-md text-sm font-medium nav-transition ${
                    activeTab === 'upload' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name="Upload" className="w-4 h-4 mr-2" />
                  Upload de Arquivo
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  disabled={!previewData}
                  className={`py-2 px-4 rounded-md text-sm font-medium nav-transition ${
                    activeTab === 'preview' ? 'bg-primary text-white' : 
                    previewData ? 'text-text-secondary hover:text-text-primary' : 'text-text-disabled cursor-not-allowed'
                  }`}
                >
                  <Icon name="Eye" className="w-4 h-4 mr-2" />
                  Preview dos Dados
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-4 rounded-md text-sm font-medium nav-transition ${
                    activeTab === 'history' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name="History" className="w-4 h-4 mr-2" />
                  Histórico
                </button>
              </div>
            </div>
          )}
          
          {/* Content Panels */}
          {selectedClient && (
            <div className="space-y-6">
              {/* File Upload Panel */}
              {activeTab === 'upload' && (
                <FileUploadPanel 
                  onFileUpload={handleFileUpload}
                  isProcessing={isProcessing}
                  acceptedFormats={['.xlsx', '.xls', '.csv']}
                  maxFileSize={10} // MB
                />
              )}
              
              {/* Data Preview Panel */}
              {activeTab === 'preview' && previewData && (
                <DataPreviewPanel 
                  data={previewData}
                  onProcessImport={handleProcessImport}
                  isProcessing={isProcessing}
                />
              )}
              
              {/* Import History Panel */}
              {activeTab === 'history' && (
                <ImportHistoryPanel 
                  imports={importHistory.filter(imp => imp.clientId === selectedClient.id)}
                  onRetryImport={(importId) => console.log('Retry import:', importId)}
                  onDownloadLog={(importId) => console.log('Download log:', importId)}
                />
              )}
            </div>
          )}
          
          {/* Empty State */}
          {!selectedClient && (
            <div className="text-center py-12">
              <Icon name="Building2" className="w-16 h-16 text-text-disabled mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-secondary mb-2">
                Selecione um Cliente
              </h3>
              <p className="text-text-disabled">
                Escolha um cliente para começar a importação de dados
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Processing Modal */}
      {showProcessingModal && (
        <ProcessingModal 
          isOpen={showProcessingModal}
          onClose={() => setShowProcessingModal(false)}
          fileName={uploadedFile?.name}
          progress={75} // Simulated progress
        />
      )}
    </div>
  );
};

export default DataImport;