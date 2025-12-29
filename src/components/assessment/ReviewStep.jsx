import { Card } from '../ui';

const ReviewStep = ({ form }) => {
  const { watch } = form;
  const formData = watch();

  const symptomLabels = {
    fatigue: 'Fatigue Level',
    hair_loss: 'Hair Loss',
    acidity: 'Acidity/Heartburn',
    dizziness: 'Dizziness',
    muscle_pain: 'Muscle Pain',
    numbness: 'Numbness/Tingling',
  };

  const lifestyleLabels = {
    vegetarian: 'Vegetarian Diet',
    iron_food_freq: 'Iron-Rich Foods',
    dairy_freq: 'Dairy Consumption',
    sunlight_min: 'Daily Sunlight',
    junk_food_freq: 'Junk Food',
    smoking: 'Smoking',
    alcohol: 'Alcohol Consumption',
  };

  const labLabels = {
    hemoglobin: 'Hemoglobin',
    ferritin: 'Ferritin',
    vitamin_b12: 'Vitamin B12',
    vitamin_d: 'Vitamin D',
    calcium: 'Calcium',
  };

  const getSymptomScaleLabel = (value) => {
    const labels = {
      0: 'None',
      1: 'Mild',
      2: 'Moderate',
      3: 'Severe'
    };
    return labels[value] ?? value;
  };

  const getFrequencyLabel = (value) => {
    const labels = {
      0: 'Never',
      1: 'Rarely',
      2: 'Sometimes',
      3: 'Often'
    };
    return labels[value] ?? value;
  };

  const formatValue = (key, value) => {
    if (value === undefined || value === null) return 'Not provided';

    // Binary lifestyle fields are encoded as 0/1
    if (['vegetarian', 'smoking', 'alcohol'].includes(key) && typeof value === 'number') {
      return value === 1 ? 'Yes' : 'No';
    }
    
    if (key.includes('freq') && typeof value === 'number') {
      return getFrequencyLabel(value);
    }
    
    if (key === 'sunlight_min') {
      return `${value} minutes per day`;
    }
    
    // Lab values with units
    const units = {
      hemoglobin: 'g/dL',
      ferritin: 'ng/mL',
      vitamin_b12: 'pg/mL',
      vitamin_d: 'ng/mL',
      calcium: 'mg/dL',
    };
    
    if (units[key]) {
      return value === undefined || value === null ? 'Not provided' : `${value} ${units[key]}`;
    }
    
    // Symptom scales
    if (Object.keys(symptomLabels).includes(key) && typeof value === 'number') {
      return getSymptomScaleLabel(value);
    }
    
    return value;
  };

  const renderSection = (title, data, labels) => (
    <Card className="mb-6">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="card-body">
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(labels).map(([key, label]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600 font-medium">{label}:</span>
              <span className="text-gray-900">{formatValue(key, data[key])}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Review Your Assessment
        </h2>
        <p className="text-gray-600">
          Please review your responses before submitting. You can go back to any previous step to make changes.
        </p>
      </div>

      {renderSection('Symptoms', formData, symptomLabels)}
      {renderSection('Lifestyle Factors', formData, lifestyleLabels)}
      {renderSection('Laboratory Results', formData, labLabels)}

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              What Happens Next?
            </h3>
            <div className="text-primary-800 space-y-2">
              <p>
                After you submit this assessment, our AI system will analyze your responses to provide:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Personalized health insights based on your symptoms and lifestyle</li>
                <li>Recommendations for improving your wellbeing</li>
                <li>Identification of potential areas of concern</li>
                <li>Suggestions for follow-up with healthcare providers if needed</li>
              </ul>
              <p className="mt-3 text-sm">
                <strong>Note:</strong> This assessment is for informational purposes only and does not replace 
                professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Ready to Submit
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Your assessment is complete and ready for analysis. Click "Submit Assessment" to receive your personalized health insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;