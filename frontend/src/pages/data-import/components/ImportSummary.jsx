import React from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Resumo de Importações
 * 
 * Exibe estatísticas e métricas das importações realizadas,
 * incluindo totais, taxas de sucesso e tendências.
 * 
 * @param {Array} imports - Lista de importações para calcular estatísticas
 * @param {Object} selectedClient - Cliente selecionado
 */
const ImportSummary = ({ imports = [], selectedClient, hideQuickActions = false }) => {
  // Calcular estatísticas
  const stats = React.useMemo(() => {
    const total = imports.length;
    const successful = imports.filter(imp => imp.status === 'success').length;
    const failed = imports.filter(imp => imp.status === 'error').length;
    const processing = imports.filter(imp => imp.status === 'processing').length;
    
    const totalRecords = imports.reduce((sum, imp) => sum + (imp.recordsProcessed || 0), 0);
    const totalErrors = imports.reduce((sum, imp) => sum + (imp.recordsErrors || 0), 0);
    
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    const errorRate = totalRecords > 0 ? (totalErrors / totalRecords) * 100 : 0;
    
    // Estatísticas dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentImports = imports.filter(imp => 
      new Date(imp.uploadDate) >= thirtyDaysAgo
    );
    
    const recentTotal = recentImports.length;
    const recentSuccessful = recentImports.filter(imp => imp.status === 'success').length;
    
    return {
      total,
      successful,
      failed,
      processing,
      totalRecords,
      totalErrors,
      successRate,
      errorRate,
      recentTotal,
      recentSuccessful,
      recentSuccessRate: recentTotal > 0 ? (recentSuccessful / recentTotal) * 100 : 0
    };
  }, [imports]);
  
  // Obter importação mais recente
  const lastImport = React.useMemo(() => {
    if (imports.length === 0) return null;
    return imports.reduce((latest, current) => {
      const latestDate = new Date(latest.uploadDate || 0);
      const currentDate = new Date(current.uploadDate || 0);
      return currentDate > latestDate ? current : latest;
    });
  }, [imports]);
  
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
  
  // Obter cor baseada na taxa de sucesso
  const getSuccessRateColor = (rate) => {
    if (rate >= 95) return 'text-success';
    if (rate >= 80) return 'text-warning';
    return 'text-error';
  };
  
  return (
    <div className="space-y-6">
      {/* Client Info */}
      {selectedClient && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Building2" className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {selectedClient.name}
              </h3>
              <p className="text-sm text-text-secondary">
                CNPJ: {selectedClient.cnpj}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Segmento:</span>
              <p className="font-medium text-text-primary">{selectedClient.segment}</p>
            </div>
            <div>
              <span className="text-text-secondary">Status:</span>
              <p className="font-medium text-success">{selectedClient.status}</p>
            </div>
            <div>
              <span className="text-text-secondary">Última Importação:</span>
              <p className="font-medium text-text-primary">
                {lastImport ? formatDate(lastImport.uploadDate) : 'Nunca'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Imports */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="Upload" className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-text-primary">
              {stats.total.toLocaleString('pt-BR')}
            </span>
          </div>
          <h4 className="font-medium text-text-primary mb-1">Total de Importações</h4>
          <p className="text-sm text-text-secondary">
            {stats.recentTotal} nos últimos 30 dias
          </p>
        </div>
        
        {/* Success Rate */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <Icon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
            <span className={`text-2xl font-bold ${getSuccessRateColor(stats.successRate)}`}>
              {stats.successRate.toFixed(1)}%
            </span>
          </div>
          <h4 className="font-medium text-text-primary mb-1">Taxa de Sucesso</h4>
          <p className="text-sm text-text-secondary">
            {stats.successful} de {stats.total} importações
          </p>
        </div>
        
        {/* Total Records */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-info/10 rounded-lg">
              <Icon name="Database" className="w-6 h-6 text-info" />
            </div>
            <span className="text-2xl font-bold text-text-primary">
              {stats.totalRecords.toLocaleString('pt-BR')}
            </span>
          </div>
          <h4 className="font-medium text-text-primary mb-1">Registros Processados</h4>
          <p className="text-sm text-text-secondary">
            {stats.totalErrors.toLocaleString('pt-BR')} com erro ({stats.errorRate.toFixed(1)}%)
          </p>
        </div>
        
        {/* Processing */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Icon name="Loader2" className={`w-6 h-6 text-warning ${stats.processing > 0 ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-2xl font-bold text-text-primary">
              {stats.processing.toLocaleString('pt-BR')}
            </span>
          </div>
          <h4 className="font-medium text-text-primary mb-1">Em Processamento</h4>
          <p className="text-sm text-text-secondary">
            {stats.failed} falharam
          </p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Activity" className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">
            Atividade Recente
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Stats */}
          <div>
            <h4 className="font-medium text-text-primary mb-4">Últimos 30 Dias</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Upload" className="w-5 h-5 text-primary" />
                  <span className="text-text-primary">Importações</span>
                </div>
                <span className="font-semibold text-text-primary">
                  {stats.recentTotal}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="CheckCircle" className="w-5 h-5 text-success" />
                  <span className="text-text-primary">Taxa de Sucesso</span>
                </div>
                <span className={`font-semibold ${getSuccessRateColor(stats.recentSuccessRate)}`}>
                  {stats.recentSuccessRate.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="TrendingUp" className="w-5 h-5 text-info" />
                  <span className="text-text-primary">Tendência</span>
                </div>
                <span className="font-semibold text-success">
                  {stats.recentSuccessRate > stats.successRate ? '+' : ''}
                  {(stats.recentSuccessRate - stats.successRate).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Last Import */}
          <div>
            <h4 className="font-medium text-text-primary mb-4">Última Importação</h4>
            {lastImport ? (
              <div className="p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="FileText" className="w-5 h-5 text-text-secondary" />
                  <span className="font-medium text-text-primary">
                    {lastImport.fileName}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    lastImport.status === 'success' ? 'bg-success/10 text-success border border-success/20' :
                    lastImport.status === 'error' ? 'bg-error/10 text-error border border-error/20' :
                    'bg-warning/10 text-warning border border-warning/20'
                  }`}>
                    <Icon name={
                      lastImport.status === 'success' ? 'CheckCircle' :
                      lastImport.status === 'error' ? 'XCircle' : 'Loader2'
                    } className={`w-3 h-3 ${lastImport.status === 'processing' ? 'animate-spin' : ''}`} />
                    {lastImport.status === 'success' ? 'Sucesso' :
                     lastImport.status === 'error' ? 'Erro' : 'Processando'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span>{formatDate(lastImport.uploadDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registros:</span>
                    <span>{(lastImport.recordsProcessed || 0).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuário:</span>
                    <span>{lastImport.uploadedBy}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-background rounded-lg">
                <Icon name="FileX" className="w-12 h-12 text-text-disabled mx-auto mb-3" />
                <p className="text-text-secondary">Nenhuma importação realizada</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions - Only show if not hidden */}
      {!hideQuickActions && (
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
      )}
    </div>
  );
};

export default ImportSummary;