"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileText,
  Edit,
  Delete,
  SortAsc,
  Filter,
  ChevronLeft,
  ChevronRight,
  FilterX,
} from "lucide-react";
import axios from "axios";
import { useLanguage } from "../../../../context/LanguageContext";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";

const ApplyCRUD = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Data states
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  // Update the activeFilters state to include major
  const [activeFilters, setActiveFilters] = useState({
    university: false,
    course: false,
    major: false,
    pending: false,
    approved: false,
    rejected: false,
  });

  // Date range filters
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Sorting states
  const [sortBy, setSortBy] = useState("appliedDate");
  const [sortDirection, setSortDirection] = useState("desc");

  // Statistics
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  // Debounce search input
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch applications with filters
  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add pagination parameters
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", itemsPerPage.toString());

      // Add search parameter if present
      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch);
      }

      // In the fetchApplications function, update the categories array building logic
      const categories = [];

      // Check which filters are active and push the corresponding category
      if (activeFilters.university) categories.push("University");
      if (activeFilters.course) categories.push("Course");
      if (activeFilters.major) categories.push("Major");

      // Add status filters
      const statuses = [];
      if (activeFilters.pending) statuses.push("Pending");
      if (activeFilters.approved) statuses.push("Approved");
      if (activeFilters.rejected) statuses.push("Rejected");

      // Only add the category parameter if at least one category is selected
      if (categories.length > 0) {
        queryParams.append("category", JSON.stringify(categories));
      }

      // Only add the status parameter if at least one status filter is active
      if (statuses.length > 0) {
        queryParams.append("status", JSON.stringify(statuses));
      }

      // Add date range parameters if both dates are selected
      if (dateRange.startDate) {
        queryParams.append("startDate", dateRange.startDate);
      }

      if (dateRange.endDate) {
        queryParams.append("endDate", dateRange.endDate);
      }

      // Get token from localStorage
      const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}");
      const token = userInfo?.token || "";

      // Make the request with the Authorization header
      const response = await axios.get(
        `https://edu-brink-backend.vercel.app/api/apply?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(response.data.data || []);

      // Update pagination information from response
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages || 1);
        setTotalItems(response.data.pagination.totalCount || 0);
      }

      // Update statistics
      if (response.data.stats) {
        setStats({
          totalApplications: response.data.stats.total || 0,
          pendingApplications: response.data.stats.pending || 0,
          approvedApplications: response.data.stats.approved || 0,
          rejectedApplications: response.data.stats.rejected || 0,
        });
      } else {
        // Calculate stats from the data if not provided by API
        const total = response.data.data?.length || 0;
        const pending =
          response.data.data?.filter((app) => app.status === "Pending")
            .length || 0;
        const approved =
          response.data.data?.filter((app) => app.status === "Approved")
            .length || 0;
        const rejected =
          response.data.data?.filter((app) => app.status === "Rejected")
            .length || 0;

        setStats({
          totalApplications: total,
          pendingApplications: pending,
          approvedApplications: approved,
          rejectedApplications: rejected,
        });
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch applications. Please try again.");
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Update useEffect dependencies to include filters
  useEffect(() => {
    fetchApplications();
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    activeFilters,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Sort applications client-side
  const sortApplications = (a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    switch (sortBy) {
      case "name":
        return (
          direction *
          (a.userDetails.personName || "").localeCompare(
            b.userDetails.personName || ""
          )
        );
      case "email":
        return (
          direction *
          (a.userDetails.personEmail || "").localeCompare(
            b.userDetails.personEmail || ""
          )
        );
      case "category":
        return direction * (a.category || "").localeCompare(b.category || "");
      case "status":
        return direction * (a.status || "").localeCompare(b.status || "");
      case "appliedDate":
        return direction * (new Date(a.appliedDate) - new Date(b.appliedDate));
      default:
        return 0;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Navigate to application details page
  const viewApplicationDetails = (id) => {
    navigate(`/${language}/admin/applications/${id}`);
  };

  const handleDelete = (application) => {
    setApplicationToDelete(application);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!applicationToDelete) return;

    try {
      // Get token from localStorage
      const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}");
      const token = userInfo?.token || "";

      await axios.delete(
        `https://edu-brink-backend.vercel.app/api/apply/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsDeletePopupOpen(false);
      setApplicationToDelete(null);
      fetchApplications(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting Application:", error);
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

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Apply client-side sorting
  const sortedApplications = [...applications].sort(sortApplications);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
    setCurrentPage(1); // Reset to first page when changing filters
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Application Management
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage student applications
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 transition-transform hover:scale-[1.02] duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalApplications}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500 transition-transform hover:scale-[1.02] duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingApplications}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 transition-transform hover:scale-[1.02] duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.approvedApplications}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500 transition-transform hover:scale-[1.02] duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.rejectedApplications}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="startDate" className="text-sm text-gray-600">
                From:
              </label>
              <input
                type="date"
                id="startDate"
                value={dateRange.startDate}
                onChange={(e) => {
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }));
                  setCurrentPage(1); // Reset to first page when changing date
                }}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="endDate" className="text-sm text-gray-600">
                To:
              </label>
              <input
                type="date"
                id="endDate"
                value={dateRange.endDate}
                onChange={(e) => {
                  setDateRange((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }));
                  setCurrentPage(1); // Reset to first page when changing date
                }}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {(dateRange.startDate || dateRange.endDate) && (
              <button
                onClick={() => {
                  setDateRange({ startDate: "", endDate: "" });
                  setCurrentPage(1); // Reset to first page when clearing dates
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear Dates
              </button>
            )}
          </div>

          {/* Sorting Options */}
          <div className="flex justify-between items-center">
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
                  <SortAsc
                    className={`w-4 h-4 ${
                      sortDirection === "desc" ? "transform rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              <button
                onClick={() => handleSort("email")}
                className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                  sortBy === "email" ? "text-blue-600 font-medium" : ""
                }`}
              >
                Email
                {sortBy === "email" && (
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
                onClick={() => handleSort("appliedDate")}
                className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                  sortBy === "appliedDate" ? "text-blue-600 font-medium" : ""
                }`}
              >
                Date
                {sortBy === "appliedDate" && (
                  <SortAsc
                    className={`w-4 h-4 ${
                      sortDirection === "desc" ? "transform rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              <button
                onClick={() => handleSort("status")}
                className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                  sortBy === "status" ? "text-blue-600 font-medium" : ""
                }`}
              >
                Status
                {sortBy === "status" && (
                  <SortAsc
                    className={`w-4 h-4 ${
                      sortDirection === "desc" ? "transform rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 ml-2">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <FilterX className="w-4 h-4" />
                Filter by:
              </span>
              <button
                onClick={() => toggleFilter("university")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.university
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                University
                {activeFilters.university && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-purple-200 rounded-full hover:bg-purple-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("university");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>

              <button
                onClick={() => toggleFilter("course")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.course
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Course
                {activeFilters.course && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-blue-200 rounded-full hover:bg-blue-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("course");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("major")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.major
                    ? "bg-slate-100 text-slate-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Major
                {activeFilters.major && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-slate-200 rounded-full hover:bg-slate-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("major");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("pending")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.pending
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
                {activeFilters.pending && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-yellow-200 rounded-full hover:bg-yellow-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("pending");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("approved")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.approved
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Approved
                {activeFilters.approved && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-green-200 rounded-full hover:bg-green-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("approved");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("rejected")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.rejected
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rejected
                {activeFilters.rejected && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-red-200 rounded-full hover:bg-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("rejected");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Loading applications...
                    </p>
                  </td>
                </tr>
              ) : sortedApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No applications found matching your search criteria.
                  </td>
                </tr>
              ) : (
                sortedApplications.map((application, index) => (
                  <tr
                    key={application._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.userDetails.personName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.userDetails.personEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.category === "University"
                            ? "bg-purple-100 text-purple-800"
                            : application.category === "Course"
                            ? "bg-blue-100 text-blue-800"
                            : application.category === "Major"
                            ? "bg-slate-100 text-slate-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {application.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(application.appliedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : application.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewApplicationDetails(application._id)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-150 inline-flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(application)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-150 inline-flex items-center"
                      >
                        Delete
                        <Delete className="h-4 w-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              applications
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

      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={
          applicationToDelete?.userDetails?.personName ||
          applicationToDelete?.itemId?.CourseName?.[language] ||
          applicationToDelete?.itemId?.uniName?.[language] ||
          ""
        }
        uniId={applicationToDelete?._id || ""}
      />
    </div>
  );
};

export default ApplyCRUD;
