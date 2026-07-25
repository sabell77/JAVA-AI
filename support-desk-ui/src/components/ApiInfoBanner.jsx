import { useState, useEffect } from 'react';
import { fetchApiInfo } from '../services/api';

export default function ApiInfoBanner() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInfo() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchApiInfo();
        setInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadInfo();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '0.5rem 1rem', marginBottom: '1rem', backgroundColor: '#e2e3e5', borderRadius: '4px', textAlign: 'center', color: '#383d41' }}>
        ⏳ Loading API status...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '0.5rem 1rem', marginBottom: '1rem', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', borderRadius: '4px', textAlign: 'center' }}>
        ⚠️ Error: {error} (Ensure backend is running at http://localhost:8080)
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem 1rem', marginBottom: '1rem', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', color: '#155724', borderRadius: '4px', textAlign: 'center' }}>
      🟢 Connected to <strong>{info?.name || info?.appName || 'API'}</strong> (v{info?.version || '1.0'})
    </div>
  );
}