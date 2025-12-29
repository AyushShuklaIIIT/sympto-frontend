import { Controller } from 'react-hook-form';
import { Input } from '../ui';

const LabResultsStep = ({ form }) => {
  const { control, formState: { errors } } = form;

  const labFields = [
    {
      name: 'hemoglobin',
      label: 'Hemoglobin',
      help: 'Your hemoglobin level from recent blood work (normal range: 12-16 g/dL for women, 14-18 g/dL for men)',
      type: 'number',
      min: 0,
      max: 30,
      unit: 'g/dL',
      step: 0.1,
    },
    {
      name: 'ferritin',
      label: 'Ferritin',
      help: 'Your ferritin level indicating iron stores (normal range: 15-150 ng/mL for women, 15-200 ng/mL for men)',
      type: 'number',
      min: 0,
      max: 5000,
      unit: 'ng/mL',
      step: 1,
    },
    {
      name: 'vitamin_b12',
      label: 'Vitamin B12',
      help: 'Your vitamin B12 level (normal range: 200-900 pg/mL)',
      type: 'number',
      min: 0,
      max: 2000,
      unit: 'pg/mL',
      step: 1,
    },
    {
      name: 'vitamin_d',
      label: 'Vitamin D',
      help: 'Your vitamin D level (optimal range: 30-100 ng/mL)',
      type: 'number',
      min: 0,
      max: 200,
      unit: 'ng/mL',
      step: 0.1,
    },
    {
      name: 'calcium',
      label: 'Calcium',
      help: 'Your serum calcium level (normal range: 8.5-10.5 mg/dL)',
      type: 'number',
      min: 0,
      max: 20,
      unit: 'mg/dL',
      step: 0.1,
    },
  ];

  const getRangeStatus = (value, field) => {
    if (!value || value === 0) return null;
    
    const ranges = {
      hemoglobin: { low: 12, high: 18 },
      ferritin: { low: 15, high: 200 },
      vitamin_b12: { low: 200, high: 900 },
      vitamin_d: { low: 30, high: 100 },
      calcium: { low: 8.5, high: 10.5 },
    };
    
    const range = ranges[field.name];
    if (!range) return null;
    
    if (value < range.low) return 'low';
    if (value > range.high) return 'high';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'low': return 'Below normal range';
      case 'high': return 'Above normal range';
      case 'normal': return 'Within normal range';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Laboratory Results
        </h2>
        <p className="text-gray-600">
          Enter your recent lab results if available. These values help provide more accurate health insights. 
          Fill in all fields to complete the assessment.
        </p>
      </div>

      <div className="grid gap-6">
        {labFields.map((field) => (
          <div key={field.name} className="space-y-3">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-1">
                {field.label}
              </label>
              <p className="text-sm text-gray-600 mb-3">
                {field.help}
              </p>
            </div>

            <Controller
              name={field.name}
              control={control}
              render={({ field: { value, onChange } }) => {
                const status = getRangeStatus(value, field);
                
                return (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={value ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === '') {
                            onChange(undefined);
                            return;
                          }
                          const parsed = Number(raw);
                          onChange(Number.isFinite(parsed) ? parsed : undefined);
                        }}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="w-40"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500">{field.unit}</span>
                    </div>
                    
                    {status && (
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400">
                      Range: {field.min} - {field.max} {field.unit}
                    </div>
                  </div>
                );
              }}
            />

            {errors[field.name] && (
              <p className="text-red-600 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Note
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Lab results should be from recent tests (within the last 6 months) for accuracy. 
                If you don't have recent results, consider getting a basic lab panel done for the most accurate assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResultsStep;