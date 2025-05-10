import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SurveySection } from '@/components/SurveyComponents/SurveySection';
import { RatingQuestion } from '@/components/RatingQuestion';
import { MultipleChoiceQuestion } from '@/components/SurveyComponents/MultipleChoiceQuestion';
import { TextQuestion } from '@/components/SurveyComponents/TextQuestion';
import { SurveyProgress } from '@/components/SurveyComponents/SurveyProgress';

// Mock necessary hooks and providers
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

// Sample survey data
const surveyComponents = [
  {
    type: 'rating',
    id: 'satisfaction',
    question: 'How satisfied are you with our service?',
  },
  {
    type: 'multiple-choice',
    id: 'purpose',
    question: 'What was the purpose of your visit?',
    options: [
      { value: 'business', label: 'Business' },
      { value: 'leisure', label: 'Leisure' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    type: 'text',
    id: 'feedback',
    question: 'Do you have any additional feedback?',
  },
];

/**
 * Smoke tests quickly verify that the core components of the application render
 * without crashing. These tests don't validate functionality in depth but ensure
 * the basic rendering works.
 */
describe('Survey Components Smoke Tests', () => {
  it('SurveySection renders without crashing', () => {
    render(<SurveySection title="Test Section">Test content</SurveySection>);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('RatingQuestion renders without crashing', () => {
    render(
      <RatingQuestion
        id="test_rating"
        question="How would you rate this?"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('How would you rate this?')).toBeInTheDocument();
    // Check that stars are rendered
    const stars = screen.getAllByRole('button');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('MultipleChoiceQuestion renders without crashing', () => {
    render(
      <MultipleChoiceQuestion
        id="test_choice"
        question="Select an option"
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ]}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('TextQuestion renders without crashing', () => {
    render(
      <TextQuestion
        id="test_text"
        question="Enter your feedback"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('Enter your feedback')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('SurveyProgress renders without crashing', () => {
    render(<SurveyProgress currentStep={2} totalSteps={5} />);
    // The progress component should be in the document
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

/**
 * Basic flow test to ensure components work together
 */
describe('Survey Basic Flow Test', () => {
  it('renders a complete survey flow without crashing', async () => {    const SurveyFlow = () => {
      // Use fixed values instead of React hooks
      const currentStep = 0;
      const setCurrentStep = vi.fn();
      const formData = {};
      const setFormData = vi.fn();
      
      return (
        <div data-testid="survey-flow">
          <SurveyProgress currentStep={currentStep + 1} totalSteps={surveyComponents.length} />
          
          <SurveySection title="Survey Test">            {currentStep === 0 ? (
              <RatingQuestion
                id={surveyComponents[0].id}
                question={surveyComponents[0].question}
                onChange={setFormData}
              />
            ) : currentStep === 1 ? (
              <MultipleChoiceQuestion
                id={surveyComponents[1].id}
                question={surveyComponents[1].question}
                options={surveyComponents[1].options}
                onChange={setFormData}
              />
            ) : currentStep === 2 ? (
              <TextQuestion
                id={surveyComponents[2].id}
                question={surveyComponents[2].question}
                onChange={setFormData}
              />
            ) : null}
          </SurveySection>
          
          <div className="flex justify-between mt-4">
            <button 
              data-testid="prev-button" 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </button>
            
            <button 
              data-testid="next-button"
              onClick={() => {
                if (currentStep < surveyComponents.length - 1) {
                  setCurrentStep(currentStep + 1);
                }
              }}
            >
              {currentStep === surveyComponents.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      );
    };
    
    render(<SurveyFlow />);
    
    // Check that survey flow renders correctly
    expect(screen.getByTestId('survey-flow')).toBeInTheDocument();
    
    // Check navigation buttons exist
    expect(screen.getByTestId('prev-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
    
    // First step should have a rating question
    expect(screen.getByText(surveyComponents[0].question)).toBeInTheDocument();
    
    await waitFor(() => {
      // Check progress bar is rendering
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});
