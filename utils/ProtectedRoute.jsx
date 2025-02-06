import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

// Check authentication status
const isAuthenticated = () => {
  const eduuserInfo = localStorage.getItem("eduuserInfo");
  return eduuserInfo && JSON.parse(eduuserInfo);
};

// ProtectedRoute component
const ProtectedRoute = ({ setIsModalOpen }) => {
  useEffect(() => {
    if (!isAuthenticated()) {
      setIsModalOpen(true); // Open authentication modal if the user isn't logged in
    }
  }, [setIsModalOpen]);

  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
