const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className = '',
  showLabel = false,
  label,
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {(showLabel || label) && (
        <div className="flex justify-between text-sm text-gray-600">
          <span id="progress-label">{label || 'Progress'}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <progress 
        className="progress-bar w-full h-2 rounded-full"
        value={value}
        max={max}
        aria-labelledby={label ? "progress-label" : undefined}
        aria-label={!label ? "Progress" : undefined}
      >
        {Math.round(percentage)}%
      </progress>
    </div>
  );
};

export default ProgressBar;