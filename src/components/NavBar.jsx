import { useState } from "react";
import flag from "../assets/Flags/UKFlag.png";
import usa from "../assets/Flags/USAflag.png";

import Search from "../../svg/caplogo/Logo/Search";
import { Link } from "react-router-dom";
import TogelMenu from "../../svg/TogelMenu/Index";

import TogelMenuTwo from "../../svg/TogelMenuTwo/Index";
import SideBar from "./SideBar";
import FilterLogo from "../../svg/FilterLogo";

import DropdowneCourses from "./DropdowneCourses";
import DropdownContries from "./DropdownContries";

const NavBar = () => {
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showFlagsDropdown, setShowFlagsDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleClick = () => {
    setShowCountriesDropdown(!showCountriesDropdown);
    setShowCoursesDropdown(false);
  };
  const handleClickTwo = () => {
    setShowCoursesDropdown(!showCoursesDropdown);
    setShowCountriesDropdown(false);
  };
  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);

    // Add or remove the overflow-hidden class on the body element
    if (!isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };
  return (
    <>
      <nav className="sticky mmd:static top-0 z-30 flex py-4 items-center w-[98%] my-3 mx-auto justify-between px-4 text-sm bg-white rounded-3xl shadow-md">
        {/* Logo */}

        <div className="flex gap-3 items-center w-auto h-auto justify-center">
          <span className="flex mmd:hidden " onClick={toggleSidebar}>
            {isMenuOpen ? <TogelMenuTwo /> : <TogelMenu />}
          </span>
          <h2 className=" text-xl mmd:text-2xl font-bold bg-white cursor-pointer pointer text-gray-800">
            <Link to={"/"}>Edubrink</Link>
          </h2>{" "}
        </div>

        {/* Search Bar */}
        <div className="hidden mmd:flex text-sm items-center bg-[#F8F8F8] text-center rounded-full px-2 py-2 w-1/4">
          <div className="md:w-6  md:h-6 mr-2 ">
            <Search />
          </div>
          <input
            type="text"
            placeholder="Search for courses"
            className="bg-transparent outline-none placeholder:text-black text-black w-full"
          />
        </div>

        {/* Contry Dropdown in sm devices */}
        <div className="flex justify-center gap-1 items-center  mmd:hidden">
          {/* Search Bar */}
          <div
            className="h-auto bg-[#F8F8F8] rounded-full w-auto p-2"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search />
          </div>
          <div className=" relative  rounded-3xl px-4 py-2 bg-[#F8F8F8]">
            <button
              onClick={() => setShowFlagsDropdown(!showFlagsDropdown)}
              className="flex items-center space-x-1 text-gray-800"
            >
              <img src={usa} alt="flag" className="w-9 h-6 rounded-md" />
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
              <ul className="fixed z-10 right-[8%] mt-2 bg-white rounded-md shadow-lg p-4 space-y-2">
                <li>
                  <img
                    src={flag}
                    alt="Country 1 Flag"
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                </li>
                <li>
                  <img
                    src={flag}
                    alt="Country 2 Flag"
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                </li>
                <li>
                  <img
                    src={flag}
                    alt="Country 3 Flag"
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Dropdowns */}
        <div className=" hidden  mmd:flex items-center bg-white space-x-6">
          {/* Courses Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 bg-white  text-gray-800"
              onClick={handleClickTwo}
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
          </div>

          {/* Countries Dropdown */}
          <div className="relative bg-white rounded-full ">
            <Link
              to={"/country"}
              className="flex items-center space-x-1  bg-white text-gray-800"
              onClick={handleClick}
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
            </Link>
          </div>

          {/* About Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAboutDropdown(!showAboutDropdown)}
              className="flex items-center space-x-1 bg-white text-gray-800"
            >
              <span className=" bg-white font-medium ">
                <Link to="/about">About</Link>
              </span>
            </button>
            {showAboutDropdown && (
              <></>
              // <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg">
              //   <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
              //     Our Team
              //   </li>
              //   <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
              //     Careers
              //   </li>
              //   <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
              //     Contact Us
              //   </li>
              // </ul>
            )}
          </div>

          {/* Flags Dropdown */}
          <div className="relative px-2 rounded-full py-1 bg-[#F8F8F8]">
            <button
              className="flex items-center space-x-1 text-gray-800"
              onClick={() => setShowFlagsDropdown(!showFlagsDropdown)}
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
          </div>
        </div>

        {/* Contact Us Button */}
        <Link
          to={"/contact"}
          className="hidden  mmd:flex px-4 py-2 w-auto text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754]"
        >
          Contact Us
        </Link>
      </nav>

      {showFlagsDropdown && (
        <ul className="hidden mmd:fixed z-10 top-[12%] right-[18%]  mt-2 bg-white rounded-md shadow-lg p-4 space-y-2">
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
      {showCountriesDropdown && <DropdownContries />}
      {showCoursesDropdown && <DropdowneCourses />}
      {isMenuOpen && <SideBar isMenuOpen={isMenuOpen} />}

      {isSearchOpen && (
        <div className=" w-[95%] mx-auto  flex items-center justify-evenly mmd:hidden  bg-white rounded-3xl px-4 py-2 z-20 sticky top-[12%]">
          <div className="flex w-full text-sm items-center justify-start  text-center rounded-full px-2 py-2">
            <div className=" mr-2 ">
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search for courses"
              className="bg-transparent  text-start outline-none text-black w-full"
            />
          </div>
          <div className="h-auto w-auto">
            <FilterLogo />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
