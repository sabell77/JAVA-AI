/**
 * Validates ticket form values and returns field-specific error messages.
 */
export function validateTicketFormStep(formData, stepToValidate = null, reviewConfirmed = false) {
  const errors = {};

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Title is required.';
  }
  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Description is required.';
  }
  if (!formData.category || !formData.category.trim()) {
    errors.category = 'Category is required.';
  }
  if (!formData.priority) {
    errors.priority = 'Priority is required.';
  }
  if (!formData.status) {
    errors.status = 'Status is required.';
  }

  return errors;
}

/**
 * Cleans up and normalizes form payload values before submission.
 */
export function normalizeTicketFormPayload(formData) {
  return {
    title: formData.title ? formData.title.trim() : '',
    description: formData.description ? formData.description.trim() : '',
    category: formData.category ? formData.category.trim() : '',
    priority: formData.priority ? formData.priority.trim().toUpperCase() : 'MEDIUM',
    status: formData.status ? formData.status.trim().toUpperCase() : 'OPEN',
  };
}

/**
 * Formats camelCase object keys into capital-case labels.
 */
export function formatTicketFormLabel(key) {
  if (!key) return '';
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}