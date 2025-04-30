import React, { useState } from "react";
import { bookSlot } from "../api";

function BookingForm({ onBookingSuccess }) {
  const [patientName, setPatientName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!patientName.trim()) {
      setError("Please enter your name.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await bookSlot(patientName);
      setMessage(
        `Booking successful! Your Booking ID is: ${data.bookingId}. Keep this ID safe to check your status or cancel.`
      );
      setPatientName(""); // Clear form
      if (onBookingSuccess) {
        onBookingSuccess(data.bookingId); // Pass bookingId up if needed
      }
      // Store bookingId in localStorage for easy retrieval later
      localStorage.setItem("lastBookingId", data.bookingId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Book Your Slot</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="patientName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name:
          </label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {isLoading ? "Booking..." : "Book Slot"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-green-600 bg-green-100 p-3 rounded text-center">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 text-red-600 bg-red-100 p-3 rounded text-center">
          {error}
        </p>
      )}
    </div>
  );
}

export default BookingForm;
