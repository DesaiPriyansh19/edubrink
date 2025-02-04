import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [clicksData, setClicksData] = useState([]);

  // Batch the clicks data after 30 seconds
  useEffect(() => {
    if (clicksData.length > 0) {
      const timer = setTimeout(() => {
        batchSendClicksData(clicksData);
        setClicksData([]); // Clear the array after sending the data
      }, 5000); // 5 seconds for demo, change it to 30000 (30 seconds) as needed

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [clicksData]);

  const addClickData = (itemId, category, clicks) => {
    setClicksData((prevData) => {
      // Check if the itemId and category already exist in the array
      const existingDataIndex = prevData.findIndex(
        (data) => data.itemId === itemId && data.category === category
      );

      if (existingDataIndex >= 0) {
        // If the itemId and category exist, increment the clicks
        const updatedData = [...prevData];
        updatedData[existingDataIndex].clicks += clicks;
        return updatedData;
      } else {
        // If the itemId and category don't exist, add a new entry
        return [...prevData, { itemId, category, clicks }];
      }
    });
  };

  // Function to send batch click data to the server
  const batchSendClicksData = async (data) => {
    try {
      await axios.post(
        "https://edu-brink-backend.vercel.app/api/analysis/batch",
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
