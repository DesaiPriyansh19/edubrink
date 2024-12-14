import React, { useEffect, useState } from "react";

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
    <div className="flex flex-col lg:flex-row items-center justify-between w-full px-6 lg:px-20 py-10 space-y-10 lg:space-y-0">
      {/* Left: Card Section */}
      <div className="relative w-full lg:w-2/4 h-auto flex">
        {/* Background Cards */}
        <div className="absolute top-0 left-[-6%] sm:left-6 lg:left-10 bg-white shadow-md rounded-lg p-6 transform -translate-y-10 scale-95 z-0">
          <div className="font-bold text-gray-800">
            MSc Advanced Computer Science
          </div>
          <div className="text-sm text-gray-500">
            TH KÖLN - Cologne University of Applied Science
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-semibold">Tuition Fees</p>
              <p className="text-gray-900">€3,867.00 / Year</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Language</p>
              <p className="text-gray-900">English</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Deadline</p>
              <p className="text-gray-900">31 July 2025</p>
            </div>
          </div>
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
          className="absolute top-0 left-3 lg:left-16 mt-[4%] mb-[4%] bg-white shadow-lg rounded-lg p-6 transform -translate-y-5 scale-95 z-10 "
          style={
            isSmallDevice
              ? { width: "87%", marginTop: "8%", marginBottom: "8%" }
              : undefined
          }
        >
          <div className="font-bold text-gray-800">
            MSc Advanced Computer Science
          </div>
          <div className="text-sm text-gray-500">
            TH KÖLN - Cologne University of Applied Science
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-semibold">Tuition Fees</p>
              <p className="text-gray-900">€3,867.00 / Year</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Language</p>
              <p className="text-gray-900">English</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Deadline</p>
              <p className="text-gray-900">31 July 2025</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="px-6 py-3 text-black bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
              Apply Now
            </button>
            <button className="border border-black rounded-[1.5rem] px-6 py-3">
              Learn More
            </button>
          </div>
        </div>

        {/* Foreground Card */}
        <div
          className="relative bg-white shadow-2xl rounded-lg p-6 z-20 left-[16%] mt-[8%] mb-[8%] "
          style={
            isSmallDevice
              ? { width: "88%", marginTop: "16%", marginBottom: "16%" }
              : undefined
          }
        >
          <div className="font-bold text-gray-800 text-lg">
            MSc Advanced Computer Science
          </div>
          <div className="text-sm text-gray-500">
            TH KÖLN - Cologne University of Applied Science
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-semibold">Tuition Fees</p>
              <p className="text-gray-900">€3,867.00 / Year</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Language</p>
              <p className="text-gray-900">English</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Deadline</p>
              <p className="text-gray-900">31 July 2025</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="px-6 py-3 text-black bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
              Apply Now
            </button>
            <button className="border border-black rounded-[1.5rem] px-6 py-3">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Right: Text Section */}
      <div className="w-full lg:w-2/4">
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
  );
};

export default AboutStudentPlacement;
