import { useState } from 'react';

export default function TicketFormWizard({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    priority: initialData.priority || 'MEDIUM',
    status: initialData.status || 'OPEN',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required.';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required.';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required.';
    }

    setErrors(newErrors);
    // Returns true if there are no validation errors
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Block submission if validation fails
    if (!validate()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
      {/* Title Field */}
      <div>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            boxSizing: 'border-box',
            borderColor: errors.title ? '#dc3545' : '#ccc',
          }}
        />
        {errors.title && <span style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.title}</span>}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          style={{
            width: '100%',
            padding: '0.5rem',
            boxSizing: 'border-box',
            borderColor: errors.description ? '#dc3545' : '#ccc',
          }}
        />
        {errors.description && <span style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.description}</span>}
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          Category
        </label>
        <input
          id="category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. HARDWARE, SOFTWARE"
          style={{
            width: '100%',
            padding: '0.5rem',
            boxSizing: 'border-box',
            borderColor: errors.category ? '#dc3545' : '#ccc',
          }}
        />
        {errors.category && <span style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.category}</span>}
      </div>

      {/* Priority Field */}
      <div>
        <label htmlFor="priority" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            boxSizing: 'border-box',
            borderColor: errors.priority ? '#dc3545' : '#ccc',
          }}
        >
          <option value="">Select Priority</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        {errors.priority && <span style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.priority}</span>}
      </div>

      {/* Status Field */}
      <div>
        <label htmlFor="status" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            boxSizing: 'border-box',
            borderColor: errors.status ? '#dc3545' : '#ccc',
          }}
        >
          <option value="">Select Status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        {errors.status && <span style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.status}</span>}
      </div>

      <button
        type="submit"
        style={{
          padding: '0.75rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Submit Ticket
      </button>
    </form>
  );
}