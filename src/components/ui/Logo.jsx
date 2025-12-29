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
        className={`${sizeClasses[size]} bg-gradient-health rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 contrast-more:bg-black contrast-more:border-2 contrast-more:border-white ${className}`}
        aria-label="Sympto health assessment platform logo"
        onKeyDown={onClick ? handleKeyDown : undefined}
        {...props}
      >
        <svg 
          className="w-3/5 h-3/5 text-white drop-shadow-sm" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {/* Medical cross with health symbol */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
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
        className={`${sizeClasses[size]} bg-gradient-health rounded-lg flex items-center justify-center contrast-more:bg-black contrast-more:border-2 contrast-more:border-white`}
        role="img"
        aria-label="Sympto health assessment platform logo icon"
      >
        <svg 
          className="w-3/5 h-3/5 text-white drop-shadow-sm" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
          role="presentation"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
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