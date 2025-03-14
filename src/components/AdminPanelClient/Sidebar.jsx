import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  GraduationCap,
  BookOpen,
  Users,
  FileText,
  Building2,
  BookOpenCheck,
  Tag,
  FilePlus2,
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

const Sidebar = () => {
  const { language } = useLanguage();
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: `/${language}/admin/` },
    { icon: Globe, label: "Countries", path: `/${language}/admin/countries` },
    {
      icon: Building2,
      label: "Universities",
      path: `/${language}/admin/universities`,
    },
    {
      icon: GraduationCap,
      label: "Faculties",
      path: `/${language}/admin/faculties`,
    },
    { icon: BookOpen, label: "Majors", path: `/${language}/admin/majors` },
    {
      icon: BookOpenCheck,
      label: "Courses",
      path: `/${language}/admin/courses`,
    },
    { icon: FileText, label: "Articles", path: `/${language}/admin/articles` },
    { icon: Users, label: "Users", path: `/${language}/admin/users` },
    { icon: Tag, label: "Tags", path: `/${language}/admin/tags` },
    {
      icon: FilePlus2,
      label: "Application",
      path: `/${language}/admin/applications`,
    },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <Link to={`/${language}/`} className="text-2xl font-bold">
          Edubrink Admin
        </Link>
      </div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/${language}/admin/`} // Only apply 'end' to the dashboard link
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
