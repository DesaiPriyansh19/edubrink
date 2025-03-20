"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  UsersIcon,
  Shield,
  Clock,
  Loader2,
  Filter,
  SortAsc,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import axios from "axios";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";

export default function UsersCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Data states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add sorting states
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Update the activeFilters state to include editor
  const [activeFilters, setActiveFilters] = useState({
    active: false,
    admin: false,
    viewer: false,
    editor: false,
  });

  const baseUrl = `https://edu-brink-backend.vercel.app/api/users`;

  // Debounce search input
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Update the fetchUsers function to include pagination parameters
  const fetchUsers = async () => {
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

      // Add filter parameters
      if (activeFilters.active) queryParams.append("status", "active");

      // Format role parameter as an array
      const roles = [];
      if (activeFilters.admin) roles.push("Admin");
      if (activeFilters.viewer) roles.push("Viewer");
      if (activeFilters.editor) roles.push("Editor");

      // Only add the role parameter if at least one role filter is active
      if (roles.length > 0) {
        queryParams.append("role", JSON.stringify(roles));
      }

      // Add sort parameters
      queryParams.append("sortBy", sortBy);
      queryParams.append("sortDirection", sortDirection);

      // Get token from localStorage
      const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}");
      const token = userInfo?.token || "";

      // Make the request with the Authorization header
      const response = await axios.get(`${baseUrl}?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.data || []);

      // Update pagination information from response
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages || 1);
        setTotalItems(response.data.pagination.totalCount || 0);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Update useEffect dependencies to include pagination parameters
  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    activeFilters,
    sortBy,
    sortDirection,
  ]);

  // Add a function to toggle filters
  const toggleFilter = (filter) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
    setCurrentPage(1); // Reset to first page when changing filters
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

  // Add this sortUsers function
  const sortUsers = (a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    switch (sortBy) {
      case "name":
        return direction * (a.FullName || "").localeCompare(b.FullName || "");
      case "email":
        return direction * (a.Email || "").localeCompare(b.Email || "");
      case "date":
        return direction * (new Date(a.createdAt) - new Date(b.createdAt));
      case "role":
        const roleA = a.ActionStatus || "N/A";
        const roleB = b.ActionStatus || "N/A";
        return direction * roleA.localeCompare(roleB);
      default:
        return 0;
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!userToDelete) return;

    try {
      // Get token from localStorage
      const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}");
      const token = userInfo?.token || "";

      await axios.delete(`${baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsDeletePopupOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleStatus = async (user) => {
    try {
      // Get token from localStorage
      const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}");
      const token = userInfo?.token || "";

      await axios.put(
        `${baseUrl}/${user._id}`,
        {
          Status: !user.Status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers(); // Refresh data after update
    } catch (error) {
      console.error("Error updating user status:", error);
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

  // Update the filter function in the sortUsers function to include editor
  const filteredAndSortedUsers = [...users]
    .filter((user) => {
      // Apply active filters
      if (activeFilters.active && !user.Status) return false;
      if (activeFilters.admin && !user.isAdmin) return false;
      if (
        activeFilters.viewer &&
        (user.isAdmin || user.ActionStatus !== "Viewer")
      )
        return false;
      if (
        activeFilters.editor &&
        (user.isAdmin || user.ActionStatus !== "Editor")
      )
        return false;

      // Apply search filter
      if (searchQuery) {
        return (
          user.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.Email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return true;
    })
    .sort(sortUsers);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/users/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add User
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
                placeholder="Search users by name, email..."
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
              onClick={() => handleSort("role")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "role" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Role
              {sortBy === "role" && (
                <SortAsc
                  className={`w-4 h-4 ${
                    sortDirection === "desc" ? "transform rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Add the Editor filter button in the UI */}
            <div className="ml-auto flex items-center gap-2">
              <span>Filter:</span>
              <button
                onClick={() => toggleFilter("active")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Active
                {activeFilters.active && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-green-200 rounded-full hover:bg-green-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("active");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("admin")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.admin
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Admin
                {activeFilters.admin && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-purple-200 rounded-full hover:bg-purple-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("admin");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("viewer")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.viewer
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Viewer
                {activeFilters.viewer && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-blue-200 rounded-full hover:bg-blue-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("viewer");
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("editor")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  activeFilters.editor
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Editor
                {activeFilters.editor && (
                  <span
                    className="ml-1 flex items-center justify-center w-4 h-4 bg-orange-200 rounded-full hover:bg-orange-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("editor");
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
          {isSearching && (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 animate-pulse"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2 mt-2">
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && filteredAndSortedUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No users found matching your search.
            </div>
          ) : (
            !isSearching &&
            filteredAndSortedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{user.FullName || "N/A"}</h3>
                    <span
                      className={`${
                        user.Status
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      } text-xs px-2 py-1 rounded-full`}
                    >
                      {user.Status ? "Active" : "Not Active"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Shield className="w-4 h-4 mr-1" />
                      {user.ActionStatus ? user.ActionStatus : "N/A"}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{user.Email}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(user)}
                    className={`${
                      user.Status
                        ? "text-green-600 hover:text-green-800"
                        : "text-gray-600 hover:text-gray-800"
                    } px-3 py-1`}
                  >
                    {user.Status ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/${language}/admin/users/${user._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
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
              users
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
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Users</h2>
          </div>
          <p className="text-3xl font-bold">{totalItems}</p>
          <p className="text-sm text-gray-500 mt-1">All users</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Active Users</h2>
          </div>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.Status).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Currently active</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Admins</h2>
          </div>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.isAdmin).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Admin users</p>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={userToDelete?.Email || ""}
        uniId={userToDelete?._id || ""}
      />
    </div>
  );
}
