import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TicketFilterPanel from './components/TicketFilterPanel';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import { sampleTickets } from './data/sampleTickets';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

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
      <Routes>
        {/* Redirect root path to dashboard */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

        {/* Exercise 1 Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app/dashboard" element={<DashboardPage />} />

        {/* Existing Ticket Workspace Route */}
        <Route
          path="/app/tickets"
          element={
            <>
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
            </>
          }
        />
      </Routes>
    </Layout>
  );
}