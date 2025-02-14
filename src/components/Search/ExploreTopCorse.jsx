import React, { useState } from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";
import LanguageLogo from "../../../svg/LanguageLogo";
import Master from "../../../svg/AboutStudent/Master";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ExploreTopCorse({ language, loading, filteredData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (course) => {
    navigate(`/${language}/courses/${course}`);
  };

  return (
    <div
    dir={language === "ar" ? "rtl" : "ltr"}
    className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center max-w-2xl mx-auto font-semibold mb-2">
        {t("explore_courses.title")}
      </h1>

      {/* Description */}
      <p className="text-black font-medium max-w-md mx-auto text-sm text-center mb-24">
        {t("explore_courses.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-11">
        {" "}
        {t("explore_courses.popular_courses")}
      </h3>
      {/* <div className="flex w-full overflow-x-auto space-x-4 scrollbar-hide">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)} // Set the active item
            className={`px-5 py-2 rounded ${
              activeItem === item.id
                ? "text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754]"
                : "border-gray-300 border-2 text-black rounded-full"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div> */}
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={` grid grid-cols-1 sm:grid-cols-2 gap-4`}
      >
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
          : filteredData?.map((university, index) => {
              const dynamicFeatures = [
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "رسوم الدورة" : "Tuition Fees",
                  description: university?.CourseFees || "N/A",
                },
                {
                  icon: <LanguageLogo />,
                  title: language === "ar" ? "اللغة" : "Language",
                  description: language === "ar" ? "الإنجليزية" : "English", // Assuming English is default
                },
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "الموعد النهائي" : "Deadline",
                  description: university?.DeadLine
                    ? new Date(university?.DeadLine).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : "N/A",
                },
              ];

              return (
                <div
                  key={index}
                  className="relative mt-3 border rounded-xl shadow-md bg-white"
                >
                  <div
                    className={`px-3 ${
                      language === "ar"
                        ? "pl-3 sm:pl-8 md:pl-9  lg:pl-16"
                        : "pr-3 sm:pr-8 md:pr-9  lg:pr-16"
                    }  p-4`}
                  >
                    <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
                      <div className="w-20 h-20">
                        <img
                          src={
                            "https://placehold.co/80x80" || university.uniSymbol
                          }
                          alt="College Logo"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold flex items-center">
                          {language === "ar"
                            ? university?.CourseName?.ar
                            : university?.CourseName?.en || "N/A"}
                        </h1>
                        <p className="text-[.8rem] font-medium text-black flex items-center mt-1">
                          {language === "ar"
                            ? university?.uniName?.ar
                            : university?.uniName?.en || "N/A"}
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
                    <button
                      onClick={() =>
                        handleApplyClick(university._id, university.countryName)
                      }
                      className="bg-gradient-to-r from-[#380C95] to-[#E15754] hover:bg-gradient-to-l text-white text-sm py-2 px-3 rounded-full"
                    >
                      {t("applyNow")}
                    </button>
                    <button
                      onClick={() => {
                        handleNavigate(university.CourseName.en);
                      }}
                      className="text-black text-sm px-3 py-2 hover:font-medium rounded-full border-2 border-gray-800"
                    >
                      {t("learnMore")}
                    </button>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Dynamic Content */}
      <div className="mt-6">
        {/* {items.map((item) => (
          <div
            key={item.id}
            className={`${
              activeItem === item.id ? "block" : "hidden"
            } p-4 border rounded bg-gray-100`}
          >
            {item.content}
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default ExploreTopCorse;
