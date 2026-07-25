import { useState } from 'react';
import Layout from './components/Layout';
import TicketFilterPanel from './components/TicketFilterPanel';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import { sampleTickets } from './data/sampleTickets';

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(sampleTickets[0]);

  // Compute filtered tickets based on active filter state
  const filteredTickets = sampleTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = selectedStatus ? ticket.status === selectedStatus : true;
    const matchesPriority = selectedPriority ? ticket.priority === selectedPriority : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Layout>
      <TicketFilterPanel
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <TicketList
          tickets={filteredTickets}
          selectedTicket={selectedTicket}
          onSelectTicket={setSelectedTicket}
        />
        <TicketDetail ticket={selectedTicket} />
      </div>
    </Layout>
  );
}