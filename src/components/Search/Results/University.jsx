"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import DollerRounded from "../../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../../svg/PriUniLogo/Index";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TickMark from "../../../../svg/TickMark";
import { useLanguage } from "../../../../context/LanguageContext";
import axios from "axios";
import { useSearch } from "../../../../context/SearchContext";
import GradientSpinnerLoader from "./ImprovedLoaders";
import ReactGA from "react-ga4";
import { ArrowRight } from "lucide-react";
import { getEmoji } from "../../../../libs/countryFlags";

const isWindows = navigator.userAgent.includes("Windows");

const CollegeCard = ({ data, loading }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleApplyClick = (uniName, countryName) => {
    const uniLabel =
      language === "ar" ? uniName?.ar : uniName?.en || "Unknown University";
    const countryLabel =
      language === "ar"
        ? countryName?.ar
        : countryName?.en || "Unknown Country";

    // Track event using ReactGA
    ReactGA.event({
      category: "University Application",
      action: "Apply Click",
      label: uniLabel, // University name in the correct language
      university_name: uniLabel,
      country_name: countryLabel,
    });
  };
  const handleApply = (courseId, customURLSlug) => {
    navigate(
      `/${language}/applications/${courseId}?category=University&slug=${customURLSlug}`
    );
  };

  const handleLearnMore = (uniname) => {
    navigate(`/${language}/university/${uniname}`);
  };

  // Skeleton loader
  if (loading && (!data || data.length === 0)) {
    return (
      <div
        className={`${
          path === `/${language}/searchresults/university`
            ? "grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
            : "flex gap-3 "
        }`}
      >
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={index}
            className="relative mt-3 border px-2 py-1  shadow-md rounded-xl bg-white min-w-[300px] sm:max-w-[350px]"
          >
            <div className="p-2 sm:p-3">
              {/* Badge */}
              <div
                className={`absolute top-0 ${
                  language === "ar" ? "left-0 " : "right-0 "
                } bg-red-500 text-white rounded-tr-[8px] rounded-bl-[5px] text-[8px] px-4 py-2`}
              >
                {t("mostPopular")}
              </div>

              {/* Profile Section */}
              <div className="flex gap-2 items-center mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-20 h-3 bg-gray-300 rounded-md"></div>
                  <div className="w-16 h-2.5 bg-gray-300 rounded-md mt-1"></div>
                </div>
              </div>

              {/* Small Icons Section */}
              <div className="flex flex-wrap gap-2 justify-start">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="rounded-full w-6 h-6 bg-gray-300"></div>
                    <div>
                      <div className="w-14 h-2.5 bg-gray-300 rounded-md"></div>
                      <div className="w-10 h-2 bg-gray-300 rounded-md mt-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-300"></div>

            {/* Buttons */}
            <div className="grid gap-2 px-2 grid-cols-2 mb-3 mt-2">
              <div className="w-full h-7 bg-gray-300 rounded-md"></div>
              <div className="w-full h-7 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Actual Content
  return (
    <div
      className={`${
        path === `/${language}/searchresults/university`
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex overflow-x-scroll scrollbar-hide flex-row  gap-4  "
      }`}
    >
      {[...(data || [])] // Create a copy of data to avoid mutating state
        .sort((a, b) => (b?.uniFeatured ? 1 : -1)) // Sort: Featured first
        .map((university, idx) => {
          const dynamicFeatures = [
            {
              icon: <DollerRounded />,
              title: language === "ar" ? "الرسوم الدراسية" : "Tuition Fees",
              description: `$ ${university?.uniTutionFees}` || "N/A",
            },

            {
              icon: <ScholerShipLogo />,
              title: language === "ar" ? "المنح الدراسية" : "Scholarship",
              description:
                university?.scholarshipAvailability === true
                  ? language === "ar"
                    ? "متاح"
                    : "Available"
                  : language === "ar"
                  ? "غير متاح"
                  : "Not Available",
            },
            {
              icon: <DiscountLogo />,
              title: language === "ar" ? "الخصم" : "Discount",
              description: university?.uniDiscount
                ? language === "ar"
                  ? "متاح"
                  : "Available"
                : language === "ar"
                ? "غير متاح"
                : "Not Available",
            },
          ];
          return (
            <div
              key={idx}
              dir={language === "ar" ? "rtl" : "ltr"}
              className={`relative mt-3  rounded-xl shadow-md hover:shadow-xl mb-2 bg-white min-w-[320px] sm:min-w-[290px]`}
            >
              <div className="p-3 sm:p-4">
                <div className="mb-2">
                  {university?.uniFeatured && (
                    <div
                      className={`absolute  top-0 ${
                        language === "ar" ? "left-0 " : "right-0 "
                      }  bg-red-500 text-white rounded-tr-[10px] rounded-bl-[6px] text-[8px] px-2 py-1 `}
                    >
                      {t("mostPopular")}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center mb-3">
                  <div className="w-12 h-12 xl:w-16 xl:h-16">
                    <img
                      src={
                        university?.uniSymbol || "https://placehold.co/60x60"
                      }
                      alt="Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex  items-baseline gap-1">
                      <h1 className="text-[16px] font-semibold leading-tight inline-flex flex-wrap items-baseline">
                        {(() => {
                          const uniName =
                            language === "ar"
                              ? university?.uniName?.ar
                              : university?.uniName?.en || "N/A";

                          if (uniName === "N/A") {
                            return (
                              <>
                                {uniName}
                                <span className="ml-1 relative top-[2px]">
                                  <TickMark />
                                </span>
                              </>
                            );
                          }

                          if (uniName.length > 40) {
                            const firstBreak =
                              uniName.lastIndexOf(" ", 20) > 0
                                ? uniName.lastIndexOf(" ", 20)
                                : 20;
                            const secondBreak =
                              uniName.lastIndexOf(" ", 40) > 0
                                ? uniName.lastIndexOf(" ", 40)
                                : 40;

                            return (
                              <>
                                {uniName.substring(0, firstBreak)}-
                                <br />
                                <span className="inline-flex items-baseline">
                                  {uniName.substring(
                                    firstBreak + 1,
                                    secondBreak
                                  )}
                                  ...
                                  <span className="ml-1 relative top-[2px]">
                                    <TickMark />
                                  </span>
                                </span>
                              </>
                            );
                          } else if (uniName.length > 20) {
                            // Consistent line-breaking behavior for 20-40 characters
                            const breakPoint =
                              uniName.lastIndexOf(" ", 20) > 0
                                ? uniName.lastIndexOf(" ", 20)
                                : 20;

                            return (
                              <>
                                {uniName.substring(0, breakPoint)}-
                                <br />
                                <span className="inline-flex items-baseline">
                                  {uniName.substring(breakPoint + 1)}
                                  <span className="ml-1 relative top-[2px]">
                                    <TickMark />
                                  </span>
                                </span>
                              </>
                            );
                          }
                          return (
                            <>
                              {uniName}
                              <span className="ml-1 relative top-[2px]">
                                <TickMark />
                              </span>
                            </>
                          );
                        })()}
                      </h1>
                    </div>

                    <div className="text-xs font-medium text-gray-700 flex items-center mt-1">
                      <div className="text-[.7rem] font-medium gap-1 text-black flex items-center mt-1">
                        {isWindows ? (
                          university?.uniCountry ? (
                            <img
                              src={`https://flagcdn.com/w320/${getEmoji(
                                university.uniCountry.countryCode
                              )}.png`}
                              alt="Country Flag"
                              className="w-2.5 h-2.5 object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-[.5rem] font-medium">
                              No flag
                            </span>
                          )
                        ) : (
                          <span className="text-sm filter transition-all duration-300 group-hover:rotate-12">
                            <p>
                              {
                                university?.uniCountry?.countryPhotos
                                  ?.countryFlag
                              }
                            </p>
                          </span>
                        )}
                        <p>{university?.uniCountry?.countryName?.[language]}</p>
                      </div>
                    </div>

                    <div className=" w-full flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full mr-2">
                        <PrivetUniLogo />
                      </span>
                      <p className="text-[9px] font-medium text-gray-700">
                        {language === "ar"
                          ? university?.uniType === "private"
                            ? "جامعة خاصة"
                            : "جامعة حكومية"
                          : university?.uniType === "private"
                          ? "Private University"
                          : "Public University"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 justify-center">
                  {dynamicFeatures.flat().map((feature, index) => (
                    <div
                      key={index}
                      className=" flex items-center gap-1 justify-center"
                    >
                      <span className="rounded-full w-6 h-6 flex items-center justify-center border">
                        {feature.icon}
                      </span>
                      <div>
                        <p className="text-[9px] font-medium">
                          {feature.title}
                        </p>
                        <p className="text-[9px] text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-300"></div>

              <div className="grid gap-4 px-2 grid-cols-2 mb-4 mt-2">
                <button
                  onClick={() => {
                    handleApplyClick(
                      university?.uniName,
                      university?.uniCountry?.countryName
                    );
                    handleApply(
                      university?._id,
                      university?.customURLSlug?.[language]
                    );
                  }}
                  className="bg-slateBlue text-white text-[10px] py-2 px-2 rounded-full"
                >
                  {t("applyNow")}
                </button>
                <button
                  onClick={() => {
                    handleLearnMore(university?.customURLSlug?.[language]);
                  }}
                  className="text-black text-[10px] px-2 py-2 rounded-full border-2 border-gray-800"
                >
                  {t("learnMore")}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

function Univrsiry({
  loading: initialLoading,
  filteredData: initialData,
  countryIds,
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const location = useLocation();
  const path = location.pathname;
  const { filterProp } = useSearch();

  // State for infinite scrolling
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialFetch, setInitialFetch] = useState(true);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const loaderRef = useRef(null);
  const observer = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [directFetchCompleted, setDirectFetchCompleted] = useState(false);

  // Keep track of previous filter state to detect changes
  const filterPropRef = useRef(filterProp);
  const initialDataRef = useRef(null);

  // API base URL - use environment variable or fallback to production URL
  const API_BASE_URL = "https://edu-brink-backend.vercel.app/api/search";

  // Check if we're on the university-specific page
  const isUniversityPath = path === `/${language}/searchresults/university`;

  // Update the isSearchResultsPath variable to check for the main search results path
  const isSearchResultsPath = path === `/${language}/searchresults`;

  // Function to fetch initial universities data directly
  const fetchInitialUniversities = useCallback(async () => {
    if (directFetchCompleted) return;

    try {
      setLoading(true);

      // Get country IDs from context if not provided as props
      let countryIdsToUse = countryIds;
      if (!countryIdsToUse || countryIdsToUse.length === 0) {
        // If no countryIds provided, try to fetch all countries first
        try {
          const countriesResponse = await axios.get(`${API_BASE_URL}`);
          if (countriesResponse.data && countriesResponse.data.data) {
            countryIdsToUse = countriesResponse.data.data.map(
              (country) => country._id
            );
          }
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      }

      const universityFilters = {
        countryIds: countryIdsToUse?.length ? countryIdsToUse.join(",") : "",
        StudyLevel: filterProp.StudyLevel,
        EntranceExam: filterProp.EntranceExam,
        UniType: filterProp.UniType,
        IntakeYear: filterProp.IntakeYear,
        IntakeMonth: filterProp.IntakeMonth,
        Destination: filterProp.Destination,
        // Add course-related filters
        ModeOfStudy: filterProp.ModeOfStudy,
        minBudget:
          filterProp.minBudget !== 0 ? filterProp.minBudget : undefined,
        maxBudget:
          filterProp.maxBudget !== 100000 ? filterProp.maxBudget : undefined,
        MajorDuration: filterProp.MajorDuration,
        // Add search query if it exists
        searchQuery:
          filterProp.searchQuery &&
          (filterProp.searchQuery.en || filterProp.searchQuery.ar)
            ? JSON.stringify(filterProp.searchQuery)
            : undefined,
        page: 1,
        limit: 10,
      };

      // Make API request with all filters
      const response = await axios.get(`${API_BASE_URL}/university`, {
        params: universityFilters,
      });

      console.log(
        "Universities from dedicated page:",
        response.data.data.length
      );

      if (response.data.data && response.data.data.length > 0) {
        setUniversities(response.data.data);
        setTotalUniversities(response.data.pagination.totalUniversities);
        setHasMore(response.data.pagination.hasMore);
      } else {
        setUniversities([]);
        setHasMore(false);
      }

      setDirectFetchCompleted(true);
      setInitialFetch(false);
    } catch (error) {
      console.error("Error in direct fetch:", error);
      setHasMore(false);
      setInitialFetch(false);
      setDirectFetchCompleted(true);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, countryIds, filterProp, directFetchCompleted]);

  // Effect to handle initial data or perform direct fetch if needed
  useEffect(() => {
    // If we have initial data from props, use it
    if (initialData && initialData.length > 0) {
      setUniversities(initialData);
      setLoading(initialLoading);
      setInitialFetch(false);
      setDirectFetchCompleted(true);

      // If we have pagination info from the parent component
      if (initialData._pagination) {
        setTotalUniversities(initialData._pagination.totalUniversities || 0);
        setHasMore(initialData._pagination.hasMore || false);
      } else {
        setHasMore(true);
      }
    }
    // If we're on the university page and don't have data yet, fetch directly
    else if (isUniversityPath && !directFetchCompleted) {
      fetchInitialUniversities();
    }
  }, [
    initialData,
    initialLoading,
    isUniversityPath,
    directFetchCompleted,
    fetchInitialUniversities,
  ]);

  // Effect to handle filter changes
  useEffect(() => {
    const isFilterChanged =
      JSON.stringify(filterPropRef.current) !== JSON.stringify(filterProp);

    if (isFilterChanged) {
      filterPropRef.current = filterProp;
      setPage(1);
      setHasMore(true);
      setInitialFetch(true);
      setDirectFetchCompleted(false); // Reset to allow a new direct fetch with new filters

      // Trigger a new fetch with the updated filters
      if (isUniversityPath) {
        fetchInitialUniversities();
      }
    }
  }, [filterProp, isUniversityPath, fetchInitialUniversities]);

  // Function to fetch more universities with pagination
  const fetchMoreUniversities = useCallback(async () => {
    // Don't fetch more if we're on the main search results page
    if (loadingMore || !hasMore || isSearchResultsPath) return;

    try {
      setLoadingMore(true);

      // Get country IDs from context if not provided as props
      let countryIdsToUse = countryIds;
      if (!countryIdsToUse || countryIdsToUse.length === 0) {
        // Use IDs from existing universities if available
        const existingCountryIds = new Set();
        universities.forEach((uni) => {
          if (uni.uniCountry && uni.uniCountry._id) {
            existingCountryIds.add(uni.uniCountry._id);
          }
        });

        if (existingCountryIds.size > 0) {
          countryIdsToUse = Array.from(existingCountryIds);
        }
      }

      const universityFilters = {
        countryIds: countryIdsToUse?.length ? countryIdsToUse.join(",") : "",
        StudyLevel: filterProp.StudyLevel,
        EntranceExam: filterProp.EntranceExam,
        UniType: filterProp.UniType,
        IntakeYear: filterProp.IntakeYear,
        IntakeMonth: filterProp.IntakeMonth,
        Destination: filterProp.Destination,
        // Add course-related filters
        ModeOfStudy: filterProp.ModeOfStudy,
        minBudget:
          filterProp.minBudget !== 0 ? filterProp.minBudget : undefined,
        maxBudget:
          filterProp.maxBudget !== 100000 ? filterProp.maxBudget : undefined,
        MajorDuration: filterProp.MajorDuration,
        // Add search query if it exists
        searchQuery:
          filterProp.searchQuery &&
          (filterProp.searchQuery.en || filterProp.searchQuery.ar)
            ? JSON.stringify(filterProp.searchQuery)
            : undefined,
        page: page + 1,
        limit: 10,
      };

      // Make API request with all filters
      const response = await axios.get(`${API_BASE_URL}/university`, {
        params: universityFilters,
      });

      if (response.data.data && response.data.data.length > 0) {
        // Merge with existing universities, avoiding duplicates
        setUniversities((prevUniversities) => {
          const existingIds = new Set(prevUniversities.map((uni) => uni._id));
          const newUnis = response.data.data.filter(
            (uni) => !existingIds.has(uni._id)
          );
          const mergedUnis = [...prevUniversities, ...newUnis];

          return mergedUnis;
        });

        // Update pagination state
        setPage(page + 1);
        setHasMore(response.data.pagination.hasMore);
        setTotalUniversities(response.data.pagination.totalUniversities);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [
    API_BASE_URL,
    countryIds,
    filterProp,
    hasMore,
    loadingMore,
    page,
    universities,
    isSearchResultsPath,
  ]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if we're on the main search results page
    if (!hasMore || initialFetch || loadingMore || isSearchResultsPath) {
      return;
    }

    if (observer.current) {
      observer.current.disconnect();
    }

    const callback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setFetchTrigger((prev) => prev + 1);
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
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, initialFetch, isSearchResultsPath]);

  // Handle fetch trigger
  useEffect(() => {
    if (
      fetchTrigger > 0 &&
      !loadingMore &&
      hasMore &&
      !initialFetch &&
      !isSearchResultsPath
    ) {
      fetchMoreUniversities();
    }
  }, [
    fetchTrigger,
    loadingMore,
    hasMore,
    initialFetch,
    fetchMoreUniversities,
    isSearchResultsPath,
  ]);

  // Force check for scroll position after initial data load
  useEffect(() => {
    if (!initialFetch && hasMore && !loadingMore && !isSearchResultsPath) {
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
  }, [initialFetch, hasMore, loadingMore, isSearchResultsPath]);

  // Reset component state when unmounting
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <div dir={language === "ar" ? "rtl" : "ltr"} className="mt-20">
        <div className="mt-6 mb-1">
          <h1 className="text-start text-3xl sm:text-4xl font-semibold">
            🏫 {t("searchResult.uniTitle")}
          </h1>
          <p className="text-sm mt-3 max-w-xl font-medium">
            {t("searchResult.uniDesc")}
          </p>
        </div>

        <div className="w-full hidden sm:flex justify-end items-center px-4">
          <Link to={`/${language}/searchresults/AllUniversity`}>
            <div
              className={`w-full flex mt-4 ${
                language === "ar" ? "justify-start" : "justify-end"
              } items-center px-4`}
            >
              <button
                className={` hidden md:flex    justify-center items-center   text-black text-[.7rem] font-normal py-2 px-3 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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
          </Link>
        </div>
      </div>

      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={`overflow-x-auto scrollbar-hide whitespace-nowrap`}
      >
        <CollegeCard data={universities} loading={loading} />

        {/* Loading indicator at the bottom */}
        {hasMore && universities?.length > 0 && !isSearchResultsPath && (
          <div
            ref={loaderRef}
            className="w-full flex justify-center py-4 mt-2"
            style={{ minHeight: "80px" }}
          >
            <div className="col-span-1 lg:col-span-3">
              <GradientSpinnerLoader
                message={t("Loading more universities...")}
              />
            </div>
          </div>
        )}

        {/* No results message */}
        {!loading && universities?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-500">
              {t("noUniversitiesFound") ||
                "No universities found. Try adjusting your filters."}
            </p>
          </div>
        )}
        <div
          className={`w-full flex mt-4 ${
            language === "ar" ? "justify-start" : "justify-end"
          } items-center px-4`}
        >
          <Link
            to={`/${language}/searchresults/AllUniversity`}
            className={`md:hidden flex    justify-center items-center   text-black text-[.7rem] font-normal py-2 px-3 rounded-full transform hover:scale-105 transition-all duration-300 group`}
          >
            {t("viewAll")}

            <ArrowRight
              className={`inline-block ml-2 ${
                language === "ar"
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "rotate-0 group-hover:translate-x-1"
              } w-4 h-4 transition-transform duration-300 group-hover:translate-x-1`}
            />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Univrsiry;
