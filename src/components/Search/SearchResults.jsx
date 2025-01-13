import React, { useState } from "react";
import { Routes, Route, Link,useLocation  } from "react-router-dom";
import FilterSidebar from "../FilterSidevbar/FilterSidebar";
import FilterLogo from "../../../svg/FilterLogo";
import FilterLogo2 from "../../../svg/FilterLogo2";
import Results from "./Results/Results";
import Courses from "./Courses";

import Article from "./Article";
import ResultUnivrsiry from "./Results/University";
import ContactSection from "../ContactSection";
import Univrsiry from "./Results/University";

import ResultsCorses from "./Results/Resultscorse";
import ExploreTopCorse from "./ExploreTopCorse";
import ExploreTopUniversity from "./ExploreTopUniversity";
import ExploreBlogs from "./ExploreBlogs";

function SearchResults() {
 
    const [showFilter, setShowFilter] = useState(false); // Toggle filter sidebar
    {/* Dynamic Text Mapping */}
    const location = useLocation(); // Get the current route
// const renderContent = () => {
//   switch (activeTab) {
   
//     case "Courses":
//       return <Courses />;
//     case "Universities":
//       return <Univrsiry />;
//     case "Articles":
//       return <Article />;
//     case "Results":
//       return <Results />; // Make sure to return this component
//       default:
//         return <DefaultSearchResults />;
//   }
// };

      
        return (<>
            <div className="relative p-4 px-5 sm:px-9 lg:px-16">
 {/* Buttons */}
<div className="flex items-center sm:mb-16 md:mb-20  text-sm justify-between overflow-x-auto whitespace-nowrap no-scrollbar">
  <div className="flex  space-x-4">
  
  <Link to="/searchresults"><button 
   className={`text-sm font-medium flex rounded-full justify-center items-center px-4 py-2 ${
    location.pathname === "/searchresults"
        ? "bg-black text-white"
        : " text-black"
}`}
 >
         <span className="font-thin">42551</span>Results
      </button></Link>

   <Link to='/searchresults/courses'><button
     className={`text-sm font-medium flex rounded-full  justify-center items-center px-4 py-2 ${
      location.pathname === "/searchresults/courses"
          ? "bg-black text-white"
          : " text-black"
  }`}>
         <span className="font-thin">42551</span>42294 Courses  
      </button></Link>
      
      <Link to="/searchresults/university">
                    <button
                        className={`text-sm font-medium flex justify-center rounded-full  items-center px-4 py-2 ${
                            location.pathname === "/searchresults/university"
                                ? "bg-black text-white"
                                : " text-black"
                        }`}
                    >
                        <span className="font-thin">551</span> Universities
                    </button>
                </Link>

                <Link to="/searchresults/article">
      <button   className={`text-sm font-medium rounded-full  flex justify-center items-center px-4 py-2 ${
                            location.pathname === "/searchresults/article"
                                ? "bg-black text-white"
                                : " text-black"
                        }`}>
         <span className="font-thin">4251</span> Articles
      </button></Link>
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
        <FilterSidebar showFilter={showFilter} setShowFilter={setShowFilter} />
      )}
         
         <Routes>
         <Route path="" element={<Results/>} />
         <Route path="courses" element={<ResultsCorses/>} />
                <Route path="university" element={<ResultUnivrsiry/>} />
                <Route path="article" element={<Article/>} />
                <Route path="Allcorse" element={<ExploreTopCorse/>} />
                <Route path="AllUniversity" element={<ExploreTopUniversity/>} />
                <Route path="AllBlogs" element={<ExploreBlogs/>} />
              
            </Routes>
            </div>



            <ContactSection/>
    
            </>
          );
}

export default SearchResults
