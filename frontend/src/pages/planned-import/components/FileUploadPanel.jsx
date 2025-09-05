import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Upload de Arquivos para Planejamento
 * 
 * Permite o upload de arquivos XLS/CSV com dados de planejamento financeiro.
 * Inclui drag & drop, preview do arquivo selecionado e validações específicas para planejamento.
 * 
 * @param {Function} onFileUpload - Callback quando um arquivo é selecionado
 * @param {Boolean} isProcessing - Se está processando um arquivo
 * @param {string} importType - Tipo de importação (planejamento)
 * @param {Array} acceptedFormats - Formatos aceitos (ex: ['.xlsx', '.xls', '.csv'])
 * @param {Number} maxFileSize - Tamanho máximo em MB
 */
const FileUploadPanel = ({ 
  onFileUpload, 
  isProcessing = false,
  importType = 'planejamento',
  acceptedFormats = ['.xlsx', '.xls', '.csv'],
  maxFileSize = 15 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [importName, setImportName] = useState('');
  const [nameError, setNameError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Validar arquivo
  const validateFile = (file) => {
    const errors = [];
    
    // Verificar extensão
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      errors.push(`Formato não suportado. Use: ${acceptedFormats.join(', ')}`);
    }
    
    // Verificar tamanho
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      errors.push(`Arquivo muito grande. Máximo: ${maxFileSize}MB`);
    }
    
    // Validações específicas para planejamento
    if (file.name.length < 5) {
      errors.push('Nome do arquivo muito curto. Use um nome descritivo.');
    }
    
    return errors;
  };
  
  // Processar arquivo selecionado
  const handleFileSelect = (file) => {
    const errors = validateFile(file);
    
    if (errors.length > 0) {
      setUploadError(errors[0]);
      setSelectedFile(null);
      return;
    }
    
    setUploadError(null);
    setSelectedFile(file);
  };
  
  // Handler para input de arquivo
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };
  
  // Handlers para drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };
  
  // Validar nome da importação
  const validateImportName = (name) => {
    if (!name || name.trim().length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }
    if (name.length > 50) {
      return 'Nome muito longo (máximo 50 caracteres)';
    }
    return null;
  };

  // Confirmar upload
  const handleConfirmUpload = () => {
    const nameValidationError = validateImportName(importName);
    
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }
    
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile, importName.trim());
    }
  };
  
  // Limpar seleção
  const handleClearFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    setImportName('');
    setNameError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Formatar tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="space-y-6">
      {/* Instruções de Formato */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">
              Formato Esperado para Dados de Planejamento
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>Colunas obrigatórias:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Conta:</strong> Código da conta contábil (ex: 1.1.01.001)</li>
                <li><strong>Descrição:</strong> Descrição da conta ou item</li>
                <li><strong>Valor Planejado:</strong> Valor previsto (positivo para receitas, negativo para despesas)</li>
                <li><strong>Período:</strong> Período do planejamento (YYYY-MM ou YYYY-QX)</li>
                <li><strong>Centro de Custo:</strong> Centro de custo responsável</li>
                <li><strong>Categoria:</strong> Receita, Despesa, Investimento, etc.</li>
              </ul>
              <p className="mt-3">
                <strong>Formatos aceitos:</strong> {acceptedFormats.join(', ')} • 
                <strong>Tamanho máximo:</strong> {maxFileSize}MB
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Área de Upload */}
      <div className="border-2 border-dashed border-border rounded-lg p-8">
        {!selectedFile ? (
          <div
            className={`text-center transition-colors duration-200 ${
              dragActive ? 'border-primary bg-primary/5' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Icon 
              name="upload-cloud" 
              className={`w-16 h-16 mx-auto mb-4 ${
                dragActive ? 'text-primary' : 'text-text-secondary'
              }`} 
            />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Arraste seu arquivo de planejamento aqui
            </h3>
            <p className="text-text-secondary mb-4">
              ou clique para selecionar um arquivo
            </p>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Icon name="folder-open" className="w-5 h-5" />
              Selecionar Arquivo
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isProcessing}
            />
            
            <div className="mt-4 text-sm text-text-secondary">
              Formatos aceitos: {acceptedFormats.join(', ')} • Máximo: {maxFileSize}MB
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview do Arquivo */}
            <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg">
              <div className="flex-shrink-0">
                <Icon name="file-text" className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text-primary truncate">
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-text-secondary">
                  {formatFileSize(selectedFile.size)} • 
                  Modificado em {new Date(selectedFile.lastModified).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <button
                onClick={handleClearFile}
                className="flex-shrink-0 p-2 text-text-secondary hover:text-destructive transition-colors duration-200"
                title="Remover arquivo"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>
            
            {/* Campo Nome da Importação */}
            <div className="space-y-2">
              <label htmlFor="import-name" className="block text-sm font-medium text-text-primary">
                Nome da Importação *
              </label>
              <input
                id="import-name"
                type="text"
                value={importName}
                onChange={(e) => {
                  setImportName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="Ex: Planejado 2025, Revisão 2º Trimestre..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                  nameError ? 'border-destructive' : 'border-border'
                }`}
                disabled={isProcessing}
                maxLength={50}
              />
              {nameError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Icon name="alert-circle" className="w-4 h-4" />
                  {nameError}
                </p>
              )}
              <p className="text-xs text-text-secondary">
                Este nome será usado para identificar esta importação no histórico
              </p>
            </div>
            
            {/* Ações */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleConfirmUpload}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isProcessing ? (
                  <>
                    <Icon name="loader-2" className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Icon name="upload" className="w-5 h-5" />
                    Processar Planejamento
                  </>
                )}
              </button>
              
              <button
                onClick={handleClearFile}
                disabled={isProcessing}
                className="px-6 py-3 border border-border text-text-primary rounded-lg hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        {/* Erro de Upload */}
        {uploadError && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <Icon name="alert-circle" className="w-5 h-5" />
              <span className="font-medium">Erro no arquivo:</span>
            </div>
            <p className="text-sm text-destructive mt-1">{uploadError}</p>
          </div>
        )}
      </div>
      
      {/* Dicas de Planejamento */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="lightbulb" className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-900 mb-2">
              Dicas para Importação de Planejamento
            </h3>
            <div className="text-sm text-amber-800 space-y-1">
              <p>• Use valores positivos para receitas e negativos para despesas</p>
              <p>• Mantenha consistência nos códigos de conta entre períodos</p>
              <p>• Inclua todos os centros de custo relevantes</p>
              <p>• Verifique se os períodos estão no formato correto (YYYY-MM)</p>
              <p>• Categorize adequadamente cada item (Receita, Despesa, Investimento)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPanel;