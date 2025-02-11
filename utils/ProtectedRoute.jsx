import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// Check authentication status
const isAuthenticated = () => {
  const eduuserInfo = localStorage.getItem("eduuserInfo");
  return eduuserInfo && JSON.parse(eduuserInfo);
};

// ProtectedRoute component
const ProtectedRoute = ({ setIsModalOpen }) => {
  const { language } = useLanguage();
  useEffect(() => {
    if (!isAuthenticated()) {
      setIsModalOpen(true); // Open authentication modal if the user isn't logged in
    }
  }, [setIsModalOpen]);

  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to={`/${language}/`} replace />
  );
};

export default ProtectedRoute;
