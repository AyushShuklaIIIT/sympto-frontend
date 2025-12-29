import React, { useState } from 'react';

const SymptomScale = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 5, 
  labels = {},
  className = '',
  ...props 
}) => {
  const [hoveredValue, setHoveredValue] = useState(null);

  const numericValue = typeof value === 'string' ? Number(value) : value;
  const safeValue = Number.isFinite(numericValue) ? numericValue : undefined;
  
  const items = [];
  for (let i = min; i <= max; i++) {
    items.push(i);
  }

  const getLabel = (val) => {
    const numericVal = typeof val === 'string' ? Number(val) : val;
    const safeVal = Number.isFinite(numericVal) ? numericVal : undefined;

    if (safeVal !== undefined && labels[safeVal] !== undefined) return labels[safeVal];
    if (max === 5) {
      const defaultLabels = {
        1: 'None',
        2: 'Mild',
        3: 'Moderate',
        4: 'Severe',
        5: 'Very Severe'
      };
      if (safeVal === undefined) return '';
      return defaultLabels[safeVal] ?? '';
    }
    if (safeVal === undefined) return '';
    return safeVal.toString();
  };

  let displayValue = safeValue;
  if (hoveredValue !== null) displayValue = hoveredValue;

  return (
    <div className={`space-y-3 ${className}`} {...props}>
      <div className="flex items-center gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={safeValue === item}
            className={
              `h-10 w-10 rounded-md border text-sm font-medium transition-colors ` +
              `focus:outline-none focus:ring-0 ` +
              (safeValue === item
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white/35 backdrop-blur-md text-gray-900 border-white/40')
            }
            onClick={() => onChange?.(item)}
            onMouseEnter={() => setHoveredValue(item)}
            onMouseLeave={() => setHoveredValue(null)}
          >
            {item}
          </button>
        ))}
      </div>
      
      {(hoveredValue !== null || safeValue !== undefined) && (
        <div className="text-center">
          <span className="text-sm text-gray-600">
            {getLabel(displayValue)}
          </span>
        </div>
      )}
    </div>
  );
};

export default SymptomScale;