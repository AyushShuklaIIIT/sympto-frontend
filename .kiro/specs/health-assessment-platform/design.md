# Design Document: Health Assessment Platform (Sympto)

## Overview

Sympto is a React-based web application with a Node.js backend that collects comprehensive health data from users and provides AI-powered health insights. The platform features a multi-step assessment form, user authentication, assessment history tracking, and a responsive design optimized for healthcare data collection.

The system architecture follows a client-server model with React handling the user interface and form management, Node.js/Express managing the API and business logic, and integration with external AI services for health analysis.

## Architecture

### Frontend Architecture (React)
- **Component Structure**: Modular React components with clear separation of concerns
- **State Management**: React Context API for global state (user authentication, assessment data)
- **Form Management**: React Hook Form with Zod validation for complex multi-step forms
- **Routing**: React Router for navigation between authentication, assessment, and dashboard pages
- **Styling**: CSS modules with healthcare-focused design system

### Backend Architecture (Node.js)
- **API Framework**: Express.js with RESTful endpoints
- **Database**: MongoDB for user data and assessment storage
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **AI Integration**: HTTP client for external AI model communication
- **Middleware**: CORS, rate limiting, input validation, and error handling

### Data Flow
1. User completes multi-step assessment form
2. Frontend validates and temporarily stores form data
3. On submission, data is sent to Node.js API
4. Backend validates, stores assessment, and forwards to AI model
5. AI response is processed and stored with assessment
6. Results are returned to frontend for display

## Components and Interfaces

### Frontend Components

#### Authentication Components
- **LoginForm**: Email/password login with validation
- **RegisterForm**: User registration with email verification
- **PasswordReset**: Password reset functionality
- **AuthGuard**: Route protection for authenticated users

#### Assessment Components
- **AssessmentWizard**: Multi-step form container with progress tracking
- **SymptomStep**: Collects symptom data (fatigue, hair_loss, acidity, dizziness, muscle_pain, numbness)
- **LifestyleStep**: Collects lifestyle data (vegetarian, iron_food_freq, dairy_freq, sunlight_min, junk_food_freq, smoking, alcohol)
- **LabResultsStep**: Collects lab values (hemoglobin, ferritin, vitamin_b12, vitamin_d, calcium)
- **ReviewStep**: Final review before submission
- **FormField**: Reusable input component with validation

#### Dashboard Components
- **AssessmentHistory**: List of previous assessments
- **AssessmentComparison**: Side-by-side comparison of assessments
- **ResultsDisplay**: AI insights and recommendations display
- **ExportData**: Assessment data export functionality

#### UI Components
- **Header**: Navigation with logo and user menu
- **Footer**: Links and company information
- **LoadingSpinner**: Loading states for async operations
- **ErrorBoundary**: Error handling and display

### Backend API Endpoints

#### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
POST /api/auth/forgot-password - Password reset request
POST /api/auth/reset-password - Password reset confirmation
GET /api/auth/verify-email - Email verification
```

#### Assessment Endpoints
```
POST /api/assessments - Create new assessment
GET /api/assessments - Get user's assessment history
GET /api/assessments/:id - Get specific assessment
DELETE /api/assessments/:id - Delete assessment
POST /api/assessments/:id/analyze - Trigger AI analysis
```

#### User Endpoints
```
GET /api/users/profile - Get user profile
PUT /api/users/profile - Update user profile
DELETE /api/users/account - Delete user account
GET /api/users/export - Export user data
```

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  dateOfBirth: Date,
  emailVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Assessment Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  
  // Symptoms (scale 1-5 or boolean)
  fatigue: Number,
  hair_loss: Boolean,
  acidity: Number,
  dizziness: Number,
  muscle_pain: Number,
  numbness: Number,
  
  // Lifestyle factors
  vegetarian: Boolean,
  iron_food_freq: Number, // times per week
  dairy_freq: Number, // times per week
  sunlight_min: Number, // minutes per day
  junk_food_freq: Number, // times per week
  smoking: Boolean,
  alcohol: Number, // units per week
  
  // Lab results
  hemoglobin: Number, // g/dL
  ferritin: Number, // ng/mL
  vitamin_b12: Number, // pg/mL
  vitamin_d: Number, // ng/mL
  calcium: Number, // mg/dL
  
  // AI Analysis
  aiAnalysis: {
    insights: String,
    recommendations: [String],
    riskFactors: [String],
    confidence: Number,
    processedAt: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### AI Integration Schema
```javascript
// Request to AI Model
{
  symptoms: {
    fatigue: Number,
    hair_loss: Boolean,
    acidity: Number,
    dizziness: Number,
    muscle_pain: Number,
    numbness: Number
  },
  lifestyle: {
    vegetarian: Boolean,
    iron_food_freq: Number,
    dairy_freq: Number,
    sunlight_min: Number,
    junk_food_freq: Number,
    smoking: Boolean,
    alcohol: Number
  },
  labResults: {
    hemoglobin: Number,
    ferritin: Number,
    vitamin_b12: Number,
    vitamin_d: Number,
    calcium: Number
  }
}

// Response from AI Model
{
  insights: String,
  recommendations: Array<String>,
  riskFactors: Array<String>,
  confidence: Number (0-1),
  metadata: {
    modelVersion: String,
    processedAt: String
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: User Registration Creates Valid Accounts
*For any* valid user registration data (email, password, firstName, lastName), submitting the registration should create a user account in the database with the provided information and proper security measures applied.
**Validates: Requirements 1.1**

### Property 2: Valid Credentials Grant Authentication
*For any* existing user account, providing correct login credentials should result in successful authentication and return valid access tokens.
**Validates: Requirements 1.2**

### Property 3: Invalid Credentials Are Rejected
*For any* invalid login credentials (wrong password, non-existent email, malformed input), the authentication attempt should be rejected with appropriate error messages.
**Validates: Requirements 1.3**

### Property 4: Email Verification Required for New Accounts
*For any* newly created user account, the account should require email verification before granting full access to the platform.
**Validates: Requirements 1.4**

### Property 5: Password Reset Workflow Functions
*For any* valid user email, requesting a password reset should initiate the proper email workflow and allow password changes.
**Validates: Requirements 1.5**

### Property 6: Assessment Form Contains All Required Fields
*For any* assessment form instance, it should contain all 18 required health parameters with appropriate input types and validation rules.
**Validates: Requirements 2.1**

### Property 7: Incomplete Forms Prevent Submission
*For any* assessment form with missing required fields, submission should be prevented and missing fields should be highlighted with error messages.
**Validates: Requirements 2.2**

### Property 8: Invalid Input Formats Are Rejected
*For any* health parameter field, entering invalid data formats should trigger validation errors with clear error messages.
**Validates: Requirements 2.3**

### Property 9: Form Fields Have Proper Labels and Help Text
*For any* health parameter field in the assessment form, it should have clear labels and helpful explanatory text.
**Validates: Requirements 2.4**

### Property 10: Draft Assessment Auto-Save
*For any* partially completed assessment form, the data should be automatically saved and restorable to prevent data loss.
**Validates: Requirements 2.5**

### Property 11: Complete Assessments Trigger AI Analysis
*For any* complete assessment submission, the system should format and send the data to the AI model for analysis.
**Validates: Requirements 3.1**

### Property 12: AI Results Are Displayed to Users
*For any* valid AI model response, the insights and recommendations should be properly formatted and displayed to the user.
**Validates: Requirements 3.2**

### Property 13: AI Service Unavailability Handling
*For any* AI service unavailability scenario, the system should queue the request and notify the user appropriately.
**Validates: Requirements 3.3**

### Property 14: AI Model Error Handling
*For any* AI model error response, the system should handle it gracefully and provide meaningful feedback to users.
**Validates: Requirements 3.4**

### Property 15: AI Response Validation
*For any* AI model response, the system should validate the response format and content before displaying to users.
**Validates: Requirements 3.5**

### Property 16: Assessment Storage with Timestamps
*For any* completed assessment, it should be stored in the database with accurate timestamps and proper user association.
**Validates: Requirements 4.1**

### Property 17: Dashboard Displays Assessment History
*For any* user with assessment history, accessing the dashboard should display all their previous assessments in chronological order.
**Validates: Requirements 4.2**

### Property 18: Assessment Comparison Functionality
*For any* two or more user assessments, the system should provide comparison views showing differences between assessment dates.
**Validates: Requirements 4.3**

### Property 19: Assessment Data Export
*For any* user with assessment data, they should be able to export their complete assessment history in a structured format.
**Validates: Requirements 4.4**

### Property 20: Assessment History Deletion
*For any* user assessment history, users should be able to delete their assessment data completely from the system.
**Validates: Requirements 4.5**

### Property 21: Logo Presence Across Pages
*For any* page in the application, the Sympto logo should be prominently displayed and visible.
**Validates: Requirements 5.2**

### Property 22: Responsive Design Functionality
*For any* viewport size (desktop, tablet, mobile), the application should render properly and maintain usability.
**Validates: Requirements 5.3**

### Property 23: Visual Feedback for User Interactions
*For any* user interaction (form submission, button clicks, navigation), appropriate visual feedback should be provided.
**Validates: Requirements 5.5**

### Property 24: Data Encryption in Transit and at Rest
*For any* health data transmission or storage, the data should be properly encrypted using industry-standard methods.
**Validates: Requirements 6.1**

### Property 25: Secure Session Management
*For any* user session, proper security measures should be implemented including secure tokens, expiration, and protection against common attacks.
**Validates: Requirements 6.2**

### Property 26: Privacy Policy Accessibility
*For any* user accessing the platform, privacy policy and data usage information should be clearly accessible.
**Validates: Requirements 6.4**

### Property 27: Complete Account Deletion
*For any* user account deletion request, all associated user data should be completely removed from the system.
**Validates: Requirements 6.5**

### Property 28: Page Load Performance
*For any* page request under normal conditions, the page should load within 3 seconds.
**Validates: Requirements 7.1**

### Property 29: Offline Form Completion
*For any* assessment form, users should be able to complete and save forms locally when offline.
**Validates: Requirements 7.3**

### Property 30: Error Handling and Recovery
*For any* system error condition, proper error handling should be implemented with appropriate recovery mechanisms.
**Validates: Requirements 7.4**

## Error Handling

### Frontend Error Handling
- **Form Validation Errors**: Real-time validation with clear error messages
- **Network Errors**: Retry mechanisms and offline capability
- **Authentication Errors**: Proper session management and redirect handling
- **AI Service Errors**: Graceful degradation with user notification
- **Component Errors**: Error boundaries to prevent application crashes

### Backend Error Handling
- **Input Validation**: Comprehensive validation with detailed error responses
- **Database Errors**: Connection handling and transaction rollback
- **AI Integration Errors**: Timeout handling and fallback responses
- **Authentication Errors**: Secure error messages without information leakage
- **Rate Limiting**: Proper HTTP status codes and retry headers

### Error Response Format
```javascript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "User-friendly error message",
    details: {
      field: "Specific field error details"
    },
    timestamp: "2024-01-01T00:00:00Z"
  }
}
```

## Testing Strategy

### Dual Testing Approach
The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs using randomized testing
- Both approaches are complementary and necessary for robust validation

### Property-Based Testing Configuration
- **Testing Library**: fast-check for JavaScript/TypeScript property-based testing
- **Test Iterations**: Minimum 100 iterations per property test to ensure thorough coverage
- **Test Tagging**: Each property test tagged with format: **Feature: health-assessment-platform, Property {number}: {property_text}**
- **Requirements Traceability**: Each test explicitly references the design document property it validates

### Unit Testing Focus Areas
- **Authentication flows**: Login, registration, password reset edge cases
- **Form validation**: Specific validation rules and error conditions
- **API endpoints**: Request/response handling and error scenarios
- **Component rendering**: UI component behavior and user interactions
- **Integration points**: Database operations and AI service communication

### Property Testing Focus Areas
- **Data integrity**: Round-trip testing for data storage and retrieval
- **Input validation**: Comprehensive validation across all possible inputs
- **Security properties**: Authentication and authorization across user scenarios
- **Performance properties**: Response time validation under various conditions
- **Error handling**: Graceful degradation across all error scenarios

### Test Environment Setup
- **Frontend Testing**: Jest + React Testing Library + fast-check
- **Backend Testing**: Jest + Supertest + MongoDB Memory Server + fast-check
- **Integration Testing**: Cypress for end-to-end user workflows
- **Performance Testing**: Lighthouse CI for performance regression detection