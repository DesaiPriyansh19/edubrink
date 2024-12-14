import { useState } from "react";
import flag from "../assets/Flags/UKFlag.png";
import Search from "../../svg/caplogo/Logo/Search";
import { Link } from "react-router-dom";
const NavBar = () => {
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showFlagsDropdown, setShowFlagsDropdown] = useState(false);

  return (
    <nav className="flex py-4 items-center w-[98%] my-3 mx-auto  justify-between  px-4  text-sm bg-white rounded-3xl shadow-md">
      {/* Logo */}
      <h2 className="text-2xl font-bold bg-white text-gray-800">Edubrink</h2>

      {/* Search Bar */}
      <div className="flex text-sm items-center bg-[#F8F8F8] text-center rounded-full px-2 py-2 w-1/4">
        <div className="md:w-6  md:h-6 mr-2">
          <Search />
        </div>
        <input
          type="text"
          placeholder="Search for courses"
          className="bg-transparent outline-none text-black w-full"
        />
      </div>
      {/* Contry Dropdown in sm devices */}
      <div className="sm:hidden relative  rounded-3xl px-4 py-2 bg-[#F8F8F8]">
        <button
          onClick={() => setShowFlagsDropdown(!showFlagsDropdown)}
          className="flex items-center space-x-1 text-gray-800"
        >
          <img src={flag} alt="flag" className="w-6 h-6 rounded-full" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
        {showFlagsDropdown && (
          <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg p-4 space-y-2">
            <li>
              <img
                src="/path-to-flag1.png"
                alt="Country 1 Flag"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </li>
            <li>
              <img
                src="/path-to-flag2.png"
                alt="Country 2 Flag"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </li>
            <li>
              <img
                src="/path-to-flag3.png"
                alt="Country 3 Flag"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </li>
          </ul>
        )}
      </div>

      {/* Dropdowns */}
      <div className=" hidden md:flex items-center bg-white space-x-6">
        {/* Courses Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCoursesDropdown(!showCoursesDropdown)}
            className="flex items-center space-x-1 bg-white  text-gray-800"
          >
            <span className="bg-white font-medium">Courses</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 bg-white "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {showCoursesDropdown && (
            <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg">
              <li className="px-4 py-2 bg-white font-medium  hover:bg-gray-100 cursor-pointer">
                Course 1
              </li>
              <li className="px-4 py-2 bg-white font-medium  hover:bg-gray-100 cursor-pointer">
                Course 2
              </li>
              <li className="px-4 py-2 bg-white font-medium  hover:bg-gray-100 cursor-pointer">
                Course 3
              </li>
            </ul>
          )}
        </div>

        {/* Countries Dropdown */}
        <div className="relative bg-white rounded-full">
          <button
            onClick={() => setShowCountriesDropdown(!showCountriesDropdown)}
            className="flex items-center space-x-1  bg-white text-gray-800"
          >
            <span className=" font-medium bg-white">Countries</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4  bg-white h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {showCountriesDropdown && (
            <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg">
              <li className="px-4 py-2  bg-white font-medium hover:bg-gray-100 cursor-pointer">
                USA
              </li>
              <li className="px-4 py-2  bg-white font-medium hover:bg-gray-100 cursor-pointer">
                Canada
              </li>
              <li className="px-4 py-2  bg-white font-medium hover:bg-gray-100 cursor-pointer">
                India
              </li>
            </ul>
          )}
        </div>

        {/* About Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAboutDropdown(!showAboutDropdown)}
            className="flex items-center space-x-1 bg-white text-gray-800"
          >
            <span className=" bg-white font-medium ">About</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4  bg-white "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {showAboutDropdown && (
            <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg">
              <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
                Our Team
              </li>
              <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
                Careers
              </li>
              <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
                Contact Us
              </li>
            </ul>
          )}
        </div>

        {/* Flags Dropdown */}
        <div className="relative px-2 rounded-full py-1 bg-[#F8F8F8]">
          <button
            onClick={() => setShowFlagsDropdown(!showFlagsDropdown)}
            className="flex items-center space-x-1 text-gray-800"
          >
            <img src={flag} alt="flag" className="w-6 h-6 rounded-full" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {showFlagsDropdown && (
            <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg p-4 space-y-2">
              <li>
                <img
                  src="/path-to-flag1.png"
                  alt="Country 1 Flag"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </li>
              <li>
                <img
                  src="/path-to-flag2.png"
                  alt="Country 2 Flag"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </li>
              <li>
                <img
                  src="/path-to-flag3.png"
                  alt="Country 3 Flag"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Contact Us Button */}
      <button className="hidden md:flex px-4 py-2 w-auto text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754]">
        Contact Us
      </button>
    </nav>
  );
};

export default NavBar;
