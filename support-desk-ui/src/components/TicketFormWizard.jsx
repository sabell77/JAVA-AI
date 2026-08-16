import { useState } from 'react';
import {
  validateTicketFormStep,
  normalizeTicketFormPayload,
  formatTicketFormLabel,
} from '../utils/ticketFormValidation';

export default function TicketFormWizard({ onSubmit, initialData = {}, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    priority: initialData.priority || 'MEDIUM',
    status: initialData.status || 'OPEN',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateTicketFormStep(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const payload = normalizeTicketFormPayload(formData);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
      <div>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          {formatTicketFormLabel('title')}
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderColor: errors.title ? '#dc3545' : '#ccc' }}
        />
        {errors.title && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.title}</span>}
      </div>

      <div>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          {formatTicketFormLabel('description')}
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderColor: errors.description ? '#dc3545' : '#ccc' }}
        />
        {errors.description && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.description}</span>}
      </div>

      <div>
        <label htmlFor="category" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          {formatTicketFormLabel('category')}
        </label>
        <input
          id="category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderColor: errors.category ? '#dc3545' : '#ccc' }}
        />
        {errors.category && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.category}</span>}
      </div>

      <div>
        <label htmlFor="priority" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          {formatTicketFormLabel('priority')}
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderColor: errors.priority ? '#dc3545' : '#ccc' }}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        {errors.priority && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.priority}</span>}
      </div>

      <div>
        <label htmlFor="status" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          {formatTicketFormLabel('status')}
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderColor: errors.status ? '#dc3545' : '#ccc' }}
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        {errors.status && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.status}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '0.75rem',
          backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Saving...' : 'Submit Ticket'}
      </button>
    </form>
  );
}