// client/src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { checkAuthStatus, logoutAdmin } from "./api";
import "./index.css";

function App() {
  // null: initial state, true: logged in, false: not logged in
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const verifyAuth = useCallback(async () => {
    try {
      const data = await checkAuthStatus();
      setIsAuthenticated(data.isAuthenticated);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false); // Assume not authenticated on error
    }
  }, []);

  useEffect(() => {
    verifyAuth(); // Check auth status on initial load
  }, [verifyAuth]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      // Error is logged in api.js, we still want to update UI
      console.warn("Logout API failed, proceeding client-side");
    } finally {
      setIsAuthenticated(false);
      // Navigate should happen within AdminPage after logout ideally,
      // but we ensure state is false here.
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route
            path="/admin/login"
            element={
              isAuthenticated === true ? ( // If already logged in, redirect from login page
                <Navigate to="/admin" replace />
              ) : (
                <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminPage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Not Found Route */}
          <Route
            path="*"
            element={
              <div className="text-center py-10">
                <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
                <p className="text-xl text-gray-700 mb-6">
                  Oops! Page Not Found.
                </p>
                <Link
                  to="/"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200"
                >
                  Go Back Home
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
