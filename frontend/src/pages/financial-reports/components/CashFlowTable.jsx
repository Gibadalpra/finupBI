import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Componente de Tabela de Fluxo de Caixa com Análise Vertical
 * 
 * Exibe uma tabela hierárquica do fluxo de caixa seguindo a estrutura
 * do Plano de Contas (Grupo > SubGrupo > Conta) com análise vertical.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Dados do fluxo de caixa organizados hierarquicamente
 * @param {string} props.period - Período de referência
 */
const CashFlowTable = ({ data = [], period = 'Mensal' }) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [expandedSubGroups, setExpandedSubGroups] = useState(new Set());

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
    if (!value) return '0,0%';
    return `${value.toFixed(1)}%`;
  };

  // Calcular total geral para análise vertical
  const totalGeneral = data.reduce((sum, group) => {
    return sum + (group.subGroups || []).reduce((subSum, subGroup) => {
      return subSum + (subGroup.accounts || []).reduce((accSum, account) => {
        return accSum + Math.abs(account.value || 0);
      }, 0);
    }, 0);
  }, 0);

  // Toggle de expansão de grupos
  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Toggle de expansão de subgrupos
  const toggleSubGroup = (subGroupId) => {
    const newExpanded = new Set(expandedSubGroups);
    if (newExpanded.has(subGroupId)) {
      newExpanded.delete(subGroupId);
    } else {
      newExpanded.add(subGroupId);
    }
    setExpandedSubGroups(newExpanded);
  };

  // Calcular total de um grupo
  const getGroupTotal = (group) => {
    return (group.subGroups || []).reduce((sum, subGroup) => {
      return sum + (subGroup.accounts || []).reduce((accSum, account) => {
        return accSum + (account.value || 0);
      }, 0);
    }, 0);
  };

  // Calcular total de um subgrupo
  const getSubGroupTotal = (subGroup) => {
    return (subGroup.accounts || []).reduce((sum, account) => {
      return sum + (account.value || 0);
    }, 0);
  };

  // Determinar cor baseada no tipo de fluxo
  const getValueColor = (value, type) => {
    if (value > 0) {
      return type === 'inflow' ? 'text-green-600' : 'text-blue-600';
    } else if (value < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fluxo de Caixa</h3>
            <p className="text-sm text-gray-600">Análise Vertical - {period}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Geral</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(totalGeneral)}
            </p>
          </div>
        </div>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
          <div className="col-span-6">Conta</div>
          <div className="col-span-2 text-right">Valor</div>
          <div className="col-span-2 text-right">% Vertical</div>
          <div className="col-span-2 text-right">Tipo</div>
        </div>
      </div>

      {/* Conteúdo da tabela */}
      <div className="max-h-96 overflow-y-auto">
        {data.map((group) => {
          const groupTotal = getGroupTotal(group);
          const groupPercentage = totalGeneral > 0 ? (Math.abs(groupTotal) / totalGeneral) * 100 : 0;
          const isGroupExpanded = expandedGroups.has(group.id);

          return (
            <div key={group.id}>
              {/* Linha do Grupo */}
              <div 
                className="px-6 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center gap-2">
                    {isGroupExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-semibold text-gray-900">{group.name}</span>
                  </div>
                  <div className={`col-span-2 text-right font-semibold ${getValueColor(groupTotal, group.type)}`}>
                    {formatCurrency(groupTotal)}
                  </div>
                  <div className="col-span-2 text-right text-gray-600 font-medium">
                    {formatPercentage(groupPercentage)}
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      group.type === 'inflow' 
                        ? 'bg-green-100 text-green-800'
                        : group.type === 'outflow'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {group.type === 'inflow' ? 'Entrada' : group.type === 'outflow' ? 'Saída' : 'Neutro'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SubGrupos expandidos */}
              {isGroupExpanded && (group.subGroups || []).map((subGroup) => {
                const subGroupTotal = getSubGroupTotal(subGroup);
                const subGroupPercentage = totalGeneral > 0 ? (Math.abs(subGroupTotal) / totalGeneral) * 100 : 0;
                const isSubGroupExpanded = expandedSubGroups.has(subGroup.id);

                return (
                  <div key={subGroup.id}>
                    {/* Linha do SubGrupo */}
                    <div 
                      className="px-6 py-2 border-b border-gray-50 hover:bg-gray-25 cursor-pointer bg-gray-25"
                      onClick={() => toggleSubGroup(subGroup.id)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center gap-2 pl-6">
                          {isSubGroupExpanded ? (
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          )}
                          <span className="font-medium text-gray-800">{subGroup.name}</span>
                        </div>
                        <div className={`col-span-2 text-right font-medium ${getValueColor(subGroupTotal, subGroup.type)}`}>
                          {formatCurrency(subGroupTotal)}
                        </div>
                        <div className="col-span-2 text-right text-gray-600">
                          {formatPercentage(subGroupPercentage)}
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="text-xs text-gray-500">
                            {subGroup.type === 'inflow' ? 'Entrada' : subGroup.type === 'outflow' ? 'Saída' : 'Neutro'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contas expandidas */}
                    {isSubGroupExpanded && (subGroup.accounts || []).map((account) => {
                      const accountPercentage = totalGeneral > 0 ? (Math.abs(account.value || 0) / totalGeneral) * 100 : 0;

                      return (
                        <div key={account.id} className="px-6 py-2 border-b border-gray-50 hover:bg-blue-25">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-6 pl-12">
                              <span className="text-gray-700">{account.name}</span>
                              {account.code && (
                                <span className="ml-2 text-xs text-gray-500">({account.code})</span>
                              )}
                            </div>
                            <div className={`col-span-2 text-right ${getValueColor(account.value, account.type)}`}>
                              {formatCurrency(account.value)}
                            </div>
                            <div className="col-span-2 text-right text-gray-600 text-sm">
                              {formatPercentage(accountPercentage)}
                            </div>
                            <div className="col-span-2 text-right">
                              <span className="text-xs text-gray-400">
                                {account.type === 'inflow' ? 'Entrada' : account.type === 'outflow' ? 'Saída' : 'Neutro'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div className="text-center">
            <p className="text-gray-600 mb-1">Total Entradas</p>
            <p className="font-semibold text-green-600">
              {formatCurrency(
                data.reduce((sum, group) => {
                  const groupTotal = getGroupTotal(group);
                  return sum + (group.type === 'inflow' && groupTotal > 0 ? groupTotal : 0);
                }, 0)
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Total Saídas</p>
            <p className="font-semibold text-red-600">
              {formatCurrency(
                data.reduce((sum, group) => {
                  const groupTotal = getGroupTotal(group);
                  return sum + (group.type === 'outflow' && groupTotal < 0 ? Math.abs(groupTotal) : 0);
                }, 0)
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Saldo Líquido</p>
            <p className={`font-semibold ${
              data.reduce((sum, group) => sum + getGroupTotal(group), 0) >= 0 
                ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(
                data.reduce((sum, group) => sum + getGroupTotal(group), 0)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowTable;