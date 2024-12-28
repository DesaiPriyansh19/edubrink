import React, { useEffect, useState } from "react";
import Studentone from "../../assets/AboutpageImage/Studentone.png";
import StudentTwo from "../../assets/AboutpageImage/StudentTwo.png";
import StudentThree from "../../assets/AboutpageImage/StudentThree.png";
const AboutStudentPlacement = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 640); // Small devices are < 640px
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
      {/* Left: Card Section */}
      <div className="col-span-12 md:col-span-7 space-y-6">
        <div className="relative w-full lg:w-2/4 h-auto flex">
          {/* Background Cards */}
          <div className="absolute top-0 sm:left-6 lg:left-[1.5rem] bg-white shadow-md rounded-lg py-3 px-5 transform -translate-y-10 scale-95 z-0 w-[26rem] mt-[-8%] mb-[8%]">
            <div className="flex items-center gap-2">
              <img src={StudentThree} alt="" className="h-auto w-auto" />
              <div>
                <div className="font-semibold text-black text-[1rem]">
                  MSc Advanced Computer Science
                </div>
                <div className="text-sm text-black">
                 TH KHONE - Cologne University of Applied Science
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-black font-normal text-sm">Tuition Fees</p>
                <p className="text-black">€3,867.00 / Year</p>
              </div>
              <div>
                <p className="text-black font-semibold">Language</p>
                <p className="text-black">English</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Deadline</p>
                <p className="text-gray-900">31 July 2025</p>
              </div>
            </div>

            <div className="border-t-[1px] border-gray-300  mt-2"></div>

            <div className="mt-6 flex justify-between">

              <button className="w-1/2 px-1 py-2 text-sm text-white bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
                Apply Now
              </button>
              <button className=" w-1/2 px-1 py-2 text-sm border border-black rounded-[1.5rem] ">
                Learn More
              </button>
            </div>

          </div>

          <div
            className="absolute top-0 left-3 lg:left-16 mt-[10%] mb-[6%] bg-white shadow-lg rounded-lg py-3 px-5 transform -translate-y-5 scale-95 z-10 w-[27rem]"
            style={
              isSmallDevice
                ? { width: "87%", marginTop: "8%", marginBottom: "8%" }
                : undefined
            }
          >
            <div className="flex items-center gap-2">
              <img src={StudentTwo} alt="" className="h-auto w-auto" />
              <div>
                <div className="font-semibold text-black text-[1rem]">
                  MSc Advanced Computer Science
                </div>
                <div className="text-sm text-black">
                 TH KHONE - Cologne University of Applied Science
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-black font-normal text-sm">Tuition Fees</p>
                <p className="text-black">€3,867.00 / Year</p>
              </div>
              <div>
                <p className="text-black font-normal text-sm">Language</p>
                <p className="text-black">English</p>
              </div>
              <div>
                <p className="text-black font-normal text-sm">Deadline</p>
                <p className="text-black">31 July 2025</p>
              </div>
            </div>
            <div className="border-t-[1px] border-gray-300  mt-2"></div>
            <div className="mt-6 flex justify-between">
              <button className="w-[40%] px-1 py-2 text-sm text-white bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
                Apply Now
              </button>
              <button className="w-[40%] px-1 py-2 text-sm border border-black rounded-[1.5rem]  text-black">
                Learn More
              </button>
            </div>
          </div>

          <div  className="absolute top-0 left-3 lg:left-32 mt-[29%] mb-[6%] bg-white shadow-lg rounded-lg py-2 px-5 transform -translate-y-5 scale-95 z-10 w-[27rem]"
            style={
              isSmallDevice
                ? { width: "87%", marginTop: "8%", marginBottom: "8%" }
                : undefined
            }
          >
            <div className="flex items-center gap-2">
              <img src={StudentThree} alt="" className="h-auto w-auto" />
              <div>
                <div className="font-semibold text-black text-[1rem]">
                  MSc Advanced Computer Science
                </div>
                <div className="text-sm text-black">
                 TH KHONE - Cologne University of Applied Science
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-black font-medium text-[.8rem]">Tuition Fees</p>
                <p className="text-black font-medium text-[.8rem]">€3,867.00 / Year</p>
              </div>
              <div>
                <p className="text-black font-medium text-[.8rem]">Language</p>
                <p className="text-black font-medium  text-[.8rem]">English</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium  text-[.8rem]">Deadline</p>
                <p className="text-gray-900 font-medium text-[.8rem]">31 July 2025</p>
              </div>
            </div>

            <div className="border-t-[1px] border-gray-300 mt-2"></div>

            <div className="mt-6 flex justify-between">

              <button className="w-[45%] px-1 py-2 text-sm text-white bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
                Apply Now
              </button>
              <button className="w-[45%]  text-sm border border-black rounded-[1.5rem] px-1 py-2">
                Learn More
              </button>
            </div>

          </div>
         

        </div>
      </div>
      {/* Right: Text Section */}
      <div className="col-span-12 md:col-span-5 space-y-6">
        <div className="w-full">
          <h2 className="text-2xl lg:text-4xl font-semibold text-gray-900">
            We make more than 20k+ successful students placement in the world
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Investigate courses, universities and their locations. Look upon the
            teaching modules, research opportunities, campus life and employment
            prospects before you narrow down your selection.
          </p>
          <button className="mt-6  text-black bg-white px-6 py-3 rounded-3xl ">
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutStudentPlacement;
