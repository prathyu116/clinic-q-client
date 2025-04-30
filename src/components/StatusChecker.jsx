// client/src/components/StatusChecker.jsx
import React, { useState, useEffect } from "react";
import { getBookingDetails, cancelBooking } from "../api";
import AlertMessage from "./AlertMessage";
import LoadingSpinner from "./LoadingSpinner";
import {
  TicketIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckSolid,
  XCircleIcon as XSolid,
} from "@heroicons/react/24/solid"; // Solid icons for status

function StatusChecker() {
  const [bookingIdInput, setBookingIdInput] = useState(""); // Separate input state
  const [bookingInfo, setBookingInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [checkedBookingId, setCheckedBookingId] = useState(""); // Track which ID was checked

  useEffect(() => {
    const lastBookingId = localStorage.getItem("lastBookingId");
    if (lastBookingId) {
      setBookingIdInput(lastBookingId);
      // Don't auto-check, let user click the button if they want
      // handleCheckStatus(null, lastBookingId);
    }
  }, []);

  const handleCheckStatus = async (e, idToCheck) => {
    if (e) e.preventDefault();
    const currentBookingId = (idToCheck || bookingIdInput).trim();

    if (!currentBookingId) {
      setError("Please enter your Booking ID.");
      setBookingInfo(null);
      setCheckedBookingId("");
      return;
    }
    setError("");
    setMessage("");
    setIsLoading(true);
    setBookingInfo(null); // Clear previous results
    setCheckedBookingId(currentBookingId); // Store the ID we are checking

    try {
      const data = await getBookingDetails(currentBookingId);
      setBookingInfo(data);
      if (data.status === "Done" || data.status === "Cancelled") {
        // Only remove from local storage if it matches the one we just checked
        if (localStorage.getItem("lastBookingId") === currentBookingId) {
          localStorage.removeItem("lastBookingId");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    // Use checkedBookingId to ensure we cancel the booking currently displayed
    if (
      !bookingInfo ||
      bookingInfo.status !== "Waiting" ||
      bookingInfo.bookingId !== checkedBookingId
    )
      return;
    if (
      !window.confirm(
        `Are you sure you want to cancel the booking for ${bookingInfo.patientName} (ID: ${checkedBookingId})?`
      )
    ) {
      return;
    }

    setError("");
    setMessage("");
    setIsCancelling(true);
    try {
      const data = await cancelBooking(checkedBookingId);
      setMessage(data.message);
      setBookingInfo((prev) =>
        prev ? { ...prev, status: "Cancelled", position: null } : null
      );
      if (localStorage.getItem("lastBookingId") === checkedBookingId) {
        localStorage.removeItem("lastBookingId");
      }
      // Optional: Clear input after successful cancel
      // setBookingIdInput('');
      // setCheckedBookingId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCancelling(false);
      // Clear message after few seconds
      setTimeout(() => setMessage(""), 4000);
    }
  };

  // Helper to render status badge
  const renderStatusBadge = (status) => {
    let Icon, colorClass, text;
    switch (status) {
      case "Waiting":
        Icon = ClockIcon;
        colorClass = "bg-yellow-100 text-yellow-800";
        text = "Waiting";
        break;
      case "Done":
        Icon = CheckSolid; // Solid check
        colorClass = "bg-green-100 text-green-800";
        text = "Completed";
        break;
      case "Cancelled":
        Icon = XSolid; // Solid X
        colorClass = "bg-red-100 text-red-800";
        text = "Cancelled";
        break;
      default:
        Icon = ExclamationTriangleIcon;
        colorClass = "bg-gray-100 text-gray-800";
        text = "Unknown";
    }
    return (
      <span
        className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClass}`}
      >
        <Icon className="-ml-1 mr-1.5 h-4 w-4" aria-hidden="true" />
        {text}
      </span>
    );
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto mt-6">
      <div className="flex items-center justify-center mb-6">
        <TicketIcon className="h-8 w-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Check Status / Cancel
        </h2>
      </div>
      <form onSubmit={handleCheckStatus} className="mb-6 space-y-4">
        <div>
          <label
            htmlFor="bookingIdCheck"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter Your Booking ID:
          </label>
          <input
            type="text"
            id="bookingIdCheck"
            value={bookingIdInput}
            onChange={(e) => setBookingIdInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono tracking-wider"
            placeholder="e.g., a1b2c3d4"
            required
            disabled={isLoading}
            aria-describedby="bookingId-description"
          />
          <p className="mt-1 text-xs text-gray-500" id="bookingId-description">
            The 8-character ID received upon booking.
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading || !bookingIdInput.trim()}
          className={`w-full flex justify-center items-center py-2.5 px-4 rounded-md text-white font-medium transition duration-150 ease-in-out ${
            isLoading || !bookingIdInput.trim()
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isLoading ? (
            <LoadingSpinner size="h-5 w-5" color="text-white" />
          ) : (
            <>
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" /> Check Status
            </>
          )}
        </button>
      </form>

      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={message} />

      {/* Display results only if we have successfully loaded bookingInfo for the checked ID */}
      {bookingInfo && bookingInfo.bookingId === checkedBookingId && (
        <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
            Booking Details (ID: {bookingInfo.bookingId})
          </h3>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Name:</span>
            <span className="text-gray-900">{bookingInfo.patientName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Status:</span>
            {renderStatusBadge(bookingInfo.status)}
          </div>

          {bookingInfo.status === "Waiting" && bookingInfo.position && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium text-indigo-600">
                Your Position in Queue:
              </span>
              <span className="font-bold text-2xl text-indigo-700">
                {bookingInfo.position}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
            <span>Booked At:</span>
            <span>{new Date(bookingInfo.bookingTime).toLocaleString()}</span>
          </div>

          {bookingInfo.status === "Waiting" && (
            <div className="pt-4 border-t mt-4">
              <button
                onClick={handleCancel}
                disabled={isCancelling || isLoading}
                className={`w-full flex justify-center items-center py-2 px-4 rounded-md text-white font-medium transition duration-150 ease-in-out ${
                  isCancelling || isLoading
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                }`}
              >
                {isCancelling ? (
                  <>
                    <LoadingSpinner size="h-5 w-5" color="text-white" />
                    <span className="ml-2">Cancelling...</span>
                  </>
                ) : (
                  <>
                    <NoSymbolIcon className="h-5 w-5 mr-2" /> Cancel This
                    Booking
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                This action cannot be undone.
              </p>
            </div>
          )}
        </div>
      )}
      {/* Show message if ID was checked but no info found (and no specific error) */}
      {!isLoading && !bookingInfo && checkedBookingId && !error && !message && (
        <AlertMessage
          type="info"
          message={`No active or recent booking found for ID: ${checkedBookingId}`}
        />
      )}
    </div>
  );
}

export default StatusChecker;

// Add simple fade-in animation in src/index.css
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
*/
