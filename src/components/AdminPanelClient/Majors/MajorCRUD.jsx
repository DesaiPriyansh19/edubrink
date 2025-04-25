"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  GraduationCap,
  Clock,
  Award,
  Loader2,
  Languages,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import axios from "axios";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";

export default function MajorCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [majorToDelete, setMajorToDelete] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Add search mode toggle state
  const [searchMode, setSearchMode] = useState("duration"); // "duration" or "tuition"

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Data states
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalMajors: 0,
    scholarshipMajors: 0,
    featuredMajors: 0,
  });

  // Add these state variables after the other state declarations
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDurationSuggestions, setShowDurationSuggestions] = useState(false);
  const [durationValue, setDurationValue] = useState("");
  const durationUnits = ["Years", "Months", "Weeks"];

  // Add tuition fee suggestions state
  const [showTuitionSuggestions, setShowTuitionSuggestions] = useState(false);
  const [tuitionValue, setTuitionValue] = useState("");
  const [selectedTuitionIndex, setSelectedTuitionIndex] = useState(0);
  const tuitionOptions = [];

  // Add these state variables for keyboard navigation
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  // Add active filters state
  const [activeFilters, setActiveFilters] = useState({
    scholarships: false,
    featured: false,
  });

  // Add a function to toggle filters
  const toggleFilter = (filter) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("eduuserInfo"));
    return userInfo?.token || "";
  };

  // Toggle search mode function
  const toggleSearchMode = () => {
    setSearchMode((prev) => (prev === "duration" ? "tuition" : "duration"));
    setShowDurationSuggestions(false);
    setShowTuitionSuggestions(false);
  };

  // Debounce search input
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Modify the handleSearchInput function to detect partial duration unit matches
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchMode === "duration") {
      // Check if the input contains a number followed by text (potentially a partial duration unit)
      const durationPattern = /(\d+(\.\d+)?)\s+([YyMmWw][a-zA-Z]*)/;
      const durationMatch = value.match(durationPattern);

      if (durationMatch) {
        // Extract the number and partial unit text
        const number = durationMatch[1];
        const partialUnit = durationMatch[3].toLowerCase();

        // Find matching duration units
        const matchingUnits = durationUnits.filter((unit) =>
          unit.toLowerCase().startsWith(partialUnit)
        );

        if (matchingUnits.length > 0) {
          setDurationValue(number);
          setShowDurationSuggestions(true);
          return;
        }
      }

      // Check for just a number (original logic)
      const containsNumber = /\d+(\.\d+)?/.test(value);
      const lastWord = value.split(" ").pop();

      // If the last word is a number (including decimals), show duration suggestions
      if (containsNumber && /^\d+(\.\d+)?$/.test(lastWord)) {
        setDurationValue(lastWord);
        setShowDurationSuggestions(true);
      } else {
        setShowDurationSuggestions(false);
      }
    } else if (searchMode === "tuition") {
      // Check for just a number for tuition
      const containsNumber = /\d+(\.\d+)?/.test(value);
      const lastWord = value.split(" ").pop();

      // If the last word is a number (including decimals), use it directly for tuition search
      if (containsNumber && /^\d+(\.\d+)?$/.test(lastWord)) {
        setTuitionValue(lastWord);
        // Don't show suggestions since we don't have options
        setShowTuitionSuggestions(false);
        // Use the number directly
        setSearchQuery(lastWord);
      }
    }

    // Reset selected index when input changes
    setSelectedSuggestionIndex(0);
    setSelectedTuitionIndex(0);
  };

  // Add a keyboard event handler for the search input
  const handleSearchKeyDown = (e) => {
    if (searchMode === "duration" && showDurationSuggestions) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev < durationUnits.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (
            selectedSuggestionIndex >= 0 &&
            selectedSuggestionIndex < durationUnits.length
          ) {
            selectDurationUnit(durationUnits[selectedSuggestionIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowDurationSuggestions(false);
          break;
      }
    } else if (searchMode === "tuition" && showTuitionSuggestions) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedTuitionIndex((prev) =>
            prev < tuitionOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedTuitionIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (
            selectedTuitionIndex >= 0 &&
            selectedTuitionIndex < tuitionOptions.length
          ) {
            selectTuitionOption(tuitionOptions[selectedTuitionIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowTuitionSuggestions(false);
          break;
      }
    }
  };

  // Add a function to handle selecting a duration unit
  const selectDurationUnit = (unit) => {
    // Check if the search query already contains a number pattern
    const durationPattern = /(\d+(\.\d+)?)\s+([YyMmWw][a-zA-Z]*)?/;
    const match = searchQuery.match(durationPattern);

    if (match) {
      // If there's already a number pattern, replace it with the complete duration
      const newSearchQuery = searchQuery.replace(
        durationPattern,
        `${durationValue} ${unit}`
      );
      setSearchQuery(newSearchQuery);
    } else {
      // If there's no existing pattern, just set the duration as the search query
      setSearchQuery(`${durationValue} ${unit}`);
    }

    setShowDurationSuggestions(false);
  };

  // Add a function to handle selecting a tuition option
  const selectTuitionOption = (option) => {
    let newSearchQuery;

    // Handle different tuition options
    if (option === "Between") {
      // For "Between", prompt for a range
      newSearchQuery = `${tuitionValue} to ? ${option}`;
    } else if (option === "Below" || option === "Above") {
      newSearchQuery = `${tuitionValue} ${option}`;
    } else {
      // For currencies
      newSearchQuery = `${tuitionValue} ${option}`;
    }

    // Check if the search query already contains a tuition pattern
    const tuitionPattern = /(\d+(\.\d+)?)\s+(USD|EUR|GBP|below|above|between)/i;
    const match = searchQuery.match(tuitionPattern);

    if (match) {
      // If there's already a tuition pattern, replace it
      const updatedQuery = searchQuery.replace(tuitionPattern, newSearchQuery);
      setSearchQuery(updatedQuery);
    } else {
      // If there's no existing pattern, just set the tuition as the search query
      setSearchQuery(newSearchQuery);
    }

    setShowTuitionSuggestions(false);
  };

  // Update the fetchMajors function to include duration parameters
  const fetchMajors = async () => {
    setLoading(true);
    try {
      // Build query parameters
      let queryParams = `page=${currentPage}&limit=${itemsPerPage}`;

      // Add search parameter if present
      if (debouncedSearch) {
        if (searchMode === "duration") {
          // Check if the search includes a duration pattern (e.g., "3 Years" or partial like "3 Yea")
          const fullDurationMatch = debouncedSearch.match(
            /(\d+(\.\d+)?)\s+(Years|Months|Weeks)/i
          );
          const partialDurationMatch = debouncedSearch.match(
            /(\d+(\.\d+)?)\s+([YyMmWw][a-zA-Z]*)/i
          );

          if (fullDurationMatch) {
            const [fullMatch, duration, _, unit] = fullDurationMatch;
            // Add duration parameters to the query
            queryParams += `&duration=${duration}&durationUnit=${unit}`;

            // Also include the rest of the search term without the duration part
            const remainingSearch = debouncedSearch
              .replace(fullMatch, "")
              .trim();
            if (remainingSearch) {
              queryParams += `&search=${remainingSearch}`;
            }
          } else if (partialDurationMatch) {
            const [fullMatch, duration, _, partialUnit] = partialDurationMatch;

            // Find the matching duration unit
            const matchingUnit = durationUnits.find((unit) =>
              unit.toLowerCase().startsWith(partialUnit.toLowerCase())
            );

            if (matchingUnit) {
              // Add duration parameters to the query
              queryParams += `&duration=${duration}&durationUnit=${matchingUnit}`;

              // Also include the rest of the search term without the duration part
              const remainingSearch = debouncedSearch
                .replace(fullMatch, "")
                .trim();
              if (remainingSearch) {
                queryParams += `&search=${remainingSearch}`;
              }
            } else {
              // Regular search without duration
              queryParams += `&search=${debouncedSearch}`;
            }
          } else {
            // Regular search without duration
            queryParams += `&search=${debouncedSearch}`;
          }
        } else if (searchMode === "tuition") {
          // Check if the search is just a number
          const numberMatch = debouncedSearch.match(/^(\d+(\.\d+)?)$/);

          if (numberMatch) {
            const [_, amount] = numberMatch;
            // Use the exact parameter name expected by your API
            queryParams += `&majorTuitionFees=${amount}`;
          } else {
            // Regular search without tuition pattern
            queryParams += `&search=${debouncedSearch}`;
          }
        } else {
          // Regular search if no specific mode is active
          queryParams += `&search=${debouncedSearch}`;
        }
      }

      // Add filter parameters
      if (activeFilters.scholarships) queryParams += `&scholarships=true`;
      if (activeFilters.featured) queryParams += `&featured=true`;

      // Add sort parameters
      queryParams += `&sortBy=${sortBy}&sortDirection=${sortDirection}`;

      const token = getToken();
      const response = await axios.get(
        `https://edu-brink-backend.vercel.app/api/majors?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMajors(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalCount);

      // Calculate stats
      const allMajors = response.data.data || [];
      setStats({
        totalMajors: response.data.pagination.totalCount || 0,
        scholarshipMajors: allMajors.filter(
          (m) => m.majorCheckBox?.scholarshipsAvailable
        ).length,
        featuredMajors: allMajors.filter((m) => m.majorCheckBox?.featuredMajor)
          .length,
      });

      setError(null);
    } catch (err) {
      setError("Failed to fetch majors. Please try again.");
      console.error("Error fetching majors:", err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Add a function to handle sorting
  const handleSort = (option) => {
    if (sortBy === option) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when changing sort
  };

  // Update useEffect dependencies to include activeFilters, sortBy, and sortDirection
  useEffect(() => {
    fetchMajors();
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    activeFilters,
    sortBy,
    sortDirection,
  ]);

  // Add this sortMajors function
  const sortMajors = (a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    switch (sortBy) {
      case "name":
        return (
          direction *
          (a.majorName?.[language] || "").localeCompare(
            b.majorName?.[language] || ""
          )
        );
      case "duration":
        // Convert durations to a common unit (days) for comparison
        const getDurationInDays = (major) => {
          const duration = major.duration || 0;
          const unit = major.durationUnits || "Years";

          switch (unit) {
            case "Years":
              return duration * 365;
            case "Months":
              return duration * 30;
            case "Weeks":
              return duration * 7;
            default:
              return duration;
          }
        };

        const durationA = getDurationInDays(a);
        const durationB = getDurationInDays(b);
        return direction * (durationA - durationB);
      case "tuition":
        // Compare by tuition fees
        const tuitionA = a.majorTuitionFees || 0;
        const tuitionB = b.majorTuitionFees || 0;
        return direction * (tuitionA - tuitionB);
      default:
        return 0;
    }
  };

  const handleDelete = (major) => {
    setMajorToDelete(major);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!majorToDelete) return;

    try {
      await axios.delete(
        `https://edu-brink-backend.vercel.app/api/majors/${id}`
      );
      setIsDeletePopupOpen(false);
      setMajorToDelete(null);
      fetchMajors(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting major:", error);
    }
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (loading && majors.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Majors Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/majors/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Major
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  searchMode === "duration"
                    ? "Search majors by name, university, or duration (e.g. 3 for duration suggestions)"
                    : "Search majors by tuition fees (enter a number)"
                }
                value={searchQuery}
                onChange={handleSearchInput}
                onBlur={() => {
                  setTimeout(() => {
                    setShowDurationSuggestions(false);
                    setShowTuitionSuggestions(false);
                  }, 200);
                }}
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
                      searchMode === "tuition"
                        ? "bg-blue-500 text-white"
                        : "bg-transparent text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <CircleDollarSign className="w-3 h-3" />
                    Tuition
                  </button>
                </div>
              </div>

              {/* Duration suggestions dropdown */}
              {showDurationSuggestions && searchMode === "duration" && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 text-xs text-gray-500">
                    Select duration unit:
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {durationUnits.map((unit, index) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => selectDurationUnit(unit)}
                        className={`w-full px-4 py-2 text-left flex items-center ${
                          index === selectedSuggestionIndex
                            ? "bg-blue-50 text-blue-700"
                            : "hover:bg-gray-100"
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
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
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

          {/* Sorting and filtering options */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
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
                <ChevronLeft
                  className={`w-4 h-4 transform rotate-90 ${
                    sortDirection === "desc" ? "rotate-[270deg]" : ""
                  }`}
                />
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
                <ChevronLeft
                  className={`w-4 h-4 transform rotate-90 ${
                    sortDirection === "desc" ? "rotate-[270deg]" : ""
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => handleSort("tuition")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "tuition" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Tuition Fees
              {sortBy === "tuition" && (
                <ChevronLeft
                  className={`w-4 h-4 transform rotate-90 ${
                    sortDirection === "desc" ? "rotate-[270deg]" : ""
                  }`}
                />
              )}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span>Filter:</span>
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
                      e.stopPropagation();
                      toggleFilter("scholarships");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("featured")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.featured
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Featured
                {activeFilters.featured && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-yellow-200 rounded-full hover:bg-yellow-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("featured");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-0">
          {/* Loading Skeleton */}
          {isSearching && (
            <div className="space-y-4 p-4">
              {[...Array(itemsPerPage)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 animate-none"
                >
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
          {!isSearching && majors.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No majors found matching your search.
            </div>
          ) : (
            !isSearching &&
            [...majors].sort(sortMajors).map((major) => (
              <div
                key={major._id}
                className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{major.majorName[language]}</h3>
                    {major.majorCheckBox?.featuredMajor && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {major.majorCheckBox?.scholarshipsAvailable && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Scholarships
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    {major.university && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {major.university.uniName?.[language] || "N/A"}
                      </div>
                    )}
                    {major.duration && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {major.duration} {major.durationUnits}
                      </div>
                    )}

                    {major.majorTuitionFees && (
                      <div className="flex items-center text-sm text-gray-500">
                        <CircleDollarSign className="w-4 h-4 mr-1" />
                        {major.majorTuitionFees}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {major.studyLevel?.map((level) => (
                      <span
                        key={level}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {level}
                      </span>
                    ))}
                    {major.majorLanguages?.map((lang) => (
                      <span
                        key={lang}
                        className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Languages className="w-3 h-3 mr-1" />
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/${language}/admin/majors/${major._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(major)}
                    className="text-red-600 hover:text-red-800 px-3 py-1"
                  >
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              majors
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
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
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
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
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Majors</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalMajors}</p>
          <p className="text-sm text-gray-500 mt-1">Across all faculties</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">With Scholarships</h2>
          </div>
          <p className="text-3xl font-bold">{stats.scholarshipMajors}</p>
          <p className="text-sm text-gray-500 mt-1">
            Majors offering scholarships
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Featured Majors</h2>
          </div>
          <p className="text-3xl font-bold">{stats.featuredMajors}</p>
          <p className="text-sm text-gray-500 mt-1">Highlighted majors</p>
        </div>
      </div>

      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={majorToDelete?.majorName?.en || ""}
        uniId={majorToDelete?._id || ""}
      />
    </div>
  );
}
