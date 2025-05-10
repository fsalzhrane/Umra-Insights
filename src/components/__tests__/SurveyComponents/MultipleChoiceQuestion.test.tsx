import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultipleChoiceQuestion } from '../../SurveyComponents/MultipleChoiceQuestion';

// Mock the useLanguage hook
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => key === 'survey.other' ? 'Other' : 
                       key === 'survey.otherPlaceholder' ? 'Please specify' : key,
  }),
}));

describe('MultipleChoiceQuestion Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const mockProps = {
    id: 'mcq-1',
    question: 'Select an option:',
    options: mockOptions,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it('renders the question text', () => {
    render(<MultipleChoiceQuestion {...mockProps} />);
    expect(screen.getByText(mockProps.question)).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<MultipleChoiceQuestion {...mockProps} />);
    
    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('does not show "required" indicator when not required', () => {
    render(<MultipleChoiceQuestion {...mockProps} />);
    const requiredIndicator = screen.queryByText('*');
    expect(requiredIndicator).not.toBeInTheDocument();
  });

  it('shows "required" indicator when required is true', () => {
    render(<MultipleChoiceQuestion {...mockProps} required={true} />);
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('calls onChange with correct value when an option is selected', () => {
    render(<MultipleChoiceQuestion {...mockProps} />);
    
    // Find and click the radio input for Option 2
    const option2Radio = screen.getByLabelText('Option 2');
    fireEvent.click(option2Radio);
    
    // Check that onChange was called with the correct parameters
    expect(mockProps.onChange).toHaveBeenCalledWith(mockProps.id, 'option2');
  });

  it('does not render "Other" option by default', () => {
    render(<MultipleChoiceQuestion {...mockProps} />);
    const otherOption = screen.queryByText('Other');
    expect(otherOption).not.toBeInTheDocument();
  });

  it('renders "Other" option when allowOther is true', () => {
    render(<MultipleChoiceQuestion {...mockProps} allowOther={true} />);
    const otherOption = screen.getByText('Other');
    expect(otherOption).toBeInTheDocument();
  });

  it('shows text area when "Other" option is selected', () => {
    render(<MultipleChoiceQuestion {...mockProps} allowOther={true} />);
    
    // "Other" option is not selected by default, so text area should not be visible
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    
    // Select the "Other" option
    const otherRadio = screen.getByLabelText('Other');
    fireEvent.click(otherRadio);
    
    // Text area should now be visible
    const textArea = screen.getByRole('textbox');
    expect(textArea).toBeInTheDocument();
  });

  it('calls onChange with "other" value and comment when other option is selected and comment is provided', () => {
    render(<MultipleChoiceQuestion {...mockProps} allowOther={true} />);
    
    // Select the "Other" option
    const otherRadio = screen.getByLabelText('Other');
    fireEvent.click(otherRadio);
    
    // Check that onChange was called with the "other" value
    expect(mockProps.onChange).toHaveBeenCalledWith(mockProps.id, 'other', '');
    
    // Enter text in the textarea
    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Custom response' } });
    
    // Check that onChange was called with the updated comment
    expect(mockProps.onChange).toHaveBeenLastCalledWith(mockProps.id, 'other', 'Custom response');
  });
});
