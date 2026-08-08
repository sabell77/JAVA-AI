import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createTicket, updateTicket } from '../services/ticketApi'; 
import TicketFormWizard from '../components/TicketFormWizard';

export default function TicketFormPage({ initialTicket = null }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // If editing via route like /app/tickets/:id/edit

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (id || initialTicket?.id) {
        // Update case
        const targetId = id || initialTicket.id;
        await updateTicket(targetId, token, formData);
        setSuccessMessage('Ticket updated successfully!');
      } else {
        // Create case
        await createTicket(token, formData);
        setSuccessMessage('Ticket created successfully!');
      }

      // Redirect back to tickets list after a short delay
      setTimeout(() => {
        navigate('/app/tickets');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{id || initialTicket ? 'Edit Support Ticket' : 'Create New Support Ticket'}</h2>

      {successMessage && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}

      <TicketFormWizard onSubmit={handleSubmit} initialData={initialTicket || {}} isSubmitting={loading} />
    </div>
  );
}