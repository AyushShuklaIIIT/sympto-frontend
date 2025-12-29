import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm, RegisterForm, PasswordReset } from '../components/auth';
import Alert from '../components/ui/Alert';

const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
  RESET: 'reset',
};

const AuthPage = ({ initialMode = AUTH_MODES.LOGIN }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedInitialMode = useMemo(() => {
    return Object.values(AUTH_MODES).includes(initialMode) ? initialMode : AUTH_MODES.LOGIN;
  }, [initialMode]);

  const [mode, setMode] = useState(normalizedInitialMode);
  const [successMessage, setSuccessMessage] = useState('');

  // Keep UI mode in sync with the route when navigating between /auth, /auth/register, /auth/reset
  useEffect(() => {
    setMode(normalizedInitialMode);
    setSuccessMessage('');
  }, [normalizedInitialMode]);

  const handleSwitchToLogin = () => {
    navigate('/auth', { replace: location.pathname.startsWith('/auth') });
  };

  const handleSwitchToRegister = () => {
    navigate('/auth/register', { replace: location.pathname.startsWith('/auth') });
  };

  const handleSwitchToReset = () => {
    navigate('/auth/reset', { replace: location.pathname.startsWith('/auth') });
  };

  const handleRegistrationSuccess = () => {
    setSuccessMessage('Account created successfully! Please check your email to verify your account before signing in.');
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-health-mint/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {successMessage && (
          <Alert 
            variant="success" 
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Alert>
        )}

        {mode === AUTH_MODES.LOGIN && (
          <LoginForm
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToReset={handleSwitchToReset}
          />
        )}

        {mode === AUTH_MODES.REGISTER && (
          <RegisterForm
            onSwitchToLogin={handleSwitchToLogin}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}

        {mode === AUTH_MODES.RESET && (
          <PasswordReset
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;