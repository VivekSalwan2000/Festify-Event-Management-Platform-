/**
 * @jest-environment jsdom
 */

// Import the functions we want to test
import '../organizer.js';

// Mock firebase.js module
jest.mock('../firebase.js', () => {
    // Create a mock function to store the callback
  const onAuthChangedCallback = jest.fn();
  
  return {
    signUpUser: jest.fn(),
    signInUser: jest.fn(),
    saveUserProfile: jest.fn(),
    onUserStateChanged: jest.fn(callback => {
      // Store the callback for testing
      onAuthChangedCallback.mockImplementation(callback);
    })
  };
});

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
    //Get onUserStateChanged from the mock
    const onUserStateChangedMock = require('../firebase.js').onUserStateChanged;

    //Get the mock callback that was stored in onUserStateChangedMock
    const callback = onUserStateChangedMock.mock.calls[0][0]
    
    // Simulate calling the callback with a user
    callback({ email: 'test@example.com', uid: '123' });
    
    // Verify log was called
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('User logged in:'),
      'test@example.com'
    );
  });
}); 