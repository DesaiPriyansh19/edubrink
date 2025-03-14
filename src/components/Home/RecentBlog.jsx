"use client";

import { useEffect } from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import "react-loading-skeleton/dist/skeleton.css";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";

function RecentBlog() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { data, loading } = useFetch(
    `https://edu-brink-backend.vercel.app/api/blog/`
  );
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  const handleNaviagte = (name) => {
    navigate(`/${language}/blog/${name}`);
  };

  const SkeletonLoader = () => {
    return (
      <div className="w-[280px] flex-shrink-0 bg-white rounded-xl shadow-md animate-pulse">
        {/* Image skeleton */}
        <div className="h-[160px] w-full bg-gray-200 rounded-t-xl"></div>

        <div className="p-4">
          {/* Country name skeleton */}
          <div className="h-4 w-24 bg-gray-200 rounded"></div>

          {/* Title skeleton */}
          <div className="space-y-2 mt-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>

          {/* Date skeleton */}
          <div className="flex items-center mt-3">
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded ml-2"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-11 mb-16">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Header section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1" data-aos="fade-right">
            <div className="flex items-center gap-3 mb-2">
              <h1
                className={`text-2xl sm:text-3xl font-semibold ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("recentBlog.title")}
              </h1>
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Blog icon"
                className="w-8 h-8 object-contain"
              />
            </div>
            <p
              className={`text-sm text-gray-600 ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("recentBlog.description")}
            </p>
          </div>

          <div className="hidden sm:block" data-aos="fade-left">
            <Link to="AllBlogs">
              <button className="px-6 py-2 text-sm font-medium text-gray-700 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50">
                {t("viewAll")}
              </button>
            </Link>
          </div>
        </div>

        {/* Blog cards section */}
        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonLoader key={idx} />
              ))
            : data?.map((blog, idx) => (
                <div
                  key={idx}
                  onClick={() => handleNaviagte(blog.customURLSlug[language])}
                  className="w-[280px] flex-shrink-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  {/* Image container */}
                  <div className="h-[160px] w-full rounded-t-xl overflow-hidden">
                    <img
                      src={"https://placehold.co/600x400" || blog?.blogPhoto}
                      alt={blog?.blogTitle?.[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4">
                    {/* Country name */}
                    <p className="text-[#E82448] text-xs font-medium truncate">
                      {language === "ar"
                        ? `الدراسة في ${
                            blog?.blogCountry?.countryName?.ar || "غير متوفر"
                          }`
                        : `Study in ${
                            blog?.blogCountry?.countryName?.en || "N/A"
                          }`}
                    </p>

                    {/* Blog title */}
                    <h4 className="font-medium text-base text-gray-800 mt-2 mb-3 line-clamp-2 h-[48px] group-hover:text-[#380C95] transition-colors duration-300">
                      {language === "ar"
                        ? blog?.blogTitle?.ar
                        : blog?.blogTitle?.en}
                    </h4>

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 mt-auto">
                      <Calander />
                      <span className="ml-2">
                        {blog.blogAdded
                          ? new Date(blog.blogAdded).toLocaleDateString()
                          : "Date not available"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Mobile view all button */}
        <div className="sm:hidden flex justify-center mt-6">
          <Link to="AllBlogs">
            <button className="px-8 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#380C95] to-[#E15754] rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              {t("viewAll")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecentBlog;
