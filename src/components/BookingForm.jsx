import React, { useState } from "react";
import { bookSlot } from "../api";
import AlertMessage from "./AlertMessage"; // Assuming you have this component
import LoadingSpinner from "./LoadingSpinner"; // Assuming you have this component
import {
  CalendarDaysIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"; // Using outline icons

function BookingForm({ onBookingSuccess }) {
  const [patientName, setPatientName] = useState("");
  const [message, setMessage] = useState(""); // Holds the main success message text
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastBookingId, setLastBookingId] = useState(""); // State to hold the ID for special display

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLastBookingId(""); // Reset previous booking ID display
    if (!patientName.trim()) {
      setError("Please enter your name.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await bookSlot(patientName);
      // Set the general message and the specific ID
      setMessage(`Booking successful! Your Booking ID is: ${data.bookingId}.`);
      setLastBookingId(data.bookingId);
      setPatientName(""); // Clear form
      if (onBookingSuccess) {
        onBookingSuccess(data.bookingId);
      }
      localStorage.setItem("lastBookingId", data.bookingId);
      // Optional: Clear success message after a delay
      // setTimeout(() => {
      //     setMessage('');
      //     setLastBookingId('');
      // }, 8000); // Clear after 8 seconds
    } catch (err) {
      setError(err.message || "An unexpected error occurred during booking.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Card container with more padding and rounded corners
    <div className="p-6 md:p-8 border border-gray-200 rounded-xl shadow-lg bg-white max-w-lg mx-auto">
      {/* Title with Icon */}
      <div className="flex items-center justify-center mb-6 md:mb-8">
        <CalendarDaysIcon className="h-8 w-8 text-indigo-600 mr-3" />
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          Book Your Clinic Slot
        </h2>
      </div>

      {/* Form with increased spacing */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="patientName"
            className="block text-sm font-medium text-gray-700 mb-1.5" // Slightly more margin-bottom
          >
            Your Full Name:
          </label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            // Enhanced input styling: more padding, clearer focus ring
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-400"
            placeholder="e.g., Jane Doe"
            required
            disabled={isLoading}
            aria-describedby="patientName-description"
          />
          <p
            className="mt-1.5 text-xs text-gray-500"
            id="patientName-description"
          >
            Please enter the name you wish to register.
          </p>
        </div>

        {/* Enhanced Button with Spinner/Icon */}
        <button
          type="submit"
          disabled={isLoading || !patientName.trim()} // Disable if loading or name is empty
          // Enhanced button styling: more padding, consistent height, clear disabled state
          className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semibold transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading || !patientName.trim()
              ? "bg-indigo-300 cursor-not-allowed" // Clearer disabled state
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" // Gradient background
          }`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="h-5 w-5" color="text-white" />
              <span className="ml-2">Booking...</span>
            </>
          ) : (
            <>
              <span>Book Slot Now</span>
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </>
          )}
        </button>
      </form>

      {/* Feedback Area - using AlertMessage component */}
      <div className="mt-6 space-y-3">
        {/* Use AlertMessage for errors */}
        <AlertMessage type="error" message={error} />

        {/* Custom styled success message to highlight the Booking ID */}
        {message && lastBookingId && !error && (
          <div
            className="p-4 rounded-lg bg-green-50 border border-green-200 text-center shadow-sm"
            role="alert"
          >
            <div className="flex items-center justify-center mb-2">
              <CheckCircleIcon
                className="h-6 w-6 text-green-600 mr-2"
                aria-hidden="true"
              />
              <p className="text-base font-semibold text-green-800">
                Booking Confirmed!
              </p>
            </div>
            <p className="text-sm text-green-700 mb-3">Your Booking ID is:</p>
            {/* Highlighted Booking ID */}
            <div className="inline-block bg-white px-4 py-1.5 rounded-md border border-green-300 shadow-inner">
              <code className="text-xl font-bold text-green-900 tracking-widest">
                {lastBookingId}
              </code>
            </div>
            <p className="text-xs text-green-600 mt-3">
              Please keep this ID safe to check your status or cancel your
              booking later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingForm;
