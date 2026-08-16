import {
  validateTicketFormStep,
  normalizeTicketFormPayload,
  formatTicketFormLabel,
} from './ticketFormValidation';

describe('ticketFormValidation Utility', () => {

  test('validateTicketFormStep returns exact validation error messages for empty fields', () => {
    const emptyForm = { title: '', description: '', category: '', priority: '', status: '' };
    const errors = validateTicketFormStep(emptyForm);

    expect(errors.title).toBe('Title is required.');
    expect(errors.description).toBe('Description is required.');
    expect(errors.category).toBe('Category is required.');
    expect(errors.priority).toBe('Priority is required.');
    expect(errors.status).toBe('Status is required.');
  });

  test('normalizeTicketFormPayload trims spaces and formats upper-case values', () => {
    const dirtyForm = {
      title: '  VPN Issue  ',
      description: '  Cannot connect to server  ',
      category: '  Network  ',
      priority: 'high',
      status: 'open',
    };

    const cleanPayload = normalizeTicketFormPayload(dirtyForm);

    expect(cleanPayload.title).toBe('VPN Issue');
    expect(cleanPayload.description).toBe('Cannot connect to server');
    expect(cleanPayload.category).toBe('Network');
    expect(cleanPayload.priority).toBe('HIGH');
    expect(cleanPayload.status).toBe('OPEN');
  });

  test('formatTicketFormLabel formats camelCase field strings correctly', () => {
    expect(formatTicketFormLabel('title')).toBe('Title');
    expect(formatTicketFormLabel('ticketStatus')).toBe('Ticket Status');
  });
});