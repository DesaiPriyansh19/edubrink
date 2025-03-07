import React from "react";
import Calander from "../../../../svg/caplogo/Logo/Calander/Index";
import { Link } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import Loader from "../../../../utils/Loader";
import { useSearch } from "../../../../context/SearchContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../context/LanguageContext";
function ResultsBlog({ filteredData, loading }) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (loading) {
    return <Loader />;
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="mt-11 text-black">
      <div>
        <h1 className="text-start text-3xl sm:text-4xl mb-4 font-semibold pl-1">
          {t("recentBlog.title")}
        </h1>

        <p
          className={`${
            language === "ar"
              ? " px-0 pl-1 md:pl-[39%]"
              : " px-0 pl-4 pr-1 md:pr-[39%]"
          } text-start font-normal text-sm sm:text-[.8rem] `}
        >
          {t("recentBlog.description")}
        </p>
        <div className="w-full hidden sm:flex justify-end items-center px-4">
          <Link to={"AllBlogs"}>
            {" "}
            <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
              {t("viewAll")}
            </button>
          </Link>{" "}
        </div>
      </div>
      <div className="flex flex-col scrollbar-hide em:flex-row overflow-x-auto  gap-6   py-6 ">
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
              {card?.blogAdded
                ? new Date(card.blogAdded).toLocaleDateString()
                : "Date not available"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsBlog;
