import { useState } from "react";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HomeLogo from "../../svg/HomeLogo/Index";
import CoursesLogo from "../../svg/CorsesLogo/Index";
import CoountriesLogo from "../../svg/CountriesLogo/Index";
import RightArrow from "../../svg/RightArrow/Index";
import AboutUsLogo from "../../svg/AbotUsLogo";
import BlogLogo from "../../svg/BlogLogo/Index";
import ContactLogo from "../../svg/ContactLogo/Index";
import img from '../assets/Sidebar.png'
import { Link } from "react-router-dom";
function SideBar({ isMenuOpen }) {
    // Initialize AOS
    useEffect(() => {
      AOS.init({
        duration: 800, // Default animation duration
        offset: 100, // Trigger animations 100px before the element is visible
        easing: 'ease-in-out', // Easing for animations
        once: true, // Run animation only once
      });
    }, []);
    const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  return (
    
    <> 
         <div
  className="sticky  mmd:hidden top-10 z-[25] h-[100%] w-full sm:w-1/2 bg-white shadow-lg overflow-y-auto"
  data-aos="fade-right"
  data-aos-delay="0"
  data-aos-duration="400"
  data-aos-easing="ease-in-out"
>
  <div className="flex w-full mt-1 flex-col space-y-4 px-4 py-2">
    <p className="font-medium">QUICK MENU</p>
  <div className="flex mt-1 flex-col gap-3 shadow-md bg-white py-7 px-4 rounded-3xl items-start">
  <Link to={"/"}  onClick={isMenuOpen} ><div className="cursor-pointer flex items-center justify-start">
        <HomeLogo />
        <p className="ml-4 font-medium">Home</p>
      </div></Link>
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
        <div className="py-2 px-3 rounded" 
        data-aos="fade-top"
  data-aos-delay="100"
  data-aos-duration="700"
  data-aos-easing="ease-in-out">
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
        <li>   Public Speaking </li>
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
        <div className="ml-8 p-2 rounded">
          <p>Dropdown content for Countries</p>
        </div>
      )}
    </div>

    {/* Repeat the same structure for additional content */}
    <p className="font-medium">SUPPORT</p>
   
    <Link to="/about">
     <div className="flex mt-1 flex-col gap-3 shadow-md bg-white py-7 px-4 rounded-3xl items-start"
     onClick={isMenuOpen}>
      <div className="cursor-pointer flex items-center justify-start">
        <AboutUsLogo/>
        <p className="ml-4 font-medium">About Us</p>
      </div>
      <div
        className="flex items-center cursor-pointer"
       
      >
        <div className="flex items-center justify-start">
          <BlogLogo/>
          <p className="ml-4 font-medium">Blog</p>
        
        </div>
      </div>
     

      <div
        className="flex items-center cursor-pointer"
     
      >
        <div className="flex items-center justify-start">
          <ContactLogo/>
          <p className="ml-4 font-medium">Contact</p>
    
        </div>
      </div>
   
    </div></Link>
    <div className="mt-1 gap-3 shadow-md bg-white py-10 px-4 rounded-3xl items-start">
      <div className="flex items-center justify-evenly">
   <span className="flex flex-col w-[60%] gap-2">
    <p className="font-medium text-lg">Discover your ideal <br></br>
   University abroad today</p>
    <button className=" text-white mt-4 rounded-full
     bg-gradient-to-r from-[#380C95] to-[#E15754] px-3 py-2">Contact Us </button>
     </span>
   <span className="">  <img src={img} className=" "/></span> </div>
    </div>
  </div>
</div>

    </>
  )
}

export default SideBar