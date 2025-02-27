// organizer.js
import { signUpUser, signInUser, saveUserProfile, onUserStateChanged } from './firebase.js';

// Listen for auth state changes (optional)
onUserStateChanged(user => {
  if (user) {
    console.log("User logged in:", user.email);
  }
});

// Handle Sign In
document.getElementById('signInBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    await signInUser(email, password);
    window.location.href = 'organization-dashboard.html';
  } catch (error) {
    console.error("Sign In Error:", error);
    alert("Sign In Error: " + error.message);
  }
});

// Handle Sign Up as Organizer
document.getElementById('signUpBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const userCred = await signUpUser(email, password);
    const uid = userCred.user.uid;
    const organizerData = {
      email,
      role: 'organizer',
      createdAt: new Date().toISOString()
    };
    await saveUserProfile(uid, organizerData);
    window.location.href = 'organization-dashboard.html';
  } catch (error) {
    console.error("Sign Up Error:", error);
    alert("Sign Up Error: " + error.message);
  }
});

//handling the functionality of when you click check then only you
//can enter the price and if the checkbox is unclicked then the price 
//field will be disabled
document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const priceInput = this.parentElement.nextElementSibling;
    priceInput.disabled = !this.checked;
    if (!this.checked) priceInput.value = "";
  });
});
