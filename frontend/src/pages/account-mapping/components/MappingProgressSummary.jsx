import React from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Resumo do Progresso de Mapeamento
 * 
 * Exibe estatísticas e progresso do mapeamento de contas:
 * - Total de contas importadas
 * - Contas mapeadas, pendentes e ignoradas
 * - Progresso visual
 * - Estatísticas por tipo
 */
const MappingProgressSummary = ({ 
  importedAccounts = [],
  mappings = [],
  onExportMappings,
  onImportMappings,
  onClearMappings
}) => {
  // Calcular estatísticas
  const stats = {
    total: importedAccounts.length,
    mapped: mappings.filter(m => m.status === 'mapped').length,
    pending: importedAccounts.length - mappings.filter(m => m.status === 'mapped' || m.status === 'ignored').length,
    ignored: mappings.filter(m => m.status === 'ignored').length,
    confidence: {
      high: mappings.filter(m => m.confidence >= 80).length,
      medium: mappings.filter(m => m.confidence >= 60 && m.confidence < 80).length,
      low: mappings.filter(m => m.confidence < 60).length
    }
  };

  // Calcular progresso percentual
  const progress = {
    mapped: stats.total > 0 ? Math.round((stats.mapped / stats.total) * 100) : 0,
    pending: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0,
    ignored: stats.total > 0 ? Math.round((stats.ignored / stats.total) * 100) : 0
  };

  // Estatísticas por tipo de conta importada
  const typeStats = importedAccounts.reduce((acc, account) => {
    const type = account.type || 'outros';
    if (!acc[type]) {
      acc[type] = { total: 0, mapped: 0 };
    }
    acc[type].total++;
    
    const mapping = mappings.find(m => m.importedAccountId === account.id && m.status === 'mapped');
    if (mapping) {
      acc[type].mapped++;
    }
    
    return acc;
  }, {});

  // Calcular tempo estimado para conclusão
  const estimatedTimeToComplete = () => {
    if (stats.pending === 0) return 'Concluído';
    
    const avgTimePerMapping = 2; // minutos por mapeamento
    const totalMinutes = stats.pending * avgTimePerMapping;
    
    if (totalMinutes < 60) {
      return `~${totalMinutes} min`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `~${hours}h ${minutes}min`;
    }
  };

  // Obter status geral
  const getOverallStatus = () => {
    if (progress.mapped === 100) return { status: 'complete', color: 'green', icon: 'CheckCircle' };
    if (progress.mapped >= 80) return { status: 'almost', color: 'blue', icon: 'Clock' };
    if (progress.mapped >= 50) return { status: 'progress', color: 'yellow', icon: 'Clock' };
    return { status: 'starting', color: 'red', icon: 'AlertCircle' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabeçalho */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Icon name="PieChart" className="text-blue-600" />
              Progresso do Mapeamento
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats.mapped} de {stats.total} contas mapeadas • {progress.mapped}% concluído
            </p>
          </div>
          
          {/* Status geral */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full bg-${overallStatus.color}-100`}>
            <Icon 
              name={overallStatus.icon} 
              size={20}
              className={`text-${overallStatus.color}-600`} 
            />
            <span className={`text-sm font-medium text-${overallStatus.color}-800`}>
              {overallStatus.status === 'complete' ? 'Concluído' :
               overallStatus.status === 'almost' ? 'Quase pronto' :
               overallStatus.status === 'progress' ? 'Em progresso' : 'Iniciando'}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progresso principal */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="mb-2">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Progresso Geral</span>
            <span>{progress.mapped}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="flex h-3 rounded-full overflow-hidden">
              {/* Mapeadas */}
              <div 
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${progress.mapped}%` }}
              ></div>
              
              {/* Ignoradas */}
              <div 
                className="bg-gray-400 transition-all duration-500"
                style={{ width: `${progress.ignored}%` }}
              ></div>
              
              {/* Pendentes */}
              <div 
                className="bg-red-300 transition-all duration-500"
                style={{ width: `${progress.pending}%` }}
              ></div>
            </div>
          </div>
          
          {/* Legenda */}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600">Mapeadas ({stats.mapped})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span className="text-gray-600">Ignoradas ({stats.ignored})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-300 rounded"></div>
              <span className="text-gray-600">Pendentes ({stats.pending})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas detalhadas */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total de contas */}
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="FileText" size={24} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total de Contas</p>
          </div>
          
          {/* Contas mapeadas */}
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.mapped}</p>
            <p className="text-sm text-gray-500">Mapeadas</p>
          </div>
          
          {/* Contas pendentes */}
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pendentes</p>
          </div>
          
          {/* Tempo estimado */}
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="Timer" size={24} className="text-yellow-600" />
            </div>
            <p className="text-lg font-bold text-yellow-600">{estimatedTimeToComplete()}</p>
            <p className="text-sm text-gray-500">Tempo Estimado</p>
          </div>
        </div>
      </div>

      {/* Estatísticas por confiança */}
      {stats.mapped > 0 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Confiança dos Mapeamentos</h4>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Alta confiança */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Alta (≥80%)</span>
                <Icon name="Shield" size={16} className="text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-600">{stats.confidence.high}</p>
              <p className="text-xs text-green-600">
                {stats.mapped > 0 ? Math.round((stats.confidence.high / stats.mapped) * 100) : 0}% dos mapeamentos
              </p>
            </div>
            
            {/* Média confiança */}
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-800">Média (60-79%)</span>
                <Icon name="Shield" size={16} className="text-yellow-600" />
              </div>
              <p className="text-xl font-bold text-yellow-600">{stats.confidence.medium}</p>
              <p className="text-xs text-yellow-600">
                {stats.mapped > 0 ? Math.round((stats.confidence.medium / stats.mapped) * 100) : 0}% dos mapeamentos
              </p>
            </div>
            
            {/* Baixa confiança */}
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-800">Baixa (&lt;60%)</span>
                <Icon name="AlertTriangle" size={16} className="text-red-600" />
              </div>
              <p className="text-xl font-bold text-red-600">{stats.confidence.low}</p>
              <p className="text-xs text-red-600">
                {stats.mapped > 0 ? Math.round((stats.confidence.low / stats.mapped) * 100) : 0}% dos mapeamentos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas por tipo */}
      {Object.keys(typeStats).length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Progresso por Tipo de Conta</h4>
          
          <div className="space-y-3">
            {Object.entries(typeStats).map(([type, data]) => {
              const typeProgress = data.total > 0 ? Math.round((data.mapped / data.total) * 100) : 0;
              
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">{type}</span>
                    <span className="text-gray-500">
                      {data.mapped}/{data.total} ({typeProgress}%)
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${typeProgress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onExportMappings}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Icon name="Download" size={16} />
              Exportar Mapeamentos
            </button>
            
            <button
              onClick={onImportMappings}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Icon name="Upload" size={16} />
              Importar Mapeamentos
            </button>
          </div>
          
          {stats.mapped > 0 && (
            <button
              onClick={onClearMappings}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Icon name="Trash2" size={16} />
              Limpar Mapeamentos
            </button>
          )}
        </div>
        
        {/* Dicas */}
        {stats.pending > 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-blue-800 mb-1">Dicas para acelerar o mapeamento:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use as sugestões automáticas para mapeamentos similares</li>
                  <li>• Aplique mapeamentos em lote para contas do mesmo tipo</li>
                  <li>• Marque contas irrelevantes como "ignoradas"</li>
                  <li>• Exporte mapeamentos para reutilizar em futuras importações</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MappingProgressSummary;