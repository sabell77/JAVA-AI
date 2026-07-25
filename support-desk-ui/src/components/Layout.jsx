import AppHeader from './AppHeader';

export default function Layout({ children }) {
  return (
    <div>
      <AppHeader />
      <main style={{ padding: '0 1rem' }}>
        {children}
      </main>
    </div>
  );
}