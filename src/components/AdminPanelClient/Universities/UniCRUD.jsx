import React, { useEffect, useState } from "react";
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
  Gem,
} from "lucide-react";
import Loader from "../../../../utils/Loader";
import { useLanguage } from "../../../../context/LanguageContext";
import useApiData from "../../../../hooks/useApiData";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";
import useDropdownData from "../../../../hooks/useDropdownData";

export default function UniCRUD() {
  const navigate = useNavigate();
  const { filteredData } = useDropdownData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery); // Store debounced value

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(handler); // Cleanup on unmount or if searchQuery changes
  }, [searchQuery]);

  const baseUrl = isDeletePopupOpen
    ? `https://edu-brink-backend.vercel.app/api/university`
    : `https://edu-brink-backend.vercel.app/api/university/fields/query?search=${debouncedSearch}`;
  const { data: universities, loading, deleteById } = useApiData(baseUrl);

  const handleDelete = (university) => {
    setUniversityToDelete(university);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!universityToDelete) return;

    try {
      await deleteById(id);
      setIsDeletePopupOpen(false);
      setUniversityToDelete(null);
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
      // case "created_at":
      //   return (
      //     direction *
      //     (new Date(a.uniCreationDate).getTime() - new Date(b.uniCreationDate).getTime())
      //   );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
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
            <div className="flex gap-4">
              {/* <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 min-w-[200px]"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select> */}
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
            <button
              onClick={() => handleSort("created_at")}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                sortBy === "created_at" ? "text-blue-600 font-medium" : ""
              }`}
            >
              Date Added
              {sortBy === "created_at" && (
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
          {filteredUniversities.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.map((university) => (
                <div
                  key={`${university.countryName.en}-${university._id}`}
                  className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 relative"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img
                      src={
                        university?.uniMainImage ||
                        "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800"
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
                        {university.countryName?.en || "USA"}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {university.uniOverview.en?.split("\n")[0] ||
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Gem className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Award className="w-3 h-3 mr-1" />
                        Accredited
                      </span>
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
          )}
        </div>
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
          <p className="text-3xl font-bold">{universities?.length}</p>
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
          <p className="text-3xl font-bold">{filteredData?.countries?.length}</p>
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
