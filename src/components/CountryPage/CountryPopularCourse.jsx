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
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row items-center mb-8 justify-between mt-6 md:mb-4">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-start mb-4 md:mb-0 font-semibold">
            {t("countryPage.PopularTitle", { title: t("courses") })}{" "}
            {data?.countryName?.[language] || "N/A"}
          </h1>
          <button
            onClick={() => handleViewAll(data?.countryName?.en)}
            className={`bg-white flex  whitespace-nowrap  justify-center items-center shadow-sm hover:shadow-xl text-black text-sm font-normal py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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

      <div className="flex overflow-x-scroll scrollbar-hide flex-col gap-4 sm:flex-row">
        {data?.universities?.map((university, index) => {
          // Map through each courseId and generate a card for each course
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
                description: language === "ar" ? "الإنجليزية" : "English", // Assuming English is default
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
                className="relative mt-3 border rounded-xl shadow-md bg-white"
              >
                <div
                  className={`px-3 ${
                    language === "ar"
                      ? "pl-3 sm:pl-8 md:pl-9 lg:pl-16"
                      : "pr-3 sm:pr-8 md:pr-9 lg:pr-16"
                  } p-4`}
                >
                  <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
                    <div className="w-20 h-20">
                      <img
                        src={
                          course?.university?.uniSymbol ||
                          "https://placehold.co/80x80" ||
                          "/placeholder.svg"
                        }
                        alt="College Logo"
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold flex items-center">
                        {language === "ar"
                          ? course?.CourseName?.ar
                          : course?.CourseName?.en || "N/A"}
                      </h1>
                      <p className="text-[.8rem] font-medium text-black flex items-center mt-1">
                        {language === "ar"
                          ? university?.uniName?.ar
                          : university?.uniName?.en || "N/A"}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="w-5 h-5 rounded-full mr-1">
                          <Master />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                    {dynamicFeatures?.flat()?.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <span className="rounded-full w-10 flex items-center justify-center h-10 border">
                          {feature.icon}
                        </span>
                        <div className="ml-2">
                          <p className="text-xs whitespace-nowrap font-medium">
                            {feature.title}
                          </p>
                          <p className="text-xs font-medium whitespace-nowrap">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
                  <button
                    onClick={() =>
                      handleNavigation(
                        true,
                        course._id,
                        "course",
                        course?.customURLSlug?.en
                      )
                    }
                    className="bg-slateBlue text-white text-sm py-2 px-3 rounded-full"
                  >
                    {t("applyNow")}
                  </button>
                  <button
                    onClick={() =>
                      handleNavigation(
                        false,
                        course._id,
                        "course",
                        course?.customURLSlug?.en
                      )
                    }
                    className="text-black text-sm px-3 py-2 hover:font-medium rounded-full border-2 border-gray-800"
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
