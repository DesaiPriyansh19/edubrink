import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Globe2,
  Loader2,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import Loader from "../../../../utils/Loader";
import useApiData from "../../../../hooks/useApiData";
import useDropdownData from "../../../../hooks/useDropdownData";

export default function CountryCRUD() {
  const navigate = useNavigate();
  const { filteredData } = useDropdownData();

  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const { language } = useLanguage();
  const baseUrl = `https://edu-brink-backend.vercel.app/api/country`;
  const { data, loading, deleteById } = useApiData(baseUrl);

  const handleDelete = async (id) => {
    setDeleteLoad(true);
    try {
      await deleteById(id);
    } catch (error) {
    } finally {
      setDeleteLoad(false);
    }
  };

  const filteredCountries = data?.filter((country) => {
    const matchesSearch =
      country?.countryName?.[language]
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      country.countryCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry =
      selectedCountry === "all" || country._id === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  if (loading || deleteLoad) {
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
          <h1 className="text-2xl font-bold">Countries Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize educational destinations
          </p>
        </div>
        <button
          onClick={() => navigate(`/${language}/admin/countries/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Country
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
                placeholder="Search countries by name or ISO code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 min-w-[200px]"
              >
                <option value="all">All Countries</option>
                {data?.map((country) => (
                  <option key={country._id} value={country._id}>
                    {country.countryName[language]}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Countries Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISO Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Study Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCountries?.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No countries found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCountries?.map((country) => (
                  <tr key={country._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {!country?.countryPhotos?.countryFlag ? (
                            <img
                              src={
                                country?.countryPhotos?.countryFlag ||
                                "https://placehold.co/20x20"
                              }
                              alt={country?.countryName[language]}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <p className="text-center text-4xl">
                              {country?.countryPhotos?.countryFlag}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="text-sm font-medium text-gray-900">
                          {country?.countryName[language]}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {country?.countryCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {country?.countryLanguages?.[0] || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {country?.countryCurrency || "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(
                            `/${language}/admin/countries/${country._id}`
                          )
                        }
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(country._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Globe2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Total Countries</h2>
              <p className="text-sm text-gray-500">Active destinations</p>
            </div>
          </div>
          <p className="text-3xl font-bold">{data?.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Universities</h2>
              <p className="text-sm text-gray-500">Total institutions</p>
            </div>
          </div>
          <p className="text-3xl font-bold">
            {filteredData?.universities?.length}+
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Study Programs</h2>
              <p className="text-sm text-gray-500">Available courses</p>
            </div>
          </div>
          <p className="text-3xl font-bold">{filteredData?.courses?.length}+</p>
        </div>
      </div>
    </div>
  );
}
