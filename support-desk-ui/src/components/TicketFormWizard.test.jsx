import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TicketFormWizard from './TicketFormWizard';

describe('TicketFormWizard Component Validation', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. displays inline validation errors when submitting required empty fields', async () => {
    const user = userEvent.setup();

    render(<TicketFormWizard onSubmit={mockOnSubmit} />);

    // Click submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /submit ticket/i });
    await user.click(submitButton);

    // Ensure submit handler was blocked
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Assert inline validation error messages match your component
    expect(screen.getByText('Title is required.')).toBeInTheDocument();
    expect(screen.getByText('Description is required.')).toBeInTheDocument();
    expect(screen.getByText('Category is required.')).toBeInTheDocument();
  });

  it('2. calls onSubmit with clean payload data when form is valid', async () => {
    const user = userEvent.setup();

    render(<TicketFormWizard onSubmit={mockOnSubmit} />);

    // Type into required fields
    await user.type(screen.getByLabelText(/title/i), 'Cannot access printer');
    await user.type(screen.getByLabelText(/description/i), 'Paper jam in Room 302.');
    await user.type(screen.getByLabelText(/category/i), 'Hardware');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit ticket/i });
    await user.click(submitButton);

    // Verify callback payload matches form state
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Cannot access printer',
      description: 'Paper jam in Room 302.',
      category: 'Hardware',
      priority: 'MEDIUM',
      status: 'OPEN',
    });
  });

  it('3. displays a saving state and disables inputs when isSubmitting is true', () => {
    const { rerender } = render(
      <TicketFormWizard onSubmit={mockOnSubmit} isSubmitting={false} />
    );

    // Verify initial idle state
    let submitButton = screen.getByRole('button', { name: /submit ticket/i });
    expect(submitButton).not.toBeDisabled();

    // Re-render with active submission state
    rerender(<TicketFormWizard onSubmit={mockOnSubmit} isSubmitting={true} />);

    // Verify submit button updates label and becomes disabled
    submitButton = screen.getByRole('button', { name: /saving\.\.\./i });
    expect(submitButton).toBeDisabled();

    // Verify form controls are disabled during submit
    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByLabelText(/description/i)).toBeDisabled();
    expect(screen.getByLabelText(/category/i)).toBeDisabled();
  });
});