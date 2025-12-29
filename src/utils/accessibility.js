/**
 * Accessibility Testing and Validation Utilities
 * Provides runtime accessibility checks and improvements
 */

/**
 * Check if an element has proper ARIA labeling
 */
export const hasAccessibleName = (element) => {
  if (!element) return false;
  
  return !!(
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent?.trim() ||
    element.getAttribute('title') ||
    element.getAttribute('alt')
  );
};

/**
 * Check if interactive elements have proper focus management
 */
export const hasFocusManagement = (element) => {
  if (!element) return false;
  
  const interactiveElements = ['button', 'input', 'select', 'textarea', 'a'];
  const isInteractive = interactiveElements.includes(element.tagName.toLowerCase()) ||
                       element.getAttribute('role') === 'button' ||
                       element.getAttribute('tabindex') !== null;
  
  if (!isInteractive) return true; // Non-interactive elements don't need focus management
  
  return element.tabIndex >= 0; // Can receive focus
};

/**
 * Check color contrast ratio (simplified check)
 */
export const hasGoodContrast = (element) => {
  if (!element) return false;
  
  const styles = window.getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  const color = styles.color;
  
  // This is a simplified check - in production, you'd use a proper contrast calculation
  return backgroundColor !== color && 
         backgroundColor !== 'transparent' && 
         color !== 'transparent';
};

/**
 * Check if form elements have proper labels
 */
export const hasFormLabeling = (formElement) => {
  if (!formElement) return false;
  
  const formInputs = ['input', 'select', 'textarea'];
  if (!formInputs.includes(formElement.tagName.toLowerCase())) return true;
  
  const id = formElement.id;
  const hasLabel = id && document.querySelector(`label[for="${id}"]`);
  const hasAriaLabel = formElement.getAttribute('aria-label');
  const hasAriaLabelledby = formElement.getAttribute('aria-labelledby');
  
  return !!(hasLabel || hasAriaLabel || hasAriaLabelledby);
};

/**
 * Check if images have alt text
 */
export const hasImageAltText = (imgElement) => {
  if (!imgElement || imgElement.tagName.toLowerCase() !== 'img') return true;
  
  const alt = imgElement.getAttribute('alt');
  const role = imgElement.getAttribute('role');
  
  // Images with role="presentation" or empty alt are decorative
  return alt !== null || role === 'presentation';
};

/**
 * Validate heading hierarchy
 */
export const validateHeadingHierarchy = (container = document) => {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const issues = [];
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (index === 0 && level !== 1) {
      issues.push(`First heading should be h1, found ${heading.tagName.toLowerCase()}`);
    }
    
    if (level > previousLevel + 1) {
      issues.push(`Heading level skipped: ${heading.tagName.toLowerCase()} follows h${previousLevel}`);
    }
    
    previousLevel = level;
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
};

/**
 * Check for keyboard navigation support
 */
export const checkKeyboardNavigation = (container = document) => {
  const interactiveElements = container.querySelectorAll(
    'button, input, select, textarea, a[href], [tabindex], [role="button"], [role="link"]'
  );
  
  const issues = [];
  
  interactiveElements.forEach(element => {
    if (element.tabIndex < 0 && !element.disabled) {
      issues.push(`Element ${element.tagName.toLowerCase()} is not keyboard accessible`);
    }
    
    if (!hasAccessibleName(element)) {
      issues.push(`Element ${element.tagName.toLowerCase()} lacks accessible name`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
    totalElements: interactiveElements.length
  };
};

/**
 * Check for ARIA live regions
 */
export const checkLiveRegions = (container = document) => {
  const liveRegions = container.querySelectorAll('[aria-live]');
  const statusElements = container.querySelectorAll('[role="status"], [role="alert"]');
  
  return {
    liveRegions: liveRegions.length,
    statusElements: statusElements.length,
    hasLiveRegions: liveRegions.length > 0 || statusElements.length > 0
  };
};

/**
 * Comprehensive accessibility audit
 */
export const auditAccessibility = (container = document) => {
  const results = {
    timestamp: new Date().toISOString(),
    container: container === document ? 'document' : 'container',
    checks: {}
  };
  
  // Heading hierarchy
  results.checks.headingHierarchy = validateHeadingHierarchy(container);
  
  // Keyboard navigation
  results.checks.keyboardNavigation = checkKeyboardNavigation(container);
  
  // Live regions
  results.checks.liveRegions = checkLiveRegions(container);
  
  // Form labeling
  const formElements = container.querySelectorAll('input, select, textarea');
  const formIssues = [];
  formElements.forEach(element => {
    if (!hasFormLabeling(element)) {
      formIssues.push(`Form element ${element.tagName.toLowerCase()} lacks proper labeling`);
    }
  });
  
  results.checks.formLabeling = {
    valid: formIssues.length === 0,
    issues: formIssues,
    totalElements: formElements.length
  };
  
  // Image alt text
  const images = container.querySelectorAll('img');
  const imageIssues = [];
  images.forEach(img => {
    if (!hasImageAltText(img)) {
      imageIssues.push(`Image lacks alt text: ${img.src || 'unknown source'}`);
    }
  });
  
  results.checks.imageAltText = {
    valid: imageIssues.length === 0,
    issues: imageIssues,
    totalElements: images.length
  };
  
  // Overall score
  const totalChecks = Object.keys(results.checks).length;
  const passedChecks = Object.values(results.checks).filter(check => check.valid).length;
  results.score = Math.round((passedChecks / totalChecks) * 100);
  
  return results;
};

/**
 * Add focus indicators for keyboard users
 */
export const enhanceFocusIndicators = () => {
  // Add keyboard user detection
  let isKeyboardUser = false;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isKeyboardUser = true;
      document.body.classList.add('keyboard-user');
    }
  });
  
  document.addEventListener('mousedown', () => {
    isKeyboardUser = false;
    document.body.classList.remove('keyboard-user');
  });
};

/**
 * Announce messages to screen readers
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Manage focus for single-page applications
 */
export const manageFocus = (targetElement, options = {}) => {
  const { 
    preventScroll = false, 
    announceChange = true,
    restoreFocus = false 
  } = options;
  
  if (restoreFocus) {
    const previousFocus = document.activeElement;
    
    // Store previous focus for restoration
    targetElement.setAttribute('data-previous-focus', 'true');
    
    // Restore focus when element is removed or hidden
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && 
            !document.contains(targetElement)) {
          previousFocus?.focus();
          observer.disconnect();
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // Focus the target element
  if (targetElement) {
    targetElement.focus({ preventScroll });
    
    if (announceChange) {
      const label = targetElement.getAttribute('aria-label') || 
                   targetElement.textContent?.trim() || 
                   'Content updated';
      announceToScreenReader(`Focused on ${label}`);
    }
  }
};

/**
 * Initialize accessibility enhancements
 */
export const initializeAccessibility = () => {
  enhanceFocusIndicators();
  
  // Add skip links if they don't exist
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  // Ensure main content has proper landmark
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }
  
  console.log('Accessibility enhancements initialized');
};

export default {
  hasAccessibleName,
  hasFocusManagement,
  hasGoodContrast,
  hasFormLabeling,
  hasImageAltText,
  validateHeadingHierarchy,
  checkKeyboardNavigation,
  checkLiveRegions,
  auditAccessibility,
  enhanceFocusIndicators,
  announceToScreenReader,
  manageFocus,
  initializeAccessibility
};