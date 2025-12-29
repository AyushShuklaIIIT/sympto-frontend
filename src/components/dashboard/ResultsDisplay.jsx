import { useState } from 'react';
import { Card, Button, Alert, Badge } from '../ui';
import { AIResultsDisplay } from '../assessment';

const RawDataView = ({ assessment, onHide }) => {
  const displayValue = (value) => (value === undefined || value === null ? 'Not provided' : value);

  const symptomScaleLabel = (value) => {
    const labels = {
      0: 'None',
      1: 'Mild',
      2: 'Moderate',
      3: 'Severe'
    };
    return labels[value] ?? value;
  };

  const frequencyLabel = (value) => {
    const labels = {
      0: 'Never',
      1: 'Rarely',
      2: 'Sometimes',
      3: 'Often'
    };
    return labels[value] ?? value;
  };

  const yesNo01 = (value) => (value === 1 ? 'Yes' : value === 0 ? 'No' : displayValue(value));

  return (
    <Card>
    <div className="card-header">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Raw Assessment Data</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={onHide}
        >
          Hide Raw Data
        </Button>
      </div>
    </div>
    <div className="card-body">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Symptoms */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Symptoms</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Fatigue:</span>
              <span className="font-medium">{symptomScaleLabel(displayValue(assessment.fatigue))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hair Loss:</span>
              <span className="font-medium">{symptomScaleLabel(displayValue(assessment.hair_loss))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Acidity:</span>
              <span className="font-medium">{symptomScaleLabel(displayValue(assessment.acidity))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dizziness:</span>
              <span className="font-medium">{symptomScaleLabel(displayValue(assessment.dizziness))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Muscle Pain:</span>
              <span className="font-medium">{symptomScaleLabel(displayValue(assessment.muscle_pain))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Numbness:</span>
              <span className="font-medium">{symptomScaleLabel(displayValue(assessment.numbness))}</span>
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Lifestyle</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Vegetarian:</span>
              <span className="font-medium">{yesNo01(assessment.vegetarian)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Iron Foods:</span>
              <span className="font-medium">{frequencyLabel(displayValue(assessment.iron_food_freq))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dairy:</span>
              <span className="font-medium">{frequencyLabel(displayValue(assessment.dairy_freq))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sunlight/Day:</span>
              <span className="font-medium">{assessment.sunlight_min === undefined || assessment.sunlight_min === null ? 'Not provided' : `${assessment.sunlight_min} min`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Junk Food:</span>
              <span className="font-medium">{frequencyLabel(displayValue(assessment.junk_food_freq))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Smoking:</span>
              <span className="font-medium">{yesNo01(assessment.smoking)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Alcohol:</span>
              <span className="font-medium">{yesNo01(assessment.alcohol)}</span>
            </div>
          </div>
        </div>

        {/* Lab Results */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Lab Results</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Hemoglobin:</span>
              <span className="font-medium">{assessment.hemoglobin === undefined || assessment.hemoglobin === null ? 'Not provided' : `${assessment.hemoglobin} g/dL`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ferritin:</span>
              <span className="font-medium">{assessment.ferritin === undefined || assessment.ferritin === null ? 'Not provided' : `${assessment.ferritin} ng/mL`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vitamin B12:</span>
              <span className="font-medium">{assessment.vitamin_b12 === undefined || assessment.vitamin_b12 === null ? 'Not provided' : `${assessment.vitamin_b12} pg/mL`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vitamin D:</span>
              <span className="font-medium">{assessment.vitamin_d === undefined || assessment.vitamin_d === null ? 'Not provided' : `${assessment.vitamin_d} ng/mL`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Calcium:</span>
              <span className="font-medium">{assessment.calcium === undefined || assessment.calcium === null ? 'Not provided' : `${assessment.calcium} mg/dL`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Card>
  );
};

const ResultsDisplay = ({ assessment, onClose, onRetryAnalysis, isRetrying = false }) => {
  const [showRawData, setShowRawData] = useState(false);

  const OUTPUT_FIELDS = [
    { key: 'iron_def', label: 'Iron deficiency' },
    { key: 'b12_def', label: 'Vitamin B12 deficiency' },
    { key: 'vitd_def', label: 'Vitamin D deficiency' },
    { key: 'calcium_def', label: 'Calcium deficiency' },
    { key: 'magnesium_def', label: 'Magnesium deficiency' },
    { key: 'potassium_def', label: 'Potassium deficiency' },
    { key: 'protein_def', label: 'Protein deficiency' },
    { key: 'zinc_def', label: 'Zinc deficiency' },
    { key: 'folate_def', label: 'Folate deficiency' },
    { key: 'omega3_def', label: 'Omega-3 deficiency' },
    { key: 'vitamin_b6_def', label: 'Vitamin B6 deficiency' },
    { key: 'vitamin_a_def', label: 'Vitamin A deficiency' },
    { key: 'copper_def', label: 'Copper deficiency' },
    { key: 'selenium_def', label: 'Selenium deficiency' },
    { key: 'iodine_def', label: 'Iodine deficiency' },
    { key: 'choline_def', label: 'Choline deficiency' },
    { key: 'electrolyte_imbalance', label: 'Electrolyte imbalance' },
    { key: 'general_malnutrition', label: 'General malnutrition' },
    { key: 'gut_malabsorption', label: 'Gut malabsorption' },
    { key: 'chronic_inflammation', label: 'Chronic inflammation' },
    { key: 'chronic_dehydration', label: 'Chronic dehydration' },
    { key: 'protein_quality_def', label: 'Protein quality deficiency' }
  ];

  const getModelOutputs = () => {
    // Prefer structured storage (backend adds `modelOutputs`), but also support
    // flat fields for backward/forward compatibility.
    const structured =
      assessment?.modelOutputs ||
      assessment?.aiOutputs ||
      assessment?.aiAnalysis?.modelOutputs ||
      assessment?.aiAnalysis?.outputs;

    if (structured && typeof structured === 'object') return structured;

    // Fall back to extracting from the top-level assessment.
    const extracted = {};
    let hasAny = false;
    for (const { key } of OUTPUT_FIELDS) {
      if (assessment?.[key] !== undefined && assessment?.[key] !== null && assessment?.[key] !== '') {
        extracted[key] = assessment[key];
        hasAny = true;
      }
    }
    if (assessment?.severity !== undefined && assessment?.severity !== null && assessment?.severity !== '') {
      extracted.severity = assessment.severity;
      hasAny = true;
    }
    return hasAny ? extracted : null;
  };

  const modelOutputs = getModelOutputs();
  const severityValue = modelOutputs?.severity;
  const hasAnyAnalysis = Boolean(assessment?.aiAnalysis) || Boolean(modelOutputs);
  const modelTextOutputs = assessment?.modelTextOutputs || assessment?.aiTextOutputs || null;

  const renderBinary = (value) => {
    const asNumber = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(asNumber)) {
      return <span className="text-gray-600">Not available</span>;
    }

    if (asNumber === 1) return <Badge variant="warning">Yes</Badge>;
    if (asNumber === 0) return <Badge variant="gray">No</Badge>;
    return <span className="text-gray-900">{String(value)}</span>;
  };

  if (!assessment) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-gray-600">No assessment selected.</p>
          <Button variant="secondary" onClick={onClose} className="mt-4">
            Back to History
          </Button>
        </div>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportAssessmentData = () => {
    const exportData = {
      assessmentId: assessment._id,
      createdAt: assessment.createdAt,
      symptoms: {
        fatigue: assessment.fatigue,
        hair_loss: assessment.hair_loss,
        acidity: assessment.acidity,
        dizziness: assessment.dizziness,
        muscle_pain: assessment.muscle_pain,
        numbness: assessment.numbness
      },
      lifestyle: {
        vegetarian: assessment.vegetarian,
        iron_food_freq: assessment.iron_food_freq,
        dairy_freq: assessment.dairy_freq,
        sunlight_min: assessment.sunlight_min,
        junk_food_freq: assessment.junk_food_freq,
        smoking: assessment.smoking,
        alcohol: assessment.alcohol
      },
      labResults: {
        hemoglobin: assessment.hemoglobin,
        ferritin: assessment.ferritin,
        vitamin_b12: assessment.vitamin_b12,
        vitamin_d: assessment.vitamin_d,
        calcium: assessment.calcium
      },
      aiAnalysis: assessment.aiAnalysis,
      modelOutputs: modelOutputs,
      modelTextOutputs: modelTextOutputs
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sympto-assessment-${assessment._id}-${new Date(assessment.createdAt).toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.childNode.remove(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Assessment Details</h2>
          <p className="text-gray-600 mt-1">
            Assessment from {formatDate(assessment.createdAt)}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowRawData(!showRawData)}
          >
            {showRawData ? 'Hide' : 'Show'} Raw Data
          </Button>
          <Button
            variant="secondary"
            onClick={exportAssessmentData}
          >
            Export Data
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Back to History
          </Button>
        </div>
      </div>

      {/* Assessment Status */}
      <Alert variant={hasAnyAnalysis ? 'success' : 'info'}>
        <div className="flex">
          <div className="shrink-0">
            {hasAnyAnalysis ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${hasAnyAnalysis ? 'text-green-800' : 'text-primary-800'}`}>
              {hasAnyAnalysis ? 'Analysis Complete' : 'Analysis Pending'}
            </h3>
            <div className={`mt-2 text-sm ${hasAnyAnalysis ? 'text-green-700' : 'text-primary-700'}`}>
              <p>
                {assessment.aiAnalysis
                  ? `AI analysis completed with ${Math.round(assessment.aiAnalysis.confidence * 100)}% confidence.`
                  : modelOutputs
                    ? 'Model predictions are available for this assessment.'
                    : 'This assessment is still being processed by our AI system.'}
              </p>
            </div>
          </div>
        </div>
      </Alert>

      {/* Raw Data View (if toggled) */}
      {showRawData && (
        <RawDataView 
          assessment={assessment} 
          onHide={() => setShowRawData(false)} 
        />
      )}

      {/* Model Outputs (CSV output columns) */}
      {modelOutputs && (
        <Card>
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Model Outputs</h3>
              {severityValue !== undefined && severityValue !== null && severityValue !== '' && (
                <Badge variant="primary">Severity: {String(severityValue)}</Badge>
              )}
            </div>
          </div>
          <div className="card-body">
            <div className="grid md:grid-cols-2 gap-4">
              {OUTPUT_FIELDS.map(({ key, label }) => {
                const value = modelOutputs?.[key];
                if (value === undefined || value === null || value === '') return null;

                return (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <span className="text-gray-700">{label}</span>
                    <span>{renderBinary(value)}</span>
                  </div>
                );
              })}
              {OUTPUT_FIELDS.every(({ key }) => modelOutputs?.[key] === undefined || modelOutputs?.[key] === null || modelOutputs?.[key] === '') && (
                <p className="text-gray-600">No model output flags available.</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Model Text Outputs (prediction2/prediction3) */}
      {modelTextOutputs && (
        <Card>
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900">Suggested Guidance</h3>
          </div>
          <div className="card-body space-y-4">
            {(modelTextOutputs.medicationBrandNames || modelTextOutputs.medicationText) && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Medications / Supplements</h4>
                {modelTextOutputs.medicationBrandNames && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Brand names:</span> {modelTextOutputs.medicationBrandNames}
                  </p>
                )}
                {modelTextOutputs.medicationText && (
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                    <span className="font-medium text-gray-900">Details:</span> {modelTextOutputs.medicationText}
                  </p>
                )}
              </div>
            )}

            {(modelTextOutputs.dietAdditions ||
              modelTextOutputs.nutrientRequirements ||
              modelTextOutputs.vegetarianFoodMapping ||
              modelTextOutputs.mandatoryDietChanges) && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Diet Guidance</h4>
                {modelTextOutputs.dietAdditions && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Diet additions:</span> {modelTextOutputs.dietAdditions}
                  </p>
                )}
                {modelTextOutputs.nutrientRequirements && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium text-gray-900">Nutrient requirements:</span> {modelTextOutputs.nutrientRequirements}
                  </p>
                )}
                {modelTextOutputs.vegetarianFoodMapping && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium text-gray-900">Vegetarian food mapping:</span> {modelTextOutputs.vegetarianFoodMapping}
                  </p>
                )}
                {modelTextOutputs.mandatoryDietChanges && (
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                    <span className="font-medium text-gray-900">Mandatory changes:</span> {modelTextOutputs.mandatoryDietChanges}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* AI Results Display */}
      <AIResultsDisplay
        assessment={assessment}
        onRetryAnalysis={onRetryAnalysis}
        isRetrying={isRetrying}
      />

      {/* Assessment Metadata */}
      <Card>
        <div className="card-header">
          <h3 className="text-xl font-semibold text-gray-900">Assessment Information</h3>
        </div>
        <div className="card-body">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{formatDate(assessment.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{formatDate(assessment.updatedAt)}</span>
                </div>
                {assessment.aiAnalysis?.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI Analysis:</span>
                    <span className="font-medium">{formatDate(assessment.aiAnalysis.processedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Data Completeness</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Symptoms:</span>
                  <span className="font-medium">
                    {[assessment.fatigue, assessment.acidity, assessment.dizziness, assessment.muscle_pain, assessment.numbness].filter(v => v != null).length}/5 provided
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lifestyle:</span>
                  <span className="font-medium">
                    {[assessment.iron_food_freq, assessment.dairy_freq, assessment.sunlight_min, assessment.junk_food_freq, assessment.alcohol].filter(v => v != null).length}/5 provided
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lab Results:</span>
                  <span className="font-medium">
                    {[assessment.hemoglobin, assessment.ferritin, assessment.vitamin_b12, assessment.vitamin_d, assessment.calcium].filter(v => v != null).length}/5 provided
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-4">
        <Button
          variant="primary"
          onClick={() => globalThis.print()}
        >
          Print Assessment
        </Button>
        
        <Button
          variant="secondary"
          onClick={exportAssessmentData}
        >
          Download Data
        </Button>

        {!assessment.aiAnalysis && onRetryAnalysis && (
          <Button
            variant="secondary"
            onClick={onRetryAnalysis}
            loading={isRetrying}
            disabled={isRetrying}
          >
            {isRetrying ? 'Retrying Analysis...' : 'Retry AI Analysis'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;