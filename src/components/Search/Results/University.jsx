import React, { useState, useEffect } from "react";
import DollerRounded from "../../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../../svg/PriUniLogo/Index";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TickMark from "../../../../svg/TickMark";
import { useAnalysis } from "../../../../context/AnalysisContext";
import { useLanguage } from "../../../../context/LanguageContext";

const CollegeCard = ({ data, loading }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const path = location.pathname;
  const { addClickData } = useAnalysis();

  const handleApplyClick = (uniId, countryName) => {
    addClickData(uniId, "University", countryName); // Add click data with countryName
  };

  const handleNavigate = (uniname) => {
    navigate(`/${language}/university/${uniname}`);
  };

  // Skeleton loader
  if (loading) {
    return (
      <div
        className={`${
          path === "/en/searchresults/university"
            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
            : "flex gap-2"
        }`}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative mt-6 border rounded-xl shadow-md bg-white max-w-sm sm:max-w-md md:max-w-lg animate-pulse"
          >
            <div className="p-4 sm:p-6">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-bl-md rounded-tr-xl">
                Most Popular
              </div>

              <div className="flex gap-3 sm:gap-4 items-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-32 h-5 bg-gray-300 rounded-md"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded-md mt-2"></div>
                  <div className="w-16 h-4 bg-gray-300 rounded-md mt-1"></div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 justify-center"
                  >
                    <div className="rounded-full w-10 h-10 bg-gray-300"></div>
                    <div>
                      <div className="w-20 h-4 bg-gray-300 rounded-md"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded-md mt-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-300"></div>

            <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
              <div className="w-full h-10 bg-gray-300 rounded-md"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Actual Content
  return (
    <div
      className={`${
        path === `/${language}/searchresults/university`
          ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
          : "flex gap-2"
      }`}
    >
      {data?.map((university, idx) => {
        const dynamicFeatures = [
          {
            icon: <DollerRounded />,
            title: language === "ar" ? "الرسوم الدراسية" : "Tuition Fees",
            description: university?.uniTutionFees || "N/A",
          },

          {
            icon: <ScholerShipLogo />,
            title: language === "ar" ? "المنح الدراسية" : "Scholarship",
            description:
              university.scholarshipAvailability === true
                ? language === "ar"
                  ? "متاح"
                  : "Available"
                : language === "ar"
                ? "غير متاح"
                : "Not Available",
          },
          {
            icon: <DiscountLogo />,
            title: language === "ar" ? "الخصم" : "Discount",
            description: university.uniDiscount
              ? language === "ar"
                ? "متاح"
                : "Available"
              : language === "ar"
              ? "غير متاح"
              : "Not Available",
          },
        ];
        return (
          <div
            key={idx}
            dir={language === "ar" ? "rtl" : "ltr"}
            className={`relative mt-6 border rounded-xl shadow-md bg-white ${
              path === `/${language}/searchresults/university`
                ? ""
                : "max-w-sm sm:max-w-md md:max-w-lg"
            } `}
          >
            <div className="p-4 sm:p-6">
              <div
                className={`absolute top-0 ${
                  language === "ar"
                    ? "left-0 rounded-br-[4px]  rounded-tl-xl"
                    : "right-0 rounded-bl-[4px] rounded-tr-xl"
                }  bg-red-500 text-white text-xs sm:text-sm px-2 py-1 `}
              >
                {t("mostPopular")}
              </div>

              <div className="flex gap-3 sm:gap-4 items-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20">
                  <img
                    src={"https://placehold.co/80x80"}
                    alt="Logo"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-semibold gap-1 flex">
                    {language === "ar"
                      ? university?.uniName?.ar
                      : university?.uniName?.en || "N/A"}
                    <span>
                      <TickMark />
                    </span>
                  </h1>

                  <p className="text-sm font-medium text-gray-700 flex items-center mt-1">
                    <img
                      src={"https://placehold.co/20x20"}
                      alt="Flag"
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2"
                    />
                    {language === "ar"
                      ? university?.countryName?.ar
                      : university?.countryName?.en || "N/A"}
                  </p>

                  <div className="flex items-center mt-1">
                    <span className="w-5 h-5 rounded-full mr-2">
                      <PrivetUniLogo />
                    </span>

                    <p className="text-sm capitalize font-medium text-gray-700">
                      <p className="text-sm capitalize font-medium text-gray-700">
                        {language === "ar"
                          ? university?.uniType === "Private"
                            ? "جامعة خاصة"
                            : "جامعة حكومية"
                          : university?.uniType === "Private"
                          ? "Private University"
                          : "Public University"}
                      </p>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                {dynamicFeatures.flat().map((feature, index) => (
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

            <div className="w-full h-[1px] bg-gray-300"></div>

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
                  handleNavigate(
                    language === "ar"
                      ? university.uniName.ar
                      : university.uniName.en
                  );
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
  );
};

function Univrsiry({ filteredData, loading }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  return (
    <>
      <div dir={language === "ar" ? "rtl" : "ltr"} className="mt-20">
        <div className="mt-6 mb-1">
          <h1 className="text-start text-3xl sm:text-4xl font-semibold">
            🏫 {t("searchResult.uniTitle")}
          </h1>
          <p className="text-sm mt-3 max-w-xl font-medium">
            {t("searchResult.uniDesc")}
          </p>
        </div>

        <div className="w-full hidden sm:flex justify-end items-center px-4">
          <Link to={"/searchresults/AllUniversity"}>
            <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4 rounded-full">
              {t("viewAll")}
            </button>
          </Link>
        </div>
      </div>

      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={`overflow-x-auto scrollbar-hide whitespace-nowrap`}
      >
        <CollegeCard data={filteredData?.flat()} loading={loading} />
      </div>
    </>
  );
}

export default Univrsiry;
