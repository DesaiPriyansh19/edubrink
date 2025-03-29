"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../svg/DiscountLogo/Index";
import TickMark from "../../../svg/TickMark";
import PrivetUniLogo from "../../../svg/PriUniLogo/Index";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getEmoji } from "../../../libs/countryFlags";
import GradientSpinnerLoader, {
  BouncingBarsLoader,
} from "./Results/ImprovedLoaders";

const isWindows = navigator.userAgent.includes("Windows");

function ExploreTopUniversity({ language }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
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
      `/${language}/applications/${courseId}?category=University&slug=${customURLSlug}`
    );
  };

  const handleLearnMore = (uniname) => {
    navigate(`/${language}/university/${uniname}`);
  };

  const fetchUniversities = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (loading) return;

    try {
      setLoading(true);
      const limit = initialFetch ? 3 : 5;

      console.log(
        "Fetching universities with lastId:",
        lastId,
        "initialFetch:",
        initialFetch
      );

      const url = `https://edu-brink-backend.vercel.app/api/university/getAll/User/Insta?limit=${limit}${
        lastId ? `&lastId=${lastId}` : ""
      }`;

      console.log("Fetching:", url);

      const response = await fetch(url);
      const result = await response.json();

      // Check if we received valid data
      if (!result.data || result.data.length === 0) {
        setHasNextPage(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // Process the new data
      setUniversities((prevUniversities) => {
        if (initialFetch) {
          setInitialFetch(false);
          return result.data;
        } else {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(
            prevUniversities.map((uni) => [uni._id, true])
          );
          // Filter out duplicates
          const newUniversities = result.data.filter(
            (uni) => !existingIds.has(uni._id)
          );
          return [...prevUniversities, ...newUniversities];
        }
      });

      setLastId(result.meta.lastId);
      setHasNextPage(result.meta.hasNextPage);
    } catch (error) {
      console.error("Error fetching universities:", error);
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
      fetchUniversities();
    }

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [fetchUniversities, initialFetch]);

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

    // Use a debounced version of fetchUniversities to prevent multiple rapid calls
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
  }, [loading, hasNextPage, initialFetch, fetchUniversities]);

  // Handle fetch trigger
  useEffect(() => {
    if (fetchTrigger > 0 && !loading && hasNextPage && !initialFetch) {
      fetchUniversities();
    }
  }, [fetchTrigger, loading, hasNextPage, initialFetch, fetchUniversities]);

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
      <BouncingBarsLoader
        type="gradient"
        message={t("Loading Universities...")}
      />
    );
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center max-w-2xl mx-auto font-semibold mb-2">
        {t("explore_university.title")}
      </h1>

      {/* Description */}
      <p className="text-black font-medium max-w-xl mx-auto text-sm text-center mb-4">
        {t("explore_university.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-2">
        {t("explore_university.top_university")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {universities.length > 0 &&
          universities.map((university, idx) => {
            const dynamicFeatures = [
              {
                icon: <DollerRounded />,
                title: language === "ar" ? "الرسوم الدراسية" : "Tuition Fees",
                description: university?.uniTutionFees || "N/A",
              },
              {
                icon: <ScholerShipLogo />,
                title: language === "ar" ? "المنح الدراسية" : "Scholarship",
                description:
                  university.scholarshipAvailability === true
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
                description: university.uniDiscount
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
              className={`relative mt-2 rounded-xl bg-white md:min-w-[300px] mx-auto md:max-w-[30px] lg:max-w-[285px] lg:min-w-[285px] xl:max-w-[350px] xl:min-w-[350px]`}
            >
              <div className="p-3 sm:p-4">
                {university?.uniFeatured && (
                  <div
                    className={`absolute top-0 ${
                      language === "ar" ? "left-0 " : "right-0 "
                    } bg-red-500 text-white rounded-tr-[8px] rounded-bl-[5px] text-[8px] px-2 py-1`}
                  >
                    {t("mostPopular")}
                  </div>
                )}
            
                <div className="flex gap-2 items-center mb-3">
                  <div className="w-11 h-11">
                    <img
                      src={"https://placehold.co/55x55"}
                      alt="Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-[15px] font-semibold flex items-center gap-1">
                      {(() => {
                        const uniName =
                          language === "ar"
                            ? university?.uniName?.ar
                            : university?.uniName?.en || "N/A";
            
                        return uniName.length > 18 ? uniName.slice(0, 18) + "..." : uniName;
                      })()}
                      <span className="w-2.5">
                        <TickMark />
                      </span>
                    </h1>
            
                    <div className="text-[10px] font-medium text-gray-700 flex items-center mt-1">
                      <p>{university?.uniCountry?.countryPhotos?.countryFlag}</p>
                      {language === "ar"
                        ? university?.uniCountry?.countryName?.ar
                        : university?.uniCountry?.countryName?.en || "N/A"}
                    </div>
            
                    <div className="w-full flex items-center mt-1">
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
            
                <div className="flex gap-2 justify-center">
                  {dynamicFeatures.flat().map((feature, index) => (
                    <div key={index} className="flex items-center gap-1 justify-center">
                      <span className="rounded-full w-5.5 h-5.5 flex items-center justify-center border">
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
            
              <div className="grid gap-3 px-2 grid-cols-2 mb-4 mt-2">
                <button
                  onClick={() =>
                    handleApply(university?._id, university?.customURLSlug?.[language])
                  }
                  className="bg-slateBlue text-white text-[10px] py-2 px-3 rounded-full"
                >
                  {t("applyNow")}
                </button>
                <button
                  onClick={() => {
                    handleLearnMore(university?.customURLSlug?.[language]);
                  }}
                  className="text-black text-[10px] px-3 py-2 rounded-full border border-gray-800"
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
            <GradientSpinnerLoader message={t("Loading more universites...")} />
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

      {/* No more universities message */}
      {!hasNextPage && universities.length > 0 && (
        <p className="text-center mt-8 text-gray-500">
          {t("No More Universities")}
        </p>
      )}
    </div>
  );
}

export default ExploreTopUniversity;
