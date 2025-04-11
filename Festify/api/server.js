const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Festify API' });
});

// Add test events endpoint
app.post('/api/test-events', async (req, res) => {
  try {
    const eventsRef = collection(db, 'events');
    
    // Sample events
    const testEvents = [
      {
        title: "Summer Music Festival",
        date: "2024-07-15",
        location: "Central Park",
        description: "Annual summer music festival featuring local bands",
        price: 50,
        ticketsAvailable: 1000
      },
      {
        title: "Tech Conference 2024",
        date: "2024-08-20",
        location: "Convention Center",
        description: "Annual technology conference with workshops and speakers",
        price: 200,
        ticketsAvailable: 500
      },
      {
        title: "Food & Wine Expo",
        date: "2024-09-10",
        location: "Downtown Expo Hall",
        description: "Sample food and wine from local vendors",
        price: 75,
        ticketsAvailable: 300
      }
    ];

    // Add each event to Firestore
    const results = await Promise.all(
      testEvents.map(event => addDoc(eventsRef, event))
    );

    res.json({
      message: 'Test events created successfully',
      eventIds: results.map(doc => doc.id)
    });
  } catch (error) {
    console.error('Error creating test events:', error);
    res.status(500).json({ error: 'Failed to create test events' });
  }
});

// Event Routes
app.get('/api/events', async (req, res) => {
  try {
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'No events found' });
    }

    const events = [];
    snapshot.forEach(doc => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    // TODO: Implement event creation in Firebase
    res.json({ message: 'Create new event' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    // TODO: Implement single event fetching from Firebase
    res.json({ message: `Get event with ID: ${eventId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Routes
app.post('/api/users/register', async (req, res) => {
  try {
    // TODO: Implement user registration
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    // TODO: Implement user login
    res.json({ message: 'User logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Organization Routes
app.post('/api/organizations', async (req, res) => {
  try {
    // TODO: Implement organization registration
    res.json({ message: 'Organization registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/organizations/:id/events', async (req, res) => {
  try {
    const orgId = req.params.id;
    // TODO: Implement fetching organization's events
    res.json({ message: `Get events for organization: ${orgId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 