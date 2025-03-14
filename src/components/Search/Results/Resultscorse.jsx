"use client";

import { useEffect, useRef, useState } from "react";
import DollerRounded from "../../../../svg/DollerRounded/Index";
import Master from "../../../../svg/AboutStudent/Master";
import LanguageLogo from "../../../../svg/LanguageLogo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAnalysis } from "../../../../context/AnalysisContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSearch } from "../../../../context/SearchContext";

function ResultsCorses({
  loading: initialLoading,
  filteredData: initialData,
  uniIds,
}) {
  const { t } = useTranslation();
  const { addClickData } = useAnalysis();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { filterProp } = useSearch();

  // State for infinite scrolling
  const [courses, setCourses] = useState(initialData || []);
  const [loading, setLoading] = useState(initialLoading);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  // Keep track of previous filter state to detect changes
  const filterPropRef = useRef(filterProp);

  // API base URL
  const API_BASE_URL = "https://edu-brink-backend.vercel.app/api/search";

  useEffect(() => {
    const isFilterChanged =
      JSON.stringify(filterPropRef.current) !== JSON.stringify(filterProp);
    const isInitialDataChanged =
      initialData && JSON.stringify(initialData) !== JSON.stringify(courses);

    if (isFilterChanged) {
      filterPropRef.current = filterProp;
      setPage(1);
      setHasMore(true);
    }

    if (isInitialDataChanged) {
      setCourses(initialData);
      setPage(1);
      setHasMore(initialData.length > 0);
    }
  }, [filterProp, initialData]);

  console.log(filterProp);
  console.log(initialData);

  useEffect(() => {
    // Set loading state based on initialLoading
    setLoading(initialLoading);
  }, [initialLoading]);

  // Function to fetch more courses
  const fetchMoreCourses = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);

      // Create course filters object with all the necessary filters
      const courseFilters = {
        universityIds: uniIds?.length ? uniIds.join(",") : "",
        ModeOfStudy: filterProp.ModeOfStudy,
        CourseDuration: filterProp.CourseDuration,
        minBudget: filterProp.minBudget,
        maxBudget: filterProp.maxBudget,
        searchQuery: filterProp.searchQuery
          ? JSON.stringify(filterProp.searchQuery)
          : undefined,
        page: page + 1, // Next page
      };

      // Make API request with all filters
      const response = await axios.get(`${API_BASE_URL}/course`, {
        params: courseFilters,
      });

      // Check if we got data back
      if (response.data.data && response.data.data.length > 0) {
        setCourses((prevCourses) => [...prevCourses, ...response.data.data]);
        setPage(page + 1);
        setHasMore(response.data.pagination.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more courses:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Set up Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchMoreCourses();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoaderRef = loaderRef.current;

    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMore, loadingMore, uniIds, filterProp]); // Added filterProp to dependencies

  const handleApplyClick = (courseId, countryName) => {
    addClickData(courseId, "Course", countryName);
  };

  const handleNavigate = (course) => {
    navigate(`/${language}/courses/${course}`);
  };

  return (
    <>
      <div className="max-w-full mx-auto">
        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          className="flex items-center justify-between mt-6 mb-4"
        >
          <div className="">
            <h1 className="text-2xl sm:text-4xl font-semibold">
              📚 {t("ourCourseSection.title")}
            </h1>
            <p className="text-sm mt-3 max-w-xl font-medium">
              {t("ourCourseSection.description")}
            </p>
          </div>
          <Link to={`/${language}/searchresults/Allcorse`}>
            <button className="hidden sm:block shadow-sm hover:shadow-md text-black text-sm py-1 px-3 rounded-full">
              {t("viewAll")}
            </button>
          </Link>
        </div>
      </div>

      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={`${
          path === `/${language}/searchresults/courses`
            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
            : "flex overflow-x-scroll scrollbar-hide flex-col gap-4 sm:flex-row"
        }`}
      >
        {loading && courses?.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
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
            ))
          : courses?.map((university, index) => {
              const dynamicFeatures = [
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "رسوم الدورة" : "Tuition Fees",
                  description: university?.CourseFees || "N/A",
                },
                {
                  icon: <LanguageLogo />,
                  title: language === "ar" ? "اللغة" : "Language",
                  description: language === "ar" ? "الإنجليزية" : "English", // Assuming English is default
                },
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "الموعد النهائي" : "Deadline",
                  description: university?.DeadLine
                    ? new Date(university?.DeadLine).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
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
                        ? "pl-3 sm:pl-8 md:pl-9  lg:pl-16"
                        : "pr-3 sm:pr-8 md:pr-9  lg:pr-16"
                    }  p-4`}
                  >
                    <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
                      <div className="w-20 h-20">
                        <img
                          src={
                            university.uniSymbol || "https://placehold.co/80x80"
                          }
                          alt="College Logo"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold flex items-center">
                          {language === "ar"
                            ? university?.CourseName?.ar
                            : university?.CourseName?.en || "N/A"}
                        </h1>
                        <p className="text-[.8rem] font-medium text-black flex items-center mt-1">
                          {language === "ar"
                            ? university?.university?.uniName?.ar
                            : university?.university?.uniName?.en || "N/A"}
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
                  <div className="grid gap-6 px-3 grid-cols-2 mb-4 mt-4">
                    <button
                      onClick={() =>
                        handleApplyClick(university._id, university.countryName)
                      }
                      className="bg-gradient-to-r from-[#380C95] to-[#E15754] hover:bg-gradient-to-l text-white text-sm py-2 px-3 rounded-full"
                    >
                      {t("applyNow")}
                    </button>
                    <button
                      onClick={() => {
                        handleNavigate(university.CourseName.en);
                      }}
                      className="text-black text-sm px-3 py-2 hover:font-medium rounded-full border-2 border-gray-800"
                    >
                      {t("learnMore")}
                    </button>
                  </div>
                </div>
              );
            })}

        {/* Loading indicator at the bottom */}
        {hasMore && courses?.length > 0 && (
          <div
            ref={loaderRef}
            className={`col-span-full flex justify-center py-4 ${
              loadingMore ? "visible" : "invisible"
            }`}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* No results message */}
        {!loading && courses?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-500">
              {t("noCoursesFound") ||
                "No courses found. Try adjusting your filters."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default ResultsCorses;
