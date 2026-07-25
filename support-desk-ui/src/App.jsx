import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import TicketFilterPanel from './components/TicketFilterPanel';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import { sampleTickets } from './data/sampleTickets';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';

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
        {/* Redirect root URL to /app/dashboard */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App Routes - Wrapped in ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppShell />}>
            {/* Default redirect for /app */}
            <Route index element={<Navigate to="/app/dashboard" replace />} />

            <Route path="dashboard" element={<DashboardPage />} />

            <Route
              path="tickets"
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

            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Routes>
    </Layout>
  );
}