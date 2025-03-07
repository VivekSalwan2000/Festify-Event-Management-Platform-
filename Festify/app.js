// app.js
import { fetchEvents } from './firebase.js';

let eventsCache = []; // Cache to store fetched events

// Global variables
let currentImageIndex = 0;
let currentEvent = null;

// Function to format time from 24-hour to 12-hour format with AM/PM
function formatTime(time) {
  const [hour, minute] = time.split(':');
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert to 12-hour format
  return `${formattedHour}:${minute} ${suffix}`;
}

// Function to create event card HTML
function createEventCard(event) {
  const eventData = encodeURIComponent(JSON.stringify(event));
  return `
    <div class="event-card" onclick="showEventPopup('${eventData}')" style="cursor: pointer;">
      <div class="event-image-container">
        <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
        <div class="event-price">${event.generalPrice ? `$${event.generalPrice}` : 'N/A'}</div>
      </div>
      <div class="event-details">
        <h3 class="event-title">${event.title}</h3>
        <div class="event-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${event.date}</span>
        </div>
        <div class="event-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${formatTime(event.startTime)} - ${formatTime(event.endTime)}</span>
        </div>
        <div class="event-info">
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

window.showEventPopup = function(encodedEventData) {

  try {
    console.log('Received encoded event data:', encodedEventData);
    const eventData = decodeURIComponent(encodedEventData);
    console.log('Decoded event data:', eventData);
    const event = JSON.parse(eventData);
    console.log('Parsed event:', event);
    
    currentEvent = event;
    currentImageIndex = 0;
    
    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventDescription').textContent = event.description || '';
    document.getElementById('eventDate').textContent = event.date;
    document.getElementById('eventTime').textContent = `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
    document.getElementById('eventLocation').textContent = event.location;
    
    // Update ticket prices
    document.getElementById('generalPrice').textContent = event.generalPrice ? `$${event.generalPrice}` : 'N/A';
    
    // Show/hide senior and child ticket options
    const seniorTickets = document.getElementById('seniorTickets');
    const childTickets = document.getElementById('childTickets');
    
    if (event.seniorPrice) {
      seniorTickets.style.display = 'grid';
      document.getElementById('seniorPrice').textContent = `$${event.seniorPrice}`;
    } else {
      seniorTickets.style.display = 'none';
    }
    
    if (event.childPrice) {
      childTickets.style.display = 'grid';
      document.getElementById('childPrice').textContent = `$${event.childPrice}`;
    } else {
      childTickets.style.display = 'none';
    }
    
    // Reset quantities
    document.getElementById('generalQuantity').value = '0';
    document.getElementById('seniorQuantity').value = '0';
    document.getElementById('childQuantity').value = '0';
    
    // Directly set the image sources
    document.getElementById('eventImage1').src = event.imageUrl || '';
    document.getElementById('eventImage2').src = event.imageUrl2 || '';
    document.getElementById('eventImage3').src = event.imageUrl3 || '';

    
    // Show popup and set up hover effect
    const images = document.querySelectorAll('.event-images img');
    const hoveredImage = document.getElementById('hoveredImage');

    images.forEach((image) => {
        image.addEventListener('mouseover', () => {
            hoveredImage.src = image.src; // Set the hovered image source
            hoveredImage.style.display = 'block'; // Show the hovered image
        });

        image.addEventListener('mouseout', () => {
            hoveredImage.style.display = 'none'; // Hide the hovered image
        });
    });

    document.getElementById('content').classList.add('active');
    document.getElementById('eventPopup').classList.remove('hidden');
    document.body.classList.add('popup-open');
  } catch (error) {
    console.error('Error showing event popup:', error);
  }
};

// Function to close event popup
window.closeEventPopup = function() {
  document.getElementById('content').classList.remove('active');
  document.getElementById('eventPopup').classList.add('hidden');
  document.body.classList.remove('popup-open');
};

// Function to update image slider
function updateImageSlider() {
  if (!currentEvent) return;
  const imagesContainer = document.getElementById('eventImages');
  imagesContainer.style.transform = `translateX(-${currentImageIndex * 100}%)`;
}

// Functions for image navigation
window.prevImage = function() {
  if (!currentEvent) return;
  const images = currentEvent.images || [currentEvent.imageUrl];
  currentImageIndex = Math.max(0, currentImageIndex - 1);
  updateImageSlider();
};

window.nextImage = function() {
  if (!currentEvent) return;
  const images = currentEvent.images || [currentEvent.imageUrl];
  currentImageIndex = Math.min(images.length - 1, currentImageIndex + 1);
  updateImageSlider();
};

// Function to update ticket quantities
window.updateQuantity = function(type, change) {
  const input = document.getElementById(`${type}Quantity`);
  const newValue = Math.max(0, parseInt(input.value || '0') + change);
  input.value = newValue;
};

// Function to handle payment
window.proceedToPayment = function() {
  const quantities = {
    general: parseInt(document.getElementById('generalQuantity').value || '0'),
    senior: parseInt(document.getElementById('seniorQuantity').value || '0'),
    child: parseInt(document.getElementById('childQuantity').value || '0')
  };
  console.log('Proceeding to payment with quantities:', quantities);
};

// Function to render events
function renderEvents(events) {
  const eventsGrid = document.getElementById('eventsGrid');
  if (eventsGrid) {
    eventsGrid.innerHTML = events.map(event => createEventCard(event)).join('');
  }
}

// Function to render events from database
async function renderEventsFromDB() {
  try {
    console.log('Fetching events...');
    const events = await fetchEvents();
    console.log('Fetched events:', events);
    
    if (!events || events.length === 0) {
      console.log('No events found');
      document.getElementById('eventsGrid').innerHTML = '<p>No events found</p>';
      return;
    }
    
    console.log('Rendering events...');
    renderEvents(events);
    console.log('Events rendered');
  } catch (error) {
    console.error("Error rendering events:", error);
    document.getElementById('eventsGrid').innerHTML = '<p>Error loading events</p>';
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // Load events
  renderEventsFromDB();
  
  // Load footer
  fetch('pageFooter.html')
    .then(response => response.text())
    .then(data => { document.body.insertAdjacentHTML('beforeend', data); })
    .catch(error => console.error('Error loading footer:', error));
});
