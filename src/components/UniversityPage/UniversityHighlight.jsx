"use client"

import { useState, useRef, useEffect } from "react"
import Star from "../../../svg/StarLogo"
import UniversityLogo from "../../../svg/UniversityLogo"
import { useTranslation } from "react-i18next"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

const UniversityHighlight = ({ data, language }) => {
  const [activeSection, setActiveSection] = useState("overview")
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef(null)
  const [showFullDescription, setShowFullDescription] = useState({})
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  const isContentOverflowing = () => {
    if (!contentRef.current) return false
    const content = contentRef.current
    const lineHeight = Number.parseInt(window.getComputedStyle(content).lineHeight, 10)
    const maxHeight = lineHeight * 3
    const isOverflowing = content.scrollHeight > maxHeight
    const wordCount = content.textContent.split(/\s+/).length
    return isOverflowing || wordCount > 300
  }

  const toggleExpand = () => {
    setExpanded((prev) => !prev)
  }

  const handleSectionClick = (section) => {
    setActiveSection(section)
    setExpanded(false)
    setActivePhotoIndex(0) // Reset photo index when changing sections
  }

  const toggleCampusDescription = (campusId) => {
    setShowFullDescription((prev) => ({
      ...prev,
      [campusId]: !prev[campusId],
    }))
  }

  // Get photos based on active section
  const getActivePhotos = () => {
    switch (activeSection) {
      case "library":
        return data?.uniLibrary?.libraryPhotos || []
      case "sports":
        return data?.uniSports?.sportsPhotos || []
      case "studentLife":
        return data?.studentLifeStyleInUni?.lifestylePhotos || []
      default:
        return []
    }
  }

  const activePhotos = getActivePhotos()
  const hasPhotos = activePhotos.length > 0

  // Navigation for photos
  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % activePhotos.length)
  }

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + activePhotos.length) % activePhotos.length)
  }

  useEffect(() => {
    if (contentRef.current) {
      setExpanded(false)
    }
  }, [activeSection, data, language])

  // Set initial active section to first available section
  useEffect(() => {
    const availableSections = [
      { name: "overview", hasData: !!data?.uniOverview?.[language] },
      { name: "accommodation", hasData: !!data?.uniAccomodation?.[language] },
      { name: "library", hasData: !!data?.uniLibrary?.libraryDescription?.[language] },
      { name: "sports", hasData: !!data?.uniSports?.sportsDescription?.[language] },
      { name: "studentLife", hasData: !!data?.studentLifeStyleInUni?.lifestyleDescription?.[language] },
    ]

    const firstAvailableSection = availableSections.find((section) => section.hasData)
    if (firstAvailableSection) {
      setActiveSection(firstAvailableSection.name)
    }
  }, [data, language])

  const highlights = t("UniversitySlugPage.HighlightArray", {
    returnObjects: true,
  })

  return (
    <div className="bg-[#3b3d8d] bg-opacity-5 rounded-xl p-6 mb-8">
      <div className="layout-wrapper">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#3b3d8d] bg-opacity-10 flex items-center justify-center text-[#3b3d8d]">
            <Star />
          </div>
          <h2 className="font-semibold text-xl text-[#3b3d8d]">{t("UniversitySlugPage.Highlight")}</h2>
        </div>

        {/* Section Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {highlights.map((highlight, index) => {
            const sectionName =
              index === 0
                ? "overview"
                : index === 1
                  ? "accommodation"
                  : index === 2
                    ? "library"
                    : index === 3
                      ? "sports"
                      : "studentLife"

            // Check if data exists for this section
            const hasData =
              (sectionName === "overview" && data?.uniOverview?.[language]) ||
              (sectionName === "accommodation" && data?.uniAccomodation?.[language]) ||
              (sectionName === "library" && data?.uniLibrary?.libraryDescription?.[language]) ||
              (sectionName === "sports" && data?.uniSports?.sportsDescription?.[language]) ||
              (sectionName === "studentLife" && data?.studentLifeStyleInUni?.lifestyleDescription?.[language])

            // Only render the button if data exists
            if (!hasData) return null

            const isActive = activeSection === sectionName

            return (
              <button
                key={index}
                onClick={() => handleSectionClick(sectionName)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#3b3d8d] to-[#5254a3] text-white shadow-md"
                    : "bg-white text-[#3b3d8d] hover:bg-[#3b3d8d] hover:bg-opacity-10"
                }`}
              >
                {highlight}
              </button>
            )
          })}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          {/* Photo Gallery - Only show for sections with photos */}
          {hasPhotos &&
            (activeSection === "library" || activeSection === "sports" || activeSection === "studentLife") && (
              <div className="mb-6">
                <div className="relative rounded-lg overflow-hidden h-64 md:h-80 bg-gray-100">
                  <img
                    src={activePhotos[activePhotoIndex] || "https://placehold.co/600x400?text=No+Image"}
                    alt={`${activeSection} photo`}
                    className="w-full h-full object-cover"
                  />

                  {activePhotos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center text-gray-800 hover:bg-opacity-90 transition-all"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center text-gray-800 hover:bg-opacity-90 transition-all"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Photo indicators */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {activePhotos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActivePhotoIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === activePhotoIndex ? "bg-white w-4" : "bg-white bg-opacity-60"
                            }`}
                            aria-label={`Go to photo ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          <div
            ref={contentRef}
            className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[2000px]" : "max-h-[4.5rem]"}`}
          >
            {activeSection === "overview" && (
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: data?.uniOverview?.[language] || "No overview available",
                }}
              />
            )}
            {activeSection === "accommodation" && (
              <p className="text-gray-700">
                {data?.uniAccomodation?.[language] || "No accommodation information available"}
              </p>
            )}
            {activeSection === "library" && (
              <p className="text-gray-700">
                {data?.uniLibrary?.libraryDescription?.[language] || "No library information available"}
              </p>
            )}
            {activeSection === "sports" && (
              <p className="text-gray-700">
                {data?.uniSports?.sportsDescription?.[language] || "No sports information available"}
              </p>
            )}
            {activeSection === "studentLife" && (
              <p className="text-gray-700">
                {data?.studentLifeStyleInUni?.lifestyleDescription?.[language] ||
                  "No student life information available"}
              </p>
            )}
          </div>

          {isContentOverflowing() && (
            <button
              onClick={toggleExpand}
              className="mt-2 flex items-center gap-2 font-medium text-[#3b3d8d] hover:text-[#5254a3] transition-colors"
            >
              <span>{expanded ? t("majorPage.readLess") : t("majorPage.readMore")}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Campus Section */}
      {data?.campuses?.length > 0 && data?.campuses?.[0]?.campusName?.en && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#3b3d8d] bg-opacity-10 flex items-center justify-center text-[#3b3d8d]">
              <UniversityLogo />
            </div>
            <h2 className="font-semibold text-xl text-[#3b3d8d]">{t("UniversitySlugPage.Campus")}</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {data?.campuses.map((campus, index) => (
              <div
                key={index}
                className="bg-white rounded-xl md:col-span-1 col-span-1 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-[#3b3d8d] text-lg">{campus?.campusName?.[language] || "Campus"}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#3b3d8d] bg-opacity-10 text-[#3b3d8d]">
                    {campus?.campusLocation?.uniCity?.[language] || "Location"}
                  </span>
                </div>

                {/* Campus Description */}
                <div className="mt-4">
                  <p className="text-gray-600 text-sm mb-2">
                    {showFullDescription[index]
                      ? campus?.campusLocation?.uniDescription?.[language]
                      : campus?.campusLocation?.uniDescription?.[language]?.slice(0, 100) +
                        (campus?.campusLocation?.uniDescription?.[language]?.length > 100 ? "..." : "")}
                  </p>

                  {campus?.campusLocation?.uniDescription?.[language]?.length > 100 && (
                    <button
                      onClick={() => toggleCampusDescription(index)}
                      className="flex items-center gap-1 text-[#3b3d8d] text-sm font-medium hover:text-[#5254a3] transition-colors"
                    >
                      <span>
                        {showFullDescription[index]
                          ? language === "ar"
                            ? "اقرأ أقل"
                            : "Read Less"
                          : language === "ar"
                            ? "اقرأ المزيد"
                            : "Read More"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${showFullDescription[index] ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {/* Campus Facilities */}
                {campus?.campusFacilities?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-[#3b3d8d] mb-3">{t("UniversitySlugPage.Facilities")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {campus.campusFacilities.map((facility, facilityIndex) => (
                        <span
                          key={facilityIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#3b3d8d] bg-opacity-5 text-[#3b3d8d]"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UniversityHighlight

