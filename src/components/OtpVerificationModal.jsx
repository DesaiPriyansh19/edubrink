"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { ArrowRight, Clock, RefreshCw, Mail, ShieldCheck, AlertCircle } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function OtpVerificationModal({ otpError, handleOtpVerification, otp, setOtp }) {
  const { t } = useTranslation()
  const [isDisabled, setIsDisabled] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL
  const inRef = useRef([])

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: false,
    })

    // Automatically focus on the first input when the component mounts
    inRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && isDisabled) {
      setIsDisabled(false)
    }
  }, [countdown, isDisabled])

  const handleKeyDown = (e, idx) => {
    const arrayCopy = [...otp]

    if (e.key === "Backspace") {
      // Clear current input and move focus to the previous one
      if (arrayCopy[idx] !== "") {
        arrayCopy[idx] = ""
        setOtp(arrayCopy)
      } else if (idx > 0) {
        inRef.current[idx - 1]?.focus()
        arrayCopy[idx - 1] = ""
        setOtp(arrayCopy)
      }
    } else if (e.key < "0" || e.key > "9") {
      // Prevent non-numeric input
      e.preventDefault()
    }
  }

  const handleChange = (e, idx) => {
    const value = e.target.value.slice(0, 1) // Only take the first character
    if (value) {
      const arrayCopy = [...otp]
      arrayCopy[idx] = value
      setOtp(arrayCopy)

      // Move focus to the next input
      if (idx < 3) {
        inRef.current[idx + 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4).split("")
    const arrayCopy = [...otp]

    pastedData.forEach((char, idx) => {
      if (idx < 4 && !isNaN(char)) {
        arrayCopy[idx] = char
      }
    })

    setOtp(arrayCopy)

    // Move focus to the last filled input
    const lastFilledIndex = Math.min(pastedData.length, 4) - 1
    if (lastFilledIndex >= 0) {
      inRef.current[lastFilledIndex]?.focus()
    }
  }

  const handleResend = async (e) => {
    e.preventDefault()
    if (countdown > 0 || isResending) return

    setIsResending(true)
    setOtp(new Array(4).fill("")) // Clear OTP fields

    // Retrieve userId from localStorage
    const userId = JSON.parse(localStorage.getItem("eduuserInfo"))?.userId
    const email = JSON.parse(localStorage.getItem("eduuserInfo"))?.email

    if (!userId) {
      console.error("User ID not found in localStorage.")
      setIsResending(false)
      return
    }

    try {
      const requestBody = {
        userId: userId,
        email: email,
      }
      await axios.post(`https://edu-brink-backend.vercel.app/api/users/resendotp`, requestBody)

      // Re-enable inputs
      setIsDisabled(false)
      // Focus on the first input
      inRef.current[0]?.focus()
      // Set countdown for resend button
      setCountdown(30)
    } catch (error) {
      console.error("Error during OTP verification:", error)
    } finally {
      setIsResending(false)
    }
  }

  const handleVerifyClick = (e) => {
    // Set submitting state
    setIsSubmitting(true)

    try {
      // Call the original handler with the event
      handleOtpVerification(e)
    } catch (error) {
      console.error("Error during verification:", error)
    } finally {
      // Reset submitting state after a short delay to show the loading state
      setTimeout(() => {
        setIsSubmitting(false)
      }, 1000)
    }
  }

  const isOtpComplete = otp.every((digit) => digit !== "")

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up">
        {/* Header with wave background */}
        <div className="relative">
          <div className="bg-[#3b3d8d] h-28 overflow-hidden">
            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 1440 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
                fill="white"
              ></path>
            </svg>
          </div>

          {/* Verification Image */}
          <div
            className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-white shadow-lg p-2 border-4 border-white"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#3b3d8d]/10 flex items-center justify-center">
              <Mail className="text-[#3b3d8d] w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-14 pb-6">
          <div className="text-center mb-6" data-aos="fade-up" data-aos-delay="300">
            <h2 className="text-2xl font-bold text-[#3b3d8d] mb-2">{t("auth.emailVerification")}</h2>
            <p className="text-gray-600 text-sm max-w-xs mx-auto">{t("auth.otpInstructions")}</p>
          </div>

          {/* Error message */}
          {otpError && (
            <div
              className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded-md flex items-start"
              data-aos="fade-right"
            >
              <AlertCircle className="text-red-500 w-5 h-5 mr-2 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{t("auth.invalidOtp")}</p>
            </div>
          )}

          {/* OTP Input */}
          <div className="flex justify-center mb-8 gap-3" data-aos="fade-up" data-aos-delay="400">
            {otp.map((value, idx) => (
              <div key={idx} className="relative group">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={value}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onChange={(e) => handleChange(e, idx)}
                  onPaste={handlePaste}
                  ref={(el) => (inRef.current[idx] = el)}
                  className={`w-14 h-16 text-center text-2xl font-bold rounded-lg border-2 focus:outline-none bg-white transition-all duration-300 ${
                    value
                      ? "border-[#3b3d8d] shadow-sm shadow-[#3b3d8d]/10"
                      : "border-gray-200 group-hover:border-gray-300"
                  }`}
                  disabled={isDisabled} // Disable inputs when timer runs out
                />
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 bg-[#3b3d8d] rounded-b-lg transition-transform duration-300 origin-left ${
                    value ? "scale-x-100" : "scale-x-0"
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {/* Resend button with timer */}
          <div className="flex justify-center mb-6" data-aos="fade-up" data-aos-delay="500">
            <button
              disabled={countdown > 0 || isResending}
              onClick={handleResend}
              className={`flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                countdown > 0 || isResending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#3b3d8d] hover:text-[#e63946]"
              }`}
            >
              {isResending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className={`w-4 h-4 mr-2 ${countdown > 0 ? "" : "group-hover:animate-spin"}`} />
              )}
              {countdown > 0 ? (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {t("auth.resendIn", { seconds: countdown })}
                </span>
              ) : (
                t("auth.resendCode")
              )}
            </button>
          </div>

          {/* Terms text */}
          <p className="text-xs text-gray-500 mb-6 text-center mx-auto" data-aos="fade-up" data-aos-delay="600">
            {t("auth.termsText")}{" "}
            <a href="#" className="text-[#3b3d8d] hover:underline">
              {t("auth.termsLink")}
            </a>
          </p>

          {/* Verify button */}
          <div data-aos="fade-up" data-aos-delay="700">
            <button
              onClick={handleVerifyClick}
              disabled={!isOtpComplete || isSubmitting}
              className={`w-full py-3.5 text-base font-semibold rounded-xl flex items-center justify-center transition-all duration-300 ${
                isOtpComplete && !isSubmitting
                  ? "bg-[#3b3d8d] text-white hover:shadow-lg hover:bg-[#333379]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  {t("auth.verifying")}
                </>
              ) : (
                <>
                  <span>{t("auth.verifyEmail")}</span>
                  {isOtpComplete && (
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </>
              )}
              <div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#3b3d8d] to-[#e63946] transition-all duration-500 rounded-b-lg ${
                  isSubmitting ? "w-full" : "w-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Security note */}
          <div
            className="mt-6 flex items-center justify-center text-xs text-gray-500"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5 text-[#3b3d8d]" />
            {t("auth.securityNote")}
          </div>
        </div>
      </div>
    </div>
  )
}

