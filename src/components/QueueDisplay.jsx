import React, { useState, useEffect } from "react";
import { getQueueStatus } from "../api";

function QueueDisplay() {
  const [queueInfo, setQueueInfo] = useState({
    queue: [],
    currentPatient: "Loading...",
    nextPatient: "Loading...",
    totalWaiting: 0,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = async () => {
    // Don't set loading to true on refresh to avoid flicker
    try {
      setError("");
      const data = await getQueueStatus();
      setQueueInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Set loading to false after initial load
    }
  };

  useEffect(() => {
    fetchQueue(); // Initial fetch
    const intervalId = setInterval(fetchQueue, 15000); // Refresh every 15 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Current Queue Status
      </h2>
      {isLoading && (
        <p className="text-center text-gray-500">Loading queue...</p>
      )}
      {!isLoading && error && (
        <p className="text-center text-red-600 bg-red-100 p-3 rounded">
          {error}
        </p>
      )}
      {!isLoading && !error && (
        <div className="space-y-3 text-center">
          <p className="text-lg">
            <span className="font-medium">Total Waiting:</span>
            <span className="text-2xl font-bold text-indigo-600 ml-2">
              {queueInfo.totalWaiting}
            </span>
          </p>
          <p>
            <span className="font-medium">Currently Serving:</span>
            <span className="text-indigo-700 font-semibold ml-2">
              {queueInfo.currentPatient}
            </span>
          </p>
          <p>
            <span className="font-medium">Next Patient:</span>
            <span className="text-gray-600 ml-2">{queueInfo.nextPatient}</span>
          </p>
          {/* Optional: Display the number list if needed */}
          {/* {queueInfo.queue.length > 0 && (
            <div className="mt-3 pt-3 border-t">
                <h3 className="text-sm font-medium text-gray-600">Waiting List:</h3>
                <ol className="list-decimal list-inside text-gray-500 text-sm">
                {queueInfo.queue.map((item) => (
                    <li key={item.position}>Position {item.position}</li>
                ))}
                </ol>
            </div>
            )} */}
          <button
            onClick={fetchQueue}
            className="mt-4 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
          >
            Refresh Status
          </button>
        </div>
      )}
    </div>
  );
}

export default QueueDisplay;
