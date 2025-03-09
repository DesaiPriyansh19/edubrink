import React from "react";
import {
  Users,
  GraduationCap,
  Globe,
  FileText,
  Bell,
  Book,
  Flag,
  PenTool,
  FilePlus,
  Pencil,
  Trash2,
  Trash,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import useDropdownData from "../../../hooks/useDropdownData";
import useFetch from "../../../hooks/useFetch";

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="p-3 rounded-full bg-gray-300 w-10 h-10"></div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: notifications, loading } = useOutletContext();

  const navigate = useNavigate();
  const { userCount, filteredData } = useDropdownData();
  const { language } = useLanguage();

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: userCount || 0,
      color: "bg-blue-500",
    },
    {
      icon: GraduationCap,
      label: "Universities",
      value: filteredData?.universities?.length,
      color: "bg-green-500",
    },
    {
      icon: Globe,
      label: "Countries",
      value: filteredData?.countries?.length,
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      label: "Articles",
      value: filteredData?.blogs?.length,
      color: "bg-orange-500",
    },
  ];

  const getNotificationIcon = (message) => {
    if (message?.en?.includes("created")) {
      return <FilePlus className="w-5 h-5 text-blue-500" />; // Creation Icon
    } else if (message?.en?.includes("updated")) {
      return <Pencil className="w-5 h-5 text-yellow-500" />; // Update Icon
    } else if (message?.en?.includes("deleted")) {
      return <Trash className="w-5 h-5 text-red-500" />; // Delete Icon
    }
    return null;
  };

  // utils/relativeTime.js
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const timeDifference = now - notificationTime; // Difference in milliseconds

    // Convert time difference to seconds, minutes, hours, etc.
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Section - Show Skeletons if Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities - Show Skeleton */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4 max-h-[200px] overflow-y-auto">
            {loading ? (
              // Show Skeleton Loader
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-3 animate-pulse"
                  >
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-48 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                ))
            ) : notifications?.length > 0 ? (
              // Show Notifications if Available
              notifications.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
                >
                  {/* Notification Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(item.message)}
                  </div>

                  {/* Notification Text */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {item.message.en}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      {getRelativeTime(item.notificationTime)}
                    </p>
                  </div>

                  {/* Hover Arrow Indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              // Show "No Notifications" Message
              <div className="text-start text-gray-500">
                No notifications available
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Add University", value: "universities" },
              { label: "New Article", value: "articles" },
              { label: "Add User", value: "users" },
              { label: "Add Major", value: "majors" },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(`/${language}/admin/${action.value}/add`);
                }}
                className="p-4 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
              >
                <p className="font-medium">{action.label}</p>
                <p className="text-sm text-gray-500">Click to proceed</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
