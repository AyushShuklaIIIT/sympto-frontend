import { Controller } from 'react-hook-form';
import { SymptomScale } from '../ui';

const SymptomStep = ({ form }) => {
  const { control, formState: { errors } } = form;

  const symptomScaleLabels = {
    0: 'None',
    1: 'Mild',
    2: 'Moderate',
    3: 'Severe'
  };

  const symptomFields = [
    {
      name: 'fatigue',
      label: 'Fatigue Level',
      help: 'How tired or exhausted do you feel on a typical day?',
      type: 'scale',
    },
    {
      name: 'hair_loss',
      label: 'Hair Loss',
      help: 'How significant is your hair loss or thinning?',
      type: 'scale',
    },
    {
      name: 'acidity',
      label: 'Acidity/Heartburn',
      help: 'How often do you experience acid reflux or heartburn?',
      type: 'scale',
    },
    {
      name: 'dizziness',
      label: 'Dizziness',
      help: 'How frequently do you feel dizzy or lightheaded?',
      type: 'scale',
    },
    {
      name: 'muscle_pain',
      label: 'Muscle Pain',
      help: 'Rate your general muscle pain or soreness level.',
      type: 'scale',
    },
    {
      name: 'numbness',
      label: 'Numbness/Tingling',
      help: 'Do you experience numbness or tingling in your hands, feet, or other areas?',
      type: 'scale',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Symptom Assessment
        </h2>
        <p className="text-gray-600">
          Please rate your symptoms based on how you've been feeling over the past month.
        </p>
      </div>

      <div className="grid gap-8 md:gap-12">
        {symptomFields.map((field) => (
          <div key={field.name} className="space-y-3">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-1">
                {field.label}
              </label>
              <p className="text-sm text-gray-600 mb-4">
                {field.help}
              </p>
            </div>

            <Controller
              name={field.name}
              control={control}
              render={({ field: { value, onChange } }) => (
                field.type === 'scale' ? (
                  <SymptomScale
                    value={value}
                    onChange={onChange}
                    min={0}
                    max={3}
                    labels={symptomScaleLabels}
                  />
                ) : (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={field.name}
                        value="false"
                        checked={value === false}
                        onChange={() => onChange(false)}
                        className="form-radio text-primary-600 focus:outline-none focus:ring-0"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={field.name}
                        value="true"
                        checked={value === true}
                        onChange={() => onChange(true)}
                        className="form-radio text-primary-600 focus:outline-none focus:ring-0"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
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

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-primary-800">
              Assessment Tip
            </h3>
            <div className="mt-2 text-sm text-primary-700">
              <p>
                Be honest about your symptoms. This information helps provide more accurate health insights.
                If you're unsure about a rating, choose the option that best represents your typical experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomStep;