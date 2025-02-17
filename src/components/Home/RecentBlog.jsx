import React from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import "react-loading-skeleton/dist/skeleton.css"; // Import CSS for Skeleton
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";

function RecentBlog() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { data, loading } = useFetch(`https://edu-brink-backend.vercel.app/api/blog/`);

  const handleNaviagte = (name, country) => {
    navigate(`/${language}/blog/${name}?country=${country}`);
  };
  const { t } = useTranslation();
  const { language } = useLanguage();
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
    <div className="mt-11 text-black">
      <div className="max-w-[1240px] mx-auto">
        <h1
          className={`text-start text-3xl sm:text-4xl flex ${
            language === "ar" ? "justify-end" : "justify-start"
          } mb-4 font-semibold pl-4`}
        >
          {t("recentBlog.title")}
        </h1>

        <p
          className={` font-normal w-full text-sm ${
            language === "ar" ? "text-right" : "text-left"
          } sm:text-[.8rem] px-0 pl-4 pr-1 `}
        >
          {t("recentBlog.description")}
        </p>
        <div
          className={`w-full hidden sm:flex  ${
            language === "ar" ? "justify-start" : "justify-end "
          } items-center px-4`}
        >
          <Link to={"AllBlogs"}>
            {" "}
            <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
              {t("viewAll")}
            </button>
          </Link>{" "}
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col scrollbar-hide em:flex-row overflow-x-auto gap-6 py-6">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonLoader key={idx} />
          ))}
        </div>
      ) : (
        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          className={`flex sm:flex-row py-4 flex-col px-4 ${
            language === "ar" ? "1xl:pr-28" : "1xl:pl-28"
          }  gap-6 scrollbar-hide overflow-x-auto`}
        >
          {data?.map((card, idx) => (
            <div
              key={idx}
              onClick={() => {
                handleNaviagte(
                  language === "ar" ? card?.blogTitle?.ar : card?.blogTitle?.en,
                  language === "ar"
                    ? card?.countries[0]?.countryName[0]?.ar
                    : card?.countries[0]?.countryName[0]?.en
                );
              }}
              className="max-w-[300px] bg-white p-5 pb-0 h-auto rounded-3xl shadow-md"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <div className="h-[55%] w-[100%]">
                <img
                  src={"https://placehold.co/260x220" || card?.blogPhoto}
                  alt={`Slide ${idx + 1}`}
                  className="w-[100%] h-[100%] rounded-2xl object-cover"
                />
              </div>

              <p className="text-[#E82448] text-sm font-semibold mt-4">
                {language === "ar"
                  ? `الدراسة في ${
                      card?.countries[0]?.countryName[0]?.ar || "غير متوفر"
                    }`
                  : `Study in ${card?.countries[0]?.countryName[0]?.en || "N/A"}`}
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
      )}
    </div>
  );
}

export default RecentBlog;
