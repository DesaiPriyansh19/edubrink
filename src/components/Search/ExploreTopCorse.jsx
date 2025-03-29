"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";
import LanguageLogo from "../../../svg/LanguageLogo";
import Master from "../../../svg/AboutStudent/Master";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../context/SearchContext";
import GradientSpinnerLoader, {
  BouncingBarsLoader,
  FullPageLoader,
} from "./Results/ImprovedLoaders";

function ExploreTopCorse({ language }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading
  const [lastId, setLastId] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialFetch, setInitialFetch] = useState(true);
  const observer = useRef(null);
  const loadingRef = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(0); // Used to trigger fetches

  const handleApply = (courseId, customURLSlug) => {
    navigate(
      `/${language}/applications/${courseId}?category=course&slug=${customURLSlug}`
    );
  };

  const handleLearnMore = (course) => {
    navigate(`/${language}/courses/${course}`);
  };

  const fetchCourses = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (loading) return;

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

      // Check if we received valid data
      if (!result.data || result.data.length === 0) {
        setHasNextPage(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // Process the new data
      setCourses((prevCourses) => {
        if (initialFetch) {
          setInitialFetch(false);
          return result.data;
        } else {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(
            prevCourses.map((course) => [course._id, true])
          );
          // Filter out duplicates
          const newCourses = result.data.filter(
            (course) => !existingIds.has(course._id)
          );
          return [...prevCourses, ...newCourses];
        }
      });

      setLastId(result.meta.lastId);
      setHasNextPage(result.meta.hasNextPage);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [lastId, initialFetch, loading]);

  // Initial data fetch
  useEffect(() => {
    // Only fetch initial data once when component mounts
    if (initialFetch) {
      setInitialLoading(true);
      fetchCourses();
    }

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [fetchCourses, initialFetch]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if we're loading, there's no more data, or we're still in initial fetch
    if (loading || !hasNextPage || initialFetch) {
      return;
    }

    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Use a debounced version of fetchCourses to prevent multiple rapid calls
    let timeoutId = null;
    const debouncedFetch = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!loading && hasNextPage && !initialFetch) {
          setFetchTrigger((prev) => prev + 1); // Trigger a fetch
        }
      }, 300); // 300ms debounce
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        debouncedFetch();
      }
    };

    observer.current = new IntersectionObserver(callback, {
      rootMargin: "200px", // Increased margin to trigger earlier
      threshold: 0.1,
    });

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasNextPage, initialFetch, fetchCourses]);

  // Handle fetch trigger
  useEffect(() => {
    if (fetchTrigger > 0 && !loading && hasNextPage && !initialFetch) {
      fetchCourses();
    }
  }, [fetchTrigger, loading, hasNextPage, initialFetch, fetchCourses]);

  // Reset component state when unmounting
  useEffect(() => {
    return () => {
      // Clean up everything when component unmounts
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Show full page loader for initial loading
  if (initialLoading) {
    return (
      <BouncingBarsLoader type="gradient" message={t("Loading courses...")} />
    );
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="p-4">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl text-center max-w-2xl mx-auto font-semibold mb-2">
        {t("explore_courses.title")}
      </h1>

      {/* Description */}
      <p className="text-black font-medium max-w-md mx-auto text-sm text-center mb-24">
        {t("explore_courses.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-3xl md:text-3xl lg:text-4xl font-semibold mb-11">
        {t("explore_courses.popular_courses")}
      </h3>

      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
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
              className="relative mt-2  rounded-xl shadow-sm bg-white p-2 hover:shadow-lg"
            >
              <div
                className={`px-2 ${
                  language === "ar"
                    ? "pl-2 sm:pl-4 md:pl-5 lg:pl-8"
                    : "pr-2 sm:pr-4 md:pr-5 lg:pr-8"
                }`}
              >
                <div className="flex gap-1.5 sm:gap-2 items-center mt-3 sm:mt-1.5 mb-3 md:mb-1.5">
                  <div className="w-12 h-12">
                    <img
                      src={
                        course?.university?.uniSymbol ||
                        "https://placehold.co/50x50" ||
                        "/placeholder.svg"
                      }
                      alt="College Logo"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div>
                  <h1 className="text-sm font-semibold">
  {language === "ar"
    ? course?.CourseName?.ar?.length > 20
      ? course?.CourseName?.ar.substring(0, 20) + "..."
      : course?.CourseName?.ar
    : course?.CourseName?.en?.length > 20
    ? course?.CourseName?.en.substring(0, 20) + "..."
    : course?.CourseName?.en || "N/A"}
</h1>

                    <p className="text-[0.7rem] font-medium text-black mt-0.5">
                      {language === "ar"
                        ? course?.university?.uniName?.ar
                        : course?.university?.uniName?.en || "N/A"}
                    </p>
                    <div className="flex items-center mt-0.5">
                      <span className="w-3.5 h-3.5">
                        <Master />
                      </span>
                    </div>
                  </div>
                </div>
            
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-start sm:justify-center mr-4">
                  {dynamicFeatures?.flat()?.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="rounded-full h-3 w-3 px-2 sm:px-1 sm:w-6 sm:h-6 flex items-center justify-center border">
                        {feature.icon}
                      </span>
                      <div className="ml-1">
                        <p className="text-[0.60rem] sm:text-[0.65rem] font-medium">{feature.title}</p>
                        <p className="text-[0.60rem] sm:text-[0.65rem] font-medium">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            
              <div className="grid gap-3 px-2 grid-cols-2 mb-3 mt-2">
                <button
                  onClick={() => handleApply(course?._id, course?.customURLSlug?.[language])}
                  className="bg-slateBlue text-white text-[0.7rem] py-1 px-2 rounded-full"
                >
                  {t("applyNow")}
                </button>
                <button
                  onClick={() => handleLearnMore(course?.customURLSlug?.[language])}
                  className="text-black text-[0.7rem] px-2 py-1 hover:font-medium rounded-full border border-gray-800"
                >
                  {t("learnMore")}
                </button>
              </div>
            </div>
            
            
            );
          })}

        {/* Loading indicator for more content */}
        {loading && (
          <div className="col-span-1 sm:col-span-2">
            <GradientSpinnerLoader message={t("Loading more courses...")} />
          </div>
        )}

        {/* Loading reference element - this is what the IntersectionObserver watches */}
        {hasNextPage && !loading && (
          <div
            ref={loadingRef}
            className="h-20 w-full col-span-1 sm:col-span-2"
          />
        )}
      </div>

      {/* Load more button (optional alternative to infinite scroll) */}
      {hasNextPage && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setFetchTrigger((prev) => prev + 1)}
            className="px-6 py-2 bg-gradient-to-r from-[#380C95] to-[#E15754] text-white rounded-full"
          >
            {t("loadMore")}
          </button>
        </div>
      )}

      {/* No more courses message */}
      {!hasNextPage && courses.length > 0 && (
        <p className="text-center mt-8 text-gray-500">{t("NoMoreCourses")}</p>
      )}
    </div>
  );
}

export default ExploreTopCorse;
