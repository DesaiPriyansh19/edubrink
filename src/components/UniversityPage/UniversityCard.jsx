import React from "react";

const UniversityCard = () => {
  return (
    <div className="container max-auto mt-[8%] mb-[8%]">
      <div className="flex flex-col ">
        <div className="flex flex-wrap gap-6 ml-[2%] mr-[2%]">
          <div className="w-[26rem] h-auto p-6 bg-white rounded-3xl">
            <h2 className="text-[1.2rem] font-semibold mb-4">
              MSc Advanced Computer Science
            </h2>
            <div className="grid grid-cols-2 gap-[8px] text-sm">
              <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-tl-[1.2rem]">
                <p className="font-semibold">Tuition Fees</p>
                <p>$3,857.00/Year</p>
              </div>
              <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-tr-[1.2rem]">
                <p className="font-semibold ">Language</p>
                <p>English</p>
              </div>
              <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-bl-[1.2rem]">
                <p className="font-semibold">Deadline</p>
                <p>31 July 2025</p>
              </div>
              <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-br-[1.2rem]">
                <p className="font-semibold">Course Level</p>
                <p>Graduate</p>
              </div>
            </div>
            <div className="flex mt-6 space-x-4">
              <button className="flex-1 py-2 text-white bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-full">
                Apply Now
              </button>

              <button className="flex-1 py-2  border-2 border-black rounded-full">
                Learn More
              </button>
            </div>
          </div>

          <div className="w-[26rem] h-auto p-6 bg-white rounded-3xl">
            <h2 className="text-[1.2rem] font-semibold mb-4">
              MSc Advanced Computer Science
            </h2>
            <div className="grid grid-cols-2 gap-[8px] text-sm">
              <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-tl-[1.2rem]">
                <p className="font-semibold">Tuition Fees</p>
                <p>$3,857.00/Year</p>
              </div>
              <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-tr-[1.2rem]">
                <p className="font-semibold ">Language</p>
                <p>English</p>
              </div>
              <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-bl-[1.2rem]">
                <p className="font-semibold">Deadline</p>
                <p>31 July 2025</p>
              </div>
              <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-br-[1.2rem]">
                <p className="font-semibold">Course Level</p>
                <p>Graduate</p>
              </div>
            </div>
            <div className="flex mt-6 space-x-4">
              <button className="flex-1 py-2 text-white bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-full">
                Apply Now
              </button>
              <button className="flex-1 py-2 border-2 border-black rounded-full">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
