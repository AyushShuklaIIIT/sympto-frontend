import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './index.js';

/**
 * MobileNav - Responsive navigation component with mobile hamburger menu
 * Provides accessible navigation for mobile and desktop users
 */
const MobileNav = ({ 
  currentPage, 
  onNavigate, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const navigationItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'assessment', label: 'Assessment', href: '#assessment' },
    { id: 'auth', label: 'Sign In', href: '#auth' },
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
  ];

  return (
    <header className={`glass-nav shadow-soft ${className}`} role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`nav-link ${currentPage === item.id ? 'nav-link-active' : ''}`}
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">
              {isOpen ? 'Close main menu' : 'Open main menu'}
            </span>
            
            {/* Hamburger Icon */}
            <svg
              className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            
            {/* Close Icon */}
            <svg
              className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-heading"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div 
            ref={menuRef}
            className="fixed top-0 right-0 w-full max-w-sm h-full glass-panel shadow-xl transform transition-transform duration-300 ease-in-out"
            id="mobile-menu"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Logo size="sm" />
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2" role="navigation" aria-labelledby="mobile-menu-heading">
                <h2 id="mobile-menu-heading" className="sr-only">
                  Main navigation
                </h2>
                
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200
                      ${currentPage === item.id 
                        ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                      }
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    `}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                  >
                    {item.label}
                    {currentPage === item.id && (
                      <span className="sr-only"> (current page)</span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Sympto Health Assessment Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileNav;