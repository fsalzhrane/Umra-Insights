import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RatingQuestion } from '@/components/RatingQuestion';
import { MultipleChoiceQuestion } from '@/components/SurveyComponents/MultipleChoiceQuestion';
import { SurveyProgress } from '@/components/SurveyComponents/SurveyProgress';
import { SurveySection } from '@/components/SurveyComponents/SurveySection';

// Mock necessary hooks and providers
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => key === 'survey.other' ? 'Other' : 
                         key === 'survey.otherPlaceholder' ? 'Please specify' :
                         key === 'survey.progress' ? 'Progress' : key,
  }),
}));

// Create a basic survey form component for testing
function TestSurveyForm() {
  // Mock state with useState directly instead of with vi.fn()
  const currentStep = 1; 
  const setCurrentStep = vi.fn();
  const responses = {};
  const setResponses = vi.fn();
  
  const handleQuestionChange = vi.fn();
  
  return (
    <div data-testid="survey-form">
      <SurveyProgress currentStep={1} totalSteps={3} />
      
      <SurveySection 
        title="Test Section" 
        description="Please answer the following questions">
        
        <RatingQuestion 
          id="satisfaction" 
          question="How satisfied are you with our service?" 
          onChange={handleQuestionChange} 
        />
        
        <MultipleChoiceQuestion 
          id="preference"
          question="What do you prefer?"
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" }
          ]}
          onChange={handleQuestionChange}
          allowOther={true}
        />
      </SurveySection>
      
      <div className="flex justify-between mt-4">
        <button data-testid="prev-button">Previous</button>
        <button data-testid="next-button">Next</button>
      </div>
    </div>
  );
}

describe('Survey Form Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders a complete survey form with multiple question types', () => {
    render(<TestSurveyForm />);
    
    // Check that all components are rendered
    expect(screen.getByTestId('survey-form')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument(); // From SurveyProgress
    expect(screen.getByText('Test Section')).toBeInTheDocument(); // Section title
    expect(screen.getByText('Please answer the following questions')).toBeInTheDocument(); // Section description
    expect(screen.getByText('How satisfied are you with our service?')).toBeInTheDocument(); // Rating question
    expect(screen.getByText('What do you prefer?')).toBeInTheDocument(); // Multiple choice question
    expect(screen.getByText('Option 1')).toBeInTheDocument(); // Option from multiple choice
    expect(screen.getByText('Option 2')).toBeInTheDocument(); // Option from multiple choice
    expect(screen.getByTestId('prev-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });
  
  it('allows interacting with the rating question within the survey form', async () => {
    render(<TestSurveyForm />);
    
    // Find and interact with rating stars
    const starButtons = screen.getAllByRole('button').filter(
      button => button.querySelector('svg')
    );
    
    // Click the 4th star
    fireEvent.click(starButtons[3]); 
    
    // Verify the rating text is updated
    expect(screen.getByText('Very Good')).toBeInTheDocument();
  });
  
  it('allows selecting an option in the multiple choice question', () => {
    render(<TestSurveyForm />);
    
    // Find and interact with radio buttons
    const option1Radio = screen.getByLabelText('Option 1');
    
    // Select Option 1
    fireEvent.click(option1Radio);
    
    // Verify the option is selected
    expect(option1Radio).toBeChecked();
  });
  
  it('allows selecting "Other" option and entering custom text', async () => {
    render(<TestSurveyForm />);
    
    // Find and interact with radio buttons
    const otherRadio = screen.getByLabelText('Other');
    
    // Select "Other" option
    fireEvent.click(otherRadio);
    
    // Find the textbox that appears and enter text
    const textbox = screen.getByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'My custom response' } });
    
    // Verify text is entered
    expect(textbox).toHaveValue('My custom response');
  });
  
  it('combines both question types in a sequence of user interactions', async () => {
    render(<TestSurveyForm />);
    
    // First interact with rating question
    const starButtons = screen.getAllByRole('button').filter(
      button => button.querySelector('svg')
    );
    fireEvent.click(starButtons[2]); // Click the 3rd star (Good)
    expect(screen.getByText('Good')).toBeInTheDocument();
    
    // Then interact with multiple choice question
    const option2Radio = screen.getByLabelText('Option 2');
    fireEvent.click(option2Radio);
    expect(option2Radio).toBeChecked();
    
    // Finally, try to navigate
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
  });
});
