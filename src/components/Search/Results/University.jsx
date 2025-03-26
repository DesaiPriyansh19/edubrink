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

const CollegeCard = ({ data, loading }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const path = location.pathname;

  // const handleApplyClick = (uniId, uniName, countryName) => {
  //   if (!window.gtag) return; // Prevent errors if GA4 isn't loaded

  //   // Get the correct language label
  //   const uniLabel = language === "ar" ? uniName.ar : uniName.en;

  //   // Track event in GA4
  //   ReactGA.event("Clicked on Apply", {
  //     category: "University Click",
  //     label: uniLabel, // University name in the correct language
  //     value: uniId,
  //   });

  //   // Store click data in your backend
  //   addClickData(uniId, "University", countryName);
  // };

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
          path === "/en/searchresults/university"
            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
            : "flex gap-2"
        }`}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative mt-6 border rounded-xl shadow-md bg-white max-w-sm sm:max-w-md md:max-w-lg"
          >
            <div className="p-4 sm:p-6">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-bl-md rounded-tr-xl">
                Most Popular
              </div>

              <div className="flex gap-3 sm:gap-4 items-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-32 h-5 bg-gray-300 rounded-md"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded-md mt-2"></div>
                  <div className="w-16 h-4 bg-gray-300 rounded-md mt-1"></div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 justify-center"
                  >
                    <div className="rounded-full w-10 h-10 bg-gray-300"></div>
                    <div>
                      <div className="w-20 h-4 bg-gray-300 rounded-md"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded-md mt-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-300"></div>

            <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
              <div className="w-full h-10 bg-gray-300 rounded-md"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md"></div>
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
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  "
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
            className={`relative mt-3  rounded-xl  bg-white md:min-w-[300px] md:max-w-[300px] lg:max-w-[295px] lg:min-w-[295px] xl:max-w-[350px] xl:min-w-[350px]`}
          >
            <div className="p-3 sm:p-4">
              {university?.uniFeatured && (
                <div
                  className={`absolute top-0 ${
                    language === "ar"
                      ? "left-0 "
                      : "right-0 "
                  }  bg-red-500 text-white rounded-tr-[10px] rounded-bl-[6px] text-[8px] px-2 py-1`}
                >
                  {t("mostPopular")}
                </div>
              )}
          
              <div className="flex gap-2 items-center mb-3">
                <div className="w-12 h-12">
                  <img
                    src={"https://placehold.co/60x60"}
                    alt="Logo"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                <h1 className="text-[16px] font-semibold flex items-center gap-1">
  {(() => {
    const uniName = language === "ar"
      ? university?.uniName?.ar
      : university?.uniName?.en || "N/A";

    return uniName.length > 20 ? uniName.slice(0, 20) + "..." : uniName;
  })()}
  <span className=" w-2 ">
    <TickMark />
  </span>
</h1>

          
                  <div className="text-xs font-medium text-gray-700 flex items-center mt-1">
                    <p>{university?.uniCountry?.countryPhotos?.countryFlag}</p>
                    {language === "ar"
                      ? university?.uniCountry?.countryName?.ar
                      : university?.uniCountry?.countryName?.en || "N/A"}
                  </div>
          
                  <div className=" w-full flex items-center mt-1">
                    <span className="w-4 h-4 rounded-full mr-2">
                      <PrivetUniLogo />
                    </span>
                    <p className="text-[9px] font-medium text-gray-700">
                      {language === "ar"
                        ? university?.uniType === "Private"
                          ? "جامعة خاصة"
                          : "جامعة حكومية"
                        : university?.uniType === "Private"
                        ? "Private University"
                        : "Public University"}
                    </p>
                  </div>
                </div>
              </div>
          
              <div className="flex gap-1 justify-center">
                {dynamicFeatures.flat().map((feature, index) => (
                  <div key={index} className=" flex items-center gap-1 justify-center">
                    <span className="rounded-full w-6 h-6 flex items-center justify-center border">
                      {feature.icon}
                    </span>
                    <div>
                      <p className="text-[9px] font-medium">{feature.title}</p>
                      <p className="text-[9px] text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
            <div className="w-full h-[1px] bg-gray-300"></div>
          
            <div className="grid gap-4 px-2 grid-cols-2 mb-4 mt-2">
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
  const [universities, setUniversities] = useState(initialData || []);
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

  // API base URL
  const API_BASE_URL = "https://edu-brink-backend.vercel.app/api/search";
  const isSearchResultsPath = path === `/${language}/searchresults`;

  useEffect(() => {
    const isFilterChanged =
      JSON.stringify(filterPropRef.current) !== JSON.stringify(filterProp);

    // Always update universities when initialData changes, even if it's empty
    if (initialData !== initialDataRef.current) {
      initialDataRef.current = initialData;
      setUniversities(initialData || []);
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

  // Function to fetch more universities - use useCallback to maintain reference
  const fetchMoreUniversities = useCallback(async () => {
    if (!hasMore || loadingMore || isSearchResultsPath) return;

    try {
      setLoadingMore(true);

      // Create university filters object with all the necessary filters
      const universityFilters = {
        countryIds: countryIds?.length ? countryIds.join(",") : "",
        StudyLevel: filterProp.StudyLevel,
        EntranceExam: filterProp.EntranceExam,
        UniType: filterProp.UniType,
        IntakeYear: filterProp.IntakeYear,
        IntakeMonth: filterProp.IntakeMonth,
        Destination: filterProp.Destination, // Required to filter universities by country
        page: page + 1, // Next page
      };

      // Make API request with all filters
      const response = await axios.get(`${API_BASE_URL}/university`, {
        params: universityFilters,
      });

      // Check if we got data back
      if (response.data.data && response.data.data.length > 0) {
        setUniversities((prevUniversities) => {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(
            prevUniversities.map((uni) => [uni._id, true])
          );
          // Filter out duplicates
          const newUniversities = response.data.data.filter(
            (uni) => !existingIds.has(uni._id)
          );
          return [...prevUniversities, ...newUniversities];
        });
        setPage(page + 1);
        setHasMore(response.data.pagination.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more universities:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, isSearchResultsPath, countryIds, filterProp, page]);

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

    // Use a debounced version of fetchMoreUniversities to prevent multiple rapid calls
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
      fetchMoreUniversities();
    }
  }, [
    fetchTrigger,
    loadingMore,
    hasMore,
    isSearchResultsPath,
    initialFetch,
    fetchMoreUniversities,
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
            <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4 rounded-full">
              {t("viewAll")}
            </button>
          </Link>
        </div>
      </div>

      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={`overflow-x-auto scrollbar-hide whitespace-nowrap`}
      >
        <CollegeCard data={universities} loading={loading} />

        {/* Loading indicator at the bottom - only show if not on searchresults path */}
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
        {!loading && universities?.length === 0 && !isSearchResultsPath && (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-500">
              {t("noUniversitiesFound") ||
                "No univeristies found. Try adjusting your filters."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Univrsiry;
