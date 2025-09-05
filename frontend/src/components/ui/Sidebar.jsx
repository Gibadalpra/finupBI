import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = ({ collapsed, onToggle, userRole = 'staff' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  const navigationItems = [
    {
      section: 'home',
      label: '',
      items: [
        {
          label: 'Home',
          path: '/',
          icon: 'Home',
          roles: ['partner', 'staff', 'freelancer', 'client'],
          tooltip: 'Página inicial - Hub central dos módulos'
        }
      ]
    },
    {
      section: 'reports',
      label: 'Relatórios',
      items: [
        {
          label: 'Relatórios Financeiros',
          path: '/financial-reports',
          icon: 'FileText',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Gerar relatórios financeiros'
        },
        {
          label: 'Inadimplência',
          path: '/inadimplencia',
          icon: 'AlertTriangle',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Análise e gestão de clientes em atraso'
        },
        {
          label: 'Painel de Controle',
          path: '/dashboard',
          icon: 'LayoutDashboard',
          roles: ['partner', 'staff', 'freelancer', 'client'],
          tooltip: 'Visão geral financeira e insights'
        }
      ]
    },
    {
      section: 'imports',
      label: 'Importações',
      items: [
        {
          label: 'Importação Realizado',
          path: '/data-import',
          icon: 'Upload',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Importar arquivos XLS/CSV para processamento BI'
        },
        {
          label: 'Importação Planejado',
          path: '/planned-import',
          icon: 'Calendar',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Importar arquivos de planejamento financeiro'
        },
        {
          label: 'Mapeamento de Contas',
          path: '/account-mapping',
          icon: 'ArrowLeftRight',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Mapear contas importadas para o Plano de Contas'
        }
      ]
    },
    {
      section: 'management',
      label: 'Gestão',
      items: [
        {
          label: 'Gestão de Usuários',
          path: '/user-management',
          icon: 'Users',
          roles: ['partner', 'staff'],
          tooltip: 'Gerenciar usuários do sistema'
        },
        {
          label: 'Gestão de Clientes',
          path: '/client-management',
          icon: 'UserCheck',
          roles: ['partner', 'staff'],
          tooltip: 'Gerenciar clientes do sistema'
        },
        {
          label: 'Meus Usuários',
          path: '/client-user-management',
          icon: 'UserCog',
          roles: ['client'],
          tooltip: 'Gerenciar usuários da minha empresa'
        },
        {
          label: 'Portal do Cliente',
          path: '/client-portal',
          icon: 'UserCheck',
          roles: ['partner', 'staff', 'freelancer', 'client'],
          tooltip: 'Acesso ao portal do cliente'
        },
        {
          label: 'Plano de Contas',
          path: '/chart-of-accounts',
          icon: 'TreePine',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Gerenciar plano de contas dos clientes'
        }
      ]
    },
    {
      section: 'others',
      label: 'Outras',
      items: [
        {
          label: 'Gestão de Transações',
          path: '/transactions-management',
          icon: 'Receipt',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Gerenciar transações financeiras'
        },
        {
          label: 'Conciliação Bancária',
          path: '/bank-reconciliation',
          icon: 'Building2',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Conciliar extratos bancários'
        },
        {
          label: 'Centro de Conformidade Fiscal',
          path: '/tax-compliance-center',
          icon: 'Calculator',
          roles: ['partner', 'staff', 'freelancer'],
          tooltip: 'Gerenciar obrigações fiscais'
        }
      ]
    }
  ];

  const filteredNavigation = useMemo(() => {
    return navigationItems.map(section => ({
      ...section,
      items: section.items.filter(item => item.roles.includes(userRole))
    })).filter(section => section.items.length > 0);
  }, [userRole]);

  useEffect(() => {
    const currentPath = location?.pathname;
    for (const section of navigationItems) {
      for (const item of section?.items) {
        if (item?.path === currentPath) {
          setActiveSection(section?.section);
          return;
        }
      }
    }
  }, [location?.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isItemActive = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-sidebar"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed top-header-height left-0 h-[calc(100vh-64px)] bg-primary border-r border-border z-sidebar
        nav-transition lg:translate-x-0
        ${collapsed ? '-translate-x-full lg:w-sidebar-collapsed' : 'translate-x-0 w-sidebar-width'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-primary-700">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <h2 className="font-heading font-semibold text-white">Navegação</h2>
              )}
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-primary-700 nav-transition"
                aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
              >
                <Icon 
                  name={collapsed ? 'ChevronRight' : 'ChevronLeft'} 
                  size={16} 
                  color="white" 
                />
              </button>
            </div>
          </div>

          {/* Navigation Content */}
          <nav className="flex-1 overflow-y-auto py-4">
            {filteredNavigation?.map((section) => (
              <div key={section?.section} className="mb-6">
                {!collapsed && section?.label && (
                  <h3 className="px-4 mb-2 text-xs font-caption font-medium text-primary-200 uppercase tracking-wider">
                    {section?.label}
                  </h3>
                )}
                
                <ul className="space-y-1 px-2">
                  {section?.items?.map((item) => (
                    <li key={item?.path}>
                      <button
                        onClick={() => handleNavigation(item?.path)}
                        className={`
                          w-full flex items-center px-3 py-3 rounded-lg nav-transition
                          ${isItemActive(item?.path)
                            ? 'bg-white text-primary shadow-card' :'text-primary-100 hover:bg-primary-700 hover:text-white'
                          }
                          ${collapsed ? 'justify-center' : 'justify-start space-x-3'}
                        `}
                        title={collapsed ? item?.tooltip : ''}
                        aria-label={item?.label}
                      >
                        <Icon 
                          name={item?.icon} 
                          size={20} 
                          color={isItemActive(item?.path) ? '#283593' : '#E8EAF6'} 
                        />
                        {!collapsed && (
                          <span className="font-nav text-nav font-medium">{item?.label}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;