import React, { useState, useRef, useEffect } from "react";
import Star from "../../../svg/StarLogo";
import UniversityLogo from "../../../svg/UniversityLogo";

const UniversityHighlight = ({ data, language }) => {
  const [activeSection, setActiveSection] = useState("overview"); // Track active section
  const [expanded, setExpanded] = useState(false); // Track if content is expanded
  const contentRef = useRef(null); // Ref to measure content height
  const [showFullDescription, setShowFullDescription] = useState(false); // State for "Read More"

  // Check if content exceeds 3 lines or 300 words
  const isContentOverflowing = () => {
    if (!contentRef.current) return false;
    const content = contentRef.current;
    const lineHeight = parseInt(
      window.getComputedStyle(content).lineHeight,
      10
    );
    const maxHeight = lineHeight * 3; // 3 lines
    const isOverflowing = content.scrollHeight > maxHeight;
    const wordCount = content.textContent.split(/\s+/).length;
    return isOverflowing || wordCount > 300;
  };

  // Toggle expanded state
  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  // Set active section
  const handleSectionClick = (section) => {
    setActiveSection(section);
    setExpanded(false); // Reset expanded state when switching sections
  };

  // Effect to check overflow on content change
  useEffect(() => {
    if (contentRef.current) {
      setExpanded(false); // Reset expanded state when content changes
    }
  }, [activeSection, data, language]);

  return (
    <div className="container ml-5 mt-5">
      <div className="layout-wrapper">
        <div className="flex gap-4">
          <span>
            <Star />
          </span>
          <p className="font-medium font-sans text-lg leading-7">Highlight</p>
        </div>

        {/* Section Buttons */}
        <div className="flex flex-wrap gap-4 mt-5 mb-5">
          <button
            onClick={() => handleSectionClick("overview")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              activeSection === "overview"
                ? "bg-[#d65458] text-white"
                : "bg-[#f5ebeb] text-[#652986] hover:bg-[#d65458] hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleSectionClick("accommodation")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              activeSection === "accommodation"
                ? "bg-[#d65458] text-white"
                : "bg-[#f5ebeb] text-[#652986] hover:bg-[#d65458] hover:text-white"
            }`}
          >
            Accommodation
          </button>
          <button
            onClick={() => handleSectionClick("library")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              activeSection === "library"
                ? "bg-[#d65458] text-white"
                : "bg-[#f5ebeb] text-[#652986] hover:bg-[#d65458] hover:text-white"
            }`}
          >
            Library
          </button>
          <button
            onClick={() => handleSectionClick("sports")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              activeSection === "sports"
                ? "bg-[#d65458] text-white"
                : "bg-[#f5ebeb] text-[#652986] hover:bg-[#d65458] hover:text-white"
            }`}
          >
            Sports
          </button>
          <button
            onClick={() => handleSectionClick("studentLife")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              activeSection === "studentLife"
                ? "bg-[#d65458] text-white"
                : "bg-[#f5ebeb] text-[#652986] hover:bg-[#d65458] hover:text-white"
            }`}
          >
            Student Life
          </button>
        </div>

        {/* Content Section */}
        <div className="font-sans text-base font-normal leading-6 py-6 rounded-3xl md:max-w-[90%] bg-[#f5ebeb] p-4">
          <div
            ref={contentRef}
            className={`overflow-hidden transition-all ${
              expanded ? "max-h-[1000px]" : "max-h-[4.5rem]"
            }`}
          >
            {activeSection === "overview" && (
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.uniOverview?.[language],
                }}
              />
            )}
            {activeSection === "accommodation" && (
              <p>{data?.uniAccomodation?.[language]}</p>
            )}
            {activeSection === "library" && (
              <p>{data?.uniLibrary?.libraryDescription?.[language]}</p>
            )}
            {activeSection === "sports" && (
              <p>{data?.uniSports?.sportsDescription?.[language]}</p>
            )}
            {activeSection === "studentLife" && (
              <p>
                {data?.studentLifeStyleInUni?.lifestyleDescription?.[language]}
              </p>
            )}
          </div>

          {/* Show "Read more" button if content overflows */}
          {isContentOverflowing() && (
            <button
              onClick={toggleExpand}
              className="inline-flex justify-between items-center text-left font-semibold text-[#652986] text-lg py-2 hover:text-[#d65458]"
            >
              <span>{expanded ? "Read less" : "Read more"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Campus Section */}
      {data?.campuses?.[0]?.campusName.en && (
        <div className="footer mt-6">
          <div className="flex gap-4">
            <UniversityLogo />
            <p className="font-sans font-medium text-lg leading-7 text-[#652986]">
              Campus
            </p>
          </div>
          <div className="flex gap-4 mt-[1.5rem]">
            {data?.campuses.map((campus, index) => {
              return (
                <div
                  key={index}
                  className="bg-[#f5ebeb] p-4 rounded-3xl md:max-w-[90%] shadow-sm"
                >
                  <button className="bg-white px-3 py-1 rounded-full text-sm mb-2 text-[#652986] hover:bg-[#d65458] hover:text-white transition-all">
                    {campus?.campusName?.[language]}
                  </button>

                  {/* Campus Location and Description */}
                  <div className="mt-2">
                    <p className="font-medium text-[#652986]">
                      {campus?.campusLocation?.uniCity?.[language]}
                    </p>
                    <p className="text-[#652986] text-sm mt-1">
                      {showFullDescription
                        ? campus?.campusLocation?.uniDescription?.[language]
                        : campus?.campusLocation?.uniDescription?.[
                            language
                          ]?.slice(0, 100) + "..."}
                    </p>
                    {campus?.campusLocation?.uniDescription?.[language]
                      ?.length > 100 && (
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="text-[#d65458] text-sm mt-1 hover:text-[#652986]"
                      >
                        {showFullDescription ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>

                  {/* Campus Facilities */}
                  {campus?.campusFacilities?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium text-[#652986]">Facilities:</p>
                      <ul className="list-disc list-inside text-sm text-[#652986]">
                        {campus.campusFacilities.map(
                          (facility, facilityIndex) => (
                            <li key={facilityIndex}>{facility}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityHighlight;