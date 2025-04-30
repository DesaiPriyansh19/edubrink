"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import DollerRounded from "../../../../svg/DollerRounded/Index";
import LanguageLogo from "../../../../svg/LanguageLogo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSearch } from "../../../../context/SearchContext";
import GradientSpinnerLoader from "./ImprovedLoaders";
import { ArrowRight, BookOpenText } from "lucide-react";

function ResultsMajors({
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
  const [majors, setMajors] = useState([]);

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

  // We need a separate variable to check if we're on the majors-specific page
  const isMajorsPath = path === `/${language}/searchresults/majors`;

  // Add this new effect to fetch data when on the majors page with no data
  useEffect(() => {
    const fetchMajorsData = async () => {
      // Only fetch if we're on the majors page, don't have data, and aren't already loading
      if (isMajorsPath && majors.length === 0 && !loading && !loadingMore) {
        try {
          setLoading(true);

          // Create major filters object with all the necessary filters
          const majorFilters = {
            universityIds: uniIds?.length ? uniIds.join(",") : "",
            ModeOfStudy: filterProp.ModeOfStudy,
            MajorDuration: filterProp.MajorDuration,
            minBudget: filterProp.minBudget,
            maxBudget: filterProp.maxBudget,
            IntakeYear: filterProp.IntakeYear,
            IntakeMonth: filterProp.IntakeMonth,
            StudyLevel: filterProp.StudyLevel,
            searchQuery: filterProp.searchQuery
              ? JSON.stringify(filterProp.searchQuery)
              : undefined,
          };
          const hasFilterProp =
            !!filterProp.ModeOfStudy ||
            !!filterProp.MajorDuration ||
            !!filterProp.EntranceExam ||
            !!filterProp.UniType ||
            (filterProp.minBudget !== 0 &&
              filterProp.minBudget !== undefined) ||
            (filterProp.maxBudget !== 100000 &&
              filterProp.maxBudget !== undefined) ||
            !!filterProp.IntakeYear ||
            !!filterProp.IntakeMonth ||
            !!(filterProp.Destination && filterProp.Destination.length > 0) ||
            (filterProp.StudyLevel && filterProp.StudyLevel !== "All") ||
            !!(
              filterProp.searchQuery &&
              (filterProp.searchQuery.en || filterProp.searchQuery.ar)
            );

          // Add the hasFilterProp flag to the majorFilters
          majorFilters.hasFilterProp = hasFilterProp;

          // Make API request with all filters
          const response = await axios.get(`${API_BASE_URL}/major`, {
            params: majorFilters,
          });

          // Update majors state with the fetched data
          if (response.data.data && response.data.data.length > 0) {
            setMajors(response.data.data);
            setHasMore(response.data.pagination.hasMore);
            setInitialFetch(false);
          } else {
            // Even if no data, mark as fetched
            setInitialFetch(false);
          }
        } catch (error) {
          console.error("Error fetching majors data:", error);
          setInitialFetch(false);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMajorsData();
  }, [isMajorsPath, majors.length, loading, loadingMore, uniIds, filterProp]);

  useEffect(() => {
    const isFilterChanged =
      JSON.stringify(filterPropRef.current) !== JSON.stringify(filterProp);

    // Always update majors when initialData changes, even if it's empty
    if (initialData !== initialDataRef.current) {
      initialDataRef.current = initialData;
      setMajors(initialData || []);
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

  // Function to fetch more majors - use useCallback to maintain reference
  const fetchMoreMajors = useCallback(async () => {
    // We should only prevent fetching if we're on the main search results page
    // or if there's no more data or if we're already loading
    if (!hasMore || loadingMore || isSearchResultsPath) return;

    try {
      setLoadingMore(true);

      // Create major filters object with all the necessary filters
      const majorFilters = {
        universityIds: uniIds?.length ? uniIds.join(",") : "",
        ModeOfStudy: filterProp.ModeOfStudy,
        MajorDuration: filterProp.MajorDuration,
        minBudget: filterProp.minBudget,
        maxBudget: filterProp.maxBudget,
        IntakeYear: filterProp.IntakeYear,
        IntakeMonth: filterProp.IntakeMonth,
        StudyLevel: filterProp.StudyLevel,
        searchQuery: filterProp.searchQuery
          ? JSON.stringify(filterProp.searchQuery)
          : undefined,
        page: page + 1, // Next page
      };

      const hasFilterProp =
        !!filterProp.ModeOfStudy ||
        !!filterProp.MajorDuration ||
        !!filterProp.EntranceExam ||
        !!filterProp.UniType ||
        (filterProp.minBudget !== 0 && filterProp.minBudget !== undefined) ||
        (filterProp.maxBudget !== 100000 &&
          filterProp.maxBudget !== undefined) ||
        !!filterProp.IntakeYear ||
        !!filterProp.IntakeMonth ||
        !!(filterProp.Destination && filterProp.Destination.length > 0) ||
        (filterProp.StudyLevel && filterProp.StudyLevel !== "All") ||
        !!(
          filterProp.searchQuery &&
          (filterProp.searchQuery.en || filterProp.searchQuery.ar)
        );

      // Add the hasFilterProp flag to the majorFilters
      majorFilters.hasFilterProp = hasFilterProp;

      // Make API request with all filters
      const response = await axios.get(`${API_BASE_URL}/major`, {
        params: majorFilters,
      });

      // Check if we got data back
      if (response.data.data && response.data.data.length > 0) {
        setMajors((prevMajors) => {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(
            prevMajors.map((major) => [major._id, true])
          );
          // Filter out duplicates
          const newMajors = response.data.data.filter(
            (major) => !existingIds.has(major._id)
          );
          return [...prevMajors, ...newMajors];
        });
        setPage(page + 1);
        setHasMore(response.data.pagination.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more majors:", error);
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

    // Use a debounced version of fetchMoreMajors to prevent multiple rapid calls
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
      fetchMoreMajors();
    }
  }, [
    fetchTrigger,
    loadingMore,
    hasMore,
    isSearchResultsPath,
    initialFetch,
    fetchMoreMajors,
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

  const formatDeadline = (deadline) => {
    if (!deadline || !Array.isArray(deadline) || deadline.length === 0)
      return "N/A";

    const shortMonths = deadline.map((month) => month.slice(0, 3));

    if (shortMonths.length === 1) return shortMonths[0];

    return `${shortMonths[0]} +${shortMonths.length - 1}`;
  };

  const formatStudyLevel = (studyLevel) => {
    if (!studyLevel || !Array.isArray(studyLevel) || studyLevel.length === 0)
      return "N/A";

    // Define study level names in both languages
    const englishLevels = [
      "Bachelor's",
      "Master's",
      "PhD",
      "Diploma",
      "Certificate",
    ];
    const arabicLevels = ["بكالوريوس", "ماجستير", "دكتوراه", "دبلوم", "شهادة"];

    // Choose the appropriate array based on language
    const levelsArray = language === "ar" ? arabicLevels : englishLevels;

    // Map the English study level to the appropriate language
    if (studyLevel.length === 1) {
      // Find the index of the study level in the English array
      const index = englishLevels.findIndex(
        (level) => level.toLowerCase() === studyLevel[0].toLowerCase()
      );

      // If found, return the corresponding level in the selected language
      if (index !== -1) {
        return levelsArray[index];
      }

      // If not found in our mapping, return the original value
      return studyLevel[0];
    }

    // For multiple study levels, show the first one + count
    const firstLevelIndex = englishLevels.findIndex(
      (level) => level.toLowerCase() === studyLevel[0].toLowerCase()
    );

    const firstLevel =
      firstLevelIndex !== -1 ? levelsArray[firstLevelIndex] : studyLevel[0];

    return `${firstLevel} +${studyLevel.length - 1}`;
  };

  const handleApply = (majorId, customURLSlug) => {
    navigate(
      `/${language}/applications/${majorId}?category=major&slug=${customURLSlug}`
    );
  };

  const handleLearnMore = (major) => {
    navigate(`/${language}/major/${major}`);
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
              📚 {t("ourMajorSection.title")}
            </h1>
            <p className="text-sm mt-3 max-w-xl font-medium">
              {t("ourMajorSection.description")}
            </p>
          </div>
          <Link to={`/${language}/searchresults/Allmajor`}>
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
                  className={`hidden md:flex justify-center items-center text-black text-[.7rem] font-normal py-2 px-3 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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

      {/* This is the key part that needs to be fixed */}
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={`${
          isMajorsPath
            ? "grid grid-cols-1 sm:grid-cols-2 mx-auto lg:grid-cols-3 gap-2 lg:gap-4 max-w-[1120px]"
            : "flex overflow-x-auto scrollbar-hide gap-4 w-full pb-4"
        }`}
      >
        {loading && majors?.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
              //  Skeleton loader
              <div
                key={index}
                className={`relative mt-2 px-4 rounded-xl shadow-sm bg-white ${
                  !isMajorsPath
                    ? "minw-[290px] sm:min-w-[240px] flex-shrink-0"
                    : ""
                }`}
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
                      <div
                        key={i}
                        className="flex items-center justify-center gap-1"
                      >
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
          : majors?.map((university, index) => {
              const dynamicFeatures = [
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "رسوم التخصص" : "Tuition Fees",
                  description: university?.majorTuitionFees || "N/A",
                },
                {
                  icon: <LanguageLogo />,
                  title: language === "ar" ? "اللغة" : "Language",
                  description: formatLanguages(
                    Array.isArray(university?.majorLanguages)
                      ? university?.majorLanguages
                      : []
                  ),
                },
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "الموعد النهائي" : "Deadline",
                  description: formatDeadline(university?.majorIntakeMonth),
                },
              ];

              return (
                <div
                  key={index}
                  className={`relative mt-2 rounded-xl shadow-md hover:shadow-xl bg-white ${
                    !isMajorsPath
                      ? "min-w-[300px] sm:min-w-[240px] flex-shrink-0"
                      : ""
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
                          src={
                            university.university.uniSymbol ||
                            "https://placehold.co/56x56" ||
                            "/placeholder.svg"
                          }
                          alt="College Logo"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div className="pl-3 ">
                        <div className="min-h-[2em] w-full    flex items-center">
                          <h1 className="text-[16px] font-semibold leading-tight">
                            {(() => {
                              const majorName =
                                language === "ar"
                                  ? university?.majorName?.ar
                                  : university?.majorName?.en || "N/A";

                              if (majorName === "N/A") return majorName;

                              if (majorName.length > 28) {
                                // Find last space before 28 character
                                const lastSpaceIndex = majorName.lastIndexOf(
                                  " ",
                                  28
                                );
                                // Split at space if found, otherwise at 28 character
                                const splitIndex =
                                  lastSpaceIndex > 0 ? lastSpaceIndex : 28;

                                // First line break at 17 chars
                                const firstBreakIndex =
                                  majorName.lastIndexOf(" ", 25) > 0
                                    ? majorName.lastIndexOf(" ", 25)
                                    : 25;

                                return (
                                  <>
                                    {majorName.substring(0, firstBreakIndex)}
                                    <br />
                                    {majorName.substring(
                                      firstBreakIndex + 1,
                                      splitIndex
                                    )}
                                    ...
                                  </>
                                );
                              } else if (majorName.length > 17) {
                                // Normal line break (original behavior)
                                const lastSpaceIndex = majorName.lastIndexOf(
                                  " ",
                                  17
                                );
                                const splitIndex =
                                  lastSpaceIndex > 0 ? lastSpaceIndex : 17;

                                return (
                                  <>
                                    {majorName.substring(0, splitIndex)}
                                    <br />
                                    {majorName.substring(splitIndex + 1)}
                                  </>
                                );
                              }
                              // For short names
                              return (
                                <>
                                  {majorName}
                                  <span className="inline-block opacity-0 w-0 h-[1em]">
                                    .
                                  </span>
                                </>
                              );
                            })()}
                          </h1>
                        </div>

                        <p className="text-[10px] font-medium text-black flex items-center mt-1">
                          {language === "ar"
                            ? university?.university?.uniName?.ar
                            : university?.university?.uniName?.en || "N/A"}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="flex items-center gap-1 rounded-full mr-1">
                            <BookOpenText className="w-3.5 font-semibold h-3.5" />
                            <span className="text-xs">
                              {formatStudyLevel(university.studyLevel)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-start sm:justify-center mr-0 pl-2">
                      {dynamicFeatures?.flat()?.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center"
                        >
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
                        handleApply(
                          university?._id,
                          university?.customURLSlug?.[language]
                        )
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
        {hasMore && majors?.length > 0 && !isSearchResultsPath && (
          <div
            ref={loaderRef}
            className={`flex justify-center py-4 mt-2 ${
              !isMajorsPath ? "min-w-[240px] flex-shrink-0" : "w-full"
            }`}
            style={{ minHeight: "80px" }}
          >
            <div className="col-span-1 lg:col-span-3">
              <GradientSpinnerLoader message={t("Loading more majors...")} />
            </div>
          </div>
        )}

        {/* No results message */}
        {!loading && majors?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-500">
              {t("noMajorsFound") ||
                "No majors found. Try adjusting your filters."}
            </p>
          </div>
        )}
      </div>
      <div
        className={`w-full flex mt-4 ${
          language === "ar" ? "justify-start" : "justify-end"
        } items-center px-4`}
      >
        <button
          onClick={() => navigate(`/${language}/searchresults/AllMajor`)}
          className={`md:hidden flex justify-center items-center text-black text-[.7rem] font-normal py-2 px-3 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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
    </>
  );
}

export default ResultsMajors;
