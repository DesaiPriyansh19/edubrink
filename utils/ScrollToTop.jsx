"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react" // Import WhatsApp icon from lucide-react

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Calculate scroll progress and update visibility
  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }

    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100
    setScrollProgress(scrolled)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openWhatsApp = () => {
    // Replace with your WhatsApp number and optional pre-filled message
    window.open("https://wa.me/1234567890?text=Hello%20from%20your%20website!", "_blank")
  }

  const circleRadius = 18
  const circumference = 2 * Math.PI * circleRadius
  const dashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <>
      {/* WhatsApp Button - Always visible but position changes */}
      <button
        onClick={openWhatsApp}
        aria-label="Contact us on WhatsApp"
        className={`whatsapp-button ${isVisible ? "whatsapp-button-raised" : ""}`}
      >
        <MessageCircle size={24} className="whatsapp-icon" />
      </button>

      {/* Scroll to Top Button - Visible based on scroll position */}
      {isVisible && (
        <button onClick={scrollToTop} aria-label="Scroll to top" className="scroll-to-top">
          {/* SVG Progress Circle */}
          <svg className="progress-circle" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={circleRadius} className="circle-bg" />
            <circle
              cx="24"
              cy="24"
              r={circleRadius}
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              transform="rotate(-90 24 24)"
              className="circle-progress"
            />
          </svg>

          {/* Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  )
}

export default ScrollToTop

