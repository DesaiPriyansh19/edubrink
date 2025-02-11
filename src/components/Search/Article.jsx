import React from "react";
import blogImage from "../../assets/Blog1.png";
import blogImage2 from "../../assets/Blog2.png";
import blogImage3 from "../../assets/Blog3.png";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { Link } from "react-router-dom";
import Loader from "../../../utils/Loader";
import useFetch from "../../../hooks/useFetch";
import { useSearch } from "../../../context/SearchContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
function Article({ filteredData, loading }) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const SkeletonLoader = () => {
    return (
      <div className="flex gap-2 ">
        <div className="min-w-[300px] h-[50vh] sm:v-[40vh] md:h-[30vh] lg:h-[70vh] bg-white p-5 pb-0  rounded-3xl shadow-md animate-pulse">
          {/* Skeleton for Image */}
          <div className="h-[55%] w-[100%] bg-gray-300 rounded-2xl"></div>

          {/* Skeleton for 'Study in <Country Name>' Text */}
          <p className="text-[#E82448] text-sm font-semibold mt-4 bg-gray-300 h-4 w-[70%] rounded"></p>

          {/* Skeleton for Blog Title */}
          <h4 className="font-semibold text-lg text-black mt-2 mb-1 bg-gray-300 h-5 w-[60%] rounded"></h4>

          {/* Skeleton for Date and Calendar */}
          <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start">
            {/* Skeleton for Calendar Icon */}
            <div className="h-5 w-5 bg-gray-300 rounded-full mr-2"></div>
            {/* Skeleton for Date */}
            <div className="bg-gray-300 h-4 w-[50%] rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div dir={language === "ar" ? "rtl" : "ltr"} className="mt-11 text-black">
        <div className="max-w-[1240px] mx-auto">
          <h1 className="text-start text-3xl sm:text-4xl mb-4 font-semibold pl-4">
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
            <Link to={"/searchresults/AllBlogs"}>
              <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
                {t("viewAll")}
              </button>
            </Link>{" "}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4  py-6 ">
            <SkeletonLoader /> <SkeletonLoader /> <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4  py-6 ">
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
                  {language === "ar"
                    ? card?.blogTitle?.ar
                    : card?.blogTitle?.en}
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
        )}
      </div>
    </>
  );
}

export default Article;
