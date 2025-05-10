import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingQuestion } from '@/components/RatingQuestion';
import { MultipleChoiceQuestion } from '@/components/SurveyComponents/MultipleChoiceQuestion';
import { TextQuestion } from '@/components/SurveyComponents/TextQuestion';
import { SurveySection } from '@/components/SurveyComponents/SurveySection';

// Mock necessary hooks and providers
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the survey service
vi.mock('@/lib/survey-service', () => ({
  submitSurvey: vi.fn().mockImplementation((data) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, id: 'survey-123' });
      }, 100); // Simulate network delay
    });
  })
}));

/**
 * Performance Tests focus on:
 * - Rendering performance with large datasets
 * - Interaction performance
 * - Form submission performance
 */
describe('Survey Components Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset timing measurements
    performance.clearMarks();
    performance.clearMeasures();
  });
  
  it('renders a large number of questions efficiently', () => {
    // Mark start time
    performance.mark('render-start');
    
    // Create a large number of questions
    const questions = Array.from({ length: 20 }, (_, i) => (
      <TextQuestion
        key={`question-${i}`}
        id={`question-${i}`}
        question={`Question ${i}`}
        onChange={vi.fn()}
      />
    ));
    
    render(
      <SurveySection title="Performance Test">
        {questions}
      </SurveySection>
    );
    
    // Mark end time
    performance.mark('render-end');
    
    // Measure time between marks
    performance.measure('render-time', 'render-start', 'render-end');
    
    const measurements = performance.getEntriesByType('measure');
    const renderTime = measurements.find(m => m.name === 'render-time')?.duration || 0;
    
    // Log render time for monitoring
    console.log(`Rendered ${questions.length} questions in ${renderTime.toFixed(2)}ms`);
    
    // Verify all questions rendered
    questions.forEach((_, i) => {
      expect(screen.getByText(`Question ${i}`)).toBeInTheDocument();
    });
    
    // Set a reasonable upper bound for rendering (adjust based on your needs)
    expect(renderTime).toBeLessThan(1000); // Rendering should take less than 1 second
  });
  
  it('handles rapid user interactions efficiently', () => {
    const handleChange = vi.fn();
    
    render(
      <RatingQuestion
        id="performance_rating"
        question="How would you rate this?"
        onChange={handleChange}
      />
    );
    
    // Get the star buttons
    const stars = screen.getAllByRole('button').filter(
      button => button.querySelector('svg')
    );
    
    // Mark start time
    performance.mark('interaction-start');
    
    // Simulate rapid clicking between different ratings
    for (let i = 0; i < 10; i++) {
      const starIndex = i % stars.length;
      fireEvent.click(stars[starIndex]);
    }
    
    // Mark end time
    performance.mark('interaction-end');
    
    // Measure time between marks
    performance.measure('interaction-time', 'interaction-start', 'interaction-end');
    
    const measurements = performance.getEntriesByType('measure');
    const interactionTime = measurements.find(m => m.name === 'interaction-time')?.duration || 0;
    
    // Log interaction time
    console.log(`Processed 10 rating interactions in ${interactionTime.toFixed(2)}ms`);
    
    // Verify that all click events were processed
    expect(handleChange).toHaveBeenCalledTimes(10);
    
    // Set a reasonable upper bound for interaction time
    expect(interactionTime).toBeLessThan(500); // All interactions should happen within 500ms
  });
  
  it('efficiently renders and updates a complex form', () => {
    // Define a complex survey form component
    const ComplexSurveyForm = () => {
      // Use fixed values instead of React hooks
      const formData = {};
      const setFormData = vi.fn();
      
      return (
        <div data-testid="complex-form">
          <SurveySection title="Personal Information">
            <TextQuestion
              id="name"
              question="What's your name?"
              onChange={setFormData}
            />
            <TextQuestion
              id="email"
              question="What's your email?"
              onChange={setFormData}
            />
          </SurveySection>
          
          <SurveySection title="Experience">
            <RatingQuestion
              id="satisfaction"
              question="How satisfied are you with our service?"
              onChange={setFormData}
            />
            <MultipleChoiceQuestion
              id="visit_purpose"
              question="What was the purpose of your visit?"
              options={[
                { value: "business", label: "Business" },
                { value: "leisure", label: "Leisure" },
                { value: "other", label: "Other" }
              ]}
              onChange={setFormData}
            />
          </SurveySection>
          
          <SurveySection title="Additional Feedback">
            <TextQuestion
              id="feedback"
              question="Do you have any additional feedback?"
              onChange={setFormData}
            />
          </SurveySection>
          
          <button type="submit" data-testid="submit-button">
            Submit
          </button>
        </div>
      );
    };
    
    // Measure initial render time
    performance.mark('form-render-start');
    render(<ComplexSurveyForm />);
    performance.mark('form-render-end');
    performance.measure('form-render-time', 'form-render-start', 'form-render-end');
    
    // Verify form rendered correctly
    expect(screen.getByTestId('complex-form')).toBeInTheDocument();
    
    // Get render time
    const renderMeasure = performance.getEntriesByName('form-render-time')[0];
    console.log(`Complex form render time: ${renderMeasure.duration.toFixed(2)}ms`);
    
    // Set a reasonable render time expectation
    expect(renderMeasure.duration).toBeLessThan(500);
  });
});
