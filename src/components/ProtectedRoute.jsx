// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// This component relies on the 'isAuthenticated' prop passed down from App.jsx
const ProtectedRoute = ({ isAuthenticated, children }) => {
  const location = useLocation();

  if (isAuthenticated === null) {
    // Optional: Show a loading indicator while checking auth status
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
