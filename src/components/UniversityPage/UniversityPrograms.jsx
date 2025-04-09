"use client";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect } from "react";

const UniversityPrograms = ({
  data,
  language,
  themeColor = "#3b3d8d",
  coursePage = 1,
  courseLimit = 2,
  majorPage = 1,
  majorLimit = 2,
  onCoursePageChange,
  onMajorPageChange,
  coursePagination,
  majorPagination,
  courseFilter,
  majorFilter,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language: currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("courses");

  const handleApply = (itemId, category, customURLSlug) => {
    navigate(
      `/${currentLanguage}/applications/${itemId}?category=${category}&slug=${customURLSlug}`
    );
  };

  // Format languages in a space-efficient way
  const formatLanguages = (languages) => {
    if (!languages || languages.length === 0) return "English";
    if (languages.length === 1) return languages[0];
    return `${languages[0]} +${languages.length - 1}`;
  };

  const handleLearnMore = (itemId, type) => {
    if (type === "course") {
      navigate(
        `/${currentLanguage}/courses/${
          data.courses.find((c) => c._id === itemId)?.customURLSlug?.[
            language
          ] || ""
        }`
      );
    } else {
      navigate(
        `/${currentLanguage}/major/${
          data.majors.find((m) => m._id === itemId)?.customURLSlug?.[
            language
          ] || ""
        }`
      );
    }
  };

  // Calculate total pages for courses
  const courseTotalPages = coursePagination
    ? Math.ceil(coursePagination.total / coursePagination.limit)
    : 1;

  // Calculate total pages for majors
  const majorTotalPages = majorPagination
    ? Math.ceil(majorPagination.total / majorPagination.limit)
    : 1;

  // Check if there are previous or next pages for courses
  const courseHasPreviousPage = coursePage > 1;
  const courseHasNextPage =
    coursePage < courseTotalPages && data?.courses?.length >= courseLimit;
  const shouldDisableCourseNextButton =
    !courseHasNextPage ||
    data?.courses?.length < courseLimit ||
    (coursePagination && coursePagination.total <= coursePage * courseLimit);

  // Check if there are previous or next pages for majors
  const majorHasPreviousPage = majorPage > 1;
  const majorHasNextPage =
    majorPage < majorTotalPages && data?.majors?.length >= majorLimit;
  const shouldDisableMajorNextButton =
    !majorHasNextPage ||
    data?.majors?.length < majorLimit ||
    (majorPagination && majorPagination.total <= majorPage * majorLimit);

  // Check if we have both courses and majors
  const hasCourses = data?.courses && data.courses.length > 0;
  const hasMajors = data?.majors && data.majors.length > 0;

  // If we only have one type, force that tab to be active
  const showTabs = hasCourses && hasMajors;

  // Set the active tab based on available content
  useEffect(() => {
    if (!hasCourses && hasMajors) {
      setActiveTab("majors");
    } else if (hasCourses && !hasMajors) {
      setActiveTab("courses");
    }
  }, [hasCourses, hasMajors]);

  return (
    <div className=" rounded-2xl  p-6 transition-all duration-300 ">
      {/* Header with tabs if we have both courses and majors */}
      <div className={`flex items-center justify-between ${
          activeTab === "courses" ? "mb-0" : "mb-6"
        } border-b pb-4`}>
        <h2 className="text-2xl font-bold text-[#3b3d8d]">
          {t("UniversitySlugPage.FeaturedPrograms") || "Featured Programs"}
        </h2>

        <div className="flex  items-center">
          {/* Show active filter indicators */}
          <div className="flex flex-wrap items-center gap-2">
            {showTabs && (
              <div className="flex mr-4 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === "courses"
                      ? "bg-white text-[#3b3d8d] shadow-sm"
                      : "text-gray-600 hover:text-[#3b3d8d]"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  {t("UniversitySlugPage.Courses") || "Courses"}
                </button>
                <button
                  onClick={() => setActiveTab("majors")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === "majors"
                      ? "bg-white text-[#3b3d8d] shadow-sm"
                      : "text-gray-600 hover:text-[#3b3d8d]"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  {t("UniversitySlugPage.Majors") || "Majors"}
                </button>
              </div>
            )}

            {/* Study Level filter indicator */}
            {Array.isArray(courseFilter) && courseFilter.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#3b3d8d]/10 rounded-full">
                <Filter className="w-4 h-4 text-[#3b3d8d]" />
                <span className="text-sm font-medium text-[#3b3d8d]">
                  {courseFilter.length > 1
                    ? `${courseFilter.length} study levels`
                    : courseFilter[0]}
                </span>
              </div>
            )}

            {/* Mode of Study filter indicator */}
            {Array.isArray(majorFilter) && majorFilter.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#3b3d8d]/10 rounded-full ml-2">
                <Filter className="w-4 h-4 text-[#3b3d8d]" />
                <span className="text-sm font-medium text-[#3b3d8d]">
                  {majorFilter.length > 1
                    ? `${majorFilter.length} modes`
                    : majorFilter[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={` ${
          activeTab === "courses" ? "flex" : "hidden"
        } justify-end my-6`}
      >
        <button
          onClick={() => navigate(`/${currentLanguage}/searchresults/Allcorse`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#3b3d8d] to-[#5254a3] hover:from-[#2d2f6e] hover:to-[#3b3d8d] transition-all duration-300 hover:shadow-md"
        >
          {t("viewAll") || "View All Courses"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Courses Tab Content */}
      {activeTab === "courses" && (
        <>
          {hasCourses ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.courses.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 h-14">
                      {language === "ar"
                        ? item?.CourseName?.ar
                        : item?.CourseName?.en}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-3 rounded-tl-xl">
                        <p className="font-semibold text-gray-700 mb-1">
                          {t("UniversitySlugPage.TuitionFees")}
                        </p>
                        <p className="text-[#3b3d8d] font-medium">
                          ${item.CourseFees}/ {t("UniversitySlugPage.Year")}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-tr-xl">
                        <p className="font-semibold text-gray-700 mb-1">
                          {t("UniversitySlugPage.Language")}
                        </p>
                        <p
                          className="text-[#3b3d8d] font-medium"
                          title={data?.spokenLanguage?.join(", ")}
                        >
                          {formatLanguages(data?.spokenLanguage)}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-bl-xl">
                        <p className="font-semibold text-gray-700 mb-1">
                          {t("majorPage.duration")}
                        </p>
                        <p className="text-[#3b3d8d] font-medium">
                          {item.CourseDuration} {item.CourseDurationUnits}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-br-xl">
                        <p className="font-semibold text-gray-700 mb-1">
                          {t("UniversitySlugPage.ModeOfStudy")}
                        </p>
                        <p className="text-[#3b3d8d] font-medium">
                          {language === "ar"
                            ? item?.ModeOfStudy?.ar?.[0]
                            : item?.ModeOfStudy?.en?.[0]}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() =>
                          handleApply(
                            item?._id,
                            "course",
                            item?.customURLSlug?.[language]
                          )
                        }
                        className="flex-1 py-2.5 text-white bg-gradient-to-r from-[#3b3d8d] to-[#5254a3] rounded-full text-sm font-medium transition-all duration-300 hover:from-[#2d2f6e] hover:to-[#3b3d8d] hover:shadow-md"
                      >
                        {t("applyNow")}
                      </button>

                      <button
                        onClick={() => handleLearnMore(item._id, "course")}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-50 hover:border-gray-400"
                      >
                        {t("learnMore")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 flex justify-center">
                <Filter className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {t("UniversitySlugPage.NoCoursesFound") || "No courses found"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {courseFilter
                  ? t("UniversitySlugPage.NoCoursesWithFilter") ||
                    `No courses found with the "${courseFilter}" study level. Try selecting a different filter.`
                  : t("UniversitySlugPage.NoCoursesAvailable") ||
                    "There are no courses available for this university at the moment."}
              </p>
            </div>
          )}

          {/* Courses Pagination */}
          {hasCourses && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => onCoursePageChange(Math.max(1, coursePage - 1))}
                disabled={!courseHasPreviousPage}
                className={`w-10 h-10 rounded-full border ${
                  courseHasPreviousPage
                    ? "border-[#3b3d8d]/20 bg-white text-[#3b3d8d] hover:bg-[#3b3d8d]/10"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                } transition-colors flex items-center justify-center`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  onCoursePageChange(Math.min(courseTotalPages, coursePage + 1))
                }
                disabled={shouldDisableCourseNextButton}
                className={`w-10 h-10 rounded-full border ${
                  !shouldDisableCourseNextButton
                    ? "border-[#3b3d8d]/20 bg-white text-[#3b3d8d] hover:bg-[#3b3d8d]/10"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                } transition-colors flex items-center justify-center`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Majors Tab Content */}
      {activeTab === "majors" && (
        <>
          {hasMajors ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.majors.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 h-14">
                      {language === "ar"
                        ? item?.majorName?.ar
                        : item?.majorName?.en}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-3 rounded-tl-xl">
                        <p className="font-semibold text-gray-700 mb-1">
                          {t("UniversitySlugPage.TuitionFees")}
                        </p>
                        <p className="text-[#3b3d8d] font-medium">
                          ${item.majorTuitionFees}/{" "}
                          {t("UniversitySlugPage.Year")}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-tr-xl">
                        <p className="font-semibold text-gray-700 mb-1">
                          {t("UniversitySlugPage.Language")}
                        </p>
                        <p
                          className="text-[#3b3d8d] font-medium"
                          title={data?.spokenLanguage?.join(", ")}
                        >
                          {formatLanguages(data?.spokenLanguage)}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-bl-xl">
                        <p className="font-semibold text-gray-700 mb-1">
                          {t("majorPage.duration")}
                        </p>
                        <p className="text-[#3b3d8d] font-medium">
                          {item.duration} {item.durationUnits}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-br-xl">
                        <p className="font-semibold text-gray-700 mb-1">
                          {t("UniversitySlugPage.ModeOfStudy")}
                        </p>
                        <p className="text-[#3b3d8d] font-medium">
                          {item.modeOfStudy || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() =>
                          handleApply(
                            item?._id,
                            "major",
                            item?.customURLSlug?.[language]
                          )
                        }
                        className="flex-1 py-2.5 text-white bg-gradient-to-r from-[#3b3d8d] to-[#5254a3] rounded-full text-sm font-medium transition-all duration-300 hover:from-[#2d2f6e] hover:to-[#3b3d8d] hover:shadow-md"
                      >
                        {t("applyNow")}
                      </button>

                      <button
                        onClick={() => handleLearnMore(item._id, "major")}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-50 hover:border-gray-400"
                      >
                        {t("learnMore")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 flex justify-center">
                <Filter className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {t("UniversitySlugPage.NoMajorsFound") || "No majors found"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {majorFilter
                  ? t("UniversitySlugPage.NoMajorsWithFilter") ||
                    `No majors found with the "${majorFilter}" mode of study. Try selecting a different filter.`
                  : t("UniversitySlugPage.NoMajorsAvailable") ||
                    "There are no majors available for this university at the moment."}
              </p>
            </div>
          )}

          {/* Majors Pagination */}
          {hasMajors && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => onMajorPageChange(Math.max(1, majorPage - 1))}
                disabled={!majorHasPreviousPage}
                className={`w-10 h-10 rounded-full border ${
                  majorHasPreviousPage
                    ? "border-[#3b3d8d]/20 bg-white text-[#3b3d8d] hover:bg-[#3b3d8d]/10"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                } transition-colors flex items-center justify-center`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  onMajorPageChange(Math.min(majorTotalPages, majorPage + 1))
                }
                disabled={shouldDisableMajorNextButton}
                className={`w-10 h-10 rounded-full border ${
                  !shouldDisableMajorNextButton
                    ? "border-[#3b3d8d]/20 bg-white text-[#3b3d8d] hover:bg-[#3b3d8d]/10"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                } transition-colors flex items-center justify-center`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UniversityPrograms;
