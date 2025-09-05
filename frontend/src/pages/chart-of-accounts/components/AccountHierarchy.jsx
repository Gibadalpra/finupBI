import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Hierarquia do Plano de Contas
 * 
 * Exibe a estrutura hierárquica de três níveis (Grupo > SubGrupo > Conta)
 * com funcionalidades de expansão/colapso, seleção e ações.
 * 
 * @param {Object} chartOfAccounts - Estrutura do plano de contas
 * @param {Object} selectedAccount - Conta atualmente selecionada
 * @param {Function} onAccountSelect - Callback para seleção de conta
 * @param {Function} onEditAccount - Callback para edição de conta
 * @param {Function} onDeleteAccount - Callback para exclusão de conta
 * @param {Set} expandedGroups - Grupos expandidos
 * @param {Function} onToggleGroup - Callback para expandir/colapsar grupos
 * @param {Boolean} loading - Estado de carregamento
 */
const AccountHierarchy = ({ 
  chartOfAccounts, 
  selectedAccount, 
  onAccountSelect, 
  onEditAccount, 
  onDeleteAccount,
  expandedGroups,
  onToggleGroup,
  loading = false 
}) => {
  const [expandedSubGroups, setExpandedSubGroups] = useState(new Set());
  
  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-text-secondary">Carregando plano de contas...</span>
        </div>
      </div>
    );
  }
  
  if (!chartOfAccounts || !chartOfAccounts.groups || chartOfAccounts.groups.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center py-12">
          <Icon name="TreePine" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Nenhum Plano de Contas Encontrado
          </h3>
          <p className="text-text-secondary mb-4">
            Este cliente ainda não possui um plano de contas configurado.
          </p>
          <button
            onClick={() => onEditAccount({ type: 'group', level: 1 })}
            className="btn-primary"
          >
            Criar Primeiro Grupo
          </button>
        </div>
      </div>
    );
  }
  
  const toggleSubGroup = (subGroupId) => {
    const newExpanded = new Set(expandedSubGroups);
    if (newExpanded.has(subGroupId)) {
      newExpanded.delete(subGroupId);
    } else {
      newExpanded.add(subGroupId);
    }
    setExpandedSubGroups(newExpanded);
  };
  
  const handleAccountAction = (action, account, event) => {
    event.stopPropagation();
    
    switch (action) {
      case 'select':
        onAccountSelect(account);
        break;
      case 'edit':
        onEditAccount(account);
        break;
      case 'delete':
        if (window.confirm(`Tem certeza que deseja excluir "${account.name}"?`)) {
          onDeleteAccount(account.id);
        }
        break;
      case 'add-subgroup':
        onEditAccount({ type: 'subgroup', level: 2, parentId: account.id });
        break;
      case 'add-account':
        onEditAccount({ type: 'account', level: 3, parentId: account.id });
        break;
    }
  };
  
  const renderAccountActions = (account) => (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => handleAccountAction('edit', account, e)}
        className="p-1 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition-colors"
        title="Editar"
      >
        <Icon name="Edit2" size={14} />
      </button>
      
      {account.type === 'group' && (
        <button
          onClick={(e) => handleAccountAction('add-subgroup', account, e)}
          className="p-1 text-text-secondary hover:text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Adicionar SubGrupo"
        >
          <Icon name="Plus" size={14} />
        </button>
      )}
      
      {account.type === 'subgroup' && (
        <button
          onClick={(e) => handleAccountAction('add-account', account, e)}
          className="p-1 text-text-secondary hover:text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Adicionar Conta"
        >
          <Icon name="Plus" size={14} />
        </button>
      )}
      
      <button
        onClick={(e) => handleAccountAction('delete', account, e)}
        className="p-1 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Excluir"
      >
        <Icon name="Trash2" size={14} />
      </button>
    </div>
  );
  
  const renderAccount = (account) => (
    <div
      key={account.id}
      className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
        selectedAccount?.id === account.id
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-transparent hover:border-border hover:bg-background-secondary'
      }`}
      onClick={() => handleAccountAction('select', account)}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
            <Icon name="FileText" size={12} className="text-blue-600" />
          </div>
          <span className="text-sm font-mono text-text-secondary">
            {account.code}
          </span>
        </div>
        
        <div>
          <div className="font-medium text-text-primary">
            {account.name}
          </div>
          {account.description && (
            <div className="text-sm text-text-secondary mt-1">
              {account.description}
            </div>
          )}
        </div>
      </div>
      
      {renderAccountActions(account)}
    </div>
  );
  
  const renderSubGroup = (subGroup) => {
    const isExpanded = expandedSubGroups.has(subGroup.id);
    const hasAccounts = subGroup.accounts && subGroup.accounts.length > 0;
    
    return (
      <div key={subGroup.id} className="ml-6">
        {/* SubGrupo Header */}
        <div
          className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
            selectedAccount?.id === subGroup.id
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-transparent hover:border-border hover:bg-background-secondary'
          }`}
          onClick={() => handleAccountAction('select', subGroup)}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSubGroup(subGroup.id);
              }}
              className="p-1 hover:bg-background rounded transition-colors"
            >
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={16} 
                className="text-text-secondary"
              />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
                <Icon name="Folder" size={12} className="text-green-600" />
              </div>
              <span className="text-sm font-mono text-text-secondary">
                {subGroup.code}
              </span>
            </div>
            
            <div>
              <div className="font-medium text-text-primary">
                {subGroup.name}
              </div>
              {hasAccounts && (
                <div className="text-sm text-text-secondary">
                  {subGroup.accounts.length} conta(s)
                </div>
              )}
            </div>
          </div>
          
          {renderAccountActions(subGroup)}
        </div>
        
        {/* Contas do SubGrupo */}
        {isExpanded && hasAccounts && (
          <div className="ml-6 mt-2 space-y-1">
            {subGroup.accounts.map(renderAccount)}
          </div>
        )}
      </div>
    );
  };
  
  const renderGroup = (group) => {
    const isExpanded = expandedGroups.has(group.id);
    const hasSubGroups = group.subGroups && group.subGroups.length > 0;
    
    return (
      <div key={group.id} className="mb-4">
        {/* Grupo Header */}
        <div
          className={`group flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
            selectedAccount?.id === group.id
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border hover:border-primary/30 hover:bg-background-secondary'
          }`}
          onClick={() => handleAccountAction('select', group)}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleGroup(group.id);
              }}
              className="p-1 hover:bg-background rounded transition-colors"
            >
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={18} 
                className="text-text-secondary"
              />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <Icon name="FolderOpen" size={16} className="text-primary" />
              </div>
              <span className="text-lg font-mono text-text-secondary">
                {group.code}
              </span>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-text-primary">
                {group.name}
              </div>
              {hasSubGroups && (
                <div className="text-sm text-text-secondary">
                  {group.subGroups.length} subgrupo(s)
                </div>
              )}
            </div>
          </div>
          
          {renderAccountActions(group)}
        </div>
        
        {/* SubGrupos do Grupo */}
        {isExpanded && hasSubGroups && (
          <div className="mt-3 space-y-2">
            {group.subGroups.map(renderSubGroup)}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Estrutura Hierárquica
            </h2>
            <p className="text-sm text-text-secondary">
              Visualize e gerencie a estrutura de três níveis do plano de contas
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                chartOfAccounts.groups.forEach(group => {
                  onToggleGroup(group.id);
                  if (group.subGroups) {
                    group.subGroups.forEach(subGroup => {
                      setExpandedSubGroups(prev => new Set([...prev, subGroup.id]));
                    });
                  }
                });
              }}
              className="btn-secondary text-sm"
            >
              <Icon name="Expand" size={14} className="mr-1" />
              Expandir Tudo
            </button>
            
            <button
              onClick={() => onEditAccount({ type: 'group', level: 1 })}
              className="btn-primary text-sm"
            >
              <Icon name="Plus" size={14} className="mr-1" />
              Novo Grupo
            </button>
          </div>
        </div>
        
        {/* Legenda */}
        <div className="flex items-center gap-6 text-sm text-text-secondary border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
              <Icon name="FolderOpen" size={10} className="text-primary" />
            </div>
            <span>Grupo (Nível 1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center">
              <Icon name="Folder" size={10} className="text-green-600" />
            </div>
            <span>SubGrupo (Nível 2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center">
              <Icon name="FileText" size={10} className="text-blue-600" />
            </div>
            <span>Conta (Nível 3)</span>
          </div>
        </div>
      </div>
      
      {/* Hierarquia */}
      <div className="card p-6">
        <div className="space-y-3">
          {chartOfAccounts.groups.map(renderGroup)}
        </div>
      </div>
      
      {/* Informações da Conta Selecionada */}
      {selectedAccount && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Detalhes da Seleção
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary">Código</label>
              <div className="text-text-primary font-mono">{selectedAccount.code}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Nome</label>
              <div className="text-text-primary">{selectedAccount.name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Tipo</label>
              <div className="text-text-primary capitalize">
                {selectedAccount.type === 'group' ? 'Grupo' : 
                 selectedAccount.type === 'subgroup' ? 'SubGrupo' : 'Conta'}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Nível</label>
              <div className="text-text-primary">{selectedAccount.level}</div>
            </div>
            {selectedAccount.description && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-text-secondary">Descrição</label>
                <div className="text-text-primary">{selectedAccount.description}</div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <button
              onClick={() => onEditAccount(selectedAccount)}
              className="btn-primary"
            >
              <Icon name="Edit2" size={16} className="mr-2" />
              Editar
            </button>
            
            <button
              onClick={() => {
                if (window.confirm(`Tem certeza que deseja excluir "${selectedAccount.name}"?`)) {
                  onDeleteAccount(selectedAccount.id);
                }
              }}
              className="btn-secondary text-red-600 hover:bg-red-50"
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountHierarchy;