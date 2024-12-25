import React, { useState } from "react";
import Star from "../../../svg/StarLogo";
import UniversityLogo from "../../../svg/UniversityLogo";

const UniversityHighlight = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
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
            Accomodation
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
        <div className="font-sans text-base font-normal leading-6">
          <p className="mt-10 mb-8">
            Founded in 1998, the International University of Applied Sciences is
            one of the most popular universities in Germany.
          </p>
          {isExpanded && (
            <>
              <p className="mt-10 mb-10">
                International University of Applied Sciences (IU) offers
                bachelor's, master's and MBA degrees, including engineering,
                data science, IT & Technology, business and management, health
                and social care, marketing, social sciences, human resources,
                and logistics.
              </p>
              <p className="mt-10 mb-8">
                The institution's faculty has experienced professionals and
                provides personalised attention and mentorship to students.
              </p>
            </>
          )}
          <button
            className="text-purple-700 mb-10 font-semibold text-base leading-4 font-sans"
            onClick={toggleContent}
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        </div>
      </div>
      <div className="footer">
        <div className="flex gap-4">
          <UniversityLogo />
          <p className="font-sans font-medium text-lg leading-7 text-black">
            Campus
          </p>
        </div>
        <div className="flex gap-4 mt-[1.5rem]">
          <button className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
            Bad Honnef
          </button>
          <button className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
            Berlin
          </button>
        </div>
        <div className="font-sans font-normal text-base leading-6 text-bg-[rgba(29,33,28,1)]">
          <p className="mt-10 mb-8">
            The Bad Honnef campus has many amenities like state-of-the-art
            classrooms, a library, the IU Canteen,
          </p>
          {isExpanded && (
            <p className="mt-2 mb-8">
              Charly's Lounge, and the das anno Restaurant.
            </p>
          )}
          <button
            className="text-purple-700 mb-10 font-semibold text-base leading-4 font-sans"
            onClick={toggleContent}
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityHighlight;
