import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';


// Components
import PersonalInfoForm from './components/PersonalInfoForm';
import SecurityForm from './components/SecurityForm';
import NotificationForm from './components/NotificationForm';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('staff'); // Mock user role
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Mock user data - em um projeto real, isso viria de um contexto ou API
  const [userData, setUserData] = useState({
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@accountingpro.com',
    phone: '(11) 99999-9999',
    position: 'Senior Accountant',
    department: 'Contabilidade',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil'
    },
    preferences: {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      dateFormat: 'DD/MM/YYYY',
      currency: 'BRL'
    },
    notifications: {
      email: true,
      push: true,
      reports: true,
      updates: false
    }
  });

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleDataChange = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em um projeto real, aqui faria a chamada para a API
      console.log('Dados salvos:', userData);
      
      alert('Perfil atualizado com sucesso!');
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Resetar dados ou navegar de volta
    if (hasChanges) {
      const confirmDiscard = window.confirm('Você tem alterações não salvas. Deseja descartar?');
      if (confirmDiscard) {
        setHasChanges(false);
        // Aqui você poderia recarregar os dados originais
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const tabs = [
    {
      id: 'personal',
      label: 'Informações Pessoais',
      icon: 'User',
      description: 'Dados pessoais e de contato'
    },
    {
      id: 'security',
      label: 'Segurança',
      icon: 'Shield',
      description: 'Senha e configurações de segurança'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: 'Bell',
      description: 'Preferências de notificação'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoForm
            userData={userData}
            onChange={handleDataChange}
            loading={loading}
          />
        );
      case 'security':
        return (
          <SecurityForm
            userData={userData}
            onChange={handleDataChange}
            loading={loading}
          />
        );
      case 'notifications':
        return (
          <NotificationForm
            userData={userData}
            onChange={handleDataChange}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={{
          name: userData.name,
          email: userData.email,
          role: userData.position,
          avatar: userData.avatar
        }}
        onMenuToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        userRole={userRole}
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
                  Configurações do Perfil
                </h1>
                <p className="text-text-secondary">
                  Gerencie suas informações pessoais e preferências da conta
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition flex items-center space-x-2"
                >
                  <Icon name="X" size={16} color="#2c3e50" />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Icon name="Loader2" size={16} color="white" className="animate-spin" />
                  ) : (
                    <Icon name="Save" size={16} color="white" />
                  )}
                  <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Sidebar com foto e navegação */}
            <div className="xl:col-span-1">
              <div className="bg-surface border border-border rounded-lg p-6">
                {/* Foto do perfil */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-card"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-700 nav-transition">
                      <Icon name="Camera" size={16} color="white" />
                    </button>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{userData.name}</h3>
                  <p className="text-sm text-text-secondary">{userData.position}</p>
                  <p className="text-sm text-text-secondary">{userData.department}</p>
                </div>
                  
                {/* Navegação das abas */}
                <nav className="mt-8 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg nav-transition flex items-center space-x-3 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary border border-primary-200'
                          : 'text-text-primary hover:bg-background'
                      }`}
                    >
                      <Icon 
                        name={tab.icon} 
                        size={20} 
                        color={activeTab === tab.id ? '#283593' : '#757575'} 
                      />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-sm text-text-secondary">{tab.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>
                </div>
              </div>

            {/* Conteúdo principal */}
            <div className="xl:col-span-3">
              <div className="bg-surface border border-border rounded-lg">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;