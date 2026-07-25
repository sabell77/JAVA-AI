export default function TicketFilterPanel({
  searchText,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #e9ecef',
        flexWrap: 'wrap'
      }}
    >
      {/* Search Input */}
      <div style={{ flex: '1 1 200px' }}>
        <input
            type="text"
            placeholder="Search title or category..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#ffffff',
                color: '#212529'
            }}
        />
      </div>

      {/* Status Filter Dropdown */}
      <div>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#ffffff',
                color: '#212529'
            }}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Priority Filter Dropdown */}
      <div>
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#ffffff',
            color: '#212529'
          }}
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
    </div>
  );
}