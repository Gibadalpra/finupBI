import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente do Painel do Plano de Contas
 * 
 * Exibe o Plano de Contas cadastrado no sistema com hierarquia e funcionalidades
 * de busca, filtragem e seleção para mapeamento.
 * 
 * @param {Object} selectedClient - Cliente selecionado
 * @param {Array} accounts - Lista do Plano de Contas
 * @param {Array} selectedAccounts - Contas atualmente selecionadas
 * @param {Function} onAccountSelect - Callback quando uma conta é selecionada
 * @param {Array} mappings - Mapeamentos existentes
 */
const ChartOfAccountsPanel = ({ 
  selectedClient,
  accounts = [], 
  selectedAccounts = [], 
  onAccountSelect,
  mappings = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, receita, despesa, ativo, passivo
  const [levelFilter, setLevelFilter] = useState('all'); // all, 1, 2, 3, 4, 5
  const [sortBy, setSortBy] = useState('code'); // code, name, type
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  // Filtrar e ordenar contas
  const filteredAndSortedAccounts = accounts
    .filter(account => {
      // Filtro por texto de busca
      const matchesSearch = 
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por tipo
      const matchesType = typeFilter === 'all' || account.type === typeFilter;
      
      // Filtro por nível
      const matchesLevel = levelFilter === 'all' || account.level.toString() === levelFilter;
      
      return matchesSearch && matchesType && matchesLevel;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Verificar se uma conta está sendo usada em mapeamentos
  const isAccountUsedInMapping = (accountId) => {
    return mappings.some(mapping => mapping.chartAccountId === accountId);
  };

  // Obter quantos mapeamentos usam uma conta
  const getAccountMappingCount = (accountId) => {
    return mappings.filter(mapping => mapping.chartAccountId === accountId).length;
  };

  // Verificar se uma conta está selecionada
  const isAccountSelected = (accountId) => {
    return selectedAccounts.some(acc => acc.id === accountId);
  };

  // Agrupar contas por tipo para exibição hierárquica
  const groupedAccounts = filteredAndSortedAccounts.reduce((groups, account) => {
    const type = account.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {});

  // Estatísticas das contas
  const stats = {
    total: accounts.length,
    receita: accounts.filter(acc => acc.type === 'receita').length,
    despesa: accounts.filter(acc => acc.type === 'despesa').length,
    ativo: accounts.filter(acc => acc.type === 'ativo').length,
    passivo: accounts.filter(acc => acc.type === 'passivo').length
  };

  // Toggle de expansão de grupos
  const toggleGroup = (groupName) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  // Ícones por tipo de conta
  const getTypeIcon = (type) => {
    switch (type) {
      case 'receita': return 'mdi:trending-up';
      case 'despesa': return 'mdi:trending-down';
      case 'ativo': return 'mdi:bank';
      case 'passivo': return 'mdi:credit-card';
      default: return 'mdi:file-document';
    }
  };

  // Cores por tipo de conta
  const getTypeColor = (type) => {
    switch (type) {
      case 'receita': return 'text-green-600 bg-green-100';
      case 'despesa': return 'text-red-600 bg-red-100';
      case 'ativo': return 'text-blue-600 bg-blue-100';
      case 'passivo': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Se não há cliente selecionado, mostrar estado vazio
  if (!selectedClient) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Icon name="FolderTree" className="text-green-600" />
                Plano de Contas
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Selecione um cliente para visualizar seu Plano de Contas
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="FolderTree" size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum Cliente Selecionado
          </h3>
          <p className="text-gray-500 max-w-md">
            Para visualizar o Plano de Contas e realizar mapeamentos, primeiro selecione um cliente no seletor acima.
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
              <Icon name="FolderTree" className="text-green-600" />
              Plano de Contas - {selectedClient.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total} contas • {stats.receita} receitas • {stats.despesa} despesas
            </p>
          </div>
          
          {/* Indicador de seleção */}
          {selectedAccounts.length > 0 && (
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {selectedAccounts.length} selecionada{selectedAccounts.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-4">
        {/* Barra de busca */}
        <div className="relative">
          <Icon 
            icon="mdi:magnify" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
          />
          <input
            type="text"
            placeholder="Buscar por código ou nome da conta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-4">
          {/* Filtro por tipo */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos</option>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
              <option value="ativo">Ativo</option>
              <option value="passivo">Passivo</option>
            </select>
          </div>
          
          {/* Filtro por nível */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nível
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos</option>
              <option value="1">Nível 1</option>
              <option value="2">Nível 2</option>
              <option value="3">Nível 3</option>
              <option value="4">Nível 4</option>
              <option value="5">Nível 5</option>
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
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="code">Código</option>
                <option value="name">Nome</option>
                <option value="type">Tipo</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                title={`Ordenar ${sortOrder === 'asc' ? 'decrescente' : 'crescente'}`}
              >
                <Icon 
                  icon={sortOrder === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'} 
                  className="h-4 w-4" 
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de contas agrupadas */}
      <div className="max-h-96 overflow-y-auto">
        {Object.keys(groupedAccounts).length > 0 ? (
          <div>
            {Object.entries(groupedAccounts).map(([type, typeAccounts]) => {
              const isExpanded = expandedGroups.has(type);
              
              return (
                <div key={type}>
                  {/* Cabeçalho do grupo */}
                  <div 
                    onClick={() => toggleGroup(type)}
                    className="px-6 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon 
                          icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'} 
                          className="h-4 w-4 text-gray-500" 
                        />
                        <Icon 
                          icon={getTypeIcon(type)} 
                          className={`h-4 w-4 ${getTypeColor(type).split(' ')[0]}`} 
                        />
                        <span className="font-medium text-gray-900 capitalize">
                          {type}
                        </span>
                      </div>
                      
                      <span className="text-sm text-gray-500">
                        {typeAccounts.length} conta{typeAccounts.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Contas do grupo */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-200">
                      {typeAccounts.map((account) => {
                        const isSelected = isAccountSelected(account.id);
                        const isUsedInMapping = isAccountUsedInMapping(account.id);
                        const mappingCount = getAccountMappingCount(account.id);
                        
                        return (
                          <div
                            key={account.id}
                            onClick={() => onAccountSelect(account)}
                            className={`px-6 py-4 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-green-50 border-l-4 border-green-500'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                {/* Código e nível da conta */}
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {account.code}
                                  </span>
                                  
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    getTypeColor(account.type)
                                  }`}>
                                    <Icon icon={getTypeIcon(account.type)} className="h-3 w-3 mr-1" />
                                    {account.type}
                                  </span>
                                  
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Nível {account.level}
                                  </span>
                                </div>
                                
                                <h4 className="text-sm font-medium text-gray-900 mb-1">
                                  {account.name}
                                </h4>
                                
                                {/* Informações adicionais */}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Icon icon="mdi:check-circle" className="h-3 w-3" />
                                    {account.status === 'active' ? 'Ativa' : 'Inativa'}
                                  </span>
                                  
                                  {isUsedInMapping && (
                                    <span className="flex items-center gap-1 text-green-600">
                                      <Icon icon="mdi:link" className="h-3 w-3" />
                                      {mappingCount} mapeamento{mappingCount > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Checkbox de seleção */}
                              <div className="ml-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => onAccountSelect(account)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Icon icon="mdi:file-tree" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma conta encontrada
            </h4>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' || levelFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Não há contas cadastradas no Plano de Contas'
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
            <span className="text-green-600 font-medium">
              {selectedAccounts.length} selecionada{selectedAccounts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartOfAccountsPanel;