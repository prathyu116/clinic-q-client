import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";
import AdminPage from "./pages/AdminPage";
import "./index.css"; // Ensure Tailwind styles are imported

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Optional: Add a simple Navbar if needed */}
        {/* <nav className="bg-white shadow-sm p-4 mb-4">
             <Link to="/" className="text-lg font-semibold text-indigo-700 mr-4">Home</Link>
             <Link to="/status" className="text-indigo-600 mr-4">Check Status</Link>
             <Link to="/admin" className="text-red-600">Admin</Link>
          </nav> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Optional: Add a 404 Not Found route */}
          <Route
            path="*"
            element={
              <div className="text-center py-10">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                <Link
                  to="/"
                  className="text-indigo-600 hover:underline mt-4 block"
                >
                  Go Home
                </Link>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
