import React from 'react';
import Icon from 'components/AppIcon';

const ClientUserFilters = ({ filters, onFiltersChange, users = [] }) => {
  // Extrair departamentos únicos dos usuários
  const departments = [...new Set(users.map(user => user.department).filter(Boolean))];
  
  // Extrair funções únicas dos usuários
  const roles = [...new Set(users.map(user => user.role).filter(Boolean))];

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      role: 'all',
      department: 'all',
      status: 'all'
    });
  };

  const hasActiveFilters = filters.search || 
                          filters.role !== 'all' || 
                          filters.department !== 'all' || 
                          filters.status !== 'all';

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Barra de Pesquisa */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" 
            />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtro por Função */}
          <div className="min-w-[140px]">
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">Todas as Funções</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Departamento */}
          <div className="min-w-[160px]">
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">Todos os Departamentos</option>
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div className="min-w-[120px]">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="Active">Ativo</option>
              <option value="Inactive">Inativo</option>
              <option value="Pending">Pendente</option>
            </select>
          </div>

          {/* Botão Limpar Filtros */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-background transition-colors"
            >
              <Icon name="X" size={16} />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Indicadores de Filtros Ativos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-text-secondary">Filtros ativos:</span>
            
            {filters.search && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-50 text-primary-700 rounded text-sm">
                <span>Busca: "{filters.search}"</span>
                <button 
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:text-primary-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.role !== 'all' && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-50 text-primary-700 rounded text-sm">
                <span>Função: {filters.role}</span>
                <button 
                  onClick={() => handleFilterChange('role', 'all')}
                  className="hover:text-primary-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.department !== 'all' && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-50 text-primary-700 rounded text-sm">
                <span>Departamento: {filters.department}</span>
                <button 
                  onClick={() => handleFilterChange('department', 'all')}
                  className="hover:text-primary-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-50 text-primary-700 rounded text-sm">
                <span>Status: {filters.status === 'Active' ? 'Ativo' : filters.status === 'Inactive' ? 'Inativo' : 'Pendente'}</span>
                <button 
                  onClick={() => handleFilterChange('status', 'all')}
                  className="hover:text-primary-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Estatísticas Rápidas */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {users.length}
            </div>
            <div className="text-sm text-text-secondary">Total de Usuários</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'Active').length}
            </div>
            <div className="text-sm text-text-secondary">Usuários Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'Client Admin').length}
            </div>
            <div className="text-sm text-text-secondary">Administradores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {departments.length}
            </div>
            <div className="text-sm text-text-secondary">Departamentos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientUserFilters;