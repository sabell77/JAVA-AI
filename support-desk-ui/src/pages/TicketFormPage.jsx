import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTicketById, createTicket, updateTicket } from '../services/ticketApi';

export default function TicketFormPage() {
  const { ticketId } = useParams();
  const isEditMode = Boolean(ticketId);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    priority: 'MEDIUM',
    status: 'OPEN',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Pre-fill form if editing
  useEffect(() => {
    if (!isEditMode) return;

    async function loadTicket() {
      try {
        setFetching(true);
        // Clean call - no token needed!
        const data = await getTicketById(ticketId);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'TECHNICAL',
          priority: data.priority || 'MEDIUM',
          status: data.status || 'OPEN',
        });
      } catch (err) {
        setError(err.message || 'Failed to load ticket for editing.');
      } finally {
        setFetching(false);
      }
    }

    loadTicket();
  }, [ticketId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Submit form (POST for new, PUT for edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    // Attach required createdBy email
    const payload = {
      ...formData,
      createdBy: user?.email || 'admin@example.com',
    };

    try {
      if (isEditMode) {
        await updateTicket(ticketId, payload);
        setSuccess('Ticket updated successfully!');
      } else {
        await createTicket(payload);
        setSuccess('Ticket created successfully!');
      }

      // Redirect back after 1 second
      setTimeout(() => {
        navigate('/app/tickets');
      }, 1000);

    } catch (err) {
      setError(err.message || 'Failed to save ticket.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ padding: '2rem' }}>Loading ticket data...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', padding: '2rem' }}>
      <h2>{isEditMode ? 'Edit Ticket' : 'Create New Ticket'}</h2>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="TECHNICAL">Technical</option>
            <option value="BILLING">Billing</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Ticket' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
}