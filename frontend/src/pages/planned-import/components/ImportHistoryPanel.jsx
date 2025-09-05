import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Histórico de Importações de Planejamento
 * 
 * Exibe o histórico de importações de planejamento realizadas para o cliente selecionado,
 * incluindo filtros, busca e ações como retry e download de logs.
 * 
 * @param {Array} imports - Lista de importações de planejamento
 * @param {Function} onRetryImport - Callback para tentar novamente uma importação
 * @param {Function} onDownloadLog - Callback para baixar log de uma importação
 */
const ImportHistoryPanel = ({ imports = [], onRetryImport, onDownloadLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filtrar e ordenar importações
  const filteredImports = imports
    .filter(imp => {
      const matchesSearch = imp.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           imp.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || imp.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Tratar datas
      if (sortBy.includes('Date')) {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  
  // Paginação
  const totalPages = Math.ceil(filteredImports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImports = filteredImports.slice(startIndex, endIndex);
  
  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formatar tamanho do arquivo
  const formatFileSize = (sizeString) => {
    return sizeString || '-';
  };
  
  // Formatar valor monetário
  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Obter ícone e cor do status
  const getStatusInfo = (status) => {
    switch (status) {
      case 'success':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success/20',
          label: 'Sucesso'
        };
      case 'error':
        return {
          icon: 'XCircle',
          color: 'text-error',
          bg: 'bg-error/10',
          border: 'border-error/20',
          label: 'Erro'
        };
      case 'processing':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          label: 'Processando'
        };
      default:
        return {
          icon: 'Clock',
          color: 'text-text-secondary',
          bg: 'bg-text-secondary/10',
          border: 'border-text-secondary/20',
          label: 'Pendente'
        };
    }
  };
  
  // Resetar página quando filtros mudam
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);
  
  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="History" className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Histórico de Importações de Planejamento
            </h3>
            <p className="text-sm text-text-secondary">
              {filteredImports.length} de {imports.length} importação(ões) de planejamento
            </p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Buscar por nome do arquivo ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            >
              <option value="all">Todos os Status</option>
              <option value="success">Sucesso</option>
              <option value="error">Erro</option>
              <option value="processing">Processando</option>
            </select>
          </div>
          
          {/* Sort */}
          <div className="sm:w-48">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            >
              <option value="uploadDate-desc">Mais Recente</option>
              <option value="uploadDate-asc">Mais Antigo</option>
              <option value="fileName-asc">Nome A-Z</option>
              <option value="fileName-desc">Nome Z-A</option>
              <option value="status-asc">Status A-Z</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Import List */}
      <div className="divide-y divide-border">
        {currentImports.length > 0 ? (
          currentImports.map((importItem) => {
            const statusInfo = getStatusInfo(importItem.status);
            
            return (
              <div key={importItem.id} className="p-6 hover:bg-background transition-colors duration-200">
                <div className="flex items-start justify-between">
                  {/* Import Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="FileSpreadsheet" className="w-5 h-5 text-text-secondary" />
                      <h4 className="font-medium text-text-primary">
                        {importItem.importName || importItem.fileName}
                      </h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color} border`}>
                        <Icon name={statusInfo.icon} className={`w-3 h-3 ${importItem.status === 'processing' ? 'animate-spin' : ''}`} />
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    {importItem.importName && (
                      <div className="text-sm text-text-secondary mb-2">
                        <span className="font-medium">Arquivo:</span> {importItem.fileName}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-text-secondary">
                      <div>
                        <span className="font-medium">Tamanho:</span> {formatFileSize(importItem.fileSize)}
                      </div>
                      <div>
                        <span className="font-medium">Upload:</span> {formatDate(importItem.uploadDate)}
                      </div>
                      <div>
                        <span className="font-medium">Processado:</span> {formatDate(importItem.processedDate)}
                      </div>
                      <div>
                        <span className="font-medium">Por:</span> {importItem.uploadedBy}
                      </div>
                    </div>
                    
                    {/* Statistics */}
                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Icon name="CheckCircle" className="w-4 h-4 text-success" />
                        <span className="text-text-secondary">
                          {importItem.recordsProcessed?.toLocaleString('pt-BR') || 0} registros processados
                        </span>
                      </div>
                      {importItem.recordsErrors > 0 && (
                        <div className="flex items-center gap-1">
                          <Icon name="AlertCircle" className="w-4 h-4 text-error" />
                          <span className="text-text-secondary">
                            {importItem.recordsErrors.toLocaleString('pt-BR')} erros
                          </span>
                        </div>
                      )}
                      {importItem.totalPlannedValue && (
                        <div className="flex items-center gap-1">
                          <Icon name="DollarSign" className="w-4 h-4 text-info" />
                          <span className="text-text-secondary">
                            {formatCurrency(importItem.totalPlannedValue)} planejado
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Error Message */}
                    {importItem.status === 'error' && importItem.errorMessage && (
                      <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                        <p className="text-sm text-error">
                          <Icon name="AlertTriangle" className="w-4 h-4 inline mr-2" />
                          {importItem.errorMessage}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {importItem.status === 'error' && (
                      <button
                        onClick={() => onRetryImport(importItem.id)}
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                        title="Tentar Novamente"
                      >
                        <Icon name="RotateCcw" className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDownloadLog(importItem.id)}
                      className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      title="Baixar Log"
                    >
                      <Icon name="Download" className="w-4 h-4" />
                    </button>
                    
                    <button
                      className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      title="Mais Opções"
                    >
                      <Icon name="MoreVertical" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="p-12 text-center">
            <Icon name="FileX" className="w-16 h-16 text-text-disabled mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-secondary mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Nenhuma importação encontrada' : 'Nenhuma importação de planejamento realizada'}
            </h3>
            <p className="text-text-disabled">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'As importações de planejamento realizadas aparecerão aqui'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredImports.length)} de {filteredImports.length} importações
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Icon name="ChevronLeft" className="w-4 h-4" />
              </button>
              
              <span className="text-sm text-text-primary">
                {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Icon name="ChevronRight" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportHistoryPanel;