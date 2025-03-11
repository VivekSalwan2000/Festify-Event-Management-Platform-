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
    if (!encodedEventData) {
      throw new Error("No event data provided");
    }
    const eventData = decodeURIComponent(encodedEventData);
    console.log('Decoded event data:', eventData);
    const event = JSON.parse(eventData);
    console.log('Parsed event:', event);
    
    currentEvent = event;
    currentImageIndex = 0;
    
    // Populate popup details, with null checks for each element.
    const titleElem = document.getElementById('eventTitle');
    if (titleElem) titleElem.textContent = event.title || '';
    else console.error("Element with id 'eventTitle' not found");
    
    const descElem = document.getElementById('eventDescription');
    if (descElem) descElem.textContent = event.description || '';
    
    const dateElem = document.getElementById('eventDate');
    if (dateElem) dateElem.textContent = event.date || '';
    
    const timeElem = document.getElementById('eventTime');
    if (timeElem) timeElem.textContent = `${formatTime(event.startTime)} - ${formatTime(event.endTime)}` || '';
    
    const locationElem = document.getElementById('eventLocation');
    if (locationElem) locationElem.textContent = event.location || '';
    
    // Update ticket prices
    const generalPriceElem = document.getElementById('generalPrice');
    if (generalPriceElem) {
      generalPriceElem.textContent = event.generalPrice ? `$${event.generalPrice}` : 'N/A';
    }
    
    // Show/hide senior and child ticket options
    const seniorTickets = document.getElementById('seniorTickets');
    if (seniorTickets) {
      if (event.seniorPrice) {
        seniorTickets.style.display = 'grid';
        const seniorPriceElem = document.getElementById('seniorPrice');
        if (seniorPriceElem) {
          seniorPriceElem.textContent = `$${event.seniorPrice}`;
        }
      } else {
        seniorTickets.style.display = 'none';
      }
    }
    
    const childTickets = document.getElementById('childTickets');
    if (childTickets) {
      if (event.childPrice) {
        childTickets.style.display = 'grid';
        const childPriceElem = document.getElementById('childPrice');
        if (childPriceElem) {
          childPriceElem.textContent = `$${event.childPrice}`;
        }
      } else {
        childTickets.style.display = 'none';
      }
    }
    
    // Reset quantities
    const generalQty = document.getElementById('generalQuantity');
    if (generalQty) generalQty.value = '0';
    const seniorQty = document.getElementById('seniorQuantity');
    if (seniorQty) seniorQty.value = '0';
    const childQty = document.getElementById('childQuantity');
    if (childQty) childQty.value = '0';
    
    // Set images for popup
    const eventImage1 = document.getElementById('eventImage1');
    if (eventImage1) eventImage1.src = event.imageUrl || '';
    const eventImage2 = document.getElementById('eventImage2');
    if (eventImage2) eventImage2.src = event.imageUrl2 || '';
    const eventImage3 = document.getElementById('eventImage3');
    if (eventImage3) eventImage3.src = event.imageUrl3 || '';
    
    // Set up hover effect for images
    const images = document.querySelectorAll('.event-images img');
    const hoveredImage = document.getElementById('hoveredImage');
    if (hoveredImage) {
      images.forEach((image) => {
        image.addEventListener('mouseover', () => {
          hoveredImage.src = image.src;
          hoveredImage.style.display = 'block';
        });
        image.addEventListener('mouseout', () => {
          hoveredImage.style.display = 'none';
        });
      });
    }
    
    // Show popup: check for existence of the 'content' and 'eventPopup' elements.
    const contentElem = document.getElementById('content');
    if (contentElem) {
      contentElem.classList.add('active');
    } else {
      console.warn("Element with id 'content' not found.");
    }
    
    const popupElem = document.getElementById('eventPopup');
    if (popupElem) {
      popupElem.classList.remove('hidden');
    } else {
      console.error("Element with id 'eventPopup' not found.");
      return;
    }
    document.body.classList.add('popup-open');
    
    console.log("Popup shown successfully.");
  } catch (error) {
    console.error('Error showing event popup:', error);
  }
};

// Function to close event popup
window.closeEventPopup = function() {
  const contentElem = document.getElementById('content');
  if (contentElem) {
    contentElem.classList.remove('active');
  }
  const popupElem = document.getElementById('eventPopup');
  if (popupElem) {
    popupElem.classList.add('hidden');
  }
  document.body.classList.remove('popup-open');
};

// Function to update ticket quantities
window.updateQuantity = function(type, change) {
  const input = document.getElementById(`${type}Quantity`);
  const currentVal = parseInt(input ? input.value : '0', 10);
  const newValue = Math.max(0, currentVal + change);
  if (input) input.value = newValue;
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
      const eventsGrid = document.getElementById('eventsGrid');
      if (eventsGrid) {
        eventsGrid.innerHTML = '<p>No events found</p>';
      }
      return;
    }
    
    console.log('Rendering events...');
    renderEvents(events);
    console.log('Events rendered');
  } catch (error) {
    console.error("Error rendering events:", error);
    const eventsGrid = document.getElementById('eventsGrid');
    if (eventsGrid) {
      eventsGrid.innerHTML = '<p>Error loading events</p>';
    }
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
