"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";
import LanguageLogo from "../../../svg/LanguageLogo";
import Master from "../../../svg/AboutStudent/Master";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../context/SearchContext";

function ExploreTopCorse({ language }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { filterProp, cleanFilterProp } = useSearch();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialFetch, setInitialFetch] = useState(true);
  const observer = useRef(null);
  const loadingRef = useRef(null);

  const handleNavigate = (course) => {
    navigate(`/${language}/courses/${course}`);
  };

  const handleApplyClick = (courseId, countryName) => {
    // Your apply logic here
    console.log("Applied for course:", courseId, "in country:", countryName);
  };

  const fetchCourses = useCallback(async () => {
    // Don't fetch if we're already loading or there's no more data (except for initial fetch)
    if (loading || (!hasNextPage && !initialFetch)) return;

    try {
      setLoading(true);
      // Use a smaller limit for initial load (3 items)
      const limit = initialFetch ? 3 : 5;

      console.log(
        "Fetching courses with lastId:",
        lastId,
        "initialFetch:",
        initialFetch
      );

      const response = await fetch(
        `https://edu-brink-backend.vercel.app/api/course/getAll/User/Insta?limit=${limit}${
          lastId ? `&lastId=${lastId}` : ""
        }`
      );

      const result = await response.json();

      if (initialFetch) {
        setCourses(result.data);
        setInitialFetch(false);
      } else {
        setCourses((prev) => [...prev, ...result.data]);
      }

      setLastId(result.meta.lastId);
      setHasNextPage(result.meta.hasNextPage);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [lastId, hasNextPage, initialFetch, loading]);

  useEffect(() => {
    // Only fetch initial data once when component mounts
    if (initialFetch) {
      fetchCourses();
    }
  }, [initialFetch]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if we're already loading or there's no more data
    if (loading || !hasNextPage) return;

    // Disconnect previous observer if it exists
    if (observer.current) observer.current.disconnect();

    const callback = (entries) => {
      // Only fetch more if we're not already loading, there's more data, and the element is intersecting
      if (
        entries[0].isIntersecting &&
        hasNextPage &&
        !loading &&
        !initialFetch
      ) {
        fetchCourses();
      }
    };

    observer.current = new IntersectionObserver(callback, {
      rootMargin: "100px",
    });

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasNextPage, fetchCourses, initialFetch]);

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center max-w-2xl mx-auto font-semibold mb-2">
        {t("explore_courses.title")}
      </h1>

      {/* Description */}
      <p className="text-black font-medium max-w-md mx-auto text-sm text-center mb-24">
        {t("explore_courses.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-11">
        {t("explore_courses.popular_courses")}
      </h3>

      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {courses.length > 0 &&
          courses.map((course, index) => {
            const dynamicFeatures = [
              {
                icon: <DollerRounded />,
                title: language === "ar" ? "رسوم الدورة" : "Tuition Fees",
                description: course?.CourseFees || "N/A",
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
                key={index}
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
                          "https://placehold.co/80x80"
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
                          ? course?.university?.uniName?.ar
                          : course?.university?.uniName?.en || "N/A"}
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
                      handleApplyClick(course._id, course.countryName)
                    }
                    className="bg-gradient-to-r from-[#380C95] to-[#E15754] hover:bg-gradient-to-l text-white text-sm py-2 px-3 rounded-full"
                  >
                    {t("applyNow")}
                  </button>
                  <button
                    onClick={() => {
                      handleNavigate(course.CourseName.en);
                    }}
                    className="text-black text-sm px-3 py-2 hover:font-medium rounded-full border-2 border-gray-800"
                  >
                    {t("learnMore")}
                  </button>
                </div>
              </div>
            );
          })}

        {/* Loading skeletons */}
        {loading &&
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="relative mt-3 border rounded-xl shadow-md bg-white animate-pulse"
            >
              <div className="px-3 pr-3 sm:pr-8 md:pr-9 lg:pr-16 p-4">
                <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
                  <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                  <div className="flex flex-col gap-2">
                    <div className="w-32 h-5 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded-md"></div>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="rounded-full w-10 h-10 bg-gray-300"></span>
                      <div>
                        <div className="w-20 h-4 bg-gray-300 rounded-md"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded-md mt-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
                <div className="w-full h-10 bg-gray-300 rounded-md"></div>
                <div className="w-full h-10 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          ))}

        {/* Loading reference element - this is what the IntersectionObserver watches */}
        {hasNextPage && <div ref={loadingRef} className="h-10 w-full" />}
      </div>

      {/* Load more button (optional alternative to infinite scroll) */}
      {hasNextPage && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={fetchCourses}
            className="px-6 py-2 bg-gradient-to-r from-[#380C95] to-[#E15754] text-white rounded-full"
          >
            {t("loadMore")}
          </button>
        </div>
      )}

      {/* No more courses message */}
      {!hasNextPage && courses.length > 0 && (
        <p className="text-center mt-8 text-gray-500">{t("No More Courses")}</p>
      )}
    </div>
  );
}

export default ExploreTopCorse;
