import React, { useState } from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { useTranslation } from "react-i18next";

function ExploreBlogs({ filteredData, loading, language }) {
  const { t } = useTranslation();
  // Array of buttons and corresponding content

  return (
    <div
    dir={language === "ar" ? "rtl" : "ltr"}
    className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center font-semibold mb-2">
        {t("blog_resources.title")}{" "}
      </h1>

      {/* Description */}
      <p className="text-black font-medium text-sm max-w-md mx-auto text-center mb-24">
        {t("blog_resources.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-11">{t("recentBlog.title")}</h3>
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4  py-6 "
      >
        {/* First Slide */}
        {filteredData?.map((card, idx) => (
          <div
            key={idx}
            className="min-w-[300px] bg-white p-5 pb-0 h-auto rounded-3xl shadow-md"
          >
            {/* SVG and Image */}
            <div className="h-[55%] w-[100%]">
              <img
                src={"https://placehold.co/260x220" || card?.blogPhoto}
                alt={`Slide ${idx + 1}`}
                className="w-[100%] h-[100%] rounded-2xl object-cover"
              />
            </div>

            <p className="text-[#E82448] text-sm font-semibold mt-4 ">
              {language === "ar"
                ? `الدراسة في ${card?.countryName?.ar || "غير متوفر"}`
                : `Study in ${card?.countryName?.en || "N/A"}`}
            </p>

            <h4 className="font-semibold text-lg text-black mt-2 mb-1">
              {language === "ar" ? card?.blogTitle?.ar : card?.blogTitle?.en}
            </h4>
            <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start ">
              <Calander />
              {card.blogAdded
                ? new Date(card.blogAdded).toLocaleDateString()
                : "Date not available"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreBlogs;
