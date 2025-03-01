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
import { useTranslation } from "react-i18next";

function SearchResults() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showFilter, setShowFilter] = useState(false);
  const location = useLocation();
  const { data, loading } = useFetch(
    `http://localhost:4000/api/country/getAll/DepthData`
  );

  const { filterProp, setSumData, sumData, initialState } = useSearch();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const filteredData = useMemo(() => {
    return data
      ?.map((country) => {
        // 1. Country-level filtering (Destination)
        const matchesDestination =
          filterProp.Destination.length > 0
            ? filterProp.Destination.includes(country?.countryName?.en)
            : true;
        if (!matchesDestination) return null;

        // 2. Filter universities within the country
        const filteredUniversities = country?.universities
          ?.map((university) => {
            // 3. University-level filtering
            if (
              filterProp.EntranceExam &&
              university.entranceExamRequired !== filterProp.EntranceExam
            )
              return null;
            if (
              filterProp.StudyLevel &&
              filterProp.StudyLevel !== "All" &&
              !university?.studyLevel?.some(
                (level) =>
                  level?.toLowerCase() === filterProp.StudyLevel.toLowerCase()
              )
            )
              return null;
            if (
              filterProp.UniType &&
              university.uniType?.toLowerCase() !==
                filterProp.UniType.toLowerCase()
            )
              return null;
            if (
              filterProp.IntakeYear &&
              university.inTakeYear?.toString() !==
                filterProp.IntakeYear.toString()
            )
              return null;
            if (
              filterProp.IntakeMonth &&
              university.inTakeMonth?.toString() !==
                filterProp.IntakeMonth.toString()
            )
              return null;

            // 4. Filter courses within the university
            const filteredCourses = university?.courseId?.filter(
              (courseItem) => {
                // 5. Match Tags (Keywords)
                const tags = [
                  ...(courseItem?.Tags?.en || []),
                  ...(courseItem?.Tags?.ar || []),
                ];
                const hasMatchingTag =
                  !filterProp?.searchQuery?.en && !filterProp?.searchQuery?.ar
                    ? true // No tag filter applied
                    : tags.includes(filterProp?.searchQuery?.en) ||
                      tags.includes(filterProp?.searchQuery?.ar);

                // 6. Match Budget
                const minBudget = Number(filterProp.minBudget) || 0;
                const maxBudget =
                  filterProp.maxBudget !== undefined &&
                  filterProp.maxBudget !== ""
                    ? Number(filterProp.maxBudget)
                    : Infinity;
                const courseFees = Number(courseItem?.CourseFees);
                const isWithinBudget =
                  !isNaN(courseFees) &&
                  courseFees >= minBudget &&
                  courseFees <= maxBudget;

                // 7. Match Mode of Study
                const matchesModeOfStudy = filterProp.ModeOfStudy
                  ? [
                      ...(courseItem?.ModeOfStudy?.en || []),
                      ...(courseItem?.ModeOfStudy?.ar || []),
                    ].some((mode) =>
                      mode
                        ?.toLowerCase()
                        .includes(filterProp.ModeOfStudy.toLowerCase())
                    )
                  : true;

                // 8. Match Course Duration
                const parseDuration = (duration) => {
                  const monthsRegex = /(\d+(\.\d+)?)\s*month/i;
                  const yearsRegex = /(\d+(\.\d+)?)\s*year/i;
                  const months = duration.match(monthsRegex)?.[1] || 0;
                  const years = duration.match(yearsRegex)?.[1] || 0;
                  return Number(months) + Number(years) * 12;
                };
                const matchesDuration = filterProp.CourseDuration
                  ? (() => {
                      const durationMonths = parseDuration(
                        courseItem?.CourseDuration
                      );
                      if (filterProp.CourseDuration === "60+") {
                        return durationMonths >= 60;
                      }
                      const [min, max] =
                        filterProp.CourseDuration.split("-").map(Number);
                      return durationMonths >= min && durationMonths <= max;
                    })()
                  : true;

                // 9. Course must pass all filters
                return (
                  hasMatchingTag &&
                  isWithinBudget &&
                  matchesModeOfStudy &&
                  matchesDuration
                );
              }
            );

            // 10. Only keep universities with matching courses
            return filteredCourses?.length > 0
              ? { ...university, courseId: filteredCourses }
              : null;
          })
          .filter(Boolean);

        // 11. Only keep countries with matching universities
        return filteredUniversities?.length > 0
          ? { ...country, universities: filteredUniversities }
          : null;
      })
      .filter(Boolean);
  }, [data, filterProp]);

  const getTotalCounts = (data) => {
    const totalCountries = data?.length || 0;
    const totalUniversities = data?.reduce(
      (acc, country) => acc + (country?.universities?.length || 0),
      0
    );
    const totalCourses = data?.reduce(
      (acc, country) =>
        acc +
        (country?.universities?.reduce(
          (uniAcc, university) => uniAcc + (university?.courseId?.length || 0),
          0
        ) || 0),
      0
    );
    const totalBlogs = data?.reduce(
      (acc, country) => acc + (country?.blog?.length || 0),
      0
    );

    return {
      totalCountries,
      totalUniversities,
      totalBlogs,
      totalCourses,
    };
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
    if (!filteredData || filteredData?.length === 0) {
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
        <div
          dir={language === "ar" ? "rtl" : "ltl"}
          className="flex items-center sm:mb-16 md:mb-20  text-sm justify-between overflow-x-auto whitespace-nowrap no-scrollbar"
        >
          <div className="flex space-x-4">
            <Link to={`/${language}/searchresults`}>
              <button
                className={`text-sm font-medium flex rounded-full justify-center items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults`
                    ? "bg-black text-white"
                    : "text-black"
                }`}
              >
                <span className="font-thin mr-1">{sumData?.sumResult}</span>
                {t("results")}
              </button>
            </Link>

            <Link to={`/${language}/searchresults/courses`}>
              <button
                className={`text-sm font-medium flex rounded-full justify-center items-center px-4 py-2 ${
                  location.pathname === `/${language}/searchresults/courses`
                    ? "bg-black text-white"
                    : "text-black"
                }`}
              >
                <span className="font-thin mr-1">{sumData?.sumCourses}</span>
                {t("courses")}
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
                  {sumData?.sumUniversities}
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
                <span className="font-thin mr-1">{sumData?.sumBlogs}</span>
                {t("articles")}
              </button>
            </Link>
          </div>

          {/* Filter Button (Hidden on Small Screens) */}
          <div className="hidden sm:block relative p-4">
            <button
              className="hidden sm:flex items-center gap-1 px-3 py-1 text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754]"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FilterLogo2 />
              {t("filters")}
            </button>
            {activeFilters > 0 && (
              <div className="absolute top-[8px] right-[9px] w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-[#5A1EB8] to-[#FF6B6B] rounded-full shadow-md border-2 border-white">
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
            element={<Results filteredData={filteredData} loading={loading} />}
          />
          <Route
            path="courses"
            element={
              <ResultsCorses
                language={language}
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
              <Univrsiry filteredData={filteredData} loading={loading} />
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
          <Route
            path="Allcorse"
            element={
              <ExploreTopCorse
                language={language}
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
            path="AllUniversity"
            element={
              <ExploreTopUniversity
                language={language}
                filteredData={filteredData?.flatMap((item) =>
                  item?.universities?.map((university) => ({
                    ...university,
                    countryName: item?.countryName,
                    countryPhotos: item?.countryPhotos,
                    countryCode: item?.countryCode,
                  }))
                )}
                loading={loading}
              />
            }
          />
          <Route
            path="AllBlogs"
            element={
              <ExploreBlogs
                language={language}
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
        </Routes>
      </div>

      <ContactSection />
    </>
  );
}

export default SearchResults;
