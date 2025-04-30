// client/src/components/QueueDisplay.jsx
import React, { useState, useEffect } from "react";
import { getQueueStatus } from "../api";
import AlertMessage from "./AlertMessage";
import LoadingSpinner from "./LoadingSpinner";
import {
  UsersIcon,
  UserIcon,
  UserGroupIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"; // Import icons

function QueueDisplay() {
  const [queueInfo, setQueueInfo] = useState({
    totalWaiting: 0,
    currentPatient: null,
    nextPatient: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError("");
    try {
      const data = await getQueueStatus();
      setQueueInfo(data);
    } catch (err) {
      setError(err.message);
      setQueueInfo({
        totalWaiting: 0,
        currentPatient: null,
        nextPatient: null,
      }); // Reset on error
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue(true); // Initial fetch with loading
    const intervalId = setInterval(() => fetchQueue(false), 15000); // Refresh without loading indicator
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto mt-6 md:mt-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UsersIcon className="h-8 w-8 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Live Queue</h2>
        </div>
        <button
          onClick={() => fetchQueue(true)}
          disabled={isLoading}
          className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-50"
          title="Refresh Status"
        >
          <ArrowPathIcon
            className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {isLoading &&
        queueInfo.currentPatient === null && ( // Show spinner only on initial load or manual refresh
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
            <span className="ml-3 text-gray-500">Loading queue...</span>
          </div>
        )}

      {!isLoading && error && <AlertMessage type="error" message={error} />}

      {!error && !isLoading && queueInfo.totalWaiting === 0 && (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No Patients Waiting
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The queue is currently empty.
          </p>
        </div>
      )}

      {/* Show queue info once loaded, even if refreshing in background */}
      {!error &&
        (queueInfo.currentPatient !== null ||
          queueInfo.totalWaiting > 0 ||
          !isLoading) &&
        queueInfo.totalWaiting >= 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <UserIcon className="h-6 w-6 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-blue-800">
                  Currently Serving:
                </span>
              </div>
              <span className="text-lg font-bold text-blue-700">
                {queueInfo.currentPatient || "---"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-yellow-600 mr-3" />
                <span className="text-sm font-medium text-yellow-800">
                  Next Patient:
                </span>
              </div>
              <span className="text-lg font-semibold text-yellow-700">
                {queueInfo.nextPatient || "---"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center">
                <UsersIcon className="h-6 w-6 text-indigo-600 mr-3" />
                <span className="text-sm font-medium text-indigo-800">
                  Total Waiting:
                </span>
              </div>
              <span className="text-2xl font-extrabold text-indigo-700">
                {queueInfo.totalWaiting}
              </span>
            </div>
          </div>
        )}
    </div>
  );
}

export default QueueDisplay;
