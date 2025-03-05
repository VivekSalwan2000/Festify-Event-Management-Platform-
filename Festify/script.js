// script.js
import {
  createNewEvent,
  fetchUserEvents,
  onUserStateChanged,
  getUserProfile,
  saveUserProfile,
  updateEvent
} from './firebase.js';

let currentUser = null;

// Listen for auth state changes and load profile data
onUserStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    // Load user's profile from Firestore and populate profile form fields
    const profileData = await getUserProfile(user.uid);
    if (profileData) {
      document.getElementById('orgName').value = profileData.orgName || '';
      document.getElementById('phone').value = profileData.phone || '';
      document.getElementById('email').value = profileData.email || '';
      document.getElementById('address').value = profileData.address || '';
      document.getElementById('website').value = profileData.website || '';
    }
    // Render events for the logged-in organizer
    renderEventsFromDB();
  } else {
    currentUser = null;
    // Optionally redirect if user is not logged in:
    // window.location.href = 'index.html';
  }
});

// Helper: Format date
function formatDate(dateString) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Helper: Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

// Render events from Firestore for the current user
async function renderEventsFromDB() {
  if (!currentUser) return;
  try {
    const events = await fetchUserEvents(currentUser.uid);
    const eventsGrid = document.getElementById('eventsGrid');
    if (eventsGrid) {
      eventsGrid.innerHTML = events.map((event, index) => `
        <div class="event-card" style="animation-delay: ${index * 0.1}s" data-event-id="${event.id}">
          <div class="event-card-content">
            <div class="event-header">
              <div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-date">
                  <i class="fas fa-calendar"></i>
                  ${event.date ? formatDate(event.date) : ''}
                </p>
              </div>
              <span class="event-status ${event.status === 'upcoming' ? 'status-upcoming' : 'status-past'}">
                ${event.status || ''}
              </span>
            </div>
            <div class="event-stats">
              <div>
                <p class="stat-label">
                  <i class="fas fa-users"></i>
                  Attendees
                </p>
                <p class="stat-value">${event.attendees || 0}</p>
              </div>
              <div>
                <p class="stat-label">
                  <i class="fas fa-money-bill-wave"></i>
                  Prices
                </p>
                <div class="price-list">
                  <p class="price-item">General: ${formatCurrency(event.prices?.general || 0)}</p>
                  ${event.prices?.child ? `<p class="price-item">Below 13: ${formatCurrency(event.prices.child)}</p>` : ''}
                  ${event.prices?.senior ? `<p class="price-item">Above 55: ${formatCurrency(event.prices.senior)}</p>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      // Add click event listeners to all event cards
      const eventCards = eventsGrid.querySelectorAll('.event-card');
      eventCards.forEach(card => {
        card.addEventListener('click', () => {
          const eventId = card.getAttribute('data-event-id');
          const event = events.find(e => e.id === eventId);
          if (event) {
            populateEditForm(event);
            showEditForm();
          }
        });
      });
    }
  } catch (error) {
    console.error("Error rendering events:", error);
  }
}

// Function to populate the edit form with event data
function populateEditForm(event) {
  // Populate basic fields
  document.getElementById('editTitle').value = event.title;
  document.getElementById('editDescription').value = event.description;
  document.getElementById('editDate').value = event.date;
  document.getElementById('editStartTime').value = event.startTime;
  document.getElementById('editEndTime').value = event.endTime;
  document.getElementById('editLocation').value = event.location;
  document.getElementById('editTicketInput').value = event.tickets;
  document.getElementById('editGeneralPrice').value = event.prices.general;

  // Handle child price
  if (event.prices.child) {
    document.getElementById('editEnableChildPrice').checked = true;
    document.getElementById('editChildPrice').value = event.prices.child;
    document.getElementById('editChildPrice').disabled = false;
  } else {
    document.getElementById('editEnableChildPrice').checked = false;
    document.getElementById('editChildPrice').value = '';
    document.getElementById('editChildPrice').disabled = true;
  }

  // Handle senior price
  if (event.prices.senior) {
    document.getElementById('editEnableSeniorPrice').checked = true;
    document.getElementById('editSeniorPrice').value = event.prices.senior;
    document.getElementById('editSeniorPrice').disabled = false;
  } else {
    document.getElementById('editEnableSeniorPrice').checked = false;
    document.getElementById('editSeniorPrice').value = '';
    document.getElementById('editSeniorPrice').disabled = true;
  }

  // Store the event ID in the form for later use
  document.getElementById('editEventForm').dataset.eventId = event.id;
}

// Toggling form functions
function showEventForm() {
  document.getElementById('eventFormSection').style.display = 'block';
  document.getElementById('profileFormSection').style.display = 'none';
  document.querySelector('.metrics-section').style.display = 'none';
  document.querySelector('.events-section').style.display = 'none';
}

function hideEventForm() {
  document.getElementById('eventFormSection').style.display = 'none';
  document.getElementById('profileFormSection').style.display = 'none';
  document.querySelector('.metrics-section').style.display = 'block';
  document.querySelector('.events-section').style.display = 'block';
}

function showProfileForm() {
  document.getElementById('profileFormSection').style.display = 'block';
  document.querySelector('.metrics-section').style.display = 'none';
  document.querySelector('.events-section').style.display = 'none';
  document.getElementById('eventFormSection').style.display = 'none';
}

function hideProfileForm() {
  document.getElementById('profileFormSection').style.display = 'none';
  document.querySelector('.metrics-section').style.display = 'block';
  document.querySelector('.events-section').style.display = 'block';
}

function resetDashboard() {
  hideEventForm();
  hideProfileForm();
  renderEventsFromDB();
}

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  // "Create New Event" button click
  const createNewEventBtn = document.getElementById('createNewEventBtn');
  if (createNewEventBtn) {
    createNewEventBtn.addEventListener('click', showEventForm);
  }

  // Logo click resets dashboard
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      resetDashboard();
    });
  }

  // "Edit Profile" button click
  const editProfileBtn = document.querySelector('.btn.btn-outline');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', showProfileForm);
  }

  // Add event listeners for edit form checkboxes
  const editEnableChildPrice = document.getElementById('editEnableChildPrice');
  const editEnableSeniorPrice = document.getElementById('editEnableSeniorPrice');

  if (editEnableChildPrice) {
    editEnableChildPrice.addEventListener('change', function() {
      const childPriceInput = document.getElementById('editChildPrice');
      childPriceInput.disabled = !this.checked;
      if (!this.checked) childPriceInput.value = '';
    });
  }

  if (editEnableSeniorPrice) {
    editEnableSeniorPrice.addEventListener('change', function() {
      const seniorPriceInput = document.getElementById('editSeniorPrice');
      seniorPriceInput.disabled = !this.checked;
      if (!this.checked) seniorPriceInput.value = '';
    });
  }

  // Add event listener for cancel button in edit form
  const cancelEditEventBtn = document.getElementById('cancel_Edit_Event');
  if (cancelEditEventBtn) {
    cancelEditEventBtn.addEventListener('click', hideEditForm);
  }

  // Add event listener for edit form submission
  const editEventForm = document.getElementById('editEventForm');
  if (editEventForm) {
    editEventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get the event ID from the form's dataset
      const eventId = editEventForm.dataset.eventId;
      if (!eventId) {
        alert('Error: No event ID found');
        return;
      }

      // Get all the updated values from the form
      const updatedEventData = {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        date: document.getElementById('editDate').value,
        startTime: document.getElementById('editStartTime').value,
        endTime: document.getElementById('editEndTime').value,
        location: document.getElementById('editLocation').value,
        tickets: parseInt(document.getElementById('editTicketInput').value),
        prices: {
          general: parseFloat(document.getElementById('editGeneralPrice').value),
          ...(document.getElementById('editEnableChildPrice').checked && { 
            child: parseFloat(document.getElementById('editChildPrice').value) 
          }),
          ...(document.getElementById('editEnableSeniorPrice').checked && { 
            senior: parseFloat(document.getElementById('editSeniorPrice').value) 
          })
        }
      };

      try {
        // Update the event in Firebase
        await updateEvent(eventId, updatedEventData);
        
        // Show success message
        alert('Event updated successfully!');
        
        // Hide the edit form
        hideEditForm();
        
        // Refresh the events list
        renderEventsFromDB();
      } catch (error) {
        console.error('Error updating event:', error);
        alert('Error updating event: ' + error.message);
      }
    });
  }
});

// File upload helper (if needed)
function triggerFileInput() {
  consol
  document.getElementById('fileInput').click();
}

// Event form submission handler
const eventForm = document.getElementById('eventForm');
if (eventForm) {
  eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const location = document.getElementById('location').value;
    const tickets = document.getElementById('ticketInput').value;
    const childPrice = document.getElementById('childPrice').value;
    const generalPrice = document.getElementById('generalPrice').value;
    const seniorPrice = document.getElementById('seniorPrice').value;
    // Use a placeholder image URL (replace with your upload logic if needed)
    const imageUrl = "https://costar.brightspotcdn.com/dims4/default/7838159/2147483647/strip/true/crop/2048x1365+0+0/resize/2048x1365!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F20230608_CAN_Toronto_Skyline_0001.jpg";

    // Include the organizerId when creating a new event
    const eventData = {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      tickets: parseInt(tickets),
      imageUrl,
      prices: {
        general: parseFloat(generalPrice),
        ...(document.getElementById('enableChildPrice').checked && { child: parseFloat(childPrice) }),
        ...(document.getElementById('enableSeniorPrice').checked && { senior: parseFloat(seniorPrice) })
      },
      status: "upcoming",
      organizerId: currentUser ? currentUser.uid : null,
      createdAt: new Date().toISOString()
    };

    try {
      await createNewEvent(eventData);
      alert('Event created successfully!');
      hideEventForm();
      renderEventsFromDB();
    } catch (error) {
      alert('Error creating event: ' + error.message);
    }
  });
}

// Profile form submission handler
const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("No user is logged in. Please log in again.");
      return;
    }
    const orgName = document.getElementById('orgName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const website = document.getElementById('website').value;
    try {
      await saveUserProfile(currentUser.uid, {
        orgName,
        phone,
        email,
        address,
        website
      });
      alert('Profile updated successfully!');
      hideProfileForm();
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  });
}

document.getElementById("cancel_Profile").addEventListener("click", hideProfileForm);
document.getElementById("cancel_Create_Event").addEventListener("click", hideEventForm);

document.getElementById("upload-box").addEventListener("click", () => {
  document.getElementById('fileInput').click();
});

// Handle enabling/disabling price inputs based on checkboxes
document.getElementById('enableChildPrice').addEventListener('change', function() {
  const childPriceInput = document.getElementById('childPrice');
  childPriceInput.disabled = !this.checked;
  if (!this.checked) childPriceInput.value = '';
});

document.getElementById('enableSeniorPrice').addEventListener('change', function() {
  const seniorPriceInput = document.getElementById('seniorPrice');
  seniorPriceInput.disabled = !this.checked;
  if (!this.checked) seniorPriceInput.value = '';
});

// Add function to show edit form
function showEditForm() {
  document.getElementById('editEventFormSection').style.display = 'block';
  document.getElementById('eventFormSection').style.display = 'none';
  document.getElementById('profileFormSection').style.display = 'none';
  document.querySelector('.metrics-section').style.display = 'none';
  document.querySelector('.events-section').style.display = 'none';
}

// Add function to hide edit form
function hideEditForm() {
  document.getElementById('editEventFormSection').style.display = 'none';
  document.querySelector('.metrics-section').style.display = 'block';
  document.querySelector('.events-section').style.display = 'block';
}