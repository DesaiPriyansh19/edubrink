import React, { useState } from "react";
import CountryHome from "../../../svg/CountryHome";
import Phone from "../../../svg/Phone";
import VuesaxDocumentText from "../../../svg/VuesaxDocumentText";
import JhonSmith from "../../assets/CoursePage/JhonSmith.png";
import UniversityBoston from "../../assets/UniversityBoston.png";
import Watch from "../../../svg/Watch";
import DatePicker from "../../../svg/DatePicker";
import Seconds from "../../../svg/Seconds";
import CourseBook from "../../../svg/CourseBook";
import TicketDiscount from "../../../svg/TicketDiscount";
import CourseDiscount from "../../../svg/CourseDiscount";
import Consolidation from "../../../svg/Consolidation";

const CoursePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="bg-gray-50 p-6 md:p-10 rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="text-sm mb-4 flex items-center">
        <div className="flex items-center">
          <CountryHome />
          <span className="mx-2">&gt;</span>
        </div>
        <div className="flex items-center font-medium">
          <span>Country</span>
          <span className="mx-2">&gt;</span>
          <span className="font-medium">
            MSc Advanced Computer Science with Business
          </span>
        </div>
      </div>
      <div className="">
        <h1 className="text-2xl font-bold text-black mb-4">
          📚 MSc Advanced Computer Science with Business
          <div className="flex me-4 items-center mt-4">
            <img
              src={UniversityBoston}
              alt="University Logo"
              className="w-[28px] h-[28px] relative"
            />
            <p className="text-lg font-sans font-normal ms-2">
              University of Exeter
            </p>
          </div>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="order-1 md:order-2 w-full md:w-[45.33%] p-6 rounded-lg">
          <div className="bg-[rgba(232,36,72,1)] text-xl font-bold mb-4 text-white rounded-t-[1.5rem] p-4">
            <div className="flex items-center gap-4">
              <span>
                <TicketDiscount />
              </span>
              <h4 className="text-white font-sans font-medium text-base leading-5">
                $27,500 Per Year
              </h4>
            </div>
            <p className="text-white font-sans font-normal text-sm mt-2">
              International student tuition fee
            </p>
          </div>
          <div className="gap-4 bg-white pl-[4%] pr-[4%] rounded-b-[1.5rem]">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center">
                <Watch />
              </div>
              <div>
                <p className="text-lg font-bold leading-5">1 Year</p>
                <p className="text-sm font-sans font-normal leading-5">
                  Duration
                </p>
              </div>
            </div>
            <div className="border-t-2 mt-4"></div>
            <div className="flex items-center gap-4 mt-5 mb-5">
              <div className="flex items-center justify-center">
                <DatePicker />
              </div>
              <div>
                <p className="text-lg font-bold leading-5">Sep 2025</p>
                <p className="text-sm font-sans font-normal leading-5">
                  Start Month
                </p>
              </div>
            </div>
            <div className="border-t-2 mt-4"></div>
            <div className="flex items-center gap-4 mt-5 mb-5">
              <div className="flex items-center justify-center">
                <Seconds />
              </div>
              <div>
                <p className="text-lg font-bold leading-5">Aug 2025</p>
                <p className="text-sm font-sans font-normal leading-5">
                  Application Deadline
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-5">
              <div className="flex items-center justify-center">
                <CourseBook />
              </div>
              <div>
                <p className="text-lg font-bold leading-5">Full Time</p>
                <p className="text-sm font-sans font-normal leading-5">
                  Mode Of Study
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-5">
              <div className="flex items-center justify-center">
                <CourseDiscount />
              </div>
              <div>
                <p className="text-lg font-bold leading-5">Discount</p>
                <p className="text-sm font-sans font-normal leading-5">
                  Free Scholarship
                </p>
              </div>
            </div>
            <button className="mt-6 w-full bg-gradient-to-r from-red-500 to-purple-500 text-white py-3 rounded-full font-semibold text-lg mb-5">
              Apply Now
            </button>
          </div>
        </div>

        <div className="order-2 md:order-1 flex-1">
          <div className="ml-[4%] mr-[4%]">
            <ul className="list-disc space-y-3">
              <li>Taught in partnership with the Business School</li>
              {isExpanded ? (
                <>
                  <li>
                    Combine core Computer Science modules with modules in
                    Management, Strategy, Marketing, and Accounting to prepare
                    you for working with data in a leadership or management
                    role.
                  </li>
                  <li>
                    Learn from teaching that draws directly from our research
                    strengths in AI, machine learning, data science,
                    high-performance computing, and cybersecurity.
                  </li>
                  <li>
                    Explore the latest techniques and technologies, and how to
                    apply these to complex contemporary problems across the
                    breadth of society.
                  </li>
                  <li>
                    Your project, which forms a major part of your Masters, will
                    be business-focused as you explore data science in a
                    commercial environment.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    Combine core Computer Science modules with modules in
                    Management, Strategy, Marketing, and Accounting to prepare
                    you for working with data in a leadership or management
                    role.
                  </li>
                  <li>
                    Learn from teaching that draws directly from our research
                    strengths in AI, machine learning, data science,
                    high-performance computing, and cybersecurity.
                  </li>
                </>
              )}
            </ul>
            <button
              onClick={toggleReadMore}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-10 ">
        <div className="w-full mt-[-4%]">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex">
            <span className="me-2">
              <VuesaxDocumentText />
            </span>
            Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5">
              <span>
                <Consolidation />
              </span>
              Consolidated Marksheets
            </div>
            <div className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5">
              <span>
                <Consolidation />
              </span>
              I20
            </div>
            <div className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5">
              <span>
                <Consolidation />
              </span>
              Undergraduate Semester Marksheet
            </div>
            <div className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5">
              <span>
                <Consolidation />
              </span>
              CV/Resume
            </div>
            <div className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5">
              <span>
                <Consolidation />
              </span>
              Provisional Certificate
            </div>
            <div className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5">
              <span>
                <Consolidation />
              </span>
              Passport
            </div>
            <div className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5">
              <span>
                <Consolidation />
              </span>
              Experience Letter
            </div>
            <div className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5">
              <span>
                <Consolidation />
              </span>
              Experience Letter
            </div>
          </div>
        </div>
        {/* md:w-[55.33%]
        p-6 */}
        <div className="w-full md:w-[45.33%] bg-white  rounded-[1.5rem] ">
          <p className="text-black  text-center font-sans font-medium text-lg leading-7  bg-[rgba(248,248,248,1)] px-4 py-2 rounded-full mt-[8%] mb-[8%] p-l[13%] pr-[13%]">
            Dedicated Counsellor
          </p>

          <div className="flex items-start gap-4">
            <img
              src={JhonSmith}
              alt="Jhon Smith"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="w-[376px] h-[406px] gap-[16px]">
              <h6 className="font-sans font-semibold text-2xl leading-7">
                Jhon Smith
              </h6>
              <p className="font-sans font-medium text-lg leading-7 mt-2">
                Thanks for connecting! I’m excited to connect with professionals
                in the [industry/field]. I look forward to sharing insights and
                learning from each other. If there's anything I can assist with,
                feel free to reach out.
              </p>
            </div>
          </div>
          <div className="btn mt-5 flex gap-4 mb-5">
            <button className="w-full bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white rounded-full flex items-center justify-center gap-2  py-[0.5rem]">
              <span>
                <Phone />
              </span>
              Call Now
            </button>
            <button className="w-full bg-white border border-gray-300 text-black rounded-full flex items-center justify-center gap-2  py-[0.5rem]">
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;