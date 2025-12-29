import { Controller } from 'react-hook-form';
import { Input, SymptomScale } from '../ui';

const LifestyleStep = ({ form }) => {
  const { control, formState: { errors } } = form;

  const frequencyLabels = {
    0: 'Never',
    1: 'Rarely',
    2: 'Sometimes',
    3: 'Often'
  };

  const lifestyleFields = [
    {
      name: 'vegetarian',
      label: 'Vegetarian Diet',
      help: 'Do you follow a vegetarian diet?',
      type: 'binary',
    },
    {
      name: 'iron_food_freq',
      label: 'Iron-Rich Foods Frequency',
      help: 'How often do you eat iron-rich foods (red meat, spinach, lentils, etc.)?',
      type: 'scale',
      min: 0,
      max: 3,
    },
    {
      name: 'dairy_freq',
      label: 'Dairy Consumption',
      help: 'How often do you consume dairy products (milk, cheese, yogurt, etc.)?',
      type: 'scale',
      min: 0,
      max: 3,
    },
    {
      name: 'sunlight_min',
      label: 'Daily Sunlight Exposure',
      help: 'How many minutes of direct sunlight do you get on an average day?',
      type: 'number',
      min: 0,
      max: 59,
      unit: 'minutes per day',
    },
    {
      name: 'junk_food_freq',
      label: 'Junk Food Frequency',
      help: 'How often do you eat processed or junk food?',
      type: 'scale',
      min: 0,
      max: 3,
    },
    {
      name: 'smoking',
      label: 'Smoking',
      help: 'Do you currently smoke tobacco products?',
      type: 'binary',
    },
    {
      name: 'alcohol',
      label: 'Alcohol Consumption',
      help: 'Do you consume alcohol?',
      type: 'binary',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Lifestyle Assessment
        </h2>
        <p className="text-gray-600">
          Tell us about your lifestyle habits and dietary patterns. This information helps us understand factors that may affect your health.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {lifestyleFields.map((field) => (
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
              render={({ field: { value, onChange } }) => (
                field.type === 'binary' ? (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={value === 0}
                        onChange={() => onChange(0)}
                        className="form-radio text-primary-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={value === 1}
                        onChange={() => onChange(1)}
                        className="form-radio text-primary-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                  </div>
                ) : field.type === 'scale' ? (
                  <SymptomScale
                    value={value}
                    onChange={onChange}
                    min={field.min}
                    max={field.max}
                    labels={frequencyLabels}
                  />
                ) : (
                  <div className="space-y-1">
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
                          if (!Number.isFinite(parsed)) {
                            onChange(undefined);
                            return;
                          }
                          onChange(Math.trunc(parsed));
                        }}
                        min={field.min}
                        max={field.max}
                        className="w-32"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500">{field.unit}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Range: {field.min} - {field.max} {field.unit}
                    </div>
                  </div>
                )
              )}
            />

            {errors[field.name] && (
              <p className="text-red-600 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Lifestyle Factors
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Your lifestyle choices significantly impact your health. This information helps us provide 
                personalized recommendations for improving your wellbeing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleStep;