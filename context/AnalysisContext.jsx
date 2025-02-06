import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [clicksData, setClicksData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (clicksData.length > 0) {
      const timer = setTimeout(() => {
        batchSendClicksData(clicksData);
        setClicksData([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [clicksData]);

  const addClickData = (itemId, category, clicks, countryName) => {
    console.log(countryName);
    setClicksData((prevData) => {
      return prevData
        .map((data) => {
          if (data.itemId === itemId && data.category === category) {
            return { ...data, clicks: data.clicks + 1 }; // Ensure proper incrementing
          }
          return data;
        })
        .concat(
          prevData.some(
            (data) => data.itemId === itemId && data.category === category
          )
            ? [] // If already exists, do not add a new entry
            : [
                {
                  itemId,
                  category,
                  clicks,
                  country: countryName ?? null,
                },
              ]
        );
    });
  };

  // Function to send batch click data to the server
  const batchSendClicksData = async (data) => {
    try {
      await axios.post(
        `https://edu-brink-backend.vercel.app/api/analysis/batch`,
        data
      );
    } catch (error) {
      console.error("Error sending batch click data:", error);
    }
  };

  return (
    <AnalysisContext.Provider value={{ addClickData, clicksData }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
