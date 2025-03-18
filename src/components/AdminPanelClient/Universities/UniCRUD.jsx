"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  GraduationCap,
  Globe2,
  BookOpen,
  Award,
  Home,
  SortAsc,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";
import useDropdownData from "../../../../hooks/useDropdownData";
import axios from "axios";

export default function UniCRUD() {
  const navigate = useNavigate();
  const { filteredData } = useDropdownData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("eduuserInfo"));
    return userInfo?.token || "";
  };

  // Debounce search input
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch universities with pagination
  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        `https://edu-brink-backend.vercel.app/api/university/fields/query?search=${debouncedSearch}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUniversities(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalCount);
      setError(null);
    } catch (err) {
      setError("Failed to fetch universities. Please try again.");
      console.error("Error fetching universities:", err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Fetch data when pagination params or search term changes
  useEffect(() => {
    fetchUniversities();
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handleDelete = (university) => {
    setUniversityToDelete(university);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!universityToDelete) return;

    try {
      const token = getToken();
      await axios.delete(
        `https://edu-brink-backend.vercel.app/api/university/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsDeletePopupOpen(false);
      setUniversityToDelete(null);
      fetchUniversities(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting university:", error);
    }
  };

  const sortUniversities = (a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    switch (sortBy) {
      case "name":
        return direction * a.uniName.en.localeCompare(b.uniName.en);
      case "country":
        return (
          direction *
          (a.countryName?.en || "").localeCompare(b.countryName?.en || "")
        );
      default:
        return 0;
    }
  };

  const filteredUniversities = universities
    .filter((university) => {
      const matchesType =
        !filterType ||
        university.uniType?.toLowerCase().includes(filterType.toLowerCase());
      return matchesType;
    })
    .sort(sortUniversities);

  const handleSort = (option) => {
    if (sortBy === option) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(option);
      setSortDirection("asc");
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

  if (loading && universities.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Universities Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize educational institutions
          </p>
        </div>
        <button
          onClick={() => navigate(`/${language}/admin/universities/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Add University
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search universities by name, country, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="research">Research</option>
              </select>
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
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
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
              onClick={() => handleSort("country")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "country" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Country
              {sortBy === "country" && (
                <SortAsc
                  className={`w-4 h-4 ${
                    sortDirection === "desc" ? "transform rotate-180" : ""
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="p-4">
          {/* Loading Skeleton */}
          {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(itemsPerPage)].map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actual Content */}
          {!isSearching && filteredUniversities.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Universities Found
              </h3>
              <p className="text-gray-500">
                No universities match your search criteria. Try adjusting your
                filters.
              </p>
            </div>
          ) : (
            !isSearching && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUniversities.map((university) => (
                  <div
                    key={`${university.countryName?.en || "unknown"}-${
                      university._id
                    }`}
                    className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 relative"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <img
                        src={
                          university?.uniMainImage ||
                          "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={university.uniName.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold text-lg leading-tight mb-1">
                          {university.uniName.en}
                        </h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {university.countryName?.en || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {university.uniOverview?.en?.split("\n")[0] ||
                          "No description available"}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <BookOpen className="w-3 h-3 mr-1" />
                          Programs Available
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Home className="w-3 h-3 mr-1" />
                          Campus
                        </span>
                        {university.uniType && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Award className="w-3 h-3 mr-1" />
                            {university.uniType}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() =>
                            navigate(
                              `/${language}/admin/universities/${university._id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(university)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && !isSearching && totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              universities
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

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Total Universities</h2>
              <p className="text-sm text-gray-500">Active institutions</p>
            </div>
          </div>
          <p className="text-3xl font-bold">{totalItems}</p>
          <div className="mt-2 text-sm text-gray-500">
            Across {filteredData?.countries?.length} countries
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Globe2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Countries</h2>
              <p className="text-sm text-gray-500">Global presence</p>
            </div>
          </div>
          <p className="text-3xl font-bold">
            {filteredData?.countries?.length}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Educational destinations
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Programs</h2>
              <p className="text-sm text-gray-500">Study opportunities</p>
            </div>
          </div>
          <p className="text-3xl font-bold">{filteredData?.courses?.length}+</p>
          <div className="mt-2 text-sm text-gray-500">Available courses</div>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={universityToDelete?.uniName.en || ""}
        uniId={universityToDelete?._id || ""}
      />
    </div>
  );
}
