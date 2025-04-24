"use client"

import { Outlet } from "react-router-dom"

const ProtectedRoute = ({ setIsModalOpen }) => {

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

