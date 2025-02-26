import { useState } from "react"
import { Bell, User, Settings, LogOut, ChevronDown, Search, Sun, Moon, Globe } from "lucide-react"

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showLanguageSettings, setShowLanguageSettings] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const notifications = [
    {
      id: 1,
      title: "New University Added",
      message: "Harvard University has been added to the system",
      time: "2 hours ago",
      unread: true,
      type: "success",
    },
    {
      id: 2,
      title: "Course Update",
      message: "Computer Science course details have been updated",
      time: "5 hours ago",
      unread: true,
      type: "info",
    },
    {
      id: 3,
      title: "New User Registration",
      message: "A new editor account has been created",
      time: "1 day ago",
      unread: false,
      type: "warning",
    },
  ]

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
  ]

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode)
    // Here you would typically call a function to change the app's language
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter((n) => n.unread).length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center transform -translate-y-1 translate-x-1">
                    {notifications.filter((n) => n.unread).length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform transition-all duration-200 ease-out">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                      <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">Mark all as read</span>
                    </div>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                          notification.unread ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-2 h-2 mt-2 rounded-full ${
                              notification.unread ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 text-center border-t border-gray-200 bg-gray-50">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All Notifications
                    </button>
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
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform transition-all duration-200 ease-out">
                  <div className="py-2">
                    <button
                      onClick={() => setShowLanguageSettings(!showLanguageSettings)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${showLanguageSettings ? "transform rotate-180" : ""}`}
                      />
                    </button>
                    {showLanguageSettings && (
                      <div className="bg-[#f9f9f9] px-4 py-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Globe className="w-3 h-3 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Language</span>
                        </div>
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            className={`w-full text-left py-2 px-3 text-sm rounded ${
                              currentLanguage === lang.code
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => handleLanguageChange(lang.code)}
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
    </header>
  )
}

export default Header

