import React from "react";
import uniLogo from '../../assets/UniversityBoston.png'

import BookLogo from "../../../svg/BookLogo/Index";
import Book from '../../assets/Book.png';
import uk from '../../assets/Flags/UKFlag.png'
import DollerRounded from "../../../svg/DollerRounded/Index";

import ScholerShipLogo from "../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../svg/PriUniLogo/Index";
const colleges = [
  {
    id: 1,
    name: "Impartial College London",
    location: "United Kingdom, London",
    description: "A leading institution for advanced studies.",
    logo: uniLogo,
    flag:uk,
    svgIcon:uk,
    ptivetLogo:<PrivetUniLogo/>,
  },
  {
    id: 2,
    name: "Impartial College London",
    location: "United Kingdom, London",
    description: "A leading institution for advanced studies.",
    logo: uniLogo,
    flag: uk,
    svgIcon: uk,
    ptivetLogo:<PrivetUniLogo/>,
  },
  {
    id: 3,
    name: "Impartial College London",
    location: "United Kingdom, London",
    description: "A leading institution for advanced studies.",
    logo: uniLogo,
    flag: uk,
    svgIcon: uk,
    ptivetLogo:<PrivetUniLogo/>,
  },
  {
    id: 4,
    name: "Impartial College London",
    location: "United Kingdom, London",
    description: "A leading institution for advanced studies.",
    logo: uniLogo,
    flag: uk,
    svgIcon:uk,
    ptivetLogo:<PrivetUniLogo/>,
  },
  // Add more colleges here...
];

const CollegeCard = ({ college }) => (
  <div className="relative w-auto  border rounded-xl shadow-md bg-white">
  {/* Most Popular Badge */}
   <div className="px-3 pr-3 sm:pr-8 md:pr-9 lg:pr-14 p-4"> 
    <div className="absolute top-0 right-0 bg-red-500 text-white text-sm px-2 py-1 rounded-bl-[4px] rounded-tr-xl">
      Most Popular
    </div>

    {/* College Info */}
    <div className="flex items-center mt-2 mb-3">
      <img src={college.logo} alt="Logo" className="w-14 h-14 mr-3" />
      <div>
        <h1 className="text-lg font-semibold flex items-center">
          {college.name}
          {/* <img src={college.svgIcon} alt="SVG Icon" className="w-4 h-4 ml-2" /> */}
        </h1>
        <p className="text-[.8rem] font-medium text-black  flex items-center mt-1">
          <img src={college.flag} alt="Flag" className="w-5 h-5 rounded-full mr-1" />
          {college.location}
        </p>
        <p  className="text-[.8rem] font-medium text-black  flex items-center mt-1">
           <span className="w-5 h-5 rounded-full mr-1" >{college.ptivetLogo} </span>
              Private University
            </p>
      </div>
    </div>


<div className="flex items-center gap-3 justify-center ">
    <div className=" flex items-center justify-center">
        <span className="rounded-full w-10 flex items-center justify-center  h-10   border-2 "><DollerRounded/></span>
     <span className="ml-2">  
         <p className="text-[.6rem] font-medium ">Number of courses</p>
        <p className="text-[.7rem] font-medium">1000+ Courses</p></span>
    </div>
    <div className=" flex items-center justify-center">
        <span className="rounded-full w-10 flex items-center justify-center  h-10   border-2 "><ScholerShipLogo/></span>
     <span className="ml-2">  
         <p className="text-[.6rem] font-medium ">Scholarship</p>
        <p className="text-[.7rem] font-medium">Available</p></span>
    </div>
    <div className=" flex items-center justify-center">
        <span className="rounded-full w-10 flex items-center justify-center  h-10   border-2 "><DiscountLogo/></span>
     <span className="ml-2">  
         <p className="text-[.6rem] font-medium">Discount</p>
        <p className="text-[.7rem] font-medium">31 July 2025</p></span>
    </div>
</div>
</div> 
{/* thin Line */}
<div className="w-full h-[.9px] bg-gray-300"></div>
    {/* Action Row */}
    <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4 ">
    
     
      <button className="bg-gradient-to-r  from-[#380C95] to-[#E15754] hover:bg-gradient-to-l
       text-white text-sm py-2 px-3  rounded-full">
        Apply Now
      </button>
      <button className="  text-black text-sm px-3 py-2 hover:font-medium  rounded-full border-2 border-gray-800">
        Learn More
      </button>
    </div>
  </div>
);

const CollegeCarousel = () => (<>
<div className="grid grid-cols-2 md:flex items-center justify-start ">
    <h1 className="text-start text-3xl font-bold pl-4">Featured Universites</h1> 
 <img src={Book} alt="Icon" className="w-10 h-10 mr-1 ml-3" /> </div>
<p className="text-start font-normal text-[.9rem] px-0 pl-4 pr-1 md:pr-[50%]">
    Effortlessly explore diverse courses, find programs tailored to your academic 
 goals, compare study opportunities, and make informed decisions</p>
    <div className="w-full flex justify-end items-center px-4"> 
          <button className="bg-white hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
        View All 
      </button>
      </div>
  <div className="overflow-x-auto mx-2 md:mx-4 my-3 whitespace-nowrap py-2  sm:py-8">
    <div className="flex space-x-4">
      {colleges.map((college) => (
        <CollegeCard key={college.id} college={college} />
      ))}
    </div>
  </div>
  </>
);

export default CollegeCarousel;
