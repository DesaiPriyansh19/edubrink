"use client"

import { useLocation } from "react-router-dom"
import { useState } from "react" // Add this import
import AuthModal from "./AuthModal"
import NavBar from "./NavBar"
import Footer from "./Footer/Footer"
import ScrollToTop from "../../utils/ScrollToTop"

export default function AppLayout({ children }) {
  const location = useLocation()
  const lang = location.pathname.split("/")[1]
  const isAdminRoute = location.pathname.startsWith(`/${lang}/admin`)
  const [isModalOpen, setIsModalOpen] = useState(false) // Add state for modal

  return (
    <>
      {/* Modal Component */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Conditionally Render NavBar */}
      {!isAdminRoute && <NavBar setIsModalOpen={setIsModalOpen} />}

      {/* Main Content */}
      {children}
      <ScrollToTop />

      {/* Conditionally Render Footer */}
      {!isAdminRoute && <Footer />}
    </>
  )
}

