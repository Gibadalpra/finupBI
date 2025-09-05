import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente da Lista de Mapeamentos
 * 
 * Exibe todos os mapeamentos criados com opções de visualização,
 * edição e remoção.
 * 
 * @param {Array} mappings - Lista de mapeamentos existentes
 * @param {Array} importedAccounts - Contas importadas para referência
 * @param {Array} chartAccounts - Contas do plano para referência
 * @param {Function} onRemoveMapping - Callback para remover mapeamento
 * @param {Function} onEditMapping - Callback para editar mapeamento
 */
const MappingsList = ({
  mappings = [],
  importedAccounts = [],
  chartAccounts = [],
  onRemoveMapping,
  onEditMapping
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, confirmed, suggested, pending
  const [sortBy, setSortBy] = useState('date'); // date, confidence, name
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedMapping, setExpandedMapping] = useState(null);

  // Obter detalhes das contas pelos IDs
  const getImportedAccountDetails = (accountId) => {
    return importedAccounts.find(acc => acc.id === accountId) || {
      id: accountId,
      originalName: 'Conta não encontrada',
      originalCode: 'N/A'
    };
  };

  const getChartAccountDetails = (accountId) => {
    return chartAccounts.find(acc => acc.id === accountId) || {
      id: accountId,
      name: 'Conta não encontrada',
      code: 'N/A',
      type: 'unknown'
    };
  };

  // Filtrar e ordenar mapeamentos
  const filteredAndSortedMappings = mappings
    .filter(mapping => {
      const importedAccount = getImportedAccountDetails(mapping.importedAccountId);
      const chartAccount = getChartAccountDetails(mapping.chartAccountId);
      
      // Filtro por texto de busca
      const matchesSearch = 
        importedAccount.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chartAccount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        importedAccount.originalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chartAccount.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por status
      const matchesStatus = statusFilter === 'all' || mapping.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.mappedAt) - new Date(b.mappedAt);
          break;
        case 'confidence':
          comparison = a.confidence - b.confidence;
          break;
        case 'name':
          const aImported = getImportedAccountDetails(a.importedAccountId);
          const bImported = getImportedAccountDetails(b.importedAccountId);
          comparison = aImported.originalName.localeCompare(bImported.originalName);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suggested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obter ícone do status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'CheckCircle';
      case 'suggested':
        return 'Lightbulb';
      case 'pending':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  // Obter cor da confiança
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabeçalho */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Icon name="List" className="text-purple-600" />
              Mapeamentos Criados
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {mappings.length} mapeamento{mappings.length !== 1 ? 's' : ''} • {filteredAndSortedMappings.length} exibido{filteredAndSortedMappings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros e controles */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-4">
        {/* Barra de busca */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Buscar mapeamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtro por status */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="confirmed">Confirmados</option>
              <option value="suggested">Sugeridos</option>
              <option value="pending">Pendentes</option>
            </select>
          </div>
          
          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Data</option>
              <option value="confidence">Confiança</option>
              <option value="name">Nome</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-gray-500 hover:text-gray-700"
              title={`Ordenar ${sortOrder === 'asc' ? 'decrescente' : 'crescente'}`}
            >
              <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de mapeamentos */}
      <div className="divide-y divide-gray-200">
        {filteredAndSortedMappings.length > 0 ? (
          filteredAndSortedMappings.map(mapping => {
            const importedAccount = getImportedAccountDetails(mapping.importedAccountId);
            const chartAccount = getChartAccountDetails(mapping.chartAccountId);
            const isExpanded = expandedMapping === mapping.id;
            
            return (
              <div key={mapping.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      {/* Status */}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        getStatusColor(mapping.status)
                      }`}>
                        <Icon name={getStatusIcon(mapping.status)} size={12} className="inline mr-1" />
                        {mapping.status === 'confirmed' ? 'Confirmado' :
                         mapping.status === 'suggested' ? 'Sugerido' :
                         mapping.status === 'pending' ? 'Pendente' : mapping.status}
                      </div>
                      
                      {/* Confiança */}
                      <div className={`text-sm font-medium ${
                        getConfidenceColor(mapping.confidence)
                      }`}>
                        {Math.round(mapping.confidence * 100)}% confiança
                      </div>
                    </div>
                    
                    {/* Mapeamento */}
                    <div className="mt-2 flex items-center gap-4">
                      {/* Conta importada */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon name="FileImport" size={14} className="text-orange-600" />
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {importedAccount.originalCode}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {importedAccount.originalName}
                        </p>
                      </div>
                      
                      {/* Seta */}
                      <div className="flex-shrink-0">
                        <Icon name="ArrowRight" className="text-gray-400" size={20} />
                      </div>
                      
                      {/* Conta do plano */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon name="FolderTree" size={14} className="text-green-600" />
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {chartAccount.code}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            chartAccount.type === 'receita' ? 'bg-green-500' :
                            chartAccount.type === 'despesa' ? 'bg-red-500' :
                            chartAccount.type === 'ativo' ? 'bg-blue-500' :
                            chartAccount.type === 'passivo' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {chartAccount.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setExpandedMapping(isExpanded ? null : mapping.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title="Ver detalhes"
                    >
                      <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
                    </button>
                    
                    {onEditMapping && (
                      <button
                        onClick={() => onEditMapping(mapping)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Editar mapeamento"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onRemoveMapping(mapping.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Remover mapeamento"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Detalhes expandidos */}
                {isExpanded && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Informações do Mapeamento</h5>
                        <div className="space-y-1 text-gray-600">
                          <p><strong>Criado por:</strong> {mapping.mappedBy}</p>
                          <p><strong>Data:</strong> {new Date(mapping.mappedAt).toLocaleString('pt-BR')}</p>
                          <p><strong>Confiança:</strong> {Math.round(mapping.confidence * 100)}%</p>
                          <p><strong>Status:</strong> {mapping.status}</p>
                        </div>
                      </div>
                      
                      {mapping.notes && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Observações</h5>
                          <p className="text-gray-600">{mapping.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="px-6 py-12 text-center">
            <Icon name="Search" size={48} className="text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum mapeamento encontrado
            </h4>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Ainda não há mapeamentos criados'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Rodapé com estatísticas */}
      {mappings.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Exibindo {filteredAndSortedMappings.length} de {mappings.length} mapeamentos
            </span>
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {mappings.filter(m => m.status === 'confirmed').length} confirmados
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                {mappings.filter(m => m.status === 'suggested').length} sugeridos
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                {mappings.filter(m => m.status === 'pending').length} pendentes
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingsList;