import React from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";

import Master from "../../../svg/AboutStudent/Master";
import LanguageLogo from "../../../svg/LanguageLogo";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useSearch } from "../../../context/SearchContext";
import { useNavigate } from "react-router-dom";

// Course Data

const CountryPopularCourse = ({ data }) => {
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
    navigate(`/${language}/searchresults/courses`);
  };

  const handleNavigation = (apply, id, category, slug) => {
    if (apply) {
      navigate(
        `/${language}/applications/${id}?category=${encodeURIComponent(
          category
        )}&slug=${slug}`
      );
    } else {
      navigate(`/${language}/courses/${slug}`);
    }
  };

  return (
    <>
      <div className="max-w-full mx-auto px-5">
        <div className="flex flex-col sm:flex-row items-center mb-8 justify-between mt-6 md:mb-4">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-start mb-4 md:mb-0 font-semibold ">
            {t("countryPage.PopularTitle", { title: t("courses") })}{" "}
            {data?.countryName?.[language] || "N/A"}
          </h1>
          <button
            onClick={() => handleViewAll(data?.countryName?.en)}
            className={` flex  whitespace-nowrap  justify-center items-center  text-black text-sm font-normal py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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
        <div className="w-full hidden sm:flex justify-end items-center px-4"></div>
      </div>

      <div className="flex flex-wrap justify-start gap-3">
  {data?.universities?.map((university, index) => {
    return university?.courseId?.map((course, courseIndex) => {
      const dynamicFeatures = [
        {
          icon: <DollerRounded />,
          title: language === "ar" ? "رسوم الدورة" : "Tuition Fees",
          description: `$ ${course?.CourseFees}` || "N/A",
        },
        {
          icon: <LanguageLogo />,
          title: language === "ar" ? "اللغة" : "Language",
          description: language === "ar" ? "الإنجليزية" : "English",
        },
        {
          icon: <DollerRounded />,
          title: language === "ar" ? "الموعد النهائي" : "Deadline",
          description: course?.DeadLine
            ? new Date(course?.DeadLine).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A",
        },
      ];

      return (
        <div
          key={courseIndex}
          className="relative w-[90%] sm:w-[45%] lg:w-[30%]     rounded-xl  bg-white p-3"
        >
          <div className="flex gap-2 items-center mt-2 mb-2">
            <div className="w-14 h-14">
              <img
                src={course?.university?.uniSymbol || "https://placehold.co/80x80"}
                alt="College Logo"
                className="w-full h-full rounded-full"
              />
            </div>
            <div>
            <h1 className="text-sm font-semibold">
  {language === "ar" 
    ? (course?.CourseName?.ar?.length > 18 
        ? `${course.CourseName.ar.substring(0, 18)}...`
        : course?.CourseName?.ar || "N/A")
    : (course?.CourseName?.en?.length > 18 
        ? `${course.CourseName.en.substring(0, 18)}...`
        : course?.CourseName?.en || "N/A")}
</h1>
              <p className="text-[0.7rem] font-medium text-black mt-1">
                {language === "ar" ? university?.uniName?.ar : university?.uniName?.en || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-start">
            {dynamicFeatures?.map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="rounded-full w-7 h-7 flex items-center justify-center border">
                  {feature.icon}
                </span>
                <div className="ml-1">
                  <p className="text-[0.55rem] font-medium">{feature.title}</p>
                  <p className="text-[0.55rem] font-medium">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-2 grid-cols-2 mt-3">
            <button
              onClick={() => handleNavigation(true, course._id, "course", course?.customURLSlug?.en)}
              className="bg-slateBlue text-white text-xs py-1 px-2 rounded-full"
            >
              {t("applyNow")}
            </button>
            <button
              onClick={() => handleNavigation(false, course._id, "course", course?.customURLSlug?.en)}
              className="text-black text-xs px-2 py-1 hover:font-medium rounded-full border border-gray-800"
            >
              {t("learnMore")}
            </button>
          </div>
        </div>
      );
    });
  })}
</div>

    </>
  );
};

export default CountryPopularCourse;
