# Guia de Padronização de Layout - FinupBI

## 📋 Visão Geral

Este documento estabelece os padrões de layout e estilo para todas as páginas do sistema FinupBI, baseado na análise das páginas existentes: Gestão de Transações, Conciliação Bancária, Relatórios Financeiros e Centro de Conformidade Fiscal.

## 🏗️ Estrutura Base de Layout

### 1. Estrutura HTML Principal

Todas as páginas devem seguir esta estrutura hierárquica:

```jsx
<div className="min-h-screen bg-background">
  <Header 
    user={user} 
    onMenuToggle={handleSidebarToggle}
    sidebarCollapsed={sidebarCollapsed}
  />
  <Sidebar 
    collapsed={sidebarCollapsed}
    onToggle={handleSidebarToggle}
    userRole="staff"
  />
  <main className={`pt-header-height nav-transition ${
    sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar-width'
  }`}>
    <div className="p-6 space-y-6">
      {/* Conteúdo da página */}
    </div>
  </main>
</div>
```

### 2. Imports Obrigatórios

Todas as páginas devem incluir estes imports básicos:

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Icon from 'components/AppIcon';
```

## 📱 Componentes de Layout Padrão

### 1. Cabeçalho da Página (Page Header)

**Estrutura obrigatória:**

```jsx
<div className="mb-6">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
        {título da página}
      </h1>
      <p className="text-text-secondary">
        {descrição da página}
      </p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
      {/* Botões de ação */}
    </div>
  </div>
</div>
```

**Padrões de botões no cabeçalho:**

```jsx
{/* Botão secundário (Import/Export) */}
<button className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition flex items-center space-x-2">
  <Icon name="Upload" size={16} color="#2c3e50" />
  <span>Import</span>
</button>

{/* Botão primário */}
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition flex items-center space-x-2">
  <Icon name="Plus" size={16} color="white" />
  <span>Adicionar</span>
</button>

{/* Botão secundário colorido */}
<button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-700 nav-transition flex items-center space-x-2">
  <Icon name="RefreshCw" size={16} color="white" />
  <span>Sincronizar</span>
</button>
```

### 2. Cards de Estatísticas

**Grid responsivo para estatísticas:**

```jsx
<div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
  <div className="bg-surface border border-border rounded-lg p-4">
    <div className="flex items-center space-x-2 mb-1">
      <Icon name="FileText" size={16} color="#7f8c8d" />
      <span className="text-sm text-text-secondary">Label</span>
    </div>
    <p className="text-xl font-semibold text-text-primary">{valor}</p>
  </div>
</div>
```

**Cores padrão para ícones de status:**
- Neutro/Total: `#7f8c8d`
- Sucesso/Conciliado: `#27ae60`
- Aviso/Pendente: `#f39c12`
- Erro/Revisão: `#e74c3c`
- Informação/Valores: `#4a90a4`

### 3. Navegação por Abas

```jsx
<div className="border-b border-border mb-6">
  <nav className="flex space-x-8">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`py-2 px-1 border-b-2 font-medium text-sm nav-transition ${
          activeTab === tab.id
            ? 'border-primary text-primary'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
        }`}
      >
        {tab.name}
      </button>
    ))}
  </nav>
</div>
```

## 🎨 Sistema de Cores e Classes

### 1. Classes de Background
- **Página principal:** `bg-background`
- **Cards/Superfícies:** `bg-surface`
- **Bordas:** `border-border`

### 2. Classes de Texto
- **Título principal:** `text-text-primary`
- **Texto secundário:** `text-text-secondary`
- **Sucesso:** `text-success`
- **Aviso:** `text-warning`
- **Erro:** `text-error`

### 3. Classes de Botão
- **Primário:** `bg-primary text-white hover:bg-primary-700`
- **Secundário:** `bg-secondary text-white hover:bg-secondary-700`
- **Neutro:** `bg-surface border border-border text-text-primary hover:bg-background`

### 4. Transições
- **Padrão:** `nav-transition` (aplicar em todos os elementos interativos)

## 📐 Espaçamento e Grid

### 1. Container Principal
```jsx
<div className="p-6 space-y-6">
  {/* Todo conteúdo da página */}
</div>
```

### 2. Grids Responsivos

**Para cards de estatísticas:**
```jsx
<div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
```

**Para conteúdo principal:**
```jsx
<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
```

**Para layout de duas colunas:**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

### 3. Margens e Espaçamentos
- **Entre seções:** `mb-6` ou `space-y-6`
- **Entre elementos relacionados:** `mb-4` ou `space-y-4`
- **Entre botões:** `gap-3`
- **Padding interno de cards:** `p-4` ou `p-6`

## 🔧 Componentes Funcionais Padrão

### 1. Estado de Loading

```jsx
{loading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
) : (
  // Conteúdo normal
)}
```

### 2. Estado Vazio

```jsx
{data.length === 0 ? (
  <div className="text-center py-12">
    <Icon name="FileText" size={48} color="#bdc3c7" className="mx-auto mb-4" />
    <h3 className="text-lg font-medium text-text-primary mb-2">Nenhum item encontrado</h3>
    <p className="text-text-secondary">Não há dados para exibir no momento.</p>
  </div>
) : (
  // Lista de dados
)}
```

### 3. Filtros e Busca

```jsx
<div className="bg-surface border border-border rounded-lg p-4 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {/* Campos de filtro */}
  </div>
</div>
```

## 📱 Responsividade

### 1. Breakpoints Padrão
- **Mobile:** `sm:` (640px+)
- **Tablet:** `md:` (768px+)
- **Desktop:** `lg:` (1024px+)
- **Large Desktop:** `xl:` (1280px+)

### 2. Padrões Responsivos

**Cabeçalho:**
```jsx
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
```

**Botões:**
```jsx
<div className="flex flex-col sm:flex-row gap-3">
```

**Grid de cards:**
```jsx
<div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
```

## 🎯 Padrões de Interação

### 1. Seleção de Itens

```jsx
const [selectedItems, setSelectedItems] = useState([]);

const handleItemSelect = (itemId) => {
  setSelectedItems(prev => 
    prev.includes(itemId) 
      ? prev.filter(id => id !== itemId)
      : [...prev, itemId]
  );
};
```

### 2. Ações em Lote

```jsx
{selectedItems.length > 0 && (
  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
    <div className="flex items-center justify-between">
      <span className="text-primary font-medium">
        {selectedItems.length} item(s) selecionado(s)
      </span>
      <div className="flex space-x-2">
        {/* Botões de ação em lote */}
      </div>
    </div>
  </div>
)}
```

### 3. Modais

```jsx
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-surface rounded-lg p-6 w-full max-w-md mx-4">
      {/* Conteúdo do modal */}
    </div>
  </div>
)}
```

## 📊 Padrões de Dados

### 1. Estrutura de Estado

```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [filters, setFilters] = useState({});
const [selectedItems, setSelectedItems] = useState([]);
```

### 2. Manipulação de Filtros

```jsx
const handleFilterChange = (newFilters) => {
  setFilters(prev => ({ ...prev, ...newFilters }));
};

const filteredData = useMemo(() => {
  return data.filter(item => {
    // Lógica de filtro
  });
}, [data, filters]);
```

## 🔍 Acessibilidade

### 1. Estrutura Semântica
- Usar tags semânticas: `<main>`, `<section>`, `<article>`, `<nav>`
- Hierarquia correta de headings: `h1` → `h2` → `h3`
- Labels descritivos em botões e inputs

### 2. Navegação por Teclado
- Todos os elementos interativos devem ser acessíveis via teclado
- Ordem de foco lógica
- Indicadores visuais de foco

### 3. Contraste e Legibilidade
- Usar as classes de cor padrão do sistema
- Garantir contraste adequado entre texto e fundo
- Tamanhos de fonte legíveis

## 📝 Checklist de Implementação

### ✅ Estrutura Base
- [ ] Container principal com `min-h-screen bg-background`
- [ ] Header e Sidebar implementados
- [ ] Main com classes responsivas corretas
- [ ] Padding e spacing padrão (`p-6 space-y-6`)

### ✅ Cabeçalho da Página
- [ ] Título com `text-2xl font-heading font-bold text-text-primary`
- [ ] Descrição com `text-text-secondary`
- [ ] Layout responsivo flex
- [ ] Botões com classes e ícones padrão

### ✅ Componentes de UI
- [ ] Cards com `bg-surface border border-border rounded-lg`
- [ ] Ícones com cores padrão do sistema
- [ ] Transições com `nav-transition`
- [ ] Estados de loading e vazio implementados

### ✅ Responsividade
- [ ] Grid responsivo implementado
- [ ] Breakpoints corretos utilizados
- [ ] Layout mobile-first

### ✅ Interatividade
- [ ] Estados de seleção implementados
- [ ] Ações em lote quando aplicável
- [ ] Filtros e busca funcionais

### ✅ Acessibilidade
- [ ] Estrutura semântica correta
- [ ] Navegação por teclado funcional
- [ ] Contraste adequado
- [ ] Labels descritivos

## 🚀 Exemplo de Implementação Completa

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Icon from 'components/AppIcon';

const NovaPageTemplate = () => {
  // Estados padrão
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({});
  
  // Dados do usuário (mock)
  const user = {
    name: 'João Silva',
    email: 'joao@empresa.com',
    avatar: '/avatars/joao.jpg'
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

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Efeito para carregar dados
  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setData([]); // Dados mockados
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onMenuToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        userRole="staff"
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
                  Título da Nova Página
                </h1>
                <p className="text-text-secondary">
                  Descrição da funcionalidade da página
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-background nav-transition flex items-center space-x-2">
                  <Icon name="Download" size={16} color="#2c3e50" />
                  <span>Export</span>
                </button>
                
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition flex items-center space-x-2">
                  <Icon name="Plus" size={16} color="white" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="FileText" size={16} color="#7f8c8d" />
                <span className="text-sm text-text-secondary">Total</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">0</p>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="bg-surface border border-border rounded-lg p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div>
                {/* Conteúdo da página */}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NovaPageTemplate;
```

---

**Nota:** Este guia deve ser seguido rigorosamente para manter a consistência visual e funcional em todo o sistema FinupBI. Qualquer desvio deve ser documentado e aprovado pela equipe de desenvolvimento.