import React, { useState } from "react";
import Star from "../../../svg/StarLogo";
import UniversityLogo from "../../../svg/UniversityLogo";

const UniversityHighlight = ({ data, language }) => {
  const [expandedSection, setExpandedSection] = useState(null); // Single state

  const toggleContent = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="container ml-5 mt-5">
      <div className="layout-wrapper">
        <div className="flex gap-4">
          <span>
            <Star />
          </span>
          <p className="font-medium font-sans text-lg leading-7">Highlight</p>
        </div>

        <div className="flex flex-wrap gap-4 mt-5 mb-5">
          <button className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
            Overview
          </button>
          <button className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
            Accommodation
          </button>
          <button className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
            Library
          </button>
          <button className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
            Sports
          </button>
          <button className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
            Student Life
          </button>
        </div>

        {/* Overview Section */}
        <div className="font-sans text-base font-normal leading-6 py-6 rounded-lg">
          <div
            className={`overflow-hidden transition-all ${
              expandedSection === "overview" ? "max-h-[1000px]" : "max-h-10"
            }`}
          >
            <p className="mt-4 mb-4">{data?.uniOverview?.en}</p>
          </div>
          <button
            onClick={() => toggleContent("overview")}
            className="inline-flex justify-between items-center text-left font-semibold text-purple-700 text-lg py-2"
          >
            <span>
              {expandedSection === "overview" ? "Read less" : "Read more"}
            </span>
          </button>
        </div>
      </div>

      {/* Campus Section */}
      <div className="footer">
        <div className="flex gap-4">
          <UniversityLogo />
          <p className="font-sans font-medium text-lg leading-7 text-black">
            Campus
          </p>
        </div>
        <div className="flex gap-4 mt-[1.5rem]">
          <button className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
            {language === "ar"
              ? data?.uniLocation?.uniState?.ar
              : data?.uniLocation?.uniState?.en}
          </button>
        </div>

        <div className="font-sans text-base font-normal leading-6 py-6 rounded-lg">
          <div
            className={`overflow-hidden transition-all ${
              expandedSection === "campus" ? "max-h-[1000px]" : "max-h-10"
            }`}
          >
            <p className="mt-4 mb-4">
              {language === "ar"
                ? data?.uniAccomodation?.ar
                : data?.uniAccomodation?.en}
            </p>
            <p className="mt-4 mb-4">
              {language === "ar"
                ? data?.uniSports?.sportsDescription?.ar
                : data?.uniSports?.sportsDescription?.en}
            </p>
            <p className="mt-4 mb-4">
              {language === "ar"
                ? data?.uniLibrary?.libraryDescription?.ar
                : data?.uniLibrary?.libraryDescription?.en}
            </p>
          </div>
          <button
            onClick={() => toggleContent("campus")}
            className="inline-flex justify-between items-center text-left font-semibold text-purple-700 text-lg py-2"
          >
            <span>
              {expandedSection === "campus" ? "Read less" : "Read more"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityHighlight;
