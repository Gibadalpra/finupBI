import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Seleção de Cliente
 * 
 * Permite que usuários internos selecionem qual cliente terá seus dados importados.
 * Inclui busca por nome/CNPJ e exibição de informações básicas do cliente.
 * 
 * @param {Array} clients - Lista de clientes disponíveis
 * @param {Object} selectedClient - Cliente atualmente selecionado
 * @param {Function} onClientSelect - Callback quando um cliente é selecionado
 */
const ClientSelector = ({ clients = [], selectedClient, onClientSelect }) => {
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
                  CNPJ: {selectedClient.cnpj}
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
                  </div>
                  {selectedClient?.id === client.id && (
                    <Icon name="Check" className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-text-secondary">
                <Icon name="Search" className="w-8 h-8 mx-auto mb-2 text-text-disabled" />
                <p>Nenhum cliente encontrado</p>
                {searchTerm && (
                  <p className="text-sm mt-1">para "{searchTerm}"</p>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-border bg-background/50">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>{filteredClients.length} cliente(s) encontrado(s)</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary hover:text-primary-dark transition-colors duration-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay para fechar o dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientSelector;