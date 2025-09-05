import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Icon from 'components/AppIcon';
import { Building } from 'lucide-react';

const ClientManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [currentClient, setCurrentClient] = useState(null);
  
  // Form state for client and admin user
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    adminUser: {
      name: '',
      email: '',
      phone: '',
      position: ''
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock user data
  const user = {
    name: 'João Silva',
    email: 'joao@finupbi.com',
    avatar: null,
    role: 'staff'
  };

  // Mock clients data
  const mockClients = [
    {
      id: 1,
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      phone: '(11) 99999-9999',
      document: '12.345.678/0001-90',
      type: 'juridica',
      status: 'ativo',
      address: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      adminUser: {
        name: 'João Silva',
        email: 'joao.silva@empresaabc.com',
        phone: '(11) 98888-8888',
        position: 'Diretor Financeiro'
      },
      createdAt: '2024-01-15',
      lastLogin: '2024-03-10',
      activeContracts: 3
    },
    {
      id: 2,
      name: 'Tech Innovations S.A.',
      email: 'contato@techinnovations.com',
      phone: '(11) 88888-8888',
      document: '98.765.432/0001-11',
      type: 'juridica',
      status: 'ativo',
      address: {
        street: 'Av. Paulista, 456',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      adminUser: {
        name: 'Maria Santos',
        email: 'maria.santos@techinnovations.com',
        phone: '(11) 97777-7777',
        position: 'CEO'
      },
      createdAt: '2024-02-20',
      lastLogin: '2024-03-08',
      activeContracts: 1
    },
    {
      id: 3,
      name: 'Tech Solutions S.A.',
      email: 'admin@techsolutions.com',
      phone: '(11) 77777-7777',
      document: '98.765.432/0001-10',
      type: 'juridica',
      status: 'inativo',
      address: {
        street: 'Rua da Tecnologia, 789',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04567-890'
      },
      adminUser: {
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@techsolutions.com',
        phone: '(11) 96666-6666',
        position: 'CTO'
      },
      createdAt: '2023-12-10',
      lastLogin: '2024-01-15',
      activeContracts: 0
    },
    {
      id: 4,
      name: 'Consultoria Empresarial Ltda',
      email: 'contato@consultoriaempresarial.com',
      phone: '(11) 66666-6666',
      document: '11.222.333/0001-44',
      type: 'juridica',
      status: 'pendente',
      address: {
        street: 'Rua dos Negócios, 321',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05678-901'
      },
      adminUser: {
        name: 'Ana Costa',
        email: 'ana.costa@consultoriaempresarial.com',
        phone: '(11) 95555-5555',
        position: 'Sócia Diretora'
      },
      createdAt: '2024-03-01',
      lastLogin: '2024-03-05',
      activeContracts: 1
    }
  ];

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClients(mockClients);
      setFilteredClients(mockClients);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter clients based on search and filters
  useEffect(() => {
    let filtered = clients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.document.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(client => client.type === typeFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter, typeFilter]);

  // Calculate statistics
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'ativo').length,
    inactive: clients.filter(c => c.status === 'inativo').length,
    pending: clients.filter(c => c.status === 'pendente').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
    totalContracts: clients.reduce((sum, c) => sum + c.activeContracts, 0)
  };

  // Event handlers
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCreateClient = () => {
    setCurrentClient(null);
    setModalMode('create');
    setClientForm({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      adminUser: {
        name: '',
        email: '',
        phone: '',
        position: ''
      }
    });
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setCurrentClient(client);
    setModalMode('edit');
    setClientForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      document: client.document,
      address: {
        street: client.address.street,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode
      },
      adminUser: {
        name: client.adminUser.name,
        email: client.adminUser.email,
        phone: client.adminUser.phone,
        position: client.adminUser.position
      }
    });
    setShowModal(true);
  };

  const handleViewClient = (client) => {
    setCurrentClient(client);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(clients.filter(c => c.id !== clientId));
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    }
  };

  const handleSelectClient = (clientId) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedClients.length > 0 && window.confirm(`Tem certeza que deseja excluir ${selectedClients.length} cliente(s)?`)) {
      setClients(clients.filter(c => !selectedClients.includes(c.id)));
      setSelectedClients([]);
    }
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exportando clientes...');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDocument = (document) => {
    // Sempre CNPJ para Pessoa Jurídica
    return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'text-success';
      case 'inativo': return 'text-error';
      case 'pendente': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onMenuToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        userRole="staff"
      />
      <main className={`pt-header-height nav-transition ${
        sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar-width'
      }`}>
        <div className="p-6 space-y-6">
          {/* Cabeçalho da Página */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  Gestão de Clientes
                </h1>
                <p className="text-text-secondary">
                  Gerencie todos os clientes da plataforma
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button 
                  onClick={handleExport}
                  className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition flex items-center space-x-2"
                >
                  <Icon name="Download" size={16} color="#2c3e50" />
                  <span>Exportar</span>
                </button>
                
                <button 
                  onClick={handleCreateClient}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} color="white" />
                  <span>Novo Cliente</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Building" size={16} color="#7f8c8d" />
                <span className="text-sm text-text-secondary">Total de Empresas</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{stats.total}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="CheckCircle" size={16} color="#27ae60" />
                <span className="text-sm text-text-secondary">Empresas Ativas</span>
              </div>
              <p className="text-xl font-semibold text-success">{stats.active}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="XCircle" size={16} color="#e74c3c" />
                <span className="text-sm text-text-secondary">Inativos</span>
              </div>
              <p className="text-xl font-semibold text-error">{stats.inactive}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Clock" size={16} color="#f39c12" />
                <span className="text-sm text-text-secondary">Pendentes</span>
              </div>
              <p className="text-xl font-semibold text-warning">{stats.pending}</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="FileText" size={16} color="#7f8c8d" />
                <span className="text-sm text-text-secondary">Contratos Ativos</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{stats.totalContracts}</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-surface border border-border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Icon 
                    name="Search" 
                    size={16} 
                    color="#7f8c8d" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    type="text"
                    placeholder="Nome, email ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tipo
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="w-full px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Ações em Lote */}
          {selectedClients.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-primary font-medium">
                  {selectedClients.length} cliente(s) selecionado(s)
                </span>
                <div className="flex space-x-3">
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error-700 nav-transition flex items-center space-x-2"
                  >
                    <Icon name="Trash2" size={16} color="white" />
                    <span>Excluir Selecionados</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabela de Clientes */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Icon name="Users" size={48} color="#bdc3c7" className="mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">Nenhum cliente encontrado</h3>
                <p className="text-text-secondary mb-4">Não há clientes que correspondam aos filtros aplicados.</p>
                <button
                  onClick={handleCreateClient}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition"
                >
                  Criar Primeiro Cliente
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-border focus:ring-primary"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Cliente</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">CNPJ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Admin. Responsável</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Último Login</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-text-primary">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-background nav-transition">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleSelectClient(client.id)}
                            className="rounded border-border focus:ring-primary"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-text-primary">{client.name}</div>
                            <div className="text-sm text-text-secondary">{client.email}</div>
                            <div className="text-sm text-text-secondary">{client.phone}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-primary">
                          {formatDocument(client.document)}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-primary">
                          <div>
                            <div className="font-medium">{client.adminUser.name}</div>
                            <div className="text-text-secondary">{client.adminUser.position}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${getStatusColor(client.status)}`}>
                            {getStatusLabel(client.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {new Date(client.lastLogin).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleViewClient(client)}
                              className="p-2 text-text-secondary hover:text-primary nav-transition"
                              title="Visualizar"
                            >
                              <Icon name="Eye" size={16} />
                            </button>
                            <button
                              onClick={() => handleEditClient(client)}
                              className="p-2 text-text-secondary hover:text-primary nav-transition"
                              title="Editar"
                            >
                              <Icon name="Edit" size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-2 text-text-secondary hover:text-error nav-transition"
                              title="Excluir"
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
        </div>
      </main>

      {/* Modal de Cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-text-primary">
                  {modalMode === 'create' ? 'Novo Cliente' : 
                   modalMode === 'edit' ? 'Editar Cliente' : 'Detalhes do Cliente'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-text-secondary hover:text-text-primary nav-transition"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {modalMode === 'view' ? (
                // View Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Nome</label>
                      <p className="text-text-secondary">{currentClient?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
                      <p className="text-text-secondary">{currentClient?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Telefone</label>
                      <p className="text-text-secondary">{currentClient?.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Documento</label>
                      <p className="text-text-secondary">{formatDocument(currentClient?.document || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Tipo</label>
                      <p className="text-text-secondary">Pessoa Jurídica</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
                      <span className={`font-medium ${getStatusColor(currentClient?.status)}`}>
                        {getStatusLabel(currentClient?.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Endereço</label>
                    <p className="text-text-secondary">
                      {currentClient?.address?.street}, {currentClient?.address?.city} - {currentClient?.address?.state}, {currentClient?.address?.zipCode}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Receita Total</label>
                      <p className="text-text-secondary">{formatCurrency(currentClient?.totalRevenue || 0)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Contratos Ativos</label>
                      <p className="text-text-secondary">{currentClient?.activeContracts}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Cliente desde</label>
                      <p className="text-text-secondary">{new Date(currentClient?.createdAt || '').toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
                <form className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-3">Dados da Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Nome da Empresa *</label>
                        <input
                          type="text"
                          value={clientForm.name}
                          onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Nome da empresa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Email Corporativo *</label>
                        <input
                          type="email"
                          value={clientForm.email}
                          onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="contato@empresa.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Telefone</label>
                        <input
                          type="tel"
                          value={clientForm.phone}
                          onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">CNPJ *</label>
                        <input
                          type="text"
                          value={clientForm.document}
                          onChange={(e) => setClientForm({...clientForm, document: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-3">Endereço da Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-primary mb-2">Rua</label>
                        <input
                          type="text"
                          value={clientForm.address.street}
                          onChange={(e) => setClientForm({...clientForm, address: {...clientForm.address, street: e.target.value}})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Rua, número"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Cidade</label>
                        <input
                          type="text"
                          value={clientForm.address.city}
                          onChange={(e) => setClientForm({...clientForm, address: {...clientForm.address, city: e.target.value}})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Cidade"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Estado</label>
                        <input
                          type="text"
                          value={clientForm.address.state}
                          onChange={(e) => setClientForm({...clientForm, address: {...clientForm.address, state: e.target.value}})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="SP"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">CEP</label>
                        <input
                          type="text"
                          value={clientForm.address.zipCode}
                          onChange={(e) => setClientForm({...clientForm, address: {...clientForm.address, zipCode: e.target.value}})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-3">Usuário Administrador</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Nome Completo *</label>
                        <input
                          type="text"
                          value={clientForm.adminUser.name}
                          onChange={(e) => setClientForm({...clientForm, adminUser: {...clientForm.adminUser, name: e.target.value}})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Nome do responsável"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Email *</label>
                        <input
                          type="email"
                          value={clientForm.adminUser.email}
                          onChange={(e) => setClientForm({...clientForm, adminUser: {...clientForm.adminUser, email: e.target.value}})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="usuario@empresa.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Telefone</label>
                        <input
                          type="tel"
                          value={clientForm.adminUser.phone}
                          onChange={(e) => setClientForm({...clientForm, adminUser: {...clientForm.adminUser, phone: e.target.value}})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Cargo</label>
                        <input
                          type="text"
                          value={clientForm.adminUser.position}
                          onChange={(e) => setClientForm({...clientForm, adminUser: {...clientForm.adminUser, position: e.target.value}})}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Diretor, Gerente, etc."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Validação básica
                        if (!clientForm.name || !clientForm.email || !clientForm.document || 
                            !clientForm.adminUser.name || !clientForm.adminUser.email) {
                          alert('Por favor, preencha todos os campos obrigatórios.');
                          return;
                        }
                        
                        // Aqui seria feita a integração com a API
                        console.log('Salvando cliente:', { 
                          mode: modalMode, 
                          clientData: clientForm,
                          adminUserData: clientForm.adminUser 
                        });
                        
                        setShowModal(false);
                        setCurrentClient(null);
                        setClientForm({
                          name: '',
                          email: '',
                          phone: '',
                          document: '',
                          address: {
                            street: '',
                            city: '',
                            state: '',
                            zipCode: ''
                          },
                          adminUser: {
                            name: '',
                            email: '',
                            phone: '',
                            position: ''
                          }
                        });
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition"
                    >
                      {modalMode === 'create' ? 'Criar Cliente' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;