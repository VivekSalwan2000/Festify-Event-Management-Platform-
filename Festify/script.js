// script.js
import {
  createNewEvent,
  fetchUserEvents,
  onUserStateChanged,
  getUserProfile,
  saveUserProfile,
  uploadEventImage,
  updateEvent,
  getEventById,
  deleteEvent
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
      const eventCount = events.length;
      document.getElementById("totalEvents").textContent = eventCount;
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
                  <p class="price-item">General: ${formatCurrency(event.generalPrice)}</p>
                  <p class="price-item">Below 13: ${formatCurrency(event.childPrice)}</p>
                  <p class="price-item">Above 55: ${formatCurrency(event.seniorPrice)}</p>
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

// Function to preview images
const previewImages = (event, previewId) => {
  const imageFiles = event.target.files;
  const imageFilesLength = imageFiles.length;

  if (imageFilesLength > 0) {
    const imageFile = imageFiles[0];
    const imageURL = URL.createObjectURL(imageFile);
    const filePreview = document.getElementById(previewId);
    filePreview.src = imageURL;
    filePreview.style.display = 'block';
  }
};

// Function to show edit form
function showEditForm() {
  document.getElementById('editEventFormSection').style.display = 'block';
  document.getElementById('eventFormSection').style.display = 'none';
  document.getElementById('profileFormSection').style.display = 'none';
  document.querySelector('.metrics-section').style.display = 'none';
  document.querySelector('.events-section').style.display = 'none';
}

// Function to hide edit form
function hideEditForm() {
  document.getElementById('editEventFormSection').style.display = 'none';
  document.querySelector('.metrics-section').style.display = 'block';
  document.querySelector('.events-section').style.display = 'block';
}

// Function to populate edit form with event data
function populateEditForm(event) {
  const editEventForm = document.getElementById('editEventForm');
  editEventForm.dataset.eventId = event.id;

  document.getElementById('editTitle').value = event.title || '';
  document.getElementById('editDescription').value = event.description || '';
  document.getElementById('editDate').value = event.date || '';
  document.getElementById('editStartTime').value = event.startTime || '';
  document.getElementById('editEndTime').value = event.endTime || '';
  document.getElementById('editLocation').value = event.location || '';
  document.getElementById('editTicketInput').value = event.tickets || 0;
  document.getElementById('editGeneralPrice').value = event.generalPrice;

  // Handle child price
  if (event.prices?.child) {
    document.getElementById('editEnableChildPrice').checked = true;
    document.getElementById('editChildPrice').disabled = false;
    document.getElementById('editChildPrice').value = event.prices.child;
  } else {
    document.getElementById('editEnableChildPrice').checked = false;
    document.getElementById('editChildPrice').disabled = true;
    document.getElementById('editChildPrice').value = '';
  }

  // Handle senior price
  if (event.prices?.senior) {
    document.getElementById('editEnableSeniorPrice').checked = true;
    document.getElementById('editSeniorPrice').disabled = false;
    document.getElementById('editSeniorPrice').value = event.prices.senior;
  } else {
    document.getElementById('editEnableSeniorPrice').checked = false;
    document.getElementById('editSeniorPrice').disabled = true;
    document.getElementById('editSeniorPrice').value = '';
  }

  // Handle existing images
  if (event.imageUrl) {
    document.getElementById('editPreview-selected-image1').src = event.imageUrl;
    document.getElementById('editPreview-selected-image1').style.display = 'block';
  } else {
    document.getElementById('editPreview-selected-image1').style.display = 'none';
  }

  if (event.imageUrl2) {
    document.getElementById('editPreview-selected-image2').src = event.imageUrl2;
    document.getElementById('editPreview-selected-image2').style.display = 'block';
  } else {
    document.getElementById('editPreview-selected-image2').style.display = 'none';
  }

  if (event.imageUrl3) {
    document.getElementById('editPreview-selected-image3').src = event.imageUrl3;
    document.getElementById('editPreview-selected-image3').style.display = 'block';
  } else {
    document.getElementById('editPreview-selected-image3').style.display = 'none';
  }
}

// Wait for DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Create Event form submission handler
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
        // Sweet alert for success
        Swal.fire({
          icon: 'success',
          title: 'Event Created!',
          text: 'Your event has been created successfully.',
        });

        // Reset form and hide it
        e.target.reset();
        document.getElementById('preview-selected-image1').style.display = 'none';
        document.getElementById('preview-selected-image2').style.display = 'none';
        document.getElementById('preview-selected-image3').style.display = 'none';
        
        // Refresh events display if needed
        renderEventsFromDB();
        hideEventForm();
        
      } catch (error) {
        console.error("Error creating event:", error);
        // SweetAlert for error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create event. Please try again.',
    });
      }
    });
  }

  // Edit Event form submission handler
  const editEventForm = document.getElementById('editEventForm');
  if (editEventForm) {
    editEventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const eventId = editEventForm.dataset.eventId;
      if (!eventId) {
        alert('Error: No event ID found');
        return;
      }

      try {
        // Handle image uploads first
        const imageFile1 = document.getElementById('editFileInput1').files[0];
        const imageFile2 = document.getElementById('editFileInput2').files[0];
        const imageFile3 = document.getElementById('editFileInput3').files[0];
        
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

        // Get updated event data from form
        const updatedEventData = {
          title: document.getElementById('editTitle').value,
          description: document.getElementById('editDescription').value,
          date: document.getElementById('editDate').value,
          startTime: document.getElementById('editStartTime').value,
          endTime: document.getElementById('editEndTime').value,
          location: document.getElementById('editLocation').value,
          tickets: parseInt(document.getElementById('editTicketInput').value),
          generalPrice: parseFloat(document.getElementById('editGeneralPrice').value),
          childPrice: document.getElementById('editEnableChildPrice').checked ? parseFloat(document.getElementById('editChildPrice').value) : null,
          seniorPrice: document.getElementById('editEnableSeniorPrice').checked ? parseFloat(document.getElementById('editSeniorPrice').value) : null,
        };

        // Only include new image URLs if files were uploaded
        if (imageUrl) updatedEventData.imageUrl = imageUrl;
        if (imageUrl2) updatedEventData.imageUrl2 = imageUrl2;
        if (imageUrl3) updatedEventData.imageUrl3 = imageUrl3;

        // Update the event in Firebase
        await updateEvent(eventId, updatedEventData);
        // SweetAlert for success
    Swal.fire({
      icon: 'success',
      title: 'Event Updated!',
      text: 'Your event has been updated successfully.',
    });
        hideEditForm();
        renderEventsFromDB(); // Refresh the events list
      } catch (error) {
        console.error('Error updating event:', error);
        // SweetAlert for error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update event. Error: ' + error.message,
    });
      }
    });
  }

  // Create New Event button
  const createNewEventBtn = document.getElementById('createNewEventBtn');
  if (createNewEventBtn) {
    createNewEventBtn.addEventListener('click', showEventForm);
  }

  // Logo click handler
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      resetDashboard();
    });
  }

  // Edit Profile button
  const editProfileBtn = document.querySelector('.btn.btn-outline');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', showProfileForm);
  }

  // Cancel Edit button
  const cancelEditBtn = document.getElementById('cancel_Edit_Event');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', hideEditForm);
  }

  // Edit form price checkbox handlers
  const editEnableChildPrice = document.getElementById('editEnableChildPrice');
  if (editEnableChildPrice) {
    editEnableChildPrice.addEventListener('change', function() {
      const childPriceInput = document.getElementById('editChildPrice');
      childPriceInput.disabled = !this.checked;
      if (!this.checked) childPriceInput.value = '';
    });
  }

  const editEnableSeniorPrice = document.getElementById('editEnableSeniorPrice');
  if (editEnableSeniorPrice) {
    editEnableSeniorPrice.addEventListener('change', function() {
      const seniorPriceInput = document.getElementById('editSeniorPrice');
      seniorPriceInput.disabled = !this.checked;
      if (!this.checked) seniorPriceInput.value = '';
    });
  }

  // Edit form image upload handlers
  const editUploadBox1 = document.getElementById('editUpload-box1');
  if (editUploadBox1) {
    editUploadBox1.addEventListener('click', () => {
      document.getElementById('editFileInput1').click();
    });
  }

  const editUploadBox2 = document.getElementById('editUpload-box2');
  if (editUploadBox2) {
    editUploadBox2.addEventListener('click', () => {
      document.getElementById('editFileInput2').click();
    });
  }

  const editUploadBox3 = document.getElementById('editUpload-box3');
  if (editUploadBox3) {
    editUploadBox3.addEventListener('click', () => {
      document.getElementById('editFileInput3').click();
    });
  }

  // Edit form file input change handlers
  const editFileInput1 = document.getElementById('editFileInput1');
  if (editFileInput1) {
    editFileInput1.addEventListener('change', (event) => 
      previewImages(event, 'editPreview-selected-image1'));
  }

  const editFileInput2 = document.getElementById('editFileInput2');
  if (editFileInput2) {
    editFileInput2.addEventListener('change', (event) => 
      previewImages(event, 'editPreview-selected-image2'));
  }

  const editFileInput3 = document.getElementById('editFileInput3');
  if (editFileInput3) {
    editFileInput3.addEventListener('change', (event) => 
      previewImages(event, 'editPreview-selected-image3'));
  }

  // File upload helper (if needed)
  function triggerFileInput() {
    consol
    document.getElementById('fileInput').click();
  }

  // Profile form submission handler
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No user is logged in. Please log in again.',
        });
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
        // SweetAlert for success
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your profile has been updated successfully.',
    });
        hideProfileForm();
      } catch (error) {
        // SweetAlert for error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update profile. Error: ' + error.message,
    });
      }
    });
  }

  document.getElementById("cancel_Profile").addEventListener("click", hideProfileForm);
  document.getElementById("cancel_Create_Event").addEventListener("click", hideEventForm);

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

  function setupImagePreview(uploadBoxId, fileInputId, imgPreviewId) {
    const uploadBox = document.getElementById(uploadBoxId);
    const fileInput = document.getElementById(fileInputId);
    const imgPreview = document.getElementById(imgPreviewId);

    uploadBox.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });
}

setupImagePreview("upload-box1", "fileInput1", "preview-selected-image1");
setupImagePreview("upload-box2", "fileInput2", "preview-selected-image2");
setupImagePreview("upload-box3", "fileInput3", "preview-selected-image3");

  // Delete Event button functionality
  const deleteEventBtn = document.getElementById("delete_Event");
  if (deleteEventBtn) {
    deleteEventBtn.addEventListener("click", async () => {
      try {
        const editEventForm = document.getElementById('editEventForm');
        if (!editEventForm) {
          throw new Error('Edit form not found');
        }

        const eventId = editEventForm.dataset.eventId;
        if (!eventId) {
          throw new Error('Could not find event ID');
        }
// SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
        const confirmed = confirm("Are you sure you want to delete this event? This action cannot be undone.");
        
        if (confirmed) {
          const success = await deleteEvent(eventId);
          if (success) {
            // SweetAlert for success
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your event has been deleted.',
        });
            hideEditForm();
            await renderEventsFromDB();
          } else {
            throw new Error('Delete operation failed');
          }
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        // SweetAlert for error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to delete event. Error: ' + error.message,
    });
      }
    });
  }
});