import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Check for userInfo in localStorage to determine authentication status
const isAuthenticated = () => {
  const eduuserInfo = localStorage.getItem("eduuserInfo");
  return eduuserInfo && JSON.parse(eduuserInfo); // Returns true if eduuserInfo exists
};

// ProtectedRoute component that wraps children
const ProtectedRoute = ({ setIsModalOpen }) => {
  useEffect(() => {
    // If not authenticated, open the login modal
    if (!isAuthenticated()) {
      setIsModalOpen(true);
    }
  }, [setIsModalOpen]);

  // Always render the Outlet, regardless of authentication
  return <Outlet />;
};

export default ProtectedRoute;
