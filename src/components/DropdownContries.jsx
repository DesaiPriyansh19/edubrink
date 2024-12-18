import { useState } from "react";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import flag from "../assets/Flags/UKFlag.png";
import usa from "../assets/Flags/USAflag.png";
import germny from "../assets/Flags/GermnyFlag.png";
import Unitedarap from "../assets/Flags/UnitedAraPFlag.png";
import Unitedarab from "../assets/Flags/UnitedArab.webp";
import swizrland from "../assets/Flags/SwitzerlandFlag.png";
import canada from "../assets/Flags/CanadaFlag.png";
import india from "../assets/Flags/IndiaFlag.png";
import bangladesh from "../assets/Flags/BangladeshFlag.webp";
import nigeria from "../assets/Flags/NigeriaFlag.webp";
import newzealand from "../assets/Flags/NewZealandFlag.webp";
import denmark from "../assets/Flags/DenmarkFlag.webp"
import australia from "../assets/Flags/AustraliaFlag.png";


function DropdownContries() {
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
   <div className="absolute   px-3 py-3 w-[38vw] h-auto z-10  
                mt-2 bg-white rounded-3xl shadow-lg"
                data-aos="fade-out"
                data-aos-delay="0"
                data-aos-duration="300">

                 <div className=" my-2 flex items-center justify-between">
                   <p className=" text-sm font-semibold  ">Top Institutions in</p>
                  <button className=" text-[.5rem] bg-[#f8f8f8] px-3 py-0 rounded-full font-light">view all</button></div>
               
               <div className="bg-white flex items-center justify-center gap-2 rounded-3xl px-1 py-2 w-full ">
  
  <div className="w-[50%]">
  
                <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                 <img src={usa} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">United State of America </p>
                  
              
                  </div>
                 
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                 <img src={germny} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">Germany</p>
                  
              
                  </div>
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                 <img src={Unitedarap} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">United Arap Emirates </p>
                  
              
                  </div>
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                 <img src={canada} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">Canada</p>
                  
              
                  </div>
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                 <img src={Unitedarab} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">United Arab Emirates</p>
                  
              
                  </div>
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                 <img src={swizrland} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">Switzerland </p>
                  
              
                  </div>
                  </div>
                  <div className="mt-2 w-[50%]">
                <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
                 <img src={india} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">India </p>
                  
              
                  </div>
                 
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
                 <img src={bangladesh} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">Bangladesh </p>
                  
              
                  </div>
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
                 <img src={nigeria} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">Nigeria </p>
                  
              
                  </div>
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
                 <img src={newzealand} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">New Zealand </p>
                  
              
                  </div>
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
                 <img src={denmark} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">Denmark</p>
                  
              
                  </div>
                  <div className="w-full mb-3 flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "> 
               <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
                 <img src={australia} alt="flag" className="w-6 h-6 rounded-full " /></span>
              
                    <p className="text-[.6rem] font-medium">Australia </p>
                  
              
                  </div>
                  </div>      
                 
               </div>
               
                </div>
  </>
  )
}

export default DropdownContries