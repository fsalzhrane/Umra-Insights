import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SurveyProgress } from '../../SurveyComponents/SurveyProgress';

// Mock the useLanguage hook
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => key === 'survey.progress' ? 'Progress' : key,
  }),
}));

describe('SurveyProgress Component', () => {
  it('renders progress bar correctly', () => {
    render(<SurveyProgress currentStep={2} totalSteps={5} />);
    
    // Progress label should be visible
    expect(screen.getByText('Progress')).toBeInTheDocument();
    
    // Progress percentage should be calculated and displayed correctly
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('calculates percentage correctly', () => {
    render(<SurveyProgress currentStep={3} totalSteps={4} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('handles zero case safely', () => {
    render(<SurveyProgress currentStep={0} totalSteps={5} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles completed case (100%)', () => {
    render(<SurveyProgress currentStep={5} totalSteps={5} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('applies custom className if provided', () => {
    const { container } = render(
      <SurveyProgress currentStep={2} totalSteps={5} className="custom-class" />
    );
    
    const progressContainer = container.firstChild;
    expect(progressContainer).toHaveClass('custom-class');
  });

  it('rounds percentage to nearest integer', () => {
    render(<SurveyProgress currentStep={2} totalSteps={3} />);
    // 2/3 = 0.6666... which should round to 67%
    expect(screen.getByText('67%')).toBeInTheDocument();
  });
});
