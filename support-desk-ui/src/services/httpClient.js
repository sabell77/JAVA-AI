const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Reusable HTTP API request wrapper
 * 
 * @param {string} path - Endpoint path (e.g., '/api/v1/tickets' or '/api/v1/auth/login')
 * @param {Object} [options={}] - Standard fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Parsed JSON response data
 */
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Stringify JavaScript object body if passed
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  const config = {
    method: 'GET',
    ...options,
    headers,
    body,
  };

  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, config);

    // Safely handle HTTP 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Try parsing JSON response
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Extract error message from backend DTO, or fallback to status text
      const errorMessage =
        (data && (data.message || data.error)) ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${config.method} ${url}:`, error.message);
    throw error;
  }
}