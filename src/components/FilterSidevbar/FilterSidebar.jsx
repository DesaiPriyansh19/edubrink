import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import uk from "../../assets/Flags/UKFlag.png";
import usa from "../../assets/Flags/UKFlag.png";
import canada from "../../assets/Flags/CanadaFlag.png";
import australia from "../../assets/Flags/AustraliaFlag.png";
import germany from "../../assets/Flags/GermnyFlag.png";
import newzealland from "../../assets/Flags/NewZealandFlag.webp";
import ireland from "../../assets/Flags/UKFlag.png";
import netherland from "../../assets/Flags/UKFlag.png";
import france from "../../assets/Flags/UKFlag.png";
import switherland from "../../assets/Flags/SwitzerlandFlag.png";
import unitedarab from "../../assets/Flags/UKFlag.png";
import poland from "../../assets/Flags/SwitzerlandFlag.png";
import solvia from "../../assets/Flags/UKFlag.png";
import spain from "../../assets/Flags/UKFlag.png";
import russia from "../../assets/Flags/RusiaFlag.png";
import india from "../../assets/Flags/IndiaFlag.png";
import CourseBook from "../../../svg/CourseBook";
import { useSearch } from "../../../context/SearchContext";
import ReactSlider from "react-slider";
const FilterSidebar = ({ setShowFilter, language }) => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Default animation duration
      offset: 100, // Trigger animations 100px before the element is visible
      easing: "ease-in-out", // Easing for animations
      once: true, // Run animation only once
    });
  }, []);
  const { filterProp, setFilterProp, initialState } = useSearch();

  const sliderMin = 0; // Slider minimum value
  const sliderMax = 100000; // Slider maximum value

  const toggleCountrySelection = (country) => {
    setFilterProp((prev) => ({
      ...prev, // Spread the previous state to preserve other properties
      Destination: prev.Destination.includes(country)
        ? prev.Destination.filter((item) => item !== country) // Remove the country if already selected
        : [...prev.Destination, country], // Add the country if not already selected
    }));
  };

  const handleToggleSelection = (filterKey, value) => {
    setFilterProp((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? null : value, // Toggle between the selected value and null
    }));
  };

  const handleSliderChange = ([newMin, newMax]) => {
    if (newMax - newMin >= 100) {
      setFilterProp((prev) => ({
        ...prev,
        minBudget: newMin,
        maxBudget: newMax,
      }));
    } else {
      setFilterProp((prev) => ({
        ...prev,
        minBudget: newMin,
        maxBudget: newMin + 100 > sliderMax ? sliderMax : newMin + 100,
      }));
    }
  };

  const resetFilters = () => {
    setFilterProp(initialState);
  };

  return (
    <div
      data-aos="fade-left"
      data-aos-delay="50"
      data-aos-duration="300"
      data-aos-easing="ease-in-out"
      dir={language === "ar" ? "rtl" : "ltr"}
      className="fixed text-sm right-0 top-0 pb-48 mmd:pb-5 h-full w-[100%] 
      sm:w-[80%] md:w-[44%] xl:w-[30%] bg-[#F9FAFB] shadow-lg p-6 z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={() => setShowFilter(false)}
          className="text-gray-500 text-2xl hover:text-gray-700"
        >
          x
        </button>
      </div>

      {/* Filter Content */}
      <div>
        {/* Study Preference */}
        <p className="font-medium flex items-center justify-start pl-5 mb-2">
          Study Preference
        </p>
        <p className="font-medium text-sm mb-2">Destination</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { name: "United Kingdom", logo: uk },
            { name: "United States", logo: usa },
            { name: "Canada", logo: canada },
            { name: "Australia", logo: australia },
            { name: "Germany", logo: germany },
            { name: "New Zealand", logo: newzealland },
            { name: "Ireland", logo: ireland },
            { name: "Netherlands", logo: netherland },
            { name: "France", logo: france },
            { name: "Switzerland", logo: switherland },
            { name: "United Arab Emirates", logo: unitedarab },
            { name: "Poland", logo: poland },
            { name: "Slovenia", logo: solvia },
            { name: "Spain", logo: spain },
            { name: "russia", logo: russia },
            { name: "India", logo: india },
          ].map((country) => (
            <div
              key={country.name}
              className={`flex items-center cursor-pointer  text-black justify-center py-2 text-sm px-3  rounded-full ${
                filterProp?.Destination?.includes(country.name)
                  ? "bg-[#EDE9FE]  "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
              onClick={() => toggleCountrySelection(country.name)}
            >
              <img
                src={country.logo}
                alt={country.name}
                className="w-4 h-3 mr-2"
              />
              {country.name}
            </div>
          ))}
        </div>

        {/* Study Level */}
        <p className="font-medium mb-2">Study Level</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "All",
            "UnderGraduate",
            "PostGraduate",
            "Foundation",
            "Doctorate",
          ].map((level) => (
            <button
              key={level}
              onClick={() =>
                setFilterProp((prev) => ({ ...prev, StudyLevel: level }))
              }
              className={`px-4 py-2 rounded-full text-sm text-black ${
                filterProp.StudyLevel === level
                  ? "bg-[#EDE9FE] "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Entrance Exam */}
        <p className="font-medium mb-2">Entrance Exam</p>
        <div className="flex space-x-4 mb-4">
          {["Yes", "No"].map((option) => (
            <button
              key={option}
              onClick={() =>
                setFilterProp((prev) => ({
                  ...prev,
                  EntranceExam: option === "Yes", // This implicitly handles the "else" case by setting it to false
                }))
              }
              className={`px-4 py-2 rounded-full text-sm text-black ${
                (filterProp.EntranceExam && option === "Yes") ||
                (!filterProp.EntranceExam && option === "No")
                  ? "bg-[#EDE9FE]" // Highlight selected option
                  : "bg-[#F3F4F6] hover:bg-gray-200" // Default style
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Privet or not */}
        <p className="font-medium mb-2">University Type</p>
        <div className="flex space-x-4 mb-4">
          {["Public", "Private"].map((option) => (
            <button
              key={option}
              onClick={() => handleToggleSelection("UniType", option)}
              className={`px-4 py-2 rounded-full text-sm text-black ${
                filterProp.UniType === option
                  ? "bg-[#EDE9FE] "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {/* intect year */}
        <p className="font-medium mb-2">Intake Year</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from(
            { length: 9 },
            (_, index) => new Date().getFullYear() + index
          ).map((year) => (
            <button
              key={year}
              onClick={() => handleToggleSelection("IntakeYear", year)}
              className={`px-4 py-2 rounded-full text-sm ${
                filterProp.IntakeYear === year
                  ? "bg-[#EDE9FE] "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Intake Month */}
        <p className="font-medium mb-2">Intake Month</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { short: "Jan", full: "January" },
            { short: "Feb", full: "February" },
            { short: "Mar", full: "March" },
            { short: "Apr", full: "April" },
            { short: "May", full: "May" },
            { short: "Jun", full: "June" },
            { short: "Jul", full: "July" },
            { short: "Aug", full: "August" },
            { short: "Sep", full: "September" },
            { short: "Oct", full: "October" },
            { short: "Nov", full: "November" },
            { short: "Dec", full: "December" },
          ].map(({ short, full }) => (
            <button
              key={short}
              onClick={() => handleToggleSelection("IntakeMonth", full)}
              className={`px-4 py-2 rounded-full text-sm ${
                filterProp.IntakeMonth === full
                  ? "bg-[#EDE9FE] "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
            >
              {short} {/* Using the full name inline */}
            </button>
          ))}
        </div>

        <div className="h-[1px] w-[100%] my-10 bg-gray-300"></div>

        {/* Course Options */}
        <div className="font-medium mb-3 flex items-center gap-2 justify-start">
          <CourseBook />
          Course Options
        </div>
        <p className="font-medium mb-3">Courses with</p>
        <p className="">✔ Express offer</p>
        <p className="mb-3 pl-4">Pre-conditional offer in just a few hours</p>
        {/* Mode of Study */}
        <p className="font-medium mb-2 ">Mode of Study</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Full Time", "Distance Learning", "Online", "Blended"].map(
            (mode) => (
              <button
                key={mode}
                onClick={() => handleToggleSelection("ModeOfStudy", mode)}
                className={`px-4 py-2 rounded-full text-sm ${
                  filterProp.ModeOfStudy === mode
                    ? "bg-[#EDE9FE] "
                    : "bg-[#F3F4F6]  hover:bg-gray-200"
                }`}
              >
                {mode}
              </button>
            )
          )}
        </div>
        {/* Course Duration */}
        <p className="font-medium mb-2">Course Duration</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: "Less than 1 year", value: "1-12" },
            { label: "1 - 2 years", value: "12-24" },
            { label: "2 - 3 years", value: "24-36" },
            { label: "3 - 4 years", value: "36-48" },
            { label: "4 - 5 years", value: "48-60" },
            { label: "More than 5 years", value: "60+" },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() =>
                setFilterProp((prev) => ({
                  ...prev,
                  CourseDuration: prev.CourseDuration === value ? "" : value, // Toggle between value and empty
                }))
              }
              className={`px-4 py-2 rounded-full text-sm ${
                filterProp.CourseDuration === value
                  ? "bg-[#EDE9FE]"
                  : "bg-[#F3F4F6] hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="h-[1px] w-[100%] my-10 bg-gray-300 "></div>
        <div className="slider-container">
          <div className="font-medium mb-3 flex items-center gap-2 justify-start">
            <CourseBook />
            Budget
          </div>
          <p className="font-medium mb-2">Fee Range</p>
          <div className="range-inputs">
            <input
              type="number"
              value={filterProp.minBudget}
              onChange={(e) => {
                let newValue = Math.min(
                  Number(e.target.value),
                  filterProp.maxBudget - 1
                );
                setFilterProp((prev) => ({ ...prev, minBudget: newValue }));
              }}
              min={sliderMin}
              max={sliderMax}
            />
            <input
              type="number"
              value={filterProp.maxBudget}
              onChange={(e) => {
                let newValue = Math.max(
                  Number(e.target.value),
                  filterProp.minBudget + 1
                );
                setFilterProp((prev) => ({ ...prev, maxBudget: newValue }));
              }}
              min={sliderMin}
              max={sliderMax}
            />
          </div>

          {/* React Slider (Range) */}
          <ReactSlider
            min={sliderMin}
            max={sliderMax}
            value={[filterProp.minBudget, filterProp.maxBudget]}
            onChange={handleSliderChange}
            className="react-slider"
            thumbClassName="thumb"
            trackClassName="track"
            renderThumb={(props, state) => <div {...props} key={state.index} />}
            renderTrack={(props, state) => {
              const { key, ...rest } = props;
              return (
                <React.Fragment key={`track-${state.index}`}>
                  <div {...rest} className="track" />
                  <div
                    className="active-range"
                    style={{
                      left: `${
                        ((filterProp.minBudget - sliderMin) /
                          (sliderMax - sliderMin)) *
                        100
                      }%`,
                      width: `${
                        ((filterProp.maxBudget - filterProp.minBudget) /
                          (sliderMax - sliderMin)) *
                        100
                      }%`,
                    }}
                  />
                </React.Fragment>
              );
            }}
          />
        </div>

        {/* Reset and Show Buttons */}
        <div className="flex justify-between gap-2 mt-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 w-[50%] bg-transperent border-[1.5px] border-gray-300 rounded-full text-black  hover:bg-gray-100"
          >
            Reset Filter
          </button>
          <button className="px-4 py-2 w-[50%] text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754] ">
            Show All Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
