import React from "react";

// Category data
const categories = [
  { title: "Theatre & Art", image: "https://via.placeholder.com/150/1E3A8A" },
  { title: "Music", image: "https://via.placeholder.com/150/F43F5E" },
  { title: "Comedy", image: "https://via.placeholder.com/150/F97316" },
  { title: "Courses", image: "https://via.placeholder.com/150/22C55E" },
  { title: "Workshops", image: "https://via.placeholder.com/150/3B82F6" },
  { title: "Pocket Friendly", image: "https://via.placeholder.com/150/14B8A6" },
];

// Event data
const events = [
  {
    title: "1% Club's Retire Early Masterclass with Sharan Hegde",
    category: "Courses",
    date: "January 26 | 4PM",
    location: "Online",
    price: "₹450",
    image: "https://via.placeholder.com/300x200",
  },
  {
    title: "Find your Ikigai (access it anytime, anywhere)",
    category: "Health & Wellness",
    date: "July 4 | 1:31PM",
    location: "Watch On Insider",
    price: "₹399",
    image: "https://via.placeholder.com/300x200",
  },
  {
    title: "Tughlaq - A Rehearsed Reading",
    category: "Theatre",
    date: "Video on Demand",
    location: "Watch On Insider",
    price: "₹149",
    image: "https://via.placeholder.com/300x200",
  },
  {
    title: "Wine 101 by Gargi Kothari",
    category: "Courses",
    date: "Video on Demand",
    location: "Watch On Insider",
    price: "₹1500",
    image: "https://via.placeholder.com/300x200",
  },
];

// Category Card Component
const CategoryCard = ({ title, image }) => (
  <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-md hover:shadow-lg transition-all">
    <img src={image} alt={title} className="w-full h-24 object-cover rounded-md mb-4" />
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
  </div>
);

// Event Card Component
const EventCard = ({ event }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all">
    <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
      <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">
        {event.category}
      </span>
      <p className="text-gray-600 mt-2">{event.date}</p>
      <p className="text-gray-600">{event.location}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-bold">{event.price}</span>
        <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
          Buy Now
        </button>
      </div>
    </div>
  </div>
);

// Main App Component
const App = () => {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">insider.in</h1>
        <nav className="flex space-x-4">
          <a href="#" className="hover:underline">Popular Events</a>
          <a href="#" className="hover:underline">Free Events</a>
          <a href="#" className="hover:underline">Today's Events</a>
        </nav>
        <div className="flex space-x-4">
          <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
            List your event
          </button>
          <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
            Work with us
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center bg-gray-100 py-12">
        <h2 className="text-3xl font-bold mb-4">Find New Experiences</h2>
        <p className="text-gray-600">Explore. Discover. Make a Plan.</p>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={index} title={category.title} image={category.image} />
        ))}
      </section>

      {/* Featured Events */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-4">
        © 2025 insider.in | All rights reserved.
      </footer>
    </div>
  );
};

export default App;
