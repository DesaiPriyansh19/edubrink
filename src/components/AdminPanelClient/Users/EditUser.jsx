"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  User,
  Shield,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Users,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import useApiData from "../../../../hooks/useApiData";
import { useLanguage } from "../../../../context/LanguageContext";
import { useNavigate, useParams } from "react-router-dom";

const initialFormData = {
  FullName: "",
  Email: "",
  isAdmin: false,
  ActionStatus: "Viewer",
  verified: false,
  Status: "Active",
  Gender: "Male",
};

const actionStatus = ["Viewer", "Admin", "Editor"];
const genders = ["Male", "Female", "Non-Binary"];
const status = ["Active", "Not Active"];

export default function EditUser() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const {
    data,
    error: resError,
    updateWithOutById,
  } = useApiData(`https://edu-brink-backend.vercel.app/api/users/admin/${id}`);

  useEffect(() => {
    if (data) {
      setFormData({
        FullName: data?.FullName || "",
        Email: data?.Email || "",
        isAdmin: data?.isAdmin ?? false,
        verified: data?.verified ?? false,
        Status: data?.Status || "",
        ActionStatus: data?.ActionStatus || "",
        Gender: data?.Gender || "Male",
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const updatedFormData = {
        ...formData,
        isAdmin: formData.ActionStatus === "Admin" ? true : false,
      };

      console.log(updatedFormData);

      await updateWithOutById(updatedFormData);

      setSuccess(true);

      setTimeout(() => {
        setFormData(initialFormData);
        setSuccess(false);
      }, 3000);
      navigate(`/${language}/admin/users`);
    } catch (err) {
      console.error("Error adding user:", err);
      setError(err.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/users`)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:bg-gray-600 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300">
            Back to Users
          </span>
        </button>
        <h1 className="text-2xl font-bold animate-fade-in">Add New User</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-shake">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg animate-fade-in">
          User added successfully!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 transition-all duration-500 hover:shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.FullName}
                onChange={(e) =>
                  setFormData({ ...formData, FullName: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Shield className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={formData.Password}
                onChange={(e) =>
                  setFormData({ ...formData, Password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
          </div> */}

          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="relative">
              <Users className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={formData.Gender}
                onChange={(e) =>
                  setFormData({ ...formData, Gender: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 appearance-none"
              >
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="transition-all duration-300  transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <ShieldCheck className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={formData.Status || "Active"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Status: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 appearance-none"
              >
                {status.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="transition-all duration-300  transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Restrict
            </label>
            <div className="relative">
              <UserCog className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={formData.ActionStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ActionStatus: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 appearance-none"
              >
                {actionStatus.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-2 flex gap-4">
            <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) =>
                    setFormData({ ...formData, verified: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Verified User
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/${language}/admin/users`)}
            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Save User
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
