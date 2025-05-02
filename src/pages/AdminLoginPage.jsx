// client/src/pages/AdminLoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "../api";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  LockClosedIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

// --- Read demo credentials from client-side .env ---
// These MUST start with VITE_
const demoUsername = "admin";
const demoPassword = "password123"; // Replace with your demo credentials
// --- / ---

function AdminLoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setIsLoading(true);
    try {
      await loginAdmin(username, password);
      onLoginSuccess(); // Notify App component
      navigate("/admin"); // Redirect to admin dashboard on success
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <LockClosedIcon className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Admin Panel Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to manage the queue.
          </p>
        </div>

        {/* --- DEMO CREDENTIALS HINT --- */}
        {/* !! IMPORTANT: REMOVE THIS SECTION BEFORE PRODUCTION !! */}
        {demoUsername && demoPassword && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-center">
            <div className="flex items-center justify-center">
              <InformationCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-sm font-medium text-yellow-700">
                Demo Credentials:
              </p>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Username:{" "}
              <code className="font-mono bg-yellow-100 px-1 rounded">
                {demoUsername}
              </code>
              <br />
              Password:{" "}
              <code className="font-mono bg-yellow-100 px-1 rounded">
                {demoPassword}
              </code>
            </p>
            <p className="text-xs font-bold text-red-600 mt-2">
{/*               (For testing only - Remove in production!) */}
            </p>
          </div>
        )}
        {/* --- END DEMO HINT --- */}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username-admin" className="sr-only">
                {" "}
                {/* Unique ID */}
                Username
              </label>
              <input
                id="username-admin" // Unique ID
                name="username"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password-admin" className="sr-only">
                Password
              </label>
              <input
                id="password-admin"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <AlertMessage type="error" message={error} />}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="h-5 w-5" color="text-white" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link
            to="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Patient View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
