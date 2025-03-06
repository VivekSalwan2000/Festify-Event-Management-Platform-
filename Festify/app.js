// app.js
 
// Import the fetchEvents function from firebase.js
import { fetchEvents } from './firebase.js';
 
// Function to load footer (if you have a separate footer file)
function loadFooter() {
  fetch('pageFooter.html')
    .then(response => response.text())
    .then(data => { document.body.insertAdjacentHTML('beforeend', data); })
    .catch(error => console.error('Error loading footer:', error));
}
 
// Load footer when page loads
document.addEventListener('DOMContentLoaded', loadFooter);
 
// Function to create event card HTML
function createEventCard(event) {
  return `
    <div class="event-card">
      <div class="event-image-container">
        <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
        <div class="event-price">${event.generalPrice}</div>
      </div>
      <div class="event-details">
        <h3 class="event-title">${event.title}</h3>
        <div class="event-info">
          <!-- SVG for date (insert your SVG content below) -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <!-- Example SVG content -->
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${event.date}</span>
        </div>
        <div class="event-info">
          <!-- SVG for time (insert your SVG content below) -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${event.startTime}</span>
        </div>
        <div class="event-info">
          <!-- SVG for location (insert your SVG content below) -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${event.location}</span>
        </div>
      </div>
    </div>
  `;
}
 
// Store all events globally for filtering
let allEvents = [];
 
// Function to filter events based on search input
function filterEvents(searchTerm) {
  if (!searchTerm) return allEvents;
 
  searchTerm = searchTerm.toLowerCase();
  return allEvents.filter(event =>
    event.title.toLowerCase().startsWith(searchTerm)
  );
}
 
// Function to render events
function renderEvents(events) {
  const eventsGrid = document.getElementById('eventsGrid');
  if (eventsGrid) {
    eventsGrid.innerHTML = events.map(event => createEventCard(event)).join('');
  }
}
 
// Function to render events fetched from Firestore
async function renderEventsFromDB() {
  try {
    allEvents = await fetchEvents();
    renderEvents(allEvents);
  } catch (error) {
    console.error("Error rendering events:", error);
  }
}
 
// Initialize the page and render events when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  renderEventsFromDB();
 
  // Add search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const filteredEvents = filterEvents(e.target.value);
      renderEvents(filteredEvents);
    });
  }
});
 
// export the functions for testing.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadFooter, createEventCard, renderEvents };
}