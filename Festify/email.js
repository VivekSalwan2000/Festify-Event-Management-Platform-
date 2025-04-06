// email.js - Email sending functionality
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";

/**
 * Send a welcome email to a newly registered user
 * @param {string} userEmail - The email address of the new user
 * @param {string} userName - The name of the new user (optional)
 * @returns {Promise} - Promise resolving when email is sent
 */
export async function sendWelcomeEmail(userEmail, userName = '') {
  try {
    // EmailJS configuration
    const serviceID = 'service_0k8kvpq';
    const templateID = 'template_ojujtlo';
    
    // Template parameters
    const templateParams = {
      email: userEmail,
      to_name: userName || userEmail.split('@')[0],
      subject: 'Welcome to Festify!',
      message: `Welcome to Festify! We're excited to have you on board. Start exploring amazing events or create your own.`,
    };

    // Send the email using EmailJS
    const response = await emailjs.send(serviceID, templateID, templateParams);
    console.log('Welcome email sent successfully:', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw the error to prevent disrupting the signup process
    return null;
  }
} 