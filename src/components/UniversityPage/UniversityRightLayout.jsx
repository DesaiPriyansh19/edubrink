import React from "react";
import Download from "../../../svg/Download";
import DatePicker from "../../../svg/DatePicker";
import Seconds from "../../../svg/Seconds";
import CourseBook from "../../../svg/CourseBook";
import CourseDiscount from "../../../svg/CourseDiscount";
import TicketDiscount from "../../../svg/TicketDiscount";
import Watch from "../../../svg/Watch";
import UniversityRightLayoutCard from "./UniversityRightLayoutCard";

const UniversityRightLayout = () => {
  return (
    <>
      <div className="mt-5">
        <div className="container">
          <div className="flex gap-[22px]">
            <div className="w-[52px] h-[52px] rounded-full border-[1.5px] border-black pt-[14px] pr-[28px] pl-[14px] pb-[20px] gap-[10px]">
              <Download />
            </div>
            <button className="w-full bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white py-2 rounded-full">
              Apply Now
            </button>
          </div>
          <div className="bg-white shadow rounded-lg p-4 mt-5">
            <div className="mt-6">
              <div>
                <div className="order-1  w-full p-6 rounded-lg">
                  <div className="gap-4 bg-white pl-[4%] pr-[4%] rounded-b-[1.5rem]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center">
                        <TicketDiscount />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-5">
                          $27.500 Per Year
                        </p>
                        <p className="text-sm font-sans font-normal leading-5">
                          International Student tutition fee
                        </p>
                      </div>
                    </div>
                    <div className="border-t-2 mt-4"></div>
                    <div className="flex items-center gap-4 mt-[4%]">
                      <div className="flex items-center justify-center">
                        <Watch />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-5">1 Year</p>
                        <p className="text-sm font-sans font-normal leading-5">
                          Duration
                        </p>
                      </div>
                    </div>
                    <div className="border-t-2 mt-4"></div>
                    <div className="flex items-center gap-4 mt-5 mb-5">
                      <div className="flex items-center justify-center">
                        <DatePicker />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-5">Sep 2025</p>
                        <p className="text-sm font-sans font-normal leading-5">
                          Start Month
                        </p>
                      </div>
                    </div>
                    <div className="border-t-2 mt-4"></div>
                    <div className="flex items-center gap-4 mt-5 mb-5">
                      <div className="flex items-center justify-center">
                        <Seconds />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-5">Aug 2025</p>
                        <p className="text-sm font-sans font-normal leading-5">
                          Application Deadline
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-5">
                      <div className="flex items-center justify-center">
                        <CourseBook />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-5">Full Time</p>
                        <p className="text-sm font-sans font-normal leading-5">
                          Mode Of Study
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-5">
                      <div className="flex items-center justify-center">
                        <CourseDiscount />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-5">Discount</p>
                        <p className="text-sm font-sans font-normal leading-5">
                          Free Scholarship
                        </p>
                      </div>
                    </div>
                    <button className="mt-6 w-full bg-gradient-to-r from-red-500 to-purple-500 text-white py-3 rounded-full font-semibold text-lg mb-5">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UniversityRightLayoutCard />
      </div>
    </>
  );
};

export default UniversityRightLayout;
