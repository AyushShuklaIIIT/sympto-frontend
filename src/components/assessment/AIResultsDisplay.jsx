import { useState, useRef, useEffect } from 'react';
import { Card, Button, Alert } from '../ui';

const AIResultsDisplay = ({ assessment, onRetryAnalysis, isRetrying = false }) => {
  const [showFullInsights, setShowFullInsights] = useState(false);
  const insightsRef = useRef(null);
  
  // Focus management for expand/collapse
  useEffect(() => {
    if (showFullInsights && insightsRef.current) {
      insightsRef.current.focus();
    }
  }, [showFullInsights]);
  
  if (!assessment) {
    return null;
  }

  const { aiAnalysis, status } = assessment;

  // Show loading state if assessment is being analyzed
  if (status === 'analyzing' || (status === 'pending' && !aiAnalysis)) {
    return (
      <section aria-labelledby="analysis-loading" role="status" aria-live="polite">
        <Card className="mb-6">
          <div className="card-body text-center py-8">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"
              role="status"
              aria-label="Analyzing your health data"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <h3 id="analysis-loading" className="text-lg font-semibold text-gray-900 mb-2">
              Analyzing Your Health Data
            </h3>
            <p className="text-gray-600">
              Our AI is processing your assessment to provide personalized insights. This may take a few moments.
            </p>
          </div>
        </Card>
      </section>
    );
  }

  // Show error state if analysis failed
  if (status === 'failed' || (status === 'completed' && !aiAnalysis && onRetryAnalysis)) {
    return (
      <section aria-labelledby="analysis-error" role="alert" aria-live="assertive">
        <Card className="mb-6">
          <div className="card-body text-center py-8">
            <div className="text-red-500 mb-4" role="img" aria-label="Error icon">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 id="analysis-error" className="text-lg font-semibold text-gray-900 mb-2">
              Analysis Unavailable
            </h3>
            <p className="text-gray-600 mb-4">
              We're unable to analyze your assessment at the moment. This could be due to a temporary service issue.
            </p>
            {onRetryAnalysis && (
              <Button
                onClick={onRetryAnalysis}
                loading={isRetrying}
                disabled={isRetrying}
                aria-describedby="retry-description"
              >
                {isRetrying ? 'Retrying...' : 'Retry Analysis'}
              </Button>
            )}
            <div id="retry-description" className="sr-only">
              Click to retry the AI analysis of your health assessment
            </div>
          </div>
        </Card>
      </section>
    );
  }

  // Show AI results if available
  if (aiAnalysis) {
    const insightsText = typeof aiAnalysis.insights === 'string' ? aiAnalysis.insights : '';
    const recommendations = Array.isArray(aiAnalysis.recommendations) ? aiAnalysis.recommendations : [];
    const riskFactors = Array.isArray(aiAnalysis.riskFactors) ? aiAnalysis.riskFactors : [];
    const confidence = typeof aiAnalysis.confidence === 'number' ? aiAnalysis.confidence : null;
    const processedAt = aiAnalysis.processedAt ? new Date(aiAnalysis.processedAt) : null;

    // If we have an object but no narrative fields yet, don't render and risk crashing.
    if (!insightsText && recommendations.length === 0 && riskFactors.length === 0) {
      return null;
    }

    const confidencePercentage = confidence == null ? null : Math.round(confidence * 100);
    const confidenceColor =
      confidence == null ? 'text-gray-600' :
      confidence >= 0.8 ? 'text-green-600' :
      confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600';
    
    const confidenceLevel =
      confidence == null ? 'Unknown' :
      confidence >= 0.8 ? 'High' :
      confidence >= 0.6 ? 'Medium' : 'Low';
    
    const confidenceIcon =
      confidence == null ? '…' :
      confidence >= 0.8 ? '✓' :
      confidence >= 0.6 ? '⚠' : '✗';

    return (
      <main className="space-y-6" aria-labelledby="health-insights-title">
        {/* Live region for dynamic updates */}
        <div aria-live="polite" aria-atomic="true" className="sr-only" id="insights-announcements"></div>
        
        {/* Header */}
        <section aria-labelledby="health-insights-title">
          <Card>
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 id="health-insights-title" className="text-2xl font-semibold text-gray-900">
                  Your Health Insights
                </h2>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Analysis Confidence</div>
                  <div className={`text-lg font-semibold ${confidenceColor} flex items-center gap-1`}>
                    <span aria-hidden="true">{confidenceIcon}</span>
                    {confidencePercentage == null ? 'N/A' : `${confidencePercentage}%`}
                    <span className="sr-only">
                      {confidenceLevel} confidence level
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <p className="text-gray-600">
                Based on your assessment, our AI has generated personalized insights and recommendations. 
                {processedAt ? `Analysis completed on ${processedAt.toLocaleDateString()}.` : 'Analysis timestamp unavailable.'}
              </p>
            </div>
          </Card>
        </section>

        {/* Main Insights */}
        <section aria-labelledby="key-insights-title">
          <Card>
            <div className="card-header">
              <h3 id="key-insights-title" className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Key Insights
              </h3>
            </div>
            <div className="card-body">
              <div className="prose max-w-none">
                {showFullInsights ? (
                  <div>
                    <div id="full-insights-content" ref={insightsRef} tabIndex="-1">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {insightsText}
                      </p>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => setShowFullInsights(false)}
                      className="mt-2 p-0"
                      aria-expanded="true"
                      aria-controls="full-insights-content"
                      aria-label="Show less insights content"
                    >
                      Show less
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div id="truncated-insights-content">
                      <p className="text-gray-700 leading-relaxed">
                        {insightsText.length > 300 
                          ? `${insightsText.substring(0, 300)}...`
                          : insightsText
                        }
                      </p>
                    </div>
                    {insightsText.length > 300 && (
                      <Button
                        variant="link"
                        onClick={() => setShowFullInsights(true)}
                        className="mt-2 p-0"
                        aria-expanded="false"
                        aria-controls="full-insights-content"
                        aria-label="Show more insights content"
                      >
                        Read more
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section aria-labelledby="recommendations-title">
            <Card>
              <div className="card-header">
                <h3 id="recommendations-title" className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recommendations
                </h3>
              </div>
              <div className="card-body">
                <ol className="space-y-3" aria-label="Health recommendations list">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5" aria-hidden="true">
                        <span className="text-green-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="ml-3 text-gray-700 leading-relaxed">
                        {recommendation}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          </section>
        )}

        {/* Risk Factors */}
        {riskFactors.length > 0 && (
          <section aria-labelledby="risk-factors-title">
            <Card>
              <div className="card-header">
                <h3 id="risk-factors-title" className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="h-6 w-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Areas of Attention
                </h3>
              </div>
              <div className="card-body">
                <ul className="space-y-2" aria-label="Health risk factors list">
                  {riskFactors.map((riskFactor, index) => (
                    <li key={index} className="flex items-center">
                      <div className="shrink-0 w-2 h-2 bg-amber-400 rounded-full mr-3" aria-hidden="true"></div>
                      <p className="text-gray-700">
                        {riskFactor}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </section>
        )}

        {/* Disclaimer */}
        <section aria-labelledby="medical-disclaimer-title">
          <Alert variant="info" role="region" aria-labelledby="medical-disclaimer-title">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 id="medical-disclaimer-title" className="text-sm font-medium text-primary-800">
                  Important Medical Disclaimer
                </h3>
                <div className="mt-2 text-sm text-primary-700">
                  <p>
                    This AI analysis is for informational purposes only and should not be considered as medical advice, 
                    diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns. 
                    If you have serious symptoms or health concerns, please seek immediate medical attention.
                  </p>
                </div>
              </div>
            </div>
          </Alert>
        </section>

        {/* Analysis Metadata */}
        <section aria-labelledby="analysis-metadata-title">
          <Card>
            <div className="card-body">
              <h4 id="analysis-metadata-title" className="sr-only">Analysis Metadata</h4>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Analysis completed: {new Date(aiAnalysis.processedAt).toLocaleString()}</p>
                {aiAnalysis.modelVersion && (
                  <p>Model version: {aiAnalysis.modelVersion}</p>
                )}
                <p>Confidence level: {confidencePercentage == null ? 'N/A' : `${confidencePercentage}%`} ({confidenceLevel})</p>
              </div>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return null;
};

export default AIResultsDisplay;