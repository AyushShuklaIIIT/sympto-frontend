import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts';
import { loginSchema } from '../../schemas/authSchemas';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Alert from '../ui/Alert';
import Logo from '../ui/Logo';

const LoginForm = ({ onSwitchToRegister, onSwitchToReset }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    clearError();
    
    const result = await login(data);
    
    if (!result.success) {
      // Set form-level error for display
      setError('root', {
        type: 'manual',
        message: result.error,
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Card.Header>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Logo size="md" variant="icon" />
            <h1 className="text-2xl font-display font-bold text-gradient">
              Sympto
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-1">
            Sign in to access your health dashboard
          </p>
        </div>
      </Card.Header>

      <Card.Body>
        {(error || errors.root) && (
          <Alert 
            variant="error" 
            className="mb-4"
            onClose={clearError}
          >
            {error || errors.root?.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
            autoComplete="email"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password')}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            
            <button
              type="button"
              onClick={onSwitchToReset}
              className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none focus:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Card.Body>

      <Card.Footer>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary-600 hover:text-primary-700 focus:outline-none focus:underline font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default LoginForm;