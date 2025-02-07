import React, { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { useSearch } from "../../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";

const FindCourses = () => {
  const { setFilterProp, setSearchState } = useSearch();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    studyLevel: "",
    subjectPreference: "",
    duration: "",
  });
  const navigate = useNavigate();

  const { data } = useFetch("https://edu-brink-backend.vercel.app/api/tags");

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchState((prev) => ({
      ...prev,
      searchTerm: filters.subjectPreference,
      filteredResults: [],
      selectedIndex: null,
    }));

    setFilterProp((prev) => ({
      ...prev,
      CourseDuration: filters.duration,
      StudyLevel: filters.studyLevel,
      searchQuery: { ...prev.searchQuery, en: filters.subjectPreference },
    }));

    navigate(`/${language}/searchresults`);
  };

  return (
    <div className="bg-white w-[90%] sm:w-[85%] mb-24 h-auto mx-auto p-6 rounded-3xl mt-5 py-14 shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-12 text-center">
        {t("findCourses.title")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Dropdown 1 */}
        <div className="relative">
          <label
            htmlFor="studyLevel"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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

        {/* Dropdown 2 */}
        <div className="relative">
          <label
            htmlFor="subjectPreference"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
            {data?.map((option, idx) => (
              <option key={idx} value={option?.TagName?.en}>
                {language === "ar" ? option?.TagName?.ar : option?.TagName?.en}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown 3 */}
        <div className="relative">
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("findCourses.duration")}
          </label>
          <select
            id="duration"
            name="duration"
            value={filters.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 sm:h-[37px] rounded-2xl py-2 pl-3 pr-10 text-black font-light text-[.8rem]
             focus:outline-none focus:ring-1 focus:ring-[#380C95]"
          >
            <option value="">{t("findCourses.select")}</option>
            <option value="1-12">{t("findCourses.shortTerm")}</option>
            <option value="12-24">{t("findCourses.longTerm")}</option>
          </select>
        </div>

        {/* Dropdown 4 */}
        <div className="relative ">
          <label
            htmlFor="courseType"
            className="block text-sm font-medium text-white mb-2"
          >
            {t("findCourses.duration")}
          </label>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-full w-full text-white text-[.9rem] bg-gradient-to-r from-[#380C95] to-[#E15754] focus:outline-none focus:ring-[#380C95]"
          >
            {t("findCourses.findCoursesBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindCourses;
