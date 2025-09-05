import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Componente de Gráfico de Barras Comparativo
 * 
 * Exibe gráficos de barras para comparação entre valores planejados e realizados
 * com suporte a valores absolutos e percentuais.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título do gráfico
 * @param {Array} props.data - Dados para o gráfico
 * @param {string} props.plannedKey - Chave para valores planejados
 * @param {string} props.actualKey - Chave para valores realizados
 * @param {boolean} props.showPercentage - Se deve mostrar valores percentuais
 * @param {string} props.baseKey - Chave base para cálculo de percentual
 */
const ComparisonBarChart = ({ 
  title, 
  data = [], 
  plannedKey = 'planned', 
  actualKey = 'actual',
  showPercentage = false,
  baseKey = 'revenue'
}) => {
  // Formatação de valores monetários
  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatação de percentuais
  const formatPercentage = (value) => {
    if (!value) return '0%';
    return `${value.toFixed(1)}%`;
  };

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">
                {showPercentage ? formatPercentage(entry.value) : formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Preparar dados com percentuais se necessário
  const chartData = data.map(item => {
    if (showPercentage && baseKey && item[baseKey]) {
      return {
        ...item,
        [`${plannedKey}Percentage`]: (item[plannedKey] / item[baseKey]) * 100,
        [`${actualKey}Percentage`]: (item[actualKey] / item[baseKey]) * 100
      };
    }
    return item;
  });

  const plannedDataKey = showPercentage ? `${plannedKey}Percentage` : plannedKey;
  const actualDataKey = showPercentage ? `${actualKey}Percentage` : actualKey;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Planejado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Realizado</span>
          </div>
          {showPercentage && (
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
              Valores em percentual
            </div>
          )}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={showPercentage ? formatPercentage : formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar 
              dataKey={plannedDataKey} 
              name="Planejado"
              fill="#3b82f6" 
              radius={[2, 2, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey={actualDataKey} 
              name="Realizado"
              fill="#10b981" 
              radius={[2, 2, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo estatístico */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Total Planejado</p>
            <p className="font-semibold text-blue-600">
              {showPercentage 
                ? formatPercentage(chartData.reduce((sum, item) => sum + (item[plannedDataKey] || 0), 0) / chartData.length)
                : formatCurrency(chartData.reduce((sum, item) => sum + (item[plannedKey] || 0), 0))
              }
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Total Realizado</p>
            <p className="font-semibold text-green-600">
              {showPercentage 
                ? formatPercentage(chartData.reduce((sum, item) => sum + (item[actualDataKey] || 0), 0) / chartData.length)
                : formatCurrency(chartData.reduce((sum, item) => sum + (item[actualKey] || 0), 0))
              }
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Variação</p>
            <p className={`font-semibold ${
              chartData.reduce((sum, item) => sum + (item[actualKey] || 0), 0) >= 
              chartData.reduce((sum, item) => sum + (item[plannedKey] || 0), 0)
                ? 'text-green-600' : 'text-red-600'
            }`}>
              {(() => {
                const totalPlanned = chartData.reduce((sum, item) => sum + (item[plannedKey] || 0), 0);
                const totalActual = chartData.reduce((sum, item) => sum + (item[actualKey] || 0), 0);
                const variance = ((totalActual - totalPlanned) / totalPlanned) * 100;
                return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%`;
              })()} 
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Atingimento</p>
            <p className="font-semibold text-gray-900">
              {(() => {
                const totalPlanned = chartData.reduce((sum, item) => sum + (item[plannedKey] || 0), 0);
                const totalActual = chartData.reduce((sum, item) => sum + (item[actualKey] || 0), 0);
                const achievement = (totalActual / totalPlanned) * 100;
                return `${achievement.toFixed(1)}%`;
              })()} 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBarChart;