import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import * as AuthContextModule from '../context/AuthContext';

// Mock the useAuth hook from AuthContext
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('ProtectedRoute Component', () => {
  // Helper to render the router layout structure
  const renderWithRouter = (initialPath = '/app/tickets') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<h1>Login Page</h1>} />
          {/* Protected Layout Route using <Outlet /> */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app/tickets" element={<h1>Protected Tickets</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('1. redirects an unauthenticated user (isAuthenticated: false) to /login', () => {
    // Mock user as NOT authenticated
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      isAuthenticated: false,
    });

    renderWithRouter('/app/tickets');

    // Should NOT render protected child route
    expect(screen.queryByText('Protected Tickets')).not.toBeInTheDocument();
    // SHOULD be redirected to Login Page
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('2. allows an authenticated user (isAuthenticated: true) to view protected content via Outlet', () => {
    // Mock user as authenticated
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      isAuthenticated: true,
    });

    renderWithRouter('/app/tickets');

    // SHOULD render protected child route content inside <Outlet />
    expect(screen.getByText('Protected Tickets')).toBeInTheDocument();
    // Should NOT show login page
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});