"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  Star,
  Calendar,
  Tag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import axios from "axios";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";

export default function ArticlesCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Sorting states
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Remove the date suggestions states and functions
  // Remove these state variables
  const [showDateSuggestions, setShowDateSuggestions] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const dateFormats = ["Today", "This Week", "This Month", "This Year"];

  // Add these state variables after the other state declarations
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);

  // Articles data state
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    featuredArticles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Replace the handleSearchInput function with a simpler version
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Remove the handleSearchKeyDown function and the getDateRangeForFormat function

  // Add active filters state
  const [activeFilters, setActiveFilters] = useState({
    featured: false,
    published: false,
    draft: false,
  });

  // Add a function to toggle filters
  const toggleFilter = (filter) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Update the fetchArticles function to include date range parameters
  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Build query parameters - remove sortBy and sortDirection
      let queryParams = `admin=true&limit=${itemsPerPage}&page=${currentPage}&fields=blogTitle,blogSubtitle,blogPhoto,blogAuthor,blogCategory,featuredBlog,blogCountry.countryName,blogAdded,publishImmediately,blogTags`;

      // Add search parameter if present
      if (debouncedSearch) {
        queryParams += `&search=${debouncedSearch}`;
      }

      // Add date range parameters if both dates are selected
      if (dateRange.startDate && dateRange.endDate) {
        queryParams += `&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      }

      // Add filter parameters
      if (activeFilters.featured) queryParams += `&featured=true`;
      if (activeFilters.published) queryParams += `&published=true`;
      if (activeFilters.draft) queryParams += `&draft=true`;

      // Remove sort parameters from API request - we'll sort client-side

      const response = await axios.get(
        `https://edu-brink-backend.vercel.appapi/blog/?${queryParams}`
      );

      setArticles(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalBlogs);

      if (response.data.stats) {
        setStats({
          totalArticles: response.data.stats.totalArticles || 0,
          publishedArticles: response.data.stats.publishedArticles || 0,
          featuredArticles: response.data.stats.featuredArticles || 0,
        });
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch articles. Please try again.");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Add a function to handle date search
  const handleDateSearch = () => {
    // Validate dates
    if (!dateRange.startDate || !dateRange.endDate) {
      setError("Please select both start and end dates");
      return;
    }

    // Check if end date is after start date
    if (new Date(dateRange.endDate) < new Date(dateRange.startDate)) {
      setError("End date must be after start date");
      return;
    }

    setIsDateFilterActive(true);
    setCurrentPage(1); // Reset to first page
    fetchArticles();
  };

  // Add a function to clear date filter
  const clearDateFilter = () => {
    setDateRange({ startDate: "", endDate: "" });
    setIsDateFilterActive(false);
    setCurrentPage(1); // Reset to first page
    fetchArticles();
  };

  // Add this sortArticles function after the fetchArticles function
  const sortArticles = (a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    switch (sortBy) {
      case "title":
        return (
          direction *
          (a.blogTitle?.[language] || "").localeCompare(
            b.blogTitle?.[language] || ""
          )
        );
      case "date":
        // Compare dates
        const dateA = new Date(a.blogAdded || 0);
        const dateB = new Date(b.blogAdded || 0);
        return direction * (dateA - dateB);
      case "category":
        return (
          direction * (a.blogCategory || "").localeCompare(b.blogCategory || "")
        );
      case "author":
        return (
          direction * (a.blogAuthor || "").localeCompare(b.blogAuthor || "")
        );
      default:
        return 0;
    }
  };

  // Add a date formatter function
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";

    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return isoDate; // Return original if invalid

      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error) {
      return isoDate; // Return original on error
    }
  };

  // Add this function after the formatDate function to parse search dates
  const parseSearchDate = (searchQuery) => {
    // Check if the search query contains a date pattern
    const datePatterns = [
      // Format: "18 March" or "18 March 2025"
      /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+(\d{4}))?/i,
      // Format: "March 18" or "March 18, 2025"
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:[,\s]+(\d{4}))?/i,
      // Format: "18/03" or "18/03/2025" or "18-03" or "18-03-2025"
      /(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?/,
    ];

    for (const pattern of datePatterns) {
      const match = searchQuery.match(pattern);
      if (match) {
        let day, month, year;

        // Default to current year if not specified
        const currentYear = new Date().getFullYear();

        if (pattern === datePatterns[0]) {
          // "18 March 2025" format
          day = Number.parseInt(match[1], 10);
          month = getMonthNumber(match[2]);
          year = match[3] ? Number.parseInt(match[3], 10) : currentYear;
        } else if (pattern === datePatterns[1]) {
          // "March 18, 2025" format
          month = getMonthNumber(match[1]);
          day = Number.parseInt(match[2], 10);
          year = match[3] ? Number.parseInt(match[3], 10) : currentYear;
        } else {
          // "18/03/2025" format
          day = Number.parseInt(match[1], 10);
          month = Number.parseInt(match[2], 10) - 1; // JavaScript months are 0-indexed
          year = match[3] ? Number.parseInt(match[3], 10) : currentYear;
        }

        // Create a date at noon to avoid timezone issues
        return new Date(year, month, day, 12, 0, 0);
      }
    }

    return null;
  };

  // Helper function to convert month name to number (0-indexed for JavaScript Date)
  const getMonthNumber = (monthName) => {
    const months = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };
    return months[monthName.toLowerCase()];
  };

  // Update the sortArticles function to handle date search
  // Add a function to filter articles by date search
  const filterArticlesByDate = (articles, searchQuery) => {
    // If no search query, return all articles
    if (!searchQuery) return articles;

    // Try to parse the search query as a date
    const searchDate = parseSearchDate(searchQuery);

    // If search query doesn't contain a date, return all articles
    // (the server-side search will handle non-date searches)
    if (!searchDate) return articles;

    // Filter articles by the parsed date
    return articles.filter((article) => {
      if (!article.blogAdded) return false;

      // Parse the ISO date string from the backend
      const articleDate = new Date(article.blogAdded);

      // Compare only year, month, and day components (ignoring time)
      return (
        articleDate.getFullYear() === searchDate.getFullYear() &&
        articleDate.getMonth() === searchDate.getMonth() &&
        articleDate.getDate() === searchDate.getDate()
      );
    });
  };

  // Add a debug function to help troubleshoot date comparisons
  const debugDateComparison = (articleDate, searchDate) => {
    console.log(
      "Article Date:",
      articleDate,
      "Year:",
      articleDate.getFullYear(),
      "Month:",
      articleDate.getMonth(),
      "Day:",
      articleDate.getDate()
    );
    console.log(
      "Search Date:",
      searchDate,
      "Year:",
      searchDate.getFullYear(),
      "Month:",
      searchDate.getMonth(),
      "Day:",
      searchDate.getDate()
    );
  };

  // Update useEffect dependencies to include isDateFilterActive
  useEffect(() => {
    if (!isDateFilterActive) {
      fetchArticles();
    }
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    activeFilters,
    isDateFilterActive,
  ]);

  // Update useEffect dependencies to include activeFilters
  useEffect(() => {
    fetchArticles();
  }, [currentPage, itemsPerPage, debouncedSearch, activeFilters]); // Remove sortBy and sortDirection

  const handleDelete = (article) => {
    setArticleToDelete(article);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!articleToDelete) return;

    try {
      await axios.delete(`https://edu-brink-backend.vercel.app/api/blog/${id}`);
      setIsDeletePopupOpen(false);
      setArticleToDelete(null);
      fetchArticles(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const togglePublished = async (article) => {
    try {
      await axios.put(
        `https://edu-brink-backend.vercel.app/api/blog/${article._id}`,
        {
          publishImmediately: !article.publishImmediately,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      fetchArticles(); // Refresh data after update
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  // Handle sorting
  const handleSort = (option) => {
    if (sortBy === option) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(option);
      setSortDirection("desc"); // Default to descending for new sort options
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

  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/articles/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          {/* Replace the search input section with this updated version that includes date range */}
          <div className="flex flex-col gap-4">
            {/* Search row */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles by title, category, author..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
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
                  {[10, 20, 30, 40, 50].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date filter row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex flex-col items-start ">
                    <label
                      htmlFor="start-date"
                      className="text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        id="start-date"
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="pl-3 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Start Date"
                      />
                      {dateRange.startDate && (
                        <button
                          onClick={() =>
                            setDateRange((prev) => ({ ...prev, startDate: "" }))
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                          aria-label="Clear start date"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start ">
                  <label
                    htmlFor="end-date"
                    className="text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      id="end-date"
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="pl-3 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="End Date"
                    />
                    {dateRange.endDate && (
                      <button
                        onClick={() =>
                          setDateRange((prev) => ({ ...prev, endDate: "" }))
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                        aria-label="Clear end date"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Only show search button when both dates are selected */}
                {dateRange.startDate && dateRange.endDate && (
                  <button
                    onClick={handleDateSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                )}

                {/* Show clear button when date filter is active */}
                {isDateFilterActive && (
                  <button
                    onClick={clearDateFilter}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add active date filter indicator */}
          {isDateFilterActive && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-600 mr-2">Date range:</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                {new Date(dateRange.startDate).toLocaleDateString()} -{" "}
                {new Date(dateRange.endDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Replace the sorting options section with this updated version that includes filters */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Sort by:
            </span>
            <button
              onClick={() => handleSort("title")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "title" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Title
              {sortBy === "title" && (
                <SortAsc
                  className={`w-4 h-4 ${
                    sortDirection === "desc" ? "transform rotate-180" : ""
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => handleSort("date")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "date" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Date
              {sortBy === "date" && (
                <SortAsc
                  className={`w-4 h-4 ${
                    sortDirection === "desc" ? "transform rotate-180" : ""
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => handleSort("category")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "category" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Category
              {sortBy === "category" && (
                <SortAsc
                  className={`w-4 h-4 ${
                    sortDirection === "desc" ? "transform rotate-180" : ""
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => handleSort("author")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "author" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Author
              {sortBy === "author" && (
                <SortAsc
                  className={`w-4 h-4 ${
                    sortDirection === "desc" ? "transform rotate-180" : ""
                  }`}
                />
              )}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span>Filter:</span>
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
              <button
                onClick={() => toggleFilter("published")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.published
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Published
                {activeFilters.published && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-green-200 rounded-full hover:bg-green-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("published");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("draft")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.draft
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Draft
                {activeFilters.draft && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-blue-200 rounded-full hover:bg-blue-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("draft");
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
          {loading && (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}

          {!loading && articles.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No articles found matching your search.
            </div>
          ) : (
            !loading &&
            (() => {
              // Apply date filtering first, then sort
              const filteredArticles = filterArticlesByDate(
                [...articles],
                searchQuery
              );

              // If no articles match the date filter and we have a date search, show a helpful message
              if (
                filteredArticles.length === 0 &&
                parseSearchDate(searchQuery)
              ) {
                return (
                  <div className="p-4 text-center text-gray-500">
                    No articles found for the date "{searchQuery}". Try a
                    different format like "18 March", "March 18", or "18/03".
                  </div>
                );
              }

              // Sort the filtered articles
              const sortedArticles = filteredArticles.sort(sortArticles);

              return sortedArticles.map((article) => (
                <div
                  key={article._id}
                  className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                    <img
                      src={article.blogPhoto || "https://placehold.co/20x20"}
                      alt={article.blogTitle?.[language] || "Article"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {article.blogTitle?.[language] || "Untitled"}
                      </h3>
                      {article.featuredBlog && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <span
                        className={`${
                          article.publishImmediately
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        } text-xs px-2 py-1 rounded-full`}
                      >
                        {article.publishImmediately ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="w-4 h-4 mr-1" />
                        {article.blogCategory || "Uncategorized"}
                      </div>
                      {/* Update the date display in the article list */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.blogAdded)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Tag className="w-4 h-4 mr-1" />
                        {article.blogAuthor || "N/A"}
                      </div>
                    </div>
                    {article.blogTags &&
                      article.blogTags[language]?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {article.blogTags[language].map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePublished(article)}
                      className={`${
                        article.publishImmediately
                          ? "text-green-600 hover:text-green-800"
                          : "text-gray-600 hover:text-gray-800"
                      } px-3 py-1`}
                    >
                      {article.publishImmediately ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/${language}/admin/articles/${article._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article)}
                      className="text-red-600 hover:text-red-800 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ));
            })()
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              articles
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
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Articles</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalArticles}</p>
          <p className="text-sm text-gray-500 mt-1">All articles</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Published</h2>
          </div>
          <p className="text-3xl font-bold">{stats.publishedArticles}</p>
          <p className="text-sm text-gray-500 mt-1">Live articles</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Featured</h2>
          </div>
          <p className="text-3xl font-bold">{stats.featuredArticles}</p>
          <p className="text-sm text-gray-500 mt-1">Featured articles</p>
        </div>
      </div>

      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={articleToDelete?.blogTitle?.en || ""}
        uniId={articleToDelete?._id || ""}
      />
    </div>
  );
}
