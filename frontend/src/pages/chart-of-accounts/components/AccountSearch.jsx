import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Busca de Contas
 * 
 * Permite buscar e filtrar contas no plano de contas por:
 * - Código da conta
 * - Nome da conta
 * - Descrição
 * - Tipo (grupo, subgrupo, conta)
 * - Nível hierárquico
 */
const AccountSearch = ({ 
  chartOfAccounts, 
  onAccountSelect, 
  onEditAccount, 
  loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, group, subgroup, account
  const [filterLevel, setFilterLevel] = useState('all'); // all, 1, 2, 3
  const [sortBy, setSortBy] = useState('code'); // code, name, type
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  
  // Função para achatar a estrutura hierárquica em uma lista
  const flattenAccounts = (chartData) => {
    if (!chartData || !chartData.groups) return [];
    
    const flattened = [];
    
    chartData.groups.forEach(group => {
      // Adicionar grupo
      flattened.push({
        ...group,
        path: group.name,
        fullPath: group.name
      });
      
      // Adicionar subgrupos
      if (group.subGroups) {
        group.subGroups.forEach(subGroup => {
          flattened.push({
            ...subGroup,
            path: `${group.name} > ${subGroup.name}`,
            fullPath: `${group.name} > ${subGroup.name}`
          });
          
          // Adicionar contas
          if (subGroup.accounts) {
            subGroup.accounts.forEach(account => {
              flattened.push({
                ...account,
                path: `${group.name} > ${subGroup.name} > ${account.name}`,
                fullPath: `${group.name} > ${subGroup.name} > ${account.name}`
              });
            });
          }
        });
      }
    });
    
    return flattened;
  };
  
  // Filtrar e ordenar contas
  const filteredAccounts = useMemo(() => {
    let accounts = flattenAccounts(chartOfAccounts);
    
    // Aplicar filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      accounts = accounts.filter(account => 
        account.code.toLowerCase().includes(term) ||
        account.name.toLowerCase().includes(term) ||
        (account.description && account.description.toLowerCase().includes(term))
      );
    }
    
    // Aplicar filtro de tipo
    if (filterType !== 'all') {
      accounts = accounts.filter(account => account.type === filterType);
    }
    
    // Aplicar filtro de nível
    if (filterLevel !== 'all') {
      accounts = accounts.filter(account => account.level === parseInt(filterLevel));
    }
    
    // Aplicar ordenação
    accounts.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'code':
          aValue = a.code;
          bValue = b.code;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = a.code;
          bValue = b.code;
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    return accounts;
  }, [chartOfAccounts, searchTerm, filterType, filterLevel, sortBy, sortOrder]);
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'group': return 'Grupo';
      case 'subgroup': return 'SubGrupo';
      case 'account': return 'Conta';
      default: return type;
    }
  };
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'group': return 'bg-blue-100 text-blue-800';
      case 'subgroup': return 'bg-green-100 text-green-800';
      case 'account': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-text-secondary">Carregando contas...</span>
        </div>
      </div>
    );
  }
  
  if (!chartOfAccounts || !chartOfAccounts.groups || chartOfAccounts.groups.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Nenhum Plano de Contas Encontrado
          </h3>
          <p className="text-text-secondary">
            Este cliente ainda não possui um plano de contas configurado.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <div className="card p-6">
        <div className="space-y-4">
          {/* Barra de Busca */}
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <input
              type="text"
              placeholder="Buscar por código, nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-4">
            {/* Filtro por Tipo */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Tipo:
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="group">Grupos</option>
                <option value="subgroup">SubGrupos</option>
                <option value="account">Contas</option>
              </select>
            </div>
            
            {/* Filtro por Nível */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Nível:
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="1">Nível 1</option>
                <option value="2">Nível 2</option>
                <option value="3">Nível 3</option>
              </select>
            </div>
            
            {/* Ordenação */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Ordenar por:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="code">Código</option>
                <option value="name">Nome</option>
                <option value="type">Tipo</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-background-secondary rounded"
                title={`Ordenação ${sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}`}
              >
                <Icon 
                  name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                  size={16} 
                  className="text-text-secondary" 
                />
              </button>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-text-secondary">
              {filteredAccounts.length} {filteredAccounts.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </span>
            
            {(searchTerm || filterType !== 'all' || filterLevel !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterLevel('all');
                }}
                className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <Icon name="X" size={14} />
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Resultados */}
      <div className="card">
        {filteredAccounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-background-tertiary"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center gap-1">
                      Código
                      {sortBy === 'code' && (
                        <Icon 
                          name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                          size={12} 
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-background-tertiary"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Nome
                      {sortBy === 'name' && (
                        <Icon 
                          name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                          size={12} 
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-background-tertiary"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-1">
                      Tipo
                      {sortBy === 'type' && (
                        <Icon 
                          name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                          size={12} 
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Caminho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {filteredAccounts.map((account) => (
                  <tr 
                    key={account.id} 
                    className="hover:bg-background-secondary cursor-pointer"
                    onClick={() => onAccountSelect(account)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {account.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {account.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(account.type)}`}>
                        {getTypeLabel(account.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="max-w-xs truncate" title={account.fullPath}>
                        {account.path}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="max-w-xs truncate" title={account.description}>
                        {account.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccountSelect(account);
                          }}
                          className="text-primary hover:text-primary-dark"
                          title="Visualizar"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditAccount(account);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Icon name="Edit" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto text-text-secondary mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-text-secondary">
              Tente ajustar os filtros ou termos de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSearch;