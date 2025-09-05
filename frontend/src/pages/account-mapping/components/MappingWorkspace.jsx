import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente do Workspace de Mapeamento
 * 
 * Permite fazer o mapeamento entre contas importadas e plano de contas
 * através de dropdowns com critérios de auditoria.
 * 
 * @param {Array} importedAccounts - Contas importadas disponíveis
 * @param {Array} chartAccounts - Contas do plano de contas
 * @param {Array} mappings - Mapeamentos existentes
 * @param {Function} onCreateMapping - Callback para criar novo mapeamento
 * @param {Function} onRemoveMapping - Callback para remover mapeamento
 */
const MappingWorkspace = ({
  importedAccounts = [],
  chartAccounts = [],
  mappings = [],
  onCreateMapping,
  onRemoveMapping
}) => {
  const [selectedImported, setSelectedImported] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [searchImported, setSearchImported] = useState('');
  const [searchChart, setSearchChart] = useState('');
  const [sortBy, setSortBy] = useState('supplier'); // supplier, date, description, originalAccount
  const [filterBy, setFilterBy] = useState('all'); // all, supplier, description

  // Filtrar e ordenar contas não mapeadas com critérios de auditoria
  const unmappedImportedAccounts = useMemo(() => {
    let filtered = importedAccounts.filter(account => 
      !mappings.some(mapping => mapping.importedAccountId === account.id) &&
      (
        account.originalName.toLowerCase().includes(searchImported.toLowerCase()) ||
        account.supplier?.toLowerCase().includes(searchImported.toLowerCase()) ||
        account.description?.toLowerCase().includes(searchImported.toLowerCase())
      )
    );

    // Aplicar filtros por critérios de auditoria
    if (filterBy !== 'all') {
      filtered = filtered.filter(account => {
        switch (filterBy) {
          case 'supplier':
            return account.supplier && account.supplier.trim() !== '';
          case 'description':
            return account.description && account.description.trim() !== '';
          default:
            return true;
        }
      });
    }

    // Ordenar por critérios de auditoria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'supplier':
          return (a.supplier || '').localeCompare(b.supplier || '');
        case 'date':
          return new Date(b.date || 0) - new Date(a.date || 0);
        case 'description':
          return (a.description || '').localeCompare(b.description || '');
        case 'originalAccount':
          return (a.originalName || '').localeCompare(b.originalName || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [importedAccounts, mappings, searchImported, filterBy, sortBy]);

  const availableChartAccounts = useMemo(() => {
    return chartAccounts.filter(account =>
      account.name.toLowerCase().includes(searchChart.toLowerCase())
    );
  }, [chartAccounts, searchChart]);

  // Handler para mapeamento via dropdown
  const handleDropdownMapping = (importedAccountId, chartAccountId) => {
    if (importedAccountId && chartAccountId) {
      const importedAccount = importedAccounts.find(acc => acc.id === importedAccountId);
      const chartAccount = chartAccounts.find(acc => acc.id === chartAccountId);
      
      if (importedAccount && chartAccount) {
        onCreateMapping(importedAccount, chartAccount);
      }
    }
  };

  // Handler para mapeamento manual
  const handleManualMapping = () => {
    if (selectedImported && selectedChart) {
      onCreateMapping(selectedImported, selectedChart);
      setSelectedImported(null);
      setSelectedChart(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabeçalho */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Icon name="ArrowLeftRight" className="text-blue-600" />
              Workspace de Mapeamento
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Use os dropdowns para mapear contas baseado em critérios de auditoria
            </p>
          </div>
          
          {/* Botão de mapeamento manual */}
          {selectedImported && selectedChart && (
            <button
              onClick={handleManualMapping}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Icon name="Link" size={16} />
              Criar Mapeamento
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Controles de Filtro e Ordenação */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="Filter" className="text-gray-600" size={16} />
            Critérios de Auditoria
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ordenar por:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="supplier">Fornecedor/Cliente</option>
                <option value="date">Data (mais recente)</option>
                <option value="description">Descrição</option>
                <option value="originalAccount">Conta Original</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Filtrar por:
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as contas</option>
                <option value="supplier">Com fornecedor/cliente</option>
                <option value="description">Com descrição</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Painel de Contas Importadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <Icon name="FileImport" className="text-orange-600" />
                Contas Importadas ({unmappedImportedAccounts.length})
              </h4>
            </div>
            
            {/* Busca */}
            <div className="relative">
              <Icon 
                name="Search" 
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Buscar contas importadas..."
                value={searchImported}
                onChange={(e) => setSearchImported(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Lista de contas importadas */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {unmappedImportedAccounts.map(account => (
                <div
                  key={account.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all bg-white"
                >
                  {/* Informações da conta */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {account.originalCode}
                      </span>
                      <span className="text-xs text-gray-500">
                        {account.frequency} ocorrências
                      </span>
                    </div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      {account.originalName}
                    </h5>
                    
                    {/* Critérios de Auditoria */}
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {account.supplier && (
                        <div className="flex items-center gap-2">
                          <Icon name="Building" size={12} className="text-blue-500" />
                          <span className="text-gray-600">Fornecedor:</span>
                          <span className="font-medium text-gray-900">{account.supplier}</span>
                        </div>
                      )}
                      {account.date && (
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={12} className="text-green-500" />
                          <span className="text-gray-600">Data:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(account.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                      {account.description && (
                        <div className="flex items-start gap-2">
                          <Icon name="FileText" size={12} className="text-purple-500 mt-0.5" />
                          <span className="text-gray-600">Descrição:</span>
                          <span className="font-medium text-gray-900 flex-1">{account.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Dropdown para mapeamento */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mapear para conta:
                    </label>
                    <select
                      onChange={(e) => handleDropdownMapping(account.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue=""
                    >
                      <option value="">Selecione uma conta...</option>
                      {availableChartAccounts.map(chartAccount => (
                        <option key={chartAccount.id} value={chartAccount.id}>
                          {chartAccount.code} - {chartAccount.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              
              {unmappedImportedAccounts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Icon name="CheckCircle" size={32} className="mx-auto mb-2 text-green-500" />
                  <p className="text-sm">
                    {searchImported ? 'Nenhuma conta encontrada' : 'Todas as contas foram mapeadas!'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Painel do Plano de Contas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <Icon name="FolderTree" className="text-green-600" />
                Plano de Contas ({availableChartAccounts.length})
              </h4>
            </div>
            
            {/* Busca */}
            <div className="relative">
              <Icon 
                name="Search" 
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Buscar no plano de contas..."
                value={searchChart}
                onChange={(e) => setSearchChart(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Lista do plano de contas */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableChartAccounts.map(account => (
                <div
                  key={account.id}
                  className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                      account.type === 'receita' ? 'bg-green-500' :
                      account.type === 'despesa' ? 'bg-red-500' :
                      account.type === 'ativo' ? 'bg-blue-500' :
                      account.type === 'passivo' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {account.code}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {account.type}
                    </span>
                  </div>
                  <h5 className="text-sm font-medium text-gray-900">
                    {account.name}
                  </h5>
                  <div className="text-xs text-gray-500 mt-1">
                    Nível {account.level} • {account.isActive ? 'Ativa' : 'Inativa'}
                  </div>
                </div>
              ))}
              
              {availableChartAccounts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Icon name="Search" size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Nenhuma conta encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Instruções de uso */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="text-blue-600 mt-0.5" size={16} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Como usar o mapeamento:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• <strong>Dropdown:</strong> Use o dropdown em cada conta importada para selecionar a conta do plano de contas correspondente</li>
                <li>• <strong>Critérios de Auditoria:</strong> Analise fornecedor, data, descrição e conta original para fazer o mapeamento correto</li>
                <li>• <strong>Filtros:</strong> Use os controles de filtro e ordenação para organizar as contas por critérios relevantes</li>
                <li>• <strong>Busca:</strong> Use os campos de busca para encontrar contas específicas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingWorkspace;