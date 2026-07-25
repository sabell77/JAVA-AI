import AppHeader from './AppHeader';
import ApiInfoBanner from './ApiInfoBanner'; 

export default function Layout({ children }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
        padding: '2rem',
        maxWidth: '100%'
      }}   
    >
      <AppHeader />
      <ApiInfoBanner /> 
      <main>{children}</main>
    </div>
  );
}