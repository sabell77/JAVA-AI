export default function StatusBadge({ status }) {
  const styles = {
    OPEN: { backgroundColor: '#dcfce7', color: '#166534' },
    IN_PROGRESS: { backgroundColor: '#dbeafe', color: '#1e40af' },
    RESOLVED: { backgroundColor: '#e0e7ff', color: '#3730a3' },
    CLOSED: { backgroundColor: '#f3f4f6', color: '#4b5563' }
  };

  const style = styles[status] || { backgroundColor: '#f3f4f6', color: '#374151' };

  return (
    <span
      style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        display: 'inline-block',
        ...style
      }}
    >
      {status}
    </span>
  );
}