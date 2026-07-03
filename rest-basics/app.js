const events = [
  {
    id: "EV001",
    title: "Tech Career Fair",
    date: "2026-08-10",
    venue: "Kuala Lumpur Convention Centre",
    availableSeats: 120
  },
  {
    id: "EV002",
    title: "Web Development Bootcamp",
    date: "2026-08-15",
    venue: "Digital Learning Hub",
    availableSeats: 35
  },
  {
    id: "EV003",
    title: "AI for Business Workshop",
    date: "2026-08-20",
    venue: "Innovation Centre",
    availableSeats: 50
  }
];

const eventListEl = document.getElementById("eventList");
const statusTextEl = document.getElementById("statusText");

events.forEach(event => {
  const listItem = document.createElement("li");

  let eventText = `${event.title} - ${event.date} - ${event.venue} - ${event.availableSeats} seats available`;

  
  if (event.availableSeats < 50) {
    eventText += " - Limited seats";
  }
 
  listItem.textContent = eventText;

  eventListEl.appendChild(listItem);
});

statusTextEl.textContent = `${events.length} event(s) displayed.`;