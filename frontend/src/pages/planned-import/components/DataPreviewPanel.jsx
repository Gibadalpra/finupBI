import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Preview dos Dados de Planejamento Importados
 * 
 * Exibe uma prévia dos dados do arquivo de planejamento importado, incluindo estatísticas,
 * validações e uma amostra dos registros. Permite confirmar o processamento.
 * 
 * @param {Object} data - Dados do arquivo processado
 * @param {Function} onProcessImport - Callback para processar a importação
 * @param {Boolean} isProcessing - Se está processando a importação
 */
const DataPreviewPanel = ({ data, onProcessImport, isProcessing = false }) => {
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  if (!data) return null;
  
  const {
    importName,
    fileName,
    fileSize,
    totalRows,
    validRows,
    errorRows,
    columns,
    sampleData = []
  } = data;
  
  // Calcular estatísticas específicas de planejamento
  const successRate = totalRows > 0 ? ((validRows / totalRows) * 100).toFixed(1) : 0;
  const hasErrors = errorRows > 0;
  
  // Calcular valor total planejado (se disponível)
  const totalPlannedValue = sampleData.reduce((sum, row) => {
    const value = row.valorplanejado || row['valor planejado'] || row.valor || 0;
    return sum + (typeof value === 'number' ? value : parseFloat(value) || 0);
  }, 0);
  
  // Paginação dos dados de amostra
  const totalPages = Math.ceil(sampleData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = sampleData.slice(startIndex, endIndex);
  
  // Colunas visíveis (limitar para não quebrar o layout)
  const visibleColumns = showAllColumns ? columns : columns.slice(0, 4);
  const hiddenColumnsCount = columns.length - visibleColumns.length;
  
  // Formatar valor para exibição
  const formatValue = (value, key) => {
    if (value === null || value === undefined) return '-';
    
    // Formatar valores monetários
    if (key.toLowerCase().includes('valor') && typeof value === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    
    // Formatar datas e períodos
    if ((key.toLowerCase().includes('data') || key.toLowerCase().includes('periodo')) && typeof value === 'string') {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('pt-BR');
      } catch {
        return value;
      }
    }
    
    return value.toString();
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Eye" className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {importName || 'Preview dos Dados de Planejamento'}
            </h3>
            <p className="text-sm text-text-secondary">
              Arquivo: {fileName}
            </p>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Records */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {totalRows.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-text-secondary">Total de Registros</p>
              </div>
            </div>
          </div>
          
          {/* Valid Records */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {validRows.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-text-secondary">Registros Válidos</p>
              </div>
            </div>
          </div>
          
          {/* Error Records */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                hasErrors ? 'bg-error/10' : 'bg-text-disabled/10'
              }`}>
                <Icon name="AlertCircle" className={`w-5 h-5 ${
                  hasErrors ? 'text-error' : 'text-text-disabled'
                }`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${
                  hasErrors ? 'text-error' : 'text-text-disabled'
                }`}>
                  {errorRows.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-text-secondary">Registros com Erro</p>
              </div>
            </div>
          </div>
          
          {/* Total Planned Value */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                <Icon name="DollarSign" className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-lg font-bold text-info">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(totalPlannedValue)}
                </p>
                <p className="text-sm text-text-secondary">Valor Total Planejado</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Validation Status */}
        <div className="mt-4">
          {hasErrors ? (
            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <Icon name="AlertTriangle" className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-warning">
                  Atenção: {errorRows} registro(s) de planejamento com problemas
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Os registros com erro serão ignorados durante o processamento
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
              <Icon name="CheckCircle" className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-medium text-success">
                  Todos os registros de planejamento são válidos
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  O arquivo está pronto para processamento
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Data Sample */}
      <div className="bg-surface rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Table" className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Amostra dos Dados de Planejamento
                </h3>
                <p className="text-sm text-text-secondary">
                  Primeiros {Math.min(sampleData.length, recordsPerPage)} registros de {sampleData.length}
                </p>
              </div>
            </div>
            
            {hiddenColumnsCount > 0 && (
              <button
                onClick={() => setShowAllColumns(!showAllColumns)}
                className="text-sm text-primary hover:text-primary-dark transition-colors duration-200"
              >
                {showAllColumns ? 'Mostrar menos' : `+${hiddenColumnsCount} colunas`}
              </button>
            )}
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                {visibleColumns.map((column, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-background transition-colors duration-200">
                  {visibleColumns.map((column, colIndex) => {
                    const key = column.toLowerCase().replace(/\s+/g, '');
                    const value = row[key] || row[column] || '-';
                    
                    return (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {formatValue(value, key)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Mostrando {startIndex + 1} a {Math.min(endIndex, sampleData.length)} de {sampleData.length} registros
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
      
      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <div className="text-sm text-text-secondary">
          {validRows.toLocaleString('pt-BR')} registros de planejamento serão processados
        </div>
        
        <button
          onClick={onProcessImport}
          disabled={isProcessing || validRows === 0}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isProcessing ? (
            <>
              <Icon name="Loader2" className="w-5 h-5 animate-spin" />
              Processando Planejamento...
            </>
          ) : (
            <>
              <Icon name="Play" className="w-5 h-5" />
              Processar Importação de Planejamento
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DataPreviewPanel;