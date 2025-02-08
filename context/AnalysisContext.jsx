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

  const addClickData = (itemId, category, countryName) => {
    setClicksData((prevData) => {
      const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)

      return prevData
        .map((data) => {
          if (data.itemId === itemId && data.category === category) {
            // Check if today's date already exists in clickHistory
            const updatedClickHistory = [...data.clickHistory];
            const todayEntryIndex = updatedClickHistory.findIndex(
              (entry) => entry.date === today
            );

            if (todayEntryIndex !== -1) {
              // If today's entry exists, increment clicks
              updatedClickHistory[todayEntryIndex].clicks += 1;
            } else {
              // Otherwise, add a new entry for today
              updatedClickHistory.push({ date: today, clicks: 1 });
            }

            return {
              ...data,
              clicks: data.clicks + 1, // Update total clicks
              clickHistory: updatedClickHistory,
              lastClickedAt: new Date().toISOString(),
            };
          }
          return data;
        })
        .concat(
          prevData.some(
            (data) => data.itemId === itemId && data.category === category
          )
            ? [] // If item already exists, do not add a new entry
            : [
                {
                  itemId,
                  category,
                  clicks: 1,
                  country: countryName ?? null,
                  clickHistory: [{ date: today, clicks: 1 }], // Initialize click history
                  lastClickedAt: new Date().toISOString(),
                },
              ]
        );
    });
  };

  // Function to send batch click data to the server
  const batchSendClicksData = async (data) => {
    try {
      await axios.post(`https://edu-brink-backend.vercel.app/api/analysis/batch`, data);
      console.log("called");
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
