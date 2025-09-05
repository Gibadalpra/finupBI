import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityForm = ({ onPasswordChange, loading }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: '30', // minutos
    logoutOnClose: false,
    rememberDevice: true
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Verificar força da senha para nova senha
    if (field === 'newPassword') {
      checkPasswordStrength(value);
    }

    // Verificar se confirmação de senha confere
    if (field === 'confirmPassword' || (field === 'newPassword' && passwordData.confirmPassword)) {
      const newPass = field === 'newPassword' ? value : passwordData.newPassword;
      const confirmPass = field === 'confirmPassword' ? value : passwordData.confirmPassword;
      
      if (confirmPass && newPass !== confirmPass) {
        setErrors(prev => ({ ...prev, confirmPassword: 'As senhas não conferem' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: null }));
      }
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length < 8) {
      feedback.push('Deve ter pelo menos 8 caracteres');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Deve conter pelo menos uma letra minúscula');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Deve conter pelo menos uma letra maiúscula');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('Deve conter pelo menos um número');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Deve conter pelo menos um caractere especial');
    } else {
      score += 1;
    }

    setPasswordStrength({ score, feedback });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Fraca';
    if (passwordStrength.score <= 3) return 'Média';
    if (passwordStrength.score <= 4) return 'Boa';
    return 'Forte';
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    
    // Validações
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordStrength.score < 3) {
      newErrors.newPassword = 'A senha deve ser mais forte';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'A nova senha deve ser diferente da atual';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Chamar função do componente pai
    onPasswordChange(passwordData);
  };

  const handleEnable2FA = () => {
    // Aqui seria implementada a lógica para habilitar 2FA
    // Por enquanto, apenas toggle do estado
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const sessionTimeoutOptions = [
    { value: '15', label: '15 minutos' },
    { value: '30', label: '30 minutos' },
    { value: '60', label: '1 hora' },
    { value: '120', label: '2 horas' },
    { value: '240', label: '4 horas' },
    { value: '480', label: '8 horas' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Icon name="Shield" className="w-5 h-5" />
          <span>Segurança</span>
        </h2>
        <p className="mt-1 text-gray-600">
          Gerencie suas configurações de segurança e privacidade
        </p>
      </div>

      <div className="space-y-8">
        {/* Alteração de Senha */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h3>
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite sua senha atual"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <Icon 
                    name={showPasswords.current ? 'EyeOff' : 'Eye'} 
                    className="w-4 h-4 text-gray-400 hover:text-gray-600" 
                  />
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite sua nova senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <Icon 
                    name={showPasswords.new ? 'EyeOff' : 'Eye'} 
                    className="w-4 h-4 text-gray-400 hover:text-gray-600" 
                  />
                </button>
              </div>
              
              {/* Indicador de força da senha */}
              {passwordData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="mt-1 text-xs text-gray-500 space-y-1">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <Icon name="AlertCircle" className="w-3 h-3" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirme sua nova senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <Icon 
                    name={showPasswords.confirm ? 'EyeOff' : 'Eye'} 
                    className="w-4 h-4 text-gray-400 hover:text-gray-600" 
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || passwordStrength.score < 3}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </form>
        </div>

        {/* Autenticação de Dois Fatores */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Autenticação de Dois Fatores</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Autenticação 2FA</h4>
                <p className="text-sm text-gray-600">
                  {twoFactorEnabled 
                    ? 'A autenticação de dois fatores está ativada'
                    : 'Adicione uma camada extra de segurança à sua conta'
                  }
                </p>
              </div>
              <button
                onClick={handleEnable2FA}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {twoFactorEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Icon name="CheckCircle" className="w-4 h-4" />
                  <span>2FA configurado com sucesso</span>
                </div>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                  Gerenciar códigos de backup
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configurações de Sessão */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Sessão</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo limite da sessão
              </label>
              <select
                value={sessionSettings.sessionTimeout}
                onChange={(e) => setSessionSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sessionTimeoutOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-600">
                Sua sessão será encerrada automaticamente após este período de inatividade
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Logout ao fechar navegador</h4>
                  <p className="text-sm text-gray-600">
                    Encerrar sessão automaticamente quando fechar o navegador
                  </p>
                </div>
                <button
                  onClick={() => setSessionSettings(prev => ({ ...prev, logoutOnClose: !prev.logoutOnClose }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    sessionSettings.logoutOnClose ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sessionSettings.logoutOnClose ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Lembrar dispositivo</h4>
                  <p className="text-sm text-gray-600">
                    Não solicitar 2FA neste dispositivo por 30 dias
                  </p>
                </div>
                <button
                  onClick={() => setSessionSettings(prev => ({ ...prev, rememberDevice: !prev.rememberDevice }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    sessionSettings.rememberDevice ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sessionSettings.rememberDevice ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Atividade Recente */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Atividade Recente</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Login atual</p>
                    <p className="text-xs text-gray-600">Windows • Chrome • São Paulo, SP</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Agora</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Login anterior</p>
                    <p className="text-xs text-gray-600">Windows • Chrome • São Paulo, SP</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Ontem às 14:30</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Login móvel</p>
                    <p className="text-xs text-gray-600">Android • Chrome Mobile • São Paulo, SP</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">2 dias atrás</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Ver histórico completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityForm;