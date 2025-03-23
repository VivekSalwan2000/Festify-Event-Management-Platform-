/**
 * @jest-environment jsdom
 */

// Import the functions we want to test
import '../Festify/organizer.js';

// Mock firebase.js module
jest.mock('../Festify/firebase.js', () => {
  // Create a mock function to store the callback
  const onAuthChangedCallback = jest.fn();
  
  return {
    signUpUser: jest.fn(),
    signInUser: jest.fn(),
    saveUserProfile: jest.fn(),
    onUserStateChanged: jest.fn(callback => {
      // Store the callback for testing
      onAuthChangedCallback.mockImplementation(callback);
    }),
    // Expose the callback function for tests
    _getAuthCallback: () => onAuthChangedCallback
  };
});

// Import the mock to access the callback
import { _getAuthCallback } from '../Festify/firebase.js';

describe('organizer.js module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up console spy
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it('should log when user is logged in', () => {
    // Get the callback function
    const callback = _getAuthCallback();
    
    // Simulate calling the callback with a user
    callback({ email: 'test@example.com' });
    
    // Verify log was called
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('User logged in:'),
      'test@example.com'
    );
  });
}); 