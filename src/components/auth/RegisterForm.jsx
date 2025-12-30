import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts';
import { registerSchema } from '../../schemas/authSchemas';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Alert from '../ui/Alert';
import Logo from '../ui/Logo';

const RegisterForm = ({ onSwitchToLogin, onRegistrationSuccess }) => {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
    },
  });

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const onSubmit = async (data) => {
    clearError();
    
    // Remove confirmPassword from data before sending to API
    const { confirmPassword, ...userData } = data;
    
    const result = await registerUser(userData);
    
    if (result.success) {
      // Call success callback if provided
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      } else {
        // Default behavior: switch to login
        onSwitchToLogin();
      }
    } else {
      // Set form-level error for display
      setError('root', {
        type: 'manual',
        message: result.error,
      });
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
    
    strength = checks.filter(Boolean).length;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['red', 'orange', 'yellow', 'blue', 'green'];
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'gray',
    };
  };

  const passwordStrength = getPasswordStrength(password);

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
            Create Your Account
          </h2>
          <p className="text-gray-600 mt-1">
            Join Sympto to start your health journey
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName')}
              autoComplete="given-name"
              required
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
              autoComplete="family-name"
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="john.doe@example.com"
            error={errors.email?.message}
            {...register('email')}
            autoComplete="email"
            required
          />

          <Input
            label="Date of Birth"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
            autoComplete="bday"
            required
            help="You must be at least 13 years old to use Sympto"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              error={errors.password?.message}
              {...register('password')}
              autoComplete="new-password"
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

          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Password strength:</span>
                <span className={`font-medium text-${passwordStrength.color}-600`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
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

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <a href="#terms" className="text-primary-600 hover:text-primary-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-primary-600 hover:text-primary-700 underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </Card.Body>

      <Card.Footer>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 focus:outline-none focus:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default RegisterForm;