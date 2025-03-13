import React from "react";
import CoursesLogo from "../../../svg/CorsesLogo/Index";
import { getEmoji } from "../../../libs/countryFlags";
import { useTranslation } from "react-i18next";
const isWindows = navigator.userAgent.includes("Windows");

const UniversityLeftLayout = ({ data, language }) => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto py-4 mt-5">
      <div className="px-4">
        <h2 className="text-3xl sm:text-4xl font-semibold">
          {language === "ar" ? data?.uniName?.ar : data?.uniName?.en}
        </h2>

        {isWindows ? (
          data?.countryCode ? (
            <div className="flex gap-1 mt-2 items-center">
              <img
                src={`https://flagcdn.com/w320/${getEmoji(
                  data?.countryCode
                )}.png`}
                alt="Country Flag"
                className="w-5 h-5 object-cover rounded-full"
              />
              <p className="text-lg sm:text-xl font-semibold text-purple-800 ">
                {language === "ar"
                  ? data?.countryName?.ar
                  : data?.countryName?.en}
              </p>
            </div>
          ) : (
            <span className="text-[.6rem] font-medium">No flag</span>
          )
        ) : (
          <p className="text-lg sm:text-xl font-semibold text-purple-800 mt-2">
            {data?.countryFlag}{" "}
            {language === "ar" ? data?.countryName?.ar : data?.countryName?.en}
          </p>
        )}
      </div>
      <div className="px-4 mt-6">
        <div className="flex items-center gap-3">
          <CoursesLogo />
          <h3 className="text-xl font-bold">
            {t("UniversitySlugPage.Courses")}
          </h3>
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold">
            {" "}
            {t("UniversitySlugPage.StudyLevel")}
          </p>
          <div className="flex flex-wrap gap-2 mt-8 mb-8">
            {[
              ...new Set(
                data?.courses?.flatMap(
                  (course) => course?.ModeOfStudy?.[language] || []
                ) // Flatten all modeOfStudy values
              ),
            ].map((item, idx) => (
              <span
                key={idx}
                className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-semibold">
            {" "}
            {t("UniversitySlugPage.Subjects")}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {data?.faculties?.map((subject) => (
              <span
                key={subject?._id}
                className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm"
              >
                {language === "ar"
                  ? subject?.facultyName?.ar
                  : subject?.facultyName?.en}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityLeftLayout;
