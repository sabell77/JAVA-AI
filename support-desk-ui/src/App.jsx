import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage'; // <-- Using your updated Exercise 3 page!
import TicketFormPage from './pages/TicketFormPage';
import ReportsPage from './pages/ReportsPage';

// Context & API
import { TicketDataProvider } from './context/TicketDataContext';
import { apiRequest } from './services/httpClient';

if (import.meta.env.DEV) {
  window.apiRequest = apiRequest;
}

/**
 * Main App Router wrapped with TicketDataProvider
 */
export default function App() {
  return (
    <TicketDataProvider>
      <Layout>
        <Routes>
          {/* Redirect root URL to /login or /app/dashboard */}
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Tickets View (Day 14 Exercise 3 Pagination & Filter Page) */}
              <Route path="tickets" element={<TicketsPage />} />

              {/* Form Routes */}
              <Route path="tickets/new" element={<TicketFormPage />} />
              <Route path="tickets/:ticketId/edit" element={<TicketFormPage />} />

              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>
        </Routes>
      </Layout>
    </TicketDataProvider>
  );
}