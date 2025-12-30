import { forwardRef } from 'react';

const Logo = forwardRef(({ 
  size = 'md', 
  variant = 'full', 
  className = '',
  onClick,
  ...props 
}, ref) => {
  const handleKeyDown = (event) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event);
    }
  };
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  if (variant === 'icon') {
    const Component = onClick ? 'button' : 'div';
    
    return (
      <Component 
        ref={ref}
        className={`${sizeClasses[size]} flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg ${className}`}
        aria-label="Sympto health assessment platform logo"
        onKeyDown={onClick ? handleKeyDown : undefined}
        {...props}
      >
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain dark:drop-shadow-sm dark:brightness-110"
        />
      </Component>
    );
  }

  const Component = onClick ? 'button' : 'div';

  return (
    <Component 
      ref={ref}
      className={`flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg ${className}`}
      onKeyDown={onClick ? handleKeyDown : undefined}
      {...props}
    >
      <div 
        className={`${sizeClasses[size]} flex items-center justify-center`}
        role="img"
        aria-label="Sympto health assessment platform logo icon"
      >
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain dark:drop-shadow-sm dark:brightness-110"
        />
      </div>
      {variant === 'full' && (
        <span className={`${textSizeClasses[size]} font-display font-bold text-gradient`}>
          Sympto
        </span>
      )}
    </Component>
  );
});

Logo.displayName = 'Logo';

export default Logo;