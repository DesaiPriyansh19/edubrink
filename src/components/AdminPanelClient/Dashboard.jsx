"use client"

import { useEffect } from "react"
import {
  Users,
  GraduationCap,
  Globe,
  FileText,
  Bell,
  PenTool,
  FilePlus,
  Pencil,
  Trash,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  UserPlus,
  BookOpen,
  Building2,
} from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useLanguage } from "../../../context/LanguageContext"
import useDropdownData from "../../../hooks/useDropdownData"

// Import AOS
import AOS from "aos"
import "aos/dist/aos.css"

const Dashboard = () => {
  const { data: notifications, loading } = useOutletContext()
  const navigate = useNavigate()
  const { userCount, filteredData } = useDropdownData()
  const { language } = useLanguage()

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    })
  }, [])

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: userCount || 0,
      color: "bg-blue-500",
      iconColor: "text-blue-500",
      bgLight: "bg-blue-50",
    },
    {
      icon: GraduationCap,
      label: "Universities",
      value: filteredData?.universities?.length || 0,
      color: "bg-emerald-500",
      iconColor: "text-emerald-500",
      bgLight: "bg-emerald-50",
    },
    {
      icon: Globe,
      label: "Countries",
      value: filteredData?.countries?.length || 0,
      color: "bg-purple-500",
      iconColor: "text-purple-500",
      bgLight: "bg-purple-50",
    },
    {
      icon: FileText,
      label: "Articles",
      value: filteredData?.blogs?.length || 0,
      color: "bg-orange-500",
      iconColor: "text-orange-500",
      bgLight: "bg-orange-50",
    },
  ]

  const quickActions = [
    {
      label: "Add University",
      value: "universities",
      icon: Building2,
      description: "Create a new university profile",
      color: "bg-emerald-500",
      iconColor: "text-emerald-500",
    },
    {
      label: "New Article",
      value: "articles",
      icon: PenTool,
      description: "Publish a new blog article",
      color: "bg-orange-500",
      iconColor: "text-orange-500",
    },
    {
      label: "Add User",
      value: "users",
      icon: UserPlus,
      description: "Register a new admin user",
      color: "bg-blue-500",
      iconColor: "text-blue-500",
    },
    {
      label: "Add Major",
      value: "majors",
      icon: BookOpen,
      description: "Create a new academic major",
      color: "bg-purple-500",
      iconColor: "text-purple-500",
    },
  ]

  const getNotificationIcon = (message) => {
    if (message?.en?.includes("created")) {
      return <FilePlus className="w-4 h-4 text-blue-500" />
    } else if (message?.en?.includes("updated")) {
      return <Pencil className="w-4 h-4 text-amber-500" />
    } else if (message?.en?.includes("deleted")) {
      return <Trash className="w-4 h-4 text-red-500" />
    }
    return <Bell className="w-4 h-4 text-gray-500" />
  }

  const getRelativeTime = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const timeDifference = now - notificationTime

    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`
    }
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back to your admin dashboard</p>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgLight} p-3 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center">
                <Bell className="w-4 h-4 mr-2 text-amber-500" />
                Recent Activities
              </h2>
              <button className="text-sm text-blue-500 hover:text-blue-600">View All</button>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications?.length > 0 ? (
              notifications.slice(0, 12).map((item, i) => (
                <div key={i} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div
                      className={`rounded-lg p-2 ${
                        item.message?.en?.includes("created")
                          ? "bg-blue-50"
                          : item.message?.en?.includes("updated")
                            ? "bg-amber-50"
                            : item.message?.en?.includes("deleted")
                              ? "bg-red-50"
                              : "bg-gray-50"
                      }`}
                    >
                      {getNotificationIcon(item.message)}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{item.message.en}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {getRelativeTime(item.notificationTime)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Plus className="w-4 h-4 mr-2 text-purple-500" />
              Quick Actions
            </h2>
          </div>

          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(`/${language}/admin/${action.value}/add`)}
                className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-left w-full"
              >
                <div className="flex items-center">
                  <div className={`${action.color} bg-opacity-10 p-2 rounded-lg mr-3`}>
                    <action.icon className={`w-4 h-4 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-900">{action.label}</h3>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

