import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente do Painel de Contas Importadas
 * 
 * Exibe e gerencia contas importadas que precisam ser mapeadas para o Plano de Contas.
 * Inclui funcionalidades de busca, filtragem, ordenação e seleção.
 * 
 * @param {Object} selectedClient - Cliente selecionado
 * @param {Array} accounts - Lista de contas importadas
 * @param {Array} selectedAccounts - Contas atualmente selecionadas
 * @param {Function} onAccountSelect - Callback quando uma conta é selecionada
 * @param {Array} mappings - Mapeamentos existentes
 */
const ImportedAccountsPanel = ({ 
  selectedClient,
  accounts = [], 
  selectedAccounts = [], 
  onAccountSelect,
  mappings = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, mapped, ignored
  const [sortBy, setSortBy] = useState('frequency'); // frequency, name, code, date
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Filtrar e ordenar contas
  const filteredAndSortedAccounts = accounts
    .filter(account => {
      // Filtro por texto de busca
      const matchesSearch = 
        account.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.originalCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por status
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'frequency':
          comparison = a.frequency - b.frequency;
          break;
        case 'name':
          comparison = a.originalName.localeCompare(b.originalName);
          break;
        case 'code':
          comparison = a.originalCode.localeCompare(b.originalCode);
          break;
        case 'date':
          comparison = new Date(a.importDate) - new Date(b.importDate);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Verificar se uma conta está mapeada
  const isAccountMapped = (accountId) => {
    return mappings.some(mapping => mapping.importedAccountId === accountId);
  };

  // Obter mapeamento de uma conta
  const getAccountMapping = (accountId) => {
    return mappings.find(mapping => mapping.importedAccountId === accountId);
  };

  // Verificar se uma conta está selecionada
  const isAccountSelected = (accountId) => {
    return selectedAccounts.some(acc => acc.id === accountId);
  };

  // Estatísticas das contas
  const stats = {
    total: accounts.length,
    pending: accounts.filter(acc => acc.status === 'pending').length,
    mapped: accounts.filter(acc => acc.status === 'mapped').length,
    ignored: accounts.filter(acc => acc.status === 'ignored').length
  };

  // Se não há cliente selecionado, mostrar estado vazio
  if (!selectedClient) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Icon name="FileImport" className="text-orange-600" />
                Contas Importadas
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Selecione um cliente para visualizar suas contas importadas
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="Building2" size={48} className="text-text-secondary/50 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum Cliente Selecionado
          </h3>
          <p className="text-gray-500 max-w-md">
            Para visualizar e mapear contas importadas, primeiro selecione um cliente no seletor acima.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabeçalho do painel */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Icon name="FileImport" className="text-orange-600" />
              Contas Importadas - {selectedClient.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total} contas • {stats.pending} pendentes • {stats.mapped} mapeadas
            </p>
          </div>
          
          {/* Indicador de seleção */}
          {selectedAccounts.length > 0 && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {selectedAccounts.length} selecionada{selectedAccounts.length > 1 ? 's' : ''} para exportar
            </div>
          )}
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-4">
        {/* Barra de busca */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Buscar por nome ou código da conta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-4">
          {/* Filtro por status */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="mapped">Mapeadas</option>
              <option value="ignored">Ignoradas</option>
            </select>
          </div>
          
          {/* Ordenação */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="frequency">Frequência</option>
                <option value="name">Nome</option>
                <option value="code">Código</option>
                <option value="date">Data</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={`Ordenar ${sortOrder === 'asc' ? 'decrescente' : 'crescente'}`}
              >
                <Icon 
                  name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                  size={16} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de contas */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAndSortedAccounts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredAndSortedAccounts.map((account) => {
              const isSelected = isAccountSelected(account.id);
              const isMapped = isAccountMapped(account.id);
              const mapping = getAccountMapping(account.id);
              
              return (
                <div
                  key={account.id}
                  onClick={() => onAccountSelect(account)}
                  className={`px-6 py-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50'
                  } ${
                    isMapped ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Código e nome da conta */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {account.originalCode}
                        </span>
                        
                        {/* Status da conta */}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          account.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          account.status === 'mapped' ? 'bg-green-100 text-green-800' :
                          account.status === 'ignored' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {account.status === 'pending' ? 'Pendente' :
                           account.status === 'mapped' ? 'Mapeada' :
                           account.status === 'ignored' ? 'Ignorada' : account.status}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {account.originalName}
                      </h4>
                      
                      {/* Informações adicionais */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Icon name="TrendingUp" size={12} />
                          {account.frequency} ocorrências
                        </span>
                        
                        <span className="flex items-center gap-1">
                          <Icon name="Database" size={12} />
                          {account.importSource}
                        </span>
                        
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          {new Date(account.importDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      {/* Mapeamento existente */}
                      {isMapped && mapping && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-xs text-green-700">
                            <Icon name="CheckCircle" size={12} className="inline mr-1" />
                            Mapeada para: <span className="font-medium">{mapping.chartAccountId}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Checkbox de seleção */}
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onAccountSelect(account)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Icon name="FileSearch" size={48} className="text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma conta encontrada
            </h4>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Não há contas importadas para este cliente'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Rodapé com estatísticas */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Exibindo {filteredAndSortedAccounts.length} de {accounts.length} contas
          </span>
          
          {selectedAccounts.length > 0 && (
            <span className="text-blue-600 font-medium">
              {selectedAccounts.length} selecionada{selectedAccounts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportedAccountsPanel;