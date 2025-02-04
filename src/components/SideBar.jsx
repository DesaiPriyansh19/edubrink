import { useState } from "react";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HomeLogo from "../../svg/HomeLogo/Index";
import CoursesLogo from "../../svg/CorsesLogo/Index";
import CoountriesLogo from "../../svg/CountriesLogo/Index";
import RightArrow from "../../svg/RightArrow/Index";
import AboutUsLogo from "../../svg/AbotUsLogo";
import BlogLogo from "../../svg/BlogLogo/Index";
import ContactLogo from "../../svg/ContactLogo/Index";
import img from "../assets/Sidebar.png";
import usa from "../assets/Flags/USAflag.png";
import germny from "../assets/Flags/GermnyFlag.png";
import Unitedarap from "../assets/Flags/UnitedAraPFlag.png";
import uae from "../assets/Flags/uae.png";
import swizrland from "../assets/Flags/SwitzerlandFlag.png";
import canada from "../assets/Flags/CanadaFlag.png";
import india from "../assets/Flags/IndiaFlag.png";
import bangladesh from "../assets/Flags/BangladeshFlag.webp";
import nigeria from "../assets/Flags/NigeriaFlag.webp";
import newzealand from "../assets/Flags/NewZealandFlag.webp";
import denmark from "../assets/Flags/DenmarkFlag.webp";
import australia from "../assets/Flags/AustraliaFlag.png";
import { Link, useNavigate } from "react-router-dom";

function SideBar({ isMenuOpen, setIsMenuOpen }) {
  // Initialize AOS

  const navigate = useNavigate();
  const handleClose = (Link) => {
    navigate(`${Link}`); // Correct string interpolation
    setIsMenuOpen(false);
    console.log("Navigating to:", Link); // Debug log
  };
  const countries = [
    { name: "United State of America", flag: usa },
    { name: "Germany", flag: germny },
    { name: "United Arab Emirates", flag: Unitedarap },
    { name: "Canada", flag: canada },
    { name: "United Arab Emirates", flag: uae },
    { name: "Switzerland", flag: swizrland },
    { name: "India", flag: india },
    { name: "Bangladesh", flag: bangladesh },
    { name: "Nigeria", flag: nigeria },
    { name: "New Zealand", flag: newzealand },
    { name: "Denmark", flag: denmark },
    { name: "Australia", flag: australia },
  ];

  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  const handleNavigate = (name) => {
    navigate(`/country/${name}`);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    AOS.init({
      duration: 800, // Default animation duration
      offset: 100, // Trigger animations 100px before the element is visible
      easing: "ease-in-out", // Easing for animations
      once: true, // Run animation only once
    });
  }, []);
  return (
    <>
      <div
        className="sticky top-10 z-[25] pb-60 pt-2 h-full min-h-screen w-full sm:w-1/2R bg-white shadow-lg overflow-y-auto"
        data-aos="fade-right"
        data-aos-delay="0"
        data-aos-duration="400"
        data-aos-easing="ease-in-out"
      >
        <div className="flex w-full mt-1 flex-col space-y-4 px-4 py-2">
          <p className="font-medium">QUICK MENU</p>
          <div className="flex mt-1 flex-col gap-3 shadow-md bg-white py-7 px-4 rounded-3xl items-start">
            <div
              onClick={() => handleClose("/")}
              className="cursor-pointer flex items-center justify-start"
            >
              <HomeLogo />
              <p className="ml-4 font-medium">Home</p>
            </div>

            <div
              className="flex items-center cursor-pointer"
              onClick={() => setOpenDropdown(openDropdown === 1 ? null : 1)}
            >
              <div className="flex items-center justify-start">
                <CoursesLogo />
                <p className="ml-4 font-medium">Courses</p>
                <span className="absolute right-9">
                  <RightArrow />
                </span>
              </div>
            </div>
            {openDropdown === 1 && (
              <div
                className="py-2 px-3 rounded"
                data-aos="fade-top"
                data-aos-delay="100"
                data-aos-duration="700"
                data-aos-easing="ease-in-out"
              >
                <ul className="flex flex-col text-start gap-2">
                  <li>Digital Marketing</li>
                  <li>Python Basics</li>
                  <li>Data Visualization</li>
                  <li>Project Planning</li>
                  <li>Computer Science</li>
                  <li>Marketing Analytics</li>
                  <li>AI for Everyone</li>
                  <li>Blockchain Basics</li>
                  <li>Web Development</li>
                  <li>JavaScript Basics</li>
                  <li>Data Science</li>
                  <li> Public Speaking </li>
                </ul>
              </div>
            )}

            <div
              className="flex items-center cursor-pointer"
              onClick={() => setOpenDropdown(openDropdown === 3 ? null : 3)}
            >
              <div className="flex items-center justify-start">
                <CoountriesLogo />
                <p className="ml-4 font-medium">Countries</p>
                <span className="absolute right-9">
                  <RightArrow />
                </span>
              </div>
            </div>
            {openDropdown === 3 && (
              <div className="py-2 px-1 rounded">
                <ul className="flex flex-col text-start gap-4">
                  {countries.map((country, index) => {
                    return (
                      <li
                        key={country.name}
                        className="flex items-center cursor-pointer gap-2"
                        data-aos="fade-in" // Ensure AOS fade-in animation
                        data-aos-delay={`${index * 45}`}
                      >
                        <img
                          className="rounded-full h-5 w-5"
                          src={country.flag}
                          alt={country.name}
                        />
                        <p
                          onClick={() => {
                            handleNavigate(country.name);
                          }}
                        >
                          {country.name}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Repeat the same structure for additional content */}
          <p className="font-medium">SUPPORT</p>

          <div
            className="flex mt-1 flex-col gap-3 shadow-md bg-white py-7 px-4 rounded-3xl items-start"
            onClick={isMenuOpen}
          >
            <div
              className="cursor-pointer flex items-center justify-start"
              onClick={() => handleClose("/about")} // Ensure it's a function
            >
              <AboutUsLogo />
              <p className="ml-4 font-medium">About Us</p>
            </div>

            <div
              onClick={() => handleClose("/searchresults/AllBlogs")}
              className="flex items-center cursor-pointer"
            >
              <div className="flex items-center justify-start">
                <BlogLogo />
                <p className="ml-4 font-medium">Blog</p>
              </div>
            </div>

            <div
              onClick={() => handleClose("/contact")}
              className="flex items-center cursor-pointer"
            >
              <div className="flex items-center justify-start">
                <ContactLogo />
                <p className="ml-4 font-medium">Contact</p>
              </div>
            </div>
          </div>

          <div className="mt-1 relative gap-3 shadow-md bg-white py-8 esm:py-6 px-4 rounded-3xl items-start">
            <span className="flex flex-col gap-2">
              <p className="font-medium max-w-56 leading-7 text-lg">
                Discover your ideal University abroad today
              </p>

              <Link to={"/contact"} onClick={isMenuOpen}>
                <button
                  className=" text-white w-28 text-sm mt-4 py-2 rounded-full
     bg-gradient-to-r from-[#380C95] to-[#E15754] "
                >
                  Contact Us{" "}
                </button>
              </Link>
            </span>
            <span className=" absolute bottom-0 right-0">
              {" "}
              <img src={img} className="w-auto h-32" />
            </span>{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
