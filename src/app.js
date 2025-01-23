// Function to fetch the events (static data for now)
function getEvents() {
    return [
        {
            title: "Community Clean-Up",
            date: "2025-02-15",
            description: "Join us to clean the local park and make it beautiful for everyone."
        },
        {
            title: "Annual Fundraising Gala",
            date: "2025-03-10",
            description: "An evening of celebration and fundraising for our organization."
        },
        {
            title: "Volunteer Appreciation Day",
            date: "2025-04-20",
            description: "A day dedicated to appreciating the efforts of our volunteers."
        }
    ];
}

// Function to render the events
function renderEvents() {
    const events = getEvents(); // Get the event data
    const eventsContainer = document.getElementById("events-container");
    eventsContainer.innerHTML = ""; // Clear any existing content

    events.forEach(event => {
        // Create an event card
        const eventCard = document.createElement("div");
        eventCard.className = "event-card";

        // Add event title
        const eventTitle = document.createElement("h3");
        eventTitle.textContent = event.title;

        // Add event date
        const eventDate = document.createElement("p");
        eventDate.textContent = `Date: ${event.date}`;

        // Add event description
        const eventDescription = document.createElement("p");
        eventDescription.textContent = event.description;

        // Append elements to the event card
        eventCard.appendChild(eventTitle);
        eventCard.appendChild(eventDate);
        eventCard.appendChild(eventDescription);

        // Append event card to the container
        eventsContainer.appendChild(eventCard);
    });
}

// Render events when the page loads
document.addEventListener("DOMContentLoaded", renderEvents);
