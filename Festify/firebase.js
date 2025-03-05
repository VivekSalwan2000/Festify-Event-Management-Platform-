// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe0ZCrJCtspANzB-is2Hh8gvkyvLNcRmA",
  authDomain: "fir-festify.firebaseapp.com",
  projectId: "fir-festify",
  storageBucket: "fir-festify.firebasestorage.app",
  messagingSenderId: "827425396836",
  appId: "1:827425396836:web:f3e9a41e9515e3f2b3a771",
  measurementId: "G-TNBDKZEDH1"
};

// Initialize the Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics for the app
const analytics = getAnalytics(app);

// Initialize Firebase Authentication for the app
const auth = getAuth(app);

// Initialize Firestore (Firebase's NoSQL database) for the app
const db = getFirestore(app);


/* ------------------------------
   Authentication Functions
------------------------------ */
export async function signUpUser(email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  return userCred;
}

export async function signInUser(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred;
}

export function signOutUser() {
  return signOut(auth);
}

export function onUserStateChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

// Define an asynchronous function to save or update the user's profile data
export async function saveUserProfile(uid, profileData) {
  // Get the reference to the user document in the "users" collection by the provided uid
  const docRef = doc(db, "users", uid);

  // Set the profile data in the document, merging it with the existing data if any
  await setDoc(docRef, profileData, { merge: true });
}


// Define an asynchronous function to get the profile of a user by their unique ID (uid)
export async function getUserProfile(uid) {
  // Get the reference to the user document in the "users" collection by the provided uid
  const docRef = doc(db, "users", uid);

  // Fetch the document snapshot from the database
  const snapshot = await getDoc(docRef);

  // Check if the document exists and return the data, otherwise return null
  return snapshot.exists() ? snapshot.data() : null;
}


// Define an asynchronous function to fetch all events
export async function fetchEvents() {
  try {
    // Get the reference to the "events" collection in the database
    const eventsCol = collection(db, "events");

    // Execute the query to get the events snapshot
    const eventsSnapshot = await getDocs(eventsCol);

    // Map through the snapshot documents to create an array of event objects with their id and data
    const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Return the list of events
    return eventsList;
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.error("Error fetching events:", error);

    // Return an empty array in case of an error
    return [];
  }
}


// Define an asynchronous function to fetch events for a specific user
export async function fetchUserEvents(userId) {
  try {
    // Get the reference to the "events" collection in the database
    const eventsCol = collection(db, "events");

    // Create a query to filter events where the organizerId matches the provided userId
    const q = query(eventsCol, where("organizerId", "==", userId));

    // Execute the query to get the events snapshot
    const eventsSnapshot = await getDocs(q);

    // Map through the snapshot documents to create an array of event objects with their id and data
    const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Return the list of events
    return eventsList;
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.error("Error fetching user events:", error);

    // Return an empty array in case of an error
    return [];
  }
}

// Define an asynchronous function to create a new event with the provided event data
export async function createNewEvent(eventData) {
  try {
    // Add a new document to the "events" collection with the provided event data
    const docRef = await addDoc(collection(db, "events"), eventData);

    // Log the ID of the newly created event document
    console.log("Event created with ID:", docRef.id);

    // Return the ID of the newly created event
    return docRef.id;
  } catch (error) {
    // Log any errors that occur during the event creation process
    console.error("Error creating event:", error);

    // Throw the error to be handled by the caller
    throw error;
  }
}

export async function updateEvent(eventId, eventData) {
  const eventRef = firebase.firestore().collection('events').doc(eventId);
  await eventRef.update(eventData);
}



