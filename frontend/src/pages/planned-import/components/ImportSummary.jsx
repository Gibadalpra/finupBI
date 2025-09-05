import React from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Resumo de Importações de Planejamento
 * 
 * Exibe estatísticas e métricas das importações de planejamento realizadas,
 * incluindo totais, taxas de sucesso, valores planejados e tendências.
 * 
 * @param {Array} imports - Lista de importações de planejamento para calcular estatísticas
 * @param {Object} selectedClient - Cliente selecionado
 */
const ImportSummary = ({ imports = [], selectedClient }) => {
  // Calcular estatísticas
  const stats = React.useMemo(() => {
    const total = imports.length;
    const successful = imports.filter(imp => imp.status === 'success').length;
    const failed = imports.filter(imp => imp.status === 'error').length;
    const processing = imports.filter(imp => imp.status === 'processing').length;
    
    const totalRecords = imports.reduce((sum, imp) => sum + (imp.recordsProcessed || 0), 0);
    const totalErrors = imports.reduce((sum, imp) => sum + (imp.recordsErrors || 0), 0);
    const totalPlannedValue = imports
      .filter(imp => imp.status === 'success')
      .reduce((sum, imp) => sum + (imp.totalPlannedValue || 0), 0);
    
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
    const recentPlannedValue = recentImports
      .filter(imp => imp.status === 'success')
      .reduce((sum, imp) => sum + (imp.totalPlannedValue || 0), 0);
    
    return {
      total,
      successful,
      failed,
      processing,
      totalRecords,
      totalErrors,
      totalPlannedValue,
      successRate,
      errorRate,
      recentTotal,
      recentSuccessful,
      recentPlannedValue,
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
  
  // Formatar valor monetário
  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
              <span className="text-text-secondary">Última Importação de Planejamento:</span>
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
              <Icon name="Calendar" className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-text-primary">
              {stats.total.toLocaleString('pt-BR')}
            </span>
          </div>
          <h4 className="font-medium text-text-primary mb-1">Importações de Planejamento</h4>
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
        
        {/* Total Planned Value */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-info/10 rounded-lg">
              <Icon name="DollarSign" className="w-6 h-6 text-info" />
            </div>
            <span className="text-2xl font-bold text-text-primary">
              {formatCurrency(stats.totalPlannedValue).replace('R$ ', '')}
            </span>
          </div>
          <h4 className="font-medium text-text-primary mb-1">Valor Total Planejado</h4>
          <p className="text-sm text-text-secondary">
            {formatCurrency(stats.recentPlannedValue)} nos últimos 30 dias
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
            Atividade Recente de Planejamento
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Stats */}
          <div>
            <h4 className="font-medium text-text-primary mb-4">Últimos 30 Dias</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" className="w-5 h-5 text-primary" />
                  <span className="text-text-primary">Importações de Planejamento</span>
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
                  <Icon name="DollarSign" className="w-5 h-5 text-info" />
                  <span className="text-text-primary">Valor Planejado</span>
                </div>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(stats.recentPlannedValue).replace('R$ ', '')}
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
            <h4 className="font-medium text-text-primary mb-4">Última Importação de Planejamento</h4>
            {lastImport ? (
              <div className="p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="FileSpreadsheet" className="w-5 h-5 text-text-secondary" />
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
                    <span>Valor Planejado:</span>
                    <span>{formatCurrency(lastImport.totalPlannedValue || 0)}</span>
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
                <p className="text-text-secondary">Nenhuma importação de planejamento realizada</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
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
              <p className="font-medium text-text-primary">Baixar Template de Planejamento</p>
              <p className="text-sm text-text-secondary">Modelo de arquivo para importação de dados planejados</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-background hover:bg-primary/5 border border-border hover:border-primary/20 rounded-lg transition-all duration-200 group">
            <Icon name="FileText" className="w-5 h-5 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="font-medium text-text-primary">Ver Documentação</p>
              <p className="text-sm text-text-secondary">Guia de importação de dados de planejamento</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-background hover:bg-primary/5 border border-border hover:border-primary/20 rounded-lg transition-all duration-200 group">
            <Icon name="BarChart3" className="w-5 h-5 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="font-medium text-text-primary">Relatório de Planejamento</p>
              <p className="text-sm text-text-secondary">Análise detalhada das importações de planejamento</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportSummary;