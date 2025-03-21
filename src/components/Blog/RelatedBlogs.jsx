import React from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function RelatedBlogs({ data: RelatedBlogs, loading }) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = (name) => {
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
    <div className="mt-11 max-w-[1240px] mx-auto text-black">
      <h1 className="text-start text-xl sm:text-4xl mb-4 font-semibold  flex justify-between">
        📑 More Similar blogs
        <div className="hidden sm:block" data-aos="fade-left">
          <Link to={`/${language}/searchresults/AllBlogs`}>
            <button className="bg-white flex justify-center items-center shadow-sm hover:shadow-xl text-black text-sm font-normal py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-300 group">
              {t("viewAll")}

              <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </h1>

      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonLoader key={idx} />
            ))
          : RelatedBlogs?.blog?.map((blog, idx) => (
              <div
                key={blog._id}
                onClick={() => handleNavigate(blog.customURLSlug[language])}
                className="blog-card"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                {/* Image container */}
                <div className="blog-card-image">
                  <img
                    src={"https://placehold.co/600x400" || blog?.blogPhoto}
                    alt={blog?.blogTitle?.[language]}
                  />
                </div>

                <div className="blog-card-content">
                  {/* Country name */}
                  <p className="blog-card-country">
                    {language === "ar"
                      ? `الدراسة في ${
                          RelatedBlogs?.countryName?.ar || "غير متوفر"
                        }`
                      : `Study in ${RelatedBlogs?.countryName?.en || "N/A"}`}
                  </p>

                  {/* Blog title */}
                  <h4 className="blog-card-title">
                    {language === "ar"
                      ? blog?.blogTitle?.ar
                      : blog?.blogTitle?.en}
                  </h4>

                  {/* Date */}
                  <div className="blog-card-date">
                    <Calander />
                    <span>
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
          <button className="bg-white flex justify-center items-center shadow-sm hover:shadow-xl text-black text-sm font-normal py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-300 group">
            {t("viewAll")}

            <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default RelatedBlogs;
