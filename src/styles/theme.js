// Sympto Design System Theme Configuration
export const theme = {
  // Healthcare-focused color palette
  colors: {
    // Primary brand colors - calming blues for trust and reliability
    primary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4', // Main brand color
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    
    // Health-specific semantic colors
    health: {
      // Mint green for wellness and vitality
      mint: '#10b981',
      mintLight: '#6ee7b7',
      mintDark: '#047857',
      
      // Sage for balance and calm
      sage: '#6b7280',
      sageLight: '#9ca3af',
      sageDark: '#374151',
      
      // Ocean blue for depth and trust
      ocean: '#06b6d4',
      oceanLight: '#22d3ee',
      oceanDark: '#0891b2',
      
      // Lavender for care and comfort
      lavender: '#8b5cf6',
      lavenderLight: '#a78bfa',
      lavenderDark: '#7c3aed',
      
      // Coral for energy and warmth
      coral: '#f97316',
      coralLight: '#fb923c',
      coralDark: '#ea580c',
    },
    
    // Status colors for health indicators
    status: {
      excellent: '#10b981', // Green
      good: '#84cc16',      // Light green
      fair: '#f59e0b',      // Amber
      poor: '#ef4444',      // Red
      critical: '#dc2626',  // Dark red
    },
    
    // Neutral grays for text and backgrounds
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },

  // Typography system
  typography: {
    fontFamily: {
      display: ['Poppins', 'system-ui', 'sans-serif'], // For headings and branding
      body: ['Inter', 'system-ui', 'sans-serif'],      // For body text
      mono: ['ui-monospace', 'SFMono-Regular', 'monospace'], // For code/data
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },

  // Spacing system (based on 4px grid)
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
  },

  // Border radius for healthcare-friendly rounded corners
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadow system for depth and elevation
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Healthcare-specific shadows
    soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    health: '0 10px 25px -5px rgba(6, 182, 212, 0.12), 0 4px 10px -2px rgba(6, 182, 212, 0.06)',
    glow: '0 0 20px rgba(6, 182, 212, 0.16)',
  },

  // Animation and transitions
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // Breakpoints for responsive design
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Component-specific design tokens
  components: {
    button: {
      height: {
        sm: '2rem',    // 32px
        md: '2.5rem',  // 40px
        lg: '3rem',    // 48px
      },
      padding: {
        sm: '0.5rem 0.75rem',  // 8px 12px
        md: '0.75rem 1rem',    // 12px 16px
        lg: '1rem 1.5rem',     // 16px 24px
      }
    },
    
    input: {
      height: {
        sm: '2rem',    // 32px
        md: '2.5rem',  // 40px
        lg: '3rem',    // 48px
      }
    },
    
    card: {
      padding: {
        sm: '1rem',     // 16px
        md: '1.5rem',   // 24px
        lg: '2rem',     // 32px
      }
    }
  }
};

// Utility functions for theme usage
export const getColor = (colorPath) => {
  const keys = colorPath.split('.');
  let value = theme.colors;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return null;
  }
  
  return value;
};

export const getSpacing = (size) => theme.spacing[size] || size;
export const getFontSize = (size) => theme.typography.fontSize[size] || size;
export const getShadow = (size) => theme.boxShadow[size] || size;

export default theme;