import React from "react";
import { Users, GraduationCap, Globe, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";

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
  const navigate = useNavigate();
  const { language } = useLanguage();
  const stats = [
    { icon: Users, label: "Total Users", value: "1,234", color: "bg-blue-500" },
    {
      icon: GraduationCap,
      label: "Universities",
      value: "56",
      color: "bg-green-500",
    },
    { icon: Globe, label: "Countries", value: "25", color: "bg-purple-500" },
    { icon: FileText, label: "Articles", value: "89", color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm">
                    New university added: Harvard University
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
