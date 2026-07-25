import { useState } from 'react';
import Layout from './components/Layout';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import { sampleTickets } from './data/sampleTickets';

export default function App() {
  const [tickets] = useState(sampleTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <Layout>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <TicketList
          tickets={tickets}
          selectedTicket={selectedTicket}
          onSelectTicket={setSelectedTicket}
        />
        <TicketDetail ticket={selectedTicket} />
      </div>
    </Layout>
  );
}