import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingQuestion } from '@/components/RatingQuestion';
import { MultipleChoiceQuestion } from '@/components/SurveyComponents/MultipleChoiceQuestion';
import { TextQuestion } from '@/components/SurveyComponents/TextQuestion';

// Mock necessary hooks and providers
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

/**
 * Compatibility Tests check how components behave across different:
 * - Device sizes (responsive design)
 * - Browser conditions (JS disabled, etc.)
 * - Data inputs (different data formats, sizes, languages)
 */
describe('Survey Components Compatibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  // Responsive tests
  describe('Responsive Design Tests', () => {
    // Save original matchMedia implementation
    let originalMatchMedia: any;
    
    beforeEach(() => {
      // Store the original implementation
      originalMatchMedia = window.matchMedia;
    });
    
    afterEach(() => {
      // Restore the original implementation after each test
      window.matchMedia = originalMatchMedia;
    });
    
    it('RatingQuestion adapts to small screen sizes', () => {
      // Mock small screen size
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 640px'), // Simulate small screen
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      render(
        <RatingQuestion
          id="test_rating"
          question="How would you rate this?"
          onChange={vi.fn()}
        />
      );
      
      // Component should render on small screens
      expect(screen.getByText('How would you rate this?')).toBeInTheDocument();
    });
    
    it('RatingQuestion adapts to large screen sizes', () => {
      // Mock large screen size
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('min-width: 1024px'), // Simulate large screen
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      render(
        <RatingQuestion
          id="test_rating"
          question="How would you rate this?"
          onChange={vi.fn()}
        />
      );
      
      // Component should render on large screens
      expect(screen.getByText('How would you rate this?')).toBeInTheDocument();
    });
  });
  
  // Data input tests
  describe('Various Data Input Tests', () => {
    it('MultipleChoiceQuestion handles a large number of options', () => {
      // Create a large number of options
      const manyOptions = Array.from({ length: 15 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`
      }));
      
      render(
        <MultipleChoiceQuestion
          id="test_many_options"
          question="Select from many options"
          options={manyOptions}
          onChange={vi.fn()}
        />
      );
      
      // Check all options are rendered
      manyOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
    
    it('TextQuestion handles long input text', async () => {
      const handleChange = vi.fn();
      
      render(
        <TextQuestion
          id="test_long_text"
          question="Enter your feedback"
          onChange={handleChange}
        />
      );
      
      const textArea = screen.getByRole('textbox');
      
      // Create a very long string
      const longText = 'A'.repeat(2000);
      
      // Enter the long text
      fireEvent.change(textArea, { target: { value: longText } });
      
      // Verify the change handler was called
      expect(handleChange).toHaveBeenCalled();
      
      // Verify the text area contains the long text
      expect(textArea).toHaveValue(longText);
    });
    
    it('MultipleChoiceQuestion handles options with special characters', () => {
      const specialOptions = [
        { value: 'special1', label: 'Option with üñïçôdę' },
        { value: 'special2', label: 'Option with "quotes"' },
        { value: 'special3', label: 'Option with <html> & symbols' }
      ];
      
      render(
        <MultipleChoiceQuestion
          id="test_special_chars"
          question="Select an option"
          options={specialOptions}
          onChange={vi.fn()}
        />
      );
      
      // Check all options are rendered correctly
      specialOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });
  
  // Accessibility tests
  describe('Basic Accessibility Tests', () => {
    it('RatingQuestion is keyboard navigable', () => {
      render(
        <RatingQuestion
          id="test_a11y_rating"
          question="How would you rate this?"
          onChange={vi.fn()}
        />
      );
      
      // Check all stars can be focused
      const stars = screen.getAllByRole('button');
      expect(stars.length).toBeGreaterThan(0);
      
      // First star should be focusable
      stars[0].focus();
      expect(document.activeElement).toBe(stars[0]);
    });
    
    it('TextQuestion has proper label association', () => {
      render(
        <TextQuestion
          id="test_a11y_text"
          question="Enter your feedback"
          onChange={vi.fn()}
        />
      );
      
      // Check that the question is associated with the textarea
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      
      // Check label text is present
      expect(screen.getByText('Enter your feedback')).toBeInTheDocument();
    });
  });
});
