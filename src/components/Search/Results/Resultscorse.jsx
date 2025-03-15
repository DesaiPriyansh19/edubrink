"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import DollerRounded from "../../../../svg/DollerRounded/Index"
import Master from "../../../../svg/AboutStudent/Master"
import LanguageLogo from "../../../../svg/LanguageLogo"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useLanguage } from "../../../../context/LanguageContext"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { useSearch } from "../../../../context/SearchContext"

function ResultsCorses({ loading: initialLoading, filteredData: initialData, uniIds }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname
  const { filterProp } = useSearch()

  // State for infinite scrolling
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(initialLoading)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialFetch, setInitialFetch] = useState(true)
  const loaderRef = useRef(null)
  const observer = useRef(null)
  const [fetchTrigger, setFetchTrigger] = useState(0)

  // Keep track of previous filter state to detect changes
  const filterPropRef = useRef(filterProp)
  const initialDataRef = useRef(null)

  // API base URL
  const API_BASE_URL = "https://edu-brink-backend.vercel.app/api/search"

  // Check if we're on the searchresults path that should disable infinite scroll
  const isSearchResultsPath = path === `/${language}/searchresults`

  useEffect(() => {
    const isFilterChanged = JSON.stringify(filterPropRef.current) !== JSON.stringify(filterProp)

    // Always update courses when initialData changes, even if it's empty
    if (initialData !== initialDataRef.current) {
      initialDataRef.current = initialData
      setCourses(initialData || [])
      setPage(1)
      setHasMore((initialData || []).length > 0)
      setInitialFetch(false) // Mark initial fetch as complete when we get data
    }

    if (isFilterChanged) {
      filterPropRef.current = filterProp
      setPage(1)
      setHasMore(true)
      setInitialFetch(true) // Reset initial fetch when filters change
    }
  }, [filterProp, initialData])

  useEffect(() => {
    // Set loading state based on initialLoading
    setLoading(initialLoading)
  }, [initialLoading])

  // Function to fetch more courses - use useCallback to maintain reference
  const fetchMoreCourses = useCallback(async () => {
    if (!hasMore || loadingMore || isSearchResultsPath) return

    try {
      setLoadingMore(true)

      // Create course filters object with all the necessary filters
      const courseFilters = {
        universityIds: uniIds?.length ? uniIds.join(",") : "",
        ModeOfStudy: filterProp.ModeOfStudy,
        CourseDuration: filterProp.CourseDuration,
        minBudget: filterProp.minBudget,
        maxBudget: filterProp.maxBudget,
        searchQuery: filterProp.searchQuery ? JSON.stringify(filterProp.searchQuery) : undefined,
        page: page + 1, // Next page
      }

      // Make API request with all filters
      const response = await axios.get(`${API_BASE_URL}/course`, {
        params: courseFilters,
      })

      // Check if we got data back
      if (response.data.data && response.data.data.length > 0) {
        setCourses((prevCourses) => {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(prevCourses.map((course) => [course._id, true]))
          // Filter out duplicates
          const newCourses = response.data.data.filter((course) => !existingIds.has(course._id))
          return [...prevCourses, ...newCourses]
        })
        setPage(page + 1)
        setHasMore(response.data.pagination.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error fetching more courses:", error)
    } finally {
      setLoadingMore(false)
    }
  }, [hasMore, loadingMore, isSearchResultsPath, uniIds, filterProp, page])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if we're on the searchresults path, loading, or there's no more data
    if (isSearchResultsPath || !hasMore || initialFetch) {
      return
    }

    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect()
    }

    // Use a debounced version of fetchMoreCourses to prevent multiple rapid calls
    let timeoutId = null
    const debouncedFetch = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (!loadingMore && hasMore && !isSearchResultsPath) {
          setFetchTrigger((prev) => prev + 1)
        }
      }, 300)
    }

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        debouncedFetch()
      }
    }

    observer.current = new IntersectionObserver(callback, {
      rootMargin: "200px",
      threshold: 0.1,
    })

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [hasMore, loadingMore, isSearchResultsPath, initialFetch])

  // Handle fetch trigger
  useEffect(() => {
    if (fetchTrigger > 0 && !loadingMore && hasMore && !isSearchResultsPath && !initialFetch) {
      fetchMoreCourses()
    }
  }, [fetchTrigger, loadingMore, hasMore, isSearchResultsPath, initialFetch, fetchMoreCourses])

  // Force check for scroll position after initial data load
  useEffect(() => {
    if (!initialFetch && !isSearchResultsPath && hasMore && !loadingMore) {
      const timeoutId = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight

        // If the content doesn't fill the viewport, trigger a fetch
        if (scrollHeight <= clientHeight) {
          setFetchTrigger((prev) => prev + 1)
        }
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [initialFetch, isSearchResultsPath, hasMore, loadingMore])

  // Reset component state when unmounting
  useEffect(() => {
    return () => {
      // Clean up everything when component unmounts
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  const handleNavigate = (course) => {
    navigate(`/${language}/courses/${course}`)
  }

  return (
    <>
      <div className="max-w-full mx-auto">
        <div dir={language === "ar" ? "rtl" : "ltr"} className="flex items-center justify-between mt-6 mb-4">
          <div className="">
            <h1 className="text-2xl sm:text-4xl font-semibold">📚 {t("ourCourseSection.title")}</h1>
            <p className="text-sm mt-3 max-w-xl font-medium">{t("ourCourseSection.description")}</p>
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
              <div key={index} className="relative mt-3 border rounded-xl shadow-md bg-white ">
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
                      <div key={i} className="flex items-center justify-center gap-2">
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
                    ? new Date(university?.DeadLine).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A",
                },
              ]

              return (
                <div
                  key={index}
                  className={`relative mt-3 border rounded-xl shadow-md bg-white ${
                    !isSearchResultsPath ? "min-w-[300px]" : ""
                  }`}
                >
                  <div
                    className={`px-3 ${
                      language === "ar" ? "pl-3 sm:pl-8 md:pl-9  lg:pl-16" : "pr-3 sm:pr-8 md:pr-9  lg:pr-16"
                    }  p-4`}
                  >
                    <div className="flex gap-2 sm:gap-3 items-center mt-6 sm:mt-2 mb-6 md:mb-3">
                      <div className="w-20 h-20">
                        <img
                          src={university.uniSymbol || "https://placehold.co/80x80"}
                          alt="College Logo"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold flex items-center">
                          {language === "ar" ? university?.CourseName?.ar : university?.CourseName?.en || "N/A"}
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
                        <div key={index} className="flex items-center justify-center">
                          <span className="rounded-full w-10 flex items-center justify-center h-10 border">
                            {feature.icon}
                          </span>
                          <div className="ml-2">
                            <p className="text-xs whitespace-nowrap font-medium">{feature.title}</p>
                            <p className="text-xs font-medium whitespace-nowrap">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-6 px-3 grid-cols-2 mb-4 mt-4">
                    <button
                      // onClick={() => handleApplyClick(university._id, university.countryName)}
                      className="bg-slateBlue text-white text-sm py-2 px-3 rounded-full"
                    >
                      {t("applyNow")}
                    </button>
                    <button
                      onClick={() => {
                        handleNavigate(university.CourseName.en)
                      }}
                      className="text-black text-sm px-3 py-2 hover:font-medium rounded-full border-2 border-gray-800"
                    >
                      {t("learnMore")}
                    </button>
                  </div>
                </div>
              )
            })}

        {/* Loading indicator at the bottom - only show if not on searchresults path */}
        {hasMore && courses?.length > 0 && !isSearchResultsPath && (
          <div ref={loaderRef} className="w-full flex justify-center py-4 mt-2" style={{ minHeight: "80px" }}>
            <div
              className={`animate-spin rounded-full h-8 w-8 border-b-2 border-primary ${loadingMore ? "opacity-100" : "opacity-50"}`}
            ></div>
          </div>
        )}

        {/* No results message */}
        {!loading && courses?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-500">
              {t("noCoursesFound") || "No courses found. Try adjusting your filters."}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default ResultsCorses

