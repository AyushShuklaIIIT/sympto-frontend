import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, ProgressBar } from '../ui';
import SymptomStep from './SymptomStep';
import LifestyleStep from './LifestyleStep';
import LabResultsStep from './LabResultsStep';
import ReviewStep from './ReviewStep';
import './AssessmentWizard.css';

// Assessment validation schema
const assessmentSchema = z.object({
  // Symptoms (ordinal scale 0-3)
  fatigue: z.number().int().min(0).max(3),
  hair_loss: z.number().int().min(0).max(3),
  acidity: z.number().int().min(0).max(3),
  dizziness: z.number().int().min(0).max(3),
  muscle_pain: z.number().int().min(0).max(3),
  numbness: z.number().int().min(0).max(3),
  
  // Lifestyle factors
  vegetarian: z.number().int().min(0).max(1),
  iron_food_freq: z.number().int().min(0).max(3),
  dairy_freq: z.number().int().min(0).max(3),
  sunlight_min: z.number().int().min(0).max(65), // minutes per day
  junk_food_freq: z.number().int().min(0).max(3),
  smoking: z.number().int().min(0).max(1),
  alcohol: z.number().int().min(0).max(1),
  
  // Lab results
  // Require lab values to be provided (non-null) and constrained to expected ranges.
  hemoglobin: z.number().min(7.2).max(16.5), // g/dL
  ferritin: z.number().min(4.5).max(165), // ng/mL
  vitamin_b12: z.number().min(108).max(550), // pg/mL
  vitamin_d: z.number().min(4.5).max(49.5), // ng/mL
  calcium: z.number().min(6.75).max(11.22), // mg/dL
});

const STEPS = [
  { id: 'symptoms', title: 'Symptoms', component: SymptomStep },
  { id: 'lifestyle', title: 'Lifestyle', component: LifestyleStep },
  { id: 'lab-results', title: 'Lab Results', component: LabResultsStep },
  { id: 'review', title: 'Review', component: ReviewStep },
];

const AssessmentWizard = ({ onSubmit, initialData = null }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepContentRef = useRef(null);
  const [announceMessage, setAnnounceMessage] = useState('');
  const hasLoadedDraftRef = useRef(false);

  const getStepFields = useCallback((stepIndex) => {
    switch (stepIndex) {
      case 0: // Symptoms
        return ['fatigue', 'hair_loss', 'acidity', 'dizziness', 'muscle_pain', 'numbness'];
      case 1: // Lifestyle
        return ['vegetarian', 'iron_food_freq', 'dairy_freq', 'sunlight_min', 'junk_food_freq', 'smoking', 'alcohol'];
      case 2: // Lab Results
        return ['hemoglobin', 'ferritin', 'vitamin_b12', 'vitamin_d', 'calcium'];
      case 3: // Review
        return Object.keys(assessmentSchema.shape);
      default:
        return [];
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      // Symptoms defaults
      fatigue: undefined,
      hair_loss: undefined,
      acidity: undefined,
      dizziness: undefined,
      muscle_pain: undefined,
      numbness: undefined,
      
      // Lifestyle defaults
      vegetarian: undefined,
      iron_food_freq: undefined,
      dairy_freq: undefined,
      sunlight_min: undefined,
      junk_food_freq: undefined,
      smoking: undefined,
      alcohol: undefined,
      
      // Lab results defaults
      hemoglobin: undefined,
      ferritin: undefined,
      vitamin_b12: undefined,
      vitamin_d: undefined,
      calcium: undefined,
      
      ...(initialData ?? undefined),
    },
    mode: 'onChange',
  });

  const { watch, trigger, getValues, formState: { errors, isValid } } = form;
  const watchedValues = watch();

  // Validate the active step on entry so navigation buttons reflect required fields immediately.
  useEffect(() => {
    const stepFields = getStepFields(currentStep);
    if (stepFields.length > 0) {
      trigger(stepFields);
    }
  }, [currentStep, getStepFields, trigger]);

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      const currentData = getValues();
      localStorage.setItem('sympto-draft-assessment', JSON.stringify(currentData));
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [watchedValues, getValues]);

  // Load draft on mount
  useEffect(() => {
    if (hasLoadedDraftRef.current) return;

    const savedDraft = localStorage.getItem('sympto-draft-assessment');
    if (savedDraft && !initialData?.id) {
      try {
        const draftData = JSON.parse(savedDraft);
        const sanitizedDraft = { ...draftData };
        // Older drafts used 0 as a placeholder for lab results; treat those as missing now.
        for (const key of ['hemoglobin', 'ferritin', 'vitamin_b12', 'vitamin_d', 'calcium']) {
          if (sanitizedDraft[key] === 0) sanitizedDraft[key] = undefined;
        }
        form.reset(sanitizedDraft);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }

    hasLoadedDraftRef.current = true;
  }, [form, initialData?.id]);

  const handleNext = async () => {
    const stepFields = getStepFields(currentStep);
    const isStepValid = await trigger(stepFields);
    
    if (isStepValid) {
      const newStep = Math.min(currentStep + 1, STEPS.length - 1);
      setCurrentStep(newStep);
      
      // Announce step change to screen readers
      setAnnounceMessage(`Moved to ${STEPS[newStep].title} step`);
      
      // Focus management - focus the step content
      setTimeout(() => {
        if (stepContentRef.current) {
          stepContentRef.current.focus();
        }
      }, 100);
    } else {
      // Announce validation errors
      setAnnounceMessage('Please complete all required fields before proceeding');
    }
  };

  const handlePrevious = () => {
    const newStep = Math.max(currentStep - 1, 0);
    setCurrentStep(newStep);
    
    // Announce step change to screen readers
    setAnnounceMessage(`Moved back to ${STEPS[newStep].title} step`);
    
    // Focus management
    setTimeout(() => {
      if (stepContentRef.current) {
        stepContentRef.current.focus();
      }
    }, 100);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      // Clear draft after successful submission
      localStorage.removeItem('sympto-draft-assessment');
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepComplete = (stepIndex) => {
    const stepFields = getStepFields(stepIndex);
    return stepFields.every(field => !errors[field]);
  };

  const getCurrentStepComponent = () => {
    const StepComponent = STEPS[currentStep].component;
    return <StepComponent form={form} />;
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 assessment-wizard">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#assessment-form" 
        className="skip-link"
      >
        Skip to assessment form
      </a>
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Health Assessment
        </h1>
        <p className="text-gray-600 mb-6">
          Complete this comprehensive assessment to receive personalized health insights.
        </p>
        
        {/* Progress Bar */}
        <div aria-label="Assessment progress">
          <ProgressBar 
            value={progress} 
            showLabel 
            label={`Step ${currentStep + 1} of ${STEPS.length}: ${STEPS[currentStep].title}`}
            className="mb-6"
          />
        </div>
        
        {/* Step Navigation */}
        <nav aria-label="Assessment steps" className="mb-8">
          <ol className="flex justify-between items-center">
            {STEPS.map((step, index) => (
              <li 
                key={step.id}
                className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index < currentStep ? 'step-indicator-completed' : 
                      index === currentStep ? 'step-indicator-current' : 
                      'step-indicator-inactive'}
                  `}
                  aria-label={
                    index < currentStep 
                      ? `Step ${index + 1}: ${step.title} - Completed`
                      : index === currentStep 
                        ? `Step ${index + 1}: ${step.title} - Current step`
                        : `Step ${index + 1}: ${step.title} - Not started`
                  }
                >
                  <span aria-hidden="true">
                    {index < currentStep ? '✓' : index + 1}
                  </span>
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                  <span className="sr-only">
                    {index < currentStep && ' (completed)'}
                    {index === currentStep && ' (current)'}
                    {index > currentStep && ' (upcoming)'}
                  </span>
                </span>
                {index < STEPS.length - 1 && (
                  <hr 
                    className={`flex-1 h-0.5 mx-4 border-0 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {/* Step Content */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" id="assessment-form">
        <main 
          ref={stepContentRef}
          className="glass-panel rounded-lg shadow-sm p-6 min-h-[400px] step-content"
          role="main"
          aria-live="polite"
          aria-label={`${STEPS[currentStep].title} step`}
          tabIndex="-1"
        >
          {getCurrentStepComponent()}
        </main>

        {/* Screen reader announcements */}
        <output 
          className="sr-only" 
          aria-live="assertive" 
          aria-atomic="true"
        >
          {announceMessage}
        </output>

        {/* Auto-save status - announced to screen readers */}
        <output 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        >
          Your progress is being automatically saved
        </output>

        {/* Navigation Buttons */}
        <nav className="flex justify-between items-center pt-6" aria-label="Step navigation">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            aria-label={currentStep === 0 ? "Previous step (unavailable - first step)" : "Go to previous step"}
          >
            Previous
          </Button>

          <div className="text-sm text-gray-500" aria-hidden="true">
            Auto-saving your progress...
          </div>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
              aria-label={
                isStepComplete(currentStep) 
                  ? `Go to next step: ${STEPS[currentStep + 1].title}`
                  : "Next step (complete current step first)"
              }
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              aria-label={
                isValid && !isSubmitting
                  ? "Submit completed assessment"
                  : isSubmitting 
                    ? "Submitting assessment..."
                    : "Submit assessment (complete all required fields first)"
              }
            >
              Submit Assessment
            </Button>
          )}
        </nav>
      </form>
    </div>
  );
};

export default AssessmentWizard;