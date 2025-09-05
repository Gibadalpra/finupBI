import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ClientUserTable = ({ 
  users = [], 
  selectedUsers = [], 
  onUserSelect, 
  onSelectAll 
}) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showMobileActions, setShowMobileActions] = useState(null);

  // Função para formatar a última atividade
  const formatLastActivity = (date) => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Função para obter cor da função
  const getRoleColor = (role) => {
    const colors = {
      'Client Admin': 'bg-purple-100 text-purple-800',
      'Client User': 'bg-blue-100 text-blue-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Função para ordenar
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Ordenar usuários
  const sortedUsers = [...users].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'lastActivity') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortBy !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-tertiary" />;
    }
    return (
      <Icon 
        name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={14} 
        className="text-primary" 
      />
    );
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border">
        <div className="p-12 text-center">
          <Icon name="Users" size={48} className="text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-text-secondary">
            Não há usuários cadastrados para sua empresa ou nenhum usuário corresponde aos filtros aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Versão Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              <th 
                className="text-left px-6 py-4 font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Usuário</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="text-left px-6 py-4 font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center space-x-2">
                  <span>Função</span>
                  <SortIcon field="role" />
                </div>
              </th>
              <th 
                className="text-left px-6 py-4 font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center space-x-2">
                  <span>Departamento</span>
                  <SortIcon field="department" />
                </div>
              </th>
              <th className="text-left px-6 py-4 font-medium text-text-secondary">
                Permissões
              </th>
              <th 
                className="text-left px-6 py-4 font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort('lastActivity')}
              >
                <div className="flex items-center space-x-2">
                  <span>Última Atividade</span>
                  <SortIcon field="lastActivity" />
                </div>
              </th>
              <th 
                className="text-left px-6 py-4 font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="text-right px-6 py-4 font-medium text-text-secondary">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-background transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => onUserSelect(user.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{user.name}</div>
                      <div className="text-sm text-text-secondary">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-text-primary">{user.department}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.permissions?.slice(0, 2).map((permission, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
                      >
                        {permission}
                      </span>
                    ))}
                    {user.permissions?.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        +{user.permissions.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-text-secondary text-sm">
                    {formatLastActivity(user.lastActivity)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status === 'Active' ? 'Ativo' : user.status === 'Inactive' ? 'Inativo' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors">
                      <Icon name="Edit" size={16} />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors">
                      <Icon name="MoreVertical" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Versão Mobile */}
      <div className="lg:hidden">
        {sortedUsers.map((user) => (
          <div key={user.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => onUserSelect(user.id)}
                  className="rounded border-border text-primary focus:ring-primary mt-1"
                />
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-text-primary">{user.name}</div>
                  <div className="text-sm text-text-secondary">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => setShowMobileActions(showMobileActions === user.id ? null : user.id)}
                className="p-2 text-text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors"
              >
                <Icon name="MoreVertical" size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-text-secondary">Status:</span>
                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status === 'Active' ? 'Ativo' : user.status === 'Inactive' ? 'Inativo' : 'Pendente'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Função:</span>
                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Departamento:</span>
                <span className="ml-2 text-text-primary">{user.department}</span>
              </div>
              <div>
                <span className="text-text-secondary">Última Atividade:</span>
                <span className="ml-2 text-text-primary">{formatLastActivity(user.lastActivity)}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <span className="text-text-secondary text-sm">Permissões:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.permissions?.map((permission, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
            
            {showMobileActions === user.id && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
                    <Icon name="Edit" size={16} />
                    <span>Editar</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-background transition-colors">
                    <Icon name="MoreHorizontal" size={16} />
                    <span>Mais</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientUserTable;