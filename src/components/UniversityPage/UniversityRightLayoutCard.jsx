import React from "react";
import JhonSmith from "../../assets/CoursePage/JhonSmith.png";
import Phone from "../../../svg/Phone";
const UniversityRightLayoutCard = () => {
  return (
    <>
      <div className="container mt-[10%] mb-[10%]">
        <div className="relative bg-white shadow-lg rounded-lg p-6 w-full">
          <div className="absolute top-2 left-2 bg-gray-200  font-sans font-medium text-lg leading-7 px-3 py-1 rounded-full">
            Dedicated Counsellor
          </div>

          <div className="flex mt-[8%]">
            <img
              src={JhonSmith}
              alt="Profile"
              className="w-[4rem] h-[4rem] rounded-full mr-4 mt-[3%] mb-[3%]"
            />
            <div className="mt-[5%] mb-[5%]">
              <div className="font-sans font-semibold text-2xl leading-7 text-black">
                Jhon Smith
              </div>
              <p className="font-sans font-medium text-lg leading-7 mt-2">
                Thanks for connecting! I’m excited to connect with professionals
                in the [industry/field]. I look forward to sharing insights and
                learning from each other. If there's anything I can assist with,
                feel free to reach out.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4 justify-between">
            <button className="w-full bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white rounded-full">
              Call Now
            </button>
            <button className="w-full bg-white border border-gray-300 text-black rounded-full flex items-center justify-center gap-2  py-[0.5rem]">
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversityRightLayoutCard;
