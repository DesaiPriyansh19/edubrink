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
          <div className="absolute top-0 sm:left-6 lg:left-[1.5rem] bg-white shadow-md rounded-lg p-6 transform -translate-y-10 scale-95 z-0 w-[26rem] mt-[-8%] mb-[8%]">
            <div className="flex items-center gap-2">
              <img src={StudentThree} alt="" className="h-auto w-auto" />
              <div>
                <div className="font-bold text-black text-lg">
                  MSc Advanced Computer Science
                </div>
                <div className="text-sm text-black">
                  TH KÖLN - Cologne University of Applied Science
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-black font-semibold">Tuition Fees</p>
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
            <div className="border-t-2 border-black mt-2"></div>
            <div className="mt-6 flex justify-between">
              <button className="px-6 py-3 text-black bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
                Apply Now
              </button>
              <button className="border border-black rounded-[1.5rem] px-6 py-3">
                Learn More
              </button>
            </div>
          </div>
          <div
            className="absolute top-0 left-3 lg:left-16 mt-[6%] mb-[6%] bg-white shadow-lg rounded-lg p-6 transform -translate-y-5 scale-95 z-10 w-[27rem]"
            style={
              isSmallDevice
                ? { width: "87%", marginTop: "8%", marginBottom: "8%" }
                : undefined
            }
          >
            <div className="flex items-center gap-2">
              <img src={StudentTwo} alt="" className="h-auto w-auto" />
              <div>
                <div className="font-bold text-black text-lg">
                  MSc Advanced Computer Science
                </div>
                <div className="text-sm text-black">
                  TH KÖLN - Cologne University of Applied Science
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-black font-semibold">Tuition Fees</p>
                <p className="text-black">€3,867.00 / Year</p>
              </div>
              <div>
                <p className="text-black font-semibold">Language</p>
                <p className="text-black">English</p>
              </div>
              <div>
                <p className="text-black font-semibold">Deadline</p>
                <p className="text-black">31 July 2025</p>
              </div>
            </div>
            <div className="border-t-2 border-black mt-2"></div>
            <div className="mt-6 flex justify-between">
              <button className="px-6 py-3 text-black bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
                Apply Now
              </button>
              <button className="border border-black rounded-[1.5rem] px-6 py-3 text-black">
                Learn More
              </button>
            </div>
          </div>

          {/* Foreground Card */}
          <div
            className="relative bg-white shadow-2xl rounded-lg p-6 z-20 left-[26%] mt-[20%] mb-[20%] w-[27rem]"
            style={
              isSmallDevice
                ? { width: "88%", marginTop: "16%", marginBottom: "16%" }
                : undefined
            }
          >
            <div className="flex items-center gap-2">
              <img src={Studentone} alt="" className="h-auto w-auto" />
              <div>
                <div className="font-bold text-black text-lg">
                  MSc Advanced Computer Science
                </div>
                <div className="text-sm text-black">
                  TH KÖLN - Cologne University of Applied Science
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-black font-semibold">Tuition Fees</p>
                <p className="text-black">€3,867.00 / Year</p>
              </div>
              <div>
                <p className="text-black font-semibold">Language</p>
                <p className="text-black">English</p>
              </div>
              <div>
                <p className="text-black font-semibold">Deadline</p>
                <p className="text-black">31 July 2025</p>
              </div>
            </div>
            <div className="border-t-2 border-black mt-2"></div>
            <div className="mt-6 flex justify-between">
              <button className="px-6 py-3 text-black bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
                Apply Now
              </button>
              <button className="border border-black rounded-[1.5rem] px-6 py-3 text-black">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Right: Text Section */}
      <div className="col-span-12 md:col-span-5 space-y-6">
        <div className="w-full">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900">
            We make more than 20k+ successful students placement in the world
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Investigate courses, universities and their locations. Look upon the
            teaching modules, research opportunities, campus life and employment
            prospects before you narrow down your selection.
          </p>
          <button className="mt-6 bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800">
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutStudentPlacement;
