import { Link } from 'react-router-dom';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function TicketList({ tickets, selectedTicket, onSelectTicket }) {
  return (
    <div style={{ flex: 1, borderRight: '1px solid #e5e7eb', paddingRight: '1rem' }}>
      <h2>Tickets ({tickets.length})</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tickets.map((ticket) => {
          const ticketId = ticket.id || ticket._id;
          const isSelected = selectedTicket?.id === ticketId || selectedTicket?._id === ticketId;

          return (
            <li
              key={ticketId}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 'bold' }}>{ticket.title}</div>

                {/* EDIT BUTTON LINK */}
                <Link
                  to={`/app/tickets/${ticketId}/edit`}
                  onClick={(e) => e.stopPropagation()} /* Prevents triggering onSelectTicket */
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 'normal'
                  }}
                >
                  Edit
                </Link>
              </div>

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