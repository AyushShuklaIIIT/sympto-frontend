import { forwardRef, useId } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  help,
  className = '',
  id,
  ...props 
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const inputClasses = error ? 'form-input-error' : 'form-input';

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`${inputClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="form-error">{error}</p>
      )}
      {help && !error && (
        <p className="form-help">{help}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;