"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileText,
  Eye,
  Edit,
  Delete,
} from "lucide-react";
import useFetch from "../../../../hooks/useFetch";
import { useLanguage } from "../../../../context/LanguageContext";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";
import useApiData from "../../../../hooks/useApiData";

const ApplyCRUD = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const {
    data: ApplicationData,
    loading,
    deleteById,
  } = useApiData("https://edu-brink-backend.vercel.app/api/apply");

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter applications based on search and filters
  const filteredApplications = ApplicationData?.filter((app) => {
    const matchesSearch =
      app.userDetails.personName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.userDetails.personEmail
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || app.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Statistics
  const totalApplications = ApplicationData?.length || 0;
  const pendingApplications =
    ApplicationData?.filter((app) => app.status === "Pending").length || 0;
  const approvedApplications =
    ApplicationData?.filter((app) => app.status === "Approved").length || 0;
  const rejectedApplications =
    ApplicationData?.filter((app) => app.status === "Rejected").length || 0;

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
      await deleteById(id);
      setIsDeletePopupOpen(false);
      setApplicationToDelete(null);
    } catch (error) {
      console.error("Error deleting Application:", error);
    }
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
                {totalApplications}
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
                {pendingApplications}
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
                {approvedApplications}
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
                {rejectedApplications}
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
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="all">All Categories</option>
                <option value="University">University</option>
                <option value="Course">Course</option>
              </select>
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
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Loading applications...
                    </p>
                  </td>
                </tr>
              ) : filteredApplications?.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No applications found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications?.map((application, index) => (
                  <tr
                    key={application._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {index + 1}
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
                            : "bg-blue-100 text-blue-800"
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
                        className="text-red-600 hover:text-red-900 mr-4 transition-colors duration-150 inline-flex items-center"
                      >
                        Delete
                        <Delete className="h-4 w-4  ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
