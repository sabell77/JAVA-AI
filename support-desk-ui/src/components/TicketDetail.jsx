import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function TicketDetail({ ticket }) {
  if (!ticket) {
    return (
      <div style={{ flex: 2, paddingLeft: '1rem', color: '#6b7280' }}>
        <p>Select a ticket to view details</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 2, paddingLeft: '1rem' }}>
      <h2>Ticket Details</h2>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '1rem' }}>
        <h3>{ticket.title}</h3>
        <p><strong>ID:</strong> {ticket.id}</p>
        <p><strong>Category:</strong> {ticket.category}</p>
        <p>
          <strong>Priority:</strong> <PriorityBadge priority={ticket.priority} />
        </p>
        <p>
          <strong>Status:</strong> <StatusBadge status={ticket.status} />
        </p>
        <p><strong>Created By:</strong> {ticket.createdBy}</p>
        <p><strong>Created At:</strong> {ticket.createdAt}</p>
      </div>
    </div>
  );
}