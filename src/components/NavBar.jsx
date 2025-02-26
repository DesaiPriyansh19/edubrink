import { useState, useEffect, useRef } from "react";
import Search from "../../svg/caplogo/Logo/Search";
import { Link, useNavigate } from "react-router-dom";
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
  const { data } = useFetch(
    `https://edu-brink-backend.vercel.app/api/keyword`
  );

  const { data: CoursesData } = useFetch(
    `https://edu-brink-backend.vercel.app/api/course/getAll/GetAllCourse`
  );

  const { data: CountryData } = useFetch(
    "https://edu-brink-backend.vercel.app/api/country/fields/query?fields=countryName,countryPhotos"
  );
  const navigate = useNavigate();
  const keywords = data || [];

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
    setSearchState({
      ...searchState,
      searchTerm: term.keyword,
      filteredResults: [],
      selectedIndex: null,
    });

    if (term.type === "country") {
      navigate(`/${language}/country/${term.keyword}`);
    } else if (term.type === "tag") {
      setFilterProp((prev) => ({
        ...prev,
        searchQuery: {
          ...prev.searchQuery,
          en: term.tagName.en,
          ar: term.tagName.ar,
        },
      }));
      navigate(`/${language}/searchresults`);
    } else if (term.type === "university") {
      navigate(`/${language}/university/${term.keyword}`);
    } else if (term.type === "course") {
      navigate(`/${language}/courses/${term.keyword}`);
    } else {
      navigate(`/${language}/searchresults`);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchState((prevState) => ({
      ...prevState,
      searchTerm: value,
    }));

    // Process keywords for standard structures (blog, country, university, course)
    const matchedKeywords = keywords
      .filter((item) => item.type !== "tag") // Exclude "tag" for now
      .map((item) => ({
        type: item.type,
        keywords: item.keywords.filter((keyword) =>
          keyword.toLowerCase().includes(value)
        ),
      }))
      .filter((item) => item.keywords.length > 0);

    // Process keywords for "tag" structure (inside `data`)
    const tagData = keywords.find((item) => item.type === "tag");
    const tagKeywords = tagData
      ? tagData.data.flatMap((tag) =>
          tag.keywords
            .filter((keyword) => keyword.toLowerCase().includes(value))
            .map((keyword) => ({
              keyword,
              type: "tag",
              tagName: tag.TagName, // Include the tag name for reference
            }))
        )
      : [];

    // Flatten and merge both standard and tag-based results
    const filteredResults = [
      ...matchedKeywords.flatMap((item) =>
        item.keywords.map((keyword) => ({
          keyword,
          type: item.type,
        }))
      ),
      ...tagKeywords, // Add processed tag keywords
    ];

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

  const getItemClass = (index) => {
    return index === searchState.selectedIndex
      ? "bg-gray-200"
      : "hover:bg-gray-200";
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
  }, [searchState.filteredResults]);

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

  return (
    <>
      <div
        dir={language === "ar" ? "rtl" : "ltl"}
        className="w-full  my-3 h-auto sticky mmd:static top-0 z-30  bg-[#F8F8F8] mmd:bg-transparent"
      >
        <nav
          id="navbar"
          className="sticky mmd:static top-0 z-30 flex py-4 mb-2 items-center w-[98%] mx-auto  mmd:justify-between px-4 text-sm bg-white rounded-3xl shadow-md"
        >
          {/* Logo */}

          <div className="flex gap-3 items-center w-auto h-auto justify-center">
            <span className="flex mmd:hidden " onClick={toggleSidebar}>
              {isMenuOpen ? <TogelMenuTwo /> : <TogelMenu />}
            </span>
            <h2 className=" text-xl mmd:text-2xl font-bold bg-white cursor-pointer pointer text-gray-800">
              <Link to={`/${language}`}>Edubrink</Link>
            </h2>{" "}
          </div>

          <div
            dir={language === "ar" ? "rtl" : "ltl"}
            className="hidden mmd:flex text-sm items-center bg-[#F8F8F8] text-center rounded-full px-2 py-2 w-1/4 relative"
          >
            <Link to={`/${language}/searchresults`}>
              <div
                className={`md:w-6 md:h-6 ${
                  language === "ar" ? "ml-2" : "mr-2"
                }`}
              >
                <Search />
              </div>
            </Link>
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchState.searchTerm}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown} // Add the keydown event handler
              className="bg-transparent outline-none placeholder:text-black text-black w-full"
              ref={inputRef} // Assign ref to the input field
            />

            {/* Show suggestions */}
            {searchState.searchTerm &&
              searchState.filteredResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="fixed bg-white shadow-md text-left top-[72px] rounded-md mt-2 max-h-60 w-1/4 overflow-y-auto z-10"
                >
                  {searchState.filteredResults.map((item, index) => {
                    // Function to highlight and bold the keystroke in the keyword
                    const highlightedKeyword = item.keyword.replace(
                      new RegExp(`(${searchState.searchTerm})`, "gi"),
                      (match) => `<span class="font-bold">${match}</span>` // Bold and highlighted
                    );

                    return (
                      <div
                        key={index}
                        className={`p-4 cursor-pointer border-b ${getItemClass(
                          index
                        )}`}
                        dangerouslySetInnerHTML={{ __html: highlightedKeyword }} // Render the HTML with highlighted keyword
                        onClick={() => handleSelectTerm(item)} // Pass both keyword and type to handleSelectTerm
                      />
                    );
                  })}
                </div>
              )}
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
              <button
                className="flex  items-center space-x-2 px-3 py-2  rounded-full  text-gray-800 hover:bg-gray-100"
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
            </div>
          </div>

          {/* All Dropdowns Btns*/}
          <div className=" hidden  mmd:flex items-center bg-white space-x-6">
            {/* Courses Dropdown */}
            <div onClick={() => handleDropdownToggle("courses")} className="relative cursor-pointer">
              <div className="flex items-center space-x-1 bg-white  hover:text-black hover:font-[20rem] text-gray-800">
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
                className="flex items-center space-x-1 cursor-pointer bg-white text-gray-800"
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
            <div className="relative ">
              <button
                className="flex  items-center space-x-2 px-3 py-2  rounded-full  text-gray-800 hover:bg-gray-100"
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

      {showFlagsDropdown && (
        <ul
          id="divshadow"
          ref={dropDownLanguageRef}
          style={{ top: `${navbarHeight}px` }} // Dynamically set top value
          className={`fixed mmd:absolute z-30 right-[3%] ${
            language === "ar"
              ? "left-[3%] mmd:left-[15%]"
              : "right-[3%] mmd:right-[15%]"
          }  mmd:right-[15%] overflow-hidden  mt-2 w-40 bg-white border rounded-2xl shadow-lg`}
        >
          <li
            className="cursor-pointer flex items-center  px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              changeLanguage("en");
            }}
          >
            English
          </li>
          <li
            className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              changeLanguage("ar");
            }}
          >
            العربية
          </li>
        </ul>
      )}

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
          dir={language === "ar" ? "rtl" : "ltl"}
          className=" w-[95%] mx-auto mb-5   flex items-center justify-evenly mmd:hidden  bg-white rounded-3xl px-4 py-2 z-20 sticky top-[0%]"
        >
          <div className="flex w-full text-sm items-center justify-start  text-center rounded-full px-2 py-2">
            <Link to={`/${language}/searchresults`}>
              <div
                className={`md:w-6 md:h-6 ${
                  language === "ar" ? "ml-2" : "mr-2"
                }`}
              >
                <Search />
              </div>
            </Link>
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchState.searchTerm}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown} // Add the keydown event handler
              ref={inputRef} // Assign ref to the input field
              className="bg-transparent  text-start outline-none text-black w-full"
            />
            {searchState.searchTerm &&
              searchState.filteredResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="fixed bg-white shadow-md text-left top-[150px]  mx-auto rounded-md mt-2 max-h-60 w-[80%] overflow-y-auto z-10"
                >
                  {searchState.filteredResults.map((item, index) => {
                    // Function to highlight and bold the keystroke in the keyword
                    const highlightedKeyword = item.keyword.replace(
                      new RegExp(`(${searchState.searchTerm})`, "gi"),
                      (match) => `<span class="font-bold">${match}</span>` // Bold and highlighted
                    );

                    return (
                      <div
                        key={index}
                        className={`p-4 cursor-pointer border-b ${getItemClass(
                          index
                        )}`}
                        dangerouslySetInnerHTML={{ __html: highlightedKeyword }} // Render the HTML with highlighted keyword
                        onClick={() => handleSelectTerm(item)} // Pass both keyword and type to handleSelectTerm
                      />
                    );
                  })}
                </div>
              )}
          </div>
          <div
            className="h-auto relative w-auto"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FilterLogo />
            {activeFilters > 0 && (
              <div className="absolute top-[-6px] right-[-6px] w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-[#5A1EB8] to-[#FF6B6B] rounded-full shadow-md border-2 border-white">
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
