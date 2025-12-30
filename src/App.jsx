import { useEffect, Suspense, lazy } from 'react'
import { MobileNav, ResponsiveContainer, Logo, LoadingSpinner } from './components/ui'
import { AuthProvider, useAuth } from './contexts'
import { AuthGuard } from './components/auth'
import { initializeAccessibility } from './utils/accessibility'
import { measurePageLoad, monitorWebVitals, checkPerformanceBudget } from './utils/performance'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HomePage = ({ currentPage, navigateToPage, handleKeyDown }) => {
  const { isAuthenticated, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigateToPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Live region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="status-announcements"
      ></div>

      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>

      {/* Mobile-responsive Navigation */}
      <MobileNav 
        currentPage={currentPage}
        onNavigate={navigateToPage}
      />

      {/* Main Content */}
      <ResponsiveContainer 
        as="main" 
        id="main-content" 
        size="xl"
        padding="lg"
      >
        {/* Hero Section */}
        <section className="text-center mb-16" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="text-responsive-3xl font-display font-bold text-gray-900 mb-6">
            Your Health Journey
            <span className="block text-gradient">Starts Here</span>
          </h1>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive health assessments powered by AI to help you understand 
            your symptoms and track your wellness over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigateToPage('assessment')}
              onKeyDown={(e) => handleKeyDown(e, () => navigateToPage('assessment'))}
              className="btn-primary btn-lg focus-visible"
              aria-describedby="start-assessment-desc"
              type="button"
            >
              Start Assessment
            </button>
            <div id="start-assessment-desc" className="sr-only">
              Begin your comprehensive health assessment questionnaire
            </div>

            {isAuthenticated ? (
              <button 
                onClick={handleSignOut}
                onKeyDown={(e) => handleKeyDown(e, handleSignOut)}
                className="btn-secondary btn-lg focus-visible"
                type="button"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => navigateToPage('auth')}
                onKeyDown={(e) => handleKeyDown(e, () => navigateToPage('auth'))}
                className="btn-secondary btn-lg focus-visible"
                aria-describedby="auth-desc"
                type="button"
              >
                Sign In / Register
              </button>
            )}
            {!isAuthenticated && (
              <div id="auth-desc" className="sr-only">
                Sign in, create an account, or reset your password
              </div>
            )}
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid md:grid-cols-3 gap-8 mb-16" aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-semibold text-gray-900 mb-8 text-center col-span-full">Platform Features</h2>
          
          <article className="card-elevated animate-fade-in">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Assessment
              </h3>
              <p className="text-gray-600">
                Detailed health questionnaire covering symptoms, lifestyle, and lab results
              </p>
            </div>
          </article>

          <article className="card-elevated animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-health-mint/20 rounded-xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-6 h-6 text-health-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Advanced AI analysis provides personalized health insights and recommendations
              </p>
            </div>
          </article>

          <article className="card-elevated animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-health-ocean/20 rounded-xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-6 h-6 text-health-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your health journey with detailed history and comparison tools
              </p>
            </div>
          </article>
        </section>
      </ResponsiveContainer>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20" role="contentinfo">
        <ResponsiveContainer size="xl" padding="lg">
          <div className="text-center">
            <Logo size="sm" className="justify-center mb-4" />
            <p className="text-gray-400 mb-6">
              Empowering your health journey with intelligent assessments
            </p>
            <nav className="flex flex-wrap justify-center gap-6" role="navigation" aria-label="Footer navigation">
              <button 
                onClick={() => navigateToPage('privacy')}
                onKeyDown={(e) => handleKeyDown(e, () => navigateToPage('privacy'))}
                className="text-gray-400 hover:text-white transition-colors focus-visible bg-transparent border-none cursor-pointer"
                type="button"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => {/* Navigate to terms */}}
                className="text-gray-400 hover:text-white transition-colors focus-visible bg-transparent border-none cursor-pointer"
                type="button"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => {/* Navigate to contact */}}
                className="text-gray-400 hover:text-white transition-colors focus-visible bg-transparent border-none cursor-pointer"
                type="button"
              >
                Contact
              </button>
            </nav>
          </div>
        </ResponsiveContainer>
      </footer>
    </div>
  );
};

// Lazy load pages for code splitting
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const DataManagementPage = lazy(() => import('./pages/DataManagementPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // Warm up the external AI service on initial site open (Render free instances sleep).
  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/ai/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    }).catch(() => {
      // Best-effort warmup; ignore failures.
    });

    return () => controller.abort();
  }, []);

  const getCurrentPageFromPath = (pathname) => {
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/assessment')) return 'assessment'
    if (pathname.startsWith('/auth')) return 'auth'
    if (pathname.startsWith('/dashboard')) return 'dashboard'
    if (pathname.startsWith('/data-management')) return 'data-management'
    if (pathname.startsWith('/privacy')) return 'privacy'
    return 'home'
  }

  const currentPage = getCurrentPageFromPath(location.pathname)

  // Initialize accessibility enhancements, performance monitoring, and offline capabilities
  useEffect(() => {
    initializeAccessibility();
    
    // Set page title based on current page
    const pageTitles = {
      home: 'Sympto - Health Assessment Platform',
      assessment: 'Health Assessment - Sympto',
      auth: 'Sign In - Sympto',
      dashboard: 'Dashboard - Sympto',
      'data-management': 'Data Management - Sympto',
      privacy: 'Privacy Policy - Sympto'
    };
    
    document.title = pageTitles[currentPage] || 'Sympto - Health Assessment Platform';
    
    // Offline capabilities intentionally removed (no Service Worker)
    
    // Monitor performance metrics
    setTimeout(() => {
      measurePageLoad();
      monitorWebVitals();
      const budget = checkPerformanceBudget();
      if (budget) {
        console.log('Performance Budget Check:', budget);
      }
    }, 1000);
  }, [currentPage]);

  // Handle page navigation with focus management
  const navigateToPage = (page) => {
    const pathByPage = {
      home: '/',
      assessment: '/assessment',
      auth: '/auth',
      dashboard: '/dashboard',
      'data-management': '/data-management',
      privacy: '/privacy',
    }
    const targetPath = pathByPage[page] || '/'
    navigate(targetPath)
    // Announce page change to screen readers
    const announcement = document.getElementById('status-announcements');
    if (announcement) {
      const pageTitles = {
        home: 'Navigated to home page',
        assessment: 'Navigated to health assessment page',
        auth: 'Navigated to sign in page',
        dashboard: 'Navigated to dashboard page',
        'data-management': 'Navigated to data management page',
        privacy: 'Navigated to privacy policy page'
      };
      announcement.textContent = pageTitles[page] || 'Page changed';
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-soft" aria-live="polite">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg text-gray-600" aria-live="polite">
              Loading Sympto Health Assessment Platform...
            </p>
          </div>
        </div>
      }>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                currentPage={currentPage}
                navigateToPage={navigateToPage}
                handleKeyDown={handleKeyDown}
              />
            }
          />
          <Route
            path="/assessment"
            element={
              <AuthGuard>
                <AssessmentPage />
              </AuthGuard>
            }
          />

          <Route
            path="/auth"
            element={
              <AuthGuard requireAuth={false}>
                <AuthPage initialMode="login" />
              </AuthGuard>
            }
          />
          <Route
            path="/auth/register"
            element={
              <AuthGuard requireAuth={false}>
                <AuthPage initialMode="register" />
              </AuthGuard>
            }
          />
          <Route
            path="/auth/reset"
            element={
              <AuthGuard requireAuth={false}>
                <AuthPage initialMode="reset" />
              </AuthGuard>
            }
          />

          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />

          <Route path="/data-management" element={<DataManagementPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App
