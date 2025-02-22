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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
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

export async function saveUserProfile(uid, profileData) {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, profileData, { merge: true });
}

export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data() : null;
}

/* ------------------------------
   Event Functions
------------------------------ */
// Function to fetch all events (if needed)
export async function fetchEvents() {
  try {
    const eventsCol = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsCol);
    const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return eventsList;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// New function: fetch events for a specific organizer (user)
export async function fetchUserEvents(userId) {
  try {
    const eventsCol = collection(db, "events");
    const q = query(eventsCol, where("organizerId", "==", userId));
    const eventsSnapshot = await getDocs(q);
    const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return eventsList;
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
}

// Function to create a new event
export async function createNewEvent(eventData) {
  try {
    const docRef = await addDoc(collection(db, "events"), eventData);
    console.log("Event created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}
