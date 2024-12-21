import React from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../svg/DiscountLogo/Index";
import Master from "../../../svg/AboutStudent/Master";
import UniversityChicago from "../../assets/CountryPage/UniversityChicago.png";
import ColongeUniversity from "../../assets/CountryPage/ColongeUniversity.png";
import LanguageLogo from "../../../svg/LanguageLogo";

// Course Data
const courses = [
  {
    name: "MSc Advanced in Computer Science",
    institution: "TH KHON - Cologne University of Applied Science",
    fees: "3,857.00/Year",
    language: "English",
    deadline: "30 Sept 2024",
    img: UniversityChicago,
    logo: <Master />,
  },
  {
    name: "MSc Advanced in Computer Science",
    institution: "TH KHON - Cologne University of Applied Science",
    fees: "3,857.00/Year",
    language: "English",
    deadline: "15 Aug 2024",
    img: ColongeUniversity,
    logo: <Master />,
  },
];

// Feature Data
const features = [
  {
    icon: <DollerRounded />,
    title: "Tution Fees",
    description: "3,857.00/Year",
  },
  {
    icon: <LanguageLogo />,
    title: "Language",
    description: "English",
  },
  {
    icon: <DollerRounded />,
    title: "Deadline",
    description: "31 July 2025",
  },
];

const CountryPopularCourse = ({ course, features }) => (
  <div className="relative mx-auto mt-3 border rounded-xl shadow-md bg-white">
    <div className="px-3 pr-3 sm:pr-8 md:pr-9 lg:pr-16 p-4">
      <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
        <div className="w-20 h-20">
          <img src={course.img} alt="College Logo" className="w-full h-full" />
        </div>
        <div>
          <h1 className="text-lg font-semibold flex items-center">
            {course.name}
          </h1>
          <p className="text-[.8rem] font-medium text-black flex items-center mt-1">
            {course.institution}
          </p>
          <div className="flex items-center mt-1">
            <span className="w-5 h-5 rounded-full mr-1">{course.logo}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center justify-center">
            <span className="rounded-full w-10 flex items-center justify-center h-10 border">
              {feature.icon}
            </span>
            <div className="ml-2">
              <p className="text-xs font-medium">{feature.title}</p>
              <p className="text-xs font-medium">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
  <>
    <div className="max-w-full mx-auto">
      <div className="flex items-center justify-between mt-6 mb-4">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Popular Courses in Australia
        </h1>
        <button className="hidden sm:block bg-white shadow-sm hover:shadow-md text-black text-sm sm:text-base py-2 px-4 rounded-full">
          View All <span className="mx-2">&gt;</span>
        </button>
      </div>
      <div className="w-full hidden sm:flex justify-end items-center px-4"></div>
    </div>

    <div className="flex flex-col sm:flex-row">
      {courses.map((course, index) => (
        <CountryPopularCourse key={index} course={course} features={features} />
      ))}
    </div>
  </>
);

export default CollegeCarousel;
