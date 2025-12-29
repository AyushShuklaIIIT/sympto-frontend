import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Alert } from '../ui';
import { assessmentService } from '../../services';

const AssessmentHistory = ({ onSelectAssessment, onCompareAssessments, selectedAssessments = [] }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(''); // For live region updates
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadAssessments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await assessmentService.getAssessments({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        setAssessments(response.data.assessments);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: response.data.totalPages
        }));
      } else {
        throw new Error(response.error?.message || 'Failed to load assessments');
      }
    } catch (error) {
      console.error('Failed to load assessment history:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);

  const handleExportAllAssessments = async () => {
    try {
      setStatusMessage('Preparing assessment data for export...');
      
      // Get all assessments
      const response = await assessmentService.getAssessments({
        limit: 1000, // Get all assessments
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        const exportData = {
          assessments: response.data.assessments,
          exportedAt: new Date().toISOString(),
          totalCount: response.data.total
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `sympto-assessments-export-${new Date().toISOString().split('T')[0]}.json`;
        link.setAttribute('aria-label', 'Download assessment data export file');
        
        // Make the download accessible
        document.body.appendChild(link);
        link.focus();
        link.click();
        document.childNode.remove(link);
        URL.revokeObjectURL(url);
        
        setStatusMessage(`Successfully exported ${response.data.total} assessments`);
      }
    } catch (error) {
      console.error('Failed to export assessments:', error);
      setError('Failed to export assessment data');
      setStatusMessage('Export failed. Please try again.');
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!globalThis.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await assessmentService.deleteAssessment(assessmentId);
      
      if (response.success) {
        // Remove from local state
        setAssessments(prev => prev.filter(assessment => assessment._id !== assessmentId));
        setStatusMessage('Assessment deleted successfully');
        
        // Update pagination if needed
        if (assessments.length === 1 && pagination.page > 1) {
          setPagination(prev => ({ ...prev, page: prev.page - 1 }));
        } else {
          // Reload to get accurate counts
          loadAssessments();
        }
      } else {
        throw new Error(response.error?.message || 'Failed to delete assessment');
      }
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      setError(error.message);
      setStatusMessage('Failed to delete assessment');
    }
  };

  const handleSelectForComparison = (assessment) => {
    if (selectedAssessments.find(a => a._id === assessment._id)) {
      // Remove from selection
      onCompareAssessments(selectedAssessments.filter(a => a._id !== assessment._id));
      setStatusMessage(`Assessment from ${formatDate(assessment.createdAt)} removed from comparison`);
    } else if (selectedAssessments.length < 2) {
      // Add to selection (max 2)
      onCompareAssessments([...selectedAssessments, assessment]);
      setStatusMessage(`Assessment from ${formatDate(assessment.createdAt)} added to comparison`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (assessment) => {
    if (assessment.aiAnalysis) {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          role="status"
          aria-label="Assessment analyzed by AI"
        >
          Analyzed
        </span>
      );
    } else if (assessment.status === 'completed') {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
          role="status"
          aria-label="Assessment processing"
        >
          Processing
        </span>
      );
    } else {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          role="status"
          aria-label="Assessment draft"
        >
          Draft
        </span>
      );
    }
  };

  if (loading && assessments.length === 0) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
            role="status"
            aria-label="Loading assessment history"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-gray-600">Loading your assessment history...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Failed to Load Assessment History
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={loadAssessments}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    );
  }

  if (assessments.length === 0) {
    return (
      <Card>
        <div className="card-body text-center py-12">
          <div className="text-gray-400 mb-4" role="img" aria-label="No assessments icon">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Assessments Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't completed any health assessments yet. Start your first assessment to begin tracking your health journey.
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/assessment'}
          >
            Take Your First Assessment
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live region for screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {statusMessage}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900" id="assessment-history-heading">
            Assessment History
          </h2>
          <p className="text-gray-600 mt-1" aria-describedby="assessment-history-heading">
            {pagination.total} assessment{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        
        <div className="flex space-x-3">
          {assessments.length > 0 && (
            <Button
              variant="secondary"
              onClick={handleExportAllAssessments}
              aria-label="Export all assessment data to JSON file"
            >
              Export All Data
            </Button>
          )}
          
          {selectedAssessments.length === 2 && (
            <Button
              variant="primary"
              onClick={() => onCompareAssessments(selectedAssessments)}
              aria-label={`Compare ${selectedAssessments.length} selected assessments`}
            >
              Compare Selected ({selectedAssessments.length})
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Instructions */}
      {selectedAssessments.length > 0 && (
        <Alert variant="info">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-primary-700">
                {selectedAssessments.length === 1 
                  ? 'Select one more assessment to compare.'
                  : `${selectedAssessments.length} assessments selected for comparison.`
                }
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* Assessment List */}
      <div className="space-y-4" aria-labelledby="assessment-history-heading">
        {assessments.map((assessment) => {
          const isSelected = selectedAssessments.find(a => a._id === assessment._id);
          
          return (
            <Card 
              key={assessment._id} 
              className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:shadow-md'}`}
              role="listitem"
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Assessment from {formatDate(assessment.createdAt)}
                      </h3>
                      {getStatusBadge(assessment)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4" aria-label="Assessment summary">
                      <div>
                        <span className="font-medium">Symptoms:</span> 
                        <span aria-label={assessment.fatigue ? 'Symptoms reported' : 'No symptoms reported'}>
                          {assessment.fatigue ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Lab Results:</span> 
                        <span aria-label={assessment.hemoglobin ? 'Lab results included' : 'Lab results not included'}>
                          {assessment.hemoglobin ? 'Included' : 'Not included'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">AI Analysis:</span> 
                        <span aria-label={assessment.aiAnalysis ? 'AI analysis complete' : 'AI analysis pending'}>
                          {assessment.aiAnalysis ? 'Complete' : 'Pending'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Confidence:</span> 
                        <span aria-label={
                          assessment.aiAnalysis?.confidence 
                            ? `AI confidence level ${Math.round(assessment.aiAnalysis.confidence * 100)} percent`
                            : 'Confidence level not available'
                        }>
                          {assessment.aiAnalysis?.confidence 
                            ? `${Math.round(assessment.aiAnalysis.confidence * 100)}%`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>

                    {assessment.aiAnalysis?.insights && (
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {assessment.aiAnalysis.insights.length > 150 
                          ? `${assessment.aiAnalysis.insights.substring(0, 150)}...`
                          : assessment.aiAnalysis.insights
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {/* Comparison Checkbox */}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => handleSelectForComparison(assessment)}
                        disabled={!isSelected && selectedAssessments.length >= 2}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        aria-describedby={`compare-help-${assessment._id}`}
                        aria-label={`Select assessment from ${formatDate(assessment.createdAt)} for comparison`}
                      />
                      <span className="text-sm text-gray-600" id={`compare-help-${assessment._id}`}>
                        Compare
                      </span>
                    </label>

                    {/* View Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSelectAssessment(assessment)}
                      aria-label={`View details for assessment from ${formatDate(assessment.createdAt)}`}
                    >
                      View Details
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteAssessment(assessment._id)}
                      className="text-red-600 hover:text-red-700"
                      aria-label={`Delete assessment from ${formatDate(assessment.createdAt)}`}
                      title={`Delete assessment from ${formatDate(assessment.createdAt)}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="sr-only">Delete assessment</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav aria-label="Assessment history pagination" className="flex items-center justify-between">
          <div className="text-sm text-gray-700" aria-live="polite">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} assessments
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1 || loading}
              aria-label="Go to previous page"
            >
              Previous
            </Button>
            
            <span className="flex items-center px-3 py-1 text-sm text-gray-700" aria-current="page">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages || loading}
              aria-label="Go to next page"
            >
              Next
            </Button>
          </div>
        </nav>
      )}

      {loading && (
        <div className="text-center py-4">
          <div 
            className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"
            aria-label="Loading more assessments"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;