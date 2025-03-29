import React from "react";
import Book from "../../assets/Book.png";

import PrivetUniLogo from "../../../svg/PriUniLogo/Index";
import useFetch from "../../../hooks/useFetch";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { getEmoji } from "../../../libs/countryFlags";

const isWindows = navigator.userAgent.includes("Windows");

const CollegeCard = ({ college, idx }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="w-4 h-4" />,
      title: language === "ar" ? "عدد الدورات" : "Courses",
      description: college.courseId.length,
    },
    {
      icon: <GraduationCap className="w-4 h-4" />,
      title: language === "ar" ? "المنح الدراسية" : "Scholarship",
      description:
        college.scholarshipAvailability === true
          ? language === "ar"
            ? "متاح"
            : "Available"
          : language === "ar"
          ? "غير متاح"
          : "Not Available",
    },
    // {
    //   icon: <DiscountLogo />,
    //   title: language === "ar" ? "الخصم" : "Discount",
    //   description: "N/A",
    // },
  ];

  const handleLearnMore = (customURLSlug) => {
    navigate(`/${language}/university/${customURLSlug}`);
  };

  return (
    <div
      className={`relative mt-2 lg:min-w-[290px]   rounded-2xl shadow-sm bg-white ${
        language === "ar"
          ? `text-right ${idx === 0 ? "1xl:mr-16 ml-2" : ""} `
          : `text-left ${idx === 0 ? "1xl:ml-16" : ""} `
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Most Popular Badge */}
      <div
        className={`px-2 ${
          language === "ar"
            ? "pl-2 sm:pl-6 md:pl-7  lg:pl-12"
            : "pr-2 sm:pr-6 md:pr-7  lg:pr-12"
        } p-3`}
      >
        {college?.uniFeatured && (
          <div
            className={`absolute top-0 ${
              language === "ar"
                ? "left-0 rounded-br-[3px] rounded-tl-lg"
                : "right-0 rounded-bl-[3px] rounded-tr-lg"
            } bg-red-500 text-white text-xs px-1 py-0.5`}
          >
            {t("mostPopular")}
          </div>
        )}

        {/* College Info */}
        <div className="flex gap-2 sm:gap-2 items-center mt-4 sm:mt-2 mb-4 md:mb-2">
          <div className="w-16 h-16">
            <img
              src={college.uniSymbol || "https://placehold.co/64x64"}
              alt="Logo"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-semibold flex items-center">
              {language === "ar" ? college?.uniName?.ar : college?.uniName?.en}
            </h1>
            <div className="text-[.7rem] font-medium gap-1 text-black flex items-center mt-1">
              {isWindows ? (
                college?.countryCode ? (
                  <img
                    src={`https://flagcdn.com/w320/${getEmoji(
                      college.countryCode
                    )}.png`}
                    alt="Country Flag"
                    className="w-2.5 h-2.5 object-cover rounded-full"
                  />
                ) : (
                  <span className="text-[.5rem] font-medium">No flag</span>
                )
              ) : (
                <span className="text-sm filter transition-all duration-300 group-hover:rotate-12">
                  <p>{college?.countryFlag}</p>
                </span>
              )}
              <p>{college?.countryName?.[language]}</p>
            </div>
            <div className="flex items-center mt-1">
              <span className="w-5 h-5 rounded-full mr-1">
                <PrivetUniLogo />
              </span>
              <p className="text-[.7rem] capitalize font-medium text-black">
                {t(
                  `uniTypes.${
                    college.uniType === "public" ? "Public" : "Private"
                  }`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center sm:gap-2 justify-start sm:justify-center mr-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 justify-center"
            >
              <span className="rounded-full w-8 flex items-center justify-center h-8 border">
                {feature.icon}
              </span>
              <div>
                <p className="text-[.6rem] font-medium">{feature.title}</p>
                <p className="text-[.6rem] font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thin Line */}
      <div className="w-full h-[0.7px] bg-gray-300"></div>

      {/* Action Row */}
      <div className="grid gap-4 px-2 grid-cols-2 mb-4 mt-3 pb-4">
        <button className="bg-[#3b3d8d] hover:bg-gradient-to-l text-white text-xs py-2 px-2 rounded-full">
          {t("applyNow")}
        </button>
        <button
          onClick={() => handleLearnMore(college?.customURLSlug?.[language])}
          className="text-black text-xs px-2 py-2 hover:font-medium rounded-full border border-gray-700"
        >
          {t("learnMore")}
        </button>
      </div>
    </div>
  );
};

const CollegeCarousel = () => {
  const isWindows = navigator.userAgent.includes("Windows");
  const API_URL = import.meta.env.VITE_API_URL;
  const { data } = useFetch(
    `https://edu-brink-backend.vercel.app/api/university/fields/query?limit=5&fields=uniName,uniSymbol,scholarshipAvailability,uniType,countryName,countryFlag,courseId,customURLSlug`,
    false
  );

  const { t } = useTranslation();
  const { language } = useLanguage();
  return (
    <>
      <div className="max-w-[1200px]  mx-auto flex-1 flex">
        <div className="w-full ">
          <div
            className={`text-start text-3xl sm:text-4xl flex ${
              language === "ar" ? "justify-end" : "justify-start"
            } mb-4 font-semibold pl-4`}
          >
            <h1 className="text-start text-3xl sm:text-4xl font-semibold ">
              {t("featuredUniversities.title")}
            </h1>
            <img src={Book} alt="Icon" className="w-10 h-10 mr-1 ml-3" />{" "}
          </div>
          <p
            className={` font-medium w-full text-[.9rem]  ${
              language === "ar" ? "text-right" : "text-left"
            } sm:text-[.8rem] px-0 pl-4 pr-2 md:pr-72 `}
          >
            {t("featuredUniversities.description")}
          </p>
        </div>
        <div
          className={`w-auto hidden sm:flex  ${
            language === "ar" ? "justify-start" : "justify-end "
          } items-center px-4`}
        >
          <button className=" whitespace-nowrap flex justify-center items-center hover:font-medium text-black text-[.7rem] font-normal py-2 px-3 rounded-full transform hover:scale-105 transition-all duration-300 group">
            {t("viewAll")}

            <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <div
        className={`overflow-x-auto snap-x snap-mandatory scrollbar-hide mx-2 mb-0 md:mx-4 my-3 whitespace-nowrap py-2 sm:py-8`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div
          className={`flex flex-col  sm:flex-row ${
            language === "ar"
              ? "space-x-0 sm:space-x-4"
              : "space-x-0 sm:space-x-4"
          }`}
        >
          {data?.map((college, idx) => (
            <div
              key={idx}
              className="snap-start w-[95%] mx-auto md:min-w-[290px] lg:min-w-[320px]"
            >
              <CollegeCard
                key={`${college._id}-${
                  college.countryName?.en || college.countryName?.ar
                }`}
                isWindows={isWindows}
                college={college}
                idx={idx}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CollegeCarousel;
