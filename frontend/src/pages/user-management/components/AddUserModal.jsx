import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AddUserModal = ({ onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
    department: '',
    userType: 'internal',
    clientCompany: '',
    permissions: [],
    status: 'Active',
    sendInvite: true
  });

  const [errors, setErrors] = useState({});

  const availablePermissions = [
    'Acesso Total',
    'Gerenciamento de Usuários',
    'Gerenciamento de Transações',
    'Relatórios Financeiros',
    'Conciliação Bancária',
    'Conformidade Fiscal',
    'Portal do Cliente',
    'Visualizar Relatórios',
    'Exportar Dados',
    'Logs de Auditoria'
  ];

  const rolePermissions = {
    'Partner': ['Acesso Total', 'Gerenciamento de Usuários', 'Gerenciamento de Transações', 'Relatórios Financeiros', 'Conciliação Bancária', 'Conformidade Fiscal', 'Portal do Cliente', 'Visualizar Relatórios', 'Exportar Dados', 'Logs de Auditoria'],
    'Staff': ['Gerenciamento de Transações', 'Relatórios Financeiros', 'Conciliação Bancária', 'Conformidade Fiscal', 'Visualizar Relatórios', 'Exportar Dados'],
    'Freelancer': ['Gerenciamento de Transações', 'Relatórios Financeiros', 'Visualizar Relatórios', 'Exportar Dados'],
    'Client Admin': ['Portal do Cliente', 'Visualizar Relatórios', 'Exportar Dados'],
    'Client User': ['Portal do Cliente', 'Visualizar Relatórios']
  };

  const internalRoles = ['Partner', 'Staff', 'Freelancer'];
  const externalRoles = ['Client Admin', 'Client User'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleChange = (role) => {
    const isExternal = externalRoles.includes(role);
    setFormData(prev => ({
      ...prev,
      role,
      userType: isExternal ? 'external' : 'internal',
      permissions: rolePermissions?.[role] || [],
      clientCompany: isExternal ? prev.clientCompany : ''
    }));
  };

  const handleUserTypeChange = (userType) => {
    const defaultRole = userType === 'internal' ? 'Staff' : 'Client Admin';
    setFormData(prev => ({
      ...prev,
      userType,
      role: defaultRole,
      permissions: rolePermissions?.[defaultRole] || [],
      clientCompany: userType === 'external' ? prev.clientCompany : ''
    }));
  };

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev?.permissions?.includes(permission)
        ? prev?.permissions?.filter(p => p !== permission)
        : [...prev?.permissions, permission]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Por favor, insira um endereço de email válido';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Número de telefone é obrigatório';
    }

    if (!formData?.department?.trim()) {
      newErrors.department = 'Departamento é obrigatório';
    }

    if (formData?.userType === 'external' && !formData?.clientCompany?.trim()) {
      newErrors.clientCompany = 'Empresa cliente é obrigatória para usuários externos';
    }

    if (formData?.permissions?.length === 0) {
      newErrors.permissions = 'Pelo menos uma permissão deve ser selecionada';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onAddUser(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal p-4">
      <div className="bg-surface rounded-lg shadow-floating max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-text-primary">Adicionar Novo Usuário</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg nav-transition"
          >
            <Icon name="X" size={20} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="px-6 py-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData?.name}
                    onChange={(e) => handleInputChange('name', e?.target?.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent ${
                      errors?.name ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Digite o nome completo"
                  />
                  {errors?.name && <p className="mt-1 text-sm text-error">{errors?.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Endereço de Email *
                  </label>
                  <input
                    type="email"
                    value={formData?.email}
                    onChange={(e) => handleInputChange('email', e?.target?.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent ${
                      errors?.email ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Digite o endereço de email"
                  />
                  {errors?.email && <p className="mt-1 text-sm text-error">{errors?.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Número de Telefone *
                  </label>
                  <input
                    type="tel"
                    value={formData?.phone}
                    onChange={(e) => handleInputChange('phone', e?.target?.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent ${
                      errors?.phone ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Digite o número de telefone"
                  />
                  {errors?.phone && <p className="mt-1 text-sm text-error">{errors?.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    value={formData?.department}
                    onChange={(e) => handleInputChange('department', e?.target?.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent ${
                      errors?.department ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Digite o departamento"
                  />
                  {errors?.department && <p className="mt-1 text-sm text-error">{errors?.department}</p>}
                </div>
              </div>
            </div>

            {/* User Type and Role */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Tipo de Usuário e Função</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Tipo de Usuário *
                  </label>
                  <select
                    value={formData?.userType}
                    onChange={(e) => handleUserTypeChange(e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent"
                  >
                    <option value="internal">Interno (Consultoria)</option>
                    <option value="external">Externo (Cliente)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Função *
                  </label>
                  <select
                    value={formData?.role}
                    onChange={(e) => handleRoleChange(e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent"
                  >
                    {formData?.userType === 'internal' ? (
                      <>
                        <option value="Partner">Partner</option>
                        <option value="Staff">Staff</option>
                        <option value="Freelancer">Freelancer</option>
                      </>
                    ) : (
                      <>
                        <option value="Client Admin">Client Admin</option>
                        <option value="Client User">Client User</option>
                      </>
                    )}
                  </select>
                </div>

                {formData?.userType === 'external' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Empresa Cliente *
                    </label>
                    <input
                      type="text"
                      value={formData?.clientCompany}
                      onChange={(e) => handleInputChange('clientCompany', e?.target?.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent ${
                        errors?.clientCompany ? 'border-error' : 'border-border'
                      }`}
                      placeholder="Digite o nome da empresa cliente"
                    />
                    {errors?.clientCompany && <p className="mt-1 text-sm text-error">{errors?.clientCompany}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Status *
                  </label>
                  <select
                    value={formData?.status}
                    onChange={(e) => handleInputChange('status', e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-transparent"
                  >
                    <option value="Active">Ativo</option>
                    <option value="Inactive">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Permissões</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePermissions?.map((permission) => (
                  <label key={permission} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-background nav-transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.permissions?.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-text-primary">{permission}</span>
                  </label>
                ))}
              </div>
              {errors?.permissions && <p className="mt-2 text-sm text-error">{errors?.permissions}</p>}
            </div>

            {/* Additional Options */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Opções Adicionais</h3>
              <label className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-background nav-transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData?.sendInvite}
                  onChange={(e) => handleInputChange('sendInvite', e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">Enviar email de convite</span>
                  <p className="text-xs text-text-secondary">O usuário receberá um email com instruções de login</p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-background flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-surface nav-transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition flex items-center space-x-2"
            >
              <Icon name="UserPlus" size={16} color="white" />
              <span>Adicionar Usuário</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;