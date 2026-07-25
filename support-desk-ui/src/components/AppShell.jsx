import { NavLink, Outlet } from 'react-router-dom';

export default function AppShell() {
  const getLinkStyle = ({ isActive }) => ({
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#ffffff' : '#495057',
    backgroundColor: isActive ? '#007bff' : 'transparent',
    display: 'block',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ display: 'flex', minHeight: '80vh', gap: '1.5rem' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '200px',
          flexShrink: 0,
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #dee2e6',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#333' }}>
          Navigation
        </h3>
        <NavLink to="/app/dashboard" style={getLinkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/app/tickets" style={getLinkStyle}>
          Tickets
        </NavLink>
        <NavLink to="/app/reports" style={getLinkStyle}>
          Reports
        </NavLink>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}