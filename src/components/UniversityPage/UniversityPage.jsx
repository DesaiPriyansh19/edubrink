import React from "react";
import UniversityChicago from "../../assets/CountryPage/UniversityChicago.png";
import University from "../../assets/CountryPage/University.png";
import TickMark from "../../../svg/TickMark";
import UniversityRightLayout from "./UniversityRightLayout";
import UniversityLeftLayout from "./UniversityLeftLayout";
import UniversityCard from "./UniversityCard";
import UniversityHighlight from "./UniversityHighlight";

const UniversityPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <img
          src={University}
          alt="University"
          className="w-full object-cover rounded-lg"
        />
        <div className="absolute top-[96%] -translate-y-1/2 left-4 sm:left-6 md:left-8 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white shadow-lg flex items-center justify-center rounded-[1.2rem] bottom-[4%]">
          <img
            src={UniversityChicago}
            alt="Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
          />
          <span className="absolute bottom-[14%] top-[86%] right-1">
            <TickMark />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 md:col-span-8 space-y-6">
          <UniversityLeftLayout />
          <UniversityCard />
          <UniversityHighlight />
        </div>
        <div className="col-span-12 md:col-span-4 space-y-6">
          <UniversityRightLayout />
        </div>
      </div>
    </div>
  );
};

export default UniversityPage;
