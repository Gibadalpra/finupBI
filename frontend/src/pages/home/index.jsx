import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';

/**
 * Página Home - Tela inicial após o login
 * 
 * Esta página serve como hub central para acessar os diferentes módulos do sistema.
 * Contém botões para navegar para os módulos: Financeiro, Vendas, Compras e Estoque.
 * 
 * @component
 * @returns {JSX.Element} Componente da página home
 */
const Home = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('staff'); // Mock user role

  // Mock user data - dados simulados do usuário
  const mockUser = {
    name: "Sarah Johnson",
    email: "sarah.johnson@accountingpro.com",
    role: "Senior Accountant",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  };

  /**
   * Configuração dos módulos do sistema
   * Cada módulo possui informações sobre título, descrição, ícone, cor e rota
   */
  const modules = [
    {
      id: 'financeiro',
      title: 'Módulo Financeiro',
      description: 'Gestão completa das finanças, relatórios e transações',
      icon: 'DollarSign',
      color: 'blue',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      route: '/dashboard',
      available: true,
      features: [
        'Dashboard Financeiro',
        'Gestão de Transações',
        'Relatórios Financeiros',
        'Conciliação Bancária',
        'Portal do Cliente',
        'Centro de Conformidade Fiscal'
      ]
    },
    {
      id: 'vendas',
      title: 'Módulo Vendas',
      description: 'Controle de vendas, clientes e oportunidades',
      icon: 'TrendingUp',
      color: 'green',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      route: '/vendas',
      available: false,
      features: [
        'Pipeline de Vendas',
        'Gestão de Clientes',
        'Propostas e Orçamentos',
        'Relatórios de Vendas'
      ]
    },
    {
      id: 'compras',
      title: 'Módulo Compras',
      description: 'Gestão de fornecedores, pedidos e compras',
      icon: 'ShoppingCart',
      color: 'orange',
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      route: '/compras',
      available: false,
      features: [
        'Gestão de Fornecedores',
        'Pedidos de Compra',
        'Controle de Recebimento',
        'Relatórios de Compras'
      ]
    },
    {
      id: 'estoque',
      title: 'Módulo Estoque',
      description: 'Controle de inventário e movimentações',
      icon: 'Package',
      color: 'purple',
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      route: '/estoque',
      available: false,
      features: [
        'Controle de Inventário',
        'Movimentações de Estoque',
        'Relatórios de Estoque',
        'Alertas de Reposição'
      ]
    }
  ];

  /**
   * Função para navegar para um módulo específico
   * @param {Object} module - Objeto do módulo selecionado
   */
  const handleModuleClick = (module) => {
    if (module.available) {
      navigate(module.route);
    } else {
      // Para módulos não disponíveis, mostra uma mensagem
      alert(`${module.title} estará disponível em breve!`);
    }
  };

  /**
   * Função para obter as classes CSS baseadas na cor do módulo
   * @param {string} color - Cor do módulo
   * @param {boolean} available - Se o módulo está disponível
   * @returns {string} Classes CSS
   */
  const getModuleClasses = (color, available) => {
    const baseClasses = "group relative overflow-hidden rounded-lg p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer";
    
    if (!available) {
      return `${baseClasses} bg-gray-100 border border-gray-200 opacity-75`;
    }

    const colorClasses = {
      blue: "bg-gradient-to-br from-blue-500 to-blue-700 border border-blue-300 hover:from-blue-600 hover:to-blue-800",
      green: "bg-gradient-to-br from-green-500 to-green-700 border border-green-300 hover:from-green-600 hover:to-green-800",
      orange: "bg-gradient-to-br from-orange-500 to-orange-700 border border-orange-300 hover:from-orange-600 hover:to-orange-800",
      purple: "bg-gradient-to-br from-purple-500 to-purple-700 border border-purple-300 hover:from-purple-600 hover:to-purple-800"
    };

    return `${baseClasses} ${colorClasses[color] || colorClasses.blue} text-white`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
      <Header 
        user={mockUser}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex">
        {/* Sidebar Component */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          userRole={userRole}
        />
        
        {/* Main Content */}
        <main className={`pt-header-height nav-transition ${
          sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar-width'
        }`}>
          <div className="p-6 space-y-6">
            {/* Cabeçalho da Página */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
                    Home
                  </h1>
                  <p className="text-text-secondary">
                    Sua plataforma completa de gestão empresarial. Escolha um módulo abaixo para começar.
                  </p>
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={getModuleClasses(module.color, module.available)}
                  onClick={() => handleModuleClick(module)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-16 h-16 transform translate-x-4 -translate-y-4">
                      <div className="w-full h-full rounded-full border-2 border-current"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 transform -translate-x-2 translate-y-2">
                      <div className="w-full h-full rounded-full border-2 border-current"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          module.available 
                            ? 'bg-white bg-opacity-20' 
                            : 'bg-gray-300'
                        }`}>
                          <Icon 
                            name={module.icon} 
                            className={`w-5 h-5 ${
                              module.available ? 'text-white' : 'text-gray-500'
                            }`} 
                          />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${
                            module.available ? 'text-white' : 'text-gray-600'
                          }`}>
                            {module.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        module.available 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {module.available ? 'Disponível' : 'Em Breve'}
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-sm mb-4 ${
                      module.available ? 'text-white text-opacity-90' : 'text-gray-600'
                    }`}>
                      {module.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1">
                      {module.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon 
                            name="Check" 
                            className={`w-3 h-3 ${
                              module.available ? 'text-white' : 'text-gray-500'
                            }`} 
                          />
                          <span className={`text-xs ${
                            module.available ? 'text-white text-opacity-80' : 'text-gray-500'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                      {module.features.length > 2 && (
                        <div className="flex items-center space-x-2">
                          <Icon 
                            name="MoreHorizontal" 
                            className={`w-3 h-3 ${
                              module.available ? 'text-white' : 'text-gray-500'
                            }`} 
                          />
                          <span className={`text-xs ${
                            module.available ? 'text-white text-opacity-80' : 'text-gray-500'
                          }`}>
                            +{module.features.length - 2} mais
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        module.available 
                          ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white' 
                          : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                      }`}>
                        <span>{module.available ? 'Acessar' : 'Em Breve'}</span>
                        {module.available && (
                          <Icon name="ArrowRight" className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Info */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-border">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Icon name="Info" className="w-5 h-5 text-secondary-500" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    Sobre os Módulos
                  </h3>
                </div>
                <p className="text-text-secondary max-w-3xl mx-auto">
                  O <strong>Módulo Financeiro</strong> já está disponível com todas as funcionalidades. 
                  Os demais módulos estão em desenvolvimento e serão lançados em breve. 
                  Fique atento às atualizações!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;