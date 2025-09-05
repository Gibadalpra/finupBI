import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ClientBulkActions = ({ selectedCount, onAction }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);

  const actions = [
    {
      id: 'activate',
      label: 'Ativar Usuários',
      icon: 'CheckCircle',
      color: 'text-green-600',
      description: 'Ativar os usuários selecionados'
    },
    {
      id: 'deactivate',
      label: 'Desativar Usuários',
      icon: 'XCircle',
      color: 'text-red-600',
      description: 'Desativar os usuários selecionados'
    },
    {
      id: 'reset_password',
      label: 'Redefinir Senhas',
      icon: 'Key',
      color: 'text-blue-600',
      description: 'Enviar email de redefinição de senha'
    },
    {
      id: 'update_permissions',
      label: 'Atualizar Permissões',
      icon: 'Shield',
      color: 'text-purple-600',
      description: 'Modificar permissões em massa'
    },
    {
      id: 'export_data',
      label: 'Exportar Dados',
      icon: 'Download',
      color: 'text-gray-600',
      description: 'Exportar dados dos usuários selecionados'
    },
    {
      id: 'send_notification',
      label: 'Enviar Notificação',
      icon: 'Mail',
      color: 'text-indigo-600',
      description: 'Enviar notificação por email'
    }
  ];

  const handleActionClick = (actionId) => {
    const action = actions.find(a => a.id === actionId);
    if (['deactivate', 'reset_password'].includes(actionId)) {
      setShowConfirmDialog(action);
    } else {
      onAction(actionId);
    }
    setShowDropdown(false);
  };

  const handleConfirmAction = () => {
    if (showConfirmDialog) {
      onAction(showConfirmDialog.id);
      setShowConfirmDialog(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={20} className="text-primary" />
              <span className="font-medium text-text-primary">
                {selectedCount} usuário{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Ações Rápidas */}
            <button
              onClick={() => handleActionClick('activate')}
              className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Icon name="CheckCircle" size={16} />
              <span>Ativar</span>
            </button>

            <button
              onClick={() => handleActionClick('deactivate')}
              className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Icon name="XCircle" size={16} />
              <span>Desativar</span>
            </button>

            {/* Dropdown de Mais Ações */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-background transition-colors"
              >
                <Icon name="MoreHorizontal" size={16} />
                <span>Mais Ações</span>
                <Icon name="ChevronDown" size={14} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {actions.slice(2).map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action.id)}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-background transition-colors text-left"
                      >
                        <Icon name={action.icon} size={16} className={action.color} />
                        <div>
                          <div className="font-medium text-text-primary">{action.label}</div>
                          <div className="text-sm text-text-secondary">{action.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Ações disponíveis para usuários da sua empresa
            </span>
            <button
              onClick={() => onAction('clear_selection')}
              className="flex items-center space-x-1 hover:text-text-primary transition-colors"
            >
              <Icon name="X" size={14} />
              <span>Limpar seleção</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dialog de Confirmação */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Icon 
                name={showConfirmDialog.icon} 
                size={24} 
                className={showConfirmDialog.color} 
              />
              <h3 className="text-lg font-semibold text-text-primary">
                Confirmar Ação
              </h3>
            </div>
            
            <p className="text-text-secondary mb-6">
              Tem certeza que deseja <strong>{showConfirmDialog.label.toLowerCase()}</strong> para {selectedCount} usuário{selectedCount !== 1 ? 's' : ''}?
            </p>
            
            {showConfirmDialog.id === 'deactivate' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Usuários desativados não poderão acessar o portal até serem reativados.
                  </div>
                </div>
              </div>
            )}
            
            {showConfirmDialog.id === 'reset_password' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Informação:</strong> Os usuários receberão um email com instruções para redefinir suas senhas.
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  showConfirmDialog.id === 'deactivate' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-primary hover:bg-primary-600'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para fechar dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  );
};

export default ClientBulkActions;