import React, { useState, useEffect } from "react";
import { getBookingDetails, cancelBooking } from "../api";

function StatusChecker() {
  const [bookingId, setBookingId] = useState("");
  const [bookingInfo, setBookingInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Load booking ID from local storage on mount
  useEffect(() => {
    const lastBookingId = localStorage.getItem("lastBookingId");
    if (lastBookingId) {
      setBookingId(lastBookingId);
      handleCheckStatus(null, lastBookingId); // Auto-check if ID exists
    }
  }, []);

  const handleCheckStatus = async (e, idToCheck) => {
    if (e) e.preventDefault();
    const currentBookingId = idToCheck || bookingId;
    if (!currentBookingId.trim()) {
      setError("Please enter your Booking ID.");
      setBookingInfo(null);
      return;
    }
    setError("");
    setMessage("");
    setIsLoading(true);
    setBookingInfo(null); // Clear previous results

    try {
      const data = await getBookingDetails(currentBookingId.trim());
      setBookingInfo(data);
      // Clear local storage if booking is done or cancelled
      if (data.status === "Done" || data.status === "Cancelled") {
        localStorage.removeItem("lastBookingId");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!bookingInfo || bookingInfo.status !== "Waiting") return;
    if (
      !window.confirm(
        `Are you sure you want to cancel the booking for ${bookingInfo.patientName}?`
      )
    ) {
      return;
    }

    setError("");
    setMessage("");
    setIsCancelling(true);
    try {
      const data = await cancelBooking(bookingId.trim());
      setMessage(data.message);
      setBookingInfo((prev) => ({
        ...prev,
        status: "Cancelled",
        position: null,
      })); // Update UI immediately
      localStorage.removeItem("lastBookingId"); // Clear local storage on cancel
      setBookingId(""); // Clear input field
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Check Your Booking Status / Cancel
      </h2>
      <form onSubmit={handleCheckStatus} className="mb-4">
        <div className="mb-2">
          <label
            htmlFor="bookingId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Booking ID:
          </label>
          <input
            type="text"
            id="bookingId"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your Booking ID"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !bookingId}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading || !bookingId
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isLoading ? "Checking..." : "Check Status"}
        </button>
      </form>

      {error && (
        <p className="my-3 text-red-600 bg-red-100 p-3 rounded text-center">
          {error}
        </p>
      )}
      {message && (
        <p className="my-3 text-green-600 bg-green-100 p-3 rounded text-center">
          {message}
        </p>
      )}

      {bookingInfo && (
        <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Booking Details:</h3>
          <p>
            <span className="font-medium">Name:</span> {bookingInfo.patientName}
          </p>
          <p>
            <span className="font-medium">Status:</span>
            <span
              className={`ml-2 font-semibold ${
                bookingInfo.status === "Waiting"
                  ? "text-yellow-600"
                  : bookingInfo.status === "Done"
                  ? "text-green-600"
                  : bookingInfo.status === "Cancelled"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {bookingInfo.status}
            </span>
          </p>
          {bookingInfo.status === "Waiting" && bookingInfo.position && (
            <p>
              <span className="font-medium">Your Position:</span>{" "}
              <span className="font-bold text-indigo-600">
                {bookingInfo.position}
              </span>
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Booked at: {new Date(bookingInfo.bookingTime).toLocaleTimeString()}
          </p>

          {bookingInfo.status === "Waiting" && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium ${
                isCancelling
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              }`}
            >
              {isCancelling ? "Cancelling..." : "Cancel My Booking"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default StatusChecker;
