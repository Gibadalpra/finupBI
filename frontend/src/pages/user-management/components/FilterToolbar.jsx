import React from 'react';
import Icon from 'components/AppIcon';

const FilterToolbar = ({ filters, onFiltersChange, userCount }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      role: 'all',
      userType: 'all',
      permission: 'all',
      status: 'all'
    });
  };

  const hasActiveFilters = filters?.search || filters?.role !== 'all' || filters?.userType !== 'all' || filters?.permission !== 'all' || filters?.status !== 'all';

  return (
    <div className="bg-surface rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="flex-1 lg:max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              color="var(--color-text-secondary)" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Buscar usuários por nome ou email..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* User Type Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Tipo:</label>
            <select
              value={filters?.userType}
              onChange={(e) => handleFilterChange('userType', e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm bg-surface"
            >
              <option value="all">Todos os Tipos</option>
              <option value="internal">Interno</option>
              <option value="external">Externo</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Função:</label>
            <select
              value={filters?.role}
              onChange={(e) => handleFilterChange('role', e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm bg-surface"
            >
              <option value="all">Todas as Funções</option>
              <option value="Partner">Sócio</option>
              <option value="Staff">Funcionário</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Client Admin">Admin Cliente</option>
              <option value="Client User">Usuário Cliente</option>
            </select>
          </div>

          {/* Permission Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Permissão:</label>
            <select
              value={filters?.permission}
              onChange={(e) => handleFilterChange('permission', e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm bg-surface"
            >
              <option value="all">Todas as Permissões</option>
              <option value="Full Access">Acesso Total</option>
              <option value="User Management">Gerenciamento de Usuários</option>
              <option value="Transaction Management">Gerenciamento de Transações</option>
              <option value="Financial Reports">Relatórios Financeiros</option>
              <option value="Bank Reconciliation">Conciliação Bancária</option>
              <option value="Tax Compliance">Conformidade Fiscal</option>
              <option value="Client Portal">Portal do Cliente</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Status:</label>
            <select
              value={filters?.status}
              onChange={(e) => handleFilterChange('status', e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm bg-surface"
            >
              <option value="all">Todos os Status</option>
              <option value="Active">Ativo</option>
              <option value="Inactive">Inativo</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-background nav-transition"
            >
              <Icon name="X" size={14} color="currentColor" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>
      {/* Results Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span>Mostrando {userCount} usuários</span>
            {hasActiveFilters && (
              <span className="flex items-center space-x-1">
                <Icon name="Filter" size={14} color="var(--color-text-secondary)" />
                <span>Filtros aplicados</span>
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-background nav-transition">
              <Icon name="Download" size={14} color="currentColor" />
              <span>Exportar</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-background nav-transition">
              <Icon name="RefreshCw" size={14} color="currentColor" />
              <span>Atualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;