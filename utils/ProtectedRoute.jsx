"use client"

import { Outlet, useLocation } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"

const ProtectedRoute = ({ setIsModalOpen }) => {
  const { language } = useLanguage()
  const location = useLocation()

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}")

  // Check if user is authenticated
  const isAuthenticated = !!userInfo?.token

  if (!isAuthenticated) {
    // Show login modal
    setIsModalOpen(true)
    // Return the current route but with the modal open
    return <Outlet />
  }

  // If user is authenticated, render the child routes
  return <Outlet />
}

export default ProtectedRoute

