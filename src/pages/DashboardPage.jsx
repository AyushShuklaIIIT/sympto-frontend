import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AssessmentHistory, AssessmentComparison, ResultsDisplay, UserProfile } from '../components/dashboard';
import { assessmentService } from '../services';

const DashboardPage = () => {
  const [currentView, setCurrentView] = useState('history'); // 'history', 'comparison', 'details', 'profile'
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentView('details');
  };

  const handleCompareAssessments = (assessments) => {
    setSelectedAssessments(assessments);
    if (assessments.length === 2) {
      setCurrentView('comparison');
    }
  };

  const handleRetryAnalysis = async () => {
    if (!selectedAssessment?.id) return;

    setIsRetrying(true);
    try {
      const response = await assessmentService.analyzeAssessment(selectedAssessment.id);
      
      if (response.success) {
        setSelectedAssessment(response.data.assessment);
      } else {
        throw new Error(response.error?.message || 'Failed to retry analysis');
      }
    } catch (error) {
      console.error('Analysis retry failed:', error);
      // Could show error notification here
    } finally {
      setIsRetrying(false);
    }
  };

  const handleBackToHistory = () => {
    setCurrentView('history');
    setSelectedAssessment(null);
    setSelectedAssessments([]);
  };

  const handleShowProfile = () => {
    setCurrentView('profile');
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="glass-nav shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-linear-to-r from-primary-600 to-health-mint rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Sympto</h1>
            </div>
            
            <nav className="flex space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Home
              </Link>
              <Link
                to="/assessment"
                className="text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                New Assessment
              </Link>
              <button 
                onClick={handleBackToHistory}
                className={`transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1 ${
                  currentView === 'history' 
                    ? 'text-primary-600 font-medium' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={handleShowProfile}
                className={`transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1 ${
                  currentView === 'profile' 
                    ? 'text-primary-600 font-medium' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'history' && (
          <AssessmentHistory
            onSelectAssessment={handleSelectAssessment}
            onCompareAssessments={handleCompareAssessments}
            selectedAssessments={selectedAssessments}
          />
        )}

        {currentView === 'comparison' && (
          <AssessmentComparison
            assessments={selectedAssessments}
            onClose={handleBackToHistory}
          />
        )}

        {currentView === 'details' && (
          <ResultsDisplay
            assessment={selectedAssessment}
            onClose={handleBackToHistory}
            onRetryAnalysis={handleRetryAnalysis}
            isRetrying={isRetrying}
          />
        )}

        {currentView === 'profile' && (
          <UserProfile
            onClose={handleBackToHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel mt-16">
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

export default DashboardPage;