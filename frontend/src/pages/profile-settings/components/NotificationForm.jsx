import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const NotificationForm = ({ notificationSettings, onChange, loading }) => {
  const [settings, setSettings] = useState({
    email: {
      systemUpdates: true,
      securityAlerts: true,
      reportReady: true,
      weeklyDigest: false,
      marketingEmails: false,
      accountActivity: true
    },
    push: {
      systemUpdates: true,
      securityAlerts: true,
      reportReady: false,
      reminders: true,
      mentions: true
    },
    inApp: {
      systemUpdates: true,
      securityAlerts: true,
      reportReady: true,
      taskAssignments: true,
      comments: true,
      mentions: true
    },
    frequency: {
      digestFrequency: 'weekly', // daily, weekly, monthly
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      timezone: 'America/Sao_Paulo'
    }
  });

  // Sincronizar com dados recebidos
  useEffect(() => {
    if (notificationSettings) {
      setSettings(prev => ({ ...prev, ...notificationSettings }));
    }
  }, [notificationSettings]);

  const handleToggle = (category, setting) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: !prev[category][setting]
        }
      };
      
      // Notificar componente pai
      onChange(newSettings);
      return newSettings;
    });
  };

  const handleFrequencyChange = (setting, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        frequency: {
          ...prev.frequency,
          [setting]: value
        }
      };
      
      onChange(newSettings);
      return newSettings;
    });
  };

  const handleQuietHoursChange = (field, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        frequency: {
          ...prev.frequency,
          quietHours: {
            ...prev.frequency.quietHours,
            [field]: value
          }
        }
      };
      
      onChange(newSettings);
      return newSettings;
    });
  };

  const NotificationToggle = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={onChange}
      disabled={disabled || loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const NotificationSection = ({ title, description, icon, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon name={icon} className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const NotificationItem = ({ title, description, enabled, onChange, important = false }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          {important && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              Importante
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <NotificationToggle 
        enabled={enabled} 
        onChange={onChange}
        disabled={important} // Notificações importantes não podem ser desabilitadas
      />
    </div>
  );

  const digestOptions = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Icon name="Bell" className="w-5 h-5" />
          <span>Notificações</span>
        </h2>
        <p className="mt-1 text-gray-600">
          Configure como e quando você deseja receber notificações
        </p>
      </div>

      <div className="space-y-6">
        {/* Notificações por E-mail */}
        <NotificationSection
          title="Notificações por E-mail"
          description="Receba atualizações importantes diretamente no seu e-mail"
          icon="Mail"
        >
          <NotificationItem
            title="Atualizações do Sistema"
            description="Notificações sobre manutenções, novas funcionalidades e atualizações"
            enabled={settings.email.systemUpdates}
            onChange={() => handleToggle('email', 'systemUpdates')}
          />
          
          <NotificationItem
            title="Alertas de Segurança"
            description="Notificações sobre atividades suspeitas e alterações de segurança"
            enabled={settings.email.securityAlerts}
            onChange={() => handleToggle('email', 'securityAlerts')}
            important={true}
          />
          
          <NotificationItem
            title="Relatórios Prontos"
            description="Quando seus relatórios financeiros estiverem prontos para visualização"
            enabled={settings.email.reportReady}
            onChange={() => handleToggle('email', 'reportReady')}
          />
          
          <NotificationItem
            title="Resumo Semanal"
            description="Resumo das atividades e métricas da semana"
            enabled={settings.email.weeklyDigest}
            onChange={() => handleToggle('email', 'weeklyDigest')}
          />
          
          <NotificationItem
            title="Atividade da Conta"
            description="Notificações sobre logins, alterações de perfil e atividades importantes"
            enabled={settings.email.accountActivity}
            onChange={() => handleToggle('email', 'accountActivity')}
          />
          
          <NotificationItem
            title="E-mails de Marketing"
            description="Novidades sobre produtos, dicas e conteúdo educacional"
            enabled={settings.email.marketingEmails}
            onChange={() => handleToggle('email', 'marketingEmails')}
          />
        </NotificationSection>

        {/* Notificações Push */}
        <NotificationSection
          title="Notificações Push"
          description="Notificações instantâneas no seu dispositivo"
          icon="Smartphone"
        >
          <NotificationItem
            title="Atualizações do Sistema"
            description="Notificações críticas sobre o sistema"
            enabled={settings.push.systemUpdates}
            onChange={() => handleToggle('push', 'systemUpdates')}
          />
          
          <NotificationItem
            title="Alertas de Segurança"
            description="Alertas imediatos sobre segurança da conta"
            enabled={settings.push.securityAlerts}
            onChange={() => handleToggle('push', 'securityAlerts')}
            important={true}
          />
          
          <NotificationItem
            title="Relatórios Prontos"
            description="Quando relatórios importantes estiverem disponíveis"
            enabled={settings.push.reportReady}
            onChange={() => handleToggle('push', 'reportReady')}
          />
          
          <NotificationItem
            title="Lembretes"
            description="Lembretes sobre tarefas pendentes e prazos"
            enabled={settings.push.reminders}
            onChange={() => handleToggle('push', 'reminders')}
          />
          
          <NotificationItem
            title="Menções"
            description="Quando você for mencionado em comentários ou discussões"
            enabled={settings.push.mentions}
            onChange={() => handleToggle('push', 'mentions')}
          />
        </NotificationSection>

        {/* Notificações no App */}
        <NotificationSection
          title="Notificações no Aplicativo"
          description="Notificações que aparecem dentro do sistema"
          icon="Monitor"
        >
          <NotificationItem
            title="Atualizações do Sistema"
            description="Avisos sobre manutenções e atualizações"
            enabled={settings.inApp.systemUpdates}
            onChange={() => handleToggle('inApp', 'systemUpdates')}
          />
          
          <NotificationItem
            title="Alertas de Segurança"
            description="Alertas de segurança exibidos no sistema"
            enabled={settings.inApp.securityAlerts}
            onChange={() => handleToggle('inApp', 'securityAlerts')}
            important={true}
          />
          
          <NotificationItem
            title="Relatórios Prontos"
            description="Notificações quando relatórios estiverem disponíveis"
            enabled={settings.inApp.reportReady}
            onChange={() => handleToggle('inApp', 'reportReady')}
          />
          
          <NotificationItem
            title="Atribuições de Tarefas"
            description="Quando tarefas forem atribuídas a você"
            enabled={settings.inApp.taskAssignments}
            onChange={() => handleToggle('inApp', 'taskAssignments')}
          />
          
          <NotificationItem
            title="Comentários"
            description="Novos comentários em itens que você está acompanhando"
            enabled={settings.inApp.comments}
            onChange={() => handleToggle('inApp', 'comments')}
          />
          
          <NotificationItem
            title="Menções"
            description="Quando você for mencionado em comentários"
            enabled={settings.inApp.mentions}
            onChange={() => handleToggle('inApp', 'mentions')}
          />
        </NotificationSection>

        {/* Configurações de Frequência */}
        <NotificationSection
          title="Configurações de Frequência"
          description="Controle quando e com que frequência receber notificações"
          icon="Clock"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequência do Resumo
              </label>
              <select
                value={settings.frequency.digestFrequency}
                onChange={(e) => handleFrequencyChange('digestFrequency', e.target.value)}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                {digestOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-600">
                Com que frequência você deseja receber o resumo de atividades
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Horário Silencioso</h4>
                  <p className="text-sm text-gray-600">
                    Não receber notificações durante determinado período
                  </p>
                </div>
                <NotificationToggle
                  enabled={settings.frequency.quietHours.enabled}
                  onChange={() => handleQuietHoursChange('enabled', !settings.frequency.quietHours.enabled)}
                />
              </div>
              
              {settings.frequency.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 mt-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Início
                    </label>
                    <input
                      type="time"
                      value={settings.frequency.quietHours.start}
                      onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fim
                    </label>
                    <input
                      type="time"
                      value={settings.frequency.quietHours.end}
                      onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </NotificationSection>

        {/* Teste de Notificações */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Teste suas Notificações</h3>
              <p className="text-sm text-blue-700 mt-1">
                Envie uma notificação de teste para verificar se suas configurações estão funcionando corretamente.
              </p>
              <div className="mt-3 space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Testar E-mail
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Testar Push
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;