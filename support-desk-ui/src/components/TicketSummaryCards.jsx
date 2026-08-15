import React from 'react';

export default function TicketSummaryCards({ tickets = [] }) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgress = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const closed = tickets.filter((t) => t.status === 'CLOSED').length;

  const cards = [
    { label: 'Total Tickets', value: total, color: '#2563eb' },
    { label: 'Open', value: open, color: '#dc2626' },
    { label: 'In Progress', value: inProgress, color: '#d97706' },
    { label: 'Closed', value: closed, color: '#16a34a' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            borderLeft: `5px solid ${card.color}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}
          >
            {card.label}
          </div>
          <div
            data-testid={`count-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
            style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827', marginTop: '0.25rem' }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}