import React from "react";
import JhonSmith from "../../assets/CoursePage/JhonSmith.png";
import Phone from "../../../svg/Phone";
const UniversityRightLayoutCard = () => {
  return (
    <>
      <div className="container mt-[10%] mb-[10%]">
        <div className="bg-white  rounded-3xl p-6 w-full">
          <div className="w-full flex md:justify-start justify-center">
            {" "}
            <div className="inline-flex  mt-4 bg-[#F8F8F8]   font-sans font-medium text-[1rem] leading-7 px-3 py-1 rounded-full">
              Dedicated Counsellor
            </div>
          </div>

          <div className="flex lg:flex-row flex-col md:items-start items-center mt-2 md:mt-[8%]">
            <img
              src={JhonSmith}
              alt="Profile"
              className="w-[4rem] h-[4rem] rounded-full mr-4 mt-[3%] mb-[3%]"
            />
            <div className=" md:mt-[5%] md:text-start text-center mb-[5%]">
              <div className="font-sans font-semibold text-2xl leading-7 text-black">
                Jhon Smith
              </div>
              <p className="font-sans text-[#595959] font-medium text-[.9rem] mt-2">
              Thanks for connecting! I’m excited to connect with professionals in the [industry/field]. I look forward to sharing insights and learning from each other. If there's anything I can assist with, feel free to reach out. Thanks for connecting! I’m excited to connect with professionals in the [industry/field]. I look forward to sharing insights and learning from each other. If there's anything I can assist with, feel free to reach out.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4 justify-between">
            <button className="w-full bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white font-medium text-sm rounded-full">
              Call Now
            </button>
            <button className="w-full bg-white border-[1.5px] font-medium text-sm border-black text-black rounded-full flex items-center justify-center gap-2  py-[0.5rem]">
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversityRightLayoutCard;
