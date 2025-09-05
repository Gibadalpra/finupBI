import React from 'react';
import Icon from 'components/AppIcon';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ComparisonBarChart from './ComparisonBarChart';
import CashFlowTable from './CashFlowTable';

const ReportViewer = ({ report, data, loading, filters }) => {
  if (loading) {
    return (
      <div className="bg-surface rounded-lg border border-border p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-text-secondary">Carregando dados do relatório...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-surface rounded-lg border border-border p-12 text-center">
        <Icon name="AlertCircle" size={48} color="var(--color-text-secondary)" className="mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          Nenhum Dado Disponível
        </h3>
        <p className="text-text-secondary">
          Não foi possível gerar dados do relatório para os parâmetros selecionados
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(Math.abs(amount));
  };

  const renderProfitLossReport = () => (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success-700 font-medium">Receita Total</p>
              <p className="text-2xl font-bold text-success-800">
                {formatCurrency(data?.sections?.[0]?.total)}
              </p>
            </div>
            <Icon name="TrendingUp" size={24} color="var(--color-success)" />
          </div>
        </div>
        
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-error-700 font-medium">Despesas Totais</p>
              <p className="text-2xl font-bold text-error-800">
                {formatCurrency(Math.abs(data?.sections?.[1]?.total + data?.sections?.[2]?.total))}
              </p>
            </div>
            <Icon name="TrendingDown" size={24} color="var(--color-error)" />
          </div>
        </div>
        
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 font-medium">Lucro Líquido</p>
              <p className="text-2xl font-bold text-primary-800">
                {formatCurrency(data?.netIncome)}
              </p>
            </div>
            <Icon name="DollarSign" size={24} color="var(--color-primary)" />
          </div>
        </div>
        
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-700 font-medium">Margem de Lucro</p>
              <p className="text-2xl font-bold text-accent-800">
                {((data?.netIncome / data?.sections?.[0]?.total) * 100)?.toFixed(1)}%
              </p>
            </div>
            <Icon name="Percent" size={24} color="var(--color-accent)" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Visão Geral Financeira
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {data?.chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-6">
        {data?.sections?.map((section, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              {section?.name}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-sm font-medium text-text-secondary">Conta</th>
                    <th className="text-right py-2 text-sm font-medium text-text-secondary">Valor</th>
                    <th className="text-right py-2 text-sm font-medium text-text-secondary">% da Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {section?.items?.map((item, itemIndex) => (
                    <tr key={itemIndex} className="border-b border-border last:border-b-0">
                      <td className="py-3 text-sm text-text-primary">{item?.account}</td>
                      <td className={`py-3 text-sm text-right font-medium ${
                        item?.amount >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {item?.amount >= 0 ? '' : '-'}{formatCurrency(item?.amount)}
                      </td>
                      <td className="py-3 text-sm text-right text-text-secondary">
                        {Math.abs(item?.percentage)?.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary bg-primary-50">
                    <td className="py-3 text-sm font-semibold text-text-primary">
                      Total de {section?.name}
                    </td>
                    <td className={`py-3 text-sm text-right font-bold ${
                      section?.total >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {section?.total >= 0 ? '' : '-'}{formatCurrency(section?.total)}
                    </td>
                    <td className="py-3 text-sm text-right font-medium text-text-primary">
                      {((Math.abs(section?.total) / data?.sections?.[0]?.total) * 100)?.toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBalanceSheetReport = () => (
    <div className="space-y-6">
      {data?.sections?.map((section, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            {section?.name}
          </h3>
          
          {section?.subsections ? (
            <div className="space-y-4">
              {section?.subsections?.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <h4 className="font-medium text-text-primary mb-2">{subsection?.name}</h4>
                  <div className="overflow-x-auto ml-4">
                    <table className="w-full">
                      <tbody>
                        {subsection?.items?.map((item, itemIndex) => (
                          <tr key={itemIndex} className="border-b border-border last:border-b-0">
                            <td className="py-2 text-sm text-text-primary">{item?.account}</td>
                            <td className="py-2 text-sm text-right font-medium text-text-primary">
                              {item?.amount >= 0 ? '' : '('}{formatCurrency(item?.amount)}{item?.amount < 0 ? ')' : ''}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-primary bg-primary-50">
                          <td className="py-2 text-sm font-semibold text-text-primary">
                            Total de {subsection?.name}
                          </td>
                          <td className="py-2 text-sm text-right font-bold text-text-primary">
                            {formatCurrency(subsection?.total)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {section?.items?.map((item, itemIndex) => (
                    <tr key={itemIndex} className="border-b border-border last:border-b-0">
                      <td className="py-2 text-sm text-text-primary">{item?.account}</td>
                      <td className="py-2 text-sm text-right font-medium text-text-primary">
                        {formatCurrency(item?.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="border-t-2 border-primary bg-primary-50 -mx-6 px-6 py-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-text-primary">Total de {section?.name}</span>
              <span className="font-bold text-text-primary text-lg">
                {formatCurrency(section?.total)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCashFlowReport = () => {
    // Dados mock para os gráficos de comparação
    const revenueComparisonData = [
      { period: 'Jan', planned: 150000, actual: 142000, revenue: 142000 },
      { period: 'Fev', planned: 160000, actual: 158000, revenue: 158000 },
      { period: 'Mar', planned: 170000, actual: 175000, revenue: 175000 },
      { period: 'Abr', planned: 165000, actual: 162000, revenue: 162000 },
      { period: 'Mai', planned: 180000, actual: 185000, revenue: 185000 },
      { period: 'Jun', planned: 175000, actual: 172000, revenue: 172000 }
    ];

    const variableCostData = [
      { period: 'Jan', planned: 90000, actual: 85200, revenue: 142000 },
      { period: 'Fev', planned: 96000, actual: 94800, revenue: 158000 },
      { period: 'Mar', planned: 102000, actual: 105000, revenue: 175000 },
      { period: 'Abr', planned: 99000, actual: 97200, revenue: 162000 },
      { period: 'Mai', planned: 108000, actual: 111000, revenue: 185000 },
      { period: 'Jun', planned: 105000, actual: 103200, revenue: 172000 }
    ];

    const contributionMarginData = [
      { period: 'Jan', planned: 60000, actual: 56800, revenue: 142000 },
      { period: 'Fev', planned: 64000, actual: 63200, revenue: 158000 },
      { period: 'Mar', planned: 68000, actual: 70000, revenue: 175000 },
      { period: 'Abr', planned: 66000, actual: 64800, revenue: 162000 },
      { period: 'Mai', planned: 72000, actual: 74000, revenue: 185000 },
      { period: 'Jun', planned: 70000, actual: 68800, revenue: 172000 }
    ];

    // Dados mock para a tabela de fluxo de caixa hierárquica
    const cashFlowHierarchicalData = [
      {
        id: 'group-1',
        name: 'Atividades Operacionais',
        type: 'inflow',
        subGroups: [
          {
            id: 'subgroup-1-1',
            name: 'Receitas de Vendas',
            type: 'inflow',
            accounts: [
              { id: 'acc-1-1-1', name: 'Vendas de Produtos', code: '3.1.01', value: 150000, type: 'inflow' },
              { id: 'acc-1-1-2', name: 'Vendas de Serviços', code: '3.1.02', value: 85000, type: 'inflow' },
              { id: 'acc-1-1-3', name: 'Outras Receitas', code: '3.1.03', value: 12000, type: 'inflow' }
            ]
          },
          {
            id: 'subgroup-1-2',
            name: 'Custos Operacionais',
            type: 'outflow',
            accounts: [
              { id: 'acc-1-2-1', name: 'Custo dos Produtos Vendidos', code: '4.1.01', value: -95000, type: 'outflow' },
              { id: 'acc-1-2-2', name: 'Custo dos Serviços', code: '4.1.02', value: -45000, type: 'outflow' }
            ]
          }
        ]
      },
      {
        id: 'group-2',
        name: 'Atividades de Investimento',
        type: 'outflow',
        subGroups: [
          {
            id: 'subgroup-2-1',
            name: 'Investimentos em Ativos',
            type: 'outflow',
            accounts: [
              { id: 'acc-2-1-1', name: 'Aquisição de Equipamentos', code: '1.2.01', value: -25000, type: 'outflow' },
              { id: 'acc-2-1-2', name: 'Investimentos em Software', code: '1.2.02', value: -8000, type: 'outflow' }
            ]
          }
        ]
      },
      {
        id: 'group-3',
        name: 'Atividades de Financiamento',
        type: 'inflow',
        subGroups: [
          {
            id: 'subgroup-3-1',
            name: 'Empréstimos e Financiamentos',
            type: 'inflow',
            accounts: [
              { id: 'acc-3-1-1', name: 'Empréstimos Bancários', code: '2.2.01', value: 50000, type: 'inflow' },
              { id: 'acc-3-1-2', name: 'Financiamentos', code: '2.2.02', value: 30000, type: 'inflow' }
            ]
          }
        ]
      }
    ];

    return (
      <div className="space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p className="text-sm text-primary-700 font-medium">Caixa Inicial</p>
            <p className="text-xl font-bold text-primary-800">
              {formatCurrency(data?.beginningCash)}
            </p>
          </div>
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <p className="text-sm text-secondary-700 font-medium">Fluxo de Caixa Líquido</p>
            <p className="text-xl font-bold text-secondary-800">
              {formatCurrency(data?.netCashFlow)}
            </p>
          </div>
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <p className="text-sm text-success-700 font-medium">Caixa Final</p>
            <p className="text-xl font-bold text-success-800">
              {formatCurrency(data?.endingCash)}
            </p>
          </div>
        </div>

        {/* Tabela de Fluxo de Caixa com Análise Vertical */}
        <CashFlowTable 
          data={cashFlowHierarchicalData}
          period="Junho 2024"
        />

        {/* Gráficos de Comparação */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Gráfico de Receita de Vendas */}
          <ComparisonBarChart
            title="Receita de Vendas - Planejado vs Realizado"
            data={revenueComparisonData}
            plannedKey="planned"
            actualKey="actual"
            showPercentage={false}
          />

          {/* Gráfico de Custo Variável (Valores Absolutos) */}
          <ComparisonBarChart
            title="Custo Variável - Valores Absolutos"
            data={variableCostData}
            plannedKey="planned"
            actualKey="actual"
            showPercentage={false}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Gráfico de Custo Variável (Percentuais) */}
          <ComparisonBarChart
            title="Custo Variável - % do Faturamento"
            data={variableCostData}
            plannedKey="planned"
            actualKey="actual"
            showPercentage={true}
            baseKey="revenue"
          />

          {/* Gráfico de Margem de Contribuição (Valores Absolutos) */}
          <ComparisonBarChart
            title="Margem de Contribuição - Valores Absolutos"
            data={contributionMarginData}
            plannedKey="planned"
            actualKey="actual"
            showPercentage={false}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
          {/* Gráfico de Margem de Contribuição (Percentuais) */}
          <ComparisonBarChart
            title="Margem de Contribuição - % do Faturamento"
            data={contributionMarginData}
            plannedKey="planned"
            actualKey="actual"
            showPercentage={true}
            baseKey="revenue"
          />
        </div>

        {/* Cash Flow Sections - Tabela Original */}
        {data?.sections?.map((section, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              {section?.name}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {section?.items?.map((item, itemIndex) => (
                    <tr key={itemIndex} className="border-b border-border last:border-b-0">
                      <td className="py-2 text-sm text-text-primary">{item?.account}</td>
                      <td className={`py-2 text-sm text-right font-medium ${
                        item?.amount >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {item?.amount >= 0 ? '' : '('}{formatCurrency(item?.amount)}{item?.amount < 0 ? ')' : ''}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary bg-primary-50">
                    <td className="py-3 text-sm font-semibold text-text-primary">
                      Caixa Líquido de {section?.name}
                    </td>
                    <td className={`py-3 text-sm text-right font-bold ${
                      section?.total >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {section?.total >= 0 ? '' : '('}{formatCurrency(section?.total)}{section?.total < 0 ? ')' : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReportContent = () => {
    switch (report?.id) {
      case 'profit-loss':
        return renderProfitLossReport();
      case 'balance-sheet':
        return renderBalanceSheetReport();
      case 'cash-flow':
        return renderCashFlowReport();
      default:
        return (
          <div className="text-center py-12">
            <Icon name="FileText" size={48} color="var(--color-text-secondary)" className="mx-auto mb-4" />
            <p className="text-text-secondary">Visualizador de relatório para {report?.name} está em desenvolvimento</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Report Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold text-text-primary">{data?.title}</h2>
            <p className="text-text-secondary mt-1">{data?.period}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Format:</span>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium">
              {filters?.format === 'summary' ? 'Summary' : 'Detailed'}
            </span>
          </div>
        </div>
      </div>
      {/* Report Content */}
      <div className="p-6">
        {renderReportContent()}
      </div>
    </div>
  );
};

export default ReportViewer;