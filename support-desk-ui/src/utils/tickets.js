/**
 * Filters a list of tickets by search text (title or category) and status.
 *
 * @param {Array} tickets - List of ticket objects
 * @param {string} searchText - Text to search for in title or category
 * @param {string} statusFilter - Filter status ('ALL', 'OPEN', 'IN_PROGRESS', 'CLOSED', etc.)
 * @returns {Array} Filtered list of tickets
 */
export function filterTickets(tickets = [], searchText = '', statusFilter = 'ALL') {
  const query = searchText.trim().toLowerCase();

  return tickets.filter((ticket) => {
    // 1. Check status match
    const matchesStatus =
      !statusFilter || statusFilter === 'ALL' || ticket.status === statusFilter;

    // 2. Check search text match (matches title or category)
    const matchesSearch =
      !query ||
      ticket.title?.toLowerCase().includes(query) ||
      ticket.category?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });
}