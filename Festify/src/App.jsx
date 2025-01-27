import React, { useState } from "react";

const Card = ({ children, className }) => (
  <div className={`shadow rounded ${className}`}>{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);

const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
  >
    {children}
  </button>
);

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="bg-purple-700 p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">insider.in</div>
        <nav className="flex space-x-4">
          <a href="#" className="hover:underline">
            Popular Events
          </a>
          <a href="#" className="hover:underline">
            Free Events
          </a>
          <a href="#" className="hover:underline">
            Today's Events
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button>List your event</Button>
          <Button>Work with us</Button>
        </div>
      </header>

      <section className="relative bg-gray-800 text-center py-12">
        <h1 className="text-3xl font-bold">Find New Experiences</h1>
        <p className="text-gray-400">Explore. Discover. Make a Plan.</p>
      </section>

      <section className="py-8 px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {["Theatre & Art", "Comedy", "Music", "Courses", "Workshops"].map(
          (category, index) => (
            <Card key={index} className="bg-gray-800 p-4 rounded-md">
              <CardContent>
                <h3 className="text-lg font-semibold text-center">{category}</h3>
              </CardContent>
            </Card>
          )
        )}
      </section>
    </div>
  );
};

const UserPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: "", email: "" });

  const addProfile = () => {
    setProfiles([...profiles, newProfile]);
    setNewProfile({ name: "", email: "" });
    setShowRegisterPopup(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <header className="bg-purple-700 p-4 text-center text-2xl font-bold">
        Manage Profiles
      </header>

      <div className="mt-8">
        <Button
          className="bg-green-600 hover:bg-green-700 mb-4"
          onClick={() => setShowRegisterPopup(true)}
        >
          Add New Profile
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile, index) => (
            <Card key={index} className="bg-gray-800 p-4 rounded-md">
              <CardContent>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-gray-400">{profile.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showRegisterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Register New Profile</h2>
            <input
              type="text"
              placeholder="Name"
              value={newProfile.name}
              onChange={(e) =>
                setNewProfile({ ...newProfile, name: e.target.value })
              }
              className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={newProfile.email}
              onChange={(e) =>
                setNewProfile({ ...newProfile, email: e.target.value })
              }
              className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white"
            />
            <div className="flex justify-end space-x-4">
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowRegisterPopup(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={addProfile}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState("landing");

  return (
    <div>
      {page === "landing" ? <LandingPage /> : <UserPage />}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex justify-center space-x-4">
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setPage("landing")}
        >
          Home
        </Button>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setPage("user")}
        >
          Manage Profiles
        </Button>
      </footer>
    </div>
  );
};

export default App;
