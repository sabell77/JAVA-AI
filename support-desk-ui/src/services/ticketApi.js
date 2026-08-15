import { apiRequest } from './httpClient';

/**
 * Fetch all tickets
 * GET /api/v1/tickets
 */
export const getTickets = () => 
  apiRequest('/api/v1/tickets');

/**
 * Fetch a single ticket by ID
 * GET /api/v1/tickets/:id
 */
export const getTicketById = (ticketId) => 
  apiRequest(`/api/v1/tickets/${ticketId}`);

/**
 * Create a new ticket
 * POST /api/v1/tickets
 */
export const createTicket = (ticketData) =>
  apiRequest('/api/v1/tickets', {
    method: 'POST',
    body: ticketData,
  });

/**
 * Update an existing ticket
 * PUT /api/v1/tickets/:id
 */
export const updateTicket = (ticketId, ticketData) =>
  apiRequest(`/api/v1/tickets/${ticketId}`, {
    method: 'PUT',
    body: ticketData,
  });

/**
 * Delete a ticket
 * DELETE /api/v1/tickets/:id
 */
export const deleteTicket = (ticketId) =>
  apiRequest(`/api/v1/tickets/${ticketId}`, {
    method: 'DELETE',
  });

/**
 * Fetch paged, sorted, and filtered tickets.
 * GET /api/v1/tickets?page=0&size=5&sortBy=createdAt&direction=desc
 */
export async function getPagedTickets({
  page = 0,
  size = 5,
  sortBy = 'createdAt',
  direction = 'desc',
  searchText = '',
  status = 'ALL',
} = {}) {
  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy,
    direction,
  });

  if (searchText) {
    queryParams.append('searchText', searchText);
  }
  if (status && status !== 'ALL') {
    queryParams.append('status', status);
  }

  return apiRequest(`/api/v1/tickets/paged?${queryParams.toString()}`);
}

export async function updateTicketStatus(ticketId, status) {
  const response = await fetch(`/api/tickets/${ticketId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update status to ${status}`);
  }

  return response.json();
}