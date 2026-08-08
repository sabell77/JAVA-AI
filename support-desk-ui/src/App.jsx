import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import TicketFilterPanel from './components/TicketFilterPanel';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import TicketFormPage from './pages/TicketFormPage';
import { useAuth } from './context/AuthContext';
import { getTickets } from './services/ticketApi';

export default function App() {
  const [tickets, setTickets] = useState([]); // 1. Live state from MongoDB
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  // 2. Fetch real live tickets from Spring Boot API on load
  useEffect(() => {
    async function fetchLiveTickets() {
      if (!token) return;
      try {
        setLoading(true);
        const data = await getTickets(token);
        const list = Array.isArray(data) ? data : (data.content || data.data || []);
        setTickets(list);
        if (list.length > 0) {
          setSelectedTicket(list[0]); // Default select the first real ticket
        }
      } catch (err) {
        console.error('Failed to fetch tickets from Spring Boot:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveTickets();
  }, [token]);

  // 3. Compute filtered tickets using real API state instead of sampleTickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.category?.toLowerCase().includes(searchText.toLowerCase());

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

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Split-pane tickets view populated with MongoDB data */}
            <Route
              path="tickets"
              element={
                <div style={{ padding: '1rem' }}>
                  <TicketFilterPanel
                    searchText={searchText}
                    onSearchChange={setSearchText}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    selectedPriority={selectedPriority}
                    onPriorityChange={setSelectedPriority}
                  />

                  {loading ? (
                    <p>Loading live tickets from database...</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                      <TicketList
                        tickets={filteredTickets}
                        selectedTicket={selectedTicket}
                        onSelectTicket={setSelectedTicket}
                      />
                      <TicketDetail ticket={selectedTicket} />
                    </div>
                  )}
                </div>
              }
            />

            {/* Form Routes */}
            <Route path="tickets/new" element={<TicketFormPage />} />
            <Route path="tickets/:ticketId/edit" element={<TicketFormPage />} />

            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Routes>
    </Layout>
  );
}