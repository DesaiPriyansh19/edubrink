"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Clock,
  Code,
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  Bell,
  ChevronDown,
} from "lucide-react";
import useApiData from "../../../../hooks/useApiData";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: application,
    loading,
    error,
    updateWithOutById,
  } = useApiData(`https://edu-brink-backend.vercel.app/api/apply/${id}`);
  const [status, setStatus] = useState("");

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStatusChange = async (newStatus) => {
    await updateWithOutById({ status: newStatus });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Error Loading Application</h2>
          <p>{error || "Application not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button and Title */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Applications</span>
          </button>
        </div>

        {/* Application Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5
                  ${
                    application.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : application.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {application.status === "Pending" && (
                    <Clock className="h-4 w-4" />
                  )}
                  {application.status === "Approved" && (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {application.status === "Rejected" && (
                    <XCircle className="h-4 w-4" />
                  )}
                  {application.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Applicant Info */}
              <div className="md:col-span-4 flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {application.userDetails?.personName}
                  </h2>
                  <p className="text-gray-600">
                    {application.category} Applicant
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">
                      {application.userDetails?.personEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">
                      {application.userDetails?.personPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Applied Date</p>
                    <p className="text-sm font-medium">
                      {formatDate(application.appliedDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center space-x-4">
              <button
                onClick={() => handleStatusChange("Approved")}
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center
                  ${
                    application.status === "Approved"
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                disabled={application.status === "Approved"}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Approve
              </button>

              <button
                onClick={() => handleStatusChange("Rejected")}
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center
                  ${
                    application.status === "Rejected"
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                disabled={application.status === "Rejected"}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Reject
              </button>

              <button className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Application Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Application For */}
          <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Application Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Application ID</p>
                <p className="text-sm font-medium">{application._id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Application Type</p>
                <p className="text-sm font-medium">{application.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Applied For</p>
                <p className="text-sm font-medium">
                  {application.category === "Course" &&
                  application.itemId?.CourseName
                    ? application.itemId.CourseName.en ||
                      application.itemId.CourseName
                    : application.category === "University" &&
                      application.itemId?.uniName
                    ? application.itemId.uniName.en ||
                      application.itemId.uniName
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Applied Date</p>
                <p className="text-sm font-medium">
                  {formatDate(application.appliedDate)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Preferred Start Date
                </p>
                <p className="text-sm font-medium">
                  {application.preferences?.startDate || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Program Type</p>
                <p className="text-sm font-medium">
                  {application.preferences?.programType || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-sm font-medium">
                    {application.userDetails?.personName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-sm font-medium">
                    {formatDate(application.userDetails?.personDOB)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium">
                  {application.userDetails?.personEmail}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-medium">
                  {application.userDetails?.personPhone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-sm font-medium">
                  {application.userDetails?.personAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Education</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Qualification</p>
                <p className="text-sm font-medium">
                  {application.education?.highestQualification}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Institution</p>
                <p className="text-sm font-medium">
                  {application.education?.institution}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Graduation Year</p>
                  <p className="text-sm font-medium">
                    {application.education?.graduationYear}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">GPA</p>
                  <p className="text-sm font-medium">
                    {application.education?.gpa}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Experience</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Years of Experience
                </p>
                <p className="text-sm font-medium">
                  {application.experience?.yearsOfExperience}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Current Employer</p>
                <p className="text-sm font-medium">
                  {application.experience?.currentEmployer}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Job Title</p>
                <p className="text-sm font-medium">
                  {application.experience?.jobTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Skills & Certifications */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Code className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold">Skills & Certifications</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Languages</p>
                <p className="text-sm font-medium">
                  {application.skills?.languages}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Computer Skills</p>
                <p className="text-sm font-medium">
                  {application.skills?.computerSkills}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Certifications</p>
                <p className="text-sm font-medium">
                  {application.skills?.certifications}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
