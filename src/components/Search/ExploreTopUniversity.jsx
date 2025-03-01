import React, { useState } from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../svg/DiscountLogo/Index";
import TickMark from "../../../svg/TickMark";
import PrivetUniLogo from "../../../svg/PriUniLogo/Index";
import { useTranslation } from "react-i18next";

function ExploreTopUniversity({ filteredData, language }) {
  const { t } = useTranslation();
  // Array of buttons and corresponding content
  // const items = [
  //   { id: 1, label: "Button", content: "Content for Button" },
  //   { id: 2, label: "Button", content: "Content for Button" },
  //   { id: 3, label: "Button", content: "Content for Button" },
  //   { id: 4, label: "Button", content: "Content for Button" },
  //   { id: 5, label: "Button", content: "Content for Button" },
  //   { id: 6, label: "Button", content: "Content for Button" },
  //   { id: 7, label: "Button", content: "Content for Button" },
  //   { id: 8, label: "Button", content: "Content for Button" },
  //   { id: 9, label: "Button", content: "Content for Button" },
  //   { id: 10, label: "Button", content: "Content for Button" },
  // ];

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center max-w-2xl mx-auto font-semibold mb-2">
        {t("explore_university.title")}
      </h1>

      {/* Description */}
      <p className="text-black font-medium max-w-xl mx-auto text-sm text-center mb-24">
        {t("explore_university.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-11">
        {" "}
        {t("explore_university.top_university")}
      </h3>
      <div className={` grid grid-cols-1 sm:grid-cols-2 gap-4`}>
        {filteredData?.map((university, idx) => {
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
              className={`relative mt-6 border rounded-xl shadow-md bg-white max-w-full `}
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
    </div>
  );
}

export default ExploreTopUniversity;
