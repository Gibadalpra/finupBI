import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Componente de Upload de Arquivos
 * 
 * Permite o upload de arquivos XLS/CSV com validação de formato e tamanho.
 * Inclui drag & drop, preview do arquivo selecionado e validações.
 * 
 * @param {Function} onFileUpload - Callback quando um arquivo é selecionado
 * @param {Boolean} isProcessing - Se está processando um arquivo
 * @param {Array} acceptedFormats - Formatos aceitos (ex: ['.xlsx', '.xls', '.csv'])
 * @param {Number} maxFileSize - Tamanho máximo em MB
 */
const FileUploadPanel = ({ 
  onFileUpload, 
  isProcessing = false, 
  acceptedFormats = ['.xlsx', '.xls', '.csv'],
  maxFileSize = 10 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
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
  
  // Confirmar upload
  const handleConfirmUpload = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
    }
  };
  
  // Limpar seleção
  const handleClearFile = () => {
    setSelectedFile(null);
    setUploadError(null);
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
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Upload" className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Upload de Arquivo
          </h3>
          <p className="text-sm text-text-secondary">
            Selecione um arquivo XLS ou CSV com os dados realizados
          </p>
        </div>
      </div>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : selectedFile 
              ? 'border-success bg-success/5'
              : uploadError
                ? 'border-error bg-error/5'
                : 'border-border hover:border-primary hover:bg-primary/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        {/* Upload Content */}
        {!selectedFile ? (
          <div className="space-y-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              dragActive ? 'bg-primary text-white' : 'bg-background text-text-secondary'
            }`}>
              <Icon name="Upload" className="w-8 h-8" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-text-primary mb-2">
                {dragActive ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
              </p>
              <p className="text-sm text-text-secondary">
                Formatos aceitos: {acceptedFormats.join(', ')} • Máximo: {maxFileSize}MB
              </p>
            </div>
            
            {!dragActive && (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                disabled={isProcessing}
              >
                <Icon name="FolderOpen" className="w-4 h-4" />
                Selecionar Arquivo
              </button>
            )}
          </div>
        ) : (
          /* File Selected */
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-success text-white rounded-full flex items-center justify-center">
              <Icon name="FileText" className="w-8 h-8" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-text-primary mb-1">
                {selectedFile.name}
              </p>
              <p className="text-sm text-text-secondary">
                {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Arquivo'}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleClearFile}
                className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border text-text-secondary rounded-lg hover:bg-surface transition-colors duration-200"
                disabled={isProcessing}
              >
                <Icon name="X" className="w-4 h-4" />
                Remover
              </button>
              
              <button
                onClick={handleConfirmUpload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Icon name="Check" className="w-4 h-4" />
                    Confirmar Upload
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {uploadError && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" className="w-5 h-5 text-error" />
            <p className="text-sm font-medium text-error">
              {uploadError}
            </p>
          </div>
        </div>
      )}
      
      {/* Layout Requirements */}
      <div className="mt-6 p-4 bg-background rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Icon name="Info" className="w-4 h-4 text-primary" />
          Requisitos do Layout
        </h4>
        
        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex items-start gap-2">
            <Icon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span>Primeira linha deve conter os cabeçalhos das colunas</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span>Colunas obrigatórias: Data, Descrição, Valor, Categoria</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span>Formato de data: DD/MM/AAAA ou AAAA-MM-DD</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span>Valores numéricos com ponto ou vírgula como separador decimal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPanel;