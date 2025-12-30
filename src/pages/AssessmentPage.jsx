import React, { useState, useEffect } from 'react';
import { AssessmentWizard, AIResultsDisplay } from '../components/assessment';
import { assessmentService } from '../services';
import { Alert, Card, Badge, Button } from '../components/ui';
import Logo from '../components/ui/Logo';

const AssessmentPage = () => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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

  const getModelOutputs = (assessment) => {
    if (!assessment) return null;
    const structured =
      assessment.modelOutputs ||
      assessment.aiOutputs ||
      assessment.aiAnalysis?.modelOutputs ||
      assessment.aiAnalysis?.outputs;
    if (structured && typeof structured === 'object') return structured;

    const extracted = {};
    let hasAny = false;
    for (const { key } of OUTPUT_FIELDS) {
      if (assessment[key] !== undefined && assessment[key] !== null && assessment[key] !== '') {
        extracted[key] = assessment[key];
        hasAny = true;
      }
    }
    if (assessment.severity !== undefined && assessment.severity !== null && assessment.severity !== '') {
      extracted.severity = assessment.severity;
      hasAny = true;
    }
    return hasAny ? extracted : null;
  };

  const renderBinary = (value) => {
    const asNumber = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(asNumber)) return <span className="text-gray-600">Not available</span>;
    if (asNumber === 1) return <Badge variant="warning">Yes</Badge>;
    if (asNumber === 0) return <Badge variant="gray">No</Badge>;
    return <span className="text-gray-900">{String(value)}</span>;
  };

  // Load existing assessment if available
  useEffect(() => {
    const loadRecentAssessment = async () => {
      try {
        const response = await assessmentService.getAssessments({ limit: 1 });
        if (response.success && response.data.assessments.length > 0) {
          const recentAssessment = response.data.assessments[0];
          // Show results if assessment is analyzed or completed
          if (recentAssessment.status === 'analyzed' || recentAssessment.aiAnalysis) {
            setCurrentAssessment(recentAssessment);
            setShowResults(true);
          }
        }
      } catch (error) {
        console.error('Failed to load recent assessment:', error);
        // Don't show error for this, just continue with new assessment
      }
    };

    loadRecentAssessment();
  }, []);

  const handleAssessmentSubmit = async (assessmentData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await assessmentService.createAssessment(assessmentData);
      
      if (response.success) {
        const assessment = response.data.assessment;
        setCurrentAssessment(assessment);
        setShowResults(true);
        const hasOutputs = Boolean(getModelOutputs(assessment)) || Boolean(assessment?.modelTextOutputs);
        setStatusMessage(
          hasOutputs
            ? 'Assessment submitted successfully. Your results are now available.'
            : 'Assessment submitted successfully.'
        );
        
        // If AI analysis is not immediately available, poll for results
        if (assessment.status === 'completed' && !assessment.aiAnalysis && !getModelOutputs(assessment)) {
          setStatusMessage('Assessment submitted. Analysis in progress...');
          pollForAIResults(assessment.id);
        }
      } else {
        throw new Error(response.error?.message || 'Failed to submit assessment');
      }
    } catch (error) {
      console.error('Assessment submission failed:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollForAIResults = async (assessmentId, maxAttempts = 10, interval = 3000) => {
    let attempts = 0;
    
    const poll = async () => {
      try {
        attempts++;
        const response = await assessmentService.getAssessment(assessmentId);
        
        if (response.success) {
          const assessment = response.data.assessment;
          setCurrentAssessment(assessment);
          
          // Stop polling if AI analysis is complete or we've reached max attempts
          if (assessment.aiAnalysis || assessment.status === 'analyzed' || attempts >= maxAttempts) {
            return;
          }
          
          // Continue polling
          setTimeout(poll, interval);
        }
      } catch (error) {
        console.error('Failed to poll for AI results:', error);
        // Stop polling on error
      }
    };

    // Start polling after a short delay
    setTimeout(poll, interval);
  };

  const handleRetryAnalysis = async () => {
    if (!currentAssessment?.id) return;

    setIsRetrying(true);
    setError(null);

    try {
      const response = await assessmentService.analyzeAssessment(currentAssessment.id);
      
      if (response.success) {
        setCurrentAssessment(response.data.assessment);
      } else {
        throw new Error(response.error?.message || 'Failed to retry analysis');
      }
    } catch (error) {
      console.error('Analysis retry failed:', error);
      setError(error.message);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleStartNewAssessment = () => {
    setCurrentAssessment(null);
    setShowResults(false);
    setError(null);
    setStatusMessage('Starting new health assessment...');
    // Clear any saved draft
    localStorage.removeItem('sympto-draft-assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      {/* Live region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="status-announcements"
      >
        {statusMessage}
      </div>

      {/* Header */}
      <header className="glass-nav shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Logo size="sm" variant="icon" />
              <h1 className="text-2xl font-display font-bold text-gradient">Sympto Health Assessment</h1>
            </div>
            
            {showResults && (
              <button
                onClick={handleStartNewAssessment}
                className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-describedby="new-assessment-desc"
              >
                New Assessment
              </button>
            )}
            <span id="new-assessment-desc" className="sr-only">
              Start a new health assessment questionnaire
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" 
        id="main-content"
        role="main"
      >
        {error && (
          <Alert 
            variant="error" 
            className="mb-6"
            role="alert"
            aria-describedby="error-description"
          >
            <div>
              <h2 className="text-sm font-medium">Assessment Error</h2>
              <p className="mt-2 text-sm" id="error-description">{error}</p>
            </div>
          </Alert>
        )}

        {showResults ? (
          <div className="space-y-8">
            {(() => {
              const modelOutputs = getModelOutputs(currentAssessment);
              const modelTextOutputs = currentAssessment?.modelTextOutputs || null;
              const hasAnyResults = Boolean(currentAssessment?.aiAnalysis) || Boolean(modelOutputs) || Boolean(modelTextOutputs);

              return (
                <>
            {/* Success Message */}
            <Alert 
              variant="success"
              role="status"
              aria-describedby="success-description"
            >
              <div>
                <h2 className="text-sm font-medium">Assessment Submitted Successfully</h2>
                <p className="mt-2 text-sm" id="success-description">
                  {hasAnyResults
                    ? 'Your health assessment has been submitted successfully. Review your results below.'
                    : 'Your health assessment has been submitted successfully. Analysis is in progress.'}
                </p>
              </div>
            </Alert>

            {/* Model Outputs (prediction1) */}
            {modelOutputs && (
              <Card>
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Model Outputs</h3>
                    {modelOutputs.severity !== undefined && modelOutputs.severity !== null && modelOutputs.severity !== '' && (
                      <Badge variant="primary">Severity: {String(modelOutputs.severity)}</Badge>
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
                  </div>
                </div>
              </Card>
            )}

            {/* Suggested Guidance (prediction2/prediction3) */}
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
              assessment={currentAssessment}
              onRetryAnalysis={handleRetryAnalysis}
              isRetrying={isRetrying}
            />

                </>
              );
            })()}

            {/* Action Buttons */}
            <section className="flex justify-center space-x-4 pt-8" aria-labelledby="actions-heading">
              <h2 id="actions-heading" className="sr-only">Available Actions</h2>
              <Button
                onClick={handleStartNewAssessment}
                variant="primary"
                size="lg"
                aria-describedby="new-assessment-action-desc"
              >
                Take New Assessment
              </Button>
              <span id="new-assessment-action-desc" className="sr-only">
                Start a new comprehensive health assessment questionnaire
              </span>
              
              <Button
                onClick={() => globalThis.print()}
                variant="secondary"
                size="lg"
                aria-describedby="print-results-desc"
              >
                Print Results
              </Button>
              <span id="print-results-desc" className="sr-only">
                Print your assessment results and AI insights for your records
              </span>
            </section>
          </div>
        ) : (
          <AssessmentWizard
            onSubmit={handleAssessmentSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel mt-16" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>
              © 2024 Sympto. This platform is for informational purposes only and 
              does not replace professional medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentPage;