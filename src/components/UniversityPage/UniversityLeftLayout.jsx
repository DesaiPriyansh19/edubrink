"use client";

import { useState, useRef, useEffect } from "react";
import { getEmoji } from "../../../libs/countryFlags";
import { useTranslation } from "react-i18next";
import { ChevronDown, X } from "lucide-react";
const isWindows = navigator.userAgent.includes("Windows");

const UniversityLeftLayout = ({
  data,
  language,
  themeColor = "#3b3d8d",
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState({
    type: null, // 'studyLevel' or 'modeOfStudy'
    value: null,
  });

  // Store filter options in state
  const [studyLevelOptions, setStudyLevelOptions] = useState([]);
  const [modeOfStudyOptions, setModeOfStudyOptions] = useState([]);

  // Extract unique filter options from data and store in state
  useEffect(() => {
    if (data?.courses) {
      const uniqueLevels = [
        ...new Set(data.courses.flatMap((course) => course?.StudyLevel || [])),
      ];
      setStudyLevelOptions(uniqueLevels);
    }

    if (data?.majors) {
      const uniqueModes = [
        ...new Set(data.majors.flatMap((major) => major?.modeOfStudy || "")),
      ].filter((mode) => mode); // Filter out empty values

      setModeOfStudyOptions(uniqueModes);
    }
  }, [data, language]);

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

  // Handle study level selection
  const handleStudyLevelClick = (level) => {
    if (activeFilter.type === "studyLevel" && activeFilter.value === level) {
      // If clicking the same level, deselect it
      setActiveFilter({ type: null, value: null });

      // Notify parent component about the filter change
      if (typeof onFilterChange === "function") {
        onFilterChange({ studyLevel: null, modeOfStudy: null });
      }
    } else {
      // Otherwise, select the new level
      setActiveFilter({ type: "studyLevel", value: level });

      // Notify parent component about the filter change
      if (typeof onFilterChange === "function") {
        onFilterChange({ studyLevel: level, modeOfStudy: null });
      }
    }
  };

  // Handle mode of study selection
  const handleModeOfStudyClick = (mode) => {
    if (activeFilter.type === "modeOfStudy" && activeFilter.value === mode) {
      // If clicking the same mode, deselect it
      setActiveFilter({ type: null, value: null });

      // Notify parent component about the filter change
      if (typeof onFilterChange === "function") {
        onFilterChange({ studyLevel: null, modeOfStudy: null });
      }
    } else {
      // Otherwise, select the new mode
      setActiveFilter({ type: "modeOfStudy", value: mode });

      // Notify parent component about the filter change
      if (typeof onFilterChange === "function") {
        onFilterChange({ studyLevel: null, modeOfStudy: mode });
      }
    }
  };

  // Clear filter handler
  const handleClearFilter = () => {
    setActiveFilter({ type: null, value: null });

    // Notify parent component
    if (typeof onFilterChange === "function") {
      onFilterChange({ studyLevel: null, modeOfStudy: null });
    }
  };

  useEffect(() => {
    // Reset expanded state when data changes
    setExpanded(false);
  }, [data, language]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 transition-colors duration-300 hover:text-[#3b3d8d]">
          {language === "ar" ? data?.uniName?.ar : data?.uniName?.en}
        </h2>

        {isWindows ? (
          data?.countryCode ? (
            <div className="flex items-center gap-2 mt-2 group">
              <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-gray-200 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={`https://flagcdn.com/w320/${getEmoji(
                    data?.countryCode
                  )}.png`}
                  alt="Country Flag"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-semibold text-[#3b3d8d] transition-all duration-300 group-hover:text-[#3b3d8d]/80 group-hover:translate-x-1">
                {language === "ar"
                  ? data?.countryName?.ar
                  : data?.countryName?.en}
              </p>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-500">
              No flag available
            </span>
          )
        ) : (
          <div className="flex items-center gap-2 mt-2 group">
            <span className="text-2xl transition-transform duration-300 group-hover:scale-125">
              {data?.countryFlag}
            </span>
            <p className="text-lg font-semibold text-[#3b3d8d] transition-all duration-300 group-hover:text-[#3b3d8d]/80 group-hover:translate-x-1">
              {language === "ar"
                ? data?.countryName?.ar
                : data?.countryName?.en}
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
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>

          <button
            onClick={toggleExpand}
            className="mt-3 bg-white text-[#3b3d8d] rounded-full text-sm font-medium hover:bg-[#3b3d8d]/5 transition-colors flex items-center gap-1.5"
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
        </div>

        {/* Active filter indicator */}
        {activeFilter.value && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {t("UniversitySlugPage.activeFilter") || "Active filter"}:
              </span>
              <span className="bg-[#3b3d8d]/10 text-[#3b3d8d] px-3 py-1 rounded-full text-sm font-medium">
                {activeFilter.value}
              </span>
            </div>
            <button
              onClick={handleClearFilter}
              className="flex items-center gap-1 text-xs text-[#3b3d8d] hover:text-[#3b3d8d]/80 transition-colors"
            >
              {t("UniversitySlugPage.clearFilter") || "Clear filter"}{" "}
              <X className="w-3 h-3" />
            </button>
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
              {studyLevelOptions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStudyLevelClick(item)}
                  className={`bg-gray-100 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-sm cursor-pointer ${
                    activeFilter.type === "studyLevel" &&
                    activeFilter.value === item
                      ? "bg-[#3b3d8d] text-white"
                      : "text-gray-700 hover:bg-[#3b3d8d]/10 hover:text-[#3b3d8d]"
                  }`}
                >
                  {item}
                </button>
              ))}
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
              {modeOfStudyOptions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleModeOfStudyClick(item)}
                  className={`bg-gray-100 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-sm cursor-pointer ${
                    activeFilter.type === "modeOfStudy" &&
                    activeFilter.value === item
                      ? "bg-[#3b3d8d] text-white"
                      : "text-gray-700 hover:bg-[#3b3d8d]/10 hover:text-[#3b3d8d]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityLeftLayout;
