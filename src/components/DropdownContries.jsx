"use client"

import { forwardRef, useEffect, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"
import { useTranslation } from "react-i18next"
import { getEmoji } from "../../libs/countryFlags"
import { ChevronDown, ChevronUp } from "lucide-react"

const isWindows = navigator.userAgent.includes("Windows")

const DropdownCountries = forwardRef(({ setShowCountriesDropdown, navbarHeight, data }, ref) => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      easing: "ease-in-out",
      once: true,
    })
  }, [])

  const handleNavigate = (term) => {
    const customSlug = term.customURLSlug?.[language] || term.countryName.en
    navigate(`/${language}/country/${customSlug}`)
    setShowCountriesDropdown(false)
  }

  // Helper function to render flag
  const renderFlag = (country) => {
    if (isWindows) {
      if (country?.countryCode) {
        return (
          <img
            src={`https://flagcdn.com/w320/${getEmoji(country?.countryCode)}.png`}
            alt="Country Flag"
            className="w-6 h-6 object-cover rounded-full"
          />
        )
      }
    } else if (country?.countryPhotos?.countryFlag) {
      return <span className="text-lg font-medium">{country.countryPhotos.countryFlag}</span>
    }

    // Fallback
    return <span className="text-base font-medium">🏳️</span>
  }

  // Determine how many countries to display based on expanded state
  const displayedCountries = expanded ? data : data?.slice(0, 10) || []

  return (
    <div
      id="divshadow"
      style={{ top: `${navbarHeight}px` }}
      ref={ref}
      className={`absolute ${
        language === "ar"
          ? "mmd:left-[20%] lg:left-[18%] xl:left-[22%] xlg:left-[19%]"
          : "mmd:right-[20%] lg:right-[18%] xl:right-[22%] xlg:right-[19%]"
      } md:top-[5%] lg:top-[15%] xlg:top-[8%] xl:top-[0%] 2xl:top-[2%] px-4 py-5 
        w-[90vw] mmd:w-[60vw] lg:w-[50vw] xl:w-[40vw] h-auto z-10 flex flex-col gap-4 mt-2 
        bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 ease-in-out
        ${expanded ? "max-h-[80vh]" : "max-h-[70vh]"} overflow-y-auto`}
      data-aos="fade-out"
      data-aos-delay="0"
      data-aos-duration="300"
    >
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-gray-800">{t("DropDownCountry.title")}</h3>
          {data?.length > 10 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full font-medium text-gray-700 transition-colors flex items-center gap-1"
            >
              {expanded ? (
                <>
                  {t("showLess") || "Show Less"}
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  {t("viewAll") || "View All"}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="bg-gray-50 flex flex-wrap items-start justify-center gap-3 rounded-xl p-4 w-full">
          {displayedCountries?.length > 0 ? (
            <div className="w-full grid grid-cols-2 gap-3">
              {displayedCountries.map((country, idx) => (
                <div
                  key={idx}
                  onClick={() => handleNavigate(country)}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-100 shadow-sm transition-colors duration-200 text-gray-800"
                >
                  {renderFlag(country)}
                  <p className="text-sm font-medium truncate">{country?.countryName?.[language] || "Unknown"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500">{t("noCountriesFound") || "No countries available"}</p>
            </div>
          )}
        </div>

        {!expanded && data?.length > 10 && (
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-500">
              {t("showingCountriesOf", { shown: 10, total: data.length }) || `Showing 10 of ${data.length} countries`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
})

// Add display name for forwardRef component
DropdownCountries.displayName = "DropdownCountries"

export default DropdownCountries
