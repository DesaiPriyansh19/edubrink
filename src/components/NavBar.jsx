"use client";

import { useState, useEffect, useRef } from "react";
import Search from "../../svg/caplogo/Logo/Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import FilterLogo from "../../svg/FilterLogo";
import DropdowneCourses from "./DropdowneCourses";
import DropdownContries from "./DropdownContries";
import TogelMenu from "../../svg/TogelMenu/Index";
import TogelMenuTwo from "../../svg/TogelMenuTwo/Index";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import FilterSidebar from "./FilterSidevbar/FilterSidebar";
import useFetch from "../../hooks/useFetch";
import { useSearch } from "../../context/SearchContext";
import unitedStates from "../assets/unitedStates.png";
import uaeIcon from "../assets/uaeIcon.png";
import useClickOutside from "../../hooks/useClickOutside";
import { SearchDropdown } from "../../utils/SearchDropDown";
import { ChevronDown, LogOut, LogIn } from "lucide-react";

const isWindows = navigator.userAgent.includes("Windows");

const NavBar = ({ setIsModalOpen }) => {
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const {
    setFilterProp,
    filterProp,
    setSearchState,
    searchState,
    initialState,
  } = useSearch();

  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  const [showFlagsDropdown, setShowFlagsDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const dropDownLanguageRef = useClickOutside(() =>
    setShowFlagsDropdown(false)
  );
  const dropDownCountryRef = useClickOutside(() =>
    setShowCountriesDropdown(false)
  );
  const dropDownCourseRef = useClickOutside(() =>
    setShowCoursesDropdown(false)
  );
  const searchContainerRef = useRef(null);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null); // Ref for the dropdown list
  const API_URL = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const { data: KeywordData } = useFetch(
    `https://edu-brink-backend.vercel.app/api/keyword`,
    false
  );

  const { data: CoursesData } = useFetch(
    `https://edu-brink-backend.vercel.app/api/course/getAll/GetAllCourse`,
    false
  );

  // const { data: FacultyData } = useFetch(
  //   `https://edu-brink-backend.vercel.app/api/faculty?limit=5`,
  //   false
  // );

  const { data: CountryData } = useFetch(
    "https://edu-brink-backend.vercel.app/api/country/fields/query?fields=countryName,countryCode,countryPhotos,customURLSlug",
    false
  );
  const navigate = useNavigate();
  const location = useLocation();
  const keywords = KeywordData || [];

  const languageLabels = {
    en: {
      text: "English",
      emoji: "🇺🇸",
      code: "us",
    },
    ar: {
      text: "العربية",
      emoji: "🇦🇪",
      code: "ae",
    },
  };

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}");
      setIsLoggedIn(!!userInfo?.token); // Set to true if token exists
    };

    // Check on initial load
    checkLoginStatus();

    // Set up an interval to check periodically
    const intervalId = setInterval(checkLoginStatus, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      // Auto-close mobile search on resize to desktop
      if (window.innerWidth >= 768 && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSearchOpen]);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    updateNavbarHeight(); // Initial calculation
    window.addEventListener("resize", updateNavbarHeight); // Recalculate on window resize

    return () => {
      window.removeEventListener("resize", updateNavbarHeight); // Cleanup event listener
    };
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        isSearchOpen
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const getIconForType = (type) => {
    switch (type) {
      case "blog":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V13.3333C2 13.7015 2.29848 14 2.66667 14H13.3333C13.7015 14 14 13.7015 14 13.3333V2.66667C14 2.29848 13.7015 2 13.3333 2Z"
              stroke="#3A86FF"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.33334 4.66667H10.6667"
              stroke="#3A86FF"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.33334 8H10.6667"
              stroke="#3A86FF"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.33334 11.3333H8.00001"
              stroke="#3A86FF"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "country":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z"
              stroke="#FF3B30"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 14.6667C10.6667 12 13.3333 9.61333 13.3333 6.66667C13.3333 3.72 10.9467 1.33334 8 1.33334C5.05333 1.33334 2.66667 3.72 2.66667 6.66667C2.66667 9.61333 5.33333 12 8 14.6667Z"
              stroke="#FF3B30"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "university":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M1.33334 6.66667L8 2L14.6667 6.66667L8 11.3333L1.33334 6.66667Z"
              stroke="#34C759"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.33334 8V12"
              stroke="#34C759"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.6667 8V12"
              stroke="#34C759"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.33334 12H14.6667"
              stroke="#34C759"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "course":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M2.66667 2H13.3333C14.0667 2 14.6667 2.6 14.6667 3.33333V12.6667C14.6667 13.4 14.0667 14 13.3333 14H2.66667C1.93333 14 1.33333 13.4 1.33333 12.6667V3.33333C1.33333 2.6 1.93333 2 2.66667 2Z"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.33333 1.33334V2.66667"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6667 1.33334V2.66667"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.33333 5.33334H14.6667"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "major":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M5.33333 10.6667V9.33333C5.33333 8.6 5.93333 8 6.66667 8H9.33333C10.0667 8 10.6667 8.6 10.6667 9.33333V10.6667"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 6.66667C8.73638 6.66667 9.33333 6.06971 9.33333 5.33333C9.33333 4.59695 8.73638 4 8 4C7.26362 4 6.66667 4.59695 6.66667 5.33333C6.66667 6.06971 7.26362 6.66667 8 6.66667Z"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 10.6667V9.33333C12 8.6 12.6 8 13.3333 8H14.6667"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.33333 10.6667V9.33333C1.33333 8.6 1.93333 8 2.66667 8H4"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6.66667C12.7364 6.66667 13.3333 6.06971 13.3333 5.33333C13.3333 4.59695 12.7364 4 12 4C11.2636 4 10.6667 4.59695 10.66667 5.33333C10.6667 6.06971 11.2636 6.66667 12 6.66667Z"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 6.66667C4.73638 6.66667 5.33333 6.06971 5.33333 5.33333C5.33333 4.59695 4.73638 4 4 4C3.26362 4 2.66667 4.59695 2.66667 5.33333C2.66667 6.06971 3.26362 6.66667 4 6.66667Z"
              stroke="#AF52DE"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
  };
  const handleDropdownToggle = (dropdownType) => {
    setShowCountriesDropdown((prev) =>
      dropdownType === "countries" ? !prev : false
    );
    setShowCoursesDropdown((prev) =>
      dropdownType === "courses" ? !prev : false
    );
    setShowFlagsDropdown((prev) => (dropdownType === "flags" ? !prev : false));
  };

  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);

    // Add or remove the overflow-hidden class on the body element
    if (!isMenuOpen) {
      document.body.classList.add("overflow-auto");
      document.body.classList.add("overflow-auto");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    }
  };

  const handleSelectTerm = (term) => {
    const customSlug = term.customURLSlug?.[language] || term.keyword;
    console.log(term);
    setSearchState({
      ...searchState,
      searchTerm: term.keyword, // Keep the selected keyword in search input
      filteredResults: [],
      selectedIndex: null,
    });

    if (term.type === "country") {
      navigate(`/${language}/country/${customSlug}`);
    } else if (term.type === "tag") {
      setFilterProp((prev) => ({
        ...prev,
        searchQuery: {
          en: language === "en" ? term.keyword : prev.searchQuery.en, // Update only relevant language
          ar: language === "ar" ? term.keyword : prev.searchQuery.ar,
        },
      }));
      navigate(`/${language}/searchresults`);
    } else if (term.type === "university") {
      navigate(`/${language}/university/${customSlug}`);
    } else if (term.type === "course") {
      navigate(`/${language}/courses/${customSlug}`);
    } else if (term.type === "blog") {
      navigate(`/${language}/blog/${customSlug}`);
    } else if (term.type === "major") {
      navigate(`/${language}/major/${customSlug}`);
    } else {
      navigate(`/${language}/searchresults`);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Close mobile search after selection
    if (windowWidth < 768) {
      setIsSearchOpen(false);
    }
  };

  const handleSearchInput = (eventOrValue) => {
    const value =
      typeof eventOrValue === "string"
        ? eventOrValue
        : eventOrValue?.target?.value;

    if (value === undefined) return; // Prevents errors if value is missing

    setSearchState((prevState) => ({
      ...prevState,
      searchTerm: value.toLowerCase(),
    }));

    // Process keywords for standard structures (blog, country, university, course)
    const matchedKeywords = keywords
      .filter((item) => item.type !== "tag") // Exclude "tag" for now
      .flatMap((item) =>
        item.data
          .filter((entry) =>
            entry.keywords.some((keyword) =>
              keyword.toLowerCase().includes(value.toLowerCase())
            )
          )
          .map((entry) => ({
            type: item.type,
            keyword: entry.keywords.find((keyword) =>
              keyword.toLowerCase().includes(value.toLowerCase())
            ), // Keep matched keyword
            customURLSlug: entry.customURLSlug, // Include the slug
          }))
      );

    // Process keywords for "tag" structure (inside `data`)
    const tagData = keywords.find((item) => item.type === "tag");
    const tagKeywords = tagData
      ? tagData.data.flatMap((tag) =>
          [...tag.keywords.en, ...tag.keywords.ar] // Merge English & Arabic tags
            .filter((keyword) =>
              keyword.toLowerCase().includes(value.toLowerCase())
            )
            .map((keyword) => ({
              keyword,
              type: "tag",
              customURLSlug: tag.customURLSlug || null,
            }))
        )
      : [];

    const filteredResults = [...matchedKeywords, ...tagKeywords];

    setSearchState((prevState) => ({
      ...prevState,
      filteredResults,
    }));
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      searchState.selectedIndex !== null &&
      searchState.filteredResults.length > 0
    ) {
      const selectedTerm =
        searchState.filteredResults[searchState.selectedIndex];
      handleSelectTerm(selectedTerm);
    } else if (
      e.key === "ArrowDown" &&
      searchState.selectedIndex < searchState.filteredResults.length - 1
    ) {
      setSearchState((prevState) => {
        const newIndex = prevState.selectedIndex + 1;

        // Scroll into view
        if (dropdownRef.current) {
          const item = dropdownRef.current.children[newIndex];
          if (item) {
            item.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }

        return { ...prevState, selectedIndex: newIndex };
      });
    } else if (e.key === "ArrowUp" && searchState.selectedIndex > 0) {
      setSearchState((prevState) => {
        const newIndex = prevState.selectedIndex - 1;

        // Scroll into view
        if (dropdownRef.current) {
          const item = dropdownRef.current.children[newIndex];
          if (item) {
            item.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }

        return { ...prevState, selectedIndex: newIndex };
      });
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    navigate(`/${lang}${location.pathname.substring(3)}${location.search}`); // Update URL while keeping the existing path
    setShowFlagsDropdown(false); // Close dropdown
  };

  const countActiveFilters = () => {
    let count = 0;
    Object.keys(filterProp).forEach((key) => {
      if (
        JSON.stringify(filterProp[key]) !== JSON.stringify(initialState[key])
      ) {
        count++;
      }
    });
    return count;
  };

  const activeFilters = countActiveFilters();

  useEffect(() => {
    if (
      searchState.filteredResults.length > 0 &&
      searchState.selectedIndex === null
    ) {
      setSearchState((prevState) => ({
        ...prevState,
        selectedIndex: 0, // Set to the first item
      }));
    }
  }, [searchState.filteredResults, searchState.selectedIndex, setSearchState]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCoursesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSelectResult = (result) => {
    handleSelectTerm(result);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("eduuserInfo");
    // Redirect to home page
    navigate(`/${language}`);
    // Update login state
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    // Instead of navigating, open the auth modal
    if (setIsModalOpen) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="w-full my-3 h-auto sticky mmd:static top-0 z-30 bg-[#F8F8F8] mmd:bg-transparent">
        <nav
          id="navbar"
          className="sticky mmd:static top-0 z-30 flex py-4 md:py-2 mb-2 items-center w-[98%] mx-auto mmd:justify-between px-4 text-sm bg-white rounded-xl md:rounded-xl shadow-[30px]"
        >
          {/* Logo */}
          <div className="flex gap-3 items-center w-auto h-auto justify-center relative">
            <span className="flex mmd:hidden" onClick={toggleSidebar}>
              {isMenuOpen ? <TogelMenuTwo /> : <TogelMenu />}
            </span>

            <h2 className="text-xl mmd:text-2xl font-semibold bg-white cursor-pointer pointer text-gray-800">
              <Link to={`/${language}`}>Edubrink</Link>
            </h2>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden mmd:flex text-sm items-center text-center rounded-full px-2 py-2 w-1/4 relative">
            <SearchDropdown
              searchTerm={searchState.searchTerm}
              onSearch={handleSearchInput}
              onSelectResult={handleSelectTerm}
              getIconForType={getIconForType}
              results={searchState.filteredResults}
              placeholder={t("search_placeholder")}
              language={language}
              dropdownRef={dropdownRef}
            />
          </div>

          {/* Mobile Search & Language Toggle */}
          <div
            className={`absolute ${
              language === "ar" ? "left-1" : "right-1"
            } flex justify-end gap-1 items-center mmd:hidden`}
          >
            {/* Search Button */}
            <div
              className="h-auto bg-[#F8F8F8] rounded-full w-auto p-2 hover:bg-gray-200 transition-colors"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
              }}
            >
              <Search />
            </div>

            {/* Language Dropdown */}
            <div className="relative inline-block">
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-200 ease-in-out hover:shadow-md"
                onClick={() => handleDropdownToggle("flags")}
              >
                <img
                  src={language === "ar" ? uaeIcon : unitedStates}
                  alt={languageLabels[language].text}
                  className="w-5 h-5 object-cover rounded-full"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {showFlagsDropdown && (
                <ul
                  id="divshadow"
                  ref={dropDownLanguageRef}
                  className={`absolute top-10 z-30 ${
                    language === "ar" ? "left-0" : "right-0"
                  } mt-2 w-40 bg-white border rounded-xl shadow-xl
      transform transition-all duration-300 ease-in-out opacity-100 scale-100  origin-top`}
                >
                  <li
                    className="cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition-colors duration-200 first:rounded-t-xl"
                    onClick={() => {
                      changeLanguage("en");
                    }}
                  >
                    <img
                      src={unitedStates}
                      alt={"USAICON"}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                    English
                  </li>
                  <li
                    className="cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition-colors duration-200 last:rounded-b-xl"
                    onClick={() => {
                      changeLanguage("ar");
                    }}
                  >
                    <img
                      src={uaeIcon}
                      alt={"UAEICON"}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                    العربية
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden mmd:flex items-center bg-white space-x-8 relative z-40">
            {/* Courses Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-800 hover:text-[#652986] transition-colors">
                <span>{t("courses")}</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                <DropdowneCourses
                  data={CoursesData}
                  // facultyData={FacultyData}
                  setShowCoursesDropdown={setShowCoursesDropdown}
                />
              </div>
            </div>

            {/* Countries Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1  text-sm  font-medium text-gray-800 hover:text-[#652986] transition-colors">
                <span>{t("countries")}</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                <DropdownContries
                  data={CountryData}
                  setShowCountriesDropdown={setShowCountriesDropdown}
                />
              </div>
            </div>

            {/* About Link */}
            <Link
              to={`/${language}/about`}
              className=" text-sm  font-medium text-gray-800 hover:text-[#652986] transition-colors"
            >
              {t("about")}
            </Link>

            <Link
              to={`/${language}/contact`}
              className=" text-sm  font-medium text-gray-800 hover:text-[#652986] transition-colors"
            >
              {t("contactUs")}
            </Link>

            {/* Language Dropdown */}
            <div className="relative group">
              {" "}
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-800 hover:text-[#652986] transition-colors">
                <img
                  src={language === "ar" ? uaeIcon : unitedStates}
                  alt={languageLabels[language].text}
                  className="w-5 h-5 object-cover rounded-full"
                />

                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <div className="py-1 rounded-xl">
                  <button
                    onClick={() => changeLanguage("en")}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img
                      src={unitedStates}
                      alt={"USAICON"}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img
                      src={uaeIcon}
                      alt={"UAEICON"}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                    العربية
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Login/Logout Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden mmd:flex px-6 py-2.5 text-sm font-medium items-center text-white rounded-full bg-[#3b3d8d] hover:bg-[#4A2370] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("logOut")}
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="hidden mmd:flex px-6 py-2.5 text-sm items-center font-medium text-white rounded-full bg-[#3b3d8d] hover:bg-[#4A2370] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {t("login")}
            </button>
          )}
        </nav>
      </div>

      {/*   All Dropdown Divs  */}
      {showCountriesDropdown && (
        <DropdownContries
          data={CountryData}
          ref={dropDownCountryRef}
          setShowCountriesDropdown={setShowCountriesDropdown}
          navbarHeight={navbarHeight}
        />
      )}
      {showCoursesDropdown && (
        <DropdowneCourses
          data={CoursesData}
          // facultyData={FacultyData}
          ref={dropDownCourseRef}
          setShowCoursesDropdown={setShowCoursesDropdown}
          navbarHeight={navbarHeight}
        />
      )}
      {isMenuOpen && (
        <SideBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      )}

      {/* Mobile Search Bar - Improved UI */}
      {isSearchOpen && (
        <div
          ref={searchContainerRef}
          dir={language === "ar" ? "rtl" : "ltr"}
          className="fixed top-0 left-0 right-0 z-40 bg-white shadow-lg transition-all duration-300 ease-in-out"
        >
          <div className="flex items-center p-4 border-b">
            {/* Back button */}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Search input */}
            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchState.searchTerm}
                onChange={handleSearchInput}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className="bg-transparent outline-none text-gray-800 w-full text-sm placeholder-gray-500"
                autoFocus
              />

              {/* Clear button */}
              {searchState.searchTerm && (
                <button
                  onClick={() =>
                    setSearchState((prev) => ({
                      ...prev,
                      searchTerm: "",
                      filteredResults: [],
                    }))
                  }
                  className="ml-2 p-1 rounded-full hover:bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter button */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <FilterLogo />
              </button>

              {/* Filter badge */}
              {activeFilters > 0 && (
                <div className="absolute top-[-5px] right-[-5px] w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-red-500 rounded-full shadow-md border-2 border-white">
                  {activeFilters}
                </div>
              )}
            </div>
          </div>

          {/* Search results */}
          {searchState.searchTerm && searchState.filteredResults.length > 0 && (
            <div
              ref={dropdownRef}
              className="max-h-[70vh] overflow-y-auto bg-white"
            >
              {searchState.filteredResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 border-b ${
                    index === searchState.selectedIndex
                      ? "bg-blue-50"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => onSelectResult(result)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
                      {getIconForType(result.type)}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">
                        {result.keyword}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {result.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {searchState.searchTerm &&
            searchState.filteredResults.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p>{t("noResultsFound") || "No results found"}</p>
                <p className="text-sm mt-2">
                  {t("tryDifferentKeywords") ||
                    "Try different keywords or check spelling"}
                </p>
              </div>
            )}
        </div>
      )}

      {showFilter && (
        <FilterSidebar showFilter={showFilter} setShowFilter={setShowFilter} />
      )}
    </>
  );
};

export default NavBar;
