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
import useClickOutside from "../../hooks/useClickOutside";
import { SearchDropdown } from "../../utils/SearchDropDown";

const NavBar = () => {
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const {
    setFilterProp,
    filterProp,
    setSearchState,
    searchState,
    initialState,
  } = useSearch();

  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showFlagsDropdown, setShowFlagsDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const dropDownLanguageRef = useClickOutside(() =>
    setShowFlagsDropdown(false)
  );
  const dropDownCountryRef = useClickOutside(() =>
    setShowCountriesDropdown(false)
  );
  const dropDownCourseRef = useClickOutside(() =>
    setShowCoursesDropdown(false)
  );

  const inputRef = useRef(null);
  const dropdownRef = useRef(null); // Ref for the dropdown list
  const API_URL = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const { data: KeywordData } = useFetch(
    `https://edu-brink-backend.vercel.app/api/keyword`
  );

  const { data: CoursesData } = useFetch(
    `https://edu-brink-backend.vercel.app/api/course/getAll/GetAllCourse`
  );

  const { data: FacultyData } = useFetch(
    `https://edu-brink-backend.vercel.app/api/faculty`
  );

  const { data: CountryData } = useFetch(
    "https://edu-brink-backend.vercel.app/api/country/fields/query?fields=countryName,countryPhotos,customURLSlug"
  );
  const navigate = useNavigate();
  const location = useLocation();
  const keywords = KeywordData || [];

  const languageLabels = {
    en: "English",
    ar: "العربية",
  };

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
    } else {
      navigate(`/${language}/searchresults`);
    }

    if (inputRef.current) {
      inputRef.current.focus();
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
    navigate(`/${lang}${location.pathname.substring(3)}`); // Update URL while keeping the existing path
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

  return (
    <>
      <div
        dir={language === "ar" ? "rtl" : "ltl"}
        className="w-full  my-3 h-auto sticky mmd:static top-0 z-30  bg-[#F8F8F8] mmd:bg-transparent"
      >
        <nav
          id="navbar"
          className="sticky mmd:static top-0 z-30 flex py-2 mb-2 items-center w-[98%] mx-auto  mmd:justify-between px-4 text-sm bg-white rounded-3xl shadow-md"
        >
          {/* Logo */}

          <div className="flex gap-3 items-center w-auto h-auto justify-center">
            <span className="flex mmd:hidden " onClick={toggleSidebar}>
              {isMenuOpen ? <TogelMenuTwo /> : <TogelMenu />}
            </span>
            <h2 className=" text-xl mmd:text-2xl font-semibold bg-white cursor-pointer pointer text-gray-800">
              <Link to={`/${language}`}>Edubrink</Link>
            </h2>{" "}
          </div>

          <div 
            dir={language === "ar" ? "rtl" : "ltl"}
            className="hidden mmd:flex text-sm items-center   text-center rounded-full px-2 py-2 w-1/4 relative "
          >
            <SearchDropdown
              searchTerm={searchState.searchTerm}
              onSearch={handleSearchInput}
              onSelectResult={handleSelectTerm}
              getIconForType={getIconForType}
              results={searchState.filteredResults}
              placeholder={t("search_placeholder")}
              language={language}
              dropdownRef={dropdownRef} // Pass ref to the SearchDropdown
            />
          </div>

          {/* Contry Dropdown in sm devices */}
          <div
            className={`absolute ${
              language === "ar" ? "left-1" : "right-1"
            }  flex justify-end gap-1 items-center  mmd:hidden`}
          >
            {/* Search Bar */}
            <div
              className="h-auto bg-[#F8F8F8] rounded-full w-auto p-2"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
              }}
            >
              <Search />
            </div>
            {/* language Dropdown */}
            <div className="relative inline-block">
              {" "}
              {/* Updated: Added position: relative */}
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-200 ease-in-out hover:shadow-md"
                onClick={() => handleDropdownToggle("flags")}
              >
                <span>{languageLabels[language]}</span>
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
                  className={`absolute top-10 mmd:top-8 z-30 ${
                    language === "ar" ? "left-0" : " right-0 mmd:-right-[75px]"
                  } mt-2 w-40 bg-white border rounded-xl shadow-xl
    transform transition-all duration-300 ease-in-out opacity-100 scale-100 origin-top`}
                >
                  <li
                    className="cursor-pointer flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200 first:rounded-t-xl"
                    onClick={() => {
                      changeLanguage("en");
                    }}
                  >
                    <span className="mr-2">🇺🇸</span> English
                  </li>
                  <li
                    className="cursor-pointer flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200 last:rounded-b-xl"
                    onClick={() => {
                      changeLanguage("ar");
                    }}
                  >
                    <span className="mr-2">🇦🇪</span> العربية
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* All Dropdowns Btns*/}
          <div className=" hidden  mmd:flex items-center bg-white space-x-6">
            {/* Courses Dropdown */}
            <div
              onClick={() => handleDropdownToggle("courses")}
              className="relative cursor-pointer"
            >
              <div className="flex items-center space-x-1 bg-white hover:text-black text-gray-800 transition-all duration-200 ease-in-out hover:scale-105 transform px-2 py-1 rounded-lg">
                <p>
                  {" "}
                  <span className="bg-white font-medium">{t("courses")}</span>
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 bg-white "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            {/* Countries Dropdown */}
            <div className="relative bg-white rounded-full ">
              <div
                className="flex items-center space-x-1 cursor-pointer bg-white text-gray-800 transition-all duration-200 ease-in-out hover:scale-105 transform px-2 py-1 rounded-lg"
                onClick={() => handleDropdownToggle("countries")}
              >
                <span className=" font-medium bg-white">{t("countries")}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4  bg-white h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAboutDropdown(!showAboutDropdown)}
                className="flex items-center space-x-1 bg-white text-gray-800"
              >
                <span className=" bg-white font-medium ">
                  <Link to={`/${language}/about`}>{t("about")}</Link>
                </span>
              </button>
              {showAboutDropdown && (
                <></>
                // <ul className="absolute right-0 mt-2 bg-white rounded-md shadow-lg">
                //   <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
                //     Our Team
                //   </li>
                //   <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
                //     Careers
                //   </li>
                //   <li className="px-4 py-2  bg-white  hover:bg-gray-100 cursor-pointer">
                //     Contact Us
                //   </li>
                // </ul>
              )}
            </div>
            {/* language Dropdown */}
            <div className="relative">
              {" "}
              {/* Updated: Added position: relative */}
              <button
                className="flex  items-center space-x-2 px-3 py-2  rounded-full  text-gray-800 hover:bg-gray-100 transition-all duration-200 ease-in-out hover:shadow-md"
                onClick={() => handleDropdownToggle("flags")}
              >
                <span>{languageLabels[language]}</span>
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
                  className={`absolute top-8 z-30 ${
                    language === "ar" ? "left-0" : "right-0 mmd:-right-[75px]"
                  } mt-2 w-40 bg-white border rounded-xl shadow-xl
    transform transition-all duration-300 ease-in-out opacity-100 scale-100 origin-top`}
                >
                  <li
                    className="cursor-pointer flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200 first:rounded-t-xl"
                    onClick={() => {
                      changeLanguage("en");
                    }}
                  >
                    <span className="mr-2">🇺🇸</span> English
                  </li>
                  <li
                    className="cursor-pointer flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200 last:rounded-b-xl"
                    onClick={() => {
                      changeLanguage("ar");
                    }}
                  >
                    <span className="mr-2">🇦🇪</span> العربية
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Contact Us Button */}
          <Link to={"/contact"}>
            <button className="hidden mmd:flex px-4 py-2 w-auto text-sm text-white rounded-full bg-[#3A3D8D] transition-all duration-300 ease-in-out transform hover:scale-105  hover:shadow-lg hover:ring-2 hover:ring-white">
              {t("contactUs")}
            </button>
          </Link>
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
          facultyData={FacultyData}
          ref={dropDownCourseRef}
          setShowCoursesDropdown={setShowCoursesDropdown}
          navbarHeight={navbarHeight}
        />
      )}
      {isMenuOpen && (
        <SideBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      )}

      {isSearchOpen && (
        <div
          id="divshadow"
          dir={language === "ar" ? "rtl" : "ltr"}
          className="w-[95%] mx-auto mb-5 flex items-center justify-between bg-white rounded-full px-4 py-3 shadow-lg ring-1 ring-gray-200 sticky top-0 z-20"
        >
          {/* 🔍 Search Input Section */}
          <div className="relative flex items-center w-full">
            <Search className="w-5 h-5 text-gray-500 mr-3" />

            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchState.searchTerm}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              className="bg-transparent outline-none text-gray-800 w-full text-sm placeholder-gray-500"
            />

            {/* 🔽 Search Results Dropdown */}
            {searchState.searchTerm &&
              searchState.filteredResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="fixed left-0 top-[200px] w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto z-30"
                >
                  {searchState.filteredResults.map((result, index) => (
                    <div
                      key={result._id}
                      className={`dropdown-item flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 ${
                        index === searchState.selectedIndex
                          ? "bg-blue-50"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => onSelectResult(result)}
                    >
                      {/* 🏛 Icon + Name */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
                          {getIconForType(result.type)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {result.keyword}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* 🎛 Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <FilterLogo />
            </button>

            {/* 🔴 Filter Badge */}
            {activeFilters > 0 && (
              <div className="absolute top-[-5px] right-[-5px] w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-red-500 rounded-full shadow-md border-2 border-white">
                {activeFilters}
              </div>
            )}
          </div>
        </div>
      )}
      {showFilter && (
        <FilterSidebar showFilter={showFilter} setShowFilter={setShowFilter} />
      )}
    </>
  );
};

export default NavBar;
