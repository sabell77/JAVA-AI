import { filterTickets } from './tickets';

describe('filterTickets utility', () => {
  const sampleTickets = [
    { id: 'T001', title: 'Cannot access email', category: 'Email', status: 'OPEN', priority: 'HIGH' },
    { id: 'T002', title: 'Laptop running slowly', category: 'Hardware', status: 'IN_PROGRESS', priority: 'MEDIUM' },
    { id: 'T003', title: 'Password reset request', category: 'Account', status: 'CLOSED', priority: 'LOW' },
  ];

  it('1. filters tickets by search text', () => {
    const result = filterTickets(sampleTickets, 'email', 'ALL');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('T001');
  });

  it('2. filters tickets by status', () => {
    const result = filterTickets(sampleTickets, '', 'IN_PROGRESS');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('T002');
  });

  it('3. filters tickets by search text and status together', () => {
    const result = filterTickets(sampleTickets, 'Password', 'CLOSED');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('T003');

    // Mismatched search text and status should return empty array
    const noMatchResult = filterTickets(sampleTickets, 'Password', 'OPEN');
    expect(noMatchResult).toHaveLength(0);
  });

  it('4. returns all tickets when search is empty and status is ALL', () => {
    const result = filterTickets(sampleTickets, '', 'ALL');
    expect(result).toHaveLength(3);
    expect(result).toEqual(sampleTickets);
  });
});