import React, { useState } from "react";
import CountryHome from "../../../svg/CountryHome";
import Phone from "../../../svg/Phone";
import VuesaxDocumentText from "../../../svg/VuesaxDocumentText";
import JhonSmith from "../../assets/CoursePage/JhonSmith.png";
import Watch from "../../../svg/Watch";
import DatePicker from "../../../svg/DatePicker";
import Seconds from "../../../svg/Seconds";
import CourseBook from "../../../svg/CourseBook";
import TicketDiscount from "../../../svg/TicketDiscount";
import CourseDiscount from "../../../svg/CourseDiscount";
import Consolidation from "../../../svg/Consolidation";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { useLanguage } from "../../../context/LanguageContext";

const CoursePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  const apiUrl = isObjectId
    ? `https://edu-brink-backend.vercel.app/api/course/${id}`
    : `http://localhost:4000/api/course/name/${encodeURIComponent(id)}`;

  console.log("Fetching from:", apiUrl);

  const { data } = useFetch(apiUrl);

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltl"}
      className="bg-gray-50 p-6 md:p-10 rounded-lg shadow-lg max-w-5xl mx-auto"
    >
      <div className="text-sm mb-4 flex items-center">
        <div className="flex items-center">
          <CountryHome />
          <span className="mx-2">&gt;</span>
        </div>
        <div className="flex items-center font-medium">
          <span>Country</span>
          <span className="mx-2">&gt;</span>
          <span className="font-medium">
            {language === "ar" ? data?.CourseName?.ar : data?.CourseName?.en}
          </span>
        </div>
      </div>
      <div className="">
        <h1 className="text-2xl font-bold text-black mb-4">
          📚 {language === "ar" ? data?.CourseName?.ar : data?.CourseName?.en}
          <div className="flex me-4 items-center mt-4">
            <img
              src={"https://placehold.co/24x24" || data?.uniSymbol}
              alt="University Logo"
              className="w-[28px] h-[28px] rounded-full relative"
            />
            <p className="text-lg font-sans font-normal ms-2">
              {language === "ar" ? data?.uniName?.ar : data?.uniName?.en}
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
                {data?.CourseFees} Per Year
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
                <p className="text-lg font-bold leading-5">
                  {data?.CourseDuration || "N/A"}
                </p>
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
                <p className="text-lg font-bold leading-5">N/A</p>
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
                <p className="text-lg font-bold leading-5">
                  {new Date(data?.DeadLine).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  }) || "N/A"}
                </p>
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
                <p className="text-lg font-bold leading-5">
                  {language === "ar"
                    ? data?.ModeOfStudy?.[0]?.ar
                    : data?.ModeOfStudy?.[0]?.en || "N/A"}
                </p>
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
              {data?.CourseDescription?.[language]
                ? data.CourseDescription[language]
                    .split(".")
                    .filter((desc) => desc.trim())
                    .map((desc, index) => <li key={index}>{desc.trim()}.</li>)
                : "No description available."}
            </ul>
            {data?.CourseDescription?.en &&
              data.CourseDescription.en.split(".").filter((desc) => desc.trim())
                .length > 1 && (
                <button
                  onClick={toggleReadMore}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
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
            {data?.Requirements?.length > 0
              ? data.Requirements.map((req, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 flex gap-5 font-sans font-medium text-base leading-5"
                  >
                    <Consolidation />
                    {req?.[language] || "Requirement not specified."}
                  </div>
                ))
              : "No requirements available."}
          </div>
        </div>
        {/* md:w-[55.33%]
        p-6 */}
        <div className=" max-w-full md:max-w-[40%]  mb-[10%]">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full">
            <div className="w-full flex md:justify-start justify-center">
              {" "}
              <div className="inline-flex  mt-4 bg-gray-200   font-sans font-medium text-lg leading-7 px-3 py-1 rounded-full">
                Dedicated Counsellor
              </div>
            </div>

            <div className="flex lg:flex-row flex-col md:items-start items-center mt-2 md:mt-[8%]">
              <img
                src={JhonSmith}
                alt="Profile"
                className="w-[4rem] h-[4rem] rounded-full mr-4 mt-[3%] mb-[3%]"
              />
              <div className=" md:mt-[5%] md:text-start text-center mb-[5%]">
                <div className="font-sans font-semibold text-2xl leading-7 text-black">
                  Jhon Smith
                </div>
                <p className="font-sans font-medium text-lg leading-7 mt-2">
                  Thanks for connecting! I’m excited to connect with
                  professionals in the [industry/field]. I look forward to
                  sharing insights and learning from each other. If there's
                  anything I can assist with, feel free to reach out.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4 justify-between">
              <button className="w-full bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white rounded-full">
                Call Now
              </button>
              <button className="w-full bg-white border border-gray-300 text-black rounded-full flex items-center justify-center gap-2  py-[0.5rem]">
                Chat Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
