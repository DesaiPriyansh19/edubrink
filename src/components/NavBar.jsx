import { useContext, useState, useEffect, useRef } from "react";
import flag from "../assets/Flags/UKFlag.png";
import usa from "../assets/Flags/USAflag.png";
import Search from "../../svg/caplogo/Logo/Search";
import { Link, useNavigate } from "react-router-dom";

import SideBar from "./SideBar";
import FilterLogo from "../../svg/FilterLogo";
import DropdowneCourses from "./DropdowneCourses";
import DropdownContries from "./DropdownContries";
import i18n from "../i18n";
import TogelMenu from "../../svg/TogelMenu/Index";
import TogelMenuTwo from "../../svg/TogelMenuTwo/Index";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "./LanguageContext";
import FilterSidebar from "./FilterSidevbar/FilterSidebar";
import useFetch from "../../hooks/useFetch";
import { useSearch } from "../../context/SearchContext";

const NavBar = () => {
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showFlagsDropdown, setShowFlagsDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const { data, loading } = useFetch(
    "https://edu-brink-backend.vercel.app/api/keyword"
  );
  const navigate = useNavigate(); // To programmatically navigate
  const { filterProp, setFilterProp } = useSearch();
  const [searchState, setSearchState] = useState({
    searchTerm: "",
    filteredResults: [],
    selectedIndex: null,
  });

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
  const handleClick = () => {
    setShowCountriesDropdown(!showCountriesDropdown);
    setShowCoursesDropdown(false);
    setShowFlagsDropdown(false);
  };
  const handleClickTwo = () => {
    setShowCoursesDropdown(!showCoursesDropdown);
    setShowCountriesDropdown(false);
    setShowFlagsDropdown(false);
  };
  const handleClickThree = () => {
    setShowCoursesDropdown(false);

    setShowCountriesDropdown(false);
    setShowFlagsDropdown(!showFlagsDropdown);
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
      navigate(`/country/${term.keyword}`);
    } else {
      navigate(`/searchresults`);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchState((prevState) => ({
      ...prevState,
      searchTerm: value,
    }));

    // Filter keywords based on the search input, keeping the type/category information
    const matchedKeywords = keywords
      .map((item) => ({
        type: item.type,
        keywords: item.keywords.filter((keyword) =>
          keyword.toLowerCase().includes(value.toLowerCase())
        ),
      }))
      .filter((item) => item.keywords.length > 0); // Only keep categories that have matching keywords

    // Flatten the filtered results to pass only matched keywords with their types
    const filteredResults = matchedKeywords.flatMap((item) =>
      item.keywords.map((keyword) => ({
        keyword,
        type: item.type,
      }))
    );

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
      setSearchState((prevState) => ({
        ...prevState,
        selectedIndex: prevState.selectedIndex + 1, // Move down
      }));
    } else if (e.key === "ArrowUp" && searchState.selectedIndex > 0) {
      setSearchState((prevState) => ({
        ...prevState,
        selectedIndex: prevState.selectedIndex - 1, // Move up
      }));
    }
  };

  const getItemClass = (index) => {
    return index === searchState.selectedIndex
      ? "bg-gray-200"
      : "hover:bg-gray-200";
  };

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

  return (
    <>
      <div className="w-full  my-3 h-auto sticky mmd:static top-0 z-30  bg-[#F8F8F8] mmd:bg-transparent">
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
              <Link to={"/"}>Edubrink</Link>
            </h2>{" "}
          </div>

          <div className="hidden mmd:flex text-sm items-center bg-[#F8F8F8] text-center rounded-full px-2 py-2 w-1/4 relative">
            <Link to="/searchresults">
              <div className="md:w-6 md:h-6 mr-2">
                <Search />
              </div>
            </Link>
            <input
              type="text"
              placeholder="Search for courses"
              value={searchState.searchTerm}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown} // Add the keydown event handler
              className="bg-transparent outline-none placeholder:text-black text-black w-full"
              ref={inputRef} // Assign ref to the input field
            />

            {/* Show suggestions */}
            {searchState.searchTerm &&
              searchState.filteredResults.length > 0 && (
                <div className="fixed bg-white shadow-md text-left top-[72px] rounded-md mt-2 max-h-60 w-1/4 overflow-y-auto z-10">
                  {searchState.filteredResults.map((item, index) => {
                    // Function to highlight and bold the keystroke in the keyword
                    const highlightedKeyword = item.keyword.replace(
                      new RegExp(`(${searchState.searchTerm})`, "gi"),
                      (match) => `<span class="font-bold">${match}</span>` // Bold and highlighted
                    );

                    console.log(item);

                    return (
                      <div
                        key={index}
                        className={`p-4 cursor-pointer border-b ${getItemClass(
                          index
                        )}`}
                        dangerouslySetInnerHTML={{ __html: highlightedKeyword }} // Render the HTML with highlighted keyword
                        onClick={() =>
                          handleSelectTerm(item.keyword, item.type)
                        } // Pass both keyword and type to handleSelectTerm
                      />
                    );
                  })}
                </div>
              )}
          </div>

          {/* Contry Dropdown in sm devices */}
          <div className="absolute right-1 flex justify-end gap-1 items-center  mmd:hidden">
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
                onClick={handleClickThree}
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
            <div onClick={handleClickTwo} className="relative cursor-pointer">
              <div className="flex items-center space-x-1 bg-white  hover:text-black hover:font-[20rem] text-gray-800">
                <p>
                  {" "}
                  <span className="bg-white font-medium">Courses</span>
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
                onClick={handleClick}
              >
                <span className=" font-medium bg-white">Countries</span>
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
                  <Link to="/about">About</Link>
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
            <div className="relative inline-block">
              <button
                className="flex  items-center space-x-2 px-3 py-2  rounded-full  text-gray-800 hover:bg-gray-100"
                onClick={handleClickThree}
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
            <button className="hidden mmd:flex px-4 py-2 w-auto text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754] transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-[#E15754] hover:to-[#380C95] hover:shadow-lg hover:ring-2 hover:ring-white">
              Contact Us
            </button>
          </Link>
        </nav>
      </div>

      {/*   All Dropdown Divs  */}

      {showFlagsDropdown && (
        <ul
          id="divshadow"
          style={{ top: `${navbarHeight}px` }} // Dynamically set top value
          className="fixed mmd:absolute z-10 right-[3%] mmd:right-[15%]  mt-2 w-40 bg-white border rounded-2xl shadow-lg"
        >
          <li
            className="cursor-pointer flex items-center mt-4 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setLanguage("en");
              setShowFlagsDropdown(false); // Close dropdown after selection
            }}
          >
            English
          </li>
          <li
            className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setLanguage("ar");
              setShowFlagsDropdown(false); // Close dropdown after selection
            }}
          >
            العربية
          </li>
        </ul>
      )}

      {showCountriesDropdown && (
        <DropdownContries
          setShowCountriesDropdown={setShowCountriesDropdown}
          navbarHeight={navbarHeight}
        />
      )}
      {showCoursesDropdown && (
        <DropdowneCourses
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
          className=" w-[95%] mx-auto mb-5   flex items-center justify-evenly mmd:hidden  bg-white rounded-3xl px-4 py-2 z-20 sticky top-[36%]"
        >
          <div className="flex w-full text-sm items-center justify-start  text-center rounded-full px-2 py-2">
            <div className=" mr-2 ">
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search for courses"
              className="bg-transparent  text-start outline-none text-black w-full"
            />
          </div>
          <div
            className="h-auto w-auto"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FilterLogo />
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
