"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";
import LanguageLogo from "../../../svg/LanguageLogo";
import Master from "../../../svg/AboutStudent/Master";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GradientSpinnerLoader, {
  BouncingBarsLoader,
} from "./Results/ImprovedLoaders";
import { BookOpenText } from "lucide-react";

// Create a cache object outside the component to persist between route changes
const majorCache = {
  data: [],
  lastId: null,
  hasNextPage: true,
  language: null,
};

function ExploreTopMajor({ language }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [majors, setMajors] = useState(() => majorCache.data);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(
    majorCache.data.length === 0
  );
  const [lastId, setLastId] = useState(majorCache.lastId);
  const [hasNextPage, setHasNextPage] = useState(majorCache.hasNextPage);
  const [initialFetch, setInitialFetch] = useState(
    majorCache.data.length === 0
  );
  const observer = useRef(null);
  const loadingRef = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(0); // Used to trigger fetches

  // Check if language has changed, if so, reset cache
  useEffect(() => {
    if (majorCache.language && majorCache.language !== language) {
      // Language changed, reset cache
      majorCache.data = [];
      majorCache.lastId = null;
      majorCache.hasNextPage = true;

      setMajors([]);
      setLastId(null);
      setHasNextPage(true);
      setInitialFetch(true);
      setInitialLoading(true);
    }

    majorCache.language = language;
  }, [language]);

  const handleApply = (majorId, customURLSlug) => {
    navigate(
      `/${language}/applications/${majorId}?category=major&slug=${customURLSlug}`
    );
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

  const formatDeadline = (deadline) => {
    if (!deadline || !Array.isArray(deadline) || deadline.length === 0)
      return "N/A";

    const shortMonths = deadline.map((month) => month.slice(0, 3));

    if (shortMonths.length === 1) return shortMonths[0];

    return `${shortMonths[0]} +${shortMonths.length - 1}`;
  };

  const handleLearnMore = (major) => {
    navigate(`/${language}/majors/${major}`);
  };

  const fetchMajors = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (loading) return;

    try {
      setLoading(true);
      // Use a smaller limit for initial load (3 items)
      const limit = initialFetch ? 3 : 5;

      const response = await fetch(
        `https://edu-brink-backend.vercel.app/api/majors/getAll/User/Insta?limit=${limit}${
          lastId ? `&lastId=${lastId}` : ""
        }`
      );

      const result = await response.json();

      // Check if we received valid data
      if (!result.data || result.data.length === 0) {
        setHasNextPage(false);
        majorCache.hasNextPage = false;
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // Process the new data
      setMajors((prevMajors) => {
        let newMajorsList;
        if (initialFetch) {
          setInitialFetch(false);
          newMajorsList = result.data;
        } else {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(
            prevMajors.map((major) => [major._id, true])
          );
          // Filter out duplicates
          const newMajors = result.data.filter(
            (major) => !existingIds.has(major._id)
          );
          newMajorsList = [...prevMajors, ...newMajors];
        }

        // Update cache
        majorCache.data = newMajorsList;
        return newMajorsList;
      });

      setLastId(result.meta.lastId);
      majorCache.lastId = result.meta.lastId;

      setHasNextPage(result.meta.hasNextPage);
      majorCache.hasNextPage = result.meta.hasNextPage;
    } catch (error) {
      console.error("Error fetching majors:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [lastId, initialFetch, loading]);

  // Initial data fetch - only if cache is empty
  useEffect(() => {
    // Only fetch initial data once when component mounts and cache is empty
    if (initialFetch && majorCache.data.length === 0) {
      setInitialLoading(true);
      fetchMajors();
    }

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [fetchMajors, initialFetch]);

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

    // Use a debounced version of fetchMajors to prevent multiple rapid calls
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
  }, [loading, hasNextPage, initialFetch, fetchMajors]);

  // Handle fetch trigger
  useEffect(() => {
    if (fetchTrigger > 0 && !loading && hasNextPage && !initialFetch) {
      fetchMajors();
    }
  }, [fetchTrigger, loading, hasNextPage, initialFetch, fetchMajors]);

  const formatLanguages = (languages) => {
    if (!languages || !Array.isArray(languages) || languages.length === 0)
      return "English";
    if (languages.length === 1) return languages[0];

    // Show first language + count of additional languages
    return `${languages[0]} +${languages.length - 1}`;
  };

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center max-w-2xl mx-auto font-semibold mb-2">
        {t("explore_majors.title")}
      </h1>

      {/* Description */}
      <p className="text-black font-medium max-w-md mx-auto text-sm text-center mb-24">
        {t("explore_majors.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-11">
        {t("explore_majors.popular_majors")}
      </h3>

      {initialLoading ? (
        // Show skeletons while loading
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="relative mt-2 px-4 rounded-xl shadow-sm bg-white "
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
          ))}
        </div>
      ) : (
        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          className="grid grid-cols-1 sm:grid-cols-2 mx-auto lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4 max-w-[1120px] xl:max-w-[1500px]"
        >
          {majors.length > 0 &&
            majors.map((major, index) => {
              const dynamicFeatures = [
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "رسوم التخصص" : "Tuition Fees",
                  description: major?.majorTuitionFees || "N/A",
                },
                {
                  icon: <LanguageLogo />,
                  title: language === "ar" ? "اللغة" : "Language",
                  description: formatLanguages(
                    Array.isArray(major?.majorLanguages)
                      ? major?.majorLanguages
                      : []
                  ),
                },
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "الموعد النهائي" : "Deadline",
                  description: formatDeadline(major?.majorIntakeMonth),
                },
              ];

              return (
                <div
                  key={index}
                  className="relative mt-2 rounded-xl shadow-sm bg-white"
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
                            major?.university?.uniSymbol ||
                            "https://placehold.co/80x80" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt="College Logo"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div className="pl-3">
                      <div className="min-h-[2em] flex items-center">
  <h1 className="text-[16px] flex  xl:hidden font-semibold leading-tight">
    {(() => {
      const majorName = 
        language === "ar" 
          ? major?.majorName?.ar 
          : major?.majorName?.en || "N/A";

      // Handle N/A case
      if (majorName === "N/A") return majorName;

      // If longer than 34 characters
      if (majorName.length > 34) {
        const firstPart = majorName.slice(0, 17);
        const secondPart = majorName.slice(17, 34);
        return (
          <>
            {firstPart}-
            <br />
            {secondPart}...
          </>
        );
      }
      // If between 17-34 characters (original behavior)
      else if (majorName.length > 17) {
        return majorName.slice(0, 17) + "...";
      }
      // If less than 17 characters
      else {
        return (
          <>
            {majorName}
            <span className="inline-block opacity-0 w-0 h-[1em]">.</span>
          </>
        );
      }
    })()}
  </h1>
  <h1 className="text-[16px] hidden xl:flex font-semibold leading-tight">
    {(() => {
      const majorName = 
        language === "ar" 
          ? major?.majorName?.ar 
          : major?.majorName?.en || "N/A";

      // Handle N/A case
      if (majorName === "N/A") return majorName;

      // If longer than 34 characters
      if (majorName.length > 34) {
        const firstPart = majorName.slice(0, 30);
        const secondPart = majorName.slice(30, 34);
        return (
          <>
            {firstPart}
            
            {secondPart}...
          </>
        );
      }
      // If between 30-34 characters (original behavior)
      else if (majorName.length > 30) {
        return majorName.slice(0, 30) + "...";
      }
      // If less than 17 characters
      else {
        return (
          <>
            {majorName}
            <span className="inline-block opacity-0 w-0 h-[1em]">.</span>
          </>
        );
      }
    })()}
  </h1>
</div>
                        <p className="text-[10px] font-medium text-black flex items-center mt-1">
                          {language === "ar"
                            ? major?.university?.uniName?.ar
                            : major?.university?.uniName?.en || "N/A"}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="flex items-center gap-1 rounded-full mr-1">
                            <BookOpenText className="w-3.5 font-semibold h-3.5" />
                            <span className="text-xs">
                              {formatStudyLevel(major.studyLevel)}
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
                          <div className="ml-2">
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
                          major?._id,
                          major?.customURLSlug?.[language]
                        )
                      }
                      className="bg-slateBlue text-white text-[10px] py-2 px-2 rounded-full"
                    >
                      {t("applyNow")}
                    </button>
                    <button
                      onClick={() => {
                        handleLearnMore(major?.customURLSlug?.[language]);
                      }}
                      className="text-black text-[10px] px-2 py-2 hover:font-medium rounded-full border border-gray-700"
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
              <GradientSpinnerLoader
                message={
                  language === "ar"
                    ? "جاري تحميل المزيد من التخصصات..."
                    : "Loading more majors..."
                }
              />
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
      )}
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

      {/* No more majors message */}
      {!hasNextPage && majors.length > 0 && (
        <p className="text-center mt-8 text-gray-500">{t("NoMoreMajors")}</p>
      )}
    </div>
  );
}

export default ExploreTopMajor;
