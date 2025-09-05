import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Icon from 'components/AppIcon';

// Dados simulados para demonstração
const dadosInadimplencia = {
  resumo: {
    totalInadimplentes: 127,
    valorTotal: 485750.00,
    ticketMedio: 3825.00,
    taxaInadimplencia: 8.5
  },
  evolucaoMensal: [
    { mes: 'Jan', valor: 320000, quantidade: 95 },
    { mes: 'Fev', valor: 380000, quantidade: 110 },
    { mes: 'Mar', valor: 420000, quantidade: 118 },
    { mes: 'Abr', valor: 390000, quantidade: 105 },
    { mes: 'Mai', valor: 450000, quantidade: 125 },
    { mes: 'Jun', valor: 485750, quantidade: 127 }
  ],
  faixasAtraso: [
    { faixa: '1-30 dias', quantidade: 45, valor: 125000, cor: '#FFA726' },
    { faixa: '31-60 dias', quantidade: 32, valor: 145000, cor: '#FF7043' },
    { faixa: '61-90 dias', quantidade: 28, valor: 110000, cor: '#EF5350' },
    { faixa: '90+ dias', quantidade: 22, valor: 105750, cor: '#E53935' }
  ],
  topInadimplentes: [
    { cliente: 'Empresa ABC Ltda', valor: 25000, dias: 45, contato: '(11) 9999-9999' },
    { cliente: 'Comércio XYZ S/A', valor: 18500, dias: 32, contato: '(11) 8888-8888' },
    { cliente: 'Indústria DEF ME', valor: 15750, dias: 67, contato: '(11) 7777-7777' },
    { cliente: 'Serviços GHI Eireli', valor: 12300, dias: 28, contato: '(11) 6666-6666' },
    { cliente: 'Distribuidora JKL', valor: 11200, dias: 89, contato: '(11) 5555-5555' }
  ]
};

const Inadimplencia = () => {
  const navigate = useNavigate();
  // Estados padrão
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [userRole, setUserRole] = useState('staff'); // Mock user role
  const [filtroFaixa, setFiltroFaixa] = useState('todas');
  const [dadosFiltrados, setDadosFiltrados] = useState(dadosInadimplencia.topInadimplentes);

  // Mock user data
  const mockUser = {
    name: "João Silva",
    email: "joao@empresa.com",
    avatar: "/avatars/joao.jpg"
  };

  useEffect(() => {
    // Simular filtro por faixa de atraso
    if (filtroFaixa === 'todas') {
      setDadosFiltrados(dadosInadimplencia.topInadimplentes);
    } else {
      // Aqui seria implementada a lógica real de filtro
      setDadosFiltrados(dadosInadimplencia.topInadimplentes.slice(0, 3));
    }
  }, [filtroFaixa]);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPorcentagem = (valor) => {
    return `${valor.toFixed(1)}%`;
  };

  // Handlers padrão
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Efeito para simular carregamento de dados
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={mockUser} 
        onMenuToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        userRole={userRole}
      />
      <main className={`pt-header-height nav-transition ${
        sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar-width'
      }`}>
        <div className="p-6 space-y-6">
          {/* Cabeçalho da Página */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  Inadimplência
                </h1>
                <p className="text-text-secondary">
                  Análise e gestão de clientes em atraso
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition flex items-center space-x-2">
                  <Icon name="Download" size={16} color="#2c3e50" />
                  <span>Exportar</span>
                </button>
                
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition flex items-center space-x-2">
                  <Icon name="Plus" size={16} color="white" />
                  <span>Nova Cobrança</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="AlertTriangle" size={16} color="#e74c3c" />
                <span className="text-sm text-text-secondary">Total Inadimplentes</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">
                {loading ? '...' : dadosInadimplencia.resumo.totalInadimplentes}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="DollarSign" size={16} color="#f39c12" />
                <span className="text-sm text-text-secondary">Valor Total</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">
                {loading ? '...' : formatarMoeda(dadosInadimplencia.resumo.valorTotal)}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="TrendingUp" size={16} color="#4a90a4" />
                <span className="text-sm text-text-secondary">Ticket Médio</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">
                {loading ? '...' : formatarMoeda(dadosInadimplencia.resumo.ticketMedio)}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Percent" size={16} color="#e74c3c" />
                <span className="text-sm text-text-secondary">Taxa de Inadimplência</span>
              </div>
              <p className="text-xl font-semibold text-error">
                {loading ? '...' : formatarPorcentagem(dadosInadimplencia.resumo.taxaInadimplencia)}
              </p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Evolução Mensal */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary">Evolução Mensal</h3>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center space-x-1 text-sm text-text-secondary">
                    <div className="w-3 h-3 bg-error rounded-full"></div>
                    <span>Valor</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 text-sm text-text-secondary">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span>Quantidade</span>
                  </span>
                </div>
              </div>
          
          {/* Gráfico simulado com barras */}
          <div className="space-y-4">
            {dadosInadimplencia.evolucaoMensal.map((item, index) => {
              const maxValor = Math.max(...dadosInadimplencia.evolucaoMensal.map(d => d.valor));
              const maxQtd = Math.max(...dadosInadimplencia.evolucaoMensal.map(d => d.quantidade));
              const alturaValor = (item.valor / maxValor) * 100;
              const alturaQtd = (item.quantidade / maxQtd) * 100;
              
              return (
                <div key={index} className="flex items-end space-x-2">
                  <span className="text-sm font-medium text-text-secondary w-8">{item.mes}</span>
                  <div className="flex-1 flex items-end space-x-1 h-16">
                    <div 
                      className="bg-error rounded-t w-4" 
                      style={{ height: `${alturaValor}%` }}
                      title={`Valor: ${formatarMoeda(item.valor)}`}
                    ></div>
                    <div 
                      className="bg-warning rounded-t w-4" 
                      style={{ height: `${alturaQtd}%` }}
                      title={`Quantidade: ${item.quantidade}`}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-text-secondary w-20">
                    <div>{formatarMoeda(item.valor / 1000)}k</div>
                    <div>{item.quantidade}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

            {/* Faixas de Atraso */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">Faixas de Atraso</h3>
          
          <div className="space-y-4">
            {dadosInadimplencia.faixasAtraso.map((faixa, index) => {
              const maxValor = Math.max(...dadosInadimplencia.faixasAtraso.map(f => f.valor));
              const largura = (faixa.valor / maxValor) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{faixa.faixa}</span>
                    <span className="text-sm text-text-secondary">{faixa.quantidade} clientes</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${largura}%`, 
                        backgroundColor: faixa.cor 
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>{formatarMoeda(faixa.valor)}</span>
                    <span>{formatarPorcentagem((faixa.valor / dadosInadimplencia.resumo.valorTotal) * 100)}</span>
                  </div>
                </div>
              );
            })}
              </div>
            </div>
          </div>

          {/* Top Inadimplentes */}
          <div className="bg-surface border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h3 className="text-lg font-heading font-semibold text-text-primary">Maiores Inadimplentes</h3>
                <select 
                  value={filtroFaixa} 
                  onChange={(e) => setFiltroFaixa(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary nav-transition text-sm"
                >
                  <option value="todas">Todas as faixas</option>
                  <option value="1-30">1-30 dias</option>
                  <option value="31-60">31-60 dias</option>
                  <option value="61-90">61-90 dias</option>
                  <option value="90+">90+ dias</option>
                </select>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-border rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-4 bg-border rounded w-32"></div>
                            <div className="h-3 bg-border rounded w-24"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-border rounded w-20"></div>
                        <div className="h-6 bg-border rounded-full w-16"></div>
                        <div className="h-3 bg-border rounded w-16"></div>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-border rounded-lg"></div>
                          <div className="w-8 h-8 bg-border rounded-lg"></div>
                          <div className="w-8 h-8 bg-border rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Cliente</th>
                        <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Valor</th>
                        <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Dias em Atraso</th>
                        <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Contato</th>
                        <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosFiltrados.map((cliente, index) => (
                        <tr key={index} className="border-b border-border hover:bg-background nav-transition">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <Icon name="Building2" size={16} color="#6366F1" />
                              </div>
                              <div>
                                <p className="font-medium text-text-primary">{cliente.cliente}</p>
                                <p className="text-sm text-text-secondary">Cliente #{index + 1}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-error">{formatarMoeda(cliente.valor)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cliente.dias <= 30 ? 'bg-warning-100 text-warning-800' :
                              cliente.dias <= 60 ? 'bg-orange-100 text-orange-800' :
                              cliente.dias <= 90 ? 'bg-red-100 text-red-800' :
                              'bg-red-200 text-red-900'
                            }`}>
                              {cliente.dias} dias
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-text-secondary">{cliente.contato}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg nav-transition" title="Enviar cobrança">
                                <Icon name="Mail" size={16} />
                              </button>
                              <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg nav-transition" title="Ligar">
                                <Icon name="Phone" size={16} />
                              </button>
                              <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg nav-transition" title="Ver detalhes">
                                <Icon name="Eye" size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inadimplencia;