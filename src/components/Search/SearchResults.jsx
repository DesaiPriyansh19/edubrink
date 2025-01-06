import React, { useState } from "react";
import FilterSidebar from "../FilterSidevbar/FilterSidebar";
import FilterLogo from "../../../svg/FilterLogo";
import FilterLogo2 from "../../../svg/FilterLogo2";
import Results from "./Results/Results";
import Courses from "./Courses";

import Article from "./Article";
import ResultUnivrsiry from "./Results/University";
import ContactSection from "../ContactSection";
import Univrsiry from "./Results/University";

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
          default:
              return <Results/>;
            case "Courses":
              return <Courses/>;
            case "Universities":
              return <Univrsiry/>;
            case "Articles":
              return <Article/>;
           
             
          }
        };
      
        return (<>
            <div className="relative p-4 px-5 sm:px-9 lg:px-16">
 {/* Buttons */}
<div className="flex items-center sm:mb-16 md:mb-20  text-sm justify-between overflow-x-auto whitespace-nowrap no-scrollbar">
  <div className="flex  space-x-4">
    {["Results", "Courses", "Universities", "Articles"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 rounded-full font-medium flex justify-center items-center text-sm ${
          activeTab === tab
            ? "bg-black text-white"
            : "hover:bg-gray-300"
        }`}
      >
        {additionalText[tab] && (
          <span className="mr-1 font-thin">{additionalText[tab]}</span>
        )}
        {tab}
      </button>
    ))}
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

              {/* Content Area */}
  <div className="">{renderContent()}</div>
        
           {/* Filter Sidebar */}
      {showFilter && (
        <FilterSidebar showFilter={showFilter} setShowFilter={setShowFilter} />
      )}
     
            </div>
            <ContactSection/>
            </>
          );
}

export default SearchResults