"use client"

import React, { useState, useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { useTranslation } from "react-i18next"
import CourseBook from "../../../svg/CourseBook"
import { useSearch } from "../../../context/SearchContext"
import ReactSlider from "react-slider"
import { countryFlags, getEmoji } from "../../../libs/countryFlags"

// Default destinations to show while API loads
const defaultDestinations = [
  { countryName: { en: "United Kingdom", ar: "المملكة المتحدة" }, countryCode: "GBR" },
  { countryName: { en: "United States", ar: "الولايات المتحدة" }, countryCode: "USA" },
  { countryName: { en: "Canada", ar: "كندا" }, countryCode: "CAN" },
  { countryName: { en: "Australia", ar: "أستراليا" }, countryCode: "AUS" },
  { countryName: { en: "Germany", ar: "ألمانيا" }, countryCode: "DEU" },
  { countryName: { en: "India", ar: "الهند" }, countryCode: "IND" },
  { countryName: { en: "Azerbaijan", ar: "أذربيجان" }, countryCode: "AZE" },
]

const FilterSidebar = ({ showFilter, setShowFilter, language }) => {
  const { t } = useTranslation()
  const isWindows = navigator.userAgent.includes("Windows")
  const { filterProp, setFilterProp, initialState } = useSearch()
  const [tempFilterProp, setTempFilterProp] = useState(filterProp)
  const [destinations, setDestinations] = useState(defaultDestinations)
  const [isLoading, setIsLoading] = useState(true)

  const sliderMin = 0
  const sliderMax = 100000

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      easing: "ease-in-out",
      once: true,
    })
  }, [])

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(
          "https://edu-brink-backend.vercel.app/api/country/fields/query?fields=countryName,countryCode",
        )
        if (!res.ok) throw new Error("Failed to fetch destinations")

        const data = await res.json()
        const countries = Array.isArray(data) ? data : data?.data || []

        if (countries.length > 0) {
          setDestinations(countries)
        }
      } catch (error) {
        console.error("Error fetching destinations:", error)
        // Keep using default destinations on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const toggleCountrySelection = (country) => {
    setTempFilterProp((prev) => ({
      ...prev,
      Destination: prev.Destination.includes(country)
        ? prev.Destination.filter((item) => item !== country)
        : [...prev.Destination, country],
    }))
  }

  const handleToggleSelection = (filterKey, value) => {
    setTempFilterProp((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? null : value,
    }))
  }

  const handleSliderChange = ([newMin, newMax]) => {
    if (newMax - newMin >= 100) {
      setTempFilterProp((prev) => ({
        ...prev,
        minBudget: newMin,
        maxBudget: newMax,
      }))
    } else {
      setTempFilterProp((prev) => ({
        ...prev,
        minBudget: newMin,
        maxBudget: newMin + 100 > sliderMax ? sliderMax : newMin + 100,
      }))
    }
  }

  const resetFilters = () => {
    setTempFilterProp(initialState)
    setFilterProp(initialState)
    setShowFilter(!showFilter)
  }

  const handleSubmit = () => {
    setFilterProp(tempFilterProp)
    setShowFilter(!showFilter)
  }

  // Function to get country emoji from country code
  const getCountryEmoji = (countryCode) => {
    if (!countryCode) return "🏳️"

    const country = countryFlags.find(
      (c) => c.code === countryCode.toUpperCase() || c.alpha3 === countryCode.toUpperCase(),
    )

    return country ? (
      <span
        style={{
          fontFamily: `"Segoe UI Emoji", "Apple Color Emoji", sans-serif`,
        }}
      >
        {country.emoji}
      </span>
    ) : (
      "🏳️"
    )
  }

  return (
    <div
      data-aos="fade-left"
      data-aos-delay="50"
      data-aos-duration="300"
      data-aos-easing="ease-in-out"
      dir={language === "ar" ? "rtl" : "ltr"}
      className="fixed text-sm right-0 top-0 md:pb-48 mmd:pb-5 h-full w-[100%] 
      sm:w-[80%] md:w-[44%] xl:w-[30%] bg-[#F9FAFB] shadow-lg p-6 z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{t("filters", "Filters")}</h2>
        <button onClick={() => setShowFilter(false)} className="text-gray-500 text-2xl hover:text-gray-700">
          x
        </button>
      </div>

      {/* Filter Content */}
      <div>
        <p className="font-medium text-sm mb-2">{t("destination", "Destination")}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {destinations.map((country) => (
            <div
              key={country.countryCode}
              className={`flex items-center cursor-pointer text-black justify-center py-2 text-sm px-3 rounded-full ${
                tempFilterProp?.Destination?.includes(
                  language === "ar" ? country?.countryName?.ar : country?.countryName?.en,
                )
                  ? "bg-[#EDE9FE]"
                  : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
              onClick={() =>
                toggleCountrySelection(language === "ar" ? country?.countryName?.ar : country?.countryName?.en)
              }
            >
              {isWindows ? (
                country?.countryCode ? (
                  <img
                    src={`https://flagcdn.com/w320/${getEmoji(country.countryCode)}.png`}
                    alt="Country Flag"
                    className="w-4 h-3 mr-2"
                  />
                ) : (
                  <span className="text-[.6rem] font-medium mr-2">🏳️</span>
                )
              ) : (
                <span className="mr-2">{getCountryEmoji(country?.countryCode)}</span>
              )}
              {language === "ar" ? country?.countryName?.ar : country?.countryName?.en}
            </div>
          ))}
        </div>

        {/* Study Level */}
        <p className="font-medium mb-2">{t("studyLevel", "Study Level")}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { en: "All", ar: "الكل" },
            { en: "UnderGraduate", ar: "بكالوريوس" },
            { en: "PostGraduate", ar: "دراسات عليا" },
            { en: "Foundation", ar: "تأسيسي" },
            { en: "Doctorate", ar: "دكتوراه" },
          ].map((level) => (
            <button
              key={level.en}
              onClick={() => setTempFilterProp((prev) => ({ ...prev, StudyLevel: level.en }))}
              className={`px-4 py-2 rounded-full text-sm text-black ${
                tempFilterProp.StudyLevel === level.en ? "bg-[#EDE9FE]" : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
            >
              {language === "ar" ? level.ar : level.en}
            </button>
          ))}
        </div>

        {/* Entrance Exam */}
        <p className="font-medium mb-2">{t("entranceExam", "Entrance Exam")}</p>
        <div className="flex space-x-4 mb-4">
          {[
            { en: "Yes", ar: "نعم" },
            { en: "No", ar: "لا" },
          ].map((option) => (
            <button
              key={option.en}
              onClick={() =>
                setFilterProp((prev) => ({
                  ...prev,
                  EntranceExam: option.en === "Yes",
                }))
              }
              className={`px-4 py-2 rounded-full text-sm text-black ${
                (tempFilterProp.EntranceExam && option.en === "Yes") ||
                (!tempFilterProp.EntranceExam && option.en === "No")
                  ? "bg-[#EDE9FE]"
                  : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
            >
              {language === "ar" ? option.ar : option.en}
            </button>
          ))}
        </div>

        {/* University Type */}
        <p className="font-medium mb-2">{t("universityType", "University Type")}</p>
        <div className="flex space-x-4 mb-4">
          {[
            { en: "Public", ar: "حكومية" },
            { en: "Private", ar: "خاصة" },
          ].map((option) => (
            <button
              key={option.en}
              onClick={() => handleToggleSelection("UniType", option.en)}
              className={`px-4 py-2 rounded-full text-sm text-black ${
                tempFilterProp.UniType === option.en ? "bg-[#EDE9FE]" : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
            >
              {language === "ar" ? option.ar : option.en}
            </button>
          ))}
        </div>

        {/* Intake Year */}
        <p className="font-medium mb-2">{t("intakeYear", "Intake Year")}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from({ length: 9 }, (_, index) => new Date().getFullYear() + index).map((year) => (
            <button
              key={year}
              onClick={() => handleToggleSelection("IntakeYear", year)}
              className={`px-4 py-2 rounded-full text-sm ${
                tempFilterProp.IntakeYear === year ? "bg-[#EDE9FE]" : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Intake Month */}
        <p className="font-medium mb-2">{t("intakeMonth", "Intake Month")}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { short: { en: "Jan", ar: "ينا" }, full: { en: "January", ar: "يناير" } },
            { short: { en: "Feb", ar: "فبر" }, full: { en: "February", ar: "فبراير" } },
            { short: { en: "Mar", ar: "مار" }, full: { en: "March", ar: "مارس" } },
            { short: { en: "Apr", ar: "أبر" }, full: { en: "April", ar: "أبريل" } },
            { short: { en: "May", ar: "ماي" }, full: { en: "May", ar: "مايو" } },
            { short: { en: "Jun", ar: "يون" }, full: { en: "June", ar: "يونيو" } },
            { short: { en: "Jul", ar: "يول" }, full: { en: "July", ar: "يوليو" } },
            { short: { en: "Aug", ar: "أغس" }, full: { en: "August", ar: "أغسطس" } },
            { short: { en: "Sep", ar: "سبت" }, full: { en: "September", ar: "سبتمبر" } },
            { short: { en: "Oct", ar: "أكت" }, full: { en: "October", ar: "أكتوبر" } },
            { short: { en: "Nov", ar: "نوف" }, full: { en: "November", ar: "نوفمبر" } },
            { short: { en: "Dec", ar: "ديس" }, full: { en: "December", ar: "ديسمبر" } },
          ].map(({ short, full }) => (
            <button
              key={full.en}
              onClick={() => handleToggleSelection("IntakeMonth", full.en)}
              className={`px-4 py-2 rounded-full text-sm ${
                tempFilterProp.IntakeMonth === full.en ? "bg-[#EDE9FE]" : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
            >
              {language === "ar" ? short.ar : short.en}
            </button>
          ))}
        </div>

        <div className="h-[1px] w-[100%] my-10 bg-gray-300"></div>

        {/* Course Options */}
        <div className="font-medium mb-3 flex items-center gap-2 justify-start">
          <CourseBook />
          {t("courseOptions", "Course Options")}
        </div>
        <p className="font-medium mb-3">{t("coursesWith", "Courses with")}</p>
        <p className="">✔ {t("expressOffer", "Express offer")}</p>
        <p className="mb-3 pl-4">{t("preConditionalOffer", "Pre-conditional offer in just a few hours")}</p>

        {/* Mode of Study */}
        <p className="font-medium mb-2">{t("modeOfStudy", "Mode of Study")}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { en: "Full Time", ar: "دوام كامل" },
            { en: "Distance Learning", ar: "تعلم عن بعد" },
            { en: "Online", ar: "عبر الإنترنت" },
            { en: "Blended", ar: "مدمج" },
          ].map((mode) => (
            <button
              key={mode.en}
              onClick={() => handleToggleSelection("ModeOfStudy", mode.en)}
              className={`px-4 py-2 rounded-full text-sm ${
                tempFilterProp.ModeOfStudy === mode.en ? "bg-[#EDE9FE]" : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
            >
              {language === "ar" ? mode.ar : mode.en}
            </button>
          ))}
        </div>

        {/* Course Duration */}
        <p className="font-medium mb-2">{t("courseDuration", "Course Duration")}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: { en: "Less than 1 year", ar: "أقل من سنة" }, value: "1-12" },
            { label: { en: "1 - 2 years", ar: "1 - 2 سنوات" }, value: "12-24" },
            { label: { en: "2 - 3 years", ar: "2 - 3 سنوات" }, value: "24-36" },
            { label: { en: "3 - 4 years", ar: "3 - 4 سنوات" }, value: "36-48" },
            { label: { en: "4 - 5 years", ar: "4 - 5 سنوات" }, value: "48-60" },
            { label: { en: "More than 5 years", ar: "أكثر من 5 سنوات" }, value: "60+" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() =>
                setTempFilterProp((prev) => ({
                  ...prev,
                  CourseDuration: prev.CourseDuration === value ? "" : value,
                }))
              }
              className={`px-4 py-2 rounded-full text-sm ${
                tempFilterProp.CourseDuration === value ? "bg-[#EDE9FE]" : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
            >
              {language === "ar" ? label.ar : label.en}
            </button>
          ))}
        </div>

        <div className="h-[1px] w-[100%] my-10 bg-gray-300"></div>

        {/* Budget */}
        <div className="slider-container">
          <div className="font-medium mb-3 flex items-center gap-2 justify-start">
            <CourseBook />
            {t("budget", "Budget")}
          </div>
          <p className="font-medium mb-2">{t("feeRange", "Fee Range")}</p>
          <div className="range-inputs">
            <input
              type="number"
              value={tempFilterProp.minBudget}
              onChange={(e) => {
                const newValue = Math.min(Number(e.target.value), tempFilterProp.maxBudget - 1)
                setTempFilterProp((prev) => ({ ...prev, minBudget: newValue }))
              }}
              min={sliderMin}
              max={sliderMax}
            />
            <input
              type="number"
              value={tempFilterProp.maxBudget}
              onChange={(e) => {
                const newValue = Math.max(Number(e.target.value), tempFilterProp.minBudget + 1)
                setTempFilterProp((prev) => ({ ...prev, maxBudget: newValue }))
              }}
              min={sliderMin}
              max={sliderMax}
            />
          </div>

          {/* React Slider (Range) */}
          <ReactSlider
            min={sliderMin}
            max={sliderMax}
            value={[tempFilterProp.minBudget, tempFilterProp.maxBudget]}
            onChange={handleSliderChange}
            className="react-slider"
            thumbClassName="thumb"
            trackClassName="track"
            renderThumb={(props, state) => <div {...props} key={state.index} />}
            renderTrack={(props, state) => {
              const { key, ...rest } = props
              return (
                <React.Fragment key={`track-${state.index}`}>
                  <div {...rest} className="track" />
                  <div
                    className="active-range"
                    style={{
                      left: `${((tempFilterProp.minBudget - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
                      width: `${
                        ((tempFilterProp.maxBudget - tempFilterProp.minBudget) / (sliderMax - sliderMin)) * 100
                      }%`,
                    }}
                  />
                </React.Fragment>
              )
            }}
          />
        </div>

        {/* Reset and Show Buttons */}
        <div className="flex justify-between gap-2 mt-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 w-[50%] bg-transperent border-[1.5px] border-gray-300 rounded-full text-black hover:bg-gray-100"
          >
            {t("resetFilter", "Reset Filter")}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 w-[50%] text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754]"
          >
            {t("showAllCourses", "Show All Courses")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar

