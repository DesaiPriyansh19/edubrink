import React from "react";
import DollerRounded from "../../../../svg/DollerRounded/Index";
import Master from "../../../../svg/AboutStudent/Master";
import LanguageLogo from "../../../../svg/LanguageLogo";
import { Link } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";

function ResultsCorses() {
  const { data, loading } = useFetch(
    "https://edu-brink-backend.vercel.app/api/course/getAll/GetAllCourse"
  );

  return (
    <>
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="">
            <h1 className="text-2xl sm:text-4xl font-semibold">📚Our courses</h1>
            <p className="text-sm mt-3 font-medium">
              Effortlessly explore diverse courses, find programs tailored to
              your academic goals,<br></br> compare study opportunities, and
              make informed decisions
            </p>
          </div>
          <Link to={"/searchresults/Allcorse"}>
            <button className="hidden sm:block shadow-sm hover:shadow-md text-black text-sm py-1 px-3 rounded-full">
              View All
            </button>
          </Link>
        </div>
      </div>

      <div className="flex overflow-x-scroll scrollbar-hide flex-col gap-4 sm:flex-row">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative mt-3 border rounded-xl shadow-md bg-white animate-pulse"
              >
                <div className="px-3 pr-3 sm:pr-8 md:pr-9 lg:pr-16 p-4">
                  <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
                    <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                    <div className="flex flex-col gap-2">
                      <div className="w-32 h-5 bg-gray-300 rounded-md"></div>
                      <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded-md"></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center gap-2"
                      >
                        <span className="rounded-full w-10 h-10 bg-gray-300"></span>
                        <div>
                          <div className="w-20 h-4 bg-gray-300 rounded-md"></div>
                          <div className="w-16 h-4 bg-gray-300 rounded-md mt-1"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
                  <div className="w-full h-10 bg-gray-300 rounded-md"></div>
                  <div className="w-full h-10 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ))
          : data?.map((university, index) => {
              const dynamicFeatures = [
                {
                  icon: <DollerRounded />,
                  title: "Tuition Fees",
                  description: university?.CourseFees || "N/A",
                },
                {
                  icon: <LanguageLogo />,
                  title: "Language",
                  description: "English", // Assuming language is not dynamic
                },
                {
                  icon: <DollerRounded />,
                  title: "Deadline",
                  description: university?.DeadLine
                    ? new Date(university?.DeadLine).toLocaleDateString("en-US", {
                        year: "numeric", // Full year (optional)
                        month: "short", // Abbreviated month name
                        day: "numeric", // Day of the month
                      })
                    : "N/A",
                },
              ];

              return (
                <div
                  key={index}
                  className="relative mt-3 border rounded-xl shadow-md bg-white"
                >
                  <div className="px-3 pr-3 sm:pr-8 md:pr-9 lg:pr-16 p-4">
                    <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
                      <div className="w-20 h-20">
                        <img
                          src={
                            "https://placehold.co/80x80" ||
                            university.uniSymbol
                          }
                          alt="College Logo"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold flex items-center">
                          {university?.CourseName?.en || "N/A"}
                        </h1>
                        <p className="text-[.8rem] font-medium text-black flex items-center mt-1">
                          {university?.uniName?.en || "N/A"}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="w-5 h-5 rounded-full mr-1">
                            <Master />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                      {dynamicFeatures?.flat()?.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center"
                        >
                          <span className="rounded-full w-10 flex items-center justify-center h-10 border">
                            {feature.icon}
                          </span>
                          <div className="ml-2">
                            <p className="text-xs whitespace-nowrap font-medium">
                              {feature.title}
                            </p>
                            <p className="text-xs font-medium whitespace-nowrap">
                              {feature.description}
                            </p>
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
            })}
      </div>
    </>
  );
}

export default ResultsCorses;
