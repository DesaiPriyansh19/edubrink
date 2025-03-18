"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  BookOpen,
  Loader2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";
import useDropdownData from "../../../../hooks/useDropdownData";
import axios from "axios";

export default function FacultyCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { filteredData } = useDropdownData();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Add a new state to store the total featured faculties count
  const [totalFeaturedFaculties, setTotalFeaturedFaculties] = useState(0);

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("eduuserInfo"));
    return userInfo?.token || "";
  };

  // Fetch faculties with pagination
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        `https://edu-brink-backend.vercel.app/api/faculty?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFaculties(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalCount);
      setTotalFeaturedFaculties(
        response.data.pagination.totalFeaturedCount || 0
      );
      setError(null);
    } catch (err) {
      setError("Failed to fetch faculties. Please try again.");
      console.error("Error fetching faculties:", err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Fetch data when pagination params change
  useEffect(() => {
    fetchFaculties();
  }, [currentPage, itemsPerPage]);

  const handleDelete = (faculty) => {
    setFacultyToDelete(faculty);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!facultyToDelete) return;

    try {
      const token = getToken();
      await axios.delete(
        `https://edu-brink-backend.vercel.app/api/faculty/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsDeletePopupOpen(false);
      setFacultyToDelete(null);
      fetchFaculties(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const filteredFaculties = faculties.filter(
    (faculty) =>
      faculty.facultyName.en
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      faculty.universities.some((item) =>
        item?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

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
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (loading && faculties.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Faculties Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/faculties/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Faculty
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search faculties, faculties by universities name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              >
                {[1, 5, 10, 20, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
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
                  className="flex items-center space-x-4 animate-pulse"
                >
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-x-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actual Content */}
          {!isSearching && filteredFaculties.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No faculties found matching your search.
            </div>
          ) : (
            filteredFaculties.map((faculty) => (
              <div
                key={faculty._id}
                className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{faculty.facultyName.en}</h3>
                    {faculty.facultyFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span className="font-medium">Universities:</span>
                      {faculty.universities &&
                      faculty.universities.length > 0 ? (
                        <span className="ml-2">
                          {faculty.universities.length > 0 ? (
                            <span className="relative inline-block">
                              <button
                                className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentTarget = e.currentTarget;
                                  const dropdown =
                                    currentTarget.nextElementSibling;
                                  dropdown.classList.toggle("hidden");
                                }}
                              >
                                {faculty.universities.length}{" "}
                                {faculty.universities.length === 1
                                  ? "University"
                                  : "Universities"}
                              </button>
                              <div className="hidden absolute z-10 mt-2 w-64 max-h-48 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-200">
                                <div className="p-2">
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Associated Universities
                                  </h4>
                                  <ul className="space-y-1">
                                    {faculty.universities.map((uni, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-gray-700 py-1 px-2 hover:bg-gray-50 rounded"
                                      >
                                        {uni || "Unnamed University"}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </span>
                          ) : (
                            <span className="text-gray-500 ml-2">None</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-500 ml-2">None</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {faculty.majorCount} Majors
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/${language}/admin/faculties/${faculty._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faculty)}
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
              faculties
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
            <h2 className="text-lg font-semibold">Total Faculties</h2>
          </div>
          <p className="text-3xl font-bold">{totalItems}</p>
          <p className="text-sm text-gray-500 mt-1">Across all universities</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Total Majors</h2>
          </div>
          <p className="text-3xl font-bold">{filteredData?.majors?.length}</p>
          <p className="text-sm text-gray-500 mt-1">Across all faculties</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Featured Faculties</h2>
          </div>
          <p className="text-3xl font-bold">{totalFeaturedFaculties}</p>
          <p className="text-sm text-gray-500 mt-1">Highlighted faculties</p>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={facultyToDelete?.facultyName.en || ""}
        uniId={facultyToDelete?._id || ""}
      />
    </div>
  );
}
