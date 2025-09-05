import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

/**
 * Modal para adicionar/editar Centros de Custo
 * 
 * Funcionalidades:
 * - Formulário responsivo para criação/edição
 * - Validação de campos obrigatórios
 * - Geração automática de próximo código
 * - Preview das informações
 * - Estados de carregamento e erro
 */
const CostCenterModal = ({ 
  isOpen, 
  mode = 'add', // 'add' ou 'edit'
  costCenter = null,
  costCenters = [],
  onSave, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Inicializar formulário quando modal abrir
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && costCenter) {
        setFormData({
          code: costCenter.code || '',
          name: costCenter.name || '',
          description: costCenter.description || '',
          status: costCenter.status || 'active'
        });
      } else {
        // Modo adicionar - gerar próximo código
        const nextCode = generateNextCode();
        setFormData({
          code: nextCode,
          name: '',
          description: '',
          status: 'active'
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, costCenter, costCenters]);

  // Gerar próximo código disponível
  const generateNextCode = () => {
    if (costCenters.length === 0) return 'CC001';
    
    const codes = costCenters
      .map(center => center.code)
      .filter(code => /^CC\d{3}$/.test(code))
      .map(code => parseInt(code.substring(2)))
      .sort((a, b) => a - b);
    
    let nextNumber = 1;
    for (const num of codes) {
      if (num === nextNumber) {
        nextNumber++;
      } else {
        break;
      }
    }
    
    return `CC${nextNumber.toString().padStart(3, '0')}`;
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Código é obrigatório';
    } else if (!/^CC\d{3}$/.test(formData.code)) {
      newErrors.code = 'Código deve seguir o padrão CC001, CC002, etc.';
    } else {
      // Verificar se código já existe (exceto no modo edição)
      const existingCenter = costCenters.find(center => 
        center.code === formData.code && 
        (mode === 'add' || center.id !== costCenter?.id)
      );
      if (existingCenter) {
        newErrors.code = 'Este código já está em uso';
      }
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipular mudanças nos campos
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const centerData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        id: mode === 'edit' ? costCenter.id : Date.now(), // Mock ID
        createdAt: mode === 'edit' ? costCenter.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSave(centerData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar centro de custo:', error);
      setErrors({ submit: 'Erro ao salvar centro de custo. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {mode === 'edit' ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {mode === 'edit' 
                ? 'Atualize as informações do centro de custo'
                : 'Preencha as informações para criar um novo centro de custo'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Erro geral */}
            {errors.submit && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} className="text-danger" />
                  <span className="text-sm text-danger">{errors.submit}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Código *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="CC001"
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.code ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.code && (
                  <p className="text-sm text-danger mt-1">{errors.code}</p>
                )}
                <p className="text-xs text-text-secondary mt-1">
                  Formato: CC001, CC002, etc.
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
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
                placeholder="Ex: Departamento Comercial"
                className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name ? 'border-danger' : 'border-border'
                }`}
              />
              {errors.name && (
                <p className="text-sm text-danger mt-1">{errors.name}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrição detalhada do centro de custo (opcional)"
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Preview */}
            {formData.code && formData.name && (
              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                  <Icon name="Eye" size={16} />
                  Preview do Centro de Custo
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Código:</span>
                    <span className="text-text-primary font-medium">{formData.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Nome:</span>
                    <span className="text-text-primary">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Status:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      formData.status === 'active'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {formData.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  {formData.description && (
                    <div className="pt-2 border-t border-border">
                      <span className="text-text-secondary">Descrição:</span>
                      <p className="text-text-primary mt-1">{formData.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-background">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-surface transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.code || !formData.name}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {mode === 'edit' ? 'Atualizar' : 'Criar'} Centro de Custo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostCenterModal;