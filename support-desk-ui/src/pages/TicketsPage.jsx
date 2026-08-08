import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { getTickets } from '../services/ticketApi';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const data = await getTickets(token);
        const list = Array.isArray(data) ? data : (data.content || data.data || []);
        setTickets(list);
      } catch (err) {
        setError(err.message || 'Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchTickets();
  }, [token]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading tickets...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Support Tickets ({tickets.length})</h2>
        <Link 
          to="/app/tickets/new" 
          style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}
        >
          + New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p>No tickets found in database. Create one to get started!</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th> {/* 2. Table Column Header */}
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
                    {/* 3. The Edit Button Link */}
                    <Link
                      to={`/app/tickets/${id}/edit`}
                      style={{
                        padding: '0.4rem 0.8rem',
                        backgroundColor: '#007bff',
                        color: '#ffffff',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        display: 'inline-block'
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
      )}
    </div>
  );
}