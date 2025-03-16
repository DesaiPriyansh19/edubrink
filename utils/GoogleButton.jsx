"use client"

import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { useState } from "react"
import GoogleIconSvg from "../svg/GoogleIconSvg"
import { useTranslation } from "react-i18next"

export default function GoogleButton({ onClose, setVerified }) {
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL
  const { t } = useTranslation()

  const googleRespone = async (authResult) => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `https://edu-brink-backend.vercel.app/api/google/auth/google?code=${authResult["code"]}`,
      )

      if (response.data && response.data.data.user) {
        const eduuserInfo = {
          userId: response.data.data.user._id,
          email: response.data.data.user.Email,
          MobileNumber: response.data.data.user.MobileNumber,
          token: response.data.token,
        }
        localStorage.setItem("eduuserInfo", JSON.stringify(eduuserInfo))

        // Ensure verified state is set to true
        setVerified(true)

        // Don't close the modal immediately - let the VerifiedModal show
        setTimeout(() => {
          setVerified(false)
          onClose() // Close the modal after verification
        }, 5000) // Increased to 5 seconds to ensure VerifiedModal is visible

        console.log("User Data:", response.data)
      } else if (response.data && response.data.message) {
        console.warn("Message from backend:", response.data.message)
      } else {
        console.error("Unexpected response structure:", response.data)
      }
    } catch (error) {
      console.error("Error authenticating with Google:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleError = (error) => {
    console.error("Google Login Error:", error)
    setIsLoading(false)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: googleRespone,
    onError: handleError,
    flow: "auth-code",
  })

  return (
    <button
      className="w-full py-3 px-4 border border-gray-300 rounded-xl flex items-center justify-center gap-3 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 relative overflow-hidden"
      onClick={() => {
        if (!isLoading) {
          googleLogin()
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      ) : (
        <>
          <span className="flex-shrink-0">
            <GoogleIconSvg />
          </span>
          <span>{t("auth.continueWithGoogle")}</span>
        </>
      )}
    </button>
  )
}

