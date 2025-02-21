import {
  formatDate,
  formatCurrency,
  renderEvents,
  showEventForm,
  hideEventForm,
  showProfileForm,
  hideProfileForm,
  resetDashboard,
  triggerFileInput
} from '../Festify/script.js';

describe('script.js functions', () => {
  test('formatDate() should format date strings', () => {
    const formatted = formatDate("2024-06-15");
    // Since toLocaleDateString may vary, check for key parts
    expect(formatted).toMatch(/2024/);
    expect(formatted).toMatch(/June|6/);
  });

  test('formatCurrency() should format numbers as USD', () => {
    const formatted = formatCurrency(12500);
    expect(formatted).toContain('$');
    expect(formatted).toContain('12,500');
  });

  describe('renderEvents()', () => {
    beforeEach(() => {
      document.body.innerHTML = `<div id="eventsGrid"></div>`;
    });

    it('should render event cards in #eventsGrid', () => {
      renderEvents();
      const grid = document.getElementById('eventsGrid');
      // Check that at least one known event title is present.
      expect(grid.innerHTML).toContain("Tech Conference 2024");
      expect(grid.innerHTML).toContain("Digital Marketing Summit");
      expect(grid.innerHTML).toContain("Startup Networking Event");
    });
  });

  describe('Form display functions', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="metrics-section" style="display: block;"></div>
        <div class="events-section" style="display: block;"></div>
        <div id="eventFormSection" style="display: none;"></div>
        <div id="profileFormSection" style="display: none;"></div>
      `;
    });

    test('showEventForm() should show event form and hide others', () => {
      showEventForm();
      expect(document.getElementById('eventFormSection').style.display).toBe('block');
      expect(document.getElementById('profileFormSection').style.display).toBe('none');
      expect(document.querySelector('.metrics-section').style.display).toBe('none');
      expect(document.querySelector('.events-section').style.display).toBe('none');
    });

    test('hideEventForm() should reset display to show metrics and events', () => {
      // First, show event form.
      document.getElementById('eventFormSection').style.display = 'block';
      hideEventForm();
      expect(document.getElementById('eventFormSection').style.display).toBe('none');
      expect(document.querySelector('.metrics-section').style.display).toBe('block');
      expect(document.querySelector('.events-section').style.display).toBe('block');
    });

    test('showProfileForm() and hideProfileForm()', () => {
      showProfileForm();
      expect(document.getElementById('profileFormSection').style.display).toBe('block');
      expect(document.querySelector('.metrics-section').style.display).toBe('none');
      expect(document.querySelector('.events-section').style.display).toBe('none');

      hideProfileForm();
      expect(document.getElementById('profileFormSection').style.display).toBe('none');
      expect(document.querySelector('.metrics-section').style.display).toBe('block');
      expect(document.querySelector('.events-section').style.display).toBe('block');
    });

    test('resetDashboard() should hide forms and re-render events', () => {
      // Set up initial DOM
      document.body.innerHTML = `
        <div class="metrics-section" style="display: block;"></div>
        <div class="events-section" style="display: block;"></div>
        <div id="eventFormSection" style="display: block;"></div>
        <div id="profileFormSection" style="display: block;"></div>
        <div id="eventsGrid"></div>
      `;
      // Spy on renderEvents. Since renderEvents is imported, you can also spy on it using jest.spyOn.
      const renderSpy = jest.spyOn({ renderEvents }, 'renderEvents').mockImplementation(renderEvents);
      resetDashboard();
      expect(document.getElementById('eventFormSection').style.display).toBe('none');
      expect(document.getElementById('profileFormSection').style.display).toBe('none');
      expect(document.querySelector('.metrics-section').style.display).toBe('block');
      expect(document.querySelector('.events-section').style.display).toBe('block');
      expect(renderSpy).toHaveBeenCalled();
      renderSpy.mockRestore();
    });
  });

  describe('triggerFileInput()', () => {
    test('should call click on file input element', () => {
      // Create a dummy file input with a jest spy on click.
      document.body.innerHTML = `<input type="file" id="fileInput">`;
      const fileInput = document.getElementById('fileInput');
      fileInput.click = jest.fn();
      triggerFileInput();
      expect(fileInput.click).toHaveBeenCalled();
    });
  });
});
