import React, { useState, useRef, useEffect } from "react";
import Star from "../../../svg/StarLogo";
import UniversityLogo from "../../../svg/UniversityLogo";
import { useTranslation } from "react-i18next";

const UniversityHighlight = ({ data, language }) => {
  const [activeSection, setActiveSection] = useState("overview");
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [showFullDescription, setShowFullDescription] = useState({});

  const isContentOverflowing = () => {
    if (!contentRef.current) return false;
    const content = contentRef.current;
    const lineHeight = parseInt(
      window.getComputedStyle(content).lineHeight,
      10
    );
    const maxHeight = lineHeight * 3;
    const isOverflowing = content.scrollHeight > maxHeight;
    const wordCount = content.textContent.split(/\s+/).length;
    return isOverflowing || wordCount > 300;
  };

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setExpanded(false);
  };

  const toggleCampusDescription = (campusId) => {
    setShowFullDescription((prev) => ({
      ...prev,
      [campusId]: !prev[campusId]
    }));
  };

  useEffect(() => {
    if (contentRef.current) {
      setExpanded(false);
    }
  }, [activeSection, data, language]);

  const highlights = t("UniversitySlugPage.HighlightArray", {
    returnObjects: true,
  });

  return (
    <div className="bg-[#652986] bg-opacity-5 rounded-xl p-6 mb-8">
      <div className="layout-wrapper">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#652986] bg-opacity-10 flex items-center justify-center text-[#652986]">
            <Star />
          </div>
          <h2 className="font-semibold text-xl text-[#652986]">
            {t("UniversitySlugPage.Highlight")}
          </h2>
        </div>

        {/* Section Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {highlights.map((highlight, index) => {
            const sectionName = 
              index === 0 ? "overview" : 
              index === 1 ? "accommodation" : 
              index === 2 ? "library" : 
              index === 3 ? "sports" : "studentLife";
            
            const isActive = activeSection === sectionName;
            
            return (
              <button
                key={index}
                onClick={() => handleSectionClick(sectionName)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#652986] to-[#873299] text-white shadow-md"
                    : "bg-white text-[#652986] hover:bg-[#652986] hover:bg-opacity-10"
                }`}
              >
                {highlight}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div
            ref={contentRef}
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "max-h-[2000px]" : "max-h-[4.5rem]"
            }`}
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
              <p className="text-gray-700">{data?.uniAccomodation?.[language] || "No accommodation information available"}</p>
            )}
            {activeSection === "library" && (
              <p className="text-gray-700">{data?.uniLibrary?.libraryDescription?.[language] || "No library information available"}</p>
            )}
            {activeSection === "sports" && (
              <p className="text-gray-700">{data?.uniSports?.sportsDescription?.[language] || "No sports information available"}</p>
            )}
            {activeSection === "studentLife" && (
              <p className="text-gray-700">
                {data?.studentLifeStyleInUni?.lifestyleDescription?.[language] || "No student life information available"}
              </p>
            )}
          </div>

          {isContentOverflowing() && (
            <button
              onClick={toggleExpand}
              className="mt-2 flex items-center gap-2 font-medium text-[#652986] hover:text-[#873299] transition-colors"
            >
              <span>{expanded ? "Read less" : "Read more"}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Campus Section */}
      {data?.campuses?.length > 0 && data?.campuses?.[0]?.campusName?.en && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#652986] bg-opacity-10 flex items-center justify-center text-[#652986]">
              <UniversityLogo />
            </div>
            <h2 className="font-semibold text-xl text-[#652986]">
              {t("UniversitySlugPage.Campus")}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {data?.campuses.map((campus, index) => (
              <div
                key={index}
                className="bg-white rounded-xl md:col-span-1 col-span-1 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-[#652986] text-lg">
                    {campus?.campusName?.[language] || "Campus"}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#652986] bg-opacity-10 text-[#652986]">
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
                      className="flex items-center gap-1 text-[#652986] text-sm font-medium hover:text-[#873299] transition-colors"
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
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 ${showFullDescription[index] ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Campus Facilities */}
                {campus?.campusFacilities?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-[#652986] mb-3">
                      {t("UniversitySlugPage.Facilities")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {campus.campusFacilities.map((facility, facilityIndex) => (
                        <span 
                          key={facilityIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#652986] bg-opacity-5 text-[#652986]"
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
  );
};

export default UniversityHighlight;
