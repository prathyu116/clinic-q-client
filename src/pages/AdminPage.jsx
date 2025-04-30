// client/src/pages/AdminPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminQueue, markPatientDone } from "../api"; // logoutAdmin is handled in App.jsx now
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  ArrowLeftOnRectangleIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  IdentificationIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Pass onLogout function from App.jsx props
function AdminPage({ onLogout }) {
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const fetchAdminQueue = useCallback(
    async (showLoading = false) => {
      if (showLoading) setIsLoading(true);
      setError("");
      try {
        const data = await getAdminQueue();
        setQueue(data);
      } catch (err) {
        setError(err.message);
        setQueue([]);
        if (err.message.includes("Unauthorized")) {
          // If unauthorized, trigger logout and redirect
          handleLogout();
        }
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [navigate, onLogout]
  ); // Add navigate and onLogout dependencies if used directly

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from App.jsx
    navigate("/admin/login"); // Redirect after logout attempt
  };

  useEffect(() => {
    fetchAdminQueue(true); // Show loading on initial fetch
    const intervalId = setInterval(() => fetchAdminQueue(false), 20000); // Refresh without full loading indicator
    return () => clearInterval(intervalId);
  }, [fetchAdminQueue]);

  const handleMarkDone = async (mongoId, patientName) => {
    // Simplified confirmation
    if (!window.confirm(`Mark patient "${patientName}" as done?`)) return;

    setError("");
    setMessage("");
    setProcessingId(mongoId);
    try {
      const result = await markPatientDone(mongoId);
      setMessage(result.message);
      // Instantly remove from local state for better UX before refetch
      setQueue((prevQueue) => prevQueue.filter((b) => b._id !== mongoId));
      // Fetch might still happen via interval, or uncomment below for immediate refetch
      // fetchAdminQueue(false);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        handleLogout();
      }
    } finally {
      setProcessingId(null);
      // Clear message after a few seconds
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fetchAdminQueue(true)}
            disabled={isLoading}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            title="Refresh Queue"
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition duration-150 ease-in-out"
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
            Logout
          </button>
        </div>
      </div>
      <div className="mb-4">
        <Link
          to="/"
          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          ← Back to Patient View
        </Link>
      </div>

      <AlertMessage type="success" message={message} />
      <AlertMessage type="error" message={error} />

      <div className="bg-white p-6 border rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Active Patient Queue
        </h2>
        {isLoading && queue.length === 0 && (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
            <span className="ml-3 text-gray-500">Loading queue...</span>
          </div>
        )}
        {!isLoading && queue.length === 0 && !error && (
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Queue Clear!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no patients currently waiting.
            </p>
          </div>
        )}

        {queue.length > 0 && (
          <div className="border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <UserIcon className="h-4 w-4 inline mr-1" />
                    Patient Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Booking Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <IdentificationIcon className="h-4 w-4 inline mr-1" />
                    Booking ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queue.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={
                      index === 0
                        ? "bg-yellow-50 hover:bg-yellow-100"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.bookingTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {booking.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() =>
                          handleMarkDone(booking._id, booking.patientName)
                        }
                        disabled={
                          processingId === booking._id ||
                          (processingId !== null &&
                            processingId !== booking._id)
                        }
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${
                          processingId === booking._id
                            ? "bg-gray-400 cursor-wait"
                            : processingId !== null &&
                              processingId !== booking._id
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                        }`}
                      >
                        {processingId === booking._id ? (
                          <>
                            <LoadingSpinner size="h-4 w-4" color="text-white" />
                            <span className="ml-1">Processing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Mark Done
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
