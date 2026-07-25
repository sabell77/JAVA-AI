import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function TicketList({ tickets, selectedTicket, onSelectTicket }) {
  return (
    <div style={{ flex: 1, borderRight: '1px solid #e5e7eb', paddingRight: '1rem' }}>
      <h2>Tickets ({tickets.length})</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tickets.map((ticket) => {
          const isSelected = selectedTicket?.id === ticket.id;
          return (
            <li
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              style={{
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#f3f4f6' : '#ffffff',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{ticket.title}</div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}