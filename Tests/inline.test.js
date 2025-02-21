/**
 * @jest-environment jsdom
 */

// Add the dummy implementation for the unimplemented API.(was throwing an error as jsdom (which Jest uses for a DOM-like environment) does not implement all browser APIs, such as requestSubmit or navigation features like updating window.location.href)
HTMLFormElement.prototype.requestSubmit = function() {};

describe('Inline JS functions from index.html', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="content" class="active"></div>
      <div id="popup" class="hidden"></div>
      <form id="authForm">
        <input type="email" id="loginEmail" value="test@example.com">
        <input type="password" id="loginPassword" value="password">
        <button id="signInBtn">Sign In</button>
        <button id="signUpBtn">Sign Up</button>
      </form>
    `;
    // Define the inline functions (as in HTML file)
    window.toggle = function () {
      const content = document.getElementById('content');
      const popup = document.getElementById('popup');
      content.classList.toggle('active');
      popup.classList.toggle('hidden');
    };

    window.closePopup = function () {
      const content = document.getElementById('content');
      const popup = document.getElementById('popup');
      content.classList.remove('active');
      popup.classList.add('hidden');
    };
  });

  test('toggle() should remove "active" and "hidden" classes when toggled', () => {
    const content = document.getElementById('content');
    const popup = document.getElementById('popup');

    // Initially, content has "active" and popup has "hidden"
    expect(content.classList.contains('active')).toBe(true);
    expect(popup.classList.contains('hidden')).toBe(true);

    // After toggle, classes should be removed
    window.toggle();
    expect(content.classList.contains('active')).toBe(false);
    expect(popup.classList.contains('hidden')).toBe(false);

    // Toggling again re-adds the classes
    window.toggle();
    expect(content.classList.contains('active')).toBe(true);
    expect(popup.classList.contains('hidden')).toBe(true);
  });

  test('closePopup() should remove "active" from content and add "hidden" to popup', () => {
    // Simulate open state
    const content = document.getElementById('content');
    const popup = document.getElementById('popup');
    content.classList.add('active');
    popup.classList.remove('hidden');

    window.closePopup();
    expect(content.classList.contains('active')).toBe(false);
    expect(popup.classList.contains('hidden')).toBe(true);
  });

  // Optionally, test login event handlers by mocking firebase functions:
  test('Login form sign in and sign up click handlers should call respective functions', async () => {
    // Set up dummy implementations for signInUser and signUpUser
    const signInUser = jest.fn().mockResolvedValue();
    const signUpUser = jest.fn().mockResolvedValue();

    // Attach event listeners similar to inline script
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');

    signInBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      await signInUser(email, password);
      window.location.href = 'profile.html';
    });

    signUpBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      await signUpUser(email, password);
      window.location.href = 'profile.html';
    });

    // Simulate clicking the sign in button
    const signInEvent = new MouseEvent('click', { bubbles: true });
    signInBtn.dispatchEvent(signInEvent);
    await Promise.resolve(); // wait for async handlers
    expect(signInUser).toHaveBeenCalledWith('test@example.com', 'password');

    // Reset window.location.href
    delete window.location;
    window.location = { href: '' };

    // Simulate clicking the sign up button
    const signUpEvent = new MouseEvent('click', { bubbles: true });
    signUpBtn.dispatchEvent(signUpEvent);
    await Promise.resolve();
    expect(signUpUser).toHaveBeenCalledWith('test@example.com', 'password');
  });
});
