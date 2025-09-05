import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Seleção de Cliente para Importação de Planejamento
 * 
 * Permite que usuários internos selecionem qual cliente terá seus dados de planejamento importados.
 * Inclui busca por nome/CNPJ e exibição de informações específicas de planejamento.
 * 
 * @param {Array} clients - Lista de clientes disponíveis
 * @param {Object} selectedClient - Cliente atualmente selecionado
 * @param {Function} onClientSelect - Callback quando um cliente é selecionado
 * @param {string} importType - Tipo de importação (planejamento)
 */
const ClientSelector = ({ clients = [], selectedClient, onClientSelect, importType = 'planejamento' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar clientes baseado no termo de busca
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cnpj.includes(searchTerm)
  );
  
  const handleClientSelect = (client) => {
    onClientSelect(client);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  // Formatar data da última importação de planejamento
  const formatLastImport = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <div className="relative">
      {/* Label */}
      <label className="block text-sm font-medium text-text-primary mb-2">
        Cliente *
      </label>
      
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full max-w-md flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon name="Building2" className="w-5 h-5 text-text-secondary" />
          <div className="text-left">
            {selectedClient ? (
              <>
                <div className="font-medium text-text-primary">
                  {selectedClient.name}
                </div>
                <div className="text-sm text-text-secondary">
                  CNPJ: {selectedClient.cnpj} • {selectedClient.planImportCount} importações de planejamento
                </div>
              </>
            ) : (
              <span className="text-text-secondary">Selecione um cliente...</span>
            )}
          </div>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-5 h-5 text-text-secondary transition-transform duration-200" 
        />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 max-w-md mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Buscar por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                autoFocus
              />
            </div>
          </div>
          
          {/* Client List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-background transition-colors duration-200 ${
                    selectedClient?.id === client.id ? 'bg-primary/10 border-r-2 border-primary' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      client.status === 'active' ? 'bg-success' : 'bg-warning'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary truncate">
                      {client.name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      CNPJ: {client.cnpj}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      Última importação de planejamento: {formatLastImport(client.lastPlanImport)}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-medium text-text-primary">
                      {client.planImportCount}
                    </div>
                    <div className="text-xs text-text-secondary">
                      importações
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-text-secondary">
                <Icon name="Search" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum cliente encontrado</p>
                <p className="text-xs mt-1">Tente buscar por nome ou CNPJ</p>
              </div>
            )}
          </div>
          
          {/* Footer Info */}
          <div className="px-4 py-3 border-t border-border bg-background/50">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Icon name="Info" className="w-4 h-4" />
              <span>Apenas clientes ativos podem ter dados de planejamento importados</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;