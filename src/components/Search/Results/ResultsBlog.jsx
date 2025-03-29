"use client";
import Calander from "../../../../svg/caplogo/Logo/Calander/Index";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../context/LanguageContext";
import { ArrowRight } from "lucide-react";

function ResultsBlog({ filteredData, loading }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const handleNavigate = (name) => {
    navigate(`/${language}/blog/${name}`);
  };

  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="blog-card">
            {/* Skeleton for Image */}
            <div className="h-[160px] w-full bg-gray-200 rounded-t-2xl"></div>

            {/* Skeleton for 'Study in <Country Name>' Text */}
            <div className="h-4 w-32 bg-gray-200 rounded mt-4"></div>

            {/* Skeleton for Blog Title */}
            <div className="h-6 w-3/4 bg-gray-200 rounded mt-2"></div>

            {/* Skeleton for Date and Calendar */}
            <div className="flex items-center mt-2 pb-8">
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-200 rounded ml-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // if (loading && (!filteredData || filteredData.length === 0)) {
  //   return <SkeletonLoader />;
  // }

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
            <div
          className={`w-full flex mt-4 ${
            language === "ar" ? "justify-start" : "justify-end"
          } items-center px-4`}
        >
          <button
            className={` flex mb-2    justify-center items-center   text-black text-[.7rem] font-normal py-2 px-3 rounded-full transform hover:scale-105 transition-all duration-300 group`}
          >
            {t("viewAll")}

            <ArrowRight
              className={`inline-block ml-2 ${
                language === "ar"
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "rotate-0 group-hover:translate-x-1"
              } w-4 h-4 transition-transform duration-300 group-hover:translate-x-1`}
            />
          </button>
        </div>
          </Link>{" "}
        </div>
      </div>
   {/* Show Skeleton Loader if Loading */}
   {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {[...Array(1)].map((_, idx) => (
            <SkeletonLoader key={idx} />
          ))}
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {filteredData?.map((card, idx) => (
            <div
              onClick={() => handleNavigate(card?.customURLSlug?.[language])}
              key={idx}
              className="blog-card"
            >
              {/* Image Container */}
              <div className="blog-card-image">
                <img
                  src={card?.blogPhoto || "https://placehold.co/260x220"}
                  alt={`Slide ${idx + 1}`}
                />
              </div>

              {/* Content */}
              <div className="blog-card-content">
                {/* Country Name */}
                <p className="blog-card-country">
                  {language === "ar"
                    ? `الدراسة في ${
                        card?.blogCountry?.countryName?.ar || "غير متوفر"
                      }`
                    : `Study in ${card?.blogCountry?.countryName?.en || "N/A"}`}
                </p>

                {/* Blog Title */}
                <h4 className="blog-card-title">
                  {language === "ar"
                    ? card?.blogTitle?.ar
                    : card?.blogTitle?.en}
                </h4>

                {/* Date */}
                <div className="blog-card-date">
                  <Calander />
                  <span>
                    {card?.blogAdded
                      ? new Date(card.blogAdded).toLocaleDateString()
                      : "Date not available"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultsBlog;
