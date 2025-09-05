import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Seleção de Cliente para Plano de Contas
 * 
 * Permite que usuários internos selecionem qual cliente terá seu Plano de Contas gerenciado.
 * Inclui busca por nome/CNPJ e exibição de informações do cliente.
 * 
 * @param {Array} clients - Lista de clientes disponíveis
 * @param {Object} selectedClient - Cliente atualmente selecionado
 * @param {Function} onClientSelect - Callback quando um cliente é selecionado
 * @param {string} userRole - Papel do usuário (partner, staff, freelancer)
 */
const ClientSelector = ({ clients = [], selectedClient, onClientSelect, userRole }) => {
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
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Seleção de Cliente
          </h2>
          <p className="text-sm text-text-secondary">
            Escolha o cliente para gerenciar seu Plano de Contas
          </p>
        </div>
        
        {selectedClient && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Building" size={16} />
            <span>Cliente selecionado</span>
          </div>
        )}
      </div>
      
      {/* Dropdown de Seleção */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
            selectedClient 
              ? 'border-primary bg-primary/5 text-text-primary' 
              : 'border-border bg-background text-text-secondary hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon name="Building" size={20} />
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
                <div className="text-text-secondary">
                  Selecione um cliente...
                </div>
              )}
            </div>
          </div>
          
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-text-secondary"
          />
        </button>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
            {/* Campo de Busca */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  placeholder="Buscar por nome ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                />
              </div>
            </div>
            
            {/* Lista de Clientes */}
            <div className="max-h-60 overflow-y-auto">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-background-secondary transition-colors ${
                      selectedClient?.id === client.id ? 'bg-primary/10 border-r-2 border-primary' : ''
                    }`}
                  >
                    <Icon name="Building" size={16} className="text-text-secondary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-text-primary truncate">
                        {client.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        CNPJ: {client.cnpj}
                      </div>
                    </div>
                    
                    {selectedClient?.id === client.id && (
                      <Icon name="Check" size={16} className="text-primary flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-text-secondary">
                  <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
                  <p>Nenhum cliente encontrado</p>
                  <p className="text-sm mt-1">Tente ajustar os termos de busca</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Informações do Cliente Selecionado */}
      {selectedClient && (
        <div className="mt-4 p-4 bg-background-secondary rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-2">
                Informações do Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-text-secondary">Nome:</span>
                  <span className="ml-2 text-text-primary font-medium">
                    {selectedClient.name}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">CNPJ:</span>
                  <span className="ml-2 text-text-primary font-medium">
                    {selectedClient.cnpj}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedClient.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedClient.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onClientSelect(null)}
              className="ml-4 p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors"
              title="Limpar seleção"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;