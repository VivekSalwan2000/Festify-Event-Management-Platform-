// script.js
import {
    createNewEvent,
    fetchUserEvents,
    onUserStateChanged,
    getUserProfile,
    saveUserProfile,
    uploadEventImage
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
              ${event.imageUrl ? `<img src="${event.imageUrl}" alt="${event.title}" class="event-image" />` : ''}
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
      
      try {
        // Get the image file
        const imageFile1 = document.getElementById('fileInput1').files[0];
        const imageFile2 = document.getElementById('fileInput2').files[0];
        const imageFile3 = document.getElementById('fileInput3').files[0];
        let imageUrl = null;
        let imageUrl2 = null;
        let imageUrl3 = null;
        
        if (imageFile1) {
          imageUrl = await uploadEventImage(imageFile1);
        }
        if (imageFile2) {
          imageUrl2 = await uploadEventImage(imageFile2);
        }
        if (imageFile3) {
          imageUrl3 = await uploadEventImage(imageFile3);
        }

        // Get other form data
        const eventData = {
          title: document.getElementById('title').value,
          description: document.getElementById('description').value,
          date: document.getElementById('date').value,
          startTime: document.getElementById('start-time').value,
          endTime: document.getElementById('end-time').value,
          location: document.getElementById('location').value,
          tickets: parseInt(document.getElementById('ticketInput').value),
          generalPrice: parseFloat(document.getElementById('generalPrice').value),
          childPrice: document.getElementById('enableChildPrice').checked ? parseFloat(document.getElementById('childPrice').value) : null,
          seniorPrice: document.getElementById('enableSeniorPrice').checked ? parseFloat(document.getElementById('seniorPrice').value) : null,
          imageUrl: imageUrl, // Add the image URL to event data
          imageUrl2: imageUrl2,
          imageUrl3: imageUrl3,
          organizerId: currentUser ? currentUser.uid : null
        };

        await createNewEvent(eventData);
        
        // Reset form and hide it
        e.target.reset();
        document.getElementById('preview-selected-image1').style.display = 'none';
        document.getElementById('preview-selected-image2').style.display = 'none';
        document.getElementById('preview-selected-image3').style.display = 'none';
        document.getElementById('eventFormSection').style.display = 'none';
        
        // Refresh events display if needed
        renderEventsFromDB();
        
      } catch (error) {
        console.error("Error creating event:", error);
        alert("Failed to create event. Please try again.");
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

  document.getElementById("upload-box1").addEventListener("click", () => {
    document.getElementById('fileInput1').click();
  });
  document.getElementById("upload-box2").addEventListener("click", () => {
    document.getElementById('fileInput2').click();
  });
  document.getElementById("upload-box3").addEventListener("click", () => {
    document.getElementById('fileInput3').click();
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


    /* function is activated when someone clicks on the input image button*/
    const previewImages = (event, previewId) => {
      // Get images currently associated with the event
      const imageFiles = event.target.files;
      const imageFilesLength = imageFiles.length;
    
      if (imageFilesLength > 0) {
        // Get the first image uploaded
        const imageFile = imageFiles[0];
        const imageURL = URL.createObjectURL(imageFile);
        const filePreview = document.getElementById(previewId);
        
        // Input the image tag with the image and unhide the tag
        filePreview.src = imageURL;
        filePreview.style.display = 'block';
      }
    };
    
    // Attach event listeners for three different file inputs
    document.getElementById('fileInput1').addEventListener('change', (event) => previewImages(event, 'preview-selected-image1'));
    document.getElementById('fileInput2').addEventListener('change', (event) => previewImages(event, 'preview-selected-image2'));
    document.getElementById('fileInput3').addEventListener('change', (event) => previewImages(event, 'preview-selected-image3'));