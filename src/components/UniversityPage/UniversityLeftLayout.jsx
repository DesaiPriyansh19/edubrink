import React from "react";
import CoursesLogo from "../../../svg/CorsesLogo/Index";

const UniversityLeftLayout = ({ data, language }) => {
  return (
    <div className="container mx-auto py-4 mt-5">
      <div className="px-4">
        <h2 className="text-3xl sm:text-4xl font-semibold">
          {language === "ar" ? data?.uniName?.ar : data?.uniName?.en}
        </h2>
        <p className="text-lg sm:text-xl font-semibold text-purple-800 mt-2">
          {data?.countryFlag}{" "}
          {language === "ar" ? data?.countryName?.ar : data?.countryName?.en}
        </p>
      </div>
      <div className="px-4 mt-6">
        <div className="flex items-center gap-3">
          <CoursesLogo />
          <h3 className="text-xl font-bold">Courses</h3>
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold">STUDY LEVEL</p>
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
          <p className="text-sm font-semibold">SUBJECTS</p>
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
