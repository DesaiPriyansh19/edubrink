"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { RandomReveal } from "react-random-reveal"
import { CheckCircle, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import AOS from "aos"
import "aos/dist/aos.css"

export default function VerifiedModal({ showModal, onContinue }) {
  const [animate, setAnimate] = useState(false)
  const [canClose, setCanClose] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    })

    if (showModal) {
      setAnimate(true)
      setCanClose(false)

      // Reset AOS animations when modal opens
      setTimeout(() => {
        AOS.refresh()
      }, 100)

      // Trigger confetti animation when modal shows
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3b3d8d", "#ffffff", "#e63946"],
        })
      }, 300)

      // Set timer to allow closing after 5 seconds
      const timer = setTimeout(() => {
        setCanClose(true)

        // Auto-close if onContinue is provided
        if (onContinue) {
          onContinue()
        }
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
    }
  }, [showModal, onContinue])

  if (!showModal) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60]">
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      ></div>

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-md mx-4 bg-white shadow-2xl overflow-hidden transition-all duration-500 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ borderRadius: "20px" }}
      >
        {/* Top wave decoration */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-24">
            <path
              d="M0.00,49.98 C150.00,150.00 349.20,-50.00 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"
              className="fill-[#3b3d8d]"
            ></path>
          </svg>
        </div>

        {/* Content container */}
        <div className="px-8 pt-28 pb-8 relative z-10">
          {/* Success icon */}
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#3b3d8d] flex items-center justify-center">
              <CheckCircle size={32} className="text-white" />
            </div>
          </div>

          {/* Success message */}
          <div data-aos="fade-up" data-aos-delay="400" className="text-center">
            <h2 className="text-3xl font-bold mb-3 text-[#3b3d8d]">
              <RandomReveal
                isPlaying
                duration={1.5}
                characters={t("auth.loginVerifiedTitle")}
                characterSet={["0", "1"]}
              />
            </h2>

            <p className="text-gray-600 mb-8">{t("auth.loginVerfiedText")}</p>
          </div>

          {/* Animated checkmarks */}
          <div className="flex justify-center gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={500 + i * 100} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center mb-2">
                  <CheckCircle size={20} className="text-[#3b3d8d]" />
                </div>
                <span className="text-xs text-gray-500">
                  {i === 0 ? t("auth.verified") : i === 1 ? t("auth.secured") : t("auth.complete")}
                </span>
              </div>
            ))}
          </div>

          {/* Continue button */}
          <div data-aos="fade-up" data-aos-delay="800">
            <button
              onClick={onContinue}
              disabled={!canClose}
              className={`w-full py-4 bg-[#3b3d8d] text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center group ${
                canClose ? "opacity-100" : "opacity-90"
              }`}
            >
              <span>{canClose ? t("auth.continue") : t("auth.verifying")}</span>
              <ArrowRight
                size={18}
                className={`ml-2 transition-transform duration-300 ${canClose ? "group-hover:translate-x-1" : "animate-pulse"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

