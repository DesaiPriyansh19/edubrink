import React from "react";
import uniLogo from "../../assets/UniversityBoston.png";

import uk from "../../assets/Flags/UKFlag.png";
import DollerRounded from "../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../svg/PriUniLogo/Index";
import TickMark from "../../../svg/TickMark";

const Colleges = [
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
const CountryPopularUniversity = ({ data }) => {
  return (
    <>
      <div className="max-w-7xl mx-auto  ">
        {/* Header */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <h1 className="text-2xl sm:text-4xl font-semibold">
            Popular Universities in {data?.countryName?.en}
          </h1>
          <button className="hidden sm:block bg-white shadow-sm hover:shadow-md text-black text-sm sm:text-base py-2 px-4 rounded-full">
            View All <span className="mx-2">&gt;</span>
          </button>
        </div>

        {/* Colleges */}

        <div className="overflow-x-auto scrollbar-hide  whitespace-nowrap ">
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
            {Colleges.map((college) => (
              <div className="relative  mt-6 border rounded-xl shadow-md bg-white max-w-sm sm:max-w-md md:max-w-lg">
                {/* Most Popular Badge */}
                <div className="p-4 sm:p-6">
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-bl-md rounded-tr-xl">
                    Most Popular
                  </div>

                  {/* College Info */}
                  <div className="flex gap-3 sm:gap-4 items-center mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20">
                      <img
                        src={uniLogo}
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
                          src={uk}
                          alt="Flag"
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2"
                        />
                        {college.location}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="w-5 h-5 rounded-full mr-2">
                          <PrivetUniLogo />
                        </span>
                        <p className="text-sm font-medium text-gray-700">
                          Private University
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 justify-center"
                      >
                        <span className="rounded-full w-10 flex items-center justify-center h-10 border ">
                          {feature.icon}
                        </span>
                        <div>
                          <p className="text-xs font-medium">{feature.title}</p>
                          <p className="text-xs font-medium">
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CountryPopularUniversity;
