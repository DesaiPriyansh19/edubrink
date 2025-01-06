import React, { useState } from "react";
import FilterSidebar from "../FilterSidevbar/FilterSidebar";
import FilterLogo from "../../../svg/FilterLogo";
import FilterLogo2 from "../../../svg/FilterLogo2";

function SearchResults() {
    const [activeTab, setActiveTab] = useState("Results"); // Default active tab
    const [showFilter, setShowFilter] = useState(false); // Toggle filter sidebar
    {/* Dynamic Text Mapping */}
const additionalText = {
  Results: "200",
  Courses: "150",
  Universities: "100",
  Articles: "200",
};
    const renderContent = () => {
        switch (activeTab) {
            case "Results":
              return <div>Results Content</div>;
            case "Courses":
              return <div>Courses Content</div>;
            case "Universities":
              return <div>Universities Content</div>;
            case "Articles":
              return <div>Articles Content</div>;
            default:
              return <div>Select a category to see the content.</div>;
          }
        };
      
        return (
            <div className="relative p-4 px-7">
              {/* Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  {["Results", "Courses", "Universities", "Articles"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-full font-medium flex justify-center items-center text-sm  ${
                        activeTab === tab
                          ? "bg-black text-white "
                          : " hover:bg-gray-300 "
                      }`}
                    >
                    <span> {additionalText[tab] && (
          <span className="mr-1 font-thin">{additionalText[tab]}</span>
        )}</span>  {tab} 
                    </button>
                  ))}
                </div>
                {/* Filter Button */}
                <button
                  className="hidden sm:flex items-center gap-1 px-3 py-1 text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754]"
                  onClick={() => setShowFilter(!showFilter)} // Toggle filter sidebar
                >
                  <FilterLogo2/>
                  Filters
                </button>
              </div>
        
              {/* Content Area */}
              <div className="mt-6 p-4 bg-gray-100 rounded shadow">{renderContent()}</div>
        
           {/* Filter Sidebar */}
      {showFilter && (
        <FilterSidebar showFilter={showFilter} setShowFilter={setShowFilter} />
      )}
            </div>
          );
}

export default SearchResults