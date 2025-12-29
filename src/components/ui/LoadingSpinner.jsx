import { forwardRef } from 'react';

const LoadingSpinner = forwardRef(({ 
  size = 'md', 
  variant = 'primary',
  className = '',
  ...props 
}, ref) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantClasses = {
    primary: 'border-gray-300 border-t-primary-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
  };

  const classes = [
    'loading-spinner',
    sizeClasses[size],
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Loading dots component for variety
const LoadingDots = forwardRef(({ 
  size = 'md',
  variant = 'primary', 
  className = '',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const variantClasses = {
    primary: 'bg-primary-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
  };

  const dotClasses = [
    'loading-dot',
    sizeClasses[size],
    variantClasses[variant]
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={`loading-dots ${className}`}
      aria-label="Loading"
      {...props}
    >
      <div className={dotClasses} style={{ animationDelay: '0ms' }} />
      <div className={dotClasses} style={{ animationDelay: '150ms' }} />
      <div className={dotClasses} style={{ animationDelay: '300ms' }} />
      <span className="sr-only">Loading...</span>
    </div>
  );
});

LoadingDots.displayName = 'LoadingDots';

LoadingSpinner.Dots = LoadingDots;

export default LoadingSpinner;