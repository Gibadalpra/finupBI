import React, { useState } from 'react';
import Icon from 'components/AppIcon';

/**
 * Componente para listar e gerenciar Centros de Custo
 * 
 * Funcionalidades:
 * - Listagem de centros de custo
 * - Busca e filtros
 * - Ações de editar e excluir
 * - Indicadores visuais de status
 */
const CostCenterList = ({ 
  costCenters = [], 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

  // Filtrar centros de custo baseado na busca e status
  const filteredCostCenters = costCenters.filter(center => {
    const matchesSearch = 
      center.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (center.description && center.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || center.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (center) => {
    onEdit && onEdit(center);
  };

  const handleDelete = (center) => {
    if (window.confirm(`Tem certeza que deseja excluir o centro de custo "${center.name}"?`)) {
      onDelete && onDelete(center.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-text-secondary">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Carregando centros de custo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Filtros */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              Centros de Custo
            </h2>
            <p className="text-sm text-text-secondary">
              Gerencie os centros de custo para organização de despesas e receitas
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Campo de Busca */}
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
              <input
                type="text"
                placeholder="Buscar por código, nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-80 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Filtro de Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Centros de Custo */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {filteredCostCenters.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Building2" size={48} className="mx-auto text-text-secondary mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Nenhum resultado encontrado' : 'Nenhum centro de custo cadastrado'}
            </h3>
            <p className="text-text-secondary">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando o primeiro centro de custo'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Código
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCostCenters.map((center) => (
                  <tr key={center.id} className="hover:bg-background transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-text-primary">
                        {center.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {center.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">
                        {center.description || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        center.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          center.status === 'active' ? 'bg-success' : 'bg-warning'
                        }`}></span>
                        {center.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(center.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(center)}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar centro de custo"
                        >
                          <Icon name="Edit2" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(center)}
                          className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Excluir centro de custo"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumo */}
      {filteredCostCenters.length > 0 && (
        <div className="text-sm text-text-secondary text-center">
          Exibindo {filteredCostCenters.length} de {costCenters.length} centros de custo
        </div>
      )}
    </div>
  );
};

export default CostCenterList;