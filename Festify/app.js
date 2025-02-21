// Function to load footer
function loadFooter() {
    fetch('pageFooter.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Load footer when page loads
document.addEventListener('DOMContentLoaded', loadFooter);

// Sample event data
const events = [
    {
        title: "Summer Music Festival 2024", 
        date: "July 15, 2024",
        location: "Central Park, New York",
        time: "2:00 PM",

        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80",
        price: "$49.99"
    },
    {
        title: "Food & Wine Exhibition",
        date: "June 20, 2024",
        location: "Convention Center",
        time: "5:00 PM",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80",
        price: "Free"
    },
    {
        title: "Tech Conference 2024",
        date: "August 5, 2024",
        location: "Innovation Hub",
        time: "9:00 AM",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        price: "$99.99"
    },
    {
        title: "Tech Conference 2024",
        date: "August 5, 2024",
        location: "Innovation Hub",
        time: "9:00 AM",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        price: "$99.99"
    },
    {
        title: "Tech Conference 2024",
        date: "August 5, 2024",
        location: "Innovation Hub",
        time: "9:00 AM",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        price: "$99.99"
    },
    {
        title: "Tech Conference 2024",
        date: "August 5, 2024",
        location: "Innovation Hub",
        time: "9:00 AM",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        price: "$99.99"
    },
    {
        title: "Tech Conference 2024",
        date: "August 5, 2024",
        location: "Innovation Hub",
        time: "9:00 AM",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        price: "$99.99"
    },
    {
        title: "Tech Conference 2024",
        date: "August 5, 2024",
        location: "Innovation Hub",
        time: "9:00 AM",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        price: "$99.99"
    },
    {
        title: "Tech Conference 2024",
        date: "August 5, 2024",
        location: "Innovation Hub",
        time: "9:00 AM",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        price: "$99.99"
    }
    
];

// Function to create event card HTML
function createEventCard(event) {
    return `
        <div class="event-card">
            <div class="event-image-container">
                <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
                <div class="event-price">${event.price}</div>
            </div>
            <div class="event-details">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                        <line x1="16" x2="16" y1="2" y2="6"/>
                        <line x1="8" x2="8" y1="2" y2="6"/>
                        <line x1="3" x2="21" y1="10" y2="10"/>
                    </svg>
                    <span>${event.date}</span>
                </div>
                <div class="event-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>${event.time}</span>
                </div>
                <div class="event-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>${event.location}</span>
                </div>
            </div>
        </div>
    `;
}

// Function to render all events
function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = events.map(event => createEventCard(event)).join('');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
});

// export the functions for testing.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadFooter, createEventCard, renderEvents };
}
  