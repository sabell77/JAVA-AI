import TicketFormWizard from '../components/TicketFormWizard';

export default function TicketFormPage() {
  const handleCreateTicket = (ticketData) => {

    console.log('Ticket Submitted:', ticketData);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create New Support Ticket</h2>
      <TicketFormWizard onSubmit={handleCreateTicket} />
    </div>
  );
}