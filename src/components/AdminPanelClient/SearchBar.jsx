"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  X,
  FileText,
  Landmark,
  BookOpen,
  GraduationCap,
  Globe,
  Tag,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLanguage } from "../../../context/LanguageContext";

const SearchBar = ({ searchBar, setSearchBar, keywordData = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const { language } = useLanguage();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Group keywords by type - Fixed by initializing with an empty object and checking data structure
  const groupedKeywords =
    keywordData?.reduce((acc, item) => {
      // Initialize the accumulator properly
      if (!acc) acc = {};

      // Check if the item has a type property
      if (!item || !item.type) return acc;

      // Initialize the array for this type if it doesn't exist
      if (!acc[item.type]) {
        acc[item.type] = [];
      }

      // Add the item to the appropriate type array
      acc[item.type].push(item);
      return acc;
    }, {}) || {}; // Ensure we return an empty object if reduce returns undefined

  // Define categories with icons and titles
  const categories = [
    {
      id: "university",
      icon: <Landmark className="w-5 h-5" />,
      title: "Universities",
    },
    { id: "course", icon: <BookOpen className="w-5 h-5" />, title: "Courses" },
    { id: "country", icon: <Globe className="w-5 h-5" />, title: "Countries" },

    { id: "blog", icon: <FileText className="w-5 h-5" />, title: "Articles" },
  ];

  // Get trending keywords (most frequent ones)
  const getTrendingKeywords = () => {
    // Make sure we have valid data before slicing
    return Array.isArray(keywordData) ? keywordData.slice(0, 6) : [];
  };

  // Get recent searches (could be stored in localStorage in a real app)
  const getRecentSearches = () => {
    // Make sure we have valid data before slicing
    return Array.isArray(keywordData) ? keywordData.slice(0, 4) : [];
  };

  // Filter keywords based on search query - Fixed to handle potential undefined values
  const getFilteredKeywords = () => {
    if (!searchQuery.trim() || !groupedKeywords) return {};

    const filtered = {};

    Object.keys(groupedKeywords).forEach((type) => {
      // Check if groupedKeywords[type] is an array before filtering
      if (Array.isArray(groupedKeywords[type])) {
        const matchingKeywords = groupedKeywords[type]
          .filter(
            (item) =>
              item &&
              item.keyword &&
              item.keyword.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5); // Limit to 5 results per category

        if (matchingKeywords.length > 0) {
          filtered[type] = matchingKeywords;
        }
      }
    });

    return filtered;
  };

  const filteredKeywords = getFilteredKeywords();
  const hasFilteredResults = Object.keys(filteredKeywords).length > 0;

  // Handle keyword selection
  const handleSelectKeyword = (keyword) => {
    if (!keyword) return;

    // For admin routes, use ID-based navigation
    if (window.location.pathname.includes("/admin")) {
      switch (keyword.type) {
        case "country":
          navigate(`/${language}/admin/countries/${keyword._id}`);
          break;
        case "university":
          navigate(`/${language}/admin/universities/${keyword._id}`);
          break;
        case "course":
          navigate(`/${language}/admin/courses/${keyword._id}`);
          break;
        case "blog":
          navigate(`/${language}/admin/articles/${keyword._id}`);
          break;
        case "faculty":
          navigate(`/${language}/admin/faculties/${keyword._id}`);
          break;
        default:
          navigate(`/${language}/admin/search?q=${keyword.keyword}`);
      }
    } else {
      // For public routes, use keyword-based navigation
      switch (keyword.type) {
        case "country":
          navigate(`/${language}/country/${keyword.keyword}`);
          break;
        case "tag":
          navigate(`/${language}/searchresults?tag=${keyword.keyword}`);
          break;
        case "university":
          navigate(`/${language}/university/${keyword.keyword}`);
          break;
        case "course":
          navigate(`/${language}/courses/${keyword.keyword}`);
          break;
        case "blog":
          navigate(`/${language}/blog/${keyword.keyword}`);
          break;
        case "faculty":
          navigate(`/${language}/faculty/${keyword.keyword}`);
          break;
        default:
          navigate(`/${language}/searchresults?q=${keyword.keyword}`);
      }
    }

    setSearchBar(false);
  };

  // Get icon for keyword type
  const getIconForType = (type) => {
    switch (type) {
      case "university":
        return <Landmark className="w-4 h-4 text-emerald-500" />;
      case "course":
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case "country":
        return <Globe className="w-4 h-4 text-red-500" />;
      case "faculty":
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case "tag":
        return <Tag className="w-4 h-4 text-blue-500" />;
      case "blog":
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  // Handle click outside to close
  useEffect(() => {
    const handleEvent = (event) => {
      if (searchBar && inputRef.current) {
        inputRef.current.focus();
      }

      if (event.type === "keydown" && event.key === "Escape") {
        setSearchBar(false);
      }

      if (
        event.type === "mousedown" &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSearchBar(false);
      }
    };

    if (searchBar) {
      document.addEventListener("keydown", handleEvent);
      document.addEventListener("mousedown", handleEvent);
    }

    return () => {
      document.removeEventListener("keydown", handleEvent);
      document.removeEventListener("mousedown", handleEvent);
    };
  }, [searchBar, setSearchBar]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  // Add this useEffect to set the active category based on the URL
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();

    // Check for admin routes
    if (path.includes("/admin/")) {
      if (path.includes("/admin/countries")) {
        setActiveCategory("country");
      } else if (path.includes("/admin/universities")) {
        setActiveCategory("university");
      } else if (path.includes("/admin/courses")) {
        setActiveCategory("course");
      } else if (path.includes("/admin/faculties")) {
        setActiveCategory("faculty");
      } else if (
        path.includes("/admin/articles") ||
        path.includes("/admin/blogs")
      ) {
        setActiveCategory("blog");
      }
    }
    // Check for public routes
    else {
      if (path.includes("/university") || path.includes("/universities")) {
        setActiveCategory("university");
      } else if (path.includes("/course") || path.includes("/courses")) {
        setActiveCategory("course");
      } else if (path.includes("/country") || path.includes("/countries")) {
        setActiveCategory("country");
      } else if (path.includes("/faculty") || path.includes("/faculties")) {
        setActiveCategory("faculty");
      } else if (
        path.includes("/blog") ||
        path.includes("/blogs") ||
        path.includes("/article") ||
        path.includes("/articles")
      ) {
        setActiveCategory("blog");
      }
    }
  }, [window.location.pathname]);

  if (!searchBar) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
        data-aos={searchBar ? "fade-up" : "fade-out"}
        data-aos-duration="300"
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-200 p-4">
          <Search className="text-gray-500 w-5 h-5 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full outline-none text-lg"
            placeholder="Search keywords, universities, courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end items-center gap-2 ml-2">
            <span className="text-gray-400 text-sm px-2 py-1 bg-gray-100 rounded-md">
              [esc]
            </span>
            <button
              onClick={() => setSearchBar(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="text-gray-500 w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {/* Search Results */}
          {searchQuery && hasFilteredResults ? (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                SEARCH RESULTS
              </h3>
              <div className="space-y-4">
                {Object.keys(filteredKeywords).map((type) => (
                  <div key={type} className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase flex items-center">
                      {getIconForType(type)}
                      <span className="ml-2">{type}s</span>
                    </h4>
                    <ul className="space-y-1">
                      {filteredKeywords[type].map((item, idx) => (
                        <li
                          key={`${type}-${idx}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleSelectKeyword(item)}
                          data-aos="fade-up"
                          data-aos-delay={idx * 50}
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
                            {getIconForType(item.type)}
                          </div>
                          <span className="text-gray-800">{item.keyword}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  CATEGORIES
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                      data-aos="fade-up"
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                          activeCategory === category.id
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {category.icon}
                      </div>
                      <span className="font-medium">{category.title}</span>
                    </div>
                  ))}
                </div>

                {/* Trending Searches */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    TRENDING SEARCHES
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getTrendingKeywords().map((keyword, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        onClick={() => handleSelectKeyword(keyword)}
                        data-aos="fade-up"
                        data-aos-delay={idx * 50}
                      >
                        {keyword.keyword}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Searches & Quick Links */}
              <div>
                {/* Recent Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    RECENT SEARCHES
                  </h3>
                  <ul className="space-y-2">
                    {getRecentSearches().map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleSelectKeyword(item)}
                        data-aos="fade-up"
                        data-aos-delay={idx * 50}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
                          {getIconForType(item.type)}
                        </div>
                        <span className="text-gray-800">{item.keyword}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Links */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">
                    QUICK LINKS
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/${language}/admin/courses`}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setSearchBar(false)}
                      data-aos="fade-up"
                    >
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      <span>All Courses</span>
                    </Link>
                    <Link
                      to={`/${language}/admin/universities`}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setSearchBar(false)}
                      data-aos="fade-up"
                      data-aos-delay="50"
                    >
                      <Landmark className="w-4 h-4 text-emerald-500" />
                      <span>Universities</span>
                    </Link>
                    <Link
                      to={`/${language}/admin/countries`}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setSearchBar(false)}
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <Globe className="w-4 h-4 text-red-500" />
                      <span>Countries</span>
                    </Link>
                    <Link
                      to={`/${language}/admin/articles`}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setSearchBar(false)}
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Blog Articles</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with additional info */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 text-center text-sm text-gray-500">
          Press{" "}
          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Enter</kbd> to
          search or select a result
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
