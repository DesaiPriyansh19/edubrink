import React, { useState,useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import uk from '../../assets/Flags/UKFlag.png'
import usa from '../../assets/Flags/UKFlag.png'
import canada from '../../assets/Flags/CanadaFlag.png'
import australia from '../../assets/Flags/AustraliaFlag.png'
import germany from '../../assets/Flags/GermnyFlag.png'
import newzealland from '../../assets/Flags/NewZealandFlag.webp'
import ireland from '../../assets/Flags/UKFlag.png'
import netherland from '../../assets/Flags/UKFlag.png'
import france from '../../assets/Flags/UKFlag.png'
import switherland from '../../assets/Flags/SwitzerlandFlag.png'
import unitedarab from '../../assets/Flags/UKFlag.png'
import poland from '../../assets/Flags/SwitzerlandFlag.png'
import solvia  from '../../assets/Flags/UKFlag.png'
import spain from '../../assets/Flags/UKFlag.png'
import russia from '../../assets/Flags/RusiaFlag.png'
import india from '../../assets/Flags/IndiaFlag.png'
import TogelMenu from "../../../svg/TogelMenu/Index";
import BookLogo from "../../../svg/BookLogo/Index";
import CourseBook from "../../../svg/CourseBook";
const FilterSidebar = ({ showFilter, setShowFilter }) => {
  // Initialize AOS
    useEffect(() => {
      AOS.init({
        duration: 800, // Default animation duration
        offset: 100, // Trigger animations 100px before the element is visible
        easing: "ease-in-out", // Easing for animations
        once: true, // Run animation only once
      });
    }, []);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStudyLevel, setSelectedStudyLevel] = useState("");
  const [selectedEntranceExam, setSelectedEntranceExam] = useState("");
  const [selectedUniversityType, setSelectedUniversityType] = useState("");
  const [selectedIntakeYear, setSelectedIntakeYear] = useState("");
  const [selectedIntakeMonth, setSelectedIntakeMonth] = useState("");
  const [selectedModeOfStudy, setSelectedModeOfStudy] = useState("");
  const [selectedCourseDuration, setSelectedCourseDuration] = useState("");
  const [minValue, setMinValue] = useState(0); // Initial minimum range value
  const [maxValue, setMaxValue] = useState(200000); // Initial maximum range value
  const sliderMin = 0; // Slider minimum value
  const sliderMax = 600000; // Slider maximum value

  // Set maximum value limit
  const maxSliderLimit = sliderMax - 1;

  // Update Min Value via Slider
  const handleMinSliderChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 1); // Ensure min < max
    setMinValue(value);
  };

  // Update Max Value via Slider
  const handleMaxSliderChange = (e) => {
    const value = Math.min(Number(e.target.value), maxSliderLimit); // Ensure max < sliderMax
    setMaxValue(value);
  };


  const toggleCountrySelection = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((item) => item !== country)
        : [...prev, country]
    );
  };

  const resetFilters = () => {
    setSelectedCountries([]);
    setSelectedStudyLevel("");
    setSelectedEntranceExam("");
    setSelectedUniversityType("");
    setSelectedIntakeYear("");
    setSelectedIntakeMonth("");
    setSelectedModeOfStudy("");
    setSelectedCourseDuration("");
  };

  return (
    <div
    data-aos="fade-left"
        data-aos-delay="50"
        data-aos-duration="300"
        data-aos-easing="ease-in-out"
    
    className="fixed text-sm right-0 top-0 pb-48 mmd:pb-5 h-full w-[100%] 
    sm:w-[80%] md:w-[44%] xl:w-[30%] bg-[#F9FAFB] shadow-lg p-6 z-50 overflow-y-auto">
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
        <p className="font-medium flex items-center justify-start pl-5 mb-2">Study Preference</p>
        <p className="font-medium text-sm mb-2">Destination</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { name: "United Kingdom", logo:uk},
            { name: "United States", logo:usa },
            { name: "Canada", logo:canada },
            { name: "Australia", logo:australia },
            { name: "Germany", logo:germany },
            { name: "New Zealand", logo:newzealland },
            { name: "Ireland", logo:ireland },
            { name: "Netherlands", logo:netherland},
            { name: "France", logo:france},
            { name: "Switzerland", logo:switherland },
            { name: "United Arab Emirates", logo:unitedarab },
            { name: "Poland", logo:poland },
            { name: "Slovenia", logo:solvia },
            { name: "Spain", logo:spain },
            { name: "russia", logo:russia},
            { name: "India", logo:india },
            

          ].map((country) => (
            <div
              key={country.name}
              className={`flex items-center cursor-pointer  text-black justify-center py-2 text-sm px-3  rounded-full ${
                selectedCountries.includes(country.name)
                  ? "bg-[#EDE9FE]  "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
              onClick={() => toggleCountrySelection(country.name)}
            >
              <img src={country.logo} alt={country.name} className="w-4 h-3 mr-2" />
              {country.name}
            </div>
          ))}
        </div>

        {/* Study Level */}
        <p className="font-medium mb-2">Study Level</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Undergraduate", "Postgraduate", "Foundation", "Doctorate"].map(
            (level) => (
              <button
                key={level}
                onClick={() => setSelectedStudyLevel(level)}
                className={`px-4 py-2 rounded-full text-sm text-black ${
                  selectedStudyLevel === level
                    ? "bg-[#EDE9FE] "
                    : "bg-[#F3F4F6]  hover:bg-gray-200"
                }`}
              >
                {level}
              </button>
            )
          )}
        </div>

        {/* Entrance Exam */}
        <p className="font-medium mb-2">Entrance Exam</p>
        <div className="flex space-x-4 mb-4">
          {["Yes", "No"].map((option) => (
            <button
              key={option}
              onClick={() => setSelectedEntranceExam(option)}
              className={`px-4 py-2 rounded-full text-sm text-black ${
                selectedEntranceExam === option
                  ? "bg-[#EDE9FE] "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
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
              onClick={() => setSelectedUniversityType(option)}
              className={`px-4 py-2 rounded-full text-sm text-black ${
                selectedUniversityType === option
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
          {[
            "2024",
            "2025",
            "2026",
            "2027",
            
          
          ].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedIntakeYear(year)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedIntakeYear ===year
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
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((month) => (
            <button
              key={month}
              onClick={() => setSelectedIntakeMonth(month)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedIntakeMonth === month
                  ? "bg-[#EDE9FE] "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
            >
              {month}
            </button>
          ))}
        </div>

     <div className="h-[1px] w-[100%] my-10 bg-gray-300"></div>

     {/* Course Options */}
     <p className="font-medium mb-3 flex items-center gap-2 justify-start">
        <CourseBook/>Course Options</p>
        <p className="font-medium mb-3">Courses with</p>
        <p className="">✔ Express offer</p>
        <p className="mb-3 pl-4">Pre-conditional offer in just a few hours</p>
 {/* Mode of Study */}
        <p className="font-medium mb-2 ">Mode of Study</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Full Time", "Distance Learning", "Online", "Blended"].map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedModeOfStudy(mode)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedModeOfStudy === mode
                  ? "bg-[#EDE9FE] "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
                {/* Course Duration */}
   <p className="font-medium mb-2">Course Duration</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "Less than 1 year",
            "1 - 2 years",
            "2 - 3 years",
            "3 - 4 years",
            "4 - 5 years",
            "More than 5 years",
          
          ].map((month) => (
            <button
              key={month}
              onClick={() =>  setSelectedCourseDuration(month)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCourseDuration === month
                  ? "bg-[#EDE9FE] "
                  : "bg-[#F3F4F6]  hover:bg-gray-200"
              }`}
            >
              {month}
            </button>
          ))}
        </div>
 <div className="h-[1px] w-[100%] my-10 bg-gray-300 "></div>
        <div className="mt-6 ">
      <p className="font-medium mb-2">Budget</p>
      <label className="text-sm font-semibold mb-2 block">Fees Range</label>
      <div className="flex w-full mx-auto space-x-4 mb-4">
        <input
          type="number"
          value={minValue}
          onChange={(e) => setMinValue(Math.min(Number(e.target.value), maxValue - 1))}
          className="w-[40%] p-2  border-[1.5px] rounded text-center"
          min={sliderMin}
          max={sliderMax}
        />
        <input
          type="number"
          value={maxValue}
          onChange={(e) => setMaxValue(Math.min(Number(e.target.value), maxSliderLimit))}
          className="w-[40%] p-2 border-[1.5px] rounded text-center"
          min={sliderMin}
          max={sliderMax}
        />
      </div>
      {/* Price Range Slider */}
      <div className="relative h-1 mb-12 bg-gray-300 rounded-full">
        {/* Active Range */}
        <div
          className="absolute h-1 bg-gray-400 rounded-full"
          style={{
            left: `${((minValue - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
            right: `${100 - ((maxValue - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
          }}
        ></div>
        {/* Min Slider Knob */}
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={minValue}
          onChange={handleMinSliderChange}
          className="absolute w-full h-1 opacity-0 pointer-events-none"
        />
        <div
          className="absolute top-[-7px] w-6 h-6 bg-[#801CC1] rounded-full cursor-pointer"
          style={{
            left: `${((minValue - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
            transform: "translateX(-50%)",
          }}
        ></div>
        {/* Max Slider Knob */}
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={maxValue}
          onChange={handleMaxSliderChange}
          className="absolute w-full h-1 opacity-0 pointer-events-none"
        />
        <div
          className="absolute top-[-7px]  w-6 h-6 bg-[#801CC1] rounded-full cursor-pointer"
          style={{
            left: `${((maxValue - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
            transform: "translateX(-50%)",
          }}
        ></div>

      </div>
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
