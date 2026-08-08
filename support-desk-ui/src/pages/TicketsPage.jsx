import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTickets } from '../services/ticketApi';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    console.log("🔑 Current Auth Token in TicketsPage:", token);

    async function fetchTickets() {
      try {
        setLoading(true);
        setError('');
        console.log("🚀 Sending GET request to Spring Boot...");
        
        const data = await getTickets(token);
        console.log("📦 Received API Data:", data);

        const ticketList = Array.isArray(data) ? data : (data.content || []);
        setTickets(ticketList);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError(err.message || 'Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchTickets();
    } else {
      console.warn("⚠️ No token available! Re-login required.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading tickets...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Support Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets found. Create one to get started!</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id || ticket._id}>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.category}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}