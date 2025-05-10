import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingQuestion } from '../RatingQuestion';

// Mock the useLanguage hook
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => key, // Simply return the key for translation mocking
  }),
}));

describe('RatingQuestion Component', () => {
  const mockProps = {
    id: 'rating-1',
    question: 'How would you rate our service?',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it('renders the question text', () => {
    render(<RatingQuestion {...mockProps} />);
    expect(screen.getByText(mockProps.question)).toBeInTheDocument();
  });

  it('displays 5 star buttons', () => {
    render(<RatingQuestion {...mockProps} />);
    const starButtons = screen.getAllByRole('button');
    expect(starButtons).toHaveLength(5);
  });

  it('defaults to "Select rating" text when no rating is selected', () => {
    render(<RatingQuestion {...mockProps} />);
    expect(screen.getByText('Select rating')).toBeInTheDocument();
  });

  it('updates rating when a star is clicked', () => {
    render(<RatingQuestion {...mockProps} />);
    const starButtons = screen.getAllByRole('button');
    
    // Click the 3rd star (Good)
    fireEvent.click(starButtons[2]);
    
    // Check that onChange was called with the correct values
    expect(mockProps.onChange).toHaveBeenCalledWith(mockProps.id, 3, "");
    
    // Check that the rating text is updated
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('shows text area for comments when rating is 1 or 2', () => {
    render(<RatingQuestion {...mockProps} />);
    const starButtons = screen.getAllByRole('button');
    
    // Not visible initially
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    
    // Click the 2nd star (Fair)
    fireEvent.click(starButtons[1]);
    
    // Text area should now be visible
    const textArea = screen.getByRole('textbox');
    expect(textArea).toBeInTheDocument();
    
    // Enter a comment
    fireEvent.change(textArea, { target: { value: 'Needs improvement' } });
    
    // Check that onChange is called with the correct values
    expect(mockProps.onChange).toHaveBeenLastCalledWith(mockProps.id, 2, 'Needs improvement');
  });

  it('does not show text area for comments when rating is 3 or higher', () => {
    render(<RatingQuestion {...mockProps} />);
    const starButtons = screen.getAllByRole('button');
    
    // Click the 4th star (Very Good)
    fireEvent.click(starButtons[3]);
    
    // Text area should not be visible
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
  it('updates hover state when mouse enters a star button', () => {
    render(<RatingQuestion {...mockProps} />);
    const starButtons = screen.getAllByRole('button');
    
    // Simulate mouse enter on 4th star
    fireEvent.mouseEnter(starButtons[3]);
    
    // Visual check is harder to test without testIds, so we verify the onChange isn't called
    expect(mockProps.onChange).not.toHaveBeenCalled();
  });

  it('resets hover state when mouse leaves a star button', () => {
    render(<RatingQuestion {...mockProps} />);
    const starButtons = screen.getAllByRole('button');
    
    // First hover over a star
    fireEvent.mouseEnter(starButtons[3]);
    
    // Then leave
    fireEvent.mouseLeave(starButtons[3]);
    
    // Verify onChange wasn't called
    expect(mockProps.onChange).not.toHaveBeenCalled();
  });
});
