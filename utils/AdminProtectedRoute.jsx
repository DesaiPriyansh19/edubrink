"use client"

import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { useEffect, useState } from "react"
import {jwtDecode} from "jwt-decode"

const AdminProtectedRoute = () => {
  const { language } = useLanguage()
  const location = useLocation()
  const [isValidating, setIsValidating] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const validateAdminAccess = () => {
      try {
        // Get user info from localStorage
        const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}")
        const token = userInfo?.token

        // If no token exists, user is not authenticated
        if (!token) {
          setIsAdmin(false)
          setIsValidating(false)
          return
        }

        // Decode the JWT token to extract payload
        const decodedToken = jwtDecode(token)
        console.log("Decoded token:", decodedToken)

        // Check if token is expired
        const currentTime = Date.now() / 1000 // Convert to seconds
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.log("Token expired")
          // Token is expired, clear localStorage
          localStorage.removeItem("eduuserInfo")
          setIsAdmin(false)
          setIsValidating(false)
          return
        }

        // Check if user has admin privileges based on token payload
        const hasAdminRole =
          decodedToken.isAdmin === true &&
          (decodedToken.ActionStatus === "Admin" ||
            decodedToken.ActionStatus === "admin" ||
            decodedToken.ActionStatus === "Editor")

        setIsAdmin(hasAdminRole)
        setIsValidating(false)
      } catch (error) {
        console.error("Token validation error:", error)
        // If there's an error decoding the token, it's invalid
        localStorage.removeItem("eduuserInfo")
        setIsAdmin(false)
        setIsValidating(false)
      }
    }

    validateAdminAccess()
  }, [])

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b3d8d]"></div>
      </div>
    )
  }

  // If not admin, redirect to homepage
  if (!isAdmin) {
    return <Navigate to={`/${language}`} replace state={{ from: location }} />
  }

  // If user is admin, render the child routes
  return <Outlet />
}

export default AdminProtectedRoute

