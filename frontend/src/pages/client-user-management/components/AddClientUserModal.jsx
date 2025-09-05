import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AddClientUserModal = ({ onClose, onAddUser, currentCompany }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Client User',
    department: '',
    phone: '',
    permissions: [],
    sendInvite: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opções de departamentos
  const departments = [
    'Administração',
    'Financeiro',
    'Operações',
    'RH',
    'TI',
    'Vendas',
    'Marketing',
    'Jurídico',
    'Compras',
    'Outro'
  ];

  // Opções de permissões baseadas na função
  const getAvailablePermissions = (role) => {
    const basePermissions = [
      { id: 'portal_access', label: 'Portal do Cliente', description: 'Acesso ao portal principal' },
      { id: 'view_reports', label: 'Visualizar Relatórios', description: 'Visualizar relatórios financeiros' },
      { id: 'export_data', label: 'Exportar Dados', description: 'Exportar relatórios e dados' },
      { id: 'view_transactions', label: 'Visualizar Transações', description: 'Acessar histórico de transações' }
    ];

    const adminPermissions = [
      { id: 'manage_users', label: 'Gerenciar Usuários', description: 'Adicionar e gerenciar usuários da empresa' },
      { id: 'manage_settings', label: 'Configurações', description: 'Alterar configurações da empresa' },
      { id: 'view_audit_logs', label: 'Logs de Auditoria', description: 'Visualizar logs de atividades' }
    ];

    return role === 'Client Admin' ? [...basePermissions, ...adminPermissions] : basePermissions;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.department) {
      newErrors.department = 'Departamento é obrigatório';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'Selecione pelo menos uma permissão';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mapear IDs de permissões para labels
      const availablePermissions = getAvailablePermissions(formData.role);
      const permissionLabels = formData.permissions.map(id => 
        availablePermissions.find(p => p.id === id)?.label
      ).filter(Boolean);

      const userData = {
        ...formData,
        permissions: permissionLabels,
        status: 'Active',
        company: currentCompany
      };

      onAddUser(userData);
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availablePermissions = getAvailablePermissions(formData.role);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Adicionar Novo Usuário
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Adicionar usuário para {currentCompany}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-border'
                    }`}
                    placeholder="Digite o nome completo"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-border'
                    }`}
                    placeholder="usuario@empresa.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Departamento *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.department ? 'border-red-300' : 'border-border'
                    }`}
                  >
                    <option value="">Selecione o departamento</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-600 text-sm mt-1">{errors.department}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Função e Permissões */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">
                Função e Permissões
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Função
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    handleInputChange('role', e.target.value);
                    // Limpar permissões quando mudar a função
                    handleInputChange('permissions', []);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Client User">Client User</option>
                  <option value="Client Admin">Client Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Permissões *
                </label>
                <div className="space-y-3">
                  {availablePermissions.map(permission => (
                    <div key={permission.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="mt-1 rounded border-border text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={permission.id}
                          className="block text-sm font-medium text-text-primary cursor-pointer"
                        >
                          {permission.label}
                        </label>
                        <p className="text-xs text-text-secondary">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.permissions && (
                  <p className="text-red-600 text-sm mt-2">{errors.permissions}</p>
                )}
              </div>
            </div>

            {/* Opções Adicionais */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">
                Opções Adicionais
              </h3>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="sendInvite"
                  checked={formData.sendInvite}
                  onChange={(e) => handleInputChange('sendInvite', e.target.checked)}
                  className="mt-1 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <label 
                    htmlFor="sendInvite"
                    className="block text-sm font-medium text-text-primary cursor-pointer"
                  >
                    Enviar email de convite
                  </label>
                  <p className="text-xs text-text-secondary">
                    O usuário receberá um email com instruções para acessar o portal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <Icon name="Loader2" size={16} className="animate-spin" />
              )}
              <span>{isSubmitting ? 'Adicionando...' : 'Adicionar Usuário'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientUserModal;