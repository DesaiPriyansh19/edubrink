"use client";

import { useState, useRef, useEffect } from "react";
import { getEmoji } from "../../../libs/countryFlags";
import { useTranslation } from "react-i18next";
import { ChevronDown, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
const isWindows = navigator.userAgent.includes("Windows");

// Update the component props to receive originalData
const UniversityLeftLayout = ({
  data,
  originalData,
  language,
  themeColor = "#3b3d8d",
  onFilterChange,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);

  // Updated state to support multiple selections
  const [activeFilters, setActiveFilters] = useState({
    studyLevel: [],
    modeOfStudy: [],
  });

  // Store filter options in state
  const [studyLevelOptions, setStudyLevelOptions] = useState([]);
  const [modeOfStudyOptions, setModeOfStudyOptions] = useState([]);
  // Add a state to track if initial options have been loaded
  const [initialOptionsLoaded, setInitialOptionsLoaded] = useState(false);

  // Add these multilingual objects
  const studyLevels = [
    { value: "Bachelor's", label: { en: "Bachelor's", ar: "بكالوريوس" } },
    { value: "Master's", label: { en: "Master's", ar: "ماجستير" } },
    { value: "PhD", label: { en: "PhD", ar: "دكتوراه" } },
    { value: "Diploma", label: { en: "Diploma", ar: "دبلوم" } },
    { value: "Certificate", label: { en: "Certificate", ar: "شهادة" } },
  ];

  const studyModes = [
    { value: "Full-time", label: { en: "Full-time", ar: "دوام كامل" } },
    { value: "Part-time", label: { en: "Part-time", ar: "دوام جزئي" } },
    { value: "Online", label: { en: "Online", ar: "عبر الإنترنت" } },
    { value: "Blended", label: { en: "Blended", ar: "مزيج" } },
  ];

  // Replace the useEffect that sets studyLevelOptions and modeOfStudyOptions
  useEffect(() => {
    // Use the predefined arrays instead of extracting from data
    setStudyLevelOptions(studyLevels);
    setModeOfStudyOptions(studyModes);
  }, []);

  const isContentOverflowing = () => {
    if (!contentRef.current) return false;
    const content = contentRef.current;
    const lineHeight =
      Number.parseInt(window.getComputedStyle(content).lineHeight, 10) || 24;
    const maxHeight = lineHeight * 6; // Show approximately 6 lines of text
    return content.scrollHeight > maxHeight;
  };

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  // Updated to handle multiple selections for study level
  const handleStudyLevelClick = (level) => {
    setActiveFilters((prev) => {
      // Check if this level is already selected
      const isSelected = prev.studyLevel.includes(level);

      // If selected, remove it; otherwise, add it
      const newStudyLevels = isSelected
        ? prev.studyLevel.filter((item) => item !== level)
        : [...prev.studyLevel, level];

      // Create new state with updated study levels
      const newState = {
        ...prev,
        studyLevel: newStudyLevels,
      };

      // Notify parent component about the filter change
      if (typeof onFilterChange === "function") {
        onFilterChange({
          studyLevel: newStudyLevels.length > 0 ? newStudyLevels : null,
          modeOfStudy: prev.modeOfStudy.length > 0 ? prev.modeOfStudy : null,
        });
      }

      return newState;
    });
  };

  // Updated to handle multiple selections for mode of study
  const handleModeOfStudyClick = (mode) => {
    setActiveFilters((prev) => {
      // Check if this mode is already selected
      const isSelected = prev.modeOfStudy.includes(mode);

      // If selected, remove it; otherwise, add it
      const newModeOfStudy = isSelected
        ? prev.modeOfStudy.filter((item) => item !== mode)
        : [...prev.modeOfStudy, mode];

      // Create new state with updated modes of study
      const newState = {
        ...prev,
        modeOfStudy: newModeOfStudy,
      };

      // Notify parent component about the filter change
      if (typeof onFilterChange === "function") {
        onFilterChange({
          studyLevel: prev.studyLevel.length > 0 ? prev.studyLevel : null,
          modeOfStudy: newModeOfStudy.length > 0 ? newModeOfStudy : null,
        });
      }

      return newState;
    });
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    // First update the local state
    setActiveFilters({
      studyLevel: [],
      modeOfStudy: [],
    });

    // Then notify parent component with a slight delay to prevent glitching
    setTimeout(() => {
      if (typeof onFilterChange === "function") {
        onFilterChange({ studyLevel: null, modeOfStudy: null });
      }
    }, 0);
  };

  // Clear specific filter type
  const handleClearFilterType = (filterType) => {
    setActiveFilters((prev) => {
      const newState = {
        ...prev,
        [filterType]: [],
      };

      // Return the new state first
      return newState;
    });

    // Then notify parent with a slight delay
    setTimeout(() => {
      if (typeof onFilterChange === "function") {
        onFilterChange({
          studyLevel:
            filterType === "studyLevel"
              ? null
              : activeFilters.studyLevel.length > 0
              ? activeFilters.studyLevel
              : null,
          modeOfStudy:
            filterType === "modeOfStudy"
              ? null
              : activeFilters.modeOfStudy.length > 0
              ? activeFilters.modeOfStudy
              : null,
        });
      }
    }, 0);
  };

  // Check if any filters are active
  const hasActiveFilters =
    activeFilters.studyLevel.length > 0 || activeFilters.modeOfStudy.length > 0;

  useEffect(() => {
    // Reset expanded state when data changes
    setExpanded(false);
  }, [data, language]);

  // Add a function to reset the filter options when needed (e.g., when data changes significantly)
  const resetFilterOptions = () => {
    setInitialOptionsLoaded(false);
  };

  return (
    <div className=" rounded-2xl  p-6 transition-all duration-300 ">
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 transition-colors duration-300 hover:text-[#3b3d8d]">
          {language === "ar" ? data?.uniName?.ar : data?.uniName?.en}
        </h2>

        {isWindows ? (
          data?.country?.countryCode ? (
            <div className="items-center inline-flex gap-2 mt-2 group">
              <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-gray-200 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={`https://flagcdn.com/w320/${getEmoji(
                    data?.country?.countryCode
                  )}.png`}
                  alt="Country Flag"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-semibold text-[#3b3d8d] transition-all duration-300 group-hover:text-[#3b3d8d]/80 group-hover:translate-x-1">
                {language === "ar"
                  ? data?.country?.countryName?.ar
                  : data?.country?.countryName?.en}
              </p>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-500">
              No flag available
            </span>
          )
        ) : (
          <div
            onClick={() =>
              navigate(
                `/${language}/country/${data?.country?.customURLSlug?.[language]}`
              )
            }
            className="inline-flex cursor-pointer items-center gap-2 mt-2 group"
          >
            <span className="text-2xl transition-transform duration-300 group-hover:scale-125">
              {data?.country?.countryPhotos?.countryFlag}
            </span>
            <p className="text-lg font-semibold text-[#3b3d8d] transition-all duration-300 group-hover:text-[#3b3d8d]/80 group-hover:translate-x-1">
              {language === "ar"
                ? data?.country?.countryName?.ar
                : data?.country?.countryName?.en}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-6">
        {/* Overview Section with Accordion */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#3b3d8d]">
              {t("UniversitySlugPage.Overview")}
            </h3>
          </div>

          <div className="relative">
            <div
              ref={contentRef}
              id="overview-content"
              className={`text-base font-thin text-gray-700 overflow-hidden transition-all duration-300 ${
                expanded ? "max-h-[2000px]" : "max-h-[144px]"
              }`}
              dangerouslySetInnerHTML={{
                __html:
                  data?.uniOverview?.[language] || "No overview available",
              }}
            />

            {/* Gradient fade effect at the bottom when collapsed */}
            {!expanded && isContentOverflowing() && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>

          {isContentOverflowing() && (
            <button
              onClick={toggleExpand}
              className="mt-3 px-4 py-2 text-[#3b3d8d] rounded-full text-sm font-medium hover:bg-[#3b3d8d]/5 transition-colors flex items-center gap-1.5"
            >
              {expanded
                ? t("majorPage.readLess") || "Read Less"
                : t("majorPage.readMore") || "Read More"}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Active filters indicator */}
        {hasActiveFilters && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {t("UniversitySlugPage.activeFilters") || "Active filters"}:
              </span>
              <button
                onClick={handleClearAllFilters}
                className="flex items-center gap-1 text-xs text-[#3b3d8d] hover:text-[#3b3d8d]/80 transition-colors"
              >
                {t("UniversitySlugPage.clearAllFilters") || "Clear all filters"}{" "}
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Study Level active filters */}
            {activeFilters.studyLevel.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">
                    {t("UniversitySlugPage.StudyLevel")}:
                  </span>
                  <button
                    onClick={() => handleClearFilterType("studyLevel")}
                    className="text-xs text-[#3b3d8d] hover:underline"
                  >
                    {t("UniversitySlugPage.clear") || "Clear"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.studyLevel.map((level, idx) => {
                    const levelObj = studyLevels.find(
                      (item) => item.value === level
                    );
                    return (
                      <div
                        key={idx}
                        className="bg-[#3b3d8d]/10 text-[#3b3d8d] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        {levelObj ? levelObj.label[language] : level}
                        <button
                          onClick={() => handleStudyLevelClick(level)}
                          className="w-4 h-4 rounded-full bg-[#3b3d8d]/20 flex items-center justify-center hover:bg-[#3b3d8d]/30"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode of Study active filters */}
            {activeFilters.modeOfStudy.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">
                    {t("UniversitySlugPage.ModeOfStudy")}:
                  </span>
                  <button
                    onClick={() => handleClearFilterType("modeOfStudy")}
                    className="text-xs text-[#3b3d8d] hover:underline"
                  >
                    {t("UniversitySlugPage.clear") || "Clear"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.modeOfStudy.map((mode, idx) => {
                    const modeObj = studyModes.find(
                      (item) => item.value === mode
                    );
                    return (
                      <div
                        key={idx}
                        className="bg-[#3b3d8d]/10 text-[#3b3d8d] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        {modeObj ? modeObj.label[language] : mode}
                        <button
                          onClick={() => handleModeOfStudyClick(mode)}
                          className="w-4 h-4 rounded-full bg-[#3b3d8d]/20 flex items-center justify-center hover:bg-[#3b3d8d]/30"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Study Level Section */}
        {studyLevelOptions.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">
                {t("UniversitySlugPage.StudyLevel")}
              </p>
            </div>

            <div
              className="flex flex-wrap gap-2 mb-8"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {studyLevelOptions.map((item, idx) => {
                const isSelected = activeFilters.studyLevel.includes(
                  item.value
                );
                return (
                  <button
                    key={idx}
                    onClick={() => handleStudyLevelClick(item.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-sm cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#3b3d8d] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-[#3b3d8d]/10 hover:text-[#3b3d8d]"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {item.label[language ? language : "en"]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mode of Study Section */}
        {modeOfStudyOptions.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {t("UniversitySlugPage.ModeOfStudy")}
            </p>
            <div
              className="flex flex-wrap gap-2"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {modeOfStudyOptions.map((item, idx) => {
                const isSelected = activeFilters.modeOfStudy.includes(
                  item.value
                );
                return (
                  <button
                    key={idx}
                    onClick={() => handleModeOfStudyClick(item.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-sm cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#3b3d8d] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-[#3b3d8d]/10 hover:text-[#3b3d8d]"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {item.label[language]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Subjects Section */}
        {data?.faculties?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {t("UniversitySlugPage.Subjects")}
            </p>
            <div
              className="flex flex-wrap gap-2"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {data?.faculties?.map((subject, index) => (
                <span
                  key={subject?._id}
                  className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-[#3b3d8d]/10 hover:text-[#3b3d8d] hover:shadow-sm cursor-default"
                  data-aos="zoom-in"
                  data-aos-delay={300 + index * 50}
                >
                  {language === "ar"
                    ? subject?.facultyName?.ar
                    : subject?.facultyName?.en}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityLeftLayout;
