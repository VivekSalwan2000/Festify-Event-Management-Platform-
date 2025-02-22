/**
 * @jest-environment jsdom
 */

// Import functions from app.js(export created in app.js is used here)
import { loadFooter, createEventCard, renderEvents } from '../Festify/app.js';

describe('app.js module', () => {
  describe('createEventCard()', () => {
    it('should return valid HTML with event details', () => {
      const event = {
        title: "Test Event",
        date: "January 1, 2025",
        location: "Test Location",
        time: "10:00 AM",
        imageUrl: "https://unsplash.com/photos/person-holding-light-bulb-fIq0tET6llw",
        price: "$10.00"
      };
      const html = createEventCard(event);
      expect(html).toContain(event.title);
      expect(html).toContain(event.date);
      expect(html).toContain(event.location);
      expect(html).toContain(event.time);
      expect(html).toContain(event.imageUrl);
      expect(html).toContain(event.price);
    });
  });

  describe('renderEvents()', () => {
    beforeEach(() => {
      // Create a container element that renderEvents expects.
      document.body.innerHTML = `<div id="eventsGrid"></div>`;
    });

    it('should render event cards into #eventsGrid', () => {
      // Overwrite the global events array with test data.
      window.events = [
        {
          title: "Test Event 1",
          date: "January 1, 2025",
          location: "Location 1",
          time: "10:00 AM",
          imageUrl: "https://unsplash.com/photos/pink-flower-cNGUw-CEsp0",
          price: "$20.00"
        },
        {
          title: "Test Event 2",
          date: "February 1, 2025",
          location: "Location 2",
          time: "2:00 PM",
          imageUrl: "https://unsplash.com/photos/airplane-on-ground-surrounded-with-trees-G85VuTpw6jg",
          price: "Free"
        }
      ];
      renderEvents();
      const grid = document.getElementById('eventsGrid');
      expect(grid.innerHTML).toContain("Test Event 1");
      expect(grid.innerHTML).toContain("Test Event 2");
    });
  });

  describe('loadFooter()', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
      // Reset fetch mock before each test.
      global.fetch = jest.fn();
    });

    it('should append footer content to the body on success', async () => {
      const footerHTML = '<footer>Test Footer Content</footer>';
      global.fetch.mockResolvedValue({
        text: () => Promise.resolve(footerHTML)
      });
      await loadFooter();
      expect(document.body.innerHTML).toContain('Test Footer Content');
    });

    it('should log an error when fetch fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Fetch error"));
      await loadFooter();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading footer:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});
