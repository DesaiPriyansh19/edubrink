import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const initialState = {
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
  const [filterProp, setFilterProp] = useState(initialState);
  const [sumData, setSumData] = useState({
    sumResult: 0,
    sumUniversities: 0,
    sumCourses: 0,
    sumBlogs: 0,
  });

  return (
    <SearchContext.Provider
      value={{
        filterProp,
        setFilterProp,
        initialState,
        setSumData,
        sumData,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
