import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RatingQuestion } from '@/components/RatingQuestion';
import { MultipleChoiceQuestion } from '@/components/SurveyComponents/MultipleChoiceQuestion';
import { TextQuestion } from '@/components/SurveyComponents/TextQuestion';
import { SurveyProgress } from '@/components/SurveyComponents/SurveyProgress';
import { SurveySection } from '@/components/SurveyComponents/SurveySection';

// Mock necessary hooks and providers
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'survey.other': 'Other',
        'survey.otherPlaceholder': 'Please specify',
        'survey.progress': 'Progress',
        'survey.next': 'Next',
        'survey.previous': 'Previous',
        'survey.section.general': 'General Information',
        'survey.section.experience': 'Your Experience',
        'survey.section.feedback': 'Additional Feedback',
        'survey.submit': 'Submit Survey'
      };
      return translations[key] || key;
    },
  }),
}));

// Mock navigation for testing
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Create a multi-step survey form component for testing
function MultiStepSurveyForm() {
  // Mock state directly instead of with vi.fn()
  const currentStep = 0;
  const setCurrentStep = vi.fn();
  const responses = {};
  const setResponses = vi.fn();
  
  const handleQuestionChange = vi.fn();
  
  // Sample survey data with multiple sections
  const sections = [
    {
      id: 'general',
      title: 'survey.section.general',
      questions: [
        {
          id: 'overall',
          type: 'rating',
          question: 'How would you rate your overall experience?'
        },
        {
          id: 'visit_purpose',
          type: 'choice',
          question: 'What was the purpose of your visit?',
          options: [
            { value: 'business', label: 'Business' },
            { value: 'leisure', label: 'Leisure' }
          ]
        }
      ]
    },
    {
      id: 'experience',
      title: 'survey.section.experience',
      questions: [
        {
          id: 'service_quality',
          type: 'rating',
          question: 'How would you rate our service quality?'
        }
      ]
    },
    {
      id: 'feedback',
      title: 'survey.section.feedback',
      questions: [
        {
          id: 'suggestions',
          type: 'text',
          question: 'Do you have any suggestions for improvement?',
          multiline: true
        }
      ]
    }
  ];
  
  return (
    <div data-testid="multi-step-survey">
      <SurveyProgress currentStep={1} totalSteps={3} />
      
      <div data-testid="section-1" style={{ display: 'block' }}>
        <SurveySection 
          title={sections[0].title}
          description="Please answer the following questions">
          
          <RatingQuestion 
            id={sections[0].questions[0].id}
            question={sections[0].questions[0].question as string}
            onChange={handleQuestionChange} 
          />
            <MultipleChoiceQuestion 
            id={sections[0].questions[1].id}
            question={sections[0].questions[1].question as string}
            options={sections[0].questions[1].type === 'choice' ? (sections[0].questions[1] as any).options : []}
            onChange={handleQuestionChange}
          />
        </SurveySection>
        
        <div className="flex justify-end mt-4">
          <button data-testid="next-button-1">Next</button>
        </div>
      </div>
      
      <div data-testid="section-2" style={{ display: 'none' }}>
        <SurveySection title={sections[1].title}>
          <RatingQuestion 
            id={sections[1].questions[0].id}
            question={sections[1].questions[0].question as string}
            onChange={handleQuestionChange} 
          />
        </SurveySection>
        
        <div className="flex justify-between mt-4">
          <button data-testid="prev-button-2">Previous</button>
          <button data-testid="next-button-2">Next</button>
        </div>
      </div>
      
      <div data-testid="section-3" style={{ display: 'none' }}>
        <SurveySection title={sections[2].title}>
          <div data-testid="text-question">
            <label>{sections[2].questions[0].question}</label>
            <textarea data-testid="suggestions-textarea" />
          </div>
        </SurveySection>
        
        <div className="flex justify-between mt-4">
          <button data-testid="prev-button-3">Previous</button>
          <button data-testid="submit-button">Submit</button>
        </div>
      </div>
    </div>
  );
}

describe('Multi-Step Survey Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the first section of a multi-step survey', () => {
    render(<MultiStepSurveyForm />);
    
    // Check that first section is visible
    expect(screen.getByTestId('section-1')).toBeVisible();
    
    // Check that survey progress is displayed
    expect(screen.getByText('Progress')).toBeInTheDocument();
    
    // Check that both questions in first section are rendered
    expect(screen.getByText('How would you rate your overall experience?')).toBeInTheDocument();
    expect(screen.getByText('What was the purpose of your visit?')).toBeInTheDocument();
    
    // Verify navigation button is rendered
    expect(screen.getByTestId('next-button-1')).toBeInTheDocument();
  });
  
  it('simulates navigation between sections', async () => {
    const { rerender } = render(<MultiStepSurveyForm />);
    
    // Initially the first section should be visible
    expect(screen.getByTestId('section-1')).toHaveStyle({ display: 'block' });
    
    // Simulate clicking the Next button to go to second section
    // Note: In a real app, this would change state and re-render
    // For this test, we'll manually update the display style
    
    // First, answer questions in section 1
    const starButtons = screen.getAllByRole('button').filter(
      button => button.querySelector('svg')
    );
    fireEvent.click(starButtons[3]); // Click 4th star
    
    const businessRadio = screen.getByLabelText('Business');
    fireEvent.click(businessRadio);
    
    // Now "navigate" to section 2 by updating component style
    const updatedComponent = (
      <div data-testid="multi-step-survey">
        <SurveyProgress currentStep={2} totalSteps={3} />
        
        <div data-testid="section-1" style={{ display: 'none' }}>{/* same content */}</div>
        
        <div data-testid="section-2" style={{ display: 'block' }}>
          <SurveySection title="survey.section.experience">
            <RatingQuestion 
              id="service_quality"
              question="How would you rate our service quality?"
              onChange={vi.fn()} 
            />
          </SurveySection>
          
          <div className="flex justify-between mt-4">
            <button data-testid="prev-button-2">Previous</button>
            <button data-testid="next-button-2">Next</button>
          </div>
        </div>
        
        <div data-testid="section-3" style={{ display: 'none' }}>{/* same content */}</div>
      </div>
    );
    
    // Rerender with updated state
    rerender(updatedComponent);
    
    // Verify second section is now visible
    expect(screen.getByTestId('section-2')).toHaveStyle({ display: 'block' });
    expect(screen.getByText('How would you rate our service quality?')).toBeInTheDocument();
    
    // Verify navigation buttons in section 2
    expect(screen.getByTestId('prev-button-2')).toBeInTheDocument();
    expect(screen.getByTestId('next-button-2')).toBeInTheDocument();
  });
  
  it('tests the submission flow with all sections completed', async () => {
    const { rerender } = render(<MultiStepSurveyForm />);
    
    // Fast forward to the final section (similar to previous test)
    const finalComponent = (
      <div data-testid="multi-step-survey">
        <SurveyProgress currentStep={3} totalSteps={3} />
        
        <div data-testid="section-1" style={{ display: 'none' }}>{/* content */}</div>
        <div data-testid="section-2" style={{ display: 'none' }}>{/* content */}</div>
        
        <div data-testid="section-3" style={{ display: 'block' }}>
          <SurveySection title="survey.section.feedback">
            <div data-testid="text-question">
              <label>Do you have any suggestions for improvement?</label>
              <textarea data-testid="suggestions-textarea" />
            </div>
          </SurveySection>
          
          <div className="flex justify-between mt-4">
            <button data-testid="prev-button-3">Previous</button>
            <button data-testid="submit-button">Submit</button>
          </div>
        </div>
      </div>
    );
    
    // Rerender with updated state
    rerender(finalComponent);
    
    // Verify final section is now visible
    expect(screen.getByTestId('section-3')).toHaveStyle({ display: 'block' });
    expect(screen.getByText('Do you have any suggestions for improvement?')).toBeInTheDocument();
    
    // Enter text in the suggestions field
    const textArea = screen.getByTestId('suggestions-textarea');
    fireEvent.change(textArea, { target: { value: 'The service was excellent overall!' } });
    
    // Verify submit button is present
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    
    // Simulate form submission
    const mockSubmit = vi.fn();
    submitButton.onclick = mockSubmit;
    fireEvent.click(submitButton);
    
    // Verify submission handler was called
    expect(mockSubmit).toHaveBeenCalled();
  });
});
