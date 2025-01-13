import React from 'react'


import uniLogo from "../../../assets/UniversityBoston.png";

import BookLogo from "../../../../svg/BookLogo/Index";
import Book from "../../../assets/Book.png";
import uk from "../../../assets/Flags/UKFlag.png";
import DollerRounded from "../../../../svg/DollerRounded/Index";

import ScholerShipLogo from "../../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../../svg/PriUniLogo/Index";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import UniversityPage from '../../UniversityPage/UniversityPage';
const colleges = [
  {
    id: 1,
    name: "Impartial College London",
    location: "United Kingdom, London",
    description: "A leading institution for advanced studies.",
    logo: uniLogo,
    flag: uk,
    svgIcon: uk,
    ptivetLogo: <PrivetUniLogo />,
  },
  {
    id: 2,
    name: "Impartial College London",
    location: "United Kingdom, London",
    description: "A leading institution for advanced studies.",
    logo: uniLogo,
    flag: uk,
    svgIcon: uk,
    ptivetLogo: <PrivetUniLogo />,
  },
  {
    id: 3,
    name: "Impartial College London",
    location: "United Kingdom, London",
    description: "A leading institution for advanced studies.",
    logo: uniLogo,
    flag: uk,
    svgIcon: uk,
    ptivetLogo: <PrivetUniLogo />,
  },
  {
    id: 4,
    name: "Impartial College London",
    location: "United Kingdom, London",
    description: "A leading institution for advanced studies.",
    logo: uniLogo,
    flag: uk,
    svgIcon: uk,
    ptivetLogo: <PrivetUniLogo />,
  },
  // Add more colleges here...
];

const features = [
  {
    icon: <DollerRounded />,
    title: "Number of courses",
    description: "1000+ Courses",
  },
  {
    icon: <ScholerShipLogo />,
    title: "Scholarship",
    description: "Available",
  },
  {
    icon: <DiscountLogo />,
    title: "Discount",
    description: "31 July 2025",
  },
];

const CollegeCard = ({ college }) => {
  const { i18n } = useTranslation();

  // You can change the padding dynamically based on the language

  return (
    <div className="relative  1xl:ml-24   mt-3 border rounded-xl shadow-md bg-white">
      {/* Most Popular Badge */}
      <div
        className={`px-3 ${
          i18n.language === "ar"
            ? "pl-3 sm:pl-8 md:pl-9  lg:pl-16"
            : "pr-3 sm:pr-8 md:pr-9  lg:pr-16"
        }  p-4`}
      >
        <div className="absolute top-0 right-0 bg-red-500 text-white text-sm px-2 py-1 rounded-bl-[4px] rounded-tr-xl">
          Most Popular
        </div>

        {/* College Info */}
        <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
          <div className="w-20 h-20">
            <img src={college.logo} alt="Logo" className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-lg font-semibold flex items-center">
              {college.name}
              {/* <img src={college.svgIcon} alt="SVG Icon" className="w-4 h-4 ml-2" /> */}
            </h1>
            <p className="text-[.8rem] font-medium text-black  flex items-center mt-1">
              <img
                src={college.flag}
                alt="Flag"
                className="w-5 h-5 rounded-full mr-1"
              />
              {college.location}
            </p>
            <div className="flex items-center mt-1">
              <span className="w-5 h-5 rounded-full mr-1">
                {college.ptivetLogo}{" "}
              </span>
              <p className="text-[.8rem] font-medium text-black  ">
                {" "}
                Private University
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center">
              <span className="rounded-full w-10 flex items-center justify-center h-10 border ">
                {feature.icon}
              </span>
              <div>
                <p className="text-xs font-medium">{feature.title}</p>
                <p className="text-xs font-medium">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* thin Line */}
      <div className="w-full h-[.9px] bg-gray-300"></div>
      {/* Action Row */}
      <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4 ">
        <button
          className="bg-gradient-to-r  from-[#380C95] to-[#E15754] hover:bg-gradient-to-l
       text-white text-sm py-2 px-3  rounded-full"
        >
          Apply Now
        </button>
        <button className="  text-black text-sm px-3 py-2 hover:font-medium  rounded-full border-2 border-gray-800">
          Learn More
        </button>
      </div>
    </div>
  );
};
function Univrsiry() {
  return (
   <>
     <div className="max-w-[1240px] mx-auto mt-20 ">
       <div className="  mt-6 mb-1">
         <h1 className="text-start text-3xl sm:text-4xl font-semibold pl-4">
         🏫 Favourite Universities
         </h1>
       <p className='text-sm mt-3 font-medium pl-7'>Discover top study abroad destinations, each offering unique cultural <br></br> experiences, academic excellence, and career opportunities. From vibrant cities.</p>
       </div>
     
       <div className="w-full hidden sm:flex justify-end items-center px-4">
       <Link to={'/searchresults/AllUniversity'}>  <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
           View All
         </button></Link>
       </div>
     </div>
 
     <div className="overflow-x-auto scrollbar-hide mx-2 mb-24 md:mx-4 my-1 whitespace-nowrap py-2  sm:py-8">
       <div className="grid grid-cols-2 space-x-0 sm:space-x-4">
         {colleges.map((college) => (
           <CollegeCard key={college.id} college={college} />
         ))}
       </div>
     </div>
   </>
  )
}

export default Univrsiry;