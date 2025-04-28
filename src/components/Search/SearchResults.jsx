"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import FilterSidebar from "../FilterSidevbar/FilterSidebar";
import FilterLogo2 from "../../../svg/FilterLogo2";
import Results from "./Results/Results";
import Article from "./Article";
import ContactSection from "../ContactSection";
import Univrsiry from "./Results/University";

import ExploreTopUniversity from "./ExploreTopUniversity";
import ExploreBlogs from "./ExploreBlogs";
import { useSearch } from "../../../context/SearchContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import NoResultsFound from "../../../utils/NoResultsFound";
import ExploreTopMajor from "./ExploreTopMajor";
import ResultsMajors from "./Results/ResultsMajors";

function SearchResults() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showFilter, setShowFilter] = useState(false);
  const location = useLocation();
  const { filterProp, setSumData, sumData, initialState } = useSearch();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(true); // New state to track if we have results

  const prevFilterStringRef = useRef(null);

  const API_BASE_URL = "https://edu-brink-backend.vercel.app/api/search";

  const memoizedUniIds = useMemo(
    () => searchResults?.universities?.map((item) => item._id) || [],
    [searchResults?.universities]
  );

  const memoizedCountryIds = useMemo(
    () => searchResults?.countries?.map((item) => item._id) || [],
    [searchResults?.countries]
  );

  const fetchSearchResults = async (filterProp) => {
    try {
      // ✅ Extract only the relevant filters for each API
      const countryFilters = {
        Destination: filterProp.Destination || [],
      };
      const queryParam = encodeURIComponent(JSON.stringify(countryFilters));

      const universityFilters = {};

      // Only add properties that have actual values
      if (filterProp.StudyLevel)
        universityFilters.StudyLevel = filterProp.StudyLevel;
      if (filterProp.EntranceExam)
        universityFilters.EntranceExam = filterProp.EntranceExam;
      if (filterProp.ModeOfStudy)
        universityFilters.ModeOfStudy = filterProp.ModeOfStudy;
      if (filterProp.minBudget !== 0)
        universityFilters.minBudget = filterProp.minBudget;
      if (filterProp.maxBudget !== 100000)
        universityFilters.maxBudget = filterProp.maxBudget;
      if (filterProp.MajorDuration)
        // Changed from CourseDuration
        universityFilters.MajorDuration = filterProp.MajorDuration; // Changed from CourseDuration
      if (filterProp.UniType) universityFilters.UniType = filterProp.UniType;
      if (filterProp.IntakeYear)
        universityFilters.IntakeYear = filterProp.IntakeYear;
      if (filterProp.IntakeMonth)
        universityFilters.IntakeMonth = filterProp.IntakeMonth;

      // Handle searchQuery separately since it's an object
      if (
        filterProp.searchQuery &&
        (filterProp.searchQuery.en || filterProp.searchQuery.ar)
      ) {
        universityFilters.searchQuery = JSON.stringify(filterProp.searchQuery);
      }

      const majorFilters = {}; // Changed from courseFilters
      majorFilters.universityIds = ""; // This will be updated after fetching universities
      if (filterProp.ModeOfStudy)
        majorFilters.ModeOfStudy = filterProp.ModeOfStudy;
      if (filterProp.MajorDuration)
        // Changed from CourseDuration
        majorFilters.MajorDuration = filterProp.MajorDuration; // Changed from CourseDuration
      if (filterProp.minBudget) majorFilters.minBudget = filterProp.minBudget;
      if (filterProp.maxBudget) majorFilters.maxBudget = filterProp.maxBudget;

      if (filterProp.StudyLevel)
        majorFilters.StudyLevel = filterProp.StudyLevel;
      if (filterProp.IntakeYear)
        majorFilters.IntakeYear = filterProp.IntakeYear;
      if (filterProp.IntakeMonth)
        majorFilters.IntakeMonth = filterProp.IntakeMonth;

      // Handle searchQuery for majors
      if (
        filterProp.searchQuery &&
        (filterProp.searchQuery.en || filterProp.searchQuery.ar)
      ) {
        majorFilters.searchQuery = JSON.stringify(filterProp.searchQuery);
      }

      // ✅ Step 1: Fetch Countries First
      const { data: countryData } = await axios.get(
        `${API_BASE_URL}?filterProp=${queryParam}`
      );

      // Extract country IDs
      const countryIds = countryData.data.map((country) => country._id);

      // ✅ Step 2: Fetch Universities Based on Country IDs
      const { data: universityData } = await axios.get(
        `${API_BASE_URL}/university`,
        {
          params: { ...universityFilters, countryIds: countryIds.join(",") },
        }
      );

      // Extract university IDs
      const universityIds = universityData.data.map((uni) => uni._id);
      majorFilters.universityIds = universityIds.join(",");

      // ✅ Step 3: Fetch Majors Based on University IDs
      const [majorData, blogData] = await Promise.all([
        axios.get(`${API_BASE_URL}/major`, { params: majorFilters }), // Changed from course to major
        axios.get(`${API_BASE_URL}/blog`, {
          params: { countryIds: countryIds.join(",") },
        }),
      ]);

      // ✅ Return Final Combined Data
      return {
        countries: countryData.data,
        universities: universityData.data,
        majors: majorData.data.data, // Changed from courses to majors
        blogs: blogData.data.data,
        pagination: {
          universities: universityData.pagination,
          majors: majorData.data.pagination, // Changed from courses to majors
          blogs: blogData.data.pagination,
        },
      };
    } catch (error) {
      console.error("Error fetching search results:", error);
      return { error: error.response?.data || "Something went wrong" };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Create a stable reference for the current filter props
      const currentFilterString = JSON.stringify(filterProp);

      // Skip fetch if the filter hasn't actually changed
      if (prevFilterStringRef.current === currentFilterString) {
        console.log("Skipping fetch - filter hasn't changed");
        return;
      }

      console.log("Fetching data with new filters");
      prevFilterStringRef.current = currentFilterString;

      // Show loading state
      setLoading(true);
      setHasResults(true); // Reset hasResults state before fetching

      const data = await fetchSearchResults(filterProp);
      setSearchResults(data);
      setLoading(false);

      // Calculate total results
      const totalUniversities =
        data?.pagination?.universities.totalUniversities || 0;
      const totalBlogs = data?.pagination?.blogs.totalBlogs || 0;
      const totalMajors = data?.pagination?.majors.totalMajors || 0; // Changed from totalCourses
      const totalResults = totalUniversities + totalBlogs + totalMajors;

      // Update sumData with the new counts
      setSumData({
        sumResult: totalResults,
        sumUniversities: totalUniversities,
        sumBlogs: totalBlogs,
        sumMajors: totalMajors, // Changed from sumCourses
      });

      // Set hasResults based on total count
      setHasResults(totalResults > 0);
    };

    fetchData();
  }, [filterProp]);

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

  // If we have no results and we're not loading, show the NoResultsFound component
  if (!hasResults && !loading && searchResults) {
    return (
      <>
        <div className="relative p-4 px-5 sm:px-9 lg:px-16">
          {/* Buttons */}
          <div className="flex items-center sm:mb-16 md:mb-20 text-sm justify-between overflow-x-auto whitespace-nowrap no-scrollbar">
            <div className="flex space-x-4">
              <Link to={`/${language}/searchresults`}>
                <button
                  className={`text-sm font-medium flex rounded-full justify-center items-center px-4 py-2 ${
                    location.pathname === `/${language}/searchresults`
                      ? "bg-black text-white"
                      : "text-black"
                  }`}
                >
                  <span className="font-thin mr-1">0</span>
                  {t("results")}
                </button>
              </Link>

              <Link to={`/${language}/searchresults/majors`}>
                <button
                  className={`text-sm font-medium flex rounded-full justify-center items-center px-4 py-2 ${
                    location.pathname === `/${language}/searchresults/majors`
                      ? "bg-black text-white"
                      : "text-black"
                  }`}
                >
                  <span className="font-thin mr-1">0</span>
                  {t("majors")} {/* Changed from courses to majors */}
                </button>
              </Link>

              <Link to={`/${language}/searchresults/university`}>
                <button
                  className={`text-sm font-medium flex justify-center rounded-full items-center px-4 py-2 ${
                    location.pathname ===
                    `/${language}/searchresults/university`
                      ? "bg-black text-white"
                      : "text-black"
                  }`}
                >
                  <span className="font-thin mr-1">0</span>
                  {t("universities")}
                </button>
              </Link>

              <Link to={`/${language}/searchresults/article`}>
                <button
                  className={`text-sm font-medium rounded-full flex justify-center items-center px-4 py-2 ${
                    location.pathname === `/${language}/searchresults/article`
                      ? "bg-black text-white"
                      : "text-black"
                  }`}
                >
                  <span className="font-thin mr-1">0</span>
                  {t("articles")}
                </button>
              </Link>
            </div>

            {/* Filter Button (Hidden on Small Screens) */}
            <div className="hidden sm:block relative p-4">
              <button
                className="hidden sm:flex items-center gap-1 px-3 py-1 text-sm text-white rounded-full  bg-[#3A3D8D]"
                onClick={() => setShowFilter(!showFilter)}
              >
                <FilterLogo2 />
                {t("filters")}
              </button>
              {activeFilters > 0 && (
                <div className="absolute top-[8px] right-[9px] w-5 h-5 flex items-center justify-center text-xs font-semibold text-white  bg-[#3A3D8D] rounded-full shadow-md border-2 border-white">
                  {activeFilters}
                </div>
              )}
            </div>
          </div>

          {/* Filter Sidebar */}
          {showFilter && (
            <FilterSidebar
              language={language}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
            />
          )}

          <NoResultsFound language={language} />
        </div>
        <ContactSection />
      </>
    );
  }

  return (
    <>
      <div className="relative p-4 px-5 sm:px-9 lg:px-16">
        {/* Buttons */}
        <div className="flex items-center sm:mb-16 md:mb-20  text-sm justify-between overflow-x-auto whitespace-nowrap no-scrollbar">
          <div className="flex space-x-0 md:space-x-4">
            <Link to={`/${language}/searchresults`}>
              <button
                className={`text-sm font-medium flex rounded-full justify-center items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults`
                    ? "bg-black text-white"
                    : "text-black"
                }`}
              >
                <span className="font-thin mr-1">
                  {sumData?.sumResult || 0}
                </span>
                {t("results")}
              </button>
            </Link>

            <Link to={`/${language}/searchresults/majors`}>
              <button
                className={`text-sm font-medium flex rounded-full justify-center items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults/majors`
                    ? "bg-black text-white"
                    : "text-black"
                }`}
              >
                <span className="font-thin mr-1">
                  {sumData?.sumMajors || 0} {/* Changed from sumCourses */}
                </span>
                {t("majors")} {/* Changed from courses to majors */}
              </button>
            </Link>

            <Link to={`/${language}/searchresults/university`}>
              <button
                className={`text-sm font-medium flex justify-center rounded-full items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults/university`
                    ? "bg-black text-white"
                    : "text-black"
                }`}
              >
                <span className="font-thin mr-1">
                  {sumData?.sumUniversities || 0}
                </span>
                {t("universities")}
              </button>
            </Link>

            <Link to={`/${language}/searchresults/article`}>
              <button
                className={`text-sm font-medium rounded-full flex justify-center items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults/article`
                    ? "bg-black text-white"
                    : "text-black"
                }`}
              >
                <span className="font-thin mr-1">{sumData?.sumBlogs || 0}</span>
                {t("articles")}
              </button>
            </Link>
          </div>

          {/* Filter Button (Hidden on Small Screens) */}
          <div className="block relative p-4">
            <button
              className="flex items-center gap-1 px-3 py-1 text-sm text-white rounded-full bg-[#3A3D8D]"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FilterLogo2 />
              {t("filters")}
            </button>
            {activeFilters > 0 && (
              <div className="absolute top-[8px] right-[9px] w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-[#c35251] rounded-full shadow-md border-2 border-white">
                {activeFilters}
              </div>
            )}
          </div>
        </div>

        {/* Filter Sidebar */}
        {showFilter && (
          <FilterSidebar
            language={language}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
          />
        )}

        <Routes>
          <Route
            path=""
            element={<Results filteredData={searchResults} loading={loading} />}
          />
          <Route
            path="majors" // Changed from courses to majors
            element={
              <ResultsMajors // Changed from ResultsCorses
                loading={loading || !searchResults}
                filteredData={searchResults?.majors || []} // Changed from courses to majors
                uniIds={memoizedUniIds}
              />
            }
          />
          <Route
            path="university"
            element={
              <Univrsiry
                loading={loading || !searchResults}
                language={language}
                filteredData={searchResults?.universities || []}
                countryIds={memoizedCountryIds}
              />
            }
          />
          <Route
            path="article"
            element={
              <Article
                loading={loading || !searchResults}
                filteredData={searchResults?.blogs || []}
                countryIds={memoizedCountryIds}
              />
            }
          />
          <Route
            path="Allmajor" // Changed from Allcorse
            element={<ExploreTopMajor language={language} />} // Changed from ExploreTopCorse
          />
          <Route
            path="AllUniversity"
            element={<ExploreTopUniversity language={language} />}
          />
          <Route
            path="AllBlogs"
            element={<ExploreBlogs language={language} />}
          />
        </Routes>
      </div>

      <ContactSection />
    </>
  );
}

export default React.memo(SearchResults);
