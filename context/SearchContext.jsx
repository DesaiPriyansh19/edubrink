import React, { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const initialState = {
    searchQuery: {
      en: "",
      ar: "",
    },
    Destination: [],
    StudyLevel: "All",
    EntranceExam: undefined,
    UniType: "",
    IntakeYear: null,
    IntakeMonth: "",
    ModeOfStudy: "",
    CourseDuration: "",
    minBudget: 0,
    maxBudget: 100000,
  };
  const [searchState, setSearchState] = useState({
    searchTerm: "",
    filteredResults: [],
    selectedIndex: null,
  });
  const [filterProp, setFilterProp] = useState(initialState);
  const [sumData, setSumData] = useState({
    sumResult: 0,
    sumUniversities: 0,
    sumCourses: 0,
    sumBlogs: 0,
  });

  useEffect(() => {
    if (searchState.searchTerm === "") {
      setFilterProp((prev) => ({
        ...prev,
        searchQuery: { en: "", ar: "" },
      }));
    }
  }, [searchState.searchTerm]);

  return (
    <SearchContext.Provider
      value={{
        filterProp,
        setFilterProp,
        initialState,
        setSumData,
        sumData,
        searchState,
        setSearchState,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
