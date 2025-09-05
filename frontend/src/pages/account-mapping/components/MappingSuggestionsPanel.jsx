import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Painel de Sugestões de Mapeamento
 * 
 * Fornece sugestões inteligentes de mapeamento baseadas em:
 * - Similaridade de nomes
 * - Histórico de mapeamentos
 * - Padrões identificados pela IA
 * - Regras de negócio
 */
const MappingSuggestionsPanel = ({ 
  importedAccounts = [],
  chartAccounts = [],
  existingMappings = [],
  onApplySuggestion,
  onRejectSuggestion,
  onBulkApplySuggestions
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [confidenceFilter, setConfidenceFilter] = useState('all'); // all, high, medium, low
  const [typeFilter, setTypeFilter] = useState('all'); // all, exact, similar, pattern, rule
  const [sortBy, setSortBy] = useState('confidence'); // confidence, type, account

  // Gerar sugestões automaticamente quando dados mudarem
  useEffect(() => {
    if (importedAccounts.length > 0 && chartAccounts.length > 0) {
      generateSuggestions();
    }
  }, [importedAccounts, chartAccounts, existingMappings]);

  // Função para gerar sugestões de mapeamento
  const generateSuggestions = async () => {
    setLoading(true);
    
    try {
      // Simular chamada para API de IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSuggestions = [];
      
      // Para cada conta importada sem mapeamento
      importedAccounts
        .filter(imported => !existingMappings.some(m => m.importedAccountId === imported.id))
        .forEach(imported => {
          // 1. Buscar correspondências exatas
          const exactMatches = chartAccounts.filter(chart => 
            chart.name.toLowerCase() === imported.name.toLowerCase() ||
            chart.code === imported.code
          );
          
          exactMatches.forEach(match => {
            newSuggestions.push({
              id: `${imported.id}-${match.id}-exact`,
              importedAccount: imported,
              suggestedAccount: match,
              confidence: 95,
              type: 'exact',
              reason: 'Correspondência exata de nome ou código',
              score: 0.95
            });
          });
          
          // 2. Buscar correspondências similares
          if (exactMatches.length === 0) {
            const similarMatches = chartAccounts
              .map(chart => ({
                account: chart,
                similarity: calculateSimilarity(imported.name, chart.name)
              }))
              .filter(item => item.similarity > 0.7)
              .sort((a, b) => b.similarity - a.similarity)
              .slice(0, 3);
            
            similarMatches.forEach(match => {
              newSuggestions.push({
                id: `${imported.id}-${match.account.id}-similar`,
                importedAccount: imported,
                suggestedAccount: match.account,
                confidence: Math.round(match.similarity * 100),
                type: 'similar',
                reason: `Similaridade de ${Math.round(match.similarity * 100)}% no nome`,
                score: match.similarity
              });
            });
          }
          
          // 3. Buscar por padrões históricos
          const historicalMatches = findHistoricalPatterns(imported, existingMappings, chartAccounts);
          historicalMatches.forEach(match => {
            newSuggestions.push({
              id: `${imported.id}-${match.account.id}-pattern`,
              importedAccount: imported,
              suggestedAccount: match.account,
              confidence: match.confidence,
              type: 'pattern',
              reason: match.reason,
              score: match.confidence / 100
            });
          });
          
          // 4. Aplicar regras de negócio
          const ruleMatches = applyBusinessRules(imported, chartAccounts);
          ruleMatches.forEach(match => {
            newSuggestions.push({
              id: `${imported.id}-${match.account.id}-rule`,
              importedAccount: imported,
              suggestedAccount: match.account,
              confidence: match.confidence,
              type: 'rule',
              reason: match.reason,
              score: match.confidence / 100
            });
          });
        });
      
      // Remover duplicatas e ordenar por confiança
      const uniqueSuggestions = newSuggestions
        .filter((suggestion, index, self) => 
          index === self.findIndex(s => 
            s.importedAccount.id === suggestion.importedAccount.id &&
            s.suggestedAccount.id === suggestion.suggestedAccount.id
          )
        )
        .sort((a, b) => b.confidence - a.confidence);
      
      setSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular similaridade entre strings
  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
    return (longer.length - editDistance) / longer.length;
  };

  // Distância de Levenshtein
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Encontrar padrões históricos
  const findHistoricalPatterns = (imported, mappings, chartAccounts) => {
    const patterns = [];
    
    // Buscar por palavras-chave similares em mapeamentos existentes
    const keywords = imported.name.toLowerCase().split(/\s+/);
    
    mappings.forEach(mapping => {
      const mappedChart = chartAccounts.find(c => c.id === mapping.chartAccountId);
      if (!mappedChart) return;
      
      const mappedKeywords = mapping.importedAccountName.toLowerCase().split(/\s+/);
      const commonKeywords = keywords.filter(k => mappedKeywords.includes(k));
      
      if (commonKeywords.length > 0) {
        patterns.push({
          account: mappedChart,
          confidence: Math.min(85, commonKeywords.length * 25),
          reason: `Padrão histórico: palavras-chave "${commonKeywords.join(', ')}"`
        });
      }
    });
    
    return patterns;
  };

  // Aplicar regras de negócio
  const applyBusinessRules = (imported, chartAccounts) => {
    const rules = [];
    const name = imported.name.toLowerCase();
    
    // Regras para receitas
    if (name.includes('receita') || name.includes('venda') || name.includes('faturamento')) {
      const revenueAccounts = chartAccounts.filter(c => c.type === 'receita');
      revenueAccounts.forEach(account => {
        rules.push({
          account,
          confidence: 70,
          reason: 'Regra de negócio: conta de receita identificada'
        });
      });
    }
    
    // Regras para despesas
    if (name.includes('despesa') || name.includes('custo') || name.includes('gasto')) {
      const expenseAccounts = chartAccounts.filter(c => c.type === 'despesa');
      expenseAccounts.forEach(account => {
        rules.push({
          account,
          confidence: 70,
          reason: 'Regra de negócio: conta de despesa identificada'
        });
      });
    }
    
    return rules;
  };

  // Filtrar sugestões
  const filteredSuggestions = suggestions.filter(suggestion => {
    // Filtro por confiança
    const matchesConfidence = 
      confidenceFilter === 'all' ||
      (confidenceFilter === 'high' && suggestion.confidence >= 80) ||
      (confidenceFilter === 'medium' && suggestion.confidence >= 60 && suggestion.confidence < 80) ||
      (confidenceFilter === 'low' && suggestion.confidence < 60);
    
    // Filtro por tipo
    const matchesType = typeFilter === 'all' || suggestion.type === typeFilter;
    
    return matchesConfidence && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'confidence':
        return b.confidence - a.confidence;
      case 'type':
        return a.type.localeCompare(b.type);
      case 'account':
        return a.importedAccount.name.localeCompare(b.importedAccount.name);
      default:
        return 0;
    }
  });

  // Selecionar/deselecionar sugestão
  const toggleSuggestionSelection = (suggestionId) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  // Aplicar sugestões selecionadas em lote
  const handleBulkApply = () => {
    const suggestionsToApply = suggestions.filter(s => selectedSuggestions.includes(s.id));
    onBulkApplySuggestions(suggestionsToApply);
    setSelectedSuggestions([]);
  };

  // Ícones por tipo de sugestão
  const getTypeIcon = (type) => {
    switch (type) {
      case 'exact': return 'CheckCircle';
      case 'similar': return 'Zap';
      case 'pattern': return 'Brain';
      case 'rule': return 'Settings';
      default: return 'Lightbulb';
    }
  };

  // Cores por tipo de sugestão
  const getTypeColor = (type) => {
    switch (type) {
      case 'exact': return 'text-green-600 bg-green-100';
      case 'similar': return 'text-blue-600 bg-blue-100';
      case 'pattern': return 'text-purple-600 bg-purple-100';
      case 'rule': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Cor por nível de confiança
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabeçalho */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Icon name="Lightbulb" className="text-yellow-600" />
              Sugestões de Mapeamento
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {filteredSuggestions.length} sugestões • IA + Padrões + Regras
            </p>
          </div>
          
          {/* Ações em lote */}
          {selectedSuggestions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedSuggestions.length} selecionada{selectedSuggestions.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={handleBulkApply}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Aplicar Selecionadas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={generateSuggestions}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Icon name={loading ? 'Loader2' : 'RefreshCw'} size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Gerando...' : 'Gerar Sugestões'}
          </button>
          
          <div className="flex items-center gap-4">
            {/* Filtro por confiança */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confiança
              </label>
              <select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="high">Alta (≥80%)</option>
                <option value="medium">Média (60-79%)</option>
                <option value="low">Baixa (&lt;60%)</option>
              </select>
            </div>
            
            {/* Filtro por tipo */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="exact">Exata</option>
                <option value="similar">Similar</option>
                <option value="pattern">Padrão</option>
                <option value="rule">Regra</option>
              </select>
            </div>
            
            {/* Ordenação */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ordenar
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="confidence">Confiança</option>
                <option value="type">Tipo</option>
                <option value="account">Conta</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de sugestões */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <Icon name="Loader2" size={32} className="text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Gerando sugestões inteligentes...</p>
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredSuggestions.map((suggestion) => {
              const isSelected = selectedSuggestions.includes(suggestion.id);
              
              return (
                <div
                  key={suggestion.id}
                  className={`px-6 py-4 transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Cabeçalho da sugestão */}
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSuggestionSelection(suggestion.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          getTypeColor(suggestion.type)
                        }`}>
                          <Icon name={getTypeIcon(suggestion.type)} size={12} className="mr-1" />
                          {suggestion.type === 'exact' ? 'Exata' :
                           suggestion.type === 'similar' ? 'Similar' :
                           suggestion.type === 'pattern' ? 'Padrão' : 'Regra'}
                        </span>
                        
                        <span className={`text-sm font-medium ${
                          getConfidenceColor(suggestion.confidence)
                        }`}>
                          {suggestion.confidence}% confiança
                        </span>
                      </div>
                      
                      {/* Mapeamento */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        {/* Conta importada */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Conta Importada</p>
                          <div className="bg-gray-50 rounded p-3">
                            <p className="font-medium text-gray-900 text-sm">
                              {suggestion.importedAccount.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Código: {suggestion.importedAccount.code || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Conta sugerida */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Conta Sugerida</p>
                          <div className="bg-green-50 rounded p-3">
                            <p className="font-medium text-gray-900 text-sm">
                              {suggestion.suggestedAccount.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {suggestion.suggestedAccount.code} • {suggestion.suggestedAccount.type}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Razão da sugestão */}
                      <div className="bg-blue-50 rounded p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <Icon name="Info" size={16} className="inline mr-1" />
                          {suggestion.reason}
                        </p>
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => onApplySuggestion(suggestion)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Aplicar
                      </button>
                      
                      <button
                        onClick={() => onRejectSuggestion(suggestion)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Icon name="Lightbulb" size={48} className="text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma sugestão disponível
            </h4>
            <p className="text-gray-500 mb-4">
              Clique em "Gerar Sugestões" para obter recomendações de mapeamento
            </p>
            <button
              onClick={generateSuggestions}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Gerar Sugestões
            </button>
          </div>
        )}
      </div>
      
      {/* Rodapé */}
      {filteredSuggestions.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {filteredSuggestions.length} sugestões • {selectedSuggestions.length} selecionadas
            </span>
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Alta confiança
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Média confiança
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Baixa confiança
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingSuggestionsPanel;