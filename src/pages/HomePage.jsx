import React from "react";
import { Link } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import QueueDisplay from "../components/QueueDisplay";

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Clinic Queue Manager
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <BookingForm />
          <div className="mt-6 text-center">
            <Link
              to="/status"
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Already booked? Check your status or cancel here.
            </Link>
          </div>
        </div>
        <div>
          <QueueDisplay />
        </div>
      </div>
      <div className="mt-12 text-center">
        <Link
          to="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          Admin View
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
