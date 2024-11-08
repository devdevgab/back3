import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// This function checks if the user is authenticated
const isAuthenticated = () => {
  return Boolean(localStorage.getItem('authToken')); // Adjust as needed
};

// ProtectedRoute component
const ProtectedRoute = ({ component: Component, ...rest }) => {
  return isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
