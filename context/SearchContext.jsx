import React, { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();



export const SearchProvider = ({ children }) => {
  const initialState = {
    searchQuery: {
      en: "",
      ar: "",
    },
    Destination: [],
    StudyLevel: "",
    EntranceExam: undefined,
    UniType: "",
    IntakeYear: null,
    IntakeMonth: "",
    ModeOfStudy: "",
    CourseDuration: "",
    minBudget: 0,
    maxBudget: 100000,
  };
  const [filterProp, setFilterProp] = useState(initialState);
  const [searchState, setSearchState] = useState({
    searchTerm: "",
    filteredResults: [],
    selectedIndex: null,
  });
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

  const cleanFilterProp = (filters) => {
    const cleanedFilters = {};
  
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
  
      if (key === "searchQuery") {
        // Remove searchQuery if both en and ar are empty
        if (!value.en.trim() && !value.ar.trim()) {
          return;
        }
      }
  
      // Remove empty values (""), empty arrays ([]), null, undefined, and default values
      if (
        (Array.isArray(value) && value.length > 0) || // Keep non-empty arrays
        (typeof value === "object" && value !== null && Object.keys(value).length > 0) || // Keep non-empty objects
        (typeof value === "string" && value.trim() !== "") || // Keep non-empty strings
        (typeof value === "number" && value !== 0) || // Keep non-zero numbers
        (typeof value === "boolean") // Keep booleans
      ) {
        cleanedFilters[key] = value;
      }
    });
  
    return cleanedFilters;
  };
  

  return (
    <SearchContext.Provider
      value={{
        filterProp,
        setFilterProp,
        initialState,
        setSumData,
        sumData,
        searchState,
        cleanFilterProp,
        setSearchState,

      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
