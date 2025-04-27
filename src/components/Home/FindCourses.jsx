"use client"

import { useState } from "react"
import { useSearch } from "../../../context/SearchContext"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../../context/LanguageContext"
import { useTranslation } from "react-i18next"
import useDropdownData from "../../../hooks/useDropdownData"

const FindCourses = () => {
  const { setFilterProp, setSearchState } = useSearch()
  const { language } = useLanguage()
  const { filteredData } = useDropdownData()
  const { t } = useTranslation()
  const [filters, setFilters] = useState({
    destination: "",
    subjectPreference: "",
    studyLevel: "",
  })
  const navigate = useNavigate()

  const { addTags: data } = useDropdownData()

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setSearchState((prev) => ({
      ...prev,
      searchTerm: filters.subjectPreference,
      filteredResults: [],
      selectedIndex: null,
    }))

    setFilterProp((prev) => ({
      ...prev,
      Destination: filters.destination,
      StudyLevel: filters.studyLevel,
      searchQuery: { ...prev.searchQuery, en: filters.subjectPreference },
    }))

    navigate(`/${language}/searchresults`)
  }

  return (
    <div className="bg-white w-[90%] sm:w-[85%] mb-24 h-auto mx-auto p-6 rounded-3xl mt-5 py-14 shadow-sm">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-12 text-center">{t("findCourses.title")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Study Level Dropdown */}
        <div className="relative">
          <label htmlFor="studyLevel" className="block text-sm font-medium text-gray-700 mb-2">
            {t("findCourses.studyLevel")}
          </label>
          <select
            id="studyLevel"
            name="studyLevel"
            value={filters.studyLevel}
            onChange={handleChange}
            className="w-full border border-gray-300 sm:h-[37px] rounded-xl py-2 pl-3 pr-10 text-black font-light text-[.8rem]
             focus:outline-none focus:ring-1 focus:ring-[#380C95]"
          >
            {t("studyLevels", { returnObjects: true }).map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Preference Dropdown */}
        <div className="relative">
          <label htmlFor="subjectPreference" className="block text-sm font-medium text-gray-700 mb-2">
            {t("findCourses.subjectPreference")}
          </label>
          <select
            id="subjectPreference"
            name="subjectPreference"
            value={filters.subjectPreference}
            onChange={handleChange}
            className="w-full border border-gray-300 sm:h-[37px] rounded-xl py-2 pl-3 pr-10 text-black font-light text-[.8rem]
            focus:outline-none focus:ring-1 focus:ring-[#380C95]"
          >
            <option value="">{t("findCourses.select")}</option>
            {data &&
              data[0]?.tags?.[language]?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>

        {/* Destination Dropdown (was incorrectly labeled as duration) */}
        <div className="relative">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
            {t("destination")}
          </label>
          <select
            id="destination"
            name="destination"
            value={filters.destination}
            onChange={handleChange}
            className="w-full border border-gray-300 sm:h-[37px] rounded-xl py-2 pl-3 pr-10 text-black font-light text-[.8rem]
             focus:outline-none focus:ring-1 focus:ring-[#380C95]"
          >
            <option value="">{t("findCourses.select")}</option>
            {filteredData?.countries?.map((country) => (
              <option key={country._id} value={country.countryName[language]}>
                {country.countryName[language]}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="relative flex items-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-full w-full text-white text-[.9rem] bg-[#3b3d8d] hover:bg-[#2d2f6a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#380C95] focus:ring-opacity-50"
          >
            {t("findCourses.findCoursesBtn")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FindCourses
