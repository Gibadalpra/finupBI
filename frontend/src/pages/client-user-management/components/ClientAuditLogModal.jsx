import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ClientAuditLogModal = ({ onClose, users, currentCompany }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('7days');

  // Dados mock do log de auditoria específicos para a empresa cliente
  const auditLogs = [
    {
      id: 1,
      action: 'Usuário Criado',
      user: 'Admin Cliente',
      target: 'João Silva',
      details: `Criou novo usuário para ${currentCompany || 'empresa'} com permissões de visualização`,
      timestamp: new Date(Date.now() - 300000),
      category: 'user_management',
      severity: 'info',
      ipAddress: '192.168.1.150'
    },
    {
      id: 2,
      action: 'Permissão Atualizada',
      user: 'Admin Cliente',
      target: 'Maria Santos',
      details: 'Adicionou permissão de exportação de relatórios',
      timestamp: new Date(Date.now() - 1800000),
      category: 'permission_change',
      severity: 'warning',
      ipAddress: '192.168.1.150'
    },
    {
      id: 3,
      action: 'Usuário Desativado',
      user: 'Admin Cliente',
      target: 'Pedro Costa',
      details: 'Desativou conta do usuário por solicitação do RH',
      timestamp: new Date(Date.now() - 3600000),
      category: 'user_management',
      severity: 'warning',
      ipAddress: '192.168.1.150'
    },
    {
      id: 4,
      action: 'Função Alterada',
      user: 'Admin Cliente',
      target: 'Ana Oliveira',
      details: 'Alterou função de Client User para Client Admin',
      timestamp: new Date(Date.now() - 7200000),
      category: 'role_change',
      severity: 'info',
      ipAddress: '192.168.1.150'
    },
    {
      id: 5,
      action: 'Login Realizado',
      user: 'João Silva',
      target: 'Sistema',
      details: 'Login realizado com sucesso no portal do cliente',
      timestamp: new Date(Date.now() - 10800000),
      category: 'security',
      severity: 'info',
      ipAddress: '192.168.1.155'
    },
    {
      id: 6,
      action: 'Redefinição de Senha',
      user: 'Sistema',
      target: 'Maria Santos',
      details: 'Redefinição de senha solicitada e concluída com sucesso',
      timestamp: new Date(Date.now() - 14400000),
      category: 'security',
      severity: 'info',
      ipAddress: '192.168.1.160'
    },
    {
      id: 7,
      action: 'Relatório Exportado',
      user: 'Ana Oliveira',
      target: 'Relatório Financeiro',
      details: 'Exportou relatório financeiro mensal em formato PDF',
      timestamp: new Date(Date.now() - 18000000),
      category: 'data_access',
      severity: 'info',
      ipAddress: '192.168.1.165'
    },
    {
      id: 8,
      action: 'Configuração Alterada',
      user: 'Admin Cliente',
      target: 'Configurações da Empresa',
      details: 'Atualizou informações de contato da empresa',
      timestamp: new Date(Date.now() - 21600000),
      category: 'settings_change',
      severity: 'info',
      ipAddress: '192.168.1.150'
    }
  ];

  const tabs = [
    { id: 'all', label: 'Todas as Atividades', count: auditLogs?.length },
    { id: 'user_management', label: 'Gerenciamento de Usuários', count: auditLogs?.filter(log => log?.category === 'user_management')?.length },
    { id: 'permission_change', label: 'Permissões', count: auditLogs?.filter(log => log?.category === 'permission_change')?.length },
    { id: 'security', label: 'Segurança', count: auditLogs?.filter(log => log?.category === 'security')?.length },
    { id: 'role_change', label: 'Alterações de Função', count: auditLogs?.filter(log => log?.category === 'role_change')?.length },
    { id: 'data_access', label: 'Acesso a Dados', count: auditLogs?.filter(log => log?.category === 'data_access')?.length },
    { id: 'settings_change', label: 'Configurações', count: auditLogs?.filter(log => log?.category === 'settings_change')?.length }
  ];

  // Filtrar logs baseado na aba ativa, termo de busca e filtro de data
  const filteredLogs = auditLogs?.filter(log => {
    const matchesTab = activeTab === 'all' || log?.category === activeTab;
    const matchesSearch = !searchTerm || 
      log?.action?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      log?.user?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      log?.target?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      log?.details?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const now = new Date();
    const logDate = new Date(log?.timestamp);
    let matchesDate = true;
    
    switch (dateFilter) {
      case '1day':
        matchesDate = (now - logDate) <= 24 * 60 * 60 * 1000;
        break;
      case '7days':
        matchesDate = (now - logDate) <= 7 * 24 * 60 * 60 * 1000;
        break;
      case '30days':
        matchesDate = (now - logDate) <= 30 * 24 * 60 * 60 * 1000;
        break;
      case '90days':
        matchesDate = (now - logDate) <= 90 * 24 * 60 * 60 * 1000;
        break;
      default:
        matchesDate = true;
    }
    
    return matchesTab && matchesSearch && matchesDate;
  });

  const formatDateTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'info':
      default:
        return 'Info';
    }
  };

  const handleExport = () => {
    console.log('Exporting client audit logs...');
    // Implementar funcionalidade de exportação
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal p-4">
      <div className="bg-surface rounded-lg shadow-floating max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary">Log de Auditoria - {currentCompany || 'Minha Empresa'}</h2>
              <p className="text-sm text-text-secondary mt-1">Acompanhe todas as atividades dos usuários da sua empresa</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition text-sm"
              >
                <Icon name="Download" size={14} color="white" />
                <span>Exportar</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-background rounded-lg nav-transition"
              >
                <Icon name="X" size={20} color="var(--color-text-secondary)" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-border bg-background">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" size={16} color="var(--color-text-secondary)" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por ação, usuário ou detalhes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Date Filter */}
            <div className="sm:w-48">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os períodos</option>
                <option value="1day">Último dia</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="90days">Últimos 90 dias</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm nav-transition whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>{tab?.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab?.id ? 'bg-primary text-white' : 'bg-background text-text-secondary'
                }`}>
                  {tab?.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
          {filteredLogs?.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredLogs?.map((log) => (
                <div key={log?.id} className="px-6 py-4 hover:bg-background nav-transition">
                  <div className="flex items-start space-x-4">
                    {/* Severity Indicator */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getSeverityColor(log?.severity)} flex-shrink-0 mt-1`}>
                      <Icon name={getSeverityIcon(log?.severity)} size={16} color="currentColor" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-text-primary">{log?.action}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log?.severity)}`}>
                              {log?.severity}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mb-2">{log?.details}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                            <span className="flex items-center space-x-1">
                              <Icon name="User" size={12} color="currentColor" />
                              <span>Por: {log?.user}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Icon name="Target" size={12} color="currentColor" />
                              <span>Alvo: {log?.target}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Icon name="Globe" size={12} color="currentColor" />
                              <span>IP: {log?.ipAddress}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-xs text-text-secondary ml-4">
                          <p>{formatDateTime(log?.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="FileText" size={32} color="var(--color-primary)" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Nenhum log de auditoria encontrado</h3>
              <p className="text-text-secondary">Nenhuma atividade corresponde aos seus filtros atuais.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-background">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Mostrando {filteredLogs?.length} de {auditLogs?.length} atividades</span>
            <span>Última atualização: {formatDateTime(new Date())}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAuditLogModal;