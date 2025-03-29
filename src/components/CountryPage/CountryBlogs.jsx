import React from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useSearch } from "../../../context/SearchContext";
import { useNavigate } from "react-router-dom";
function CountryBlogs({ data }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { setFilterProp } = useSearch();
  const navigate = useNavigate();
  const handleViewAll = (selectedValue) => {
    setFilterProp((prev) => ({
      ...prev,
      Destination: Array.isArray(prev.Destination)
        ? [selectedValue]
        : [selectedValue],
    }));
    navigate(`/${language}/searchresults/article`);
  };

  const handleNavigate = (name) => {
    navigate(`/${language}/blog/${name}`);
  };
  return (
    <div className="mt-11 text-black">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center mb-8 justify-between mt-6 md:mb-4">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-start mb-4 md:mb-0 font-semibold">
            {t("countryPage.PopularTitle", { title: t("articles") })}{" "}
            {data?.countryName?.[language] || "N/A"}
          </h1>
          <button
            onClick={() => handleViewAll(data?.countryName?.en)}
            className={` flex  whitespace-nowrap  justify-center items-center   text-black text-sm font-normal py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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
      </div>
      <div className="flex flex-col scrollbar-hide em:flex-row overflow-x-auto gap-6   py-6 ">
        {/* First Slide */}
        {data?.blog.map((blog, idx) => (
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
                  ? `الدراسة في ${data?.countryName?.[language] || "غير متوفر"}`
                  : `Study in ${data?.countryName?.[language] || "N/A"}`}
              </p>

              {/* Blog title */}
              <h4 className="blog-card-title">
                {language === "ar" ? blog?.blogTitle?.ar : blog?.blogTitle?.en}
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
    </div>
  );
}

export default CountryBlogs;
