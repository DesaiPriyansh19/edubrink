import { useState } from "react";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import uninav from "../assets/UniNav.png"
function DropdowneCourses() {
    // Initialize AOS
      useEffect(() => {
        AOS.init({
          duration: 800, // Default animation duration
          offset: 100, // Trigger animations 100px before the element is visible
          easing: 'ease-in-out', // Easing for animations
          once: true, // Run animation only once
        });
      }, []);
  return (
 <>
  <div
   className="absolute   px-3 py-4 w-[45vw] h-auto z-10 flex gap-3  mt-2 
   bg-[#f8f8f8] rounded-3xl shadow-lg"
   data-aos="fade-out"
   data-aos-delay="0"
   data-aos-duration="300">
            <div className="bg-white rounded-3xl px-4 py-2 w-[70%] ">
             <p className="mb-2 text-sm font-semibold pt-3 ">Top Courses</p>
             <div className="w-full mb-3 flex items-center pl-3 gap-3 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
            <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
              <img src={uninav} alt="flag" className="w-6 h-6 " /></span>
               <span className="">
                 <p className="text-[.7rem] font-medium">Msc Advance omputer Science with 
               Business</p>
               <p className="text-[.6rem] font-light">University of Exeter</p>
               </span> 
               </div>
               <div className="w-full mb-3 flex items-center pl-3 gap-3 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
            <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
              <img src={uninav} alt="flag" className="w-6 h-6 " /></span>
               <span className="">
                 <p className="text-[.7rem] font-medium">Msc Advance omputer Science with 
               Business</p>
               <p className="text-[.6rem] font-light">University of Exeter</p>
               </span> 
               </div>
               <div className="w-full mb-3 flex items-center pl-3 gap-3 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
            <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
              <img src={uninav} alt="flag" className="w-6 h-6 " /></span>
               <span className="">
                 <p className="text-[.7rem] font-medium">Msc Advance omputer Science with 
               Business</p>
               <p className="text-[.6rem] font-light">University of Exeter</p>
               </span> 
               </div>
               <div className="w-full mb-3 flex items-center pl-3 gap-3 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
            <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
              <img src={uninav} alt="flag" className="w-6 h-6 " /></span>
               <span className="">
                 <p className="text-[.7rem] font-medium">Msc Advance omputer Science with 
               Business</p>
               <p className="text-[.6rem] font-light">University of Exeter</p>
               </span> 
               </div>
               <div className="w-full mb-3 flex items-center pl-3 gap-3 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
            <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
              <img src={uninav} alt="flag" className="w-6 h-6 " /></span>
               <span className="">
                 <p className="text-[.7rem] font-medium">Msc Advance omputer Science with 
               Business</p>
               <p className="text-[.6rem] font-light">University of Exeter</p>
               </span> 
               </div>
              
            </div>
            <div className="pl-3 w-[30%]  ] ">
            <p className="mb-2 text-sm font-semibold pt-4 ">Popular Subject</p>
            <ul className=" flex text-start flex-col gap-5">
             <li className="text-[.7rem] font-medium ">Digital Marketing</li>
             <li className="text-[.7rem] font-medium ">Python Basics</li>
             <li className="text-[.7rem] font-medium ">Data Visualization</li>
             <li className="text-[.7rem] font-medium ">Project Planning</li>
             <li className="text-[.7rem] font-medium ">Computer Science</li>
             <li className="text-[.7rem] font-medium ">Marketing Analytics</li>
             <li className="text-[.7rem] font-medium ">Web Development</li>
             <li className="text-[.7rem] font-medium ">Excel Essentials</li>
             <li className="text-[.7rem] font-medium ">JavaScript Basics</li>
             <li className="text-[.7rem] font-medium ">Data Science</li>
            </ul>
            </div>
             </div>
 </>
  )
}

export default DropdowneCourses