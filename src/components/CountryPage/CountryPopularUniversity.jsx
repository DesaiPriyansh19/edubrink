import React from "react";
import uniLogo from "../../assets/UniversityBoston.png";
import Book from "../../assets/Book.png";
import uk from "../../assets/Flags/UKFlag.png";
import DollerRounded from "../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../svg/PriUniLogo/Index";
import TickMark from "../../../svg/TickMark";

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

const CountryPopularUniversity = ({ college }) => (
  <div className="relative mx-auto mt-6 border rounded-xl shadow-md bg-white max-w-sm sm:max-w-md md:max-w-lg">
    {/* Most Popular Badge */}
    <div className="p-4 sm:p-6">
      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-bl-md rounded-tr-xl">
        Most Popular
      </div>

      {/* College Info */}
      <div className="flex gap-3 sm:gap-4 items-center mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20">
          <img
            src={college.logo}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold gap-1 flex">
            {college.name}{" "}
            <span>
              <TickMark />
            </span>
          </h1>

          <p className="text-sm font-medium text-gray-700 flex items-center mt-1">
            <img
              src={college.flag}
              alt="Flag"
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2"
            />
            {college.location}
          </p>
          <div className="flex items-center mt-1">
            <span className="w-5 h-5 rounded-full mr-2">
              {college.ptivetLogo}
            </span>
            <p className="text-sm font-medium text-gray-700">
              Private University
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <span className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300">
              {feature.icon}
            </span>
            <div className="ml-2">
              <p className="text-xs sm:text-sm font-medium">{feature.title}</p>
              <p className="text-xs sm:text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Divider */}
    <div className="w-full h-[1px] bg-gray-300"></div>

    {/* Buttons */}
    <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
      <button className="bg-gradient-to-r from-[#380C95] to-[#E15754] hover:bg-gradient-to-l text-white text-sm py-2 px-3 rounded-full">
        Apply Now
      </button>
      <button className="text-black text-sm px-3 py-2 hover:font-medium rounded-full border-2 border-gray-800">
        Learn More
      </button>
    </div>
  </div>
);

const CollegeCarousel = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    {/* Header */}
    <div className="flex items-center justify-between mt-6 mb-4">
      <h1 className="text-2xl sm:text-4xl font-semibold">
        Popular Universities in Australia
      </h1>
      <button className="hidden sm:block bg-white shadow-sm hover:shadow-md text-black text-sm sm:text-base py-2 px-4 rounded-full">
        View All <span className="mx-2">&gt;</span>
      </button>
    </div>

    {/* Colleges */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {colleges.map((college) => (
        <CountryPopularUniversity key={college.id} college={college} />
      ))}
    </div>
  </div>
);

export default CollegeCarousel;
