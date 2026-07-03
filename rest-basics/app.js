const eventListEl = document.getElementById("eventList");
const statusTextEl = document.getElementById("statusText");

const BASE_URL = "http://localhost:8081/api/course-offerings";

async function loadAllEvents() {
  statusTextEl.textContent = "Loading events from API...";
  eventListEl.innerHTML = ""; // Clear existing UI contents

  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    } 

    const events = await response.json();

    events.forEach(event => {
      const listItem = document.createElement("li");
      listItem.textContent = `${event.courseTitle} - ${event.startDate} - Instructor: ${event.instructorName} - ${event.capacity} capacity`;
      eventListEl.appendChild(listItem);
    });

    statusTextEl.textContent = `Successfully loaded ${events.length} event(s).`;

  } catch (error) {
    console.error("Fetch operational failure:", error);
    statusTextEl.textContent = "Error: Failed to fetch event records from backend API server.";
  }
}

async function searchEventById(eventId) {
  if (!eventId.trim()) {
    statusTextEl.textContent = "Please provide a valid Event ID.";
    return;
  }

  statusTextEl.textContent = `Searching for Event ID: ${eventId}...`;
  eventListEl.innerHTML = "";

  try {
    const response = await fetch(`${BASE_URL}/${eventId}`);

    if (response.status === 404) {
      statusTextEl.textContent = `Notice: Event with ID '${eventId}' does not exist.`;
      return;
    }

    if (!response.ok) {
      throw new Error(`API returned status code: ${response.status}`);
    }

    const event = await response.json();

    const listItem = document.createElement("li");
    listItem.style.fontWeight = "bold";
    listItem.textContent = `${event.courseTitle} - ${event.startDate} - Instructor: ${event.instructorName} - ${event.capacity} capacity`;
    eventListEl.appendChild(listItem);

    statusTextEl.textContent = "Found matching event record successfully!";

  } catch (error) {
    statusTextEl.textContent = "Error: Failed to process event identification search.";
  }
}

loadAllEvents();