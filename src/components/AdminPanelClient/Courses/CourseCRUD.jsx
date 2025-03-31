"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Search,
  BookOpenCheck,
  Users,
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Building2,
  Filter,
  SortAsc,
  CircleDollarSign,
} from "lucide-react"
import { useLanguage } from "../../../../context/LanguageContext"
import axios from "axios"
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup"

export default function CourseCRUD() {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  const [isSearching, setIsSearching] = useState(false)

  // Add search mode toggle state
  const [searchMode, setSearchMode] = useState("duration") // "duration" or "fees"

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Data states
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    scholarshipCourses: 0,
    popularCourses: 0,
  })

  // Add these state variables after the other state declarations
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  // Add these state variables after the other state declarations
  const [activeFilters, setActiveFilters] = useState({
    mostPopular: false,
    scholarships: false,
    discount: false,
  })

  // Add these state variables after the other state declarations
  const [showDurationSuggestions, setShowDurationSuggestions] = useState(false)
  const [durationValue, setDurationValue] = useState("")
  const durationUnits = ["Years", "Months", "Weeks"]

  // Add these state variables for keyboard navigation
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)

  // Toggle search mode function
  const toggleSearchMode = () => {
    setSearchMode((prev) => (prev === "duration" ? "fees" : "duration"))
    setShowDurationSuggestions(false)
  }

  // Debounce search input
  useEffect(() => {
    setIsSearching(true)
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500) // 500ms delay

    return () => clearTimeout(handler)
  }, [searchQuery])

  // Modify the handleSearchInput function to detect partial duration unit matches
  const handleSearchInput = (e) => {
    const value = e.target.value
    setSearchQuery(value)

    if (searchMode === "duration") {
      // Check if the input contains a number followed by text (potentially a partial duration unit)
      const durationPattern = /(\d+(\.\d+)?)\s+([YyMmWw][a-zA-Z]*)/
      const durationMatch = value.match(durationPattern)

      if (durationMatch) {
        // Extract the number and partial unit text
        const number = durationMatch[1]
        const partialUnit = durationMatch[3].toLowerCase()

        // Find matching duration units
        const matchingUnits = durationUnits.filter((unit) => unit.toLowerCase().startsWith(partialUnit))

        if (matchingUnits.length > 0) {
          setDurationValue(number)
          setShowDurationSuggestions(true)
          return
        }
      }

      // Check for just a number (original logic)
      const containsNumber = /\d+(\.\d+)?/.test(value)
      const lastWord = value.split(" ").pop()

      // If the last word is a number (including decimals), show duration suggestions
      if (containsNumber && /^\d+(\.\d+)?$/.test(lastWord)) {
        setDurationValue(lastWord)
        setShowDurationSuggestions(true)
      } else {
        setShowDurationSuggestions(false)
      }
    } else if (searchMode === "fees") {
      // Check for just a number for fees
      const containsNumber = /\d+(\.\d+)?/.test(value)
      const lastWord = value.split(" ").pop()

      // If the last word is a number (including decimals), use it directly for fees search
      if (containsNumber && /^\d+(\.\d+)?$/.test(lastWord)) {
        // Use the number directly
        setSearchQuery(lastWord)
      }
    }

    // Reset selected index when input changes
    setSelectedSuggestionIndex(0)
  }

  // Add a keyboard event handler for the search input
  const handleSearchKeyDown = (e) => {
    if (!showDurationSuggestions || searchMode !== "duration") return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedSuggestionIndex((prev) => (prev < durationUnits.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case "Enter":
        e.preventDefault()
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < durationUnits.length) {
          selectDurationUnit(durationUnits[selectedSuggestionIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setShowDurationSuggestions(false)
        break
    }
  }

  // Add a function to handle selecting a duration unit
  const selectDurationUnit = (unit) => {
    // Check if the search query already contains a number pattern
    const durationPattern = /(\d+(\.\d+)?)\s+([YyMmWw][a-zA-Z]*)?/
    const match = searchQuery.match(durationPattern)

    if (match) {
      // If there's already a number pattern, replace it with the complete duration
      const newSearchQuery = searchQuery.replace(durationPattern, `${durationValue} ${unit}`)
      setSearchQuery(newSearchQuery)
    } else {
      // If there's no existing pattern, just set the duration as the search query
      setSearchQuery(`${durationValue} ${unit}`)
    }

    setShowDurationSuggestions(false)
  }

  // Modify the fetchCourses function to include the filter parameters
  const fetchCourses = async () => {
    setLoading(true)
    try {
      // Build query parameters including filters
      let queryParams = `page=${currentPage}&limit=${itemsPerPage}`
      if (debouncedSearch) {
        if (searchMode === "duration") {
          // Check if the search includes a duration pattern (e.g., "3 Years" or partial like "3 Yea")
          const fullDurationMatch = debouncedSearch.match(/(\d+(\.\d+)?)\s+(Years|Months|Weeks)/i)
          const partialDurationMatch = debouncedSearch.match(/(\d+(\.\d+)?)\s+([YyMmWw][a-zA-Z]*)/i)

          if (fullDurationMatch) {
            const [fullMatch, duration, _, unit] = fullDurationMatch
            // Add duration parameters to the query
            queryParams += `&duration=${duration}&durationUnit=${unit}`

            // Also include the rest of the search term without the duration part
            const remainingSearch = debouncedSearch.replace(fullMatch, "").trim()
            if (remainingSearch) {
              queryParams += `&search=${remainingSearch}`
            }
          } else if (partialDurationMatch) {
            const [fullMatch, duration, _, partialUnit] = partialDurationMatch

            // Find the matching duration unit
            const matchingUnit = durationUnits.find((unit) => unit.toLowerCase().startsWith(partialUnit.toLowerCase()))

            if (matchingUnit) {
              // Add duration parameters to the query
              queryParams += `&duration=${duration}&durationUnit=${matchingUnit}`

              // Also include the rest of the search term without the duration part
              const remainingSearch = debouncedSearch.replace(fullMatch, "").trim()
              if (remainingSearch) {
                queryParams += `&search=${remainingSearch}`
              }
            } else {
              // Regular search without duration
              queryParams += `&search=${debouncedSearch}`
            }
          } else {
            // Regular search without duration
            queryParams += `&search=${debouncedSearch}`
          }
        } else if (searchMode === "fees") {
          // Check if the search is just a number
          const numberMatch = debouncedSearch.match(/^(\d+(\.\d+)?)$/)

          if (numberMatch) {
            const [_, amount] = numberMatch
            // Use the exact parameter name expected by your API
            queryParams += `&courseFees=${amount}`
          } else {
            // Regular search without fees pattern
            queryParams += `&search=${debouncedSearch}`
          }
        } else {
          // Regular search if no specific mode is active
          queryParams += `&search=${debouncedSearch}`
        }
      }

      if (activeFilters.mostPopular) queryParams += `&mostPopular=true`
      if (activeFilters.scholarships) queryParams += `&scholarships=true`
      if (activeFilters.discount) queryParams += `&discount=true`

      const response = await axios.get(`https://edu-brink-backend.vercel.app/api/course?${queryParams}`)

      setCourses(response.data.data || [])
      setTotalPages(response.data.pagination?.totalPages || 1)
      setTotalItems(response.data.pagination?.totalCount || 0)

      // Calculate stats
      const allCourses = response.data.data || []
      setStats({
        totalCourses: response.data.pagination?.totalCount || 0,
        scholarshipCourses: allCourses.filter((c) => c.scholarshipsAvailable).length,
        popularCourses: allCourses.filter((c) => c.MostPopular).length,
      })

      setError(null)
    } catch (err) {
      setError("Failed to fetch courses. Please try again.")
      console.error("Error fetching courses:", err)
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  // Add a function to toggle filters
  const toggleFilter = (filter) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
    setCurrentPage(1) // Reset to first page when changing filters
  }

  // Update useEffect to include activeFilters in the dependency array
  useEffect(() => {
    fetchCourses()
  }, [currentPage, itemsPerPage, debouncedSearch, activeFilters])

  const handleDelete = (course) => {
    setCourseToDelete(course)
    setIsDeletePopupOpen(true)
  }

  const confirmDelete = async (id) => {
    if (!courseToDelete) return

    try {
      await axios.delete(`https://edu-brink-backend.vercel.app/api/course/${id}`)
      setIsDeletePopupOpen(false)
      setCourseToDelete(null)
      fetchCourses() // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always show last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  // Add this function before the return statement
  const handleSort = (option) => {
    if (sortBy === option) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(option)
      setSortDirection("asc")
    }
  }

  // Add this function before the return statement
  const sortCourses = (a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1

    switch (sortBy) {
      case "name":
        return direction * (a.CourseName.en || "").localeCompare(b.CourseName.en || "")
      case "university":
        return direction * (a.university?.uniName?.en || "" || "").localeCompare(b.university?.uniName?.en || "" || "")
      case "duration":
        // Convert durations to a common unit (days) for comparison
        const getDurationInDays = (course) => {
          const duration = course.CourseDuration || 0
          const unit = course.CourseDurationUnits || "Years"

          switch (unit) {
            case "Years":
              return duration * 365
            case "Months":
              return duration * 30
            case "Weeks":
              return duration * 7
            default:
              return duration
          }
        }

        const durationA = getDurationInDays(a)
        const durationB = getDurationInDays(b)
        return direction * (durationA - durationB)
      case "fees":
        // Compare by course fees
        const feesA = a.CourseFees || 0
        const feesB = b.CourseFees || 0
        return direction * (feesA - feesB)
      default:
        return 0
    }
  }

  // Modify the courses mapping to use the sorted courses
  // Replace the courses.map() with sortedCourses.map()
  const sortedCourses = [...courses].sort(sortCourses)

  // if (loading && courses.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/courses/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex gap-4 items-center">
            {/* Replace the search input in the return section with this enhanced version */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  searchMode === "duration"
                    ? "Search courses by name, university or duration (e.g. 3 for duration suggestions)"
                    : "Search courses by fees (enter a number)"
                }
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />

              {/* Search mode toggle */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    onClick={toggleSearchMode}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${
                      searchMode === "duration"
                        ? "bg-blue-500 text-white"
                        : "bg-transparent text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    Duration
                  </button>
                  <button
                    onClick={toggleSearchMode}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${
                      searchMode === "fees"
                        ? "bg-blue-500 text-white"
                        : "bg-transparent text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <CircleDollarSign className="w-3 h-3" />
                    Fees
                  </button>
                </div>
              </div>

              {/* Duration suggestions dropdown */}
              {showDurationSuggestions && searchMode === "duration" && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 text-xs text-gray-500">Select duration unit:</div>
                  <div className="max-h-60 overflow-y-auto">
                    {durationUnits.map((unit, index) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => selectDurationUnit(unit)}
                        className={`w-full px-4 py-2 text-left flex items-center ${
                          index === selectedSuggestionIndex ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span>
                          {durationValue} {unit}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1) // Reset to first page when changing items per page
                }}
                className="border rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              >
                {[5, 10, 20, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Add the sorting UI in the filters section after the search input */}
          {/* Inside the div with className="p-4 border-b", after the first div with the search input and items per page selector */}
          {/* Add this code: */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Sort by:
            </span>
            <button
              onClick={() => handleSort("name")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "name" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Name
              {sortBy === "name" && (
                <SortAsc className={`w-4 h-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
              )}
            </button>
            <button
              onClick={() => handleSort("university")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "university" ? "text-blue-600 font-medium" : ""
              }`}
            >
              University
              {sortBy === "university" && (
                <SortAsc className={`w-4 h-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
              )}
            </button>
            <button
              onClick={() => handleSort("duration")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "duration" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Duration
              {sortBy === "duration" && (
                <SortAsc className={`w-4 h-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
              )}
            </button>
            <button
              onClick={() => handleSort("fees")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "fees" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Fees
              {sortBy === "fees" && (
                <SortAsc className={`w-4 h-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
              )}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span>Filter:</span>
              <button
                onClick={() => toggleFilter("mostPopular")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.mostPopular
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Most Popular
                {activeFilters.mostPopular && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-yellow-200 rounded-full hover:bg-yellow-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFilter("mostPopular")
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("scholarships")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.scholarships
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Scholarships
                {activeFilters.scholarships && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-green-200 rounded-full hover:bg-green-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFilter("scholarships")
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("discount")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.discount ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Discount
                {activeFilters.discount && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-blue-200 rounded-full hover:bg-blue-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFilter("discount")
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-0">
            {/* Loading Skeleton */}
            {isSearching && (
              <div className="space-y-4 p-4">
                {[...Array(itemsPerPage)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 animate-none">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="flex gap-2 mt-2">
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-x-2 flex">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actual Content */}
            {!isSearching && courses.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No courses found matching your search.</div>
            ) : (
              !isSearching &&
              sortedCourses.map((course) => (
                <div key={course._id} className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{course.CourseName[language]}</h3>
                      {course.MostPopular && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Most Popular
                        </span>
                      )}
                      {course.scholarshipsAvailable && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Scholarships</span>
                      )}
                      {course.DiscountAvailable && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Discount</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      {course.university && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Building2 className="w-4 h-4 mr-1" />
                          {course.university.uniName?.[language] || "N/A"}
                        </div>
                      )}
                      {course.CourseDuration && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.CourseDuration} {course.CourseDurationUnits}
                        </div>
                      )}

                      {course.CourseFees && (
                        <div className="flex items-center text-sm text-gray-500">
                          <CircleDollarSign className="w-4 h-4 mr-1" />
                          {course.CourseFees}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {course.StudyLevel?.map((level) => (
                        <span key={level} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/${language}/admin/courses/${course._id}`)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(course)} className="text-red-600 hover:text-red-800 px-3 py-1">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && !isSearching && totalPages > 1 && (
            <div className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} courses
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && goToPage(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : page === "..."
                          ? "text-gray-500 cursor-default"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpenCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Total Courses</h2>
            </div>
            <p className="text-3xl font-bold">{stats.totalCourses}</p>
            <p className="text-sm text-gray-500 mt-1">Across all universities</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">With Scholarships</h2>
            </div>
            <p className="text-3xl font-bold">{stats.scholarshipCourses}</p>
            <p className="text-sm text-gray-500 mt-1">Courses offering scholarships</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bookmark className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Most Popular</h2>
            </div>
            <p className="text-3xl font-bold">{stats.popularCourses}</p>
            <p className="text-sm text-gray-500 mt-1">Popular courses</p>
          </div>
        </div>

        <DeleteConfirmationPopup
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={() => confirmDelete(courseToDelete?._id)}
          uniName={courseToDelete?.CourseName?.en || ""}
          uniId={courseToDelete?._id || ""}
        />
      </div>
    </div>
  )
}

