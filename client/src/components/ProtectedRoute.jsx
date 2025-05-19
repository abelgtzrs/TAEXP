// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Helper function to check if user is authenticated
// In a real app, this might involve checking context or a more robust auth state
const isAuthenticated = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsedInfo = JSON.parse(userInfo);
      // You might also want to check if the token is expired here
      return !!parsedInfo.token; 
    } catch (e) {
      return false;
    }
  }
  return false;
};

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // User not authenticated, redirect to login page
    // You can pass the current location to redirect back after login
    // return <Navigate to="/login" state={{ from: location }} replace />;
    console.log('ProtectedRoute: User not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the child routes/component
  return children ? children : <Outlet />; 
  // If 'children' prop is provided, render it (for wrapping specific components).
  // Otherwise, render <Outlet /> for nested routes.
}

export default ProtectedRoute;
