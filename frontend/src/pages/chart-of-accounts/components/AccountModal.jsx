import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const AccountModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  account = null, 
  chartOfAccounts = [], 
  mode = 'add' // 'add' ou 'edit'
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Grupo',
    level: 1,
    parentId: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Opções de tipo baseadas no nível
  const getTypeOptions = (level) => {
    switch (level) {
      case 1:
        return ['Grupo'];
      case 2:
        return ['SubGrupo'];
      case 3:
        return ['Conta'];
      default:
        return ['Grupo'];
    }
  };

  // Obter opções de parent baseadas no nível
  const getParentOptions = (level) => {
    if (level === 1) return [];
    
    return chartOfAccounts.filter(item => {
      if (level === 2) return item.level === 1; // SubGrupos podem ter Grupos como parent
      if (level === 3) return item.level === 2; // Contas podem ter SubGrupos como parent
      return false;
    });
  };

  // Gerar próximo código automaticamente
  const generateNextCode = (level, parentId = null) => {
    let existingCodes = [];
    
    if (level === 1) {
      // Para grupos, pegar todos os códigos de nível 1
      existingCodes = chartOfAccounts
        .filter(item => item.level === 1)
        .map(item => parseInt(item.code))
        .filter(code => !isNaN(code));
    } else if (level === 2 && parentId) {
      // Para subgrupos, pegar códigos do parent específico
      const parent = chartOfAccounts.find(item => item.id === parentId);
      if (parent) {
        const parentCode = parent.code;
        existingCodes = chartOfAccounts
          .filter(item => item.level === 2 && item.parentId === parentId)
          .map(item => {
            const codeParts = item.code.split('.');
            return codeParts.length > 1 ? parseInt(codeParts[1]) : 0;
          })
          .filter(code => !isNaN(code));
      }
    } else if (level === 3 && parentId) {
      // Para contas, pegar códigos do parent específico
      const parent = chartOfAccounts.find(item => item.id === parentId);
      if (parent) {
        existingCodes = chartOfAccounts
          .filter(item => item.level === 3 && item.parentId === parentId)
          .map(item => {
            const codeParts = item.code.split('.');
            return codeParts.length > 2 ? parseInt(codeParts[2]) : 0;
          })
          .filter(code => !isNaN(code));
      }
    }
    
    const nextNumber = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    
    if (level === 1) {
      return nextNumber.toString();
    } else if (level === 2 && parentId) {
      const parent = chartOfAccounts.find(item => item.id === parentId);
      return parent ? `${parent.code}.${nextNumber}` : nextNumber.toString();
    } else if (level === 3 && parentId) {
      const parent = chartOfAccounts.find(item => item.id === parentId);
      return parent ? `${parent.code}.${nextNumber}` : nextNumber.toString();
    }
    
    return nextNumber.toString();
  };

  // Inicializar formulário quando modal abrir ou account mudar
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && account) {
        setFormData({
          code: account.code || '',
          name: account.name || '',
          type: account.type || 'Grupo',
          level: account.level || 1,
          parentId: account.parentId || '',
          description: account.description || ''
        });
      } else {
        // Modo adicionar - gerar código automaticamente
        const newCode = generateNextCode(1);
        setFormData({
          code: newCode,
          name: '',
          type: 'Grupo',
          level: 1,
          parentId: '',
          description: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, account, mode, chartOfAccounts]);

  // Atualizar código quando nível ou parent mudar
  useEffect(() => {
    if (mode === 'add' && formData.level) {
      const newCode = generateNextCode(formData.level, formData.parentId);
      setFormData(prev => ({ ...prev, code: newCode }));
    }
  }, [formData.level, formData.parentId, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Atualizar tipo automaticamente baseado no nível
    if (field === 'level') {
      const typeOptions = getTypeOptions(value);
      setFormData(prev => ({ 
        ...prev, 
        type: typeOptions[0],
        parentId: value === 1 ? '' : prev.parentId
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Código é obrigatório';
    } else {
      // Verificar se código já existe (exceto no modo edição para o próprio item)
      const existingAccount = chartOfAccounts.find(item => 
        item.code === formData.code && 
        (mode === 'add' || item.id !== account?.id)
      );
      if (existingAccount) {
        newErrors.code = 'Este código já está em uso';
      }
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (formData.level > 1 && !formData.parentId) {
      newErrors.parentId = 'Parent é obrigatório para este nível';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const accountData = {
        ...formData,
        id: mode === 'edit' ? account.id : `acc_${Date.now()}`
      };
      
      await onSave(accountData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      setErrors({ submit: 'Erro ao salvar conta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const parentOptions = getParentOptions(formData.level);
  const typeOptions = getTypeOptions(formData.level);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-bold text-text-primary">
              {mode === 'edit' ? 'Editar Conta' : 'Adicionar Nova Conta'}
            </h2>
            <p className="text-text-secondary mt-1">
              {mode === 'edit' 
                ? 'Modifique as informações da conta selecionada'
                : 'Preencha os dados para criar uma nova conta no plano de contas'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg nav-transition"
          >
            <Icon name="X" size={20} color="#7f8c8d" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nível */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nível Hierárquico
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', parseInt(e.target.value))}
                  disabled={mode === 'edit'}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent nav-transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value={1}>1 - Grupo</option>
                  <option value={2}>2 - SubGrupo</option>
                  <option value={3}>3 - Conta</option>
                </select>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg bg-gray-100 text-text-secondary cursor-not-allowed"
                >
                  {typeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="text-xs text-text-secondary mt-1">
                  Tipo é definido automaticamente pelo nível
                </p>
              </div>
            </div>

            {/* Parent (se nível > 1) */}
            {formData.level > 1 && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {formData.level === 2 ? 'Grupo Pai' : 'SubGrupo Pai'}
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => handleInputChange('parentId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent nav-transition ${
                    errors.parentId ? 'border-error' : 'border-border'
                  }`}
                >
                  <option value="">
                    Selecione {formData.level === 2 ? 'um grupo' : 'um subgrupo'}
                  </option>
                  {parentOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.code} - {option.name}
                    </option>
                  ))}
                </select>
                {errors.parentId && (
                  <p className="text-error text-xs mt-1">{errors.parentId}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Código
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent nav-transition ${
                    errors.code ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Ex: 1.1.001"
                />
                {errors.code && (
                  <p className="text-error text-xs mt-1">{errors.code}</p>
                )}
                <p className="text-xs text-text-secondary mt-1">
                  Código gerado automaticamente, mas pode ser editado
                </p>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent nav-transition ${
                    errors.name ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Nome da conta"
                />
                {errors.name && (
                  <p className="text-error text-xs mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent nav-transition resize-none"
                placeholder="Descrição opcional da conta..."
              />
            </div>
          </div>

          {/* Preview da Estrutura */}
          <div className="bg-background border border-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center space-x-2">
              <Icon name="Eye" size={16} color="#4a90a4" />
              <span>Preview da Estrutura</span>
            </h4>
            <div className="text-sm text-text-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="Folder" size={14} color="#7f8c8d" />
                <span>
                  {formData.level === 1 && 'Grupo: '}
                  {formData.level === 2 && 'SubGrupo: '}
                  {formData.level === 3 && 'Conta: '}
                  <strong>{formData.code || 'Código'}</strong> - {formData.name || 'Nome da conta'}
                </span>
              </div>
              {formData.parentId && (
                <div className="ml-4 mt-1 text-xs">
                  ↳ Filho de: {parentOptions.find(p => p.id === formData.parentId)?.code} - {parentOptions.find(p => p.id === formData.parentId)?.name}
                </div>
              )}
            </div>
          </div>

          {/* Erro de Submit */}
          {errors.submit && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} color="#e74c3c" />
                <span className="text-error font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Conta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;