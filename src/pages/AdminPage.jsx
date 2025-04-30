import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAdminQueue, markPatientDone } from "../api";

function AdminPage() {
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // Track which patient is being marked done

  const fetchAdminQueue = useCallback(async () => {
    // Keep loading state only on initial load
    // setIsLoading(true); // Avoid setting loading on refresh
    setError("");
    try {
      const data = await getAdminQueue();
      setQueue(data);
    } catch (err) {
      setError(err.message);
      setQueue([]); // Clear queue on error
    } finally {
      setIsLoading(false); // Ensure loading is false after fetch completes
    }
  }, []); // No dependencies, fetchAdminQueue itself doesn't change

  useEffect(() => {
    fetchAdminQueue();
    const intervalId = setInterval(fetchAdminQueue, 20000); // Refresh every 20 seconds
    return () => clearInterval(intervalId);
  }, [fetchAdminQueue]); // Depend on the memoized fetch function

  const handleMarkDone = async (mongoId, patientName) => {
    if (!window.confirm(`Mark patient "${patientName}" as done?`)) {
      return;
    }
    setError("");
    setMessage("");
    setProcessingId(mongoId); // Indicate processing for this specific patient
    try {
      const result = await markPatientDone(mongoId);
      setMessage(result.message);
      // Refresh queue immediately after marking done
      fetchAdminQueue();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null); // Clear processing indicator
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-red-700">
        Admin - Active Queue
      </h1>
      <div className="text-center mb-6">
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          ← Back to Patient View
        </Link>
        <button
          onClick={() => {
            setIsLoading(true);
            fetchAdminQueue();
          }} // Allow manual refresh
          disabled={isLoading}
          className="ml-4 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          {isLoading ? "Refreshing..." : "Refresh Queue"}
        </button>
      </div>

      {message && (
        <p className="mb-4 text-green-600 bg-green-100 p-3 rounded text-center">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 text-red-600 bg-red-100 p-3 rounded text-center">
          {error}
        </p>
      )}

      <div className="bg-white p-4 border rounded shadow-md overflow-x-auto">
        {isLoading && queue.length === 0 && (
          <p className="text-center text-gray-500">Loading queue...</p>
        )}
        {!isLoading && queue.length === 0 && !error && (
          <p className="text-center text-gray-500">
            The queue is currently empty.
          </p>
        )}

        {queue.length > 0 && (
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
                  Patient Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Booking Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Booking ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queue.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={index === 0 ? "bg-yellow-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {booking.patientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.bookingTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {booking.bookingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        handleMarkDone(booking._id, booking.patientName)
                      }
                      disabled={
                        processingId === booking._id || processingId !== null
                      } // Disable if this one or any other is processing
                      className={`px-3 py-1 rounded text-white text-xs ${
                        processingId === booking._id
                          ? "bg-gray-400 cursor-wait"
                          : processingId !== null
                          ? "bg-green-300 cursor-not-allowed" // Dim if another action is in progress
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {processingId === booking._id
                        ? "Processing..."
                        : "Mark Done"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
