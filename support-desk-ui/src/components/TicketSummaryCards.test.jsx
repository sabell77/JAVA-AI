import { render, screen } from '@testing-library/react';
import TicketSummaryCards from './TicketSummaryCards';

describe('TicketSummaryCards Component', () => {
  const sampleTickets = [
    { id: 'T001', title: 'Cannot access email', status: 'OPEN' },
    { id: 'T002', title: 'Laptop issue', status: 'OPEN' },
    { id: 'T003', title: 'Printer setup', status: 'IN_PROGRESS' },
    { id: 'T004', title: 'Password reset', status: 'CLOSED' },
    { id: 'T005', title: 'VPN connection', status: 'CLOSED' },
    { id: 'T006', title: 'Software license', status: 'CLOSED' },
  ];

  it('renders card labels correctly', () => {
    render(<TicketSummaryCards tickets={sampleTickets} />);

    expect(screen.getByText('Total Tickets')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('calculates and displays the correct count for each status', () => {
    render(<TicketSummaryCards tickets={sampleTickets} />);

    // Total: 6, Open: 2, In Progress: 1, Closed: 3
    expect(screen.getByTestId('count-total-tickets')).toHaveTextContent('6');
    expect(screen.getByTestId('count-open')).toHaveTextContent('2');
    expect(screen.getByTestId('count-in-progress')).toHaveTextContent('1');
    expect(screen.getByTestId('count-closed')).toHaveTextContent('3');
  });

  it('handles empty ticket list without crashing', () => {
    render(<TicketSummaryCards tickets={[]} />);

    expect(screen.getByTestId('count-total-tickets')).toHaveTextContent('0');
    expect(screen.getByTestId('count-open')).toHaveTextContent('0');
    expect(screen.getByTestId('count-in-progress')).toHaveTextContent('0');
    expect(screen.getByTestId('count-closed')).toHaveTextContent('0');
  });
});