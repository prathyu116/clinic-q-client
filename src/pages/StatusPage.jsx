import React from "react";
import { Link } from "react-router-dom";
import StatusChecker from "../components/StatusChecker";

function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Check Status / Cancel
      </h1>
      <StatusChecker />
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          ← Back to Home / Booking
        </Link>
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

export default StatusPage;
