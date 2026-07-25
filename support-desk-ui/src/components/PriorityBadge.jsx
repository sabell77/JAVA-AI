export default function PriorityBadge({ priority }) {
  const styles = {
    HIGH: { backgroundColor: '#fee2e2', color: '#991b1b' },
    MEDIUM: { backgroundColor: '#fef3c7', color: '#92400e' },
    LOW: { backgroundColor: '#e0e7ff', color: '#3730a3' }
  };

  const style = styles[priority] || { backgroundColor: '#f3f4f6', color: '#374151' };

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
      {priority}
    </span>
  );
}