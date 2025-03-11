import React from "react";
import Book from "../../assets/Book.png";
import DollerRounded from "../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../svg/PriUniLogo/Index";
import useFetch from "../../../hooks/useFetch";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";

const CollegeCard = ({ college, idx }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const features = [
    {
      icon: <BookOpen />,
      title: language === "ar" ? "عدد الدورات" : "Number of courses",
      description: college.courseId.length,
    },
    {
      icon: <GraduationCap />,
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

  const handleLearnMore = (uniName) => {
    navigate(`/${language}/university/${uniName}`);
  };

  return (
    <div
      className={`relative  mt-3 border rounded-xl shadow-md bg-white ${
        language === "ar"
          ? `text-right ${idx === 0 ? "1xl:mr-24 ml-4" : ""} `
          : `text-left ${idx === 0 ? "1xl:ml-24" : ""} `
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Most Popular Badge */}
      <div
        className={`px-3 ${
          language === "ar"
            ? "pl-3 sm:pl-8 md:pl-9  lg:pl-16"
            : "pr-3 sm:pr-8 md:pr-9  lg:pr-16"
        }  p-4`}
      >
        {college?.uniFeatured && (
          <div
            className={`absolute top-0
          
          ${
            language === "ar"
              ? "left-0 rounded-br-[4px]  rounded-tl-xl"
              : "right-0 rounded-bl-[4px] rounded-tr-xl"
          } 
           bg-red-500 text-white text-sm px-2 py-1  `}
          >
            {t("mostPopular")}
          </div>
        )}

        {/* College Info */}
        <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
          <div className="w-20 h-20 ">
            <img
              src={"https://placehold.co/80x80" || college.uniSymbol}
              alt="Logo"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold flex items-center">
              {language === "ar" ? college?.uniName?.ar : college?.uniName?.en}
              {/* <img src={college.svgIcon} alt="SVG Icon" className="w-4 h-4 ml-2" /> */}
            </h1>
            <div className="text-[.8rem] font-medium gap-1 text-black  flex items-center mt-1">
              <p>{college?.countryFlag}</p>
              {language === "ar"
                ? college?.countryName?.ar
                : college?.countryName?.en}
            </div>
            <div className="flex items-center mt-1">
              <span className="w-5 h-5 rounded-full mr-1">
                <PrivetUniLogo />
              </span>
              <p className="text-[.8rem] capitalize font-medium text-black  ">
                {" "}
                {t(
                  `uniTypes.${
                    college.uniType === "public" ? "Public" : "Private"
                  }`
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 justify-center">
              <span className="rounded-full w-10 flex items-center justify-center h-10 border ">
                {feature.icon}
              </span>
              <div className="">
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
          {t("applyNow")}
        </button>
        <button
          onClick={() => handleLearnMore(college?.uniName?.en)}
          className="  text-black text-sm px-3 py-2 hover:font-medium  rounded-full border-2 border-gray-800"
        >
          {t("learnMore")}
        </button>
      </div>
    </div>
  );
};

const CollegeCarousel = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { data } = useFetch(
    `https://edu-brink-backend.vercel.app/api/university`
  );
  const { t } = useTranslation();
  const { language } = useLanguage();
  return (
    <>
      <div className="max-w-[1240px] mx-auto ">
        <div
          className={`text-start text-3xl sm:text-4xl flex ${
            language === "ar" ? "justify-end" : "justify-start"
          } mb-4 font-semibold pl-4`}
        >
          <h1 className="text-start text-3xl sm:text-5xl font-semibold ">
            {t("featuredUniversities.title")}
          </h1>
          <img src={Book} alt="Icon" className="w-10 h-10 mr-1 ml-3" />{" "}
        </div>
        <p
          className={` font-normal w-full text-sm ${
            language === "ar" ? "text-right" : "text-left"
          } sm:text-[.8rem] px-0 pl-4 pr-1 `}
        >
          {t("featuredUniversities.description")}
        </p>
        <div
          className={`w-full hidden sm:flex  ${
            language === "ar" ? "justify-start" : "justify-end "
          } items-center px-4`}
        >
          <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
            {t("viewAll")}
          </button>
        </div>
      </div>

      <div
        className={`overflow-x-auto snap-x snap-mandatory scrollbar-hide mx-2 mb-24 md:mx-4 my-3 whitespace-nowrap py-2 sm:py-8`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div
          className={`flex flex-col sm:flex-row ${
            language === "ar"
              ? "space-x-0 sm:space-x-4"
              : "space-x-0 sm:space-x-4"
          }`}
        >
          {data?.map((college, idx) => (
            <div key={idx} className="snap-start">
              <CollegeCard
                key={`${college._id}-${
                  college.countryName?.en || college.countryName?.ar
                }`}
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
