import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

// Helper component to interact with AuthContext in tests
function TestComponent({ email = 'user@example.com', password = 'password123' }) {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</div>
      <div data-testid="token">{token || 'NO_TOKEN'}</div>
      <div data-testid="user-email">{user?.email || 'NO_EMAIL'}</div>

      <button onClick={() => login(email, password).catch((err) => console.log(err.message))}>
        Log In
      </button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

describe('AuthContext Provider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. initializes as unauthenticated when localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');
    expect(screen.getByTestId('token')).toHaveTextContent('NO_TOKEN');
    expect(screen.getByTestId('user-email')).toHaveTextContent('NO_EMAIL');
  });

  it('2. restores authenticated state from localStorage on mount', () => {
    localStorage.setItem('token', 'stored-jwt-token');
    localStorage.setItem('user', JSON.stringify({ email: 'saved@example.com' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');
    expect(screen.getByTestId('token')).toHaveTextContent('stored-jwt-token');
    expect(screen.getByTestId('user-email')).toHaveTextContent('saved@example.com');
  });

  it('3. logs in successfully and persists token + user to localStorage', async () => {
    const user = userEvent.setup();

    // Mock successful fetch API response
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'new-jwt-token',
        user: { email: 'user@example.com', name: 'Test User' },
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', { name: /log in/i }));

    // Assert state update
    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');
    expect(screen.getByTestId('token')).toHaveTextContent('new-jwt-token');
    expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com');

    // Assert localStorage persistence
    expect(localStorage.getItem('token')).toBe('new-jwt-token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      email: 'user@example.com',
      name: 'Test User',
    });
  });

  it('4. clears state and localStorage when logout is called', async () => {
    const user = userEvent.setup();

    localStorage.setItem('token', 'active-token');
    localStorage.setItem('user', JSON.stringify({ email: 'active@example.com' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');

    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');
    expect(screen.getByTestId('token')).toHaveTextContent('NO_TOKEN');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});