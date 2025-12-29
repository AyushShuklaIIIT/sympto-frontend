import { forwardRef } from 'react';

/**
 * ResponsiveContainer - A flexible container component for responsive layouts
 * Provides consistent spacing and responsive behavior across the application
 */
const ResponsiveContainer = forwardRef(({ 
  children, 
  size = 'default',
  padding = 'default',
  className = '',
  as = 'div',
  ...props 
}, ref) => {
  const Component = as;
  
  const sizeClasses = {
    sm: 'max-w-2xl',
    default: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2 sm:px-6 sm:py-4',
    default: 'px-4 py-6 sm:px-6 lg:px-8',
    lg: 'px-6 py-8 sm:px-8 lg:px-12',
  };

  const classes = [
    'mx-auto',
    'w-full',
    sizeClasses[size],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </Component>
  );
});

ResponsiveContainer.displayName = 'ResponsiveContainer';

export default ResponsiveContainer;