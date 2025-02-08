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
  getDoc
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// TODO: Replace with your app's Firebase project configuration
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

/**
 * signUpUser(email, password)
 * Creates a new user in Firebase Auth
 * Returns the user credential
 */
export async function signUpUser(email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  return userCred;
}

/**
 * signInUser(email, password)
 * Signs in an existing user
 * Returns the user credential
 */
export async function signInUser(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred;
}

/**
 * signOutUser()
 * Signs out the currently logged in user
 */
export function signOutUser() {
  return signOut(auth);
}

/**
 * onUserStateChanged(callback)
 * Triggers the callback whenever the Auth state changes (login/logout)
 */
export function onUserStateChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * saveUserProfile(uid, profileData)
 * Stores/updates the user's profile in Firestore under "users/{uid}"
 */
export async function saveUserProfile(uid, profileData) {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, profileData, { merge: true });
}

/**
 * getUserProfile(uid)
 * Gets the user's profile from Firestore
 */
export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    return null;
  }
}
