import { useState, useEffect, useRef } from "react";
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Globe,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import AOS from "aos";
import axios from "axios";
import SearchBar from "./SearchBar";
import { useLanguage } from "../../../context/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import { adaptKeywordData } from "../../../utils/keyword-adapter";

const Header = ({ data: notifications, refetch }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [keywordData, setKeywordData] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const notificationRef = useRef(null);
  const allNotificationsRef = useRef(null);
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // const { data } = useFetch("https://edu-brink-backend.vercel.app/api/keyword");

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic" },
  ];

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setCurrentLanguage(lang);
    navigate(`/${lang}${location.pathname.substring(3)}`); // Update URL while keeping the existing path
  };

  const getNotificationTitle = (message, item) => {
    if (message?.en?.includes("created")) {
      return `A new ${item.en} has been created`;
    } else if (message?.en?.includes("updated")) {
      return `${item.en} details have been updated`;
    } else if (message?.en?.includes("deleted")) {
      return `${item.en} details has been deleted`;
    }
    return null;
  };

  // Fetch and adapt keyword data
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get(
          `https://edu-brink-backend.vercel.app/api/keyword/admin`
        );
        const adaptedData = adaptKeywordData(response.data.data);
        setKeywordData(adaptedData);
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setKeywordData([]);
      }
    };

    fetchKeywords();
  }, []);

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

  // Filter for today's notifications
  const isToday = (timestamp) => {
    const today = new Date();
    const notificationDate = new Date(timestamp);
    return (
      notificationDate.getDate() === today.getDate() &&
      notificationDate.getMonth() === today.getMonth() &&
      notificationDate.getFullYear() === today.getFullYear()
    );
  };

  // Filter today's notifications
  const todayNotifications =
    notifications?.filter((notification) =>
      isToday(notification.notificationTime)
    ) || [];

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        allNotificationsRef.current &&
        !allNotificationsRef.current.contains(event.target) &&
        event.target.id !== "viewAllBtn"
      ) {
        setShowAllNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mark all as read function
  const handleMarkAllAsRead = async () => {
    try {
      const res = await axios.put(
        "https://edu-brink-backend.vercel.app/api/helper/notification/all"
      );
      if (res.status === 200) {
        console.log("updated");
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800, // Default animation duration
      offset: 100, // Trigger animations 100px before the element is visible
      easing: "ease-in-out", // Easing for animations
      once: true, // Run animation only once
    });
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1">
            <div
              onClick={() => setSearchBar(true)}
              className="inline-flex items-center cursor-pointer gap-2"
            >
              <Search className="text-gray-400 w-5 h-5" />
              <button
                type="button"
                className=" border-0 rounded-lg text-gray-400 focus:bg-white transition-all duration-200"
              >
                {" "}
                Search anything...
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowAllNotifications(false);
                }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Bell className="w-5 h-5" />
                {todayNotifications?.filter((n) => n.mark).length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center transform -translate-y-1 translate-x-1">
                    {todayNotifications?.filter((n) => n.mark).length}
                  </span>
                )}
              </button>

              {/* Today's Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform origin-top-right transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-5">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Today's Notifications
                      </h3>
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {todayNotifications.length > 0 ? (
                      todayNotifications.map((notification) => {
                        return (
                          <div
                            key={notification._id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                              notification.mark ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <div
                                className={`w-2 h-2 mt-2 rounded-full ${
                                  notification.mark === "Not Read"
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {getNotificationTitle(
                                    notification.message,
                                    notification.item
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message.en}
                                </p>
                                <span className="text-xs text-gray-500 mt-2 block">
                                  {getRelativeTime(
                                    notification?.notificationTime
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        No notifications today
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center border-t border-gray-200 bg-gray-50">
                    <button
                      id="viewAllBtn"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => {
                        setShowAllNotifications(true);
                        setShowNotifications(false);
                      }}
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}

              {/* All Notifications Modal Overlay */}
              {showAllNotifications && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-in fade-in duration-200">
                  <div
                    ref={allNotificationsRef}
                    className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200"
                  >
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-semibold">
                          All Notifications
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowAllNotifications(false)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="overflow-y-auto flex-grow">
                      {notifications?.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div
                            key={notification._id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                              notification.mark === "Not Read"
                                ? "bg-blue-50/50"
                                : ""
                            }`}
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                          >
                            <div className="flex items-start space-x-4">
                              <div
                                className={`w-2 h-2 mt-2 rounded-full ${
                                  notification.mark === "Not Read"
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-900">
                                    {getNotificationTitle(
                                      notification.message,
                                      notification.item
                                    )}
                                  </h4>
                                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {new Date(
                                        notification.notificationTime
                                      ).toLocaleDateString()}
                                    </span>
                                    <Clock className="w-3 h-3 ml-2" />
                                    <span>
                                      {new Date(
                                        notification.notificationTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message.en}
                                </p>
                                <span className="text-xs text-gray-500 mt-2 block">
                                  {getRelativeTime(
                                    notification?.notificationTime
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center text-gray-500">
                          No notifications available
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                      <button
                        onClick={() => setShowAllNotifications(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                    showProfileMenu ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-5">
                  <div className="py-2">
                    <button
                      onClick={() =>
                        setShowLanguageSettings(!showLanguageSettings)
                      }
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showLanguageSettings ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showLanguageSettings && (
                      <div className="bg-[#f9f9f9] px-4 py-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Globe className="w-3 h-3 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Language
                          </span>
                        </div>
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            className={`w-full text-left py-2 px-3 text-sm rounded ${
                              currentLanguage === lang.code
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => changeLanguage(lang.code)}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SearchBar
        searchBar={searchBar}
        setSearchBar={setSearchBar}
        keywordData={keywordData}
      />
    </header>
  );
};

export default Header;
