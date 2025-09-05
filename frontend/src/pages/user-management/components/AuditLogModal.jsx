import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AuditLogModal = ({ onClose, users }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('7days');

  // Dados mock do log de auditoria
  const auditLogs = [
    {
      id: 1,
      action: 'Usuário Criado',
      user: 'Sarah Johnson',
      target: 'Michael Chen',
      details: 'Criou novo membro da equipe com permissões de gerenciamento de transações',
      timestamp: new Date(Date.now() - 300000),
      category: 'user_management',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      action: 'Permissão Atualizada',
      user: 'Sarah Johnson',
      target: 'Emily Rodriguez',
      details: 'Adicionou permissão de relatórios financeiros à conta freelancer',
      timestamp: new Date(Date.now() - 1800000),
      category: 'permission_change',
      severity: 'warning',
      ipAddress: '192.168.1.100'
    },
    {
      id: 3,
      action: 'Usuário Desativado',
      user: 'Sarah Johnson',
      target: 'David Thompson',
      details: 'Desativou conta do cliente devido à conclusão do contrato',
      timestamp: new Date(Date.now() - 3600000),
      category: 'user_management',
      severity: 'warning',
      ipAddress: '192.168.1.100'
    },
    {
      id: 4,
      action: 'Função Alterada',
      user: 'Sarah Johnson',
      target: 'Lisa Wang',
      details: 'Alterou função de Freelancer para membro da Equipe',
      timestamp: new Date(Date.now() - 7200000),
      category: 'role_change',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: 5,
      action: 'Atualização em Massa de Permissões',
      user: 'Sarah Johnson',
      target: 'Múltiplos Usuários (3)',
      details: 'Atualizou permissões de reconciliação bancária para membros da equipe',
      timestamp: new Date(Date.now() - 10800000),
      category: 'permission_change',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: 6,
      action: 'Tentativa de Login Falhada',
      user: 'Desconhecido',
      target: 'michael.chen@company.com',
      details: 'Múltiplas tentativas de login falhadas detectadas de IP suspeito',
      timestamp: new Date(Date.now() - 14400000),
      category: 'security',
      severity: 'error',
      ipAddress: '203.0.113.45'
    },
    {
      id: 7,
      action: 'Redefinição de Senha',
      user: 'Sistema',
      target: 'Emily Rodriguez',
      details: 'Redefinição de senha solicitada e concluída com sucesso',
      timestamp: new Date(Date.now() - 18000000),
      category: 'security',
      severity: 'info',
      ipAddress: '198.51.100.23'
    },
    {
      id: 8,
      action: 'Usuário Convidado',
      user: 'Sarah Johnson',
      target: 'john.doe@newclient.com',
      details: 'Enviou email de convite para novo usuário cliente',
      timestamp: new Date(Date.now() - 21600000),
      category: 'user_management',
      severity: 'info',
      ipAddress: '192.168.1.100'
    }
  ];

  const tabs = [
    { id: 'all', label: 'Todas as Atividades', count: auditLogs?.length },
    { id: 'user_management', label: 'Gerenciamento de Usuários', count: auditLogs?.filter(log => log?.category === 'user_management')?.length },
    { id: 'permission_change', label: 'Permissões', count: auditLogs?.filter(log => log?.category === 'permission_change')?.length },
    { id: 'security', label: 'Segurança', count: auditLogs?.filter(log => log?.category === 'security')?.length },
    { id: 'role_change', label: 'Alterações de Função', count: auditLogs?.filter(log => log?.category === 'role_change')?.length }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'bg-error-100 text-error-700';
      case 'warning': return 'bg-warning-100 text-warning-700';
      case 'info': return 'bg-primary-100 text-primary-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Circle';
    }
  };

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  const filteredLogs = auditLogs?.filter(log => {
    const matchesTab = activeTab === 'all' || log?.category === activeTab;
    const matchesSearch = searchTerm === '' || 
      log?.action?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      log?.user?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      log?.target?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      log?.details?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    // Date filter logic
    const now = new Date();
    const logDate = log?.timestamp;
    let matchesDate = true;
    
    switch (dateFilter) {
      case '1day':
        matchesDate = now - logDate < 86400000;
        break;
      case '7days':
        matchesDate = now - logDate < 604800000;
        break;
      case '30days':
        matchesDate = now - logDate < 2592000000;
        break;
      default:
        matchesDate = true;
    }
    
    return matchesTab && matchesSearch && matchesDate;
  });

  const handleExport = () => {
    console.log('Exporting audit logs...');
    // Implement export functionality
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal p-4">
      <div className="bg-surface rounded-lg shadow-floating max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary">Log de Auditoria</h2>
              <p className="text-sm text-text-secondary mt-1">Acompanhe todas as atividades de gerenciamento de usuários e eventos de segurança</p>
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
                  placeholder="Buscar logs de auditoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-text-secondary">Período:</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e?.target?.value)}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm bg-surface"
              >
                <option value="1day">Últimas 24 horas</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="all">Todo o período</option>
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

export default AuditLogModal;