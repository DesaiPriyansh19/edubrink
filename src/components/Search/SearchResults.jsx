import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import FilterSidebar from "../FilterSidevbar/FilterSidebar";
import FilterLogo2 from "../../../svg/FilterLogo2";
import Results from "./Results/Results";
import Article from "./Article";
import ContactSection from "../ContactSection";
import Univrsiry from "./Results/University";
import ResultsCorses from "./Results/Resultscorse";
import ExploreTopCorse from "./ExploreTopCorse";
import ExploreTopUniversity from "./ExploreTopUniversity";
import ExploreBlogs from "./ExploreBlogs";
import { useSearch } from "../../../context/SearchContext";
import useFetch from "../../../hooks/useFetch";
import { useLanguage } from "../../../context/LanguageContext";

function SearchResults() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showFilter, setShowFilter] = useState(false);
  const location = useLocation();
  const { data, loading } = useFetch(
    `https://edu-brink-backend.vercel.app/api/country/getAll/DepthData`
  );

  const { filterProp, setSumData, sumData } = useSearch();
  const { language } = useLanguage();

  const filteredData = useMemo(() => {
    return data
      ?.map((course) => {
        const minBudget = Number(filterProp.minBudget) || 0;
        const maxBudget =
          filterProp.maxBudget !== undefined && filterProp.maxBudget !== ""
            ? Number(filterProp.maxBudget)
            : Infinity;

        const matchesDestination =
          filterProp.Destination.length > 0
            ? filterProp.Destination.includes(course?.countryName?.en)
            : true;

        const matchesModeOfStudy = filterProp.ModeOfStudy
          ? course?.universities?.some((university) =>
              university?.courseId?.some((courseItem) =>
                courseItem?.ModeOfStudy?.some((mode) =>
                  mode?.en
                    .toLowerCase()
                    .includes(filterProp.ModeOfStudy.toLowerCase())
                )
              )
            )
          : true;

        const matchesKeywords = filterProp.searchQuery?.en
          ? course?.universities?.some((university) =>
              university?.courseId?.some((courseItem) =>
                courseItem?.Tags?.some(
                  (tag) =>
                    tag?.TagName?.en?.toLowerCase() ===
                    filterProp.searchQuery.en.toLowerCase()
                )
              )
            )
          : true;

        const matchesEntranceExam = filterProp.EntranceExam
          ? course?.universities?.some(
              (university) =>
                university?.entranceExamRequired === filterProp.EntranceExam
            )
          : true;

        const matchesStudyLevel =
          filterProp.StudyLevel && filterProp.StudyLevel !== "All"
            ? course?.universities?.some(
                (university) =>
                  university?.studyLevel?.toLowerCase() ===
                  filterProp.StudyLevel.toLowerCase()
              )
            : true;

        const matchesUniType = filterProp.UniType
          ? course?.universities?.some(
              (university) =>
                university?.uniType?.toLowerCase() ===
                filterProp.UniType.toLowerCase()
            )
          : true;

        const matchesIntakeYear = filterProp.IntakeYear
          ? course?.universities?.some(
              (university) =>
                university?.inTakeYear?.toString() ===
                filterProp.IntakeYear.toString()
            )
          : true;

        const matchesIntakeMonth = filterProp.IntakeMonth
          ? course?.universities?.some(
              (university) =>
                university?.inTakeMonth?.toString() ===
                filterProp.IntakeMonth.toString()
            )
          : true;

        const matchesBudget = course?.universities
          ?.map((university) => {
            const validCourses = university?.courseId?.filter((courseItem) => {
              const courseFees = Number(courseItem?.CourseFees);
              if (isNaN(courseFees)) {
                return false;
              }
              return courseFees >= minBudget && courseFees <= maxBudget;
            });

            return validCourses.length > 0
              ? { ...university, courseId: validCourses }
              : null;
          })
          .filter(Boolean);

        const parseCourseDuration = (courseDuration) => {
          // Regular expressions to capture durations in months or years
          const monthsRegex = /(\d+(\.\d+)?)\s*month/i; // Matches "1 month", "1.5 month", "6 months", etc.
          const yearsRegex = /(\d+(\.\d+)?)\s*year/i; // Matches "1 year", "1.5 year", "2 years", etc.

          const monthsMatch = courseDuration.match(monthsRegex);
          const yearsMatch = courseDuration.match(yearsRegex);

          // If the duration is in months (e.g., "6 months" or "1.5 month")
          if (monthsMatch) {
            return Number(monthsMatch[1]); // Return number of months
          }

          // If the duration is in years (e.g., "1 year" or "1.5 year")
          if (yearsMatch) {
            return Number(yearsMatch[1]) * 12; // Convert years (including decimals) to months
          }

          return 0; // Default if no match
        };

        const matchesCourseDuration = filterProp.CourseDuration
          ? course?.universities?.some((university) =>
              university?.courseId?.some((courseItem) => {
                const courseDurationInMonths = parseCourseDuration(
                  courseItem?.CourseDuration
                );

                // Handle "More than 5 years" (60+)
                if (filterProp.CourseDuration === "60+") {
                  return courseDurationInMonths >= 60; // Matches any course duration 60 months (5 years) or more
                }

                // Get the min and max duration from the filter range (e.g., "1-12")
                const [minDuration, maxDuration] =
                  filterProp.CourseDuration.split("-").map(Number);

                // Check if the parsed course duration falls within the range
                return (
                  courseDurationInMonths >= minDuration &&
                  courseDurationInMonths <= maxDuration
                );
              })
            )
          : true;

        return matchesDestination &&
          matchesModeOfStudy &&
          matchesKeywords &&
          matchesEntranceExam &&
          matchesStudyLevel &&
          matchesUniType &&
          matchesIntakeYear &&
          matchesIntakeMonth &&
          matchesCourseDuration &&
          matchesBudget.length > 0
          ? { ...course, universities: matchesBudget }
          : null;
      })
      .filter(Boolean);
  }, [data, filterProp]);

  const getTotalCounts = (data) => {
    const totalCountries = data?.length;
    const totalUniversities = data?.reduce(
      (acc, country) => acc + country.totalUniversities,
      0
    );
    const totalBlogs = data?.reduce(
      (acc, country) => acc + country.totalBlogs,
      0
    );
    const totalCourses = data?.reduce(
      (acc, country) => acc + country.totalCourses,
      0
    );

    return {
      totalCountries,
      totalUniversities,
      totalBlogs,
      totalCourses,
    };
  };

  useEffect(() => {
    console.log(filterProp);
    if (!filteredData || filteredData.length === 0) {
      setSumData({
        sumResult: 0,
        sumUniversities: 0,
        sumBlogs: 0,
        sumCourses: 0,
      });
      return; // Exit early since there's no data to process
    }

    const sum = getTotalCounts(filteredData);

    const newSumResult =
      (sum?.totalBlogs || 0) +
      (sum?.totalCourses || 0) +
      (sum?.totalUniversities || 0);

    setSumData((prev) => {
      if (
        prev.sumResult === newSumResult &&
        prev.sumUniversities === (sum?.totalUniversities || 0) &&
        prev.sumBlogs === (sum?.totalBlogs || 0) &&
        prev.sumCourses === (sum?.totalCourses || 0)
      ) {
        return prev; // Prevent re-render if no change
      }

      return {
        sumResult: newSumResult,
        sumUniversities: sum?.totalUniversities || 0,
        sumBlogs: sum?.totalBlogs || 0,
        sumCourses: sum?.totalCourses || 0,
      };
    });
  }, [filteredData]);

  return (
    <>
      <div className="relative p-4 px-5 sm:px-9 lg:px-16">
        {/* Buttons */}
        <div className="flex items-center sm:mb-16 md:mb-20  text-sm justify-between overflow-x-auto whitespace-nowrap no-scrollbar">
          <div className="flex  space-x-4">
            <Link to={`/${language}/searchresults`}>
              <button
                className={`text-sm font-medium flex rounded-full justify-center items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults`
                    ? "bg-black text-white"
                    : " text-black"
                }`}
              >
                <span className="font-thin  mr-1">{sumData?.sumResult}</span>
                Results
              </button>
            </Link>

            <Link to={`/${language}/searchresults/courses`}>
              <button
                className={`text-sm font-medium flex rounded-full  justify-center items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults/courses`
                    ? "bg-black text-white"
                    : " text-black"
                }`}
              >
                <span className="font-thin mr-1">{sumData?.sumCourses}</span>{" "}
                Courses
              </button>
            </Link>

            <Link to={`/${language}/searchresults/university`}>
              <button
                className={`text-sm font-medium flex justify-center rounded-full  items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults/university`
                    ? "bg-black text-white"
                    : " text-black"
                }`}
              >
                <span className="font-thin  mr-1">
                  {sumData?.sumUniversities}
                </span>{" "}
                Universities
              </button>
            </Link>

            <Link to={`/${language}/searchresults/article`}>
              <button
                className={`text-sm font-medium rounded-full  flex justify-center items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults/article`
                    ? "bg-black text-white"
                    : " text-black"
                }`}
              >
                <span className="font-thin  mr-1">{sumData?.sumBlogs}</span>{" "}
                Articles
              </button>
            </Link>
          </div>

          {/* Filter Button (Hidden on Small Screens) */}
          <button
            className="hidden sm:flex items-center gap-1 px-3 py-1 text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754]"
            onClick={() => setShowFilter(!showFilter)} // Toggle filter sidebar
          >
            <FilterLogo2 />
            Filters
          </button>
        </div>

        {/* Filter Sidebar */}
        {showFilter && (
          <FilterSidebar
            showFilter={showFilter}
            setShowFilter={setShowFilter}
          />
        )}

        <Routes>
          <Route
            path=""
            element={<Results filteredData={filteredData} loading={loading} />}
          />
          <Route
            path="courses"
            element={
              <ResultsCorses
                loading={loading}
                filteredData={filteredData?.flatMap((item) =>
                  item.universities.flatMap((university) =>
                    university.courseId.map((course) => ({
                      ...course,
                      courseId: course,
                      uniName: university.uniName,
                      countryName: item.countryName,
                    }))
                  )
                )}
              />
            }
          />
          <Route
            path="university"
            element={
              <Univrsiry
                filteredData={filteredData?.flatMap((item) =>
                  item?.universities?.map((university) => ({
                    ...university,
                    countryName: item?.countryName,
                  }))
                )}
                loading={loading}
              />
            }
          />
          <Route
            path="article"
            element={
              <Article
                filteredData={filteredData?.flatMap((item) =>
                  item?.blog?.map((blogs) => ({
                    ...blogs,
                    countryName: item?.countryName,
                  }))
                )}
                loading={loading}
              />
            }
          />
          <Route path="Allcorse" element={<ExploreTopCorse />} />
          <Route path="AllUniversity" element={<ExploreTopUniversity />} />
          <Route path="AllBlogs" element={<ExploreBlogs />} />
        </Routes>
      </div>

      <ContactSection />
    </>
  );
}

export default SearchResults;
