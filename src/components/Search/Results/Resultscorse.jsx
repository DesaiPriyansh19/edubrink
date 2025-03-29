import { useEffect, useRef, useState, useCallback } from "react";
import DollerRounded from "../../../../svg/DollerRounded/Index";
import Master from "../../../../svg/AboutStudent/Master";
import LanguageLogo from "../../../../svg/LanguageLogo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSearch } from "../../../../context/SearchContext";
import GradientSpinnerLoader from "./ImprovedLoaders";
import { ArrowRight } from "lucide-react";

function ResultsCorses({
  loading: initialLoading,
  filteredData: initialData,
  uniIds,
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { filterProp } = useSearch();

  // State for infinite scrolling
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(initialLoading);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialFetch, setInitialFetch] = useState(true);
  const loaderRef = useRef(null);
  const observer = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Keep track of previous filter state to detect changes
  const filterPropRef = useRef(filterProp);
  const initialDataRef = useRef(null);
  const API_BASE_URL = "https://edu-brink-backend.vercel.app/api/search";

  const isSearchResultsPath = path === `/${language}/searchresults`;

  useEffect(() => {
    const isFilterChanged =
      JSON.stringify(filterPropRef.current) !== JSON.stringify(filterProp);

    // Always update courses when initialData changes, even if it's empty
    if (initialData !== initialDataRef.current) {
      initialDataRef.current = initialData;
      setCourses(initialData || []);
      setPage(1);
      setHasMore((initialData || []).length > 0);
      setInitialFetch(false); // Mark initial fetch as complete when we get data
    }

    if (isFilterChanged) {
      filterPropRef.current = filterProp;
      setPage(1);
      setHasMore(true);
      setInitialFetch(true); // Reset initial fetch when filters change
    }
  }, [filterProp, initialData]);

  useEffect(() => {
    // Set loading state based on initialLoading
    setLoading(initialLoading);
  }, [initialLoading]);

  // Function to fetch more courses - use useCallback to maintain reference
  const fetchMoreCourses = useCallback(async () => {
    if (!hasMore || loadingMore || isSearchResultsPath) return;

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
        setCourses((prevCourses) => {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(
            prevCourses.map((course) => [course._id, true])
          );
          // Filter out duplicates
          const newCourses = response.data.data.filter(
            (course) => !existingIds.has(course._id)
          );
          return [...prevCourses, ...newCourses];
        });
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
  }, [hasMore, loadingMore, isSearchResultsPath, uniIds, filterProp, page]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if we're on the searchresults path, loading, or there's no more data
    if (isSearchResultsPath || !hasMore || initialFetch) {
      return;
    }

    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Use a debounced version of fetchMoreCourses to prevent multiple rapid calls
    let timeoutId = null;
    const debouncedFetch = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!loadingMore && hasMore && !isSearchResultsPath) {
          setFetchTrigger((prev) => prev + 1);
        }
      }, 300);
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        debouncedFetch();
      }
    };

    observer.current = new IntersectionObserver(callback, {
      rootMargin: "200px",
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, isSearchResultsPath, initialFetch]);

  // Handle fetch trigger
  useEffect(() => {
    if (
      fetchTrigger > 0 &&
      !loadingMore &&
      hasMore &&
      !isSearchResultsPath &&
      !initialFetch
    ) {
      fetchMoreCourses();
    }
  }, [
    fetchTrigger,
    loadingMore,
    hasMore,
    isSearchResultsPath,
    initialFetch,
    fetchMoreCourses,
  ]);

  // Force check for scroll position after initial data load
  useEffect(() => {
    if (!initialFetch && !isSearchResultsPath && hasMore && !loadingMore) {
      const timeoutId = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // If the content doesn't fill the viewport, trigger a fetch
        if (scrollHeight <= clientHeight) {
          setFetchTrigger((prev) => prev + 1);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [initialFetch, isSearchResultsPath, hasMore, loadingMore]);

  // Reset component state when unmounting
  useEffect(() => {
    return () => {
      // Clean up everything when component unmounts
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const formatLanguages = (languages) => {
    if (!languages || !Array.isArray(languages) || languages.length === 0)
      return "English";
    if (languages.length === 1) return languages[0];

    // Show first language + count of additional languages
    return `${languages[0]} +${languages.length - 1}`;
  };

  const handleApply = (courseId, customURLSlug) => {
    navigate(
      `/${language}/applications/${courseId}?category=course&slug=${customURLSlug}`
    );
  };

  const handleLearnMore = (course) => {
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
          <div
          className={`w-full flex mt-4 ${
            language === "ar" ? "justify-start" : "justify-end"
          } items-center px-4`}
        >
         <div
                className={`w-full flex mt-4 ${
                  language === "ar" ? "justify-start" : "justify-end"
                } items-center px-4`}
              >
                <button
                  className={` flex    justify-center items-center   text-black text-[.7rem] font-normal py-2 px-3 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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
          </Link>
        </div>
      </div>

      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={`${
          path === `/${language}/searchresults/courses`
            ? "grid grid-cols-1 sm:grid-cols-2 mx-auto lg:grid-cols-3 gap-2 lg:gap-4 max-w-[1120px]"
            : "flex overflow-x-scroll scrollbar-hide flex-col gap-4 sm:flex-row"
        }`}
      >
        {loading && courses?.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
            <div
            key={index}
            className="relative mt-2 border rounded-xl shadow-sm bg-white w-[240px] lg:w-[350px]"
          >
            <div className="px-2 pr-2 sm:pr-4 md:pr-5 lg:pr-5 p-2">
              <div className="flex gap-2 items-center mt-3 mb-3">
                <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
                <div className="flex flex-col gap-1 mx-auto">
                  <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                  <div className="w-20 h-3 bg-gray-300 rounded-md"></div>
                  <div className="w-12 h-3 bg-gray-300 rounded-md"></div>
                </div>
              </div>
          
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-start sm:justify-center mr-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center gap-1">
                    <span className="rounded-full w-7 h-7 bg-gray-300"></span>
                    <div>
                      <div className="w-8 h-3 bg-gray-300 rounded-md"></div>
                      <div className="w-8 h-3 bg-gray-300 rounded-md mt-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 px-2 grid-cols-2 mb-3 mt-2">
              <div className="w-full h-8 bg-gray-300 rounded-md"></div>
              <div className="w-full h-8 bg-gray-300 rounded-md"></div>
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
                  description: formatLanguages(
                    Array.isArray(university?.Languages)
                      ? university?.Languages
                      : []
                  ),
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
                className={`relative mt-2 min-w-[290px] max-w-[290px] lg:min-w-[300px] lg:max-w-[300px]  rounded-xl shadow-sm bg-white ${
                  !isSearchResultsPath ? "min-w-[240px]" : ""
                }`}
              >
                <div
                  className={`px-2 ${
                    language === "ar"
                      ? "pl-2 sm:pl-4 md:pl-5 lg:pl-10"
                      : "pr-2 sm:pr-4 md:pr-5 lg:pr-10"
                  } p-2`}
                >
                  <div className="flex gap-2 items-center mt-3 sm:mt-2 mb-3">
                    <div className="w-14 h-14">
                      <img
                        src={university.uniSymbol || "https://placehold.co/56x56"}
                        alt="College Logo"
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div className="pl-3">
                    <h1 className="text-[16px] font-semibold flex items-center">
  {(() => {
    const courseName = language === "ar"
      ? university?.CourseName?.ar
      : university?.CourseName?.en || "N/A";
      
    return courseName.length > 18 ? courseName.slice(0, 18 ) + "..." : courseName;
  })()}
</h1>

                      <p className="text-[10px] font-medium text-black flex items-center mt-1">
                        {language === "ar"
                          ? university?.university?.uniName?.ar
                          : university?.university?.uniName?.en || "N/A"}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="w-3.5 h-3.5 rounded-full mr-1">
                          <Master />
                        </span>
                      </div>
                    </div>
                  </div>
              
                  <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-start sm:justify-center mr-0 pl-2">
                    {dynamicFeatures?.flat()?.map((feature, index) => (
                      <div key={index} className="flex items-center justify-center">
                        <span className="rounded-full w-6 h-6 flex items-center justify-center border">
                          {feature.icon}
                        </span>
                        <div className="ml-1">
                          <p className="text-[9px] font-medium whitespace-nowrap">
                            {feature.title}
                          </p>
                          <p className="text-[9px] font-medium whitespace-nowrap">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 px-2 grid-cols-2 mb-2 mt-2">
                  <button
                    onClick={() =>
                      handleApply(university?._id, university?.customURLSlug?.[language])
                    }
                    className="bg-slateBlue text-white text-[10px] py-2 px-2 rounded-full"
                  >
                    {t("applyNow")}
                  </button>
                  <button
                    onClick={() => {
                      handleLearnMore(university?.customURLSlug?.en);
                    }}
                    className="text-black text-[10px] px-2 py-2 hover:font-medium rounded-full border border-gray-700"
                  >
                    {t("learnMore")}
                  </button>
                </div>
              </div>
              
              );
            })}

        {/* Loading indicator at the bottom - only show if not on searchresults path */}
        {hasMore && courses?.length > 0 && !isSearchResultsPath && (
          <div
            ref={loaderRef}
            className="w-full flex justify-center py-4 mt-2"
            style={{ minHeight: "80px" }}
          >
            <div className="col-span-1 lg:col-span-3">
              <GradientSpinnerLoader message={t("Loading more courses...")} />
            </div>
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
