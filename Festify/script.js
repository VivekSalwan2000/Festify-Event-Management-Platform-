// script.js
import {
    createNewEvent,
    fetchUserEvents,
    onUserStateChanged,
    getUserProfile,
    saveUserProfile
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
          <div class="event-card" style="animation-delay: ${index * 0.1}s">
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
                    Revenue
                  </p>
                  <p class="stat-value">${event.revenue ? formatCurrency(event.revenue) : '$0'}</p>
                </div>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error("Error rendering events:", error);
    }
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
      // Use a placeholder image URL (replace with your upload logic if needed)
      const imageUrl = "https://costar.brightspotcdn.com/dims4/default/7838159/2147483647/strip/true/crop/2048x1365+0+0/resize/2048x1365!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F20230608_CAN_Toronto_Skyline_0001.jpg";
      const price = "$0";
  
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
        price,
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
  })


  //handling the functionality of when you click check then only you
//can enter the price and if the checkbox is unclicked then the price 
//field will be disabled
document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    console.log("hello");
    const priceInput = this.closest(".ticket-options").querySelector("input[type='number']");
    priceInput.disabled = !this.checked;
    if (!this.checked) priceInput.value = "";
  });
});
