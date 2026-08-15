import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTicketData } from '../context/TicketDataContext';
import { getPagedTickets } from '../services/ticketApi';

export default function TicketsPage() {
  const {
    tickets,
    loading,
    error,
    source,          // 'cache' | 'backend'
    cache,           // In-memory cache object from context
    pageInfo,
    filters,
    loadStart,
    loadSuccess,
    loadFromCache,   // Context action for cache hit
    loadError,
    setSearchText,
    setStatusFilter,
    setPage,
    setPageSize,
    setSort,
  } = useTicketData();

  // Safely extract primitive page number
  const rawPage = pageInfo?.page;
  const currentPage = typeof rawPage === 'number' ? rawPage : 0;

  // Build the cache key requirement: page|size|sortBy|direction
  const cacheKey = `${currentPage}|${pageInfo.size || 10}|${pageInfo.sortBy || 'createdAt'}|${pageInfo.direction || 'desc'}|${filters.searchText || ''}|${filters.status || 'ALL'}`;

  // Master fetch function supporting cached reads & forced reloads
  const fetchTickets = async (isRefresh = false) => {
    // 1. Check for Cache Hit (unless manual refresh is triggered)
    if (!isRefresh && cache && cache[cacheKey]) {
      loadFromCache(cacheKey);
      return;
    }

    // 2. Cache Miss or Forced Refresh: Fetch directly from backend
    try {
      loadStart();
      const data = await getPagedTickets({
        page: currentPage,
        size: Number(pageInfo.size) || 10,
        sortBy: pageInfo.sortBy || 'createdAt',
        direction: pageInfo.direction || 'desc',
        searchText: filters.searchText || '',
        status: filters.status || 'ALL',
      });
      loadSuccess(data, cacheKey);
    } catch (err) {
      loadError(err.message || 'Failed to load paged tickets.');
    }
  };

  // Trigger fetch/cache load whenever pagination, sorting, or filtering parameters change
  useEffect(() => {
    fetchTickets(false);
  }, [
    currentPage,
    pageInfo.size,
    pageInfo.sortBy,
    pageInfo.direction,
    filters.searchText,
    filters.status,
  ]);

  if (loading && tickets.length === 0) {
    return <div style={{ padding: '2rem' }}>Loading tickets...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header, Source Badge, and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2>Support Tickets ({pageInfo.totalElements || tickets.length} Total)</h2>
          
          {/* Requirement: Small message showing data source */}
          {source && (
            <span
              style={{
                display: 'inline-block',
                marginTop: '4px',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#ffffff',
                backgroundColor: source === 'cache' ? '#17a2b8' : '#28a745',
              }}
            >
              {source === 'cache' ? '⚡ Loaded from cache' : '🌐 Fetched from backend'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Requirement: Refresh button forces backend reload */}
          <button
            onClick={() => fetchTickets(true)}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            🔄 Refresh
          </button>

          <Link 
            to="/app/tickets/new" 
            style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}
          >
            + New Ticket
          </Link>
        </div>
      </div>

      {/* Control Bar: Search, Filter, Sort, Page Size */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginBottom: '1.5rem', 
        backgroundColor: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '6px',
        alignItems: 'flex-end'
      }}>
        {/* Search Input */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Search</label>
          <input
            type="text"
            placeholder="Search title or category..."
            value={filters.searchText || ''}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ padding: '0.4rem 0.6rem', width: '220px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Status</label>
          <select
            value={filters.status || 'ALL'}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Sort Field */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Sort By</label>
          <select
            value={pageInfo.sortBy || 'createdAt'}
            onChange={(e) => setSort(e.target.value, pageInfo.direction)}
            style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Sort Direction */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Direction</label>
          <select
            value={pageInfo.direction || 'desc'}
            onChange={(e) => setSort(pageInfo.sortBy, e.target.value)}
            style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="desc">Descending (Z-A / Newest)</option>
            <option value="asc">Ascending (A-Z / Oldest)</option>
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Page Size</label>
          <select
            value={pageInfo.size || 10}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {/* Table Display */}
      {tickets.length === 0 ? (
        <p>No tickets found matching your criteria. Try adjusting your search or filters!</p>
      ) : (
        <>
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4' }}>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const id = ticket.id || ticket._id;
                return (
                  <tr key={id}>
                    <td><strong>{ticket.title}</strong></td>
                    <td>{ticket.category}</td>
                    <td>{ticket.priority}</td>
                    <td>{ticket.status}</td>
                    <td>
                      <Link
                        to={`/app/tickets/${id}/edit`}
                        style={{
                          padding: '0.4rem 0.8rem',
                          backgroundColor: '#007bff',
                          color: '#ffffff',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          display: 'inline-block',
                        }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <button
              disabled={currentPage <= 0 || loading}
              onClick={() => setPage(currentPage - 1)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: currentPage <= 0 || loading ? 'not-allowed' : 'pointer',
              }}
            >
              ← Previous
            </button>

            <span>
              Page <strong>{currentPage + 1}</strong> of <strong>{pageInfo.totalPages || 1}</strong>
            </span>

            <button
              disabled={currentPage >= (pageInfo.totalPages - 1) || loading}
              onClick={() => setPage(currentPage + 1)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: currentPage >= (pageInfo.totalPages - 1) || loading ? 'not-allowed' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}