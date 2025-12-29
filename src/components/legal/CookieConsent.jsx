import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(() => {
    // Initialize state based on localStorage check
    const consentGiven = localStorage.getItem('sympto-consent-given');
    return !consentGiven;
  });
  const [showDetails, setShowDetails] = useState(false);
  const bannerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    communications: false,
    research: false
  });

  // Focus management for accessibility
  useEffect(() => {
    if (showBanner && bannerRef.current) {
      // Focus the banner when it appears
      bannerRef.current.focus();
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Cookie consent banner has appeared. Please review your cookie preferences.';
      document.body.appendChild(announcement);
      
      // Clean up announcement after screen readers have processed it
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);
    }
  }, [showBanner]);

  // Handle escape key to close details panel
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showDetails) {
        setShowDetails(false);
        // Return focus to the customize settings button
        if (bannerRef.current) {
          const customizeButton = bannerRef.current.querySelector('[data-testid="customize-button"]');
          if (customizeButton) {
            customizeButton.focus();
          }
        }
      }
    };

    if (showDetails) {
      document.addEventListener('keydown', handleEscape);
      // Focus the close button when details panel opens
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDetails]);

  const handleAcceptAll = async () => {
    const allConsent = {
      essential: true,
      analytics: true,
      communications: true,
      research: true
    };
    
    await saveConsent(allConsent);
    setShowBanner(false);
  };

  const handleAcceptEssential = async () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      communications: false,
      research: false
    };
    
    await saveConsent(essentialOnly);
    setShowBanner(false);
  };

  const handleSavePreferences = async () => {
    await saveConsent(preferences);
    setShowBanner(false);
    setShowDetails(false);
  };

  const saveConsent = async (consentData) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Save to backend if user is logged in
        await fetch('/api/consent', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(consentData)
        });
      }
      
      // Save to localStorage for non-authenticated users
      localStorage.setItem('sympto-consent-given', 'true');
      localStorage.setItem('sympto-consent-preferences', JSON.stringify(consentData));
      
      // Set analytics cookies based on consent
      if (consentData.analytics) {
        // Enable analytics tracking
        console.log('Analytics tracking enabled');
      } else {
        // Disable analytics tracking
        console.log('Analytics tracking disabled');
      }
      
    } catch (error) {
      console.error('Failed to save consent:', error);
    }
  };

  const handlePreferenceChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <Card 
        className="max-w-4xl mx-auto p-6 shadow-lg border-t-4 border-primary-500"
        ref={bannerRef}
        tabIndex={-1}
      >
        {showDetails ? (
          <section className="space-y-6" aria-labelledby="cookie-preferences-title">
            <header className="flex items-center justify-between">
              <h2 id="cookie-preferences-title" className="text-lg font-semibold text-gray-900">
                Cookie Preferences
              </h2>
              <button
                ref={closeButtonRef}
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close cookie preferences panel"
                type="button"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </header>
            
            <div className="space-y-4" role="group" aria-labelledby="cookie-categories-title">
              <h3 id="cookie-categories-title" className="sr-only">Cookie Categories</h3>
              
              <fieldset className="flex items-start space-x-3 p-3 border border-white/40 rounded-lg bg-white/30 backdrop-blur-md">
                <legend className="sr-only">Essential Cookies Settings</legend>
                <input
                  type="checkbox"
                  id="essential-cookies"
                  checked={true}
                  disabled={true}
                  className="mt-1"
                  aria-describedby="essential-cookies-desc"
                />
                <div className="flex-1">
                  <label htmlFor="essential-cookies" className="font-medium text-gray-900">
                    Essential Cookies (Required)
                  </label>
                  <p id="essential-cookies-desc" className="text-sm text-gray-600 mt-1">
                    These cookies are necessary for the website to function and cannot be disabled. 
                    They include authentication, security, and basic functionality.
                  </p>
                </div>
              </fieldset>

              <fieldset className="flex items-start space-x-3 p-3 border rounded-lg">
                <legend className="sr-only">Analytics Cookies Settings</legend>
                <input
                  type="checkbox"
                  id="analytics-cookies"
                  checked={preferences.analytics}
                  onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                  className="mt-1"
                  aria-describedby="analytics-cookies-desc"
                />
                <div className="flex-1">
                  <label htmlFor="analytics-cookies" className="font-medium text-gray-900">
                    Analytics Cookies
                  </label>
                  <p id="analytics-cookies-desc" className="text-sm text-gray-600 mt-1">
                    Help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                </div>
              </fieldset>

              <fieldset className="flex items-start space-x-3 p-3 border rounded-lg">
                <legend className="sr-only">Marketing Cookies Settings</legend>
                <input
                  type="checkbox"
                  id="communications-cookies"
                  checked={preferences.communications}
                  onChange={(e) => handlePreferenceChange('communications', e.target.checked)}
                  className="mt-1"
                  aria-describedby="communications-cookies-desc"
                />
                <div className="flex-1">
                  <label htmlFor="communications-cookies" className="font-medium text-gray-900">
                    Marketing Cookies
                  </label>
                  <p id="communications-cookies-desc" className="text-sm text-gray-600 mt-1">
                    Used to deliver personalized content and advertisements that are relevant 
                    to you and your interests.
                  </p>
                </div>
              </fieldset>

              <fieldset className="flex items-start space-x-3 p-3 border rounded-lg">
                <legend className="sr-only">Research Cookies Settings</legend>
                <input
                  type="checkbox"
                  id="research-cookies"
                  checked={preferences.research}
                  onChange={(e) => handlePreferenceChange('research', e.target.checked)}
                  className="mt-1"
                  aria-describedby="research-cookies-desc"
                />
                <div className="flex-1">
                  <label htmlFor="research-cookies" className="font-medium text-gray-900">
                    Research Cookies
                  </label>
                  <p id="research-cookies-desc" className="text-sm text-gray-600 mt-1">
                    Help us improve our AI models and develop new features using anonymized 
                    and aggregated data.
                  </p>
                </div>
              </fieldset>
            </div>
            
            <footer className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                onClick={handleSavePreferences}
                className="bg-primary-600 hover:bg-primary-700 text-white"
                aria-describedby="save-preferences-desc"
              >
                Save Preferences
              </Button>
              <span id="save-preferences-desc" className="sr-only">
                Save your current cookie preferences and close this panel
              </span>
              <Button
                onClick={handleAcceptAll}
                variant="outline"
                className="border-gray-300"
                aria-describedby="accept-all-desc"
              >
                Accept All
              </Button>
              <span id="accept-all-desc" className="sr-only">
                Accept all cookie categories and close this panel
              </span>
            </footer>
          </section>
        ) : (
          <section className="space-y-4" aria-labelledby="cookie-consent-title">
            <header className="flex items-start space-x-4">
              <div className="shrink-0" aria-hidden="true">
                <svg 
                  className="w-8 h-8 text-amber-600" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Cookie icon"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h1 id="cookie-consent-title" className="text-lg font-semibold text-gray-900 mb-2">
                  We use cookies to improve your experience
                </h1>
                <p id="cookie-consent-description" className="text-gray-700 text-sm leading-relaxed">
                  We use essential cookies to make our site work. We'd also like to set optional 
                  cookies to help us improve our service and analyze how you use our site. 
                  You can choose which cookies to accept.
                </p>
              </div>
            </header>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2" role="group" aria-labelledby="cookie-actions-title">
              <h2 id="cookie-actions-title" className="sr-only">Cookie Consent Actions</h2>
              <Button
                onClick={handleAcceptAll}
                className="bg-primary-600 hover:bg-primary-700 text-white"
                aria-describedby="accept-all-main-desc"
              >
                Accept All Cookies
              </Button>
              <span id="accept-all-main-desc" className="sr-only">
                Accept all cookie categories including analytics, marketing, and research cookies
              </span>
              <Button
                onClick={handleAcceptEssential}
                variant="outline"
                className="border-gray-300"
                aria-describedby="essential-only-desc"
              >
                Essential Only
              </Button>
              <span id="essential-only-desc" className="sr-only">
                Accept only essential cookies required for basic website functionality
              </span>
              <Button
                onClick={() => setShowDetails(true)}
                variant="outline"
                className="border-gray-300"
                data-testid="customize-button"
                aria-describedby="customize-desc"
              >
                Customize Settings
              </Button>
              <span id="customize-desc" className="sr-only">
                Open detailed cookie preferences to choose specific cookie categories
              </span>
            </div>
            
            <footer className="text-xs text-gray-500">
              By continuing to use our site, you agree to our{' '}
              <a 
                href="/privacy" 
                className="text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-describedby="privacy-link-desc"
              >
                Privacy Policy
              </a>
              <span id="privacy-link-desc" className="sr-only">Opens privacy policy in same window</span>
              {' '}and{' '}
              <a 
                href="/terms" 
                className="text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-describedby="terms-link-desc"
              >
                Terms of Service
              </a>
              <span id="terms-link-desc" className="sr-only">Opens terms of service in same window</span>
              .
            </footer>
          </section>
        )}
      </Card>
    </div>
  );
};

export default CookieConsent;