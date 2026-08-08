const API_BASE_URL = '/api/v1/tickets';

// Helper to safely parse JSON or return an empty object for 204/empty responses
async function parseResponseBody(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Create a new ticket (POST)
export async function createTicket(token, payload) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await parseResponseBody(response).catch(() => ({}));
    throw new Error(errorData?.message || 'Failed to create ticket.');
  }

  return await parseResponseBody(response);
}

// Fetch single ticket by ID (GET)
export async function getTicketById(token, ticketId) {
  const response = await fetch(`${API_BASE_URL}/${ticketId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await parseResponseBody(response).catch(() => ({}));
    throw new Error(errorData?.message || 'Failed to fetch ticket details.');
  }

  return await parseResponseBody(response);
}

// Update an existing ticket (PUT)
export async function updateTicket(token, ticketId, ticketData) {
  console.log('🔑 Sending Token on PUT:', token);

  const response = await fetch(`${API_BASE_URL}/${ticketId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    const errorData = await parseResponseBody(response).catch(() => ({}));
    throw new Error(errorData?.message || 'Failed to update ticket.');
  }

  return await parseResponseBody(response);
}

// Fetch all tickets (GET)
export async function getTickets(token) {
  const response = await fetch(API_BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await parseResponseBody(response).catch(() => ({}));
    throw new Error(errorData?.message || 'Failed to fetch tickets.');
  }

  return await parseResponseBody(response);
}