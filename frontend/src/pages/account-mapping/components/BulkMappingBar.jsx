import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Barra de Ações em Massa para Mapeamento
 * 
 * Permite executar ações em lote para múltiplas contas selecionadas:
 * - Mapear para uma conta do plano de contas
 * - Marcar como ignoradas
 * - Aplicar sugestões automáticas
 * - Limpar mapeamentos
 */
const BulkMappingBar = ({ 
  selectedAccounts = [],
  chartOfAccounts = [],
  onBulkMap,
  onBulkIgnore,
  onBulkApplySuggestions,
  onBulkClear,
  onClearSelection,
  suggestions = []
}) => {
  const [showMappingDropdown, setShowMappingDropdown] = useState(false);
  const [selectedChartAccount, setSelectedChartAccount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);

  // Filtrar contas do plano de contas para busca
  const filteredChartAccounts = chartOfAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar contas por tipo para melhor organização
  const groupedAccounts = filteredChartAccounts.reduce((acc, account) => {
    const type = account.type || 'Outros';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {});

  // Contar sugestões disponíveis para as contas selecionadas
  const availableSuggestions = selectedAccounts.filter(accountId => 
    suggestions.some(suggestion => suggestion.importedAccountId === accountId)
  ).length;

  // Executar mapeamento em massa
  const handleBulkMap = () => {
    if (!selectedChartAccount) return;
    
    const chartAccount = chartOfAccounts.find(acc => acc.id === selectedChartAccount);
    if (!chartAccount) return;

    onBulkMap(selectedAccounts, chartAccount);
    setSelectedChartAccount('');
    setShowMappingDropdown(false);
    onClearSelection();
  };

  // Executar ação com confirmação
  const handleConfirmedAction = (action) => {
    switch (action) {
      case 'ignore':
        onBulkIgnore(selectedAccounts);
        break;
      case 'applySuggestions':
        onBulkApplySuggestions(selectedAccounts);
        break;
      case 'clear':
        onBulkClear(selectedAccounts);
        break;
    }
    setShowConfirmDialog(null);
    onClearSelection();
  };

  // Obter ícone do tipo de conta
  const getAccountTypeIcon = (type) => {
    const icons = {
      'Ativo': 'TrendingUp',
      'Passivo': 'TrendingDown',
      'Patrimônio Líquido': 'Building2',
      'Receita': 'Plus',
      'Despesa': 'Minus',
      'Outros': 'Folder'
    };
    return icons[type] || 'Folder';
  };

  if (selectedAccounts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Barra de ações */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Informações de seleção */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 rounded-full p-2">
                  <Icon name="CheckCircle" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedAccounts.length} conta{selectedAccounts.length !== 1 ? 's' : ''} selecionada{selectedAccounts.length !== 1 ? 's' : ''}
                  </p>
                  {availableSuggestions > 0 && (
                    <p className="text-xs text-gray-500">
                      {availableSuggestions} com sugestões disponíveis
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              {/* Mapear para conta */}
              <div className="relative">
                <button
                  onClick={() => setShowMappingDropdown(!showMappingDropdown)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Icon name="Link" size={16} />
                  Mapear para Conta
                  <Icon name="ChevronDown" size={16} />
                </button>

                {/* Dropdown de seleção de conta */}
                {showMappingDropdown && (
                  <div className="absolute bottom-full mb-2 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-4">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Selecionar Conta do Plano de Contas
                        </label>
                        <div className="relative">
                          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar por nome ou código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto">
                        {Object.entries(groupedAccounts).map(([type, accounts]) => (
                          <div key={type} className="mb-4">
                            <div className="flex items-center gap-2 mb-2 px-2">
                              <Icon name={getAccountTypeIcon(type)} size={16} className="text-gray-500" />
                              <h4 className="text-sm font-medium text-gray-700">{type}</h4>
                            </div>
                            
                            <div className="space-y-1">
                              {accounts.map(account => (
                                <button
                                  key={account.id}
                                  onClick={() => setSelectedChartAccount(account.id)}
                                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    selectedChartAccount === account.id
                                      ? 'bg-blue-100 text-blue-900'
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{account.name}</p>
                                      <p className="text-xs text-gray-500">{account.code}</p>
                                    </div>
                                    {selectedChartAccount === account.id && (
                                      <Icon name="Check" size={16} className="text-blue-600" />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {filteredChartAccounts.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Icon name="Search" size={32} className="mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">Nenhuma conta encontrada</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setShowMappingDropdown(false);
                            setSelectedChartAccount('');
                            setSearchTerm('');
                          }}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Cancelar
                        </button>
                        
                        <button
                          onClick={handleBulkMap}
                          disabled={!selectedChartAccount}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          Mapear {selectedAccounts.length} conta{selectedAccounts.length !== 1 ? 's' : ''}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Aplicar sugestões */}
              {availableSuggestions > 0 && (
                <button
                  onClick={() => setShowConfirmDialog('applySuggestions')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Icon name="Wand2" size={16} />
                  Aplicar Sugestões ({availableSuggestions})
                </button>
              )}

              {/* Marcar como ignoradas */}
              <button
                onClick={() => setShowConfirmDialog('ignore')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Icon name="EyeOff" size={16} />
                Ignorar
              </button>

              {/* Limpar mapeamentos */}
              <button
                onClick={() => setShowConfirmDialog('clear')}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Icon name="Trash2" size={16} />
                Limpar
              </button>

              {/* Cancelar seleção */}
              <button
                onClick={onClearSelection}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium flex items-center gap-2"
              >
                <Icon name="X" size={16} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de confirmação */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-full p-2 ${
                  showConfirmDialog === 'clear' ? 'bg-red-100' :
                  showConfirmDialog === 'ignore' ? 'bg-gray-100' :
                  'bg-green-100'
                }`}>
                  <Icon 
                      name={
                        showConfirmDialog === 'clear' ? 'Trash2' :
                        showConfirmDialog === 'ignore' ? 'EyeOff' :
                        'Wand2'
                      } 
                      size={24}
                      className={
                        showConfirmDialog === 'clear' ? 'text-red-600' :
                        showConfirmDialog === 'ignore' ? 'text-gray-600' :
                        'text-green-600'
                      } 
                    />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {
                    showConfirmDialog === 'clear' ? 'Limpar Mapeamentos' :
                    showConfirmDialog === 'ignore' ? 'Marcar como Ignoradas' :
                    'Aplicar Sugestões'
                  }
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {
                  showConfirmDialog === 'clear' 
                    ? `Tem certeza que deseja limpar os mapeamentos de ${selectedAccounts.length} conta${selectedAccounts.length !== 1 ? 's' : ''}? Esta ação não pode ser desfeita.`
                    : showConfirmDialog === 'ignore'
                    ? `Tem certeza que deseja marcar ${selectedAccounts.length} conta${selectedAccounts.length !== 1 ? 's' : ''} como ignorada${selectedAccounts.length !== 1 ? 's' : ''}? Elas não aparecerão mais na lista de contas pendentes.`
                    : `Tem certeza que deseja aplicar as sugestões automáticas para ${availableSuggestions} conta${availableSuggestions !== 1 ? 's' : ''}? Você poderá revisar e ajustar os mapeamentos depois.`
                }
              </p>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDialog(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={() => handleConfirmedAction(showConfirmDialog)}
                  className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${
                    showConfirmDialog === 'clear' 
                      ? 'bg-red-600 hover:bg-red-700'
                      : showConfirmDialog === 'ignore'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {
                    showConfirmDialog === 'clear' ? 'Limpar' :
                    showConfirmDialog === 'ignore' ? 'Ignorar' :
                    'Aplicar Sugestões'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkMappingBar;