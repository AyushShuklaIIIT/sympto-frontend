import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts';
import { passwordResetSchema } from '../../schemas/authSchemas';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Alert from '../ui/Alert';

const PasswordReset = ({ onSwitchToLogin }) => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    clearError();
    
    const result = await resetPassword(data.email);
    
    if (result.success) {
      setIsSuccess(true);
    } else {
      // Set form-level error for display
      setError('root', {
        type: 'manual',
        message: result.error,
      });
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (email) {
      await resetPassword(email);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <Card.Header>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div 
                className="w-10 h-10 bg-gradient-health rounded-lg flex items-center justify-center"
                role="img"
                aria-label="Sympto logo"
              >
                <span className="text-white font-bold text-xl" aria-hidden="true">S</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-gradient">
                Sympto
              </h1>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Check Your Email
            </h2>
            <p className="text-gray-600 mt-1">
              We've sent password reset instructions to your email
            </p>
          </div>
        </Card.Header>

        <Card.Body>
          <Alert variant="success" className="mb-4">
            If an account with that email exists, you'll receive password reset instructions shortly.
          </Alert>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="flex flex-col space-y-2">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={handleResendEmail}
                loading={isLoading}
                disabled={isLoading}
              >
                Resend Email
              </Button>

              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={onSwitchToLogin}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <Card.Header>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div 
              className="w-10 h-10 bg-gradient-health rounded-lg flex items-center justify-center"
              role="img"
              aria-label="Sympto logo"
            >
              <span className="text-white font-bold text-xl" aria-hidden="true">S</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gradient">
              Sympto
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Reset Your Password
          </h2>
          <p className="text-gray-600 mt-1">
            Enter your email address and we'll send you reset instructions
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
            placeholder="Enter your email address"
            error={errors.email?.message}
            {...register('email')}
            autoComplete="email"
            required
            help="We'll send password reset instructions to this email"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? 'Sending Instructions...' : 'Send Reset Instructions'}
          </Button>
        </form>
      </Card.Body>

      <Card.Footer>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
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

export default PasswordReset;