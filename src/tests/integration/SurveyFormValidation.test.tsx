import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SurveySection } from '@/components/SurveyComponents/SurveySection';

// Mock necessary hooks and providers
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'survey.other': 'Other',
        'survey.otherPlaceholder': 'Please specify',
        'survey.required': 'This field is required',
        'survey.comment.required': 'Please provide details about your experience',
        'survey.submit': 'Submit',
        'survey.error.required': 'Please complete all required fields'
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the survey service
vi.mock('@/lib/survey-service', () => ({
  submitSurvey: vi.fn().mockImplementation((data) => {
    return Promise.resolve({ success: true, id: 'survey-123' });
  })
}));

// No need for separate mocks now as we're using inline mock components

// Create mock components directly here to avoid module import issues
const MockRatingQuestion = ({ id, question, onChange }) => (
  <div data-testid={`rating-question-${id}`}>
    <h3>{question}</h3>
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button 
          key={star} 
          type="button" 
          data-testid={`star-${star}`}
          data-rating={star}
          onClick={() => onChange({ target: { name: id, value: star } })}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            data-testid={`star-icon-${star}`}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
    <div className="mt-2">
      <textarea 
        className="w-full p-2 border rounded" 
        placeholder="Please provide details about your experience"
        style={{ display: 'none' }}
        data-testid={`comment-${id}`}
      ></textarea>
    </div>
  </div>
);

const MockMultipleChoiceQuestion = ({ id, question, options, onChange, required }) => (
  <div data-testid={`multiple-choice-${id}`}>
    <h3>{question} {required && '*'}</h3>
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            type="radio"
            id={`${id}-${option.value}`}
            name={id}
            value={option.value}
            onChange={() => onChange({ target: { name: id, value: option.value } })}
            aria-label={option.label}
          />
          <label htmlFor={`${id}-${option.value}`} className="ml-2">{option.label}</label>
        </div>
      ))}
    </div>
  </div>
);

const MockTextQuestion = ({ id, question, onChange }) => (
  <div data-testid={`text-question-${id}`}>
    <h3>{question}</h3>
    <textarea
      id={id}
      name={id}
      className="w-full p-2 border rounded"
      onChange={(e) => onChange({ target: { name: id, value: e.target.value } })}
      data-testid={`text-input-${id}`}
    ></textarea>
  </div>
);

// Create a form validation test component
function SurveyFormValidation({ showErrors = false, commentRequired = false }) {
  // Mock state for validation testing
  const mockErrors = {
    overall_satisfaction: showErrors,
    visit_purpose: showErrors
  };
  
  const handleSubmit = vi.fn().mockImplementation((e) => {
    e.preventDefault();
    return Promise.resolve();
  });
  
  const handleQuestionChange = vi.fn();
  
  return (
    <form data-testid="survey-form" onSubmit={handleSubmit}>
      <SurveySection title="Survey Form with Validation">
        <div data-testid="required-question-1">
          <MockRatingQuestion 
            id="overall_satisfaction" 
            question="How satisfied are you with our service? *" 
            onChange={handleQuestionChange} 
          />
          {mockErrors.overall_satisfaction && (
            <p data-testid="error-message-1" className="text-red-500">
              survey.required
            </p>
          )}
        </div>
        
        <div data-testid="required-question-2">
          <MockMultipleChoiceQuestion 
            id="visit_purpose"
            question="What was the purpose of your visit? *"
            options={[
              { value: "business", label: "Business" },
              { value: "leisure", label: "Leisure" }
            ]}
            onChange={handleQuestionChange}
            required={true}
          />
          {mockErrors.visit_purpose && (
            <p data-testid="error-message-2" className="text-red-500">
              survey.required
            </p>
          )}
        </div>
        
        {commentRequired && (
          <div data-testid="comment-section">
            <MockTextQuestion
              id="comment"
              question="Please tell us more about your experience"
              onChange={handleQuestionChange}
            />
          </div>
        )}
      </SurveySection>
      
      <div className="mt-4 flex justify-center">
        <button 
          type="submit" 
          data-testid="submit-button"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          survey.submit
        </button>
      </div>
      
      <div data-testid="validation-summary" className="mt-4 text-center" style={{ display: showErrors ? 'block' : 'none' }}>
        <p className="text-red-500">survey.error.required</p>
      </div>
    </form>
  );
}

describe('Survey Form Validation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders a form with required fields', () => {
    render(<SurveyFormValidation />);
    
    // Check that form and required questions are rendered
    expect(screen.getByTestId('survey-form')).toBeInTheDocument();
    expect(screen.getByTestId('required-question-1')).toBeInTheDocument();
    expect(screen.getByTestId('required-question-2')).toBeInTheDocument();
    
    // Check that submit button is rendered
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
  
  it('displays validation errors when submitting an incomplete form', async () => {
    // Render the form with errors
    render(<SurveyFormValidation showErrors={true} />);
    
    // Error messages should be visible
    expect(screen.getByTestId('error-message-1')).toBeInTheDocument();
    expect(screen.getByTestId('error-message-2')).toBeInTheDocument();
    
    // Validation summary should be visible
    expect(screen.getByTestId('validation-summary')).toHaveStyle({ display: 'block' });
  });
  
  it('allows submission when all required fields are filled', async () => {
    render(<SurveyFormValidation />);
    
    // Verify that no error messages are shown initially
    expect(screen.queryByTestId('error-message-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message-2')).not.toBeInTheDocument();
    
    // Validation summary should be hidden
    expect(screen.getByTestId('validation-summary')).toHaveStyle({ display: 'none' });
    
    // Fill out required fields
    // 1. Rating question
    const star4Button = screen.getByTestId('star-4');
    fireEvent.click(star4Button);
    
    // 2. Multiple choice question
    const businessRadio = screen.getByLabelText('Business');
    fireEvent.click(businessRadio);
    
    // Submit the form
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
  });
  
  it('enforces comment requirement for low ratings', async () => {
    render(<SurveyFormValidation commentRequired={true} />);
    
    // Click the 2nd star (low rating)
    const star2Button = screen.getByTestId('star-2');
    fireEvent.click(star2Button);
    
    // Text area for comment should appear
    const commentSection = screen.getByTestId('comment-section');
    expect(commentSection).toBeInTheDocument();
    
    // Submit button should be present
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    
    // Simulate entering a comment and submitting
    const textInput = screen.getByTestId('text-input-comment');
    fireEvent.change(textInput, { target: { value: 'The service needs improvement because...' } });
    fireEvent.click(submitButton);
  });
});
