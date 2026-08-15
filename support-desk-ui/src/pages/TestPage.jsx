import { apiRequest } from './services/httpClient';

export default function TestPage() {
  
  // 1. Test GET request (e.g., fetch tickets)
  const handleTestGet = async () => {
    try {
      const data = await apiRequest('/api/v1/tickets');
      console.log('✅ GET Success! Data:', data);
    } catch (err) {
      console.error('❌ GET Failed:', err.message);
    }
  };

  // 2. Test POST request (e.g., create ticket)
  const handleTestPost = async () => {
    try {
      const newTicket = {
        title: "Test Ticket from httpClient",
        description: "Checking if apiRequest works properly",
        category: "TECHNICAL",
        priority: "HIGH"
      };
      const data = await apiRequest('/api/v1/tickets', {
        method: 'POST',
        body: newTicket,
      });
      console.log('✅ POST Success! Created Ticket:', data);
    } catch (err) {
      console.error('❌ POST Failed:', err.message);
    }
  };

  // 3. Test Error Handling (e.g., invalid endpoint or ID)
  const handleTestError = async () => {
    try {
      await apiRequest('/api/v1/tickets/invalid-id-999');
    } catch (err) {
      console.log('✅ Error handled successfully! Message:', err.message);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
      <button onClick={handleTestGet}>Test GET /api/v1/tickets</button>
      <button onClick={handleTestPost}>Test POST /api/v1/tickets</button>
      <button onClick={handleTestError}>Test Error Handling</button>
    </div>
  );
}