// Event data
const events = [
    {
        id: 1,
        title: "Tech Conference 2024",
        date: "2024-06-15",
        status: "upcoming",
        attendees: 250,
        revenue: 12500
    },
    {
        id: 2,
        title: "Digital Marketing Summit",
        date: "2024-03-20",
        status: "upcoming",
        attendees: 150,
        revenue: 7500
    },
    {
        id: 3,
        title: "Startup Networking Event",
        date: "2024-01-10",
        status: "past",
        attendees: 100,
        revenue: 5000
    }
];

// Date formatting
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Currency formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}

// Render events
function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = events.map((event, index) => `
        <div class="event-card" style="animation-delay: ${index * 0.1}s">
            <div class="event-card-content">
                <div class="event-header">
                    <div>
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(event.date)}
                        </p>
                    </div>
                    <span class="event-status ${event.status === 'upcoming' ? 'status-upcoming' : 'status-past'}">
                        ${event.status}
                    </span>
                </div>
                <div class="event-stats">
                    <div>
                        <p class="stat-label">
                            <i class="fas fa-users"></i>
                            Attendees
                        </p>
                        <p class="stat-value">${event.attendees}</p>
                    </div>
                    <div>
                        <p class="stat-label">
                            <i class="fas fa-money-bill-wave"></i>
                            Revenue
                        </p>
                        <p class="stat-value">${formatCurrency(event.revenue)}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show event form
function showEventForm() {
    document.getElementById('eventFormSection').style.display = 'block';
    document.getElementById('profileFormSection').style.display = 'none';
    document.querySelector('.metrics-section').style.display = 'none';
    document.querySelector('.events-section').style.display = 'none';
}


// Hide event form
function hideEventForm() {
    document.getElementById('eventFormSection').style.display = 'none';
    document.getElementById('profileFormSection').style.display = 'none';
    document.querySelector('.metrics-section').style.display = 'block';
    document.querySelector('.events-section').style.display = 'block';
}


// Show profile form
function showProfileForm() {
    document.getElementById('profileFormSection').style.display = 'block';
    document.querySelector('.metrics-section').style.display = 'none';
    document.querySelector('.events-section').style.display = 'none';
    document.getElementById('eventFormSection').style.display = 'none';
}

// Hide profile form
function hideProfileForm() {
    document.getElementById('profileFormSection').style.display = 'none';
    document.querySelector('.metrics-section').style.display = 'block';
    document.querySelector('.events-section').style.display = 'block';
}

// Reset dashboard to original state
function resetDashboard() {
    hideEventForm();
    hideProfileForm();
    renderEvents(); // Re-render events when resetting
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderEvents();

    // Create New Event button
    document.querySelector('.btn-primary').addEventListener('click', function() {
        hideProfileForm();
        showEventForm();
    });

    
    // Logo click to reset dashboard
    document.querySelector('.logo').addEventListener('click', function(e) {
        e.preventDefault();
        resetDashboard();
    });

    // Edit profile button
    document.querySelector('.btn-outline').addEventListener('click', showProfileForm);
});

// File upload functions
function triggerFileInput() {
    document.getElementById('fileInput').click();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        events,
        formatDate,
        formatCurrency,
        renderEvents,
        showEventForm,
        hideEventForm,
        showProfileForm,
        hideProfileForm,
        resetDashboard,
        triggerFileInput
    };
  }
  