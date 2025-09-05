import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Modal de Processamento de Importação
 * 
 * Exibe o progresso do processamento de uma importação,
 * incluindo etapas, logs em tempo real e estatísticas.
 * 
 * @param {boolean} isOpen - Se o modal está aberto
 * @param {Function} onClose - Callback para fechar o modal
 * @param {Object} processingData - Dados do processamento em andamento
 * @param {Function} onCancel - Callback para cancelar o processamento
 */
const ProcessingModal = ({ 
  isOpen, 
  onClose, 
  processingData = {}, 
  onCancel 
}) => {
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Etapas do processamento
  const steps = [
    {
      id: 'validation',
      title: 'Validação do Arquivo',
      description: 'Verificando formato e estrutura'
    },
    {
      id: 'parsing',
      title: 'Leitura dos Dados',
      description: 'Extraindo registros do arquivo'
    },
    {
      id: 'validation_data',
      title: 'Validação dos Dados',
      description: 'Verificando integridade dos registros'
    },
    {
      id: 'processing',
      title: 'Processamento',
      description: 'Aplicando regras de negócio'
    },
    {
      id: 'saving',
      title: 'Salvando Dados',
      description: 'Persistindo no banco de dados'
    },
    {
      id: 'completed',
      title: 'Finalizado',
      description: 'Processamento concluído'
    }
  ];
  
  // Simular progresso (em uma implementação real, isso viria via WebSocket ou polling)
  useEffect(() => {
    if (!isOpen || !processingData.isProcessing) return;
    
    const interval = setInterval(() => {
      // Simular logs
      const sampleLogs = [
        { type: 'info', message: 'Iniciando validação do arquivo...', timestamp: new Date() },
        { type: 'success', message: 'Arquivo validado com sucesso', timestamp: new Date() },
        { type: 'info', message: 'Lendo registros do arquivo...', timestamp: new Date() },
        { type: 'warning', message: 'Encontrados 3 registros com formato inválido', timestamp: new Date() },
        { type: 'info', message: 'Aplicando regras de validação...', timestamp: new Date() },
        { type: 'success', message: 'Processamento concluído com sucesso', timestamp: new Date() }
      ];
      
      setLogs(prev => {
        if (prev.length < sampleLogs.length) {
          return [...prev, sampleLogs[prev.length]];
        }
        return prev;
      });
      
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isOpen, processingData.isProcessing]);
  
  // Reset quando modal abre
  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  // Formatar timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Obter ícone do tipo de log
  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'error':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'Info', color: 'text-info' };
    }
  };
  
  // Calcular progresso
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isCompleted = currentStep === steps.length - 1;
  const isProcessing = processingData.isProcessing && !isCompleted;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-border w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Upload" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Processando Importação
              </h2>
              <p className="text-sm text-text-secondary">
                {processingData.fileName || 'arquivo.xlsx'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isProcessing && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-error hover:bg-error/10 border border-error/20 rounded-lg transition-all duration-200"
              >
                Cancelar
              </button>
            )}
            
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Progress Steps */}
            <div className="p-6 border-r border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                Progresso do Processamento
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">
                    {Math.round(progress)}% Concluído
                  </span>
                  <span className="text-sm text-text-secondary">
                    Etapa {currentStep + 1} de {steps.length}
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              {/* Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  const isPending = index > currentStep;
                  
                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      {/* Step Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted ? 'bg-success border-success' :
                        isActive ? 'bg-primary border-primary' :
                        'bg-background border-border'
                      }`}>
                        {isCompleted ? (
                          <Icon name="Check" className="w-4 h-4 text-white" />
                        ) : isActive ? (
                          <Icon name="Loader2" className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <span className={`text-xs font-medium ${
                            isPending ? 'text-text-disabled' : 'text-white'
                          }`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium transition-colors duration-300 ${
                          isCompleted ? 'text-success' :
                          isActive ? 'text-primary' :
                          'text-text-secondary'
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-sm transition-colors duration-300 ${
                          isActive ? 'text-text-primary' : 'text-text-secondary'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Statistics */}
              <div className="mt-8 p-4 bg-background rounded-lg">
                <h4 className="font-medium text-text-primary mb-3">Estatísticas</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Registros Lidos:</span>
                    <p className="font-semibold text-text-primary">
                      {(processingData.recordsRead || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-secondary">Processados:</span>
                    <p className="font-semibold text-text-primary">
                      {(processingData.recordsProcessed || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-secondary">Com Erro:</span>
                    <p className="font-semibold text-error">
                      {(processingData.recordsErrors || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-secondary">Taxa de Sucesso:</span>
                    <p className="font-semibold text-success">
                      {processingData.recordsRead > 0 
                        ? (((processingData.recordsProcessed || 0) / processingData.recordsRead) * 100).toFixed(1)
                        : 0
                      }%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logs */}
            <div className="p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Log de Processamento
              </h3>
              
              <div className="flex-1 bg-background rounded-lg border border-border overflow-hidden">
                <div className="h-full overflow-y-auto p-4 space-y-3">
                  {logs.length > 0 ? (
                    logs.map((log, index) => {
                      const logInfo = getLogIcon(log.type);
                      
                      return (
                        <div key={index} className="flex items-start gap-3 text-sm">
                          <Icon name={logInfo.icon} className={`w-4 h-4 mt-0.5 flex-shrink-0 ${logInfo.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-text-secondary text-xs">
                                {formatTime(log.timestamp)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                log.type === 'success' ? 'bg-success/10 text-success' :
                                log.type === 'warning' ? 'bg-warning/10 text-warning' :
                                log.type === 'error' ? 'bg-error/10 text-error' :
                                'bg-info/10 text-info'
                              }`}>
                                {log.type.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-text-primary">{log.message}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                      <div className="text-center">
                        <Icon name="FileText" className="w-12 h-12 mx-auto mb-3 text-text-disabled" />
                        <p>Aguardando início do processamento...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              {isProcessing ? (
                <>
                  <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                  <span>Processamento em andamento...</span>
                </>
              ) : isCompleted ? (
                <>
                  <Icon name="CheckCircle" className="w-4 h-4 text-success" />
                  <span className="text-success">Processamento concluído com sucesso!</span>
                </>
              ) : (
                <>
                  <Icon name="Clock" className="w-4 h-4" />
                  <span>Aguardando início...</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {isCompleted && (
                <button className="px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg transition-all duration-200">
                  Ver Resultados
                </button>
              )}
              
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-background border border-border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCompleted ? 'Fechar' : 'Minimizar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;