import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Icon from 'components/AppIcon';
import ClientUserTable from './components/ClientUserTable';
import ClientUserFilters from './components/ClientUserFilters';
import ClientBulkActions from './components/ClientBulkActions';
import AddClientUserModal from './components/AddClientUserModal';
import ClientAuditLogModal from './components/ClientAuditLogModal';

const ClientUserManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAuditLogModal, setShowAuditLogModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    department: 'all',
    status: 'all'
  });

  // Dados do usuário atual (admin do cliente)
  const currentUser = {
    name: "Ana Costa",
    email: "ana.costa@globaltech.com",
    role: "Client Admin",
    company: "Global Tech Solutions",
    // Role para o sistema de navegação (deve ser 'client' para acessar os links corretos)
    systemRole: "client"
  };

  // Mock data - usuários da empresa cliente
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Carlos Silva",
      email: "carlos.silva@globaltech.com",
      role: "Client Admin",
      department: "Administração",
      permissions: ["Portal do Cliente", "Visualizar Relatórios", "Gerenciar Usuários"],
      status: "Active",
      lastActivity: new Date(Date.now() - 300000),
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      phone: "+55 (11) 99999-1111",
      joinDate: new Date("2023-01-15"),
      loginHistory: [
        { date: new Date(Date.now() - 300000), ip: "203.0.113.45", device: "Chrome on Windows" },
        { date: new Date(Date.now() - 86400000), ip: "203.0.113.45", device: "Chrome on Windows" }
      ],
      activityLog: [
        { action: "Visualizou relatório financeiro", timestamp: new Date(Date.now() - 1800000) },
        { action: "Adicionou novo usuário", timestamp: new Date(Date.now() - 3600000) }
      ]
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@globaltech.com",
      role: "Client User",
      department: "Financeiro",
      permissions: ["Portal do Cliente", "Visualizar Relatórios"],
      status: "Active",
      lastActivity: new Date(Date.now() - 1800000),
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      phone: "+55 (11) 99999-2222",
      joinDate: new Date("2023-02-20"),
      loginHistory: [
        { date: new Date(Date.now() - 1800000), ip: "203.0.113.67", device: "Firefox on Mac" },
        { date: new Date(Date.now() - 172800000), ip: "203.0.113.67", device: "Firefox on Mac" }
      ],
      activityLog: [
        { action: "Baixou relatório mensal", timestamp: new Date(Date.now() - 7200000) },
        { action: "Acessou dashboard", timestamp: new Date(Date.now() - 10800000) }
      ]
    },
    {
      id: 3,
      name: "João Oliveira",
      email: "joao.oliveira@globaltech.com",
      role: "Client User",
      department: "Operações",
      permissions: ["Portal do Cliente", "Visualizar Relatórios"],
      status: "Active",
      lastActivity: new Date(Date.now() - 3600000),
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      phone: "+55 (11) 99999-3333",
      joinDate: new Date("2023-03-10"),
      loginHistory: [
        { date: new Date(Date.now() - 3600000), ip: "203.0.113.89", device: "Safari on iPhone" },
        { date: new Date(Date.now() - 259200000), ip: "203.0.113.89", device: "Safari on iPhone" }
      ],
      activityLog: [
        { action: "Visualizou transações", timestamp: new Date(Date.now() - 14400000) },
        { action: "Exportou dados", timestamp: new Date(Date.now() - 18000000) }
      ]
    },
    {
      id: 4,
      name: "Fernanda Lima",
      email: "fernanda.lima@globaltech.com",
      role: "Client User",
      department: "RH",
      permissions: ["Portal do Cliente"],
      status: "Inactive",
      lastActivity: new Date(Date.now() - 604800000),
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      phone: "+55 (11) 99999-4444",
      joinDate: new Date("2023-04-05"),
      loginHistory: [
        { date: new Date(Date.now() - 604800000), ip: "203.0.113.12", device: "Chrome on Android" },
        { date: new Date(Date.now() - 1209600000), ip: "203.0.113.12", device: "Chrome on Android" }
      ],
      activityLog: [
        { action: "Último acesso", timestamp: new Date(Date.now() - 604800000) }
      ]
    }
  ]);

  // Filtrar usuários baseado nos filtros atuais
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    const matchesRole = filters?.role === 'all' || user?.role === filters?.role;
    const matchesDepartment = filters?.department === 'all' || user?.department === filters?.department;
    const matchesStatus = filters?.status === 'all' || user?.status === filters?.status;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers?.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(user => user?.id));
    }
  };

  const handleAddUser = (userData) => {
    const newUser = {
      id: users?.length + 1,
      ...userData,
      lastActivity: new Date(),
      avatar: `https://randomuser.me/api/portraits/${userData?.gender || 'men'}/${users?.length + 1}.jpg`,
      joinDate: new Date(),
      loginHistory: [],
      activityLog: []
    };
    setUsers(prev => [...prev, newUser]);
    setShowAddUserModal(false);
  };

  const handleBulkAction = (action) => {
    console.log(`Executando ação em massa: ${action} para usuários:`, selectedUsers);
    // Implementar ações em massa aqui
    setSelectedUsers([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={currentUser} 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        collapsed={sidebarCollapsed}
        userRole={currentUser?.systemRole}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      } pt-16`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header da Página */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  Gerenciar Usuários da Empresa
                </h1>
                <p className="text-text-secondary">
                  Gerencie os usuários da {currentUser?.company} com acesso ao portal
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAuditLogModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-background nav-transition"
                >
                  <Icon name="FileText" size={16} color="currentColor" />
                  <span>Log de Atividades</span>
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 nav-transition"
                >
                  <Icon name="Plus" size={16} color="white" />
                  <span>Adicionar Usuário</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <ClientUserFilters 
            filters={filters}
            onFiltersChange={setFilters}
            users={users}
          />

          {/* Ações em Massa */}
          {selectedUsers?.length > 0 && (
            <ClientBulkActions 
              selectedCount={selectedUsers?.length}
              onAction={handleBulkAction}
            />
          )}

          {/* Tabela de Usuários */}
          <ClientUserTable 
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
          />
        </div>
      </main>

      {/* Modais */}
      {showAddUserModal && (
        <AddClientUserModal 
          onClose={() => setShowAddUserModal(false)}
          onAddUser={handleAddUser}
          currentCompany={currentUser?.company}
        />
      )}

      {showAuditLogModal && (
        <ClientAuditLogModal 
          onClose={() => setShowAuditLogModal(false)}
          users={users}
          currentCompany={currentUser?.company}
        />
      )}
    </div>
  );
};

export default ClientUserManagement;