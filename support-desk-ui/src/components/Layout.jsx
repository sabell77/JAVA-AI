import AppHeader from './AppHeader';

export default function Layout({ children }) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <AppHeader />
      <main>{children}</main>
    </div>
  );
}